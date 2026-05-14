// src/features/match/MatchView.tsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Componentes de interface e lógica de xadrez
import { CustomChessboard } from '@/components/board/CustomChessboard'; 
import { UserProfileWidget } from '@/components/ui/UserProfileWidget';
import { useAuthStore } from '@/store/authStore';
import { MoveHistoryBoard } from '@/components/board/MoveHistoryBoard';
import { useMatch } from '../hooks/useMatch'; 

// Componentes de sobreposição (Modais e Alertas condicionais)
import { GameOverModal } from '@/components/board/GameOverModal';
import { PromotionModal } from '@/components/board/PromotionModal';
import { CheckAlert } from '@/components/board/CheckAlert';
import { CapturedPieces } from '@/components/board/CapturedPieces'; 
import { ChessClock } from '@/components/board/ChessClock';
import { useChessClock } from '@/features/time/hooks/useChessClock';

/**
 * MatchView: Orquestrador da interface de partida.
 * Responsável por renderizar o tabuleiro, relógios, histórico e modais de status.
 */
export function MatchView() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  // Recupera os dados da partida e configuração do bot passados via navegação (Router State)
  const partidaData = location.state?.partidaData;
  const botOponente = location.state?.botOponente;

  /**
   * Cláusula de segurança: redireciona para o dashboard caso os dados 
   * essenciais da partida não estejam presentes no estado da rota.
   */
  useEffect(() => {
    if (!partidaData || !currentUser) {
      navigate('/dashboard');
    }
  }, [partidaData, currentUser, navigate]);

  // Integração com o Maestro: Consome todos os estados e ações da partida
  const { 
    gameFen, moveHistory, minhaCor, onSquareClick, moveSquares,
    isCheck, gameOver, pendingPromotion, setPendingPromotion, realizarMovimento,
    tempoBrancas, tempoPretas 
  } = useMatch(partidaData, currentUser, botOponente);

  // Previne renderização sem dados válidos durante o redirecionamento
  if (!partidaData || !currentUser) return null;

  // Lógica de estado derivada para controle de turnos e bloqueios
  const turnoAtualFEN = gameFen.split(' ')[1] || 'w'; 
  const isMinhaVez = (minhaCor === 'branca' && turnoAtualFEN === 'w') || (minhaCor === 'preta' && turnoAtualFEN === 'b');
  const isAdversarioVez = !isMinhaVez;
  const isFimDeJogo = !!gameOver;
  
  /**
   * Mapeamento de Relógios:
   * Associa os tempos vindos do backend aos respectivos componentes visuais 
   * baseando-se na cor atribuída ao jogador logado.
   */
  const tempoJogador = minhaCor === 'branca' ? tempoBrancas : tempoPretas;
  const tempoAdversario = minhaCor === 'branca' ? tempoPretas : tempoBrancas;

  // Hooks de animação visual dos relógios (decremento em tela)
  const clockAdversario = useChessClock(tempoAdversario, isAdversarioVez, isFimDeJogo);
  const clockJogador = useChessClock(tempoJogador, isMinhaVez, isFimDeJogo);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 py-4 px-2 min-h-[90vh]">
      
      {/* Coluna Principal: Tabuleiro e Jogadores */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* Seção Superior: Dados do Adversário */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center bg-slate-800/40 p-2 rounded-lg relative">
            <UserProfileWidget 
              nome={partidaData.jogadores.pretas} 
              rating={botOponente?.rating || 1500} 
              iniciais="OP" 
              foto={botOponente?.foto}
            />
            
            <ChessClock 
              formato={clockAdversario.formato} 
              isActive={isAdversarioVez} 
              isLowTime={clockAdversario.isLowTime} 
            />
          </div>
          
          <CapturedPieces 
            fen={gameFen} 
            capturedColor={minhaCor === 'branca' ? 'white' : 'black'} 
          />
        </div>

        {/* Área Central: Tabuleiro e Camadas de Interação (Modais) */}
        <div className="w-full max-w-[600px] mx-auto relative mt-4">
          
          <CheckAlert isCheck={isCheck} />

          <CustomChessboard 
            fen={gameFen} 
            boardOrientation={minhaCor === 'branca' ? 'white' : 'black'}
            onSquareClick={onSquareClick}
            customSquareStyles={moveSquares}
          />

          {/* Renderização Condicional: Modal de Promoção (Interrompe o fluxo de clique) */}
          {pendingPromotion && (
            <PromotionModal 
              cor={minhaCor as 'branca' | 'preta'}
              onSelect={(peca) => {
                realizarMovimento(pendingPromotion.origem, pendingPromotion.destino, peca);
                setPendingPromotion(null);
              }} 
            />
          )}

          {/* Renderização Condicional: Modal de Fim de Jogo */}
          {gameOver && (
            <GameOverModal 
              vencedor={gameOver.vencedor as 'branca' | 'preta' | null}
              motivo={gameOver.motivo} 
              minhaCor={minhaCor as 'branca' | 'preta'}
              onClose={() => navigate('/dashboard')} 
            />
          )}
        </div>

        {/* Seção Inferior: Dados do Usuário Logado */}
        <div className="flex flex-col">
          <CapturedPieces 
            fen={gameFen} 
            capturedColor={minhaCor === 'branca' ? 'black' : 'white'} 
          />

          <div className="flex justify-between items-center bg-slate-800/40 p-2 rounded-lg mt-1">
            <UserProfileWidget 
              nome={currentUser.nome} 
              rating={currentUser.rating} 
              iniciais={currentUser.nome.substring(0,2).toUpperCase()} 
            />
            
            <ChessClock 
              formato={clockJogador.formato} 
              isActive={isMinhaVez} 
              isLowTime={clockJogador.isLowTime} 
            />
          </div>
        </div>
      </div>

      {/* Barra Lateral: Histórico e Análise */}
      <aside className="w-full lg:w-80 flex flex-col gap-4">
        <MoveHistoryBoard 
          pgnHistory={moveHistory} 
          onProporEmpate={() => console.log('Empate solicitado')}
          onAbandonar={() => navigate('/dashboard')}
        />
        
        {/* Placeholder para futura integração com motor de análise/estatísticas */}
        <div className="h-32 bg-slate-900/50 rounded-xl border border-slate-800 p-3 flex items-center justify-center text-slate-600 italic text-xs text-center">
          O motor de análise está observando a partida...
        </div>
      </aside>
      
    </div>
  );
}
