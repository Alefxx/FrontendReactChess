import { ArrowLeft, Clock3, Flame, Hourglass, Timer, Zap } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { ColorSelector } from '@/components/ui/ColorSelector';
import { FeatureToggle } from '@/components/ui/FeatureToggle';
import { TimeGroup } from '@/components/ui/TimeGroup';
import { useTime } from '../hooks/useTime';

export function TimeView() {
  const {
    tempos, isLoading, isCreatingMatch, errorMsg, selectedColor, setSelectedColor,
    selectedTimeId, setSelectedTimeId, botOponente, tipoPartida, guestName,
    isEvalBarEnabled, setIsEvalBarEnabled, handleConfirmar, navigate,
  } = useTime();

  const timeGroups = [
    { title: 'Bullet', description: 'Para decisões instantâneas', icon: <Zap size={18} />, accentClass: 'bg-amber-400/12 text-amber-300', list: tempos.filter((time) => time.minutos <= 2) },
    { title: 'Blitz', description: 'Ritmo intenso e dinâmico', icon: <Flame size={18} />, accentClass: 'bg-orange-400/12 text-orange-300', list: tempos.filter((time) => time.minutos > 2 && time.minutos <= 5) },
    { title: 'Rápida', description: 'Equilíbrio para pensar', icon: <Timer size={18} />, accentClass: 'bg-lime-400/12 text-chess-green', list: tempos.filter((time) => time.minutos > 5 && time.minutos <= 15) },
    { title: 'Clássica', description: 'Partidas sem pressa', icon: <Hourglass size={18} />, accentClass: 'bg-sky-400/12 text-analysis-blue', list: tempos.filter((time) => time.minutos > 15) },
  ];

  return (
    <div className="page-container max-w-6xl py-2 sm:py-5">
      <header className="mb-6 flex items-start gap-3 sm:mb-8">
        <IconButton icon={<ArrowLeft size={20} />} onClick={() => navigate(-1)} />
        <div>
          <p className="mb-1 text-[11px] font-black uppercase tracking-[0.2em] text-analysis-blue">Nova partida</p>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Ajuste a sua <span className="text-chess-green">partida</span></h1>
          <p className="mt-1 text-sm text-slate-400">Você jogará contra <span className="font-semibold text-slate-200">{tipoPartida === 'local' ? guestName : botOponente?.nome}</span>.</p>
        </div>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(17rem,.78fr)_minmax(0,1.22fr)]">
        <aside className="surface-card rounded-3xl p-4 sm:p-5 lg:sticky lg:top-5">
          <div className="mb-5 flex items-center gap-3 border-b border-slate-700/60 pb-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-chess-green/12 text-chess-green"><Clock3 size={20} /></span>
            <div><h2 className="font-extrabold text-slate-100">Seu setup</h2><p className="text-xs text-slate-400">Defina cor e recursos.</p></div>
          </div>
          <div className="space-y-5">
            <section>
              <h3 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Cor das peças</h3>
              <ColorSelector selected={selectedColor} onSelect={setSelectedColor} />
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

        <section className="surface-card rounded-3xl p-4 sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div><h2 className="text-lg font-extrabold text-white">Controle de tempo</h2><p className="mt-1 text-sm text-slate-400">Escolha um ritmo para esta partida.</p></div>
            {selectedTimeId && <span className="rounded-full bg-analysis-blue/12 px-3 py-1 text-xs font-bold text-analysis-blue">Selecionado</span>}
          </div>
          {isLoading ? (
            <div className="grid min-h-72 place-items-center text-sm text-slate-400"><span className="animate-pulse">Carregando controles…</span></div>
          ) : errorMsg ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-200">{errorMsg}</div>
          ) : (
            <div className="grid gap-3">{timeGroups.map((group) => <TimeGroup key={group.title} {...group} selectedTimeId={selectedTimeId} onSelect={setSelectedTimeId} />)}</div>
          )}
          {!isLoading && !errorMsg && (
            <div className="mt-5 border-t border-slate-700/60 pt-5">
              <Button label={isCreatingMatch ? 'Preparando partida…' : 'Começar jogo'} size="lg" className="w-full" disabled={!selectedTimeId || isCreatingMatch} onClick={handleConfirmar} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
