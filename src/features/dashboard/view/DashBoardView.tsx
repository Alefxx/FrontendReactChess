// src/features/dashboard/view/DashboardView.tsx
import { useNavigate } from 'react-router-dom';
import { Swords, LineChart, BookOpen } from 'lucide-react'; // Ícones adicionados
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { UserProfileWidget } from '@/components/ui/UserProfileWidget';
import { useAuthStore } from '@/store/authStore';

export function DashboardView() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const getIniciais = (nome?: string) => {
    if (!nome) return '??';
    return nome.substring(0, 2).toUpperCase();
  };

  return (
    // Fundo alinhado com o GameModeView (Dark profundo com glow)
    <div className="relative w-full min-h-screen flex flex-col bg-slate-950 px-4 sm:px-8 pt-6 pb-12 overflow-hidden">
      
      {/* Fundo glow central para dar destaque ao Hero */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-chess-green/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center w-full max-w-7xl mx-auto mb-16">
        <Logo size="sm" />
        
        <UserProfileWidget 
          nome={user?.nome || 'Jogador'}
          rating={user?.rating || 1500}
          iniciais={getIniciais(user?.nome)}
          foto={user?.foto}
          onClick={() => navigate('/profile')}
        />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-12 max-w-4xl mx-auto w-full">
        
        {/* Hero Section */}
        <div className="text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black text-slate-50 mb-4 tracking-tight">
            Pronto para a <span className="text-transparent bg-clip-text bg-gradient-to-r from-chess-green to-[#b5f233]">Batalha?</span>
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-base md:text-lg leading-relaxed">
            Inicie uma nova partida, analise seus movimentos mais recentes ou estude táticas de grandes mestres.
          </p>
        </div>

        {/* Ação Principal com Animação Discreta */}
        <div className="animate-[bounce_3s_ease-in-out_infinite]">
          <Button 
            label="JOGAR AGORA" 
            size="lg" 
            icon={<Swords size={24} />}
            className="text-xl px-12 py-5 shadow-chess-green/20 shadow-xl"
            onClick={() => navigate('/gamemode')} 
          />
        </div>

        {/* Ações Secundárias (Baseado na sua descrição) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mt-4">
          <Button 
            label="Analisar Partidas" 
            variant="secondary" 
            icon={<LineChart size={20} className="text-analysis-blue" />}
            onClick={() => console.log('Ir para análise')} 
          />
          <Button 
            label="Estudar Estratégias" 
            variant="secondary" 
            icon={<BookOpen size={20} className="text-slate-300" />}
            onClick={() => console.log('Ir para estudos')} 
          />
        </div>

      </main>
    </div>
  );
}
