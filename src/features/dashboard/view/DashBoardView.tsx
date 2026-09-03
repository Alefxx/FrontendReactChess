import { Swords } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { UserProfileWidget } from '@/components/ui/UserProfileWidget';
import { useAuthStore } from '@/store/authStore';

export function DashboardView() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const initials = (user?.nome || 'Jogador').slice(0, 2).toUpperCase();

  return (
    <div className="page-container flex min-h-[calc(100vh-2rem)] flex-col py-2 sm:min-h-[calc(100vh-3rem)] sm:py-3">
      <header className="surface-subtle flex items-center justify-between rounded-2xl px-3 py-2.5 sm:px-4">
        <Logo size="sm" />
        <UserProfileWidget 
          nome={user?.nome || 'Jogador'} 
          rating={user?.rating || 1500} 
          iniciais={initials} 
          foto={user?.foto} 
          onClick={() => navigate('/profile')} 
        />
      </header>

      <main className="flex flex-1 items-center py-8 lg:py-12">
        <section className="max-w-2xl">
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Pronto para a <span className="text-chess-green">partida.</span>
          </h1>
          <p className="mt-4 max-w-lg text-base text-slate-400">
            Selecione o modo de jogo. Enfrente o Stockfish ou jogue presencialmente.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button 
              label="Jogar agora" 
              size="lg" 
              icon={<Swords size={20} />} 
              onClick={() => navigate('/gamemode')} 
            />
          </div>
        </section>
      </main>
    </div>
  );
}
