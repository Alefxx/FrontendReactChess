// src/features/gamemode/view/GameModeView.tsx
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { UserProfileWidget } from '@/components/ui/UserProfileWidget';
import { useAuthStore } from '@/store/authStore';

export function GameModeView() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const getIniciais = (nome?: string) => {
    if (!nome) return '??';
    return nome.substring(0, 2).toUpperCase();
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col">
      
      {/* Navegação Superior (Mesmo padrão da Dashboard) */}
      <header className="flex justify-between items-center w-full mb-16">
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <Logo size="sm" />
        </div>
        
        <UserProfileWidget 
          nome={user?.nome || 'Jogador'}
          rating={user?.rating || 1500}
          iniciais={getIniciais(user?.nome)}
          foto={user?.foto}
          onClick={() => navigate('/profile')}
        />
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col items-center justify-center gap-10 w-full max-w-md mx-auto">
        
        {/* Título */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
            Modo de <span className="text-chess-green">Jogo</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Escolha como você quer jogar a sua próxima partida.
          </p>
        </div>

        {/* Lista de Modos de Jogo */}
        <div className="flex flex-col gap-4 w-full px-4">
          <Button 
            label="Jogar contra Bots" 
            size="lg" 
            variant="primary"
            className="w-full py-5 text-xl"
            onClick={() => navigate('/bots')} 
          />
          
          <Button 
            label="Partida Local" 
            size="lg" 
            variant="secondary"
            className="w-full py-5 text-xl"
            onClick={() => navigate('/localview')} 
          />

          <Button 
            label="Multiplayer Online" 
            size="lg" 
            variant="secondary"
            className="w-full py-5 text-xl"
            onClick={() => {
              // TODO: Redirecionar para o lobby/matchmaking quando existir
              console.log('Modo Multiplayer selecionado');
            }} 
          />
        </div>

      </main>
    </div>
  );
}
