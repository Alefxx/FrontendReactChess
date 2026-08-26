import { useEffect, useRef, useState, useCallback } from 'react';
import { analysisService, AnalisePosicao } from '../../analysis/service/analysis.service';
import { MoveClassifierService } from '../service/moveClassifier.service';
import { openingService } from '../../analysis/service/opening.service';

const NEUTRAL_ANALYSIS: AnalisePosicao = {
  vantagemBrancas: 0,
  tipo: 'cp',
  valorOriginal: 0,
};

/** Analisa a fita da partida somente quando o jogador solicita o relatório final. */
export function useMoveClassification(
  historicoRealFens: string[],
  _isEvalBarEnabled: boolean,
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
          : await analysisService.avaliarFenSincrono(fenAtual, 15);

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
        // Uma posição inválida ou falha do worker não pode deixar o modal em progresso infinito.
        console.error('[MoveClassification] Erro ao avaliar posição:', error);
        avaliacoes.current[index] = NEUTRAL_ANALYSIS;
        setErroAnalise('Algumas posições não puderam ser calculadas pelo motor.');
      } finally {
        // Sempre contabilize o item atual, inclusive em caso de erro.
        if (!isPausado.current && !isDesmontado.current) {
          indiceAtual.current = index + 1;
          setProgressoFila({ avaliados: index + 1, total: historicoRef.current.length });
        }
      }
    }

    isProcessando.current = false;
  }, [onAvaliacaoPronta]);

  const iniciarAvaliacaoFimDeJogo = useCallback(() => {
    if (isDesmontado.current) return;
    isPausado.current = false;
    setProgressoFila({ avaliados: indiceAtual.current, total: historicoRef.current.length });
    void processarFilaBackground();
  }, [processarFilaBackground]);

  const pararAvaliacao = useCallback(() => {
    isPausado.current = true;
    analysisService.stopSyncAnalysis();
  }, []);

  return {
    progressoFila: { ...progressoFila, total: historicoRealFens.length },
    erroAnalise,
    iniciarAvaliacaoFimDeJogo,
    pararAvaliacao,
  };
}
