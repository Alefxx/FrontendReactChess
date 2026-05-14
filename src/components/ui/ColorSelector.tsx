import { Dices } from 'lucide-react'; // Ícone de dados para o "Aleatório"

export type PlayerColor = 'white' | 'black' | 'random';

interface ColorSelectorProps {
  selected: PlayerColor;
  onSelect: (color: PlayerColor) => void;
  isMultiplayer?: boolean;
}

export function ColorSelector({ selected, onSelect, isMultiplayer = false }: ColorSelectorProps) {
  return (
    <div className="flex gap-4 justify-center w-full max-w-sm mx-auto">
      {/* Botão BRANCAS */}
      <button
        onClick={() => onSelect('white')}
        className={`flex-1 py-4 rounded-xl border-2 flex items-center justify-center transition-all shadow-md active:scale-95
          ${selected === 'white' ? 'border-chess-green bg-slate-800' : 'border-slate-700 bg-slate-900 hover:border-slate-500'}`}
      >
        <div className="w-8 h-8 rounded-full bg-slate-100 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-slate-300"></div>
      </button>

      {/* Botão ALEATÓRIO */}
      <button
        onClick={() => onSelect('random')}
        disabled={isMultiplayer}
        className={`flex-1 py-4 rounded-xl border-2 flex items-center justify-center transition-all shadow-md 
          ${isMultiplayer ? 'opacity-30 cursor-not-allowed border-slate-800 bg-slate-900' : 'active:scale-95'}
          ${selected === 'random' ? 'border-analysis-blue bg-slate-800 text-analysis-blue' : 'border-slate-700 bg-slate-900 text-slate-500 hover:border-slate-500'}`}
      >
        <Dices size={32} />
      </button>

      {/* Botão PRETAS */}
      <button
        onClick={() => onSelect('black')}
        className={`flex-1 py-4 rounded-xl border-2 flex items-center justify-center transition-all shadow-md active:scale-95
          ${selected === 'black' ? 'border-chess-green bg-slate-800' : 'border-slate-700 bg-slate-900 hover:border-slate-500'}`}
      >
        <div className="w-8 h-8 rounded-full bg-slate-900 shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.1)] border border-slate-950"></div>
      </button>
    </div>
  );
}
