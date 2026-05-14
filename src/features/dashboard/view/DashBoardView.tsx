// src/features/dashboard/DashboardView.tsx
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { UserProfileWidget } from '@/components/ui/UserProfileWidget';

/**
 * DashboardView: Ponto central da aplicação após o login.
 * Apresenta o perfil do usuário e as principais rotas de ação.
 */
export function DashboardView() {
  const navigate = useNavigate();

  /** 
   * Mock de dados: Substituir pela integração com Zustand/Store global 
   * assim que o gerenciamento de estado for implementado.
   */
  const mockUser = {
    nome: "Thayná",
    rating: 1500,
    iniciais: "TH"
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col">
      
      {/* Navegação Superior: Logo e Atalho para Perfil */}
      <header className="flex justify-between items-center w-full mb-16">
        <Logo size="sm" />
        
        <UserProfileWidget 
          nome={mockUser.nome}
          rating={mockUser.rating}
          iniciais={mockUser.iniciais}
          onClick={() => navigate('/profile')}
        />
      </header>

      {/* Hero Section: Chamada para ação principal */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
            Pronto para a <span className="text-chess-green">Batalha?</span>
          </h1>
          <p className="text-slate-400 max-w-md mx-auto text-sm md:text-base">
            Inicie uma nova partida, analise seus movimentos ou estude estratégias de grandes mestres.
          </p>
        </div>

        <div className="mt-4 animate-bounce-slow">
          <Button 
            label="JOGAR AGORA" 
            size="lg" 
            onClick={() => navigate('/bots')} 
          />
        </div>
      </main>

    </div>
  );
}
