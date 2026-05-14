import React from 'react';

// O dicionário
export const pieceImages: Record<string, string> = {
    'bP': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
    'bR': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
    'bN': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
    'bB': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
    'bQ': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
    'bK': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
    'wP': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
    'wR': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
    'wN': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
    'wB': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
    'wQ': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
    'wK': 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg'
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
      
      className="w-[85%] h-[85%] object-contain drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] z-10 select-none pointer-events-none"
    />
  );
}
