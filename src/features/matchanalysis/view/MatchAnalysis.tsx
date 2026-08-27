// src/screens/MatchAnalysis.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

import { CustomChessboard } from '@/components/board/CustomChessboard'; 
import { UserProfileWidget } from '@/components/ui/UserProfileWidget';
import { CapturedPieces } from '@/components/board/CapturedPieces'; 
import { EvalBar } from '@/components/board/EvalBar';
import { CheckAlert } from '@/components/board/CheckAlert';
import { MoveHistoryBoard } from '@/components/board/MoveHistoryBoard';

import { NavigationArrow } from '@/components/analysis/NavigationArrow';
import { MoveQualityIcon, MoveQuality } from '@/components/analysis/MoveQualityIcon';

// Hooks
import { useAuthStore } from '@/store/authStore';
import { useMatchAnalysis } from '@/features/matchanalysis/hooks/useMatchAnalysis';
import { useAnalysis } from '@/features/stockfish/analysis/hooks/useAnalysis';
import { Button } from '@/components/ui/Button';

// ATUALIZAÇÃO: Mapeamento agora inclui o código 0
const QUALITY_MAP: Record<number, MoveQuality> = {
  0: 'book', // Certifique-se de que 'book' existe no type MoveQuality do seu componente
  1: 'best',
  2: 'great',
  3: 'inaccuracy',
  4: 'mistake',
  5: 'blunder',
};

export function MatchAnalysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const partidaData = location.state?.partidaData;
  const minhaCor = location.state?.minhaCor || 'branca';
  const botOponente = location.state?.botOponente;
  
  const moveHistory = location.state?.moveHistory || [];
  const avaliacoesLocais = location.state?.avaliacoesLocais || [];
  const fenHistory = location.state?.fenHistory || [];
  const moveCoordsHistory = location.state?.moveCoordsHistory || [];

  useEffect(() => {
    if (!partidaData || !currentUser) navigate('/dashboard');
  }, [partidaData, currentUser, navigate]);

  const { 
    currentMoveIndex, gameFen, lastMove, isCheck, 
    isFirstMove, isLastMove, nextMove, prevMove, goToMove 
  } = useMatchAnalysis(fenHistory, moveHistory, moveCoordsHistory);

  // ATUALIZAÇÃO: Recebendo a nova estrutura do hook useAnalysis
  const { evalData, currentOpening } = useAnalysis(gameFen, true);

  // Extraindo os dados seguros para a EvalBar
  const vantagemBrancas = evalData?.vantagemBrancas || 0;
  const isMate = evalData?.tipo === 'mate';

  if (!partidaData || !currentUser) return null;

  // ATUALIZAÇÃO: Prevenindo o bug do Falsy (0)
  const currentQualityCode = currentMoveIndex > 0 ? avaliacoesLocais[currentMoveIndex - 1] : null;
  const currentQuality = (currentQualityCode !== null && currentQualityCode !== undefined) 
    ? QUALITY_MAP[currentQualityCode] 
    : null;

  const getCombinedStyles = () => {
    const styles: Record<string, React.CSSProperties> = {}; 
    if (lastMove) {
      styles[lastMove.origem] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
      styles[lastMove.destino] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
    }
    return styles;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevMove();
      if (e.key === 'ArrowRight') nextMove();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevMove, nextMove]);

  return (
    <div className="page-container grid max-w-7xl items-start gap-4 py-1 sm:py-3 xl:grid-cols-[minmax(0,1fr)_19rem] xl:gap-5">
      
      <div className="mx-auto flex w-full max-w-[730px] flex-col gap-3">
        
        {/* Adversário */}
        <div className="flex flex-col">
          <div className="surface-subtle flex items-center justify-between gap-2 rounded-2xl p-2.5">
            <UserProfileWidget 
              nome={partidaData.jogadores.pretas} 
              rating={botOponente?.rating || 1500} 
              iniciais="OP" 
              foto={botOponente?.foto}
            />
            <span className="rounded-lg bg-slate-950/70 px-3 py-1.5 text-xs font-bold text-slate-400">
              Análise
            </span>
          </div>
          <CapturedPieces fen={gameFen} capturedColor={minhaCor === 'branca' ? 'white' : 'black'} />
        </div>

        {/* Tabuleiro + EvalBar */}
        <div className="relative mx-auto mt-1 flex w-full max-w-[680px] items-stretch gap-2 sm:gap-3">
          <div className="flex flex-shrink-0">
            <EvalBar vantagemBrancas={vantagemBrancas} isMate={isMate} isInvertida={minhaCor === 'preta'} />
          </div>

          <div className="relative min-w-0 flex-1 flex-col">
            <CheckAlert isCheck={isCheck} />

            <CustomChessboard 
              fen={gameFen} 
              boardOrientation={minhaCor === 'branca' ? 'white' : 'black'}
              onSquareClick={() => {}} 
              customSquareStyles={getCombinedStyles()}
            />

            {/* Controles de Navegação */}
            <div className="surface-subtle mt-3 flex flex-col rounded-2xl p-2">
              <div className="flex items-center justify-between">
                <NavigationArrow direction="left" onClick={prevMove} disabled={isFirstMove} />

                <div className="flex flex-col items-center justify-center flex-1">
                  {currentQuality ? (
                    <div className="flex items-center gap-2">
                      <MoveQualityIcon quality={currentQuality} className="scale-110" />
                      <span className="text-white font-bold capitalize text-sm">
                        {currentQuality === 'book' ? 'Teoria' :
                         currentQuality === 'best' ? 'Excelente' : 
                         currentQuality === 'great' ? 'Boa' : 
                         currentQuality === 'inaccuracy' ? 'Imprecisão' : 
                         currentQuality === 'mistake' ? 'Erro' : 'Capivara'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm font-medium">Posição Inicial</span>
                  )}
                </div>

                <NavigationArrow direction="right" onClick={nextMove} disabled={isLastMove} />
              </div>
              
              {/* ATUALIZAÇÃO: Exibe a abertura de forma sutil abaixo dos controles */}
              {currentOpening && (
                <div className="text-center mt-2 pt-2 border-t border-slate-700/50">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    {currentOpening.name} ({currentOpening.eco})
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Jogador */}
        <div className="flex flex-col">
          <CapturedPieces fen={gameFen} capturedColor={minhaCor === 'branca' ? 'black' : 'white'} />
          <div className="surface-subtle mt-1 flex items-center justify-between gap-2 rounded-2xl p-2.5">
            <UserProfileWidget 
              nome={currentUser.nome} 
              rating={currentUser.rating} 
              iniciais={currentUser.nome.substring(0,2).toUpperCase()} 
            />
          </div>
        </div>
      </div>

      <aside className="flex w-full flex-col gap-3 xl:sticky xl:top-5">
        <MoveHistoryBoard 
          pgnHistory={moveHistory} 
          moveCodes={avaliacoesLocais}
          currentMoveIndex={currentMoveIndex > 0 ? currentMoveIndex - 1 : -1} 
          onMoveClick={(pgnIndex) => goToMove(pgnIndex + 1)} 
        />
        
        <div className="mt-auto">
          <Button 
            label="Sair da Análise" 
            variant="ghost" 
            className="w-full bg-slate-800 hover:bg-slate-700 text-red-400 border border-red-500/20"
            onClick={() => navigate('/dashboard')}
            icon={<LogOut size={18} />}
          />
        </div>
      </aside>
      
    </div>
  );
}
