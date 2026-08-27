import { ReactNode, useId, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const listId = useId();

  if (!list.length) return null;

  const firstOptions = list.slice(0, 3);
  const selectedOption = list.find((time) => (time.slug || time._id || time.id || '') === selectedTimeId);
  const collapsedOptions = selectedOption && !firstOptions.includes(selectedOption)
    ? [...firstOptions.slice(0, 2), selectedOption]
    : firstOptions;
  const visibleOptions = isExpanded ? list : collapsedOptions;
  const hiddenCount = list.length - 3;

  return (
    <section className="surface-subtle rounded-2xl p-3 sm:p-4">
      <div className="mb-3 flex items-center gap-3 px-1">
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${accentClass}`}>{icon}</span>
        <div>
          <h4 className="text-sm font-extrabold text-slate-100">{title}</h4>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
      </div>
      <div id={listId} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {visibleOptions.map((time) => {
          const id = time.slug || time._id || time.id || '';
          return <TimeCard key={id} time={time} isSelected={selectedTimeId === id} onClick={() => onSelect(id)} />;
        })}
      </div>
      {hiddenCount > 0 && (
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={listId}
          onClick={() => setIsExpanded((current) => !current)}
          className="mt-3 flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-extrabold text-slate-400 transition-colors hover:bg-slate-800/55 hover:text-slate-200"
        >
          {isExpanded ? <><ChevronUp size={15} /> Recolher</> : <><ChevronDown size={15} /> Ver mais ({hiddenCount})</>}
        </button>
      )}
    </section>
  );
}
