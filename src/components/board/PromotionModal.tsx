// src/components/board/PromotionModal.tsx
import React from 'react';
import { ChessPiece, pieceImages } from '../pieces/ChessPiece';

interface PromotionModalProps {
  cor: 'branca' | 'preta';
  onSelect: (peca: 'q' | 'r' | 'b' | 'n') => void; 
}

export function PromotionModal({ cor, onSelect }: PromotionModalProps) {
  const prefix = cor === 'branca' ? 'w' : 'b';
  
  const options: { id: 'q' | 'r' | 'b' | 'n', img: string }[] = [
    { id: 'q', img: pieceImages[`${prefix}Q`] },
    { id: 'r', img: pieceImages[`${prefix}R`] },
    { id: 'b', img: pieceImages[`${prefix}B`] },
    { id: 'n', img: pieceImages[`${prefix}N`] },
  ];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-sm">
      <div className="bg-slate-800 p-4 rounded-xl border-2 border-slate-600 shadow-2xl flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-700 hover:bg-slate-500 rounded-lg flex items-center justify-center transition-colors shadow-inner"
          >
            <img src={opt.img} alt={opt.id} className="w-4/5 h-4/5 drop-shadow-md pointer-events-none" />
          </button>
        ))}
      </div>
    </div>
  );
}
