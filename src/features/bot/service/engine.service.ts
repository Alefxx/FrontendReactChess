// src/features/bot/service/engine.service.ts

/**
 * Gerencia a comunicação com o motor Stockfish utilizando Web Workers.
 * O processamento do motor é executado em uma thread separada para não impactar a performance da UI.
 */
export class EngineService {
  private worker: Worker | null = null;
  private isReady = false;

  constructor() {
    this.init();
  }

  /**
   * Inicializa o Web Worker e configura o protocolo UCI (Universal Chess Interface).
   */
  private init() {
    if (typeof Worker !== 'undefined') {
      // O arquivo stockfish.js deve estar acessível na pasta /public
      this.worker = new Worker('/stockfish.js');
      
      this.worker.onmessage = (event) => {
        // 'uciok' indica que o motor carregou com sucesso e aceita comandos
        if (event.data === 'uciok') {
          this.isReady = true;
          this.worker?.postMessage('isready');
        }
      };

      // Inicia o handshake do protocolo UCI
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
    return new Promise((resolve) => {
      if (!this.worker) return resolve("");

      /**
       * Escuta as mensagens do Worker até encontrar o padrão 'bestmove'.
       */
      const onMessage = (event: MessageEvent) => {
        const linha = event.data;
        if (linha.startsWith('bestmove')) {
          const move = linha.split(' ')[1];
          // Remove o listener após obter a resposta para evitar vazamento de memória
          this.worker?.removeEventListener('message', onMessage);
          resolve(move);
        }
      };

      this.worker.addEventListener('message', onMessage);
      
      // Aplica as configurações de força e dificuldade
      this.worker.postMessage(`setoption name Skill Level value ${skillLevel}`);
      
      // Define a posição no tabuleiro (converte 'start' para a FEN inicial padrão)
      const posicaoFen = fen === 'start' 
        ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' 
        : fen;
        
      this.worker.postMessage(`position fen ${posicaoFen}`);
      
      // Inicia o cálculo do movimento
      this.worker.postMessage(`go depth ${depth}`);
    });
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

// Exporta uma única instância para ser utilizada em toda a aplicação (Singleton)
export const engineService = new EngineService();
