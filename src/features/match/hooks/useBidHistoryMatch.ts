// src/features/match/hooks/useBidHistoryMatch.ts
import { useState } from 'react';

/**
 * Hook para gerenciar a lista de movimentos realizados (Histórico PGN).
 */
export function useBidHistoryMatch() {
  // Lista de strings contendo a notação dos lances realizados
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  /**
   * Atualiza o histórico de jogadas sempre que o servidor sincronizar o PGN oficial.
   */
  const atualizarHistorico = (novoPgn?: string[]) => {
    if (novoPgn) {
      setMoveHistory(novoPgn);
    }
  };

  return {
    moveHistory,
    atualizarHistorico
  };
}
