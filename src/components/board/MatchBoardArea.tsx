// src/components/board/MatchBoardArea.tsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { CustomChessboard } from '@/components/board/CustomChessboard'; 
import { GameOverModal } from '@/components/board/GameOverModal';
import { PromotionModal } from '@/components/board/PromotionModal';
import { CheckAlert } from '@/components/board/CheckAlert';
import { EvalBar } from '@/components/board/EvalBar';

interface MatchBoardAreaProps {
  isEvalBarEnabled: boolean;
  minhaCor: 'branca' | 'preta';
  gameFen: string;
  isCheck: boolean;
  lastMove: { origem: string; destino: string } | null;
  moveSquares: Record<string, React.CSSProperties>;
  
  onSquareClick: (square: string) => void;
  realizarMovimento: (origem: string, destino: string, peca?: string) => void;
  
  pendingPromotion: { origem: string; destino: string } | null;
  setPendingPromotion: (prom: { origem: string; destino: string } | null) => void;
  
  vantagemBrancas: number;
  isMate: boolean;
  
  gameOver: any;
  progressoFila: any;
  minhasEstatisticas: any;
  iniciarAvaliacaoFimDeJogo: () => void;
  pararAvaliacao: () => void;
  
  partidaData: any;
  botOponente: any;
  moveHistory: any;
  avaliacoesLocais: any;
  fenHistory: any;
  moveCoordsHistory: any;
}

export function MatchBoardArea({
  isEvalBarEnabled,
  minhaCor,
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

  // TAPA DE PERFORMANCE: useMemo evita re-renders desnecessários
  const combinedSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = { ...moveSquares }; 

    if (lastMove) {
      const highlightColor = 'rgba(255, 255, 51, 0.45)';
      
      styles[lastMove.origem] = { 
        ...styles[lastMove.origem], 
        backgroundColor: highlightColor 
      };
      styles[lastMove.destino] = { 
        ...styles[lastMove.destino], 
        backgroundColor: highlightColor 
      };
    }

    return styles;
  }, [moveSquares, lastMove]);

  return (
    <div className="w-full max-w-[640px] mx-auto relative flex gap-2 md:gap-3 items-stretch drop-shadow-2xl">
      
      {/* Barra de Avaliação (CORRIGIDA: Sem a animação de slide que quebrava o cálculo de altura) */}
      {isEvalBarEnabled && (
        <div className="flex flex-shrink-0 h-full">
          <EvalBar 
            vantagemBrancas={vantagemBrancas} 
            isMate={isMate} 
            isInvertida={minhaCor === 'preta'} 
          />
        </div>
      )}

      {/* Wrapper do Tabuleiro */}
      <div className="flex-1 relative rounded-sm ring-4 ring-slate-900/50 bg-slate-900 h-full">
        <CheckAlert isCheck={isCheck} />

        <CustomChessboard 
          fen={gameFen} 
          boardOrientation={minhaCor === 'branca' ? 'white' : 'black'}
          onSquareClick={onSquareClick}
          customSquareStyles={combinedSquareStyles}
        />

        {/* Modais */}
        {pendingPromotion && (
          <PromotionModal 
            cor={minhaCor}
            onSelect={(peca) => {
              realizarMovimento(pendingPromotion.origem, pendingPromotion.destino, peca);
              setPendingPromotion(null);
            }} 
          />
        )}

        {gameOver && (
          <GameOverModal 
            vencedor={gameOver.vencedor}
            motivo={gameOver.motivo} 
            minhaCor={minhaCor}
            progressoFila={progressoFila}
            stats={minhasEstatisticas}
            onAvaliar={() => iniciarAvaliacaoFimDeJogo()}
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
