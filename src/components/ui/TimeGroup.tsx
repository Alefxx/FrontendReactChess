import { useState, useEffect } from 'react';
import { Clock, Zap, Flame, Timer, Hourglass } from 'lucide-react';
import { TimeCard } from '@/components/ui/TimeCard';
import { TimeOption } from '@/features/timeselection/service/time.service';

interface TimeGroupProps {
  base: string;
  list: TimeOption[];
  selectedTimeId: string | null;
  onSelect: (id: string) => void;
}

export function TimeGroup({ base, list, selectedTimeId, onSelect }: TimeGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const baseNum = Number(base);
  let Icon = Clock;
  let iconColor = 'text-slate-400';
  let categoryName = 'Outros';

  if (!isNaN(baseNum)) {
    if (baseNum <= 2) { Icon = Zap; iconColor = 'text-yellow-400'; categoryName = 'Bullet'; }
    else if (baseNum <= 5) { Icon = Flame; iconColor = 'text-orange-500'; categoryName = 'Blitz'; }
    else if (baseNum <= 15) { Icon = Timer; iconColor = 'text-chess-green'; categoryName = 'Rápido'; }
    else { Icon = Hourglass; iconColor = 'text-analysis-blue'; categoryName = 'Clássico'; }
  }

  const showAll = isExpanded || list.length <= 3;
  const visibleList = showAll ? list : list.slice(0, 2);
  const hiddenCount = list.length - 2;

  useEffect(() => {
    if (!showAll) {
      const isSelectedHidden = list.slice(2).some((t) => {
        const id = t.slug || t._id || t.id || '';
        return id === selectedTimeId;
      });
      if (isSelectedHidden) setIsExpanded(true);
    }
  }, [selectedTimeId, showAll, list]);

  return (
    <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60 w-full mb-3 transition-all duration-300 hover:border-slate-700/80">
      <div className="flex items-center justify-between mb-4 px-1">
        <h4 className="text-slate-300 font-bold text-sm flex items-center gap-2">
          <Icon size={16} className={iconColor} fill="currentColor" fillOpacity={0.2} />
          {base === 'Outros' ? 'Outros Tempos' : `${base} Minuto${base !== '1' ? 's' : ''}`}
        </h4>
        <span className={`text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 shadow-sm ${iconColor}`}>
          {categoryName}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {visibleList.map((tempo) => {
          const id = tempo.slug || tempo._id || tempo.id || '';
          return (
            <TimeCard
              key={id}
              time={tempo}
              isSelected={selectedTimeId === id}
              onClick={() => onSelect(id)}
            />
          );
        })}
        
        {!showAll && (
          <button
            onClick={() => setIsExpanded(true)}
            className="py-3 px-2 rounded-xl font-bold text-center text-sm transition-all duration-200 border-2 border-dashed border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200 hover:bg-slate-800 active:scale-95"
          >
            +{hiddenCount} mais
          </button>
        )}
      </div>
    </div>
  );
}
