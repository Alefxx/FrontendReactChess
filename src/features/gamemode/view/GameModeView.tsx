// src/features/gamemode/view/GameModeView.tsx
import { useNavigate } from 'react-router-dom';
import { Bot, Users, Globe2 } from 'lucide-react'; // Ícones adicionados
import { Logo } from '@/components/ui/Logo';
import { UserProfileWidget } from '@/components/ui/UserProfileWidget';
import { useAuthStore } from '@/store/authStore';

// Sub-componente apenas para essa tela
const ModeCard = ({ title, description, icon: Icon, onClick, isPrimary = false }: any) => (
  <button
    onClick={onClick}
    className={`group relative w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chess-green
      ${isPrimary 
        ? 'bg-gradient-to-r from-chess-green/10 to-transparent border-chess-green/30 hover:border-chess-green hover:bg-chess-green/20' 
        : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-500'
      }
    `}
  >
    <div className={`p-3 rounded-xl transition-colors duration-300 ${isPrimary ? 'bg-chess-green text-slate-900' : 'bg-slate-700 text-slate-300 group-hover:text-white group-hover:bg-slate-600'}`}>
      <Icon size={28} strokeWidth={2.5} />
    </div>
    <div>
      <h3 className={`text-xl font-bold ${isPrimary ? 'text-chess-green' : 'text-slate-100 group-hover:text-white'}`}>
        {title}
      </h3>
      <p className="text-sm text-slate-400 mt-1 line-clamp-1">
        {description}
      </p>
    </div>
    
    {/* Efeito de seta aparecendo no hover */}
    <div className="absolute right-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-slate-500">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    </div>
  </button>
);

export function GameModeView() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const getIniciais = (nome?: string) => {
    if (!nome) return '??';
    return nome.substring(0, 2).toUpperCase();
  };

  return (
    // Adicionado um fundo radial sutil para dar profundidade de "app"
    <div className="relative w-full min-h-screen flex flex-col bg-slate-950 px-4 sm:px-8 pt-6 pb-12 overflow-hidden">
      
      {/* Fundo glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-chess-green/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center w-full max-w-7xl mx-auto mb-16">
        <button 
          onClick={() => navigate('/')}
          className="hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chess-green rounded-lg p-1"
        >
          <Logo size="sm" />
        </button>
        
        <UserProfileWidget 
          nome={user?.nome || 'Jogador'}
          rating={user?.rating || 1500}
          iniciais={getIniciais(user?.nome)}
          foto={user?.foto}
          onClick={() => navigate('/profile')}
        />
      </header>

      {/* Conteúdo Principal */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-50 mb-3 tracking-tight">
            Modo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-chess-green to-[#b5f233]">Jogo</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg">
            Escolha como você quer jogar sua próxima partida.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <ModeCard 
            title="Jogar contra Bot"
            description="Desafie a IA do Chess Analysis"
            icon={Bot}
            isPrimary={true}
            onClick={() => navigate('/bots')}
          />
          
          <ModeCard 
            title="Partida Local"
            description="Jogue com um amigo no mesmo dispositivo"
            icon={Users}
            onClick={() => navigate('/localview')}
          />

          <ModeCard 
            title="Multiplayer Online"
            description="Encontre oponentes do mesmo nível"
            icon={Globe2}
            onClick={() => console.log('Modo Multiplayer selecionado')}
          />
        </div>

      </main>
    </div>
  );
}
