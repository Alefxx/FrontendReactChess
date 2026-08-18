// src/features/timeselection/view/TimeView.tsx
import { ArrowLeft, Clock, Activity, Play } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { ColorSelector } from '@/components/ui/ColorSelector';
import { FeatureToggle } from '@/components/ui/FeatureToggle';
import { TimeGroup } from '@/components/ui/TimeGroup';
import { useTime } from '../hooks/useTime'; 

export function TimeView() {
  const {
    groupedTempos, // Pegamos o array já agrupado direto do Hook
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
    isEvalBarEnabled,
    setIsEvalBarEnabled,
    handleConfirmar,
    navigate
  } = useTime();

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-slate-950 px-4 sm:px-8 pt-6 pb-12 overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-chess-green/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-analysis-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col flex-1 h-full pb-24">
        
        {/* Cabeçalho */}
        <header className="flex items-center gap-4 mb-10">
          <IconButton icon={<ArrowLeft size={24} />} aria-label="Voltar" onClick={() => navigate(-1)} />
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Configurar <span className="text-transparent bg-clip-text bg-gradient-to-r from-chess-green to-[#b5f233]">Partida</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Contra: <span className="text-white font-bold bg-slate-800 px-2 py-0.5 rounded ml-1">
                {tipoPartida === 'local' ? guestName : botOponente?.nome}
              </span>
            </p>
          </div>
        </header>

        <main className="flex-1 flex flex-col gap-10">
          
          {/* Seção: Cor */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-slate-400 font-bold mb-4 text-center uppercase tracking-widest text-xs">Com qual cor você joga?</h3>
            <ColorSelector selected={selectedColor} onSelect={setSelectedColor} isMultiplayer={false} />
          </section>

          {/* Seção: Tempo */}
          <section className="flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
            <h3 className="text-slate-400 font-bold mb-4 text-center uppercase tracking-widest text-xs flex items-center justify-center gap-2">
              <Clock size={16} /> Controles de Tempo
            </h3>

            {isLoading ? (
              <div className="flex flex-col gap-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-[120px] bg-slate-900/40 rounded-2xl border border-slate-800/60 animate-pulse" />
                ))}
              </div>
            ) : errorMsg ? (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center font-medium">{errorMsg}</div>
            ) : (
              <div className="flex flex-col">
                {groupedTempos.map(group => (
                  <TimeGroup 
                    key={group.base} 
                    base={group.base} 
                    list={group.list} 
                    selectedTimeId={selectedTimeId}
                    onSelect={setSelectedTimeId}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Seção: Barra de Avaliação (Usando o Componente Refatorado) */}
          {!isLoading && !errorMsg && (
            <section className="flex justify-center mt-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both w-full">
              <FeatureToggle
                title="Barra de Avaliação"
                description="Vantagem do motor ao vivo"
                icon={<Activity size={22} />}
                isActive={isEvalBarEnabled}
                onToggle={() => setIsEvalBarEnabled(!isEvalBarEnabled)}
              />
            </section>
          )}
        </main>

        {/* Rodapé Fixo */}
        {!isLoading && !errorMsg && (
          <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent flex justify-center z-20">
            <Button 
              label={isCreatingMatch ? 'GERANDO TABULEIRO...' : 'COMEÇAR JOGO'} 
              size="lg" 
              icon={!isCreatingMatch && <Play size={20} className="fill-current" />}
              className="w-full max-w-md shadow-xl"
              disabled={!selectedTimeId || isCreatingMatch}
              onClick={handleConfirmar}
            />
          </div>
        )}
      </div>
    </div>
  );
}
