import { useRef } from 'react';
import { ArrowLeft, Clock3, Flame, Hourglass, Timer, Zap } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { ColorSelector } from '@/components/ui/ColorSelector';
import { FeatureToggle } from '@/components/ui/FeatureToggle';
import { TimeGroup } from '@/components/ui/TimeGroup';
import { useTime } from '../hooks/useTime';

export function TimeView() {
  const playAreaRef = useRef<HTMLDivElement>(null);
  const {
    tempos, isLoading, isCreatingMatch, errorMsg, selectedColor, setSelectedColor,
    selectedTimeId, setSelectedTimeId, botOponente, tipoPartida, guestName,
    isEvalBarEnabled, setIsEvalBarEnabled, handleConfirmar, navigate,
  } = useTime();

  const timeGroups = [
    { title: 'Bullet', icon: <Zap size={18} />, accentClass: 'bg-amber-400/12 text-amber-300', list: tempos.filter((time) => time.minutos <= 2) },
    { title: 'Blitz', icon: <Flame size={18} />, accentClass: 'bg-orange-400/12 text-orange-300', list: tempos.filter((time) => time.minutos > 2 && time.minutos <= 5) },
    { title: 'Rápida', icon: <Timer size={18} />, accentClass: 'bg-lime-400/12 text-chess-green', list: tempos.filter((time) => time.minutos > 5 && time.minutos <= 15) },
    { title: 'Clássica', icon: <Hourglass size={18} />, accentClass: 'bg-sky-400/12 text-analysis-blue', list: tempos.filter((time) => time.minutos > 15) },
  ];

  const guideToPlay = () => requestAnimationFrame(() => {
    playAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  const handleTimeSelect = (id: string) => {
    setSelectedTimeId(id);
    guideToPlay();
  };

  const handleColorSelect = (color: Parameters<typeof setSelectedColor>[0]) => {
    setSelectedColor(color);
    if (selectedTimeId) guideToPlay();
  };

  return (
    <div className="page-container max-w-6xl py-2 sm:py-5">
      <header className="mb-6 flex items-center gap-4 sm:mb-8">
        <IconButton icon={<ArrowLeft size={20} />} onClick={() => navigate(-1)} />
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Nova <span className="text-chess-green">partida</span></h1>
          <p className="mt-1 text-sm text-slate-400">Contra <span className="font-bold text-slate-200">{tipoPartida === 'local' ? guestName : botOponente?.nome}</span></p>
        </div>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(17rem,.78fr)_minmax(0,1.22fr)]">
        <aside className="surface-card rounded-3xl p-4 sm:p-6 lg:sticky lg:top-5">
          <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-chess-green/10 text-chess-green"><Clock3 size={20} /></span>
            <h2 className="text-lg font-black text-white">Setup da partida</h2>
          </div>
          
          <div className="space-y-6">
            <section>
              <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Cor das peças</h3>
              <ColorSelector selected={selectedColor} onSelect={handleColorSelect} />
            </section>
            
            <FeatureToggle
              title="Barra de avaliação"
              description="Exibe a leitura do motor ao vivo."
              icon={<Clock3 size={18} />}
              isActive={isEvalBarEnabled}
              onToggle={() => setIsEvalBarEnabled(!isEvalBarEnabled)}
            />
          </div>
        </aside>

        <section className="surface-card rounded-3xl p-4 sm:p-6">
          <h2 className="mb-5 text-lg font-black text-white">Controle de tempo</h2>
          
          {isLoading ? (
            <div className="grid min-h-72 place-items-center text-sm text-slate-400"><span className="animate-pulse">Carregando controles…</span></div>
          ) : errorMsg ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-200">{errorMsg}</div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {timeGroups.map((group) => (
                <TimeGroup key={group.title} {...group} selectedTimeId={selectedTimeId} onSelect={handleTimeSelect} />
              ))}
            </div>
          )}

          {!isLoading && !errorMsg && (
            <div ref={playAreaRef} className="mt-6 scroll-mt-4 border-t border-white/5 pt-6">
              <Button 
                label={isCreatingMatch ? 'Preparando partida…' : 'Jogar agora'} 
                size="lg" 
                className="w-full" 
                disabled={!selectedTimeId || isCreatingMatch} 
                onClick={handleConfirmar} 
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
