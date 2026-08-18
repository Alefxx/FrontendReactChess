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
      className={`py-3.5 px-2 rounded-xl font-bold text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-analysis-blue active:scale-95
        ${isSelected 
          ? 'bg-analysis-blue text-slate-950 border-2 border-analysis-blue shadow-[0_0_15px_rgba(56,189,248,0.3)] -translate-y-1' 
          : 'bg-slate-900 text-slate-300 border-2 border-slate-700 hover:border-slate-500 hover:bg-slate-800 hover:text-white'}`}
    >
      {time.label}
    </button>
  );
}
