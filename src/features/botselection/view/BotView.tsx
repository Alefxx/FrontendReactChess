// src/features/matchconfig/BotView.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { BotCard } from '@/components/ui/BotCard';
import { Bot , botService } from '@/features/botselection/service/bot.service';

/**
 * BotView: Gerencia a listagem e seleção de motores de IA (Bots).
 */
export function BotView() {
  // Estados para controle de dados e UI
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);

  const navigate = useNavigate();

  // Ciclo de vida: Busca a lista de bots disponíveis ao montar o componente
  useEffect(() => {
    const fetchBots = async () => {
      try {
        setIsLoading(true);
        const data = await botService.listarBots();
        setBots(data);
      } catch (error) {
        setErrorMsg('Erro ao carregar os adversários. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBots();
  }, []);

  /**
   * Prossegue para a configuração de tempo, enviando o bot selecionado via 'state'.
   */
  const handleAvancar = () => {
    if (!selectedBotId) return;

    const botEscolhido = bots.find(b => b.id === selectedBotId);
    
    // Encaminha o objeto completo para evitar novas requisições na próxima tela
    navigate('/time', { state: { bot: botEscolhido } });
  };

  return (
    <div className="page-container max-w-6xl py-2 sm:py-5">
      
      {/* Cabeçalho de Navegação */}
      <div className="mb-7 flex items-start gap-3">
        <IconButton 
          icon={<ArrowLeft size={24} />} 
          onClick={() => navigate('/dashboard')} 
        />
        <div>
          <p className="mb-1 text-[11px] font-black uppercase tracking-[0.2em] text-analysis-blue">Nova partida</p>
          <h1 className="text-2xl font-black leading-tight text-white md:text-3xl">
            Escolha seu <span className="text-chess-green">oponente</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400 md:text-base">
            Selecione uma Inteligência Artificial para desafiar.
          </p>
        </div>
      </div>

      {/* Renderização Condicional: Loading, Erro ou Lista */}
      {isLoading ? (
        <div className="text-center text-slate-400 py-20 animate-pulse">
          Carregando motores de xadrez...
        </div>
      ) : errorMsg ? (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200 text-center">
          {errorMsg}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {bots.map((bot) => (
            <BotCard 
              key={bot.id} 
              bot={bot} 
              isSelected={selectedBotId === bot.id}
              onClick={() => setSelectedBotId(bot.id)}
            />
          ))}
        </div>
      )}

      {/* Ação de confirmação */}
      {!isLoading && !errorMsg && (
        <div className="mt-6 flex justify-center border-t border-slate-700/60 pt-5">
          <Button 
            label="CONTINUAR" 
            size="lg" 
            disabled={!selectedBotId}
            onClick={handleAvancar}
          />
        </div>
      )}
    </div>
  );
}
