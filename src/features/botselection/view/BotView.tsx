import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Swords } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { BotCard } from '@/components/ui/BotCard';
import { Bot, botService } from '@/features/botselection/service/bot.service';

export function BotView() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBots = async () => {
      try {
        setIsLoading(true);
        const data = await botService.listarBots();
        setBots(data);
      } catch (error) {
        setErrorMsg('Falha de comunicação com os motores. Verifique sua conexão.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBots();
  }, []);

  const handleAvancar = () => {
    if (!selectedBotId) return;
    const botEscolhido = bots.find(b => b.id === selectedBotId);
    navigate('/time', { state: { bot: botEscolhido } });
  };

  return (
    // Fundo alinhado com o restante do app
    <div className="relative w-full min-h-screen flex flex-col bg-slate-950 px-4 sm:px-8 pt-6 pb-12 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-analysis-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col flex-1 h-full">
        
        {/* Cabeçalho */}
        <header className="flex items-center gap-4 mb-10">
          <IconButton 
            icon={<ArrowLeft size={24} />} 
            aria-label="Voltar para a dashboard"
            onClick={() => navigate('/gamemode')} 
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Escolha seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-analysis-blue to-[#60a5fa]">Oponente</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-1">
              Selecione o motor de xadrez ideal para o seu nível.
            </p>
          </div>
        </header>

        {/* Área de Conteúdo (Loading, Erro ou Lista) */}
        <main className="flex-1 flex flex-col">
          {isLoading ? (
            // Skeleton Loading refinado
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-[220px] bg-slate-900 rounded-2xl border-2 border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : errorMsg ? (
            <div className="flex flex-col items-center justify-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-md mx-auto mt-10 text-center">
              <span className="text-red-400 font-bold mb-2">Erro Crítico</span>
              <p className="text-slate-300 text-sm mb-6">{errorMsg}</p>
              <Button label="TENTAR NOVAMENTE" variant="outline" size="sm" onClick={() => window.location.reload()} />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pb-20">
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
        </main>

        {/* Rodapé Fixo com Botão (Só aparece se a lista carregou com sucesso) */}
        {!isLoading && !errorMsg && (
          <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex justify-center z-20">
            <Button 
              label="AVANÇAR PARA O JOGO" 
              size="lg" 
              icon={<Swords size={20} />}
              className="w-full max-w-md shadow-lg"
              disabled={!selectedBotId}
              onClick={handleAvancar}
            />
          </div>
        )}
      </div>
    </div>
  );
}
