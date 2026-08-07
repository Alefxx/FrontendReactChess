// src/features/match/hooks/useStockfishMatch.ts
import { useState, useEffect } from 'react';
import { engineService } from '@/features/stockfish/bot/service/engine.service';
import { matchService } from '@/features/match/service/match.service';
import { Bot } from '@/features/botselection/service/bot.service';

interface UseStockfishProps {
  partidaId: string;
  gameFen: string;
  isMinhaVez: boolean;
  minhaCor: 'branca' | 'preta';
  isGameOver: boolean;
  isPendingPromotion: boolean;
  botOponente?: Bot;
  
  // ATUALIZADO: Adicionamos o moveRealizado para repassar a origem e destino da jogada
  onBotMoveSuccess: (response: any, moveRealizado: { origem: string, destino: string }) => void; 
}

/**
 * Hook responsável por monitorar o turno do bot e executar sua lógica de decisão.
 */
export function useStockfishMatch({
  partidaId,
  gameFen,
  isMinhaVez,
  minhaCor,
  isGameOver,
  isPendingPromotion,
  botOponente,
  onBotMoveSuccess
}: UseStockfishProps) {
  
  // Estado para evitar requisições duplicadas enquanto o motor processa o lance
  const [isBotThinking, setIsBotThinking] = useState(false);

  useEffect(() => {
    const fazerJogadaBot = async () => {
      /**
       * Condições de execução: 
       * 1. Não ser a vez do humano.
       * 2. Existir um bot configurado.
       * 3. Bot não estar processando.
       * 4. O jogo estar ativo (sem mate ou promoção pendente).
       */
      const podeJogar = !isMinhaVez && botOponente && !isBotThinking && 
                        !gameFen.includes('game over') && !isGameOver && !isPendingPromotion;

      if (podeJogar) {
        setIsBotThinking(true); 
        
        try {
          // =========================================================
          // DELAY ADICIONADO: Aguarda 1 segundo antes de processar
          // Simula o tempo de "raciocínio" para não ser instantâneo
          // =========================================================
          await new Promise(resolve => setTimeout(resolve, 1000));

          const config = botOponente.configStockfish;
          // Solicita o melhor lance para o motor Stockfish
          const bestMove = await engineService.getBestMove(gameFen, config.depth, config.skillLevel); 
          
          if (bestMove) {
            // Decompõe a string do lance (ex: "e2e4" ou "e7e8q")
            const origem = bestMove.substring(0, 2);
            const destino = bestMove.substring(2, 4);
            
            // Verifica se há um caractere de promoção no final da string
            const pecaPromocao = bestMove.length === 5 ? bestMove[4] : undefined; 
            const corBot = minhaCor === 'branca' ? 'preta' : 'branca';

            // Envia o lance calculado para o servidor validar e persistir
            const payloadBot: any = { origem, destino, corDoTurnoAtual: corBot };
            if (pecaPromocao) payloadBot.pecaPromovida = pecaPromocao;

            const response = await matchService.executarMovimento(partidaId, payloadBot);

            if (response.sucesso && response.fen) {
              // ATUALIZADO: Envia a origem e destino extraídos do lance do bot (bestMove)
              onBotMoveSuccess(response, { origem, destino });
            }
          }
        } catch (error) {
          console.error("[BOT] Erro ao processar turno da IA:", error);
        } finally {
          setIsBotThinking(false); 
        }
      }
    };

    fazerJogadaBot();
  }, [gameFen, isMinhaVez, minhaCor, partidaId, botOponente, isBotThinking, isGameOver, isPendingPromotion, onBotMoveSuccess]);

  return { isBotThinking };
}
