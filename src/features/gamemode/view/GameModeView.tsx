import { Bot, ChevronRight, House, Users } from 'lucide-react';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { UserProfileWidget } from '@/components/ui/UserProfileWidget';
import { useAuthStore } from '@/store/authStore';

interface ModeCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  accent: string;
  onClick: () => void;
}

function ModeCard({ title, description, icon, accent, onClick }: ModeCardProps) {
  return (
    <button type="button" onClick={onClick} className="surface-interactive group flex w-full items-center gap-4 rounded-2xl p-4 text-left sm:p-5">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${accent}`}>{icon}</span>
      <span className="min-w-0 flex-1"><span className="block text-base font-black text-white">{title}</span><span className="mt-1 block text-sm text-slate-400">{description}</span></span>
      <ChevronRight size={20} className="shrink-0 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-slate-200" />
    </button>
  );
}

export function GameModeView() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const initials = (user?.nome || 'Jogador').slice(0, 2).toUpperCase();

  return (
    <div className="page-container flex min-h-[calc(100vh-2rem)] flex-col py-2 sm:min-h-[calc(100vh-3rem)] sm:py-3">
      <header className="surface-subtle flex items-center justify-between rounded-2xl px-3 py-2.5 sm:px-4">
        <button type="button" className="rounded-lg" onClick={() => navigate('/dashboard')} aria-label="Voltar ao início"><Logo size="sm" /></button>
        <UserProfileWidget nome={user?.nome || 'Jogador'} rating={user?.rating || 1500} iniciais={initials} foto={user?.foto} onClick={() => navigate('/profile')} />
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-8 sm:py-12">
        <div className="mb-7 text-center"><h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Como você quer <span className="text-chess-green">jogar?</span></h1></div>
        <div className="space-y-3">
          <ModeCard title="Contra bots" description="Treine contra uma IA no nível que preferir." icon={<Bot size={24} />} accent="bg-analysis-blue/12 text-analysis-blue" onClick={() => navigate('/bots')} />
          <ModeCard title="Partida presencial" description="Jogue com outra pessoa no mesmo aparelho." icon={<Users size={24} />} accent="bg-violet-400/12 text-violet-300" onClick={() => navigate('/localview')} />
          <ModeCard title="Multiplayer online" description="Em breve: encontre jogadores em tempo real." icon={<House size={24} />} accent="bg-slate-700/70 text-slate-300" onClick={() => undefined} />
        </div>
      </main>
    </div>
  );
}
