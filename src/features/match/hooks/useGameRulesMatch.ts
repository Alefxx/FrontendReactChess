// src/features/match/hooks/useGameRulesMatch.ts
import { useState } from 'react';

/**
 * Representa o estado de finalização da partida.
 */
export interface GameOverState {
  vencedor: 'branca' | 'preta' | null;
  motivo: string;
}

/**
 * Armazena as coordenadas para um movimento de promoção de peão aguardando escolha.
 */
export interface PromotionState {
  origem: string;
  destino: string;
}

/**
 * Hook responsável pela gestão das regras e estados de interrupção da partida.
 */
export function useGameRulesMatch() {
  // Estado que indica se o Rei do jogador atual está em xeque
  const [isCheck, setIsCheck] = useState(false);
  
  // Estado que armazena os detalhes caso a partida tenha sido encerrada
  const [gameOver, setGameOver] = useState<GameOverState | null>(null);
  
  // Estado para controlar se existe uma promoção aguardando seleção de peça pelo usuário
  const [pendingPromotion, setPendingPromotion] = useState<PromotionState | null>(null);

  /**
   * Sincroniza os estados locais de regras com base nos dados processados pelo servidor.
   */
  const atualizarRegras = (statusPartida?: any, detalhes?: any) => {
    // 1. Atualização do status de Xeque (prioriza dados do status ou detalhes técnicos)
    if (statusPartida?.isXeque || detalhes?.isXeque) {
      setIsCheck(true);
    } else {
      setIsCheck(false);
    }

    // 2. Processamento do Fim de Jogo
    if (statusPartida?.fimDeJogo) {
      setGameOver((prev) => {
        // Evita sobrescrever o estado de fim de jogo se ele já foi definido (idempotência)
        if (prev) return prev;
        return {
          vencedor: statusPartida.vencedor,
          motivo: statusPartida.motivo || 'xeque-mate'
        };
      });
    }
  };

  return {
    isCheck,
    gameOver,
    setGameOver,
    pendingPromotion,
    setPendingPromotion,
    atualizarRegras
  };
}
