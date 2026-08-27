import { ArrowUpRight, Swords } from 'lucide-react';
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
    <div className="page-container flex min-h-[calc(100vh-2rem)] flex-col py-2 sm:min-h-[calc(100vh-3rem)] sm:py-3 lg:min-h-[calc(100vh-4rem)]">
      <header className="surface-subtle flex items-center justify-between rounded-2xl px-3 py-2.5 sm:px-4">
        <Logo size="sm" />
        <UserProfileWidget nome={user?.nome || 'Jogador'} rating={user?.rating || 1500} iniciais={initials} foto={user?.foto} onClick={() => navigate('/profile')} />
      </header>

      <main className="grid flex-1 items-center gap-5 py-8 lg:grid-cols-[1.25fr_.75fr] lg:py-12">
        <section className="max-w-2xl">
          <h1 className="max-w-xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">Cada lance é uma chance de jogar <span className="text-chess-green">melhor.</span></h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">Desafie os bots, pratique presencialmente e use a análise para entender suas escolhas.</p>
          <div className="mt-8 flex">
            <Button label="Nova partida" size="lg" icon={<Swords size={20} />} onClick={() => navigate('/gamemode')} />
          </div>
        </section>

        <section className="surface-card rounded-3xl p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white">Encontre seu ritmo.</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">Escolha o formato, ajuste o relógio e comece a jogar.</p>
          <button type="button" onClick={() => navigate('/gamemode')} className="mt-6 flex items-center gap-2 text-sm font-extrabold text-analysis-blue transition-colors hover:text-sky-200">Escolher modo de jogo <ArrowUpRight size={16} /></button>
        </section>
      </main>
    </div>
  );
}
