import { ReactNode } from 'react';
import { TimeCard } from '@/components/ui/TimeCard';
import { TimeOption } from '@/features/timeselection/service/time.service';

interface TimeGroupProps {
  title: string;
  description: string;
  icon: ReactNode;
  accentClass: string;
  list: TimeOption[];
  selectedTimeId: string | null;
  onSelect: (id: string) => void;
}

export function TimeGroup({ title, description, icon, accentClass, list, selectedTimeId, onSelect }: TimeGroupProps) {
  if (!list.length) return null;

  return (
    <section className="surface-subtle rounded-2xl p-3 sm:p-4">
      <div className="mb-3 flex items-center gap-3 px-1">
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${accentClass}`}>{icon}</span>
        <div>
          <h4 className="text-sm font-extrabold text-slate-100">{title}</h4>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {list.map((time) => {
          const id = time.slug || time._id || time.id || '';
          return <TimeCard key={id} time={time} isSelected={selectedTimeId === id} onClick={() => onSelect(id)} />;
        })}
      </div>
    </section>
  );
}
