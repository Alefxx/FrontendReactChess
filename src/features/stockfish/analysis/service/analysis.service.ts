// src/features/stockfish/analysis/service/analysis.service.ts

export interface AnalisePosicao {
  tipo: 'cp' | 'mate'; // 'cp' = vantagem em peões, 'mate' = lances para o mate
  valorOriginal: number; // Valor bruto do Stockfish
  vantagemBrancas: number; // Valor normalizado (sempre positivo para brancas, negativo para pretas)
}

export class AnalysisService {
  // ATUALIZAÇÃO: Separação de instâncias para evitar conflitos de concorrência
  private workerStream: Worker | null = null; // Dedicado à EvalBar (Tempo Real)
  private workerSync: Worker | null = null;   // Dedicado à Fila de Classificação (Background)
  
  private isAnalyzingStream = false;
  private isAnalyzingSync = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof Worker !== 'undefined') {
      // Instancia o motor para a EvalBar
      this.workerStream = new Worker('/stockfish.js');
      this.workerStream.postMessage('uci');

      // Instancia um SEGUNDO motor, isolado, para o background
      this.workerSync = new Worker('/stockfish.js');
      this.workerSync.postMessage('uci');
    }
  }

  /**
   * Para APENAS a análise da EvalBar (Tempo Real)
   */
  public stopAnalysis() {
    if (this.isAnalyzingStream && this.workerStream) {
      this.workerStream.postMessage('stop');
      this.isAnalyzingStream = false;
    }
  }

  /**
   * NOVO: Para APENAS a análise da Fila (Síncrono/Background)
   */
  public stopSyncAnalysis() {
    if (this.isAnalyzingSync && this.workerSync) {
      this.workerSync.postMessage('stop');
      this.isAnalyzingSync = false;
    }
  }

  /**
   * 1. MÉTODO ORIGINAL (Tempo Real / Streaming)
   * Usado pela EvalBar. Atualiza o estado da UI a cada milissegundo.
   */
  public startAnalysis(
    fen: string, 
    depth: number = 15, 
    onUpdate: (analise: AnalisePosicao) => void
  ) {
    this.stopAnalysis(); 
    if (!this.workerStream) return;

    this.isAnalyzingStream = true;
    const isTurnoPretas = fen.includes(' b ');

    // Atrela o evento APENAS ao worker da EvalBar
    this.workerStream.onmessage = (event: MessageEvent) => {
      const linha = event.data;

      if (linha.startsWith('info') && linha.includes('score')) {
        const matchCp = linha.match(/score cp (-?\d+)/);
        const matchMate = linha.match(/score mate (-?\d+)/);

        if (matchCp) {
          const valorCp = parseInt(matchCp[1], 10) / 100; 
          const vantagemBrancas = isTurnoPretas ? -valorCp : valorCp;
          onUpdate({ tipo: 'cp', valorOriginal: valorCp, vantagemBrancas });
        } 
        else if (matchMate) {
          const lancesParaMate = parseInt(matchMate[1], 10);
          const vantagemBrancas = isTurnoPretas ? -lancesParaMate : lancesParaMate;
          onUpdate({ tipo: 'mate', valorOriginal: lancesParaMate, vantagemBrancas });
        }
      }
    };

    const posicaoFen = fen === 'start' 
      ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' 
      : fen;

    this.workerStream.postMessage(`position fen ${posicaoFen}`);
    this.workerStream.postMessage(`go depth ${depth}`);
  }

  /**
   * 2. NOVO MÉTODO (Fila / Síncrono)
   * Usado pelo gerenciador de fila (useMoveClassification). 
   */
  public avaliarFenSincrono(fen: string, depth: number = 15): Promise<AnalisePosicao> {
    return new Promise((resolve, reject) => {
      this.stopSyncAnalysis(); 
      if (!this.workerSync) return reject("Worker indisponível");

      this.isAnalyzingSync = true;
      const isTurnoPretas = fen.includes(' b ');
      let ultimaAnalise: AnalisePosicao | null = null;
      let timeoutFuga: ReturnType<typeof setTimeout> | null = null;

      const finalizar = () => {
        this.isAnalyzingSync = false;
        if (timeoutFuga) clearTimeout(timeoutFuga);
        
        if (ultimaAnalise) {
          resolve(ultimaAnalise);
        } else {
          resolve({ tipo: 'cp', valorOriginal: 0, vantagemBrancas: 0 });
        }
      };

      // Atrela o evento APENAS ao worker do background
      this.workerSync.onmessage = (event: MessageEvent) => {
        const linha = event.data;

        if (timeoutFuga) clearTimeout(timeoutFuga);
        timeoutFuga = setTimeout(finalizar, 1500);

        if (linha.startsWith('info') && linha.includes('score')) {
          const matchCp = linha.match(/score cp (-?\d+)/);
          const matchMate = linha.match(/score mate (-?\d+)/);

          if (matchCp) {
            const valorCp = parseInt(matchCp[1], 10) / 100; 
            ultimaAnalise = { tipo: 'cp', valorOriginal: valorCp, vantagemBrancas: isTurnoPretas ? -valorCp : valorCp };
          } 
          else if (matchMate) {
            const lancesParaMate = parseInt(matchMate[1], 10);
            ultimaAnalise = { tipo: 'mate', valorOriginal: lancesParaMate, vantagemBrancas: isTurnoPretas ? -lancesParaMate : lancesParaMate };
            
            if (lancesParaMate === 0) {
              finalizar();
              return; 
            }
          }
        }

        if (linha.startsWith('bestmove')) {
          finalizar();
        }
      };

      const posicaoFen = fen === 'start' 
        ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' 
        : fen;

      this.workerSync.postMessage(`position fen ${posicaoFen}`);
      this.workerSync.postMessage(`go depth ${depth}`);
      
      timeoutFuga = setTimeout(finalizar, 2000);
    });
  }

  public terminate() {
    if (this.workerStream) {
      this.workerStream.terminate();
      this.workerStream = null;
    }
    if (this.workerSync) {
      this.workerSync.terminate();
      this.workerSync = null;
    }
  }
}

export const analysisService = new AnalysisService();
