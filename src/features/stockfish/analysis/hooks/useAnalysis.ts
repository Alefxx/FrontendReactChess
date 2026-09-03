// src/features/stockfish/analysis/hooks/useAnalysis.ts
import { useState, useEffect } from 'react';
import { analysisService } from '@/features/stockfish/analysis/service/analysis.service';
import type { AnalisePosicao } from '@/features/stockfish/analysis/utils/evaluation.utils';
import { openingService } from '@/features/stockfish/analysis/service/opening.service';

const NEUTRAL_ANALYSIS: AnalisePosicao = {
  tipo: 'cp',
  valorOriginal: 0,
  vantagemBrancas: 0,
  profundidade: 0,
};

export function useAnalysis(gameFen: string, isEvalBarEnabled = false) {
  const [evaluation, setEvaluation] = useState<AnalisePosicao | null>(null);
  const [loadedOpening, setLoadedOpening] = useState<{ fen: string; opening: ReturnType<typeof openingService.getOpening> } | null>(null);
  const currentOpening = loadedOpening?.fen === gameFen
    ? loadedOpening.opening
    : openingService.getOpening(gameFen);

  useEffect(() => {
    let active = true;
    if (!gameFen || !isEvalBarEnabled) return;
    void openingService.loadOpenings()
      .then(() => {
        if (active) setLoadedOpening({ fen: gameFen, opening: openingService.getOpening(gameFen) });
      })
      .catch(() => {
        if (active) setLoadedOpening({ fen: gameFen, opening: null });
      });

    return () => {
      active = false;
    };
  }, [gameFen, isEvalBarEnabled]);

  useEffect(() => {
    if (!gameFen || !isEvalBarEnabled || openingService.isStartPosition(gameFen)) return;
    return analysisService.startAnalysis(gameFen, setEvaluation);
  }, [gameFen, isEvalBarEnabled]);

  const evalData = !gameFen || !isEvalBarEnabled
    ? null
    : openingService.isStartPosition(gameFen)
      ? NEUTRAL_ANALYSIS
      : evaluation;

  return {
    evalData,
    currentOpening,
    vantagemBrancas: evalData?.vantagemBrancas ?? 0,
    isMate: evalData?.tipo === 'mate',
  };
}
