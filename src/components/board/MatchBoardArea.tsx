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

  // Função isolada aqui, pois é uma lógica puramente visual (UI) do tabuleiro
  const getCombinedStyles = () => {
    const styles: Record<string, React.CSSProperties> = { ...moveSquares }; 

    if (lastMove) {
      styles[lastMove.origem] = { 
        ...styles[lastMove.origem], 
        backgroundColor: 'rgba(255, 255, 0, 0.4)' 
      };
      styles[lastMove.destino] = { 
        ...styles[lastMove.destino], 
        backgroundColor: 'rgba(255, 255, 0, 0.4)' 
      };
    }

    return styles;
  };

  return (
    <div className="w-full max-w-[640px] mx-auto relative mt-4 flex gap-2 md:gap-3 items-stretch">
      
      {/* Barra de Avaliação */}
      {isEvalBarEnabled && (
        <div className="flex flex-shrink-0">
          <EvalBar 
            vantagemBrancas={vantagemBrancas} 
            isMate={isMate} 
            isInvertida={minhaCor === 'preta'} 
          />
        </div>
      )}

      {/* Wrapper do Tabuleiro */}
      <div className="flex-1 relative">
        <CheckAlert isCheck={isCheck} />

        <CustomChessboard 
          fen={gameFen} 
          boardOrientation={minhaCor === 'branca' ? 'white' : 'black'}
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
