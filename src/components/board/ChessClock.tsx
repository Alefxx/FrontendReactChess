// src/components/board/ChessClock.tsx

interface ChessClockProps {
  formato: string;
  isActive: boolean;
  isLowTime: boolean;
}

export function ChessClock({ formato, isActive, isLowTime }: ChessClockProps) {
  if (formato === '∞') {
    return (
      <div className="min-w-20 rounded-xl border border-slate-700/80 bg-slate-950/75 px-3 py-2 text-center font-mono text-lg font-black text-slate-500 shadow-inner">
        ∞
      </div>
    );
  }


  const colorClass = isActive 
    ? (isLowTime ? 'border-red-500/60 text-red-400 animate-pulse' : 'border-chess-green/55 text-chess-green shadow-[0_0_14px_rgba(163,230,53,0.14)]')
    : 'text-slate-500';

  return (
    <div className={`min-w-20 rounded-xl border border-slate-700/80 bg-slate-950/75 px-3 py-2 text-center font-mono text-lg font-black shadow-inner transition-colors ${colorClass}`}>
      {formato}
    </div>
  );
}
