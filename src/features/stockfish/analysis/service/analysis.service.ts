// src/features/stockfish/analysis/service/analysis.service.ts

export interface AnalisePosicao {
  tipo: 'cp' | 'mate'; // 'cp' = vantagem em peões, 'mate' = lances para o mate
  valorOriginal: number; // Valor bruto do Stockfish
  vantagemBrancas: number; // Valor normalizado (sempre positivo para brancas, negativo para pretas)
}

export class AnalysisService {
  private worker: Worker | null = null;
  private isAnalyzing = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker('/stockfish.js');
      this.worker.postMessage('uci');
    }
  }

  /**
   * Para a análise atual imediatamente.
   */
  public stopAnalysis() {
    if (this.isAnalyzing && this.worker) {
      this.worker.postMessage('stop');
      this.isAnalyzing = false;
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
    if (!this.worker) return;

    this.isAnalyzing = true;
    const isTurnoPretas = fen.includes(' b ');

    this.worker.onmessage = (event: MessageEvent) => {
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

    this.worker.postMessage(`position fen ${posicaoFen}`);
    this.worker.postMessage(`go depth ${depth}`);
  }

  /**
   * 2. NOVO MÉTODO (Fila / Síncrono)
   * Usado pelo gerenciador de fila (useMoveClassification). 
   * Devolve uma Promise que só resolve quando o Stockfish atinge o Depth final.
   * ATUALIZADO: Inclui "Timeout de Fuga" para evitar travamento em posições de Mate.
   */
  public avaliarFenSincrono(fen: string, depth: number = 15): Promise<AnalisePosicao> {
    return new Promise((resolve, reject) => {
      this.stopAnalysis(); 
      if (!this.worker) return reject("Worker indisponível");

      this.isAnalyzing = true;
      const isTurnoPretas = fen.includes(' b ');
      let ultimaAnalise: AnalisePosicao | null = null;
      let timeoutFuga: ReturnType<typeof setTimeout> | null = null;

      // Função interna para encerrar a Promise com segurança e limpar timeouts
      const finalizar = () => {
        this.isAnalyzing = false;
        if (timeoutFuga) clearTimeout(timeoutFuga);
        
        if (ultimaAnalise) {
          resolve(ultimaAnalise);
        } else {
          // Fallback preventivo (ex: posição de xeque-mate consumado onde não há lances)
          resolve({ tipo: 'cp', valorOriginal: 0, vantagemBrancas: 0 });
        }
      };

      // Sobrescreve o listener para esta requisição específica
      this.worker.onmessage = (event: MessageEvent) => {
        const linha = event.data;

        // Anti-Travamento: Se o motor ficar 1.5s sem enviar nada, forçamos a finalização.
        if (timeoutFuga) clearTimeout(timeoutFuga);
        timeoutFuga = setTimeout(finalizar, 1500);

        // Atualiza silenciosamente a última análise conhecida
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
            
            // SE for mate consumado (0 lances para mate no tabuleiro), não haverá 'bestmove', então encerramos imediatamente!
            if (lancesParaMate === 0) {
              finalizar();
              return; 
            }
          }
        }

        // Quando o motor terminar a profundidade (depth), ele enviará 'bestmove'
        if (linha.startsWith('bestmove')) {
          finalizar();
        }
      };

      const posicaoFen = fen === 'start' 
        ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' 
        : fen;

      this.worker.postMessage(`position fen ${posicaoFen}`);
      this.worker.postMessage(`go depth ${depth}`);
      
      // Timeout inicial pro caso extremo do motor não emitir nada após o comando (posição morta)
      timeoutFuga = setTimeout(finalizar, 2000);
    });
  }

  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

export const analysisService = new AnalysisService();
