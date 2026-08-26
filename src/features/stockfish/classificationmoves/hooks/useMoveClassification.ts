// src/features/stockfish/classificationmoves/hooks/useMoveClassification.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { analysisService, AnalisePosicao } from '../../analysis/service/analysis.service';
import { MoveClassifierService } from '../service/moveClassifier.service';
import { openingService } from '../../analysis/service/opening.service';

export function useMoveClassification(
  historicoRealFens: string[], // Array completo do histórico real de jogo
  isEvalBarEnabled: boolean,
  onAvaliacaoPronta: (codigo: number, id: number) => void 
) {
  
  const [progressoFila, setProgressoFila] = useState({ avaliados: 0, total: 0 });
  
  const avaliacoes = useRef<AnalisePosicao[]>([]);
  const indiceAtual = useRef<number>(0);
  
  const isProcessando = useRef(false);
  const isPausado = useRef(isEvalBarEnabled); 
  const isDesmontado = useRef(false); // NOVO: Previne memory leak se o componente sumir

  // Cleanup na desmontagem
  useEffect(() => {
    return () => {
      isDesmontado.current = true;
      isPausado.current = true;
    };
  }, []);

  // 1. Controle de pausa sincronizado com a UI
  useEffect(() => {
    isPausado.current = isEvalBarEnabled;
    if (!isEvalBarEnabled && !isDesmontado.current) {
      processarFilaBackground();
    }
  }, [isEvalBarEnabled]);

  // 2. Escuta APENAS o crescimento do array de histórico real
  useEffect(() => {
    setProgressoFila(p => ({ ...p, total: historicoRealFens.length }));
    
    if (!isPausado.current && historicoRealFens.length > indiceAtual.current && !isDesmontado.current) {
      processarFilaBackground();
    }
  }, [historicoRealFens.length]); 

  // 3. O Motor que consome a fila e intercepta lances de livro
  const processarFilaBackground = useCallback(async () => {
    if (isProcessando.current || isPausado.current || isDesmontado.current) return;
    
    isProcessando.current = true;

    while (indiceAtual.current < historicoRealFens.length && !isPausado.current && !isDesmontado.current) {
      const fenAtual = historicoRealFens[indiceAtual.current];
      
      try {
        const isStart = openingService.isStartPosition(fenAtual);
        const opening = openingService.getOpening(fenAtual);

        if (isStart || opening) {
          // Lance teórico! Pula o Stockfish e injeta um Mock neutro
          const analiseNeutra: AnalisePosicao = { 
            vantagemBrancas: 0, 
            tipo: 'cp', 
            valorOriginal: 0, // Corrigido para bater com a interface AnalisePosicao original
          } as AnalisePosicao;

          avaliacoes.current[indiceAtual.current] = analiseNeutra;

          if (indiceAtual.current > 0) {
            onAvaliacaoPronta(0, indiceAtual.current); 
          }
        } 
        else {
          // Saímos da teoria. Manda para o worker síncrono
          const analiseFinal = await analysisService.avaliarFenSincrono(fenAtual, 15);
          
          // Se pausou no meio da requisição, abandona o processamento atual
          if (isPausado.current || isDesmontado.current) break;

          avaliacoes.current[indiceAtual.current] = analiseFinal;

          if (indiceAtual.current > 0) {
             const evalAnterior = avaliacoes.current[indiceAtual.current - 1];
             const corQueJogou = fenAtual.split(' ')[1] === 'b' ? 'w' : 'b';
             
             const codigo = MoveClassifierService.classificar(evalAnterior, analiseFinal, corQueJogou);
             onAvaliacaoPronta(codigo, indiceAtual.current); 
          }
        }

        indiceAtual.current += 1;
        setProgressoFila(p => ({ ...p, avaliados: indiceAtual.current }));
        
      } catch (error) {
        console.error("[MoveClassification] Erro na avaliação da fila em background:", error);
        // Em caso de falha severa na engine, avança o índice para não travar a fila eternamente
        indiceAtual.current += 1;
      }
    }

    isProcessando.current = false;
  }, [historicoRealFens, onAvaliacaoPronta]);

  // 4. Ações para o Modal de Fim de Jogo controlar
  const iniciarAvaliacaoFimDeJogo = useCallback(() => {
    isPausado.current = false;
    processarFilaBackground();
  }, [processarFilaBackground]);

  const pararAvaliacao = useCallback(() => {
    isPausado.current = true;
    // ATUALIZAÇÃO: Chama o método dedicado a parar apenas o Worker do background
    analysisService.stopSyncAnalysis(); 
  }, []);

  return {
    progressoFila,
    iniciarAvaliacaoFimDeJogo,
    pararAvaliacao
  };
}
