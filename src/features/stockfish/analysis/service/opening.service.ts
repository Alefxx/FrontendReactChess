// src/features/stockfish/analysis/service/opening.service.ts

export interface ChessOpening {
  eco: string;
  name: string;
  moves: string;
  aliases?: Record<string, string>;
}

class OpeningService {
  private dictionary: Record<string, ChessOpening> | null = null;
  // FEN base da posição inicial
  private readonly START_FEN_BASE = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

  // Deve ser chamado apenas uma vez, idealmente quando o componente de análise montar
  async loadOpenings(): Promise<void> {
    if (this.dictionary) return;
    try {
      const response = await fetch('/data/ecoA.json');
      this.dictionary = await response.json();
      console.log("[OpeningService] Livro de aberturas carregado na memória.");
    } catch (error) {
      console.error("[OpeningService] Erro ao carregar o livro de aberturas:", error);
    }
  }

  // Busca O(1) diretamente pela string FEN
  getOpening(fen: string): ChessOpening | null {
    if (!this.dictionary) return null;

    // Tenta a FEN exata primeiro (incluindo relógios de jogada)
    const exactMatch = this.dictionary[fen];
    if (exactMatch) return exactMatch;

    // Fallback de segurança:
    // Às vezes o gerador de FEN da partida e do JSON divergem nos últimos 2 números (halfmove clock).
    // Aqui pegamos apenas as 4 primeiras partes (Posição, Cor, Roque e En Passant)
    const baseFen = fen.split(' ').slice(0, 4).join(' ');
    
    // Busca pela FEN base ignorando o relógio
    for (const key in this.dictionary) {
      if (key.startsWith(baseFen)) {
        return this.dictionary[key];
      }
    }

    return null;
  }

  isStartPosition(fen: string): boolean {
    return fen.startsWith(this.START_FEN_BASE);
  }
}

export const openingService = new OpeningService();
