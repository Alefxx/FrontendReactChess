import { isStockfishCancellation, stockfishEngine } from '../../engine.service';
import { parseStockfishEvaluation, stabilizeEvaluation } from '../utils/evaluation.utils';
import type { AnalisePosicao } from '../utils/evaluation.utils';

export type { AnalisePosicao } from '../utils/evaluation.utils';

const ANALYSIS_DEPTH = 15;
const ANALYSIS_NODES = 120_000;
const MIN_STREAM_DEPTH = 8;
const UPDATE_INTERVAL_MS = 180;
const CACHE_LIMIT = 256;

class AnalysisService {
  private streamSearchId: number | null = null;
  private syncSearchId: number | null = null;
  private readonly cache = new Map<string, AnalisePosicao>();

  startAnalysis(fen: string, onUpdate: (analysis: AnalisePosicao) => void): () => void {
    this.stopAnalysis();

    const cached = this.cache.get(fen);
    if (cached) {
      let active = true;
      queueMicrotask(() => {
        if (active) onUpdate(cached);
      });
      return () => {
        active = false;
      };
    }

    const blackToMove = fen.includes(' b ');
    let active = true;
    let latest: AnalisePosicao | null = null;
    let displayed: AnalisePosicao | null = null;
    let pending: AnalisePosicao | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastUpdate = 0;

    const flush = (force = false) => {
      if (!active || !pending) return;
      const next = force ? pending : stabilizeEvaluation(displayed, pending);
      pending = null;
      if (
        displayed?.tipo === next.tipo
        && displayed.vantagemBrancas === next.vantagemBrancas
      ) return;
      displayed = next;
      lastUpdate = performance.now();
      onUpdate(next);
    };

    const publish = (analysis: AnalisePosicao) => {
      latest = analysis;
      if (analysis.tipo === 'cp' && analysis.profundidade < MIN_STREAM_DEPTH) return;
      pending = analysis;

      const important = analysis.tipo === 'mate'
        || (displayed?.tipo === 'cp' && Math.abs(analysis.vantagemBrancas - displayed.vantagemBrancas) >= 1.5);
      const delay = UPDATE_INTERVAL_MS - (performance.now() - lastUpdate);
      if (important || delay <= 0) {
        if (timer) clearTimeout(timer);
        timer = null;
        flush();
      } else if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          flush();
        }, delay);
      }
    };

    const search = stockfishEngine.search({
      fen,
      limit: { depth: ANALYSIS_DEPTH, nodes: ANALYSIS_NODES },
      timeoutMs: 10_000,
      onInfo: (line) => {
        const analysis = parseStockfishEvaluation(line, blackToMove);
        if (analysis) publish(analysis);
      },
    });
    this.streamSearchId = search.id;

    void search.result
      .then(() => {
        if (!active || !latest) return;
        this.remember(fen, latest);
        pending = latest;
        if (timer) clearTimeout(timer);
        timer = null;
        flush(true);
      })
      .catch((error: unknown) => {
        if (active && !isStockfishCancellation(error)) {
          console.error('[Stockfish] Falha na análise ao vivo:', error);
        }
      })
      .finally(() => {
        if (this.streamSearchId === search.id) this.streamSearchId = null;
      });

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      if (this.streamSearchId === search.id) this.streamSearchId = null;
      stockfishEngine.cancel(search.id);
    };
  }

  stopAnalysis(): void {
    if (this.streamSearchId === null) return;
    stockfishEngine.cancel(this.streamSearchId);
    this.streamSearchId = null;
  }

  async avaliarFenSincrono(fen: string): Promise<AnalisePosicao> {
    this.stopSyncAnalysis();
    const cached = this.cache.get(fen);
    if (cached) return cached;

    const blackToMove = fen.includes(' b ');
    let latest: AnalisePosicao | null = null;
    const search = stockfishEngine.search({
      fen,
      limit: { depth: ANALYSIS_DEPTH, nodes: ANALYSIS_NODES },
      timeoutMs: 10_000,
      onInfo: (line) => {
        latest = parseStockfishEvaluation(line, blackToMove) ?? latest;
      },
    });
    this.syncSearchId = search.id;

    try {
      await search.result;
      if (!latest) throw new Error('O Stockfish terminou sem fornecer uma avaliação.');
      this.remember(fen, latest);
      return latest;
    } finally {
      if (this.syncSearchId === search.id) this.syncSearchId = null;
    }
  }

  stopSyncAnalysis(): void {
    if (this.syncSearchId === null) return;
    stockfishEngine.cancel(this.syncSearchId);
    this.syncSearchId = null;
  }

  private remember(fen: string, analysis: AnalisePosicao): void {
    this.cache.delete(fen);
    this.cache.set(fen, analysis);
    if (this.cache.size <= CACHE_LIMIT) return;
    const oldest = this.cache.keys().next().value;
    if (oldest) this.cache.delete(oldest);
  }
}

export const analysisService = new AnalysisService();
