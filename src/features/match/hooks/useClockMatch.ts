
// src/features/match/hooks/useClockMatch.ts
import { useState } from 'react';

/**
 * Hook responsável por gerenciar e sincronizar os tempos de jogo (brancas e pretas).
 */
export function useClockMatch(partidaData: any) {
  // Inicialização do tempo (convertido para segundos) com base no controle de tempo da partida
  const [tempoBrancas, setTempoBrancas] = useState<number | null>(
    partidaData?.controleTempo ? partidaData.controleTempo.minutos * 60 : null
  );
  
  const [tempoPretas, setTempoPretas] = useState<number | null>(
    partidaData?.controleTempo ? partidaData.controleTempo.minutos * 60 : null
  );

  /**
   * Atualiza os relógios locais com os valores autoritativos vindos do backend.
   * Utilizado para garantir que o tempo visual esteja em sincronia com o servidor após cada lance.
   */
  const atualizarTempos = (novosTempos?: { brancas: number; pretas: number }) => {
    if (novosTempos) {
      setTempoBrancas(novosTempos.brancas);
      setTempoPretas(novosTempos.pretas);
    }
  };

  return {
    tempoBrancas,
    tempoPretas,
    atualizarTempos
  };
}
