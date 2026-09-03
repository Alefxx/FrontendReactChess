import { useEffect, useRef, useState, useCallback } from 'react';
import { analysisService } from '../../analysis/service/analysis.service';
import type { AnalisePosicao } from '../../analysis/utils/evaluation.utils';
import { isStockfishCancellation } from '../../engine.service';
import { MoveClassifierService } from '../service/moveClassifier.service';
import { openingService } from '../../analysis/service/opening.service';

const NEUTRAL_ANALYSIS: AnalisePosicao = {
  vantagemBrancas: 0,
  tipo: 'cp',
  valorOriginal: 0,
  profundidade: 0,
};

/** Analisa a fita da partida somente quando o jogador solicita o relatório final. */
export function useMoveClassification(
  historicoRealFens: string[],
  onAvaliacaoPronta: (codigo: number, id: number) => void,
) {
  const [progressoFila, setProgressoFila] = useState({ avaliados: 0, total: 0 });
  const [erroAnalise, setErroAnalise] = useState<string | null>(null);
  const historicoRef = useRef(historicoRealFens);
  const avaliacoes = useRef<AnalisePosicao[]>([]);
  const indiceAtual = useRef(0);
  const isProcessando = useRef(false);
  const isPausado = useRef(true);
  const isDesmontado = useRef(false);

  useEffect(() => {
    historicoRef.current = historicoRealFens;
  }, [historicoRealFens]);

  useEffect(() => {
    // O React StrictMode executa setup/cleanup uma vez extra em desenvolvimento.
    isDesmontado.current = false;

    return () => {
      isDesmontado.current = true;
      isPausado.current = true;
      analysisService.stopSyncAnalysis();
    };
  }, []);

  const processarFilaBackground = useCallback(async () => {
    if (isProcessando.current || isPausado.current || isDesmontado.current) return;

    isProcessando.current = true;
    setErroAnalise(null);

    try {
      try {
        await openingService.loadOpenings();
      } catch {
        console.warn('[MoveClassification] Livro indisponível; avaliando todos os lances no motor.');
      }

      while (!isPausado.current && !isDesmontado.current && indiceAtual.current < historicoRef.current.length) {
        const index = indiceAtual.current;
        const fenAtual = historicoRef.current[index];

        try {
          const isBookPosition = openingService.isStartPosition(fenAtual) || Boolean(openingService.getOpening(fenAtual));
          const analiseAtual = isBookPosition
            ? NEUTRAL_ANALYSIS
            : await analysisService.avaliarFenSincrono(fenAtual);

          if (isPausado.current || isDesmontado.current) break;

          avaliacoes.current[index] = analiseAtual;

          if (index > 0) {
            const codigo = isBookPosition
              ? 0
              : MoveClassifierService.classificar(
                  avaliacoes.current[index - 1] ?? NEUTRAL_ANALYSIS,
                  analiseAtual,
                  fenAtual.split(' ')[1] === 'b' ? 'w' : 'b',
                );
            onAvaliacaoPronta(codigo, index);
          }
        } catch (error) {
          if (isStockfishCancellation(error) || isPausado.current || isDesmontado.current) break;
          console.error('[MoveClassification] Erro ao avaliar posição:', error);
          avaliacoes.current[index] = NEUTRAL_ANALYSIS;
          setErroAnalise('Algumas posições não puderam ser calculadas pelo motor.');
        } finally {
          if (!isPausado.current && !isDesmontado.current) {
            indiceAtual.current = index + 1;
            setProgressoFila({
              avaliados: Math.min(index, historicoRef.current.length - 1),
              total: Math.max(0, historicoRef.current.length - 1),
            });
          }
        }
      }
    } finally {
      isProcessando.current = false;
    }
  }, [onAvaliacaoPronta]);

  const iniciarAvaliacaoFimDeJogo = useCallback(() => {
    if (isDesmontado.current) return;
    isPausado.current = false;
    setProgressoFila({
      avaliados: Math.max(0, indiceAtual.current - 1),
      total: Math.max(0, historicoRef.current.length - 1),
    });
    void processarFilaBackground();
  }, [processarFilaBackground]);

  const pararAvaliacao = useCallback(() => {
    isPausado.current = true;
    analysisService.stopSyncAnalysis();
  }, []);

  return {
    progressoFila: { ...progressoFila, total: Math.max(0, historicoRealFens.length - 1) },
    erroAnalise,
    iniciarAvaliacaoFimDeJogo,
    pararAvaliacao,
  };
}
