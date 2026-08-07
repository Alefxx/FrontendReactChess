
import React from 'react';

// Componentes da interface
import { UserProfileWidget } from '@/components/ui/UserProfileWidget';
import { ChessClock } from '@/components/board/ChessClock';
import { CapturedPieces } from '@/components/board/CapturedPieces';

interface PlayerPanelProps {
  // Dados do Jogador
  nome: string;
  rating: number;
  iniciais: string;
  foto?: string;

  // Dados do Relógio
  clockFormat: string;
  isClockActive: boolean;
  isLowTime: boolean;

  // Dados das Peças Capturadas
  fen: string;
  capturedColor: 'white' | 'black';
  
  // Define se as peças capturadas ficam acima ou abaixo do perfil 
  // ('top' para adversário no topo da tela, 'bottom' para usuário na base)
  position?: 'top' | 'bottom'; 
}

/**
 * PlayerPanel: Agrupa as informações de perfil, relógio e peças capturadas
 * de um jogador específico, limpando a visualização da tela principal.
 */
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
  
  // Bloco 1: Perfil e Relógio
  const ProfileAndClock = (
    <div className="flex justify-between items-center bg-slate-800/40 p-2 rounded-lg relative">
      <UserProfileWidget 
        nome={nome} 
        rating={rating} 
        iniciais={iniciais} 
        foto={foto}
      />
      <ChessClock 
        formato={clockFormat} 
        isActive={isClockActive} 
        isLowTime={isLowTime} 
      />
    </div>
  );

  // Bloco 2: Peças Capturadas
  const Captured = (
    <CapturedPieces 
      fen={fen} 
      capturedColor={capturedColor} 
    />
  );

  return (
    <div className="flex flex-col gap-1">
      {/* 
        A ordem muda dependendo se é o adversário (que fica no topo da tela e
        queremos as peças embaixo do perfil) ou o jogador atual (que fica na
        base da tela e queremos as peças em cima do perfil).
      */}
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
