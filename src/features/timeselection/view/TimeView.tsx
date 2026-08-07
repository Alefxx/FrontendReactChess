// src/features/timeselection/view/TimeView.tsx
import { ArrowLeft, Clock, Activity } from 'lucide-react'; // NOVO: Importamos Activity
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { ColorSelector } from '@/components/ui/ColorSelector';
import { TimeCard } from '@/components/ui/TimeCard';
import { useTime } from '../hooks/useTime'; 

/**
 * Componente que exibe a tela de configuração de partida, permitindo a seleção de cor e controle de tempo.
 */
export function TimeView() {
  const {
    tempos,
    isLoading,
    isCreatingMatch,
    errorMsg,
    selectedColor,
    setSelectedColor,
    selectedTimeId,
    setSelectedTimeId,
    botOponente,
    tipoPartida,
    guestName,
    isEvalBarEnabled, // NOVO: Trazendo o estado do hook
    setIsEvalBarEnabled, // NOVO: Trazendo o setter do hook
    handleConfirmar,
    navigate
  } = useTime();

  const isMultiplayer = false; 

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col pt-4 pb-12 min-h-[85vh]">
      
      {/* Cabeçalho da página com botão de voltar e informações do adversário */}
      <div className="flex items-center gap-4 mb-8">
        <IconButton 
          icon={<ArrowLeft size={24} />} 
          onClick={() => navigate(-1)} 
        />
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
            Configurar <span className="text-chess-green">Partida</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Contra: <span className="text-analysis-blue font-bold">
              {tipoPartida === 'local' ? guestName : botOponente?.nome}
            </span>
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-10">
        
        {/* Componente para seleção da cor das peças */}
        <section>
          <h3 className="text-slate-400 font-semibold mb-4 text-center uppercase tracking-widest text-sm">
            Com qual cor você joga?
          </h3>
          <ColorSelector 
            selected={selectedColor} 
            onSelect={setSelectedColor} 
            isMultiplayer={isMultiplayer} 
          />
        </section>

        {/* Componente para seleção do controle de tempo */}
        <section className="flex flex-col">
          <h3 className="text-slate-400 font-semibold mb-4 text-center uppercase tracking-widest text-sm flex items-center justify-center gap-2">
            <Clock size={16} />
            Controle de Tempo
          </h3>

          {/* Exibe o estado de carregamento, erro ou a grade de opções de tempo */}
          {isLoading ? (
            <div className="text-center text-slate-500 py-10 animate-pulse">Carregando relógios...</div>
          ) : errorMsg ? (
            <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200 text-center">{errorMsg}</div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {tempos.map((tempo) => {
                const identificador = tempo.slug || tempo._id || tempo.id || '';
                
                return (
                  <TimeCard 
                    key={identificador} 
                    time={tempo} 
                    isSelected={selectedTimeId === identificador}
                    onClick={() => setSelectedTimeId(identificador)}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* NOVO: Componente de configuração da Barra de Avaliação (Toggle) */}
        {!isLoading && !errorMsg && (
          <section className="flex justify-center mt-2">
            <div 
              onClick={() => setIsEvalBarEnabled(!isEvalBarEnabled)}
              className="flex items-center justify-between w-full max-w-md p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isEvalBarEnabled ? 'bg-analysis-blue/20 text-analysis-blue' : 'bg-slate-700 text-slate-400'}`}>
                  <Activity size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-medium">Barra de Avaliação</span>
                  <span className="text-xs text-slate-400">Mostra a vantagem do motor em tempo real</span>
                </div>
              </div>
              
              {/* Switch Visual */}
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${isEvalBarEnabled ? 'bg-analysis-blue' : 'bg-slate-600'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isEvalBarEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </div>
          </section>
        )}

      </div>

      {/* Exibe mensagem de erro caso falhe a criação da partida após clicar em 'COMEÇAR JOGO' */}
      {errorMsg && !isLoading && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm text-center">
          {errorMsg}
        </div>
      )}

      {/* Botão para iniciar a partida */}
      {!isLoading && (
        <div className="flex justify-center mt-8">
          <Button 
            label={isCreatingMatch ? 'GERANDO TABULEIRO...' : 'COMEÇAR JOGO'} 
            size="lg" 
            variant={selectedTimeId ? 'primary' : 'secondary'}
            onClick={handleConfirmar}
          />
        </div>
      )}

    </div>
  );
}
