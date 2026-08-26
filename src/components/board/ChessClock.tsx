// src/components/board/ChessClock.tsx

interface ChessClockProps {
  formato: string;
  isActive: boolean;
  isLowTime: boolean;
}

export function ChessClock({ formato, isActive, isLowTime }: ChessClockProps) {
  if (formato === '∞') {
    return (
      <div className="bg-slate-900 px-4 py-2 rounded-lg font-mono text-slate-500 font-bold text-xl shadow-inner border border-slate-800">
        ∞
      </div>
    );
  }


  const colorClass = isActive 
    ? (isLowTime ? 'text-red-500 animate-pulse' : 'text-chess-green shadow-[0_0_10px_rgba(136,196,37,0.2)]') 
    : 'text-slate-600';

  return (
    <div className={`bg-slate-900 px-4 py-2 rounded-lg font-mono font-bold text-xl shadow-inner border border-slate-800 transition-colors ${colorClass}`}>
      {formato}
    </div>
  );
}
