import { useState, useEffect } from 'react';
import { analysisService, AnalisePosicao } from '@/features/stockfish/analysis/service/analysis.service';

export function useAnalysis(gameFen: string, depth: number = 15) {
  const [analise, setAnalise] = useState<AnalisePosicao | null>(null);

  useEffect(() => {
    if (!gameFen) return;

    // Inicia a análise sempre que a FEN mudar
    analysisService.startAnalysis(gameFen, depth, (novaAnalise) => {
      setAnalise(novaAnalise);
    });

    // Cleanup: Para a análise quando o componente desmontar ou a FEN mudar
    return () => {
      analysisService.stopAnalysis();
    };
  }, [gameFen, depth]);

  return {
    analise,
    vantagemBrancas: analise?.vantagemBrancas || 0,
    isMate: analise?.tipo === 'mate'
  };
}
