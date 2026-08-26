// src/features/match/view/GameLocalView.tsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Componentes da Nova Arquitetura Limpa
import { PlayerPanel } from '@/components/board/PlayerPanel';
import { MatchBoardArea } from '@/components/board/MatchBoardArea';

// Hooks e Stores
import { useAuthStore } from '@/store/authStore'; 
import { useMatch } from '@/features/match/hooks/useMatch';
import { useChessClock } from '@/features/time/hooks/useChessClock';

export function GameLocal() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  
  const partidaData = location.state?.partidaData;
  const isEvalBarEnabled = location.state?.isEvalBarEnabled || false;

  useEffect(() => {
    if (!partidaData || partidaData.tipoPartida !== 'local') {
      navigate('/dashboard');
    }
  }, [partidaData, navigate]);

  // Consome todo o estado do orquestrador
  const matchState = useMatch(partidaData, currentUser, undefined, isEvalBarEnabled);

  const [autoFlip, setAutoFlip] = useState(true);

  if (!partidaData || !currentUser) return null;

  // Lógica de Orientação Dinâmica (Giro Automático)
  const boardOrientation = autoFlip ? (matchState.minhaCor === 'branca' ? 'white' : 'black') : 'white'; 
  const bottomColor = boardOrientation === 'white' ? 'branca' : 'preta';
  const topColor = boardOrientation === 'white' ? 'preta' : 'branca';

  const bottomPlayerName = bottomColor === 'branca' ? partidaData.jogadores.brancas : partidaData.jogadores.pretas;
  const topPlayerName = topColor === 'branca' ? partidaData.jogadores.brancas : partidaData.jogadores.pretas;

  const isBottomTurn = matchState.minhaCor === bottomColor;
  const isTopTurn = matchState.minhaCor === topColor;
  const isFimDeJogo = !!matchState.gameOver;

  const clockBottom = useChessClock(bottomColor === 'branca' ? matchState.tempoBrancas : matchState.tempoPretas, isBottomTurn, isFimDeJogo);
  const clockTop = useChessClock(topColor === 'branca' ? matchState.tempoBrancas : matchState.tempoPretas, isTopTurn, isFimDeJogo);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4">
      <div className="w-full max-w-[480px] flex flex-col gap-3 relative">
        
        {/* HUD Superior (Rotacionado se o autoFlip estiver ativo) */}
        <div className={`transition-transform duration-500 ${autoFlip ? 'rotate-180' : ''}`}>
          <div className={`rounded-xl border ${isTopTurn ? 'border-blue-500/50' : 'border-transparent'} transition-colors`}>
            <PlayerPanel 
              nome={topPlayerName}
              rating={1500}
              iniciais={topPlayerName.substring(0,2).toUpperCase()}
              clockFormat={clockTop.formato}
              isClockActive={isTopTurn}
              isLowTime={clockTop.isLowTime}
              fen={matchState.gameFen}
              capturedColor={topColor === 'branca' ? 'white' : 'black'}
              position="top"
            />
          </div>
        </div>

        {/* Área Central: Tabuleiro, Modais e Barrinha (Tudo Encapsulado!) */}
        {/* Usamos bottomColor como 'minhaCor' aqui para forçar a MatchBoardArea a renderizar na orientação correta */}
        <MatchBoardArea 
          isEvalBarEnabled={isEvalBarEnabled}
          minhaCor={bottomColor} 
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
          botOponente={undefined}
          moveHistory={matchState.moveHistory}
          avaliacoesLocais={matchState.avaliacoesLocais}
          fenHistory={matchState.fenHistory}
          moveCoordsHistory={matchState.moveCoordsHistory}
        />

        {/* HUD Inferior */}
        <div className={`transition-colors rounded-xl border ${isBottomTurn ? 'border-blue-500/50' : 'border-transparent'}`}>
          <PlayerPanel 
            nome={bottomPlayerName}
            rating={1500}
            iniciais={bottomPlayerName.substring(0,2).toUpperCase()}
            clockFormat={clockBottom.formato}
            isClockActive={isBottomTurn}
            isLowTime={clockBottom.isLowTime}
            fen={matchState.gameFen}
            capturedColor={bottomColor === 'branca' ? 'black' : 'white'}
            position="bottom"
          />
        </div>

        {/* Botão de Controle do Giro Automático */}
        <button 
          onClick={() => setAutoFlip(!autoFlip)}
          className="w-full text-xs font-bold uppercase tracking-widest py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-all"
        >
          {autoFlip ? 'Giro Automático: LIGADO' : 'Giro Automático: DESLIGADO'}
        </button>

      </div>
    </div>
  );
}
