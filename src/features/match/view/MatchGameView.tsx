import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bot, LogOut, RotateCw, Users } from 'lucide-react';
import { PlayerPanel } from '@/components/board/PlayerPanel';
import { MatchBoardArea } from '@/components/board/MatchBoardArea';
import { MoveHistoryBoard } from '@/components/board/MoveHistoryBoard';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { useAuthStore } from '@/store/authStore';
import { useMatch } from '../hooks/useMatch';
import { useChessClock } from '@/features/time/hooks/useChessClock';

type MatchMode = 'bot' | 'local';
type PieceColor = 'branca' | 'preta';

interface MatchGameViewProps { mode: MatchMode; }

const oppositeColor = (color: PieceColor): PieceColor => color === 'branca' ? 'preta' : 'branca';
const initials = (name?: string) => (name || '??').slice(0, 2).toUpperCase();

export function MatchGameView({ mode }: MatchGameViewProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const partidaData = location.state?.partidaData;
  const botOponente = location.state?.botOponente;
  const isEvalBarEnabled = location.state?.isEvalBarEnabled || false;
  const isLocal = mode === 'local';
  const [localOrientation, setLocalOrientation] = useState<PieceColor>('branca');

  useEffect(() => {
    window.scrollTo(0, 0);
    const invalidMatch = !partidaData || !currentUser || (isLocal && partidaData.tipoPartida !== 'local');
    if (invalidMatch) navigate('/dashboard', { replace: true });
  }, [partidaData, currentUser, navigate, isLocal]);

  const matchState = useMatch(partidaData, currentUser, isLocal ? undefined : botOponente, isEvalBarEnabled);
  const currentTurn: PieceColor = matchState.gameFen.split(' ')[1] === 'b' ? 'preta' : 'branca';
  const boardColor: PieceColor = isLocal ? localOrientation : matchState.minhaCor;
  const topColor = oppositeColor(boardColor);
  const isGameOver = Boolean(matchState.gameOver);
  const isBottomTurn = !isGameOver && currentTurn === boardColor;
  const isTopTurn = !isGameOver && currentTurn === topColor;

  const getClockTime = (color: PieceColor) => color === 'branca' ? matchState.tempoBrancas : matchState.tempoPretas;
  const topClock = useChessClock(getClockTime(topColor), isTopTurn, isGameOver);
  const bottomClock = useChessClock(getClockTime(boardColor), isBottomTurn, isGameOver);

  if (!partidaData || !currentUser) return null;

  const names: Record<PieceColor, string> = {
    branca: partidaData.jogadores.brancas,
    preta: partidaData.jogadores.pretas,
  };
  const topName = names[topColor];
  const bottomName = isLocal ? names[boardColor] : currentUser.nome;
  const playerRating = currentUser.rating || 1500;
  const topRating = isLocal && topName === currentUser.nome ? playerRating : botOponente?.rating || 1500;
  const bottomRating = isLocal && bottomName === currentUser.nome ? playerRating : isLocal ? 1500 : playerRating;

  return (
    <div className="page-container max-w-7xl py-1 sm:py-3">
      <header className="surface-subtle mb-4 flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 sm:mb-5 sm:px-4">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <span className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold sm:flex ${isLocal ? 'bg-violet-400/10 text-violet-300' : 'bg-analysis-blue/10 text-analysis-blue'}`}>
            {isLocal ? <Users size={14} /> : <Bot size={14} />}{isLocal ? 'Partida presencial' : 'Partida contra bot'}
          </span>
          <Button label="Sair" size="sm" variant="ghost" icon={<LogOut size={15} />} onClick={() => navigate('/dashboard')} />
        </div>
      </header>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_19rem] xl:gap-5">
        <main className="match-game-column mx-auto flex flex-col gap-2.5 sm:gap-3">
          <PlayerPanel
            nome={topName}
            rating={topRating}
            iniciais={initials(topName)}
            foto={!isLocal ? botOponente?.foto : undefined}
            clockFormat={topClock.formato}
            isClockActive={isTopTurn}
            isLowTime={topClock.isLowTime}
            fen={matchState.gameFen}
            capturedColor={topColor === 'branca' ? 'black' : 'white'}
            position="top"
          />

          <MatchBoardArea
            isEvalBarEnabled={isEvalBarEnabled}
            minhaCor={matchState.minhaCor as PieceColor}
            boardOrientation={boardColor}
            gameFen={matchState.gameFen}
            isCheck={matchState.isCheck}
            lastMove={matchState.lastMove}
            moveSquares={matchState.moveSquares}
            onSquareClick={matchState.onSquareClick}
            realizarMovimento={matchState.realizarMovimento}
            pendingPromotion={matchState.pendingPromotion}
            setPendingPromotion={matchState.setPendingPromotion}
            vantagemBrancas={matchState.vantagemBrancas}
            isMate={matchState.isMate}
            gameOver={matchState.gameOver}
            progressoFila={matchState.progressoFila}
            erroAnalise={matchState.erroAnalise}
            minhasEstatisticas={matchState.minhasEstatisticas}
            iniciarAvaliacaoFimDeJogo={matchState.iniciarAvaliacaoFimDeJogo}
            pararAvaliacao={matchState.pararAvaliacao}
            partidaData={partidaData}
            botOponente={botOponente}
            moveHistory={matchState.moveHistory}
            avaliacoesLocais={matchState.avaliacoesLocais}
            fenHistory={matchState.fenHistory}
            moveCoordsHistory={matchState.moveCoordsHistory}
          />

          <PlayerPanel
            nome={bottomName}
            rating={bottomRating}
            iniciais={initials(bottomName)}
            foto={!isLocal ? currentUser.foto : bottomName === currentUser.nome ? currentUser.foto : undefined}
            clockFormat={bottomClock.formato}
            isClockActive={isBottomTurn}
            isLowTime={bottomClock.isLowTime}
            fen={matchState.gameFen}
            capturedColor={boardColor === 'branca' ? 'black' : 'white'}
            position="bottom"
          />

          {isLocal && (
            <button
              type="button"
              onClick={() => setLocalOrientation(oppositeColor(localOrientation))}
              className="surface-interactive flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-slate-300 hover:text-white"
            >
              <RotateCw size={16} /> Virar tabuleiro
            </button>
          )}
        </main>

        <aside className="flex w-full flex-col gap-3 xl:sticky xl:top-5">
          <MoveHistoryBoard
            pgnHistory={matchState.moveHistory}
            onAbandonar={matchState.abandonarPartida}
            abandonLabel={isLocal ? 'Encerrar partida' : 'Abandonar'}
          />
          <section className="surface-card rounded-2xl p-4">
            {isLocal ? (
              <><p className="text-xs font-black uppercase tracking-[0.15em] text-violet-300">Mesmo aparelho</p><p className="mt-2 text-sm leading-6 text-slate-400">A interface não gira mais. Use “Virar tabuleiro” entre lances quando quiser trocar a perspectiva.</p></>
            ) : (
              <><p className="text-xs font-black uppercase tracking-[0.15em] text-analysis-blue">Análise ao vivo</p><p className="mt-2 text-sm leading-6 text-slate-400">{isEvalBarEnabled ? (matchState.currentOpening ? matchState.currentOpening.name : 'Motor analisando a posição…') : 'Ative a avaliação ao criar uma nova partida para acompanhar o motor.'}</p></>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
