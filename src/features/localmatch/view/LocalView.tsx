// src/features/localmatch/view/LocalView.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';

/**
 * LocalView: Gerencia a configuração inicial para partidas pass-and-play (mesmo dispositivo).
 * Permite definir um nome para o jogador visitante antes de prosseguir para o tempo.
 */
export function LocalView() {
  const [guestName, setGuestName] = useState('');
  const navigate = useNavigate();

  /**
   * Prossegue para a configuração de tempo, enviando os dados do visitante via 'state'.
   * O payload é estruturado de forma similar ao BotView para manter a consistência na tela de tempo.
   */
  const handleAvancar = () => {
    const nomeVisitante = guestName.trim() || 'Visitante';
    
    // Encaminha a intenção de jogo local para a tela de tempo configurar o backend corretamente
    navigate('/time', { 
      state: { 
        tipoPartida: 'local',
        guestName: nomeVisitante
      } 
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col pt-4 pb-12 h-full">
      
      {/* Cabeçalho de Navegação */}
      <div className="flex items-center gap-4 mb-8">
        <IconButton 
          icon={<ArrowLeft size={24} />} 
          onClick={() => navigate('/dashboard')} 
        />
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
            Modo <span className="text-analysis-blue">Presencial</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Jogue com um amigo usando este mesmo aparelho.
          </p>
        </div>
      </div>

      {/* Formulário de Identificação do Visitante */}
      <div className="flex flex-col items-center justify-center flex-1 mt-10">
        <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 w-full max-w-md shadow-lg">
          <div className="flex justify-center mb-6 text-analysis-blue">
            <UserPlus size={48} />
          </div>
          
          <label className="block text-slate-300 mb-2 font-medium">
            Nome do seu adversário (opcional)
          </label>
          <input 
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Ex: Carlos, Maria, Visitante..."
            maxLength={15}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-analysis-blue focus:ring-1 focus:ring-analysis-blue transition-all"
          />
          <p className="text-xs text-slate-500 mt-3 text-center">
            Esta partida não afetará o Rating Elo da sua conta.
          </p>
        </div>
      </div>

      {/* Ação de confirmação */}
      <div className="flex justify-center mt-12">
        <Button 
          label="ESCOLHER TEMPO" 
          size="lg" 
          variant="primary"
          onClick={handleAvancar}
        />
      </div>
    </div>
  );
}
