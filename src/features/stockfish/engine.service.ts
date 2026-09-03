const STOCKFISH_WORKER_URL = '/stockfish-18-lite-single.js';
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const HASH_SIZE_MB = 16;
const IDLE_TIMEOUT_MS = 30_000;
const STOP_TIMEOUT_MS = 2_000;

export const STOCKFISH_VERSION = 'Stockfish 18 Lite WASM (single-thread)';

export interface StockfishSearchLimit {
  depth?: number;
  nodes?: number;
  moveTimeMs?: number;
}

interface StockfishSearchOptions {
  fen: string;
  limit: StockfishSearchLimit;
  skillLevel?: number;
  timeoutMs?: number;
  onInfo?: (line: string) => void;
}

interface SearchRequest extends StockfishSearchOptions {
  id: number;
  settled: boolean;
  cancelled: boolean;
  resolve: (bestMove: string) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout> | null;
}

export interface StockfishSearchHandle {
  id: number;
  result: Promise<string>;
}

const abortError = () => new DOMException('Análise substituída por uma solicitação mais recente.', 'AbortError');

export function isStockfishCancellation(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function clampInteger(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function normalizeFen(fen: string): string {
  const normalized = fen === 'start' ? START_FEN : fen.trim();
  if (!normalized || /[\r\n]/.test(normalized) || normalized.split(/\s+/).length < 4) {
    throw new Error('FEN inválida para análise.');
  }
  return normalized;
}

function buildGoCommand(limit: StockfishSearchLimit): string {
  const commands: string[] = ['go'];
  if (limit.depth !== undefined) commands.push('depth', String(clampInteger(limit.depth, 1, 30)));
  if (limit.nodes !== undefined) commands.push('nodes', String(clampInteger(limit.nodes, 1_000, 5_000_000)));
  if (limit.moveTimeMs !== undefined) commands.push('movetime', String(clampInteger(limit.moveTimeMs, 50, 30_000)));
  if (commands.length === 1) throw new Error('A análise precisa de um limite de busca.');
  return commands.join(' ');
}

class StockfishEngine {
  private worker: Worker | null = null;
  private ready = false;
  private initialization: Promise<void> | null = null;
  private resolveInitialization: (() => void) | null = null;
  private rejectInitialization: ((error: Error) => void) | null = null;
  private initializationTimer: ReturnType<typeof setTimeout> | null = null;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private active: SearchRequest | null = null;
  private pending: SearchRequest | null = null;
  private nextId = 0;
  private configuredSkillLevel = 20;

  search(options: StockfishSearchOptions): StockfishSearchHandle {
    const id = ++this.nextId;
    let resolve!: (bestMove: string) => void;
    let reject!: (error: Error) => void;
    const result = new Promise<string>((resolvePromise, rejectPromise) => {
      resolve = resolvePromise;
      reject = rejectPromise;
    });

    let request: SearchRequest;
    try {
      request = {
        ...options,
        fen: normalizeFen(options.fen),
        id,
        resolve,
        reject,
        settled: false,
        cancelled: false,
        timer: null,
      };
      buildGoCommand(request.limit);
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
      return { id, result };
    }

    this.clearIdleTimer();
    this.cancelPending();
    this.pending = request;
    this.cancelActive();

    void this.ensureReady()
      .then(() => this.pump())
      .catch((error: unknown) => this.failPending(error));

    return { id, result };
  }

  cancel(id: number): void {
    if (this.pending?.id === id) {
      this.settle(this.pending, abortError());
      this.pending = null;
    }

    if (this.active?.id === id) this.cancelActive();
    if (!this.active && !this.pending) this.scheduleIdleTermination();
  }

  private ensureReady(): Promise<void> {
    if (this.ready && this.worker) return Promise.resolve();
    if (this.initialization) return this.initialization;
    if (typeof Worker === 'undefined') return Promise.reject(new Error('Web Worker indisponível neste navegador.'));

    const initialization = new Promise<void>((resolve, reject) => {
      this.resolveInitialization = resolve;
      this.rejectInitialization = reject;
    });
    this.initialization = initialization;

    try {
      this.worker = new Worker(STOCKFISH_WORKER_URL);
      this.worker.onmessage = (event: MessageEvent<unknown>) => this.handleLine(String(event.data));
      this.worker.onerror = (event) => this.handleFailure(new Error(event.message || 'Falha ao carregar o Stockfish.'));
      this.initializationTimer = setTimeout(
        () => this.handleFailure(new Error('Tempo limite ao iniciar o Stockfish.')),
        15_000,
      );
      this.worker.postMessage('uci');
    } catch (error) {
      this.handleFailure(error instanceof Error ? error : new Error(String(error)));
    }

    return initialization;
  }

  private handleLine(line: string): void {
    if (line === 'uciok') {
      this.worker?.postMessage(`setoption name Hash value ${HASH_SIZE_MB}`);
      this.worker?.postMessage('setoption name MultiPV value 1');
      this.worker?.postMessage('setoption name UCI_ShowWDL value false');
      this.worker?.postMessage('isready');
      return;
    }

    if (line === 'readyok' && this.resolveInitialization) {
      if (this.initializationTimer) clearTimeout(this.initializationTimer);
      this.initializationTimer = null;
      this.ready = true;
      const resolve = this.resolveInitialization;
      this.resolveInitialization = null;
      this.rejectInitialization = null;
      resolve();
      this.pump();
      return;
    }

    const request = this.active;
    if (!request) return;

    if (!request.cancelled && line.startsWith('info ')) request.onInfo?.(line);

    if (line.startsWith('bestmove')) {
      if (request.timer) clearTimeout(request.timer);
      request.timer = null;
      this.active = null;

      if (!request.settled) {
        const bestMove = line.match(/^bestmove\s+(\S+)/)?.[1] ?? '';
        this.settle(request, null, bestMove === '(none)' ? '' : bestMove);
      }

      this.pump();
    }
  }

  private pump(): void {
    if (!this.ready || !this.worker || this.active || !this.pending) {
      if (!this.active && !this.pending && this.ready) this.scheduleIdleTermination();
      return;
    }

    const request = this.pending;
    this.pending = null;
    this.active = request;

    const skillLevel = clampInteger(request.skillLevel ?? 20, 0, 20);
    if (skillLevel !== this.configuredSkillLevel) {
      this.worker.postMessage(`setoption name Skill Level value ${skillLevel}`);
      this.configuredSkillLevel = skillLevel;
    }

    this.worker.postMessage(`position fen ${request.fen}`);
    this.worker.postMessage(buildGoCommand(request.limit));
    request.timer = setTimeout(
      () => this.timeoutActive(request.id),
      request.timeoutMs ?? 12_000,
    );
  }

  private cancelPending(): void {
    if (!this.pending) return;
    this.settle(this.pending, abortError());
    this.pending = null;
  }

  private cancelActive(): void {
    const request = this.active;
    if (!request || request.cancelled) return;

    request.cancelled = true;
    if (request.timer) clearTimeout(request.timer);
    this.settle(request, abortError());
    this.worker?.postMessage('stop');
    request.timer = setTimeout(() => this.restartAfterStalledStop(request.id), STOP_TIMEOUT_MS);
  }

  private timeoutActive(id: number): void {
    if (this.active?.id !== id) return;
    this.settle(this.active, new Error('O Stockfish excedeu o tempo limite de análise.'));
    this.active = null;
    this.restartWorker();
  }

  private restartAfterStalledStop(id: number): void {
    if (this.active?.id !== id) return;
    this.active = null;
    this.restartWorker();
  }

  private restartWorker(): void {
    this.resetWorker();
    if (this.pending) {
      void this.ensureReady()
        .then(() => this.pump())
        .catch((error: unknown) => this.failPending(error));
    }
  }

  private handleFailure(error: Error): void {
    const rejectInitialization = this.rejectInitialization;
    this.resolveInitialization = null;
    this.rejectInitialization = null;
    rejectInitialization?.(error);

    if (this.active) this.settle(this.active, error);
    if (this.pending) this.settle(this.pending, error);
    this.active = null;
    this.pending = null;
    this.resetWorker();
  }

  private failPending(error: unknown): void {
    if (!this.pending) return;
    this.settle(this.pending, error instanceof Error ? error : new Error(String(error)));
    this.pending = null;
  }

  private settle(request: SearchRequest, error: Error | null, value = ''): void {
    if (request.timer) clearTimeout(request.timer);
    request.timer = null;
    if (request.settled) return;
    request.settled = true;
    if (error) request.reject(error);
    else request.resolve(value);
  }

  private scheduleIdleTermination(): void {
    if (this.idleTimer || !this.worker) return;
    this.idleTimer = setTimeout(() => {
      if (!this.active && !this.pending) this.resetWorker();
    }, IDLE_TIMEOUT_MS);
  }

  private clearIdleTimer(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = null;
  }

  private resetWorker(): void {
    this.clearIdleTimer();
    if (this.initializationTimer) clearTimeout(this.initializationTimer);
    if (this.active?.timer) clearTimeout(this.active.timer);
    this.initializationTimer = null;
    this.worker?.terminate();
    this.worker = null;
    this.ready = false;
    this.initialization = null;
    this.resolveInitialization = null;
    this.rejectInitialization = null;
    this.configuredSkillLevel = 20;
  }
}

export const stockfishEngine = new StockfishEngine();
