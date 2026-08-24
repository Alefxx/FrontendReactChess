import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // CORREÇÃO: Removido o useMatch daqui
import { PlayerPanel } from '@/components/board/PlayerPanel';
import { MatchBoardArea } from '@/components/board/MatchBoardArea';
import { MoveHistoryBoard } from '@/components/board/MoveHistoryBoard';
import { useAuthStore } from '@/store/authStore';
import { useMatch } from '../hooks/useMatch'; 
import { useChessClock } from '@/features/time/hooks/useChessClock';

/**
 * MatchView: Orquestrador da interface de partida.
 * Limpo e focado no layout de grid flexível.
 */
export function MatchView() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const partidaData = location.state?.partidaData;
  const botOponente = location.state?.botOponente;
  const isEvalBarEnabled = location.state?.isEvalBarEnabled || false;

  useEffect(() => {
    if (!partidaData || !currentUser) {
      navigate('/dashboard');
    }
  }, [partidaData, currentUser, navigate]);

  const matchState = useMatch(partidaData, currentUser, botOponente, isEvalBarEnabled);

  if (!partidaData || !currentUser) return null;

  // Lógica de estado derivada para controle de turnos
  const turnoAtualFEN = matchState.gameFen.split(' ')[1] || 'w'; 
  const isMinhaVez = (matchState.minhaCor === 'branca' && turnoAtualFEN === 'w') || (matchState.minhaCor === 'preta' && turnoAtualFEN === 'b');
  const isAdversarioVez = !isMinhaVez;
  const isFimDeJogo = !!matchState.gameOver;
  
  // Mapeamento de Relógios
  const tempoJogador = matchState.minhaCor === 'branca' ? matchState.tempoBrancas : matchState.tempoPretas;
  const tempoAdversario = matchState.minhaCor === 'branca' ? matchState.tempoPretas : matchState.tempoBrancas;

  const clockAdversario = useChessClock(tempoAdversario, isAdversarioVez, isFimDeJogo);
  const clockJogador = useChessClock(tempoJogador, isMinhaVez, isFimDeJogo);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 py-4 px-2 min-h-[90vh]">
      
      {/* Coluna Principal: Tabuleiro e Jogadores */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* Adversário no Topo */}
        <PlayerPanel 
          nome={partidaData.jogadores.pretas}
          rating={botOponente?.rating || 1500}
          iniciais="OP"
          foto={botOponente?.foto}
          clockFormat={clockAdversario.formato}
          isClockActive={isAdversarioVez}
          isLowTime={clockAdversario.isLowTime}
          fen={matchState.gameFen}
          capturedColor={matchState.minhaCor === 'branca' ? 'white' : 'black'}
          position="top"
        />

        {/* Tabuleiro Central Isolado */}
        <MatchBoardArea 
          isEvalBarEnabled={isEvalBarEnabled}
          minhaCor={matchState.minhaCor as 'branca' | 'preta'}
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

        {/* Usuário Logado na Base */}
        <PlayerPanel 
          nome={currentUser.nome}
          rating={currentUser.rating}
          iniciais={currentUser.nome.substring(0,2).toUpperCase()}
          clockFormat={clockJogador.formato}
          isClockActive={isMinhaVez}
          isLowTime={clockJogador.isLowTime}
          fen={matchState.gameFen}
          capturedColor={matchState.minhaCor === 'branca' ? 'black' : 'white'}
          position="bottom"
        />
      </div>

      {/* Barra Lateral: Histórico e Análise */}
      <aside className="w-full lg:w-80 flex flex-col gap-4">
        <MoveHistoryBoard 
          pgnHistory={matchState.moveHistory} 
          onProporEmpate={() => console.log('Empate solicitado')}
          
          // CORREÇÃO: Agora chama a função que passa pelo backend, atualiza Elo e abre o Modal!
          onAbandonar={matchState.abandonarPartida} 
        />
        
        {isEvalBarEnabled && (
          <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 flex flex-col items-center justify-center text-center gap-2">
            {matchState.currentOpening && (
              <span className="text-stone-400 font-bold uppercase tracking-wider text-[11px] pb-2 border-b border-slate-700/50 w-full">
                {matchState.currentOpening.name}
              </span>
            )}
            
            <span className="text-slate-500 italic text-xs pt-1">
              {matchState.isMate 
                ? `Motor encontrou: Xeque-Mate em ${Math.abs(matchState.vantagemBrancas)}`
                : `Avaliação do motor: ${matchState.vantagemBrancas > 0 ? '+' : ''}${matchState.vantagemBrancas.toFixed(1)}`}
            </span>
          </div>
        )}
      </aside>
      
    </div>
  );
}
