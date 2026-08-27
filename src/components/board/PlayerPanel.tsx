import { UserProfileWidget } from '@/components/ui/UserProfileWidget';
import { ChessClock } from '@/components/board/ChessClock';
import { CapturedPieces } from '@/components/board/CapturedPieces';

interface PlayerPanelProps {
  nome: string;
  rating: number;
  iniciais: string;
  foto?: string;
  clockFormat: string;
  isClockActive: boolean;
  isLowTime: boolean;
  fen: string;
  capturedColor: 'white' | 'black';
  position?: 'top' | 'bottom';
}

export function PlayerPanel({
  nome, rating, iniciais, foto, clockFormat, isClockActive, isLowTime, fen, capturedColor, position = 'top',
}: PlayerPanelProps) {
  const profileAndClock = (
    <div className={`surface-subtle flex items-center justify-between gap-2 rounded-2xl p-2 transition-colors sm:p-2.5 ${isClockActive ? 'border-chess-green/45 bg-lime-400/5' : ''}`}>
      <UserProfileWidget nome={nome} rating={rating} iniciais={iniciais} foto={foto} />
      <ChessClock formato={clockFormat} isActive={isClockActive} isLowTime={isLowTime} />
    </div>
  );

  const captured = <CapturedPieces fen={fen} capturedColor={capturedColor} />;

  return (
    <div className="flex min-h-14 flex-col gap-1">
      {position === 'top' ? <>{profileAndClock}{captured}</> : <>{captured}{profileAndClock}</>}
    </div>
  );
}
