import { pieceImages } from '../pieces/ChessPiece';

interface CapturedPiecesProps {
  fen: string;
  capturedColor: 'white' | 'black'; 
}

export function CapturedPieces({ fen, capturedColor }: CapturedPiecesProps) {

  const initial = { q: 1, r: 2, b: 2, n: 2, p: 8 };
  

  const current: Record<string, number> = { q: 0, r: 0, b: 0, n: 0, p: 0 };
  const fenBoard = fen.split(' ')[0];
  
  for (let char of fenBoard) {
    
    const isWhitePiece = char === char.toUpperCase();
    
    if ((capturedColor === 'white' && isWhitePiece) || (capturedColor === 'black' && !isWhitePiece)) {
      const lower = char.toLowerCase();
      if (current[lower] !== undefined) {
        current[lower]++;
      }
    }
  }

  const captured: Record<string, number> = {
    q: Math.max(0, initial.q - current.q),
    r: Math.max(0, initial.r - current.r),
    b: Math.max(0, initial.b - current.b),
    n: Math.max(0, initial.n - current.n),
    p: Math.max(0, initial.p - current.p),
  };

  const piecesToRender: string[] = [];
  const order = ['q', 'r', 'b', 'n', 'p'];
  
  order.forEach(type => {
    for (let i = 0; i < captured[type]; i++) {
      piecesToRender.push(type);
    }
  });

  if (piecesToRender.length === 0) return null; 

  const prefix = capturedColor === 'white' ? 'w' : 'b';

  return (
    <div className="flex flex-wrap items-center pt-1 ml-1 h-6">
      {piecesToRender.map((type, idx) => (
        <img 
          key={`${type}-${idx}`}
          src={pieceImages[`${prefix}${type.toUpperCase()}`]} 
          alt={`Captured ${type}`}
          draggable="false"
          className="w-5 h-5 sm:w-6 sm:h-6 object-contain -ml-1.5 drop-shadow-sm pointer-events-none"
        />
      ))}
    </div>
  );
}
