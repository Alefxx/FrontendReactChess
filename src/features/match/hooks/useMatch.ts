// src/features/match/hooks/useMatch.ts
import { matchService } from '@/features/match/service/match.service';
import { Bot } from '@/features/botselection/service/bot.service';

import { useBoardStateMatch } from './useBoardStateMatch';
import { useClockMatch } from './useClockMatch';
import { useGameRulesMatch } from './useGameRulesMatch';
import { useBidHistoryMatch } from './useBidHistoryMatch';
import { useStockfishMatch } from './useStockfishMatch';

/**
 * Hook Orquestrador: Coordena a comunicação entre sub-hooks e o backend.
 */
export function useMatch(partidaData: any, currentUser: any, botOponente?: Bot) {
  
  // Inicialização dos sub-hooks especializados
  const board = useBoardStateMatch(partidaData, currentUser);
  const clock = useClockMatch(partidaData);
  const rules = useGameRulesMatch();
  const history = useBidHistoryMatch();

  /**
   * Distribui a resposta autoritária do servidor para todos os sub-hooks.
   */
  const processarRespostaServidor = (response: any) => {
    clock.atualizarTempos(response.tempos);
    board.setGameFen(response.fen);
    history.atualizarHistorico(response.pgn);
    rules.atualizarRegras(response.statusPartida, response.detalhes);
  };

  // Instancia a lógica do bot passando os estados necessários para reação
  useStockfishMatch({
    partidaId: partidaData.partidaId,
    gameFen: board.gameFen,
    isMinhaVez: board.isMinhaVez,
    minhaCor: board.minhaCor,
    isGameOver: !!rules.gameOver,
    isPendingPromotion: !!rules.pendingPromotion,
    botOponente,
    onBotMoveSuccess: (response) => processarRespostaServidor(response)
  });

  /**
   * Lógica principal de movimentação para o jogador humano.
   */
  const realizarMovimento = async (origem: string, destino: string, pecaPromocao?: string) => {
    try {
      // Limpa seleções visuais antes de processar
      board.setPieceSquare('');
      board.setMoveSquares({});

      const payload: any = { origem, destino, corDoTurnoAtual: board.minhaCor };
      if (pecaPromocao) payload.promocao = pecaPromocao;

      const response = await matchService.executarMovimento(partidaData.partidaId, payload);

      if (response.sucesso) {
        // Caso o servidor identifique uma promoção necessária antes de concluir o lance
        if (response.requerPromocao) {
           rules.setPendingPromotion({ origem, destino });
           return false; // Retorna false para impedir que a peça "estilingue" visualmente no tabuleiro
        }

        if (response.fen) {
            // Se for a conclusão de uma promoção, limpa o estado de trava do modal
            if (pecaPromocao) rules.setPendingPromotion(null);
            
            processarRespostaServidor(response);
            return true; 
        }
      }

      console.warn(`[JOGADOR] Movimento rejeitado pelo servidor.`);
      return false; 
    } catch (error) {
      console.error("[JOGADOR] Falha de comunicação no movimento:", error);
      return false;
    }
  };

  /**
   * Handler para evento de Drag and Drop.
   */
  const onPieceDrop = async (sourceSquare: string, targetSquare: string) => {
    if (!board.isMinhaVez || rules.gameOver || rules.pendingPromotion) return false;
    return await realizarMovimento(sourceSquare, targetSquare);
  };

  /**
   * Handler para evento de clique em casas (seleção e destino).
   */
  const onSquareClick = async (square: string) => {
    if (!board.isMinhaVez || rules.gameOver || rules.pendingPromotion) return;

    // Cancela seleção se clicar na mesma casa
    if (board.pieceSquare === square) {
      board.setPieceSquare('');
      board.setMoveSquares({});
      return;
    }

    // Tenta mover se houver uma peça selecionada e o clique for em um destino válido
    if (board.pieceSquare && board.moveSquares[square]) {
      await realizarMovimento(board.pieceSquare, square);
      return;
    }

    // Busca lances válidos para a casa clicada
    const movimentos = await matchService.obterMovimentos(partidaData.partidaId, square, board.minhaCor);
    
    if (movimentos && movimentos.length > 0) {
      board.setPieceSquare(square);
      
      // Aplica destaques visuais para os movimentos possíveis
      const novosEstilos: Record<string, any> = { [square]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' } };
      movimentos.forEach((mov: any) => {
        const casaDestino = typeof mov === 'string' ? mov : (mov.destino || mov.casa || mov);
        novosEstilos[casaDestino] = {
          background: 'radial-gradient(circle, rgba(136,196,37,0.5) 25%, transparent 25%)',
          borderRadius: '50%'
        };
      });
      board.setMoveSquares(novosEstilos);
    } else {
      board.setPieceSquare('');
      board.setMoveSquares({});
    }
  };

  return {
    gameFen: board.gameFen,
    minhaCor: board.minhaCor,
    moveSquares: board.moveSquares,
    moveHistory: history.moveHistory,
    isCheck: rules.isCheck,
    gameOver: rules.gameOver,
    pendingPromotion: rules.pendingPromotion,
    setPendingPromotion: rules.setPendingPromotion,
    tempoBrancas: clock.tempoBrancas,
    tempoPretas: clock.tempoPretas,
    onPieceDrop,
    onSquareClick,
    realizarMovimento,
  };
}
