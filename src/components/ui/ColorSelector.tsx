import { Dices } from 'lucide-react';

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
        aria-label="Jogar com as peças brancas"
        className={`flex-1 py-4 rounded-xl border-2 flex items-center justify-center transition-all duration-200 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chess-green active:scale-95
          ${selected === 'white' ? 'border-chess-green bg-slate-800 shadow-[0_0_15px_rgba(136,196,37,0.15)]' : 'border-slate-700 bg-slate-900 hover:border-slate-600 hover:bg-slate-800'}`}
      >
        <div className="w-10 h-10 rounded-full bg-slate-100 shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.3)] border border-slate-200"></div>
      </button>

      {/* Botão ALEATÓRIO */}
      <button
        onClick={() => onSelect('random')}
        disabled={isMultiplayer}
        aria-label="Escolher cor aleatoriamente"
        className={`flex-1 py-4 rounded-xl border-2 flex items-center justify-center transition-all duration-200 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-analysis-blue
          ${isMultiplayer ? 'opacity-30 cursor-not-allowed border-slate-800 bg-slate-900' : 'active:scale-95 cursor-pointer'}
          ${selected === 'random' ? 'border-analysis-blue bg-slate-800 text-analysis-blue shadow-[0_0_15px_rgba(56,189,248,0.15)]' : 'border-slate-700 bg-slate-900 text-slate-500 hover:border-slate-600 hover:text-slate-300 hover:bg-slate-800'}`}
      >
        <Dices size={32} strokeWidth={2} />
      </button>

      {/* Botão PRETAS */}
      <button
        onClick={() => onSelect('black')}
        aria-label="Jogar com as peças pretas"
        className={`flex-1 py-4 rounded-xl border-2 flex items-center justify-center transition-all duration-200 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chess-green active:scale-95
          ${selected === 'black' ? 'border-chess-green bg-slate-800 shadow-[0_0_15px_rgba(136,196,37,0.15)]' : 'border-slate-700 bg-slate-900 hover:border-slate-600 hover:bg-slate-800'}`}
      >
        <div className="w-10 h-10 rounded-full bg-[#1e1e1e] shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.5),inset_2px_2px_4px_rgba(255,255,255,0.1),0_4px_6px_rgba(0,0,0,0.4)] border border-black"></div>
      </button>
    </div>
  );
}
