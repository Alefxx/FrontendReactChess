// src/features/match/hooks/useStockfishMatch.ts
import { useEffect, useRef } from 'react';
import { engineService } from '@/features/stockfish/bot/service/engine.service';
import { matchService } from '@/features/match/service/match.service';
import { Bot } from '@/features/botselection/service/bot.service';
import type { MoveResponse } from '@/features/match/service/match.service';

interface UseStockfishProps {
  partidaId: string;
  gameFen: string;
  isMinhaVez: boolean;
  isGameOver: boolean;
  isPendingPromotion: boolean;
  botOponente?: Bot;
  
  onBotMoveSuccess: (response: MoveResponse, moveRealizado: { origem: string, destino: string }) => void;
}

/**
 * Hook responsável por monitorar o turno do bot e executar sua lógica de decisão.
 */
export function useStockfishMatch({
  partidaId,
  gameFen,
  isMinhaVez,
  isGameOver,
  isPendingPromotion,
  botOponente,
  onBotMoveSuccess
}: UseStockfishProps) {
  const onSuccessRef = useRef(onBotMoveSuccess);

  useEffect(() => {
    onSuccessRef.current = onBotMoveSuccess;
  }, [onBotMoveSuccess]);

  useEffect(() => {
    const canMove = !isMinhaVez && botOponente
      && !gameFen.includes('game over') && !isGameOver && !isPendingPromotion;
    if (!canMove) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;

      try {
        const { depth, skillLevel } = botOponente.configStockfish;
        const bestMove = await engineService.getBestMove(gameFen, depth, skillLevel);
        if (cancelled || !/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(bestMove)) return;

        const origem = bestMove.substring(0, 2);
        const destino = bestMove.substring(2, 4);
        const promocao = bestMove.length === 5 ? bestMove[4] : undefined;
        const response = await matchService.executarMovimento(partidaId, {
          origem,
          destino,
          promocao,
        });

        if (!cancelled && response.sucesso && response.fen) {
          onSuccessRef.current(response, { origem, destino });
        }
      } catch (error) {
        if (!cancelled && !(error instanceof Error && error.name === 'AbortError')) {
          console.error('[BOT] Erro ao processar turno da IA:', error);
        }
      }
    }, 1_000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      engineService.stopThinking();
    };
  }, [gameFen, isMinhaVez, partidaId, botOponente, isGameOver, isPendingPromotion]);
}
