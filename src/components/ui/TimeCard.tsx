import { Clock3 } from 'lucide-react';
import { TimeOption } from '@/features/timeselection/service/time.service';

interface TimeCardProps {
  time: TimeOption;
  isSelected: boolean;
  onClick: () => void;
}

export function TimeCard({ time, isSelected, onClick }: TimeCardProps) {
  const incrementLabel = time.incremento > 0 ? `+${time.incremento}s` : 'Sem incremento';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`surface-interactive flex min-h-24 flex-col justify-between rounded-xl p-3 text-left active:scale-[0.98] ${
        isSelected ? 'border-analysis-blue bg-sky-400/10 shadow-[0_8px_22px_rgba(56,189,248,0.13)]' : ''
      }`}
    >
      <span className={`grid h-7 w-7 place-items-center rounded-lg ${isSelected ? 'bg-analysis-blue text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
        <Clock3 size={15} />
      </span>
      <span>
        <span className="block text-lg font-black tracking-tight text-slate-100">{time.minutos}+{time.incremento}</span>
        <span className="block text-[11px] font-medium text-slate-400">{time.minutos} min · {incrementLabel}</span>
      </span>
    </button>
  );
}
