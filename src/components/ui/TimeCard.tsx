import { CheckCircle2, Clock3 } from 'lucide-react';
import { TimeOption } from '@/features/timeselection/service/time.service';

interface TimeCardProps {
  time: TimeOption;
  isSelected: boolean;
  onClick: () => void;
}

export function TimeCard({ time, isSelected, onClick }: TimeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`surface-interactive relative flex h-20 flex-col justify-between rounded-xl p-3 text-left active:scale-[0.98] ${
        isSelected ? 'border-analysis-blue bg-sky-400/15 ring-2 ring-analysis-blue/45 shadow-[0_8px_22px_rgba(56,189,248,0.16)]' : ''
      }`}
    >
      {isSelected && <CheckCircle2 aria-hidden="true" className="absolute right-2.5 top-2.5 text-analysis-blue" size={18} />}
      <span className={`grid h-7 w-7 place-items-center rounded-lg ${isSelected ? 'bg-analysis-blue text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
        <Clock3 size={15} />
      </span>
      <span className="block text-lg font-black tracking-tight text-slate-100">
        {time.minutos}+{time.incremento}
      </span>
    </button>
  );
}
