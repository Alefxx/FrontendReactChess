// src/features/match/hooks/useMatch.ts
import { useCallback } from 'react';
import { matchService } from '@/features/match/service/match.service';
import { Bot } from '@/features/botselection/service/bot.service';

import { useBoardStateMatch } from './useBoardStateMatch';
import { useClockMatch } from './useClockMatch';
import { useGameRulesMatch } from './useGameRulesMatch';
import { useBidHistoryMatch } from './useBidHistoryMatch';
import { useStockfishMatch } from './useStockfishMatch';
import { useAnalysis } from '@/features/stockfish/analysis/hooks/useAnalysis'; 
import { useMoveClassification } from '@/features/stockfish/classificationmoves/hooks/useMoveClassification';
import { useMatchAnalysisMemory } from './useMatchAnalysisMemory'; 

/**
 * Hook Orquestrador: Coordena a comunicação entre sub-hooks e o backend.
 */
export function useMatch(partidaData: any, currentUser: any, botOponente?: Bot, isEvalBarEnabled: boolean = false) {
  
  const board = useBoardStateMatch(partidaData, currentUser);
  const clock = useClockMatch(partidaData);
  const rules = useGameRulesMatch();
  const history = useBidHistoryMatch();

  // Delegação do armazenamento e processamento de estatísticas para o hook especializado
  const memory = useMatchAnalysisMemory({
    partidaId: partidaData?.partidaId,
    fenInicial: partidaData?.fen,
    minhaCor: board.minhaCor
  });

  // ATUALIZAÇÃO: Nova assinatura do useAnalysis interceptando a abertura
  const { evalData, currentOpening } = useAnalysis(board.gameFen, isEvalBarEnabled);
  const vantagemBrancas = evalData?.vantagemBrancas || 0;
  const isMate = evalData?.tipo === 'mate';

  // ATUALIZAÇÃO: Fila consumindo o histórico em array (memory.fenHistory) em vez do FEN isolado da tela
  const { 
    progressoFila, 
    iniciarAvaliacaoFimDeJogo, 
    pararAvaliacao 
  } = useMoveClassification(memory.fenHistory, isEvalBarEnabled, memory.registrarAvaliacaoLocal);

  const processarRespostaServidor = (response: any, moveRealizado?: { origem: string; destino: string }) => {
    clock.atualizarTempos(response.tempos);
    board.setGameFen(response.fen);
    history.atualizarHistorico(response.pgn);
    rules.atualizarRegras(response.statusPartida, response.detalhes);

    // Delega o salvamento do histórico visual para o hook de memória
    memory.registrarQuadroHistorico(response.fen, moveRealizado);

    if (moveRealizado) {
      board.setLastMove(moveRealizado);
    }
  };

  useStockfishMatch({
    partidaId: partidaData?.partidaId,
    gameFen: board.gameFen,
    isMinhaVez: board.isMinhaVez,
    minhaCor: board.minhaCor,
    isGameOver: !!rules.gameOver,
    isPendingPromotion: !!rules.pendingPromotion,
    botOponente,
    onBotMoveSuccess: (response, moveRealizado) => processarRespostaServidor(response, moveRealizado)
  });

  const realizarMovimento = async (origem: string, destino: string, pecaPromocao?: string) => {
    try {
      board.setPieceSquare('');
      board.setMoveSquares({});

      const payload: any = { origem, destino, corDoTurnoAtual: board.minhaCor };
      if (pecaPromocao) payload.promocao = pecaPromocao;

      const response = await matchService.executarMovimento(partidaData.partidaId, payload);

      if (response.sucesso) {
        if (response.requerPromocao) {
           rules.setPendingPromotion({ origem, destino });
           return false; 
        }

        if (response.fen) {
            if (pecaPromocao) rules.setPendingPromotion(null);
            processarRespostaServidor(response, { origem, destino });
            return true; 
        }
      }
      return false; 
    } catch (error) {
      console.error("[JOGADOR] Falha de comunicação no movimento:", error);
      return false;
    }
  };

  const onPieceDrop = async (sourceSquare: string, targetSquare: string) => {
    if (!board.isMinhaVez || rules.gameOver || rules.pendingPromotion) return false;
    return await realizarMovimento(sourceSquare, targetSquare);
  };

  const onSquareClick = async (square: string) => {
    if (!board.isMinhaVez || rules.gameOver || rules.pendingPromotion) return;

    if (board.pieceSquare === square) {
      board.setPieceSquare('');
      board.setMoveSquares({});
      return;
    }

    if (board.pieceSquare && board.moveSquares[square]) {
      await realizarMovimento(board.pieceSquare, square);
      return;
    }

    try {
      const movimentos = await matchService.obterMovimentos(partidaData.partidaId, square, board.minhaCor);
      
      if (movimentos && movimentos.length > 0) {
        board.setPieceSquare(square);
        
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
    } catch (error) {
      console.error("[JOGADOR] Erro ao buscar movimentos válidos para a peça selecionada.", error);
      board.setPieceSquare('');
      board.setMoveSquares({});
    }
  };

  return {
    gameFen: board.gameFen,
    minhaCor: board.minhaCor,
    moveSquares: board.moveSquares,
    lastMove: board.lastMove, 
    moveHistory: history.moveHistory,
    isCheck: rules.isCheck,
    gameOver: rules.gameOver,
    pendingPromotion: rules.pendingPromotion,
    setPendingPromotion: rules.setPendingPromotion,
    tempoBrancas: clock.tempoBrancas,
    tempoPretas: clock.tempoPretas,
    
    // ATUALIZAÇÃO: Variáveis atualizadas passadas para a UI
    vantagemBrancas, 
    isMate,
    currentOpening,
    progressoFila,
    iniciarAvaliacaoFimDeJogo,
    pararAvaliacao,          
    onPieceDrop,
    onSquareClick,
    realizarMovimento,
    
    avaliacoesLocais: memory.avaliacoesLocais, 
    fenHistory: memory.fenHistory,
    moveCoordsHistory: memory.moveCoordsHistory,
    minhasEstatisticas: memory.minhasEstatisticas
  };
}
