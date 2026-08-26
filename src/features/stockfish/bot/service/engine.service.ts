// src/features/bot/service/engine.service.ts

/**
 * Gerencia a comunicação com o motor Stockfish utilizando Web Workers.
 * O processamento do motor é executado em uma thread separada para não impactar a performance da UI.
 */
export class EngineService {
  private worker: Worker | null = null;
  private isThinking = false; // NOVO: Trava de concorrência

  constructor() {
    this.init();
  }

  /**
   * Inicializa o Web Worker e configura o protocolo UCI (Universal Chess Interface).
   */
  private init() {
    if (typeof Worker !== 'undefined') {
      // Cria a própria instância isolada do bot
      this.worker = new Worker('/stockfish.js');
      
      this.worker.onmessage = (event) => {
        if (event.data === 'uciok') {
          this.worker?.postMessage('isready');
        }
      };

      this.worker.postMessage('uci');
    }
  }

  /**
   * Solicita ao motor a melhor jogada para uma determinada posição.
   * @param fen String FEN que representa o estado atual do tabuleiro.
   * @param depth Profundidade de análise (quanto maior, mais forte e lento o bot).
   * @param skillLevel Nível de habilidade configurado no Stockfish (0 a 20).
   * @returns Uma Promise que resolve com a string do movimento (ex: "e2e4").
   */
  public getBestMove(fen: string, depth: number = 1, skillLevel: number = 0): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.worker) return reject("Worker do motor não inicializado.");
      
      // Bloqueia múltiplas requisições simultâneas (impede bug de duplo lance)
      if (this.isThinking) return reject("Motor já está calculando uma jogada.");

      this.isThinking = true;
      let timeoutSeguranca: ReturnType<typeof setTimeout>;

      // Função de limpeza para garantir que destravamos o serviço
      const finalizar = (move: string) => {
        this.isThinking = false;
        clearTimeout(timeoutSeguranca);
        resolve(move);
      };

      // Sobrescrevemos o listener exclusivo para esta jogada
      this.worker.onmessage = (event: MessageEvent) => {
        const linha = event.data;
        
        if (linha.startsWith('bestmove')) {
          const move = linha.split(' ')[1];
          finalizar(move || ""); 
        }
      };
      
      this.worker.postMessage(`setoption name Skill Level value ${skillLevel}`);
      
      const posicaoFen = fen === 'start' 
        ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' 
        : fen;
        
      this.worker.postMessage(`position fen ${posicaoFen}`);
      this.worker.postMessage(`go depth ${depth}`);

      // Timeout de Fuga: Se o Stockfish travar (ex: engine crash), liberamos a thread após 15s.
      timeoutSeguranca = setTimeout(() => {
        console.warn("[BOT] Timeout atingido no cálculo do motor, forçando parada.");
        this.worker?.postMessage('stop');
        finalizar(""); 
      }, 15000);
    });
  }

  /**
   * Força a parada imediata do processamento de uma jogada.
   */
  public stopThinking() {
    if (this.isThinking && this.worker) {
      this.worker.postMessage('stop');
      this.isThinking = false;
    }
  }

  /**
   * Encerra a instância do Worker e libera recursos do sistema.
   */
  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

export const engineService = new EngineService();
