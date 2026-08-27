
// O dicionário
export const pieceImages: Record<string, string> = {
    'bP': '/pieces/bP.svg',
    'bR': '/pieces/bR.svg',
    'bN': '/pieces/bN.svg',
    'bB': '/pieces/bB.svg',
    'bQ': '/pieces/bQ.svg',
    'bK': '/pieces/bK.svg',
    'wP': '/pieces/wP.svg',
    'wR': '/pieces/wR.svg',
    'wN': '/pieces/wN.svg',
    'wB': '/pieces/wB.svg',
    'wQ': '/pieces/wQ.svg',
    'wK': '/pieces/wK.svg'
};

interface ChessPieceProps {
  char: string;
}

export function ChessPiece({ char }: ChessPieceProps) {
  // Ponte lógica: Converte o caractere FEN ('p') para a chave da imagem ('bP')
  const isWhite = char === char.toUpperCase();
  const colorPrefix = isWhite ? 'w' : 'b';
  const typeUpper = char.toUpperCase();
  const imageKey = `${colorPrefix}${typeUpper}`;

  const imageSrc = pieceImages[imageKey];

  if (!imageSrc) return null;

  return (
    <img 
      src={imageSrc}
      alt={`Peça de xadrez ${imageKey}`}
      draggable="false"
      className="z-10 h-[88%] w-[88%] select-none object-contain drop-shadow-[0_3px_2px_rgba(0,0,0,0.45)] pointer-events-none"
    />
  );
}
