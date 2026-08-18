// src/components/board/PlayerPanel.tsx
import React from 'react';
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
  nome,
  rating,
  iniciais,
  foto,
  clockFormat,
  isClockActive,
  isLowTime,
  fen,
  capturedColor,
  position = 'top'
}: PlayerPanelProps) {
  
  // Bloco 1: Perfil e Relógio com Feedback Visual de Turno
  const ProfileAndClock = (
    <div className={`flex justify-between items-center p-2.5 rounded-xl transition-all duration-300 border
      ${isClockActive 
        ? 'bg-slate-800/80 border-slate-600 shadow-lg shadow-slate-900/50' 
        : 'bg-slate-900/40 border-transparent opacity-80'}`}
    >
      <UserProfileWidget 
        nome={nome} 
        rating={rating} 
        iniciais={iniciais} 
        foto={foto}
      />
      <div className={`transition-transform duration-300 ${isClockActive ? 'scale-105' : 'scale-100'}`}>
        <ChessClock 
          formato={clockFormat} 
          isActive={isClockActive} 
          isLowTime={isLowTime} 
        />
      </div>
    </div>
  );

  // Bloco 2: Peças Capturadas (Espaçamento ajustado)
  const Captured = (
    <div className={`px-3 ${position === 'top' ? 'mt-1' : 'mb-1'}`}>
      <CapturedPieces 
        fen={fen} 
        capturedColor={capturedColor} 
      />
    </div>
  );

  return (
    <div className="flex flex-col w-full max-w-[640px] mx-auto">
      {position === 'top' ? (
        <>
          {ProfileAndClock}
          {Captured}
        </>
      ) : (
        <>
          {Captured}
          {ProfileAndClock}
        </>
      )}
    </div>
  );
}
