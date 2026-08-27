import { Dices } from 'lucide-react';

export type PlayerColor = 'white' | 'black' | 'random';

interface ColorSelectorProps {
  selected: PlayerColor;
  onSelect: (color: PlayerColor) => void;
  isMultiplayer?: boolean;
}

const options: { id: PlayerColor; label: string; description: string }[] = [
  { id: 'white', label: 'Brancas', description: 'Você abre a partida' },
  { id: 'random', label: 'Aleatória', description: 'Sorteio automático' },
  { id: 'black', label: 'Pretas', description: 'Você responde primeiro' },
];

export function ColorSelector({ selected, onSelect, isMultiplayer = false }: ColorSelectorProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
      {options.map(({ id, label, description }) => {
        const disabled = isMultiplayer && id === 'random';
        const isSelected = selected === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            disabled={disabled}
            className={`surface-interactive flex min-h-20 items-center gap-3 rounded-2xl p-3 text-left disabled:cursor-not-allowed disabled:opacity-35 ${
              isSelected ? 'border-chess-green bg-lime-400/8 shadow-[0_8px_24px_rgba(163,230,53,0.09)]' : ''
            }`}
          >
            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${
              id === 'white'
                ? 'border-slate-300 bg-slate-100 shadow-[inset_-2px_-2px_5px_rgba(0,0,0,0.2)]'
                : id === 'black'
                  ? 'border-slate-600 bg-slate-950 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.08)]'
                  : 'border-analysis-blue/50 bg-analysis-blue/10 text-analysis-blue'
            }`}>
              {id === 'random' ? <Dices size={22} /> : <span className={`h-5 w-5 rounded-full ${id === 'white' ? 'bg-white' : 'bg-slate-950'}`} />}
            </div>
            <span className="min-w-0">
              <span className="block text-sm font-extrabold text-slate-100">{label}</span>
              <span className="mt-0.5 block text-xs text-slate-400">{description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
