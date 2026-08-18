// src/components/board/EvalBar.tsx
import React from 'react';
import { calcularAlturaBarraBranca, formatarTextoAvaliacao } from '@/features/stockfish/analysis/utils/evalBar.utils';

interface EvalBarProps {
  vantagemBrancas: number;
  isMate: boolean;
  isInvertida?: boolean; 
}

export function EvalBar({ vantagemBrancas, isMate, isInvertida = false }: EvalBarProps) {
  const alturaBranca = calcularAlturaBarraBranca(vantagemBrancas, isMate);
  const textoAvaliacao = formatarTextoAvaliacao(vantagemBrancas, isMate);
  
  const brancasGanhando = vantagemBrancas > 0;

  const backgroundColorTop = isInvertida ? 'bg-slate-200' : 'bg-slate-800';
  const backgroundColorBottom = isInvertida ? 'bg-slate-800' : 'bg-slate-200';
  
  const preenchimentoBottom = isInvertida ? (100 - alturaBranca) : alturaBranca;

  return (
    // Trocamos Flexbox por Position Relative para garantir estabilidade visual
    <div className={`relative w-6 md:w-8 h-full min-h-[300px] sm:min-h-[400px] rounded overflow-hidden border border-slate-700 shadow-inner ${backgroundColorTop}`}>
      
      {/* Container dinâmico (com absolute ele nunca perde o tamanho real) */}
      <div 
        className={`absolute bottom-0 left-0 w-full transition-all duration-500 ease-in-out ${backgroundColorBottom}`}
        style={{ height: `${preenchimentoBottom}%` }}
      />

      {/* Texto da Avaliação */}
      <div 
        className={`absolute w-full text-center text-[10px] sm:text-xs font-bold p-1 transition-all duration-500 z-10
          ${brancasGanhando 
            ? 'top-0 text-slate-800' 
            : 'bottom-0 text-slate-300' 
          }
        `}
      >
        {textoAvaliacao}
      </div>
    </div>
  );
}
