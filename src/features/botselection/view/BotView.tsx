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
    <div className="w-full max-w-4xl mx-auto flex flex-col pt-4 pb-12">
      
      {/* Cabeçalho de Navegação */}
      <div className="flex items-center gap-4 mb-8">
        <IconButton 
          icon={<ArrowLeft size={24} />} 
          onClick={() => navigate('/dashboard')} 
        />
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
            Escolha seu <span className="text-analysis-blue">Oponente</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
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
        <div className="flex justify-center mt-auto">
          <Button 
            label="CONTINUAR" 
            size="lg" 
            variant={selectedBotId ? 'primary' : 'secondary'}
            onClick={handleAvancar}
          />
        </div>
      )}
    </div>
  );
}
