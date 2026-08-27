import React from 'react';
import { useNavigate } from 'react-router-dom';

import { CustomChessboard } from '@/components/board/CustomChessboard'; 
import { GameOverModal } from '@/components/board/GameOverModal';
import { PromotionModal } from '@/components/board/PromotionModal';
import { CheckAlert } from '@/components/board/CheckAlert';
import { EvalBar } from '@/components/board/EvalBar';

interface MatchBoardAreaProps {
  // Configurações
  isEvalBarEnabled: boolean;
  minhaCor: 'branca' | 'preta';
  boardOrientation?: 'branca' | 'preta';
  
  // Estado do Jogo
  gameFen: string;
  isCheck: boolean;
  lastMove: { origem: string; destino: string } | null;
  moveSquares: Record<string, React.CSSProperties>;
  
  // Ações de Movimento
  onSquareClick: (square: string) => void;
  realizarMovimento: (origem: string, destino: string, peca?: string) => void;
  
  // Promoção
  pendingPromotion: { origem: string; destino: string } | null;
  setPendingPromotion: (prom: { origem: string; destino: string } | null) => void;
  
  // Avaliação da Engine
  vantagemBrancas: number;
  isMate: boolean;
  
  // Fim de Jogo e Análise
  gameOver: any;
  progressoFila: any;
  erroAnalise?: string | null;
  minhasEstatisticas: any;
  iniciarAvaliacaoFimDeJogo: () => void;
  pararAvaliacao: () => void;
  
  // Dados de contexto para enviar à rota de Análise
  partidaData: any;
  botOponente: any;
  moveHistory: any;
  avaliacoesLocais: any;
  fenHistory: any;
  moveCoordsHistory: any;
}

/**
 * MatchBoardArea: Encapsula a visualização central do jogo.
 * Gerencia o tabuleiro, barra de avaliação, destaques visuais e modais interativos.
 */
export function MatchBoardArea({
  isEvalBarEnabled,
  minhaCor,
  boardOrientation,
  gameFen,
  isCheck,
  lastMove,
  moveSquares,
  onSquareClick,
  realizarMovimento,
  pendingPromotion,
  setPendingPromotion,
  vantagemBrancas,
  isMate,
  gameOver,
  progressoFila,
  erroAnalise,
  minhasEstatisticas,
  iniciarAvaliacaoFimDeJogo,
  pararAvaliacao,
  partidaData,
  botOponente,
  moveHistory,
  avaliacoesLocais,
  fenHistory,
  moveCoordsHistory
}: MatchBoardAreaProps) {
  const navigate = useNavigate();
  const displayedColor = boardOrientation || minhaCor;

  // Função isolada aqui, pois é uma lógica puramente visual (UI) do tabuleiro
  const getCombinedStyles = () => {
    const styles: Record<string, React.CSSProperties> = { ...moveSquares }; 

    if (lastMove) {
      styles[lastMove.origem] = { 
        ...styles[lastMove.origem], 
        backgroundColor: 'rgba(250, 204, 21, 0.46)'
      };
      styles[lastMove.destino] = { 
        ...styles[lastMove.destino], 
        backgroundColor: 'rgba(250, 204, 21, 0.46)'
      };
    }

    return styles;
  };

  return (
    <div className="relative mx-auto mt-2 flex w-full max-w-[680px] items-stretch gap-2 sm:gap-3">
      
      {/* Barra de Avaliação */}
      {isEvalBarEnabled && (
        <div className="flex flex-shrink-0">
          <EvalBar 
            vantagemBrancas={vantagemBrancas} 
            isMate={isMate} 
            isInvertida={displayedColor === 'preta'} 
          />
        </div>
      )}

      {/* Wrapper do Tabuleiro */}
      <div className="relative min-w-0 flex-1">
        <CheckAlert isCheck={isCheck} />

        <CustomChessboard 
          fen={gameFen} 
          boardOrientation={displayedColor === 'branca' ? 'white' : 'black'}
          onSquareClick={onSquareClick}
          customSquareStyles={getCombinedStyles()}
        />

        {/* Renderização Condicional: Modal de Promoção */}
        {pendingPromotion && (
          <PromotionModal 
            cor={minhaCor}
            onSelect={(peca) => {
              realizarMovimento(pendingPromotion.origem, pendingPromotion.destino, peca);
              setPendingPromotion(null);
            }} 
          />
        )}

        {/* Renderização Condicional: Modal de Fim de Jogo */}
        {gameOver && (
          <GameOverModal 
            vencedor={gameOver.vencedor}
            motivo={gameOver.motivo} 
            minhaCor={minhaCor}
            progressoFila={progressoFila}
            erroAnalise={erroAnalise}
            stats={minhasEstatisticas}
            onAvaliar={() => iniciarAvaliacaoFimDeJogo()}
            
            // Navegação para análise com todo o contexto isolado
            onVerNoTabuleiro={() => {
              navigate('/analysis', {
                state: {
                  partidaData,
                  botOponente,
                  minhaCor,
                  moveHistory,
                  avaliacoesLocais,
                  fenHistory,
                  moveCoordsHistory
                }
              });
            }}
            onClose={() => {
              pararAvaliacao();
              navigate('/dashboard');
            }} 
          />
        )}
      </div>
    </div>
  );
}
