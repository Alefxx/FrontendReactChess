// src/features/stockfish/analysis/service/opening.service.ts

export interface ChessOpening {
  eco: string;
  name: string;
  moves: string;
  aliases?: Record<string, string>;
}

class OpeningService {
  private dictionary: Record<string, ChessOpening> | null = null;
  private dictionaryByPosition: Map<string, ChessOpening> | null = null;
  private loadingPromise: Promise<void> | null = null;
  // FEN base da posição inicial
  private readonly START_FEN_BASE = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

  // Arquivos a serem carregados
  private readonly OPENING_FILES = [
    '/data/ecoA.json',
    '/data/ecoB.json'
    // Você pode facilmente adicionar ecoC, ecoD, ecoE aqui depois
  ];

  // Deve ser chamado apenas uma vez, idealmente quando o componente de análise montar
  async loadOpenings(): Promise<void> {
    if (this.dictionary) return;
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = (async () => {
      // Dispara o fetch para todos os arquivos simultaneamente
      const responses = await Promise.all(
        this.OPENING_FILES.map(file => fetch(file))
      );

      // Verifica se houve erro em algum dos arquivos
      for (const [index, response] of responses.entries()) {
        if (!response.ok) {
          throw new Error(`Não foi possível carregar o livro de aberturas ${this.OPENING_FILES[index]} (${response.status}).`);
        }
      }

      // Converte todos os arquivos para JSON simultaneamente
      const dictionaries = await Promise.all(
        responses.map(res => res.json() as Promise<Record<string, ChessOpening>>)
      );

      const mergedDictionary: Record<string, ChessOpening> = {};
      const dictionaryByPosition = new Map<string, ChessOpening>();

      // Faz o merge (mesclagem) de todos os dicionários carregados
      dictionaries.forEach(dict => {
        Object.assign(mergedDictionary, dict);
        
        Object.entries(dict).forEach(([fen, opening]) => {
          dictionaryByPosition.set(this.normalizeFen(fen), opening);
        });
      });

      this.dictionary = mergedDictionary;
      this.dictionaryByPosition = dictionaryByPosition;
      console.info(`[OpeningService] ${dictionaryByPosition.size} posições de abertura carregadas a partir de ${this.OPENING_FILES.length} arquivos.`);
    })().catch((error) => {
      this.loadingPromise = null;
      console.error('[OpeningService] Erro ao carregar os livros de abertura:', error);
      throw error;
    });

    return this.loadingPromise;
  }

  // Busca O(1) diretamente pela string FEN
  getOpening(fen: string): ChessOpening | null {
    if (!this.dictionary) return null;

    // Tenta a FEN exata primeiro (incluindo relógios de jogada).
    const exactMatch = this.dictionary[fen];
    if (exactMatch) return exactMatch;

    return this.dictionaryByPosition?.get(this.normalizeFen(fen)) ?? null;
  }

  isStartPosition(fen: string): boolean {
    return fen.startsWith(this.START_FEN_BASE);
  }

  private normalizeFen(fen: string): string {
    // Os relógios não alteram a posição nem a pertença ao livro de aberturas.
    return fen.trim().split(/\s+/).slice(0, 4).join(' ');
  }
}

export const openingService = new OpeningService();
