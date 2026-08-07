// src/features/stockfish/analysis/hooks/useAnalysis.ts
import { useState, useEffect } from 'react';
import { analysisService, AnalisePosicao } from '@/features/stockfish/analysis/service/analysis.service';

/**
 * Hook dedicado exclusivamente à interface de usuário (EvalBar em tempo real).
 * @param isEvalBarEnabled Se false, desativa o motor para poupar CPU e ceder espaço à Fila de background.
 */
export function useAnalysis(gameFen: string, isEvalBarEnabled: boolean = false, depth: number = 15) {
  const [analise, setAnalise] = useState<AnalisePosicao | null>(null);

  useEffect(() => {
    // Se não tiver FEN ou a barrinha visual estiver desativada pelo usuário, não faz nada.
    if (!gameFen || !isEvalBarEnabled) {
      setAnalise(null);
      return;
    }

    // Inicia a análise em streaming sempre que a FEN mudar (exclusivo para UI)
    analysisService.startAnalysis(gameFen, depth, (novaAnalise) => {
      setAnalise(novaAnalise);
    });

    // Cleanup: Para a análise quando o componente desmontar ou a FEN mudar
    return () => {
      analysisService.stopAnalysis();
    };
  }, [gameFen, depth, isEvalBarEnabled]);

  return {
    analise,
    vantagemBrancas: analise?.vantagemBrancas || 0,
    isMate: analise?.tipo === 'mate'
  };
}
