
// src/features/match/view/MatchView.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrainCircuit, LibraryBig } from 'lucide-react';

import { PlayerPanel } from '@/components/board/PlayerPanel';
import { MatchBoardArea } from '@/components/board/MatchBoardArea';
import { MoveHistoryBoard } from '@/components/board/MoveHistoryBoard';
import { useAuthStore } from '@/store/authStore';
import { useMatch } from '../hooks/useMatch'; 
import { useChessClock } from '@/features/time/hooks/useChessClock';

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
    <div className="relative w-full min-h-screen bg-slate-950 flex flex-col items-center overflow-x-hidden">
      
      {/* Background Glows (Discretos e nos cantos para não atrapalhar a visão) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-chess-green/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-analysis-blue/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Container Principal */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row lg:items-start lg:justify-center gap-6 lg:gap-10 py-6 px-4">
        
        {/* Coluna Central: O Tabuleiro e os Jogadores */}
        <div className="flex-1 flex flex-col w-full max-w-[640px] mx-auto gap-2 lg:gap-3">
          
          {/* Oponente (Topo) */}
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

          {/* Tabuleiro */}
          <div className="my-1">
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
          </div>

          {/* Você (Base) */}
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

        {/* Coluna Lateral: Histórico, Abertura e Engine */}
        <aside className="w-full lg:w-[360px] flex flex-col gap-4 max-w-[640px] mx-auto lg:mx-0 shrink-0">
          
          {/* Widget de Abertura / Avaliação da Engine */}
          {isEvalBarEnabled && (
            <div className="bg-slate-900/60 rounded-2xl border-2 border-slate-800 p-5 flex flex-col gap-4 shadow-lg">
              
              {/* Display de Abertura */}
              {matchState.currentOpening ? (
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                    <LibraryBig size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Abertura em Jogo</span>
                    <span className="text-sm font-bold text-slate-200 line-clamp-1" title={matchState.currentOpening.name}>
                      {matchState.currentOpening.name}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Abertura Desconhecida</span>
                </div>
              )}
              
              {/* Display da Avaliação */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <BrainCircuit size={16} />
                  <span className="text-xs font-semibold">Motor de Análise</span>
                </div>
                
                <div className={`px-2.5 py-1 rounded-md text-sm font-black font-mono tracking-tighter shadow-inner
                  ${matchState.isMate 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : matchState.vantagemBrancas > 0 
                      ? 'bg-slate-100 text-slate-900' 
                      : matchState.vantagemBrancas < 0 
                        ? 'bg-slate-900 text-slate-100 border border-slate-700' 
                        : 'bg-slate-700 text-slate-300'}`}
                >
                  {matchState.isMate 
                    ? `M${Math.abs(matchState.vantagemBrancas)}`
                    : `${matchState.vantagemBrancas > 0 ? '+' : ''}${matchState.vantagemBrancas.toFixed(1)}`}
                </div>
              </div>
            </div>
          )}

          {/* Histórico de Lances (Agora ocupa o espaço restante) */}
          <MoveHistoryBoard 
            pgnHistory={matchState.moveHistory} 
            onProporEmpate={() => console.log('Empate solicitado')}
            onAbandonar={matchState.abandonarPartida} 
          />

        </aside>
        
      </div>
    </div>
  );
}
