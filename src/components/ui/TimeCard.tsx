import { TimeOption } from '@/features/timeselection/service/time.service';

interface TimeCardProps {
  time: TimeOption;
  isSelected: boolean;
  onClick: () => void;
}

export function TimeCard({ time, isSelected, onClick }: TimeCardProps) {
  return (
    <button
      onClick={onClick}
      className={`py-3 px-2 rounded-lg font-bold text-center transition-all shadow-sm active:scale-95
        ${isSelected 
          ? 'bg-analysis-blue text-slate-900 border-2 border-analysis-blue shadow-[0_0_10px_rgba(56,189,248,0.4)]' 
          : 'bg-slate-800 text-slate-300 border-2 border-slate-700 hover:border-slate-500 hover:bg-slate-700'}`}
    >
      {time.label}
    </button>
  );
}
