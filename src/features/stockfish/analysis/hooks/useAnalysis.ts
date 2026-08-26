// src/features/stockfish/analysis/hooks/useAnalysis.ts
import { useState, useEffect, useMemo } from 'react';
import { analysisService, AnalisePosicao } from '@/features/stockfish/analysis/service/analysis.service';
import { openingService } from '@/features/stockfish/analysis/service/opening.service';

/**
 * Hook dedicado exclusivamente à interface de usuário (EvalBar e Aberturas em tempo real).
 * @param gameFen A string FEN do tabuleiro atual.
 * @param isEvalBarEnabled Se false, desativa o motor para poupar CPU e ceder espaço à Fila de background.
 * @param depth Profundidade da análise do Stockfish (padrão: 15).
 */
export function useAnalysis(gameFen: string, isEvalBarEnabled: boolean = false, depth: number = 15) {
  const [evalData, setEvalData] = useState<AnalisePosicao | null>(null);

  // Identifica a abertura em tempo real sempre que a FEN mudar
  const currentOpening = useMemo(() => {
    if (!gameFen) return null;
    return openingService.getOpening(gameFen) || null;
  }, [gameFen]);

  useEffect(() => {
    // 1. Se a barra estiver desligada ou não houver FEN, limpamos a avaliação e paramos o worker
    if (!gameFen || !isEvalBarEnabled) {
      setEvalData(null);
      analysisService.stopAnalysis(); // Isso agora parará apenas o workerStream
      return;
    }

    // 2. Otimização: Se for a posição inicial cravada, mockamos a EvalBar para 0.00
    // Isso evita usar CPU desnecessariamente no turno 1 antes do primeiro movimento.
    if (openingService.isStartPosition(gameFen)) {
      setEvalData({ tipo: 'cp', valorOriginal: 0, vantagemBrancas: 0 } as AnalisePosicao);
    }

    // 3. Inicia a análise em streaming sempre que a FEN mudar (exclusivo para UI)
    analysisService.startAnalysis(gameFen, depth, (novaAnalise) => {
      setEvalData(novaAnalise);
    });

    // 4. Cleanup: Para a análise quando o componente desmontar ou a FEN mudar
    return () => {
      // Quando refatorarmos o Service, este método afetará APENAS o workerStream, 
      // deixando a fila de classificação (workerSync) rodar em paz.
      analysisService.stopAnalysis();
    };
  }, [gameFen, depth, isEvalBarEnabled]);

  return {
    evalData,          // Exportado com este nome para bater com o useMatch
    currentOpening,    // Nome da abertura devolvido para a UI (ex: "Defesa Siciliana")
    vantagemBrancas: evalData?.vantagemBrancas || 0,
    isMate: evalData?.tipo === 'mate'
  };
}
