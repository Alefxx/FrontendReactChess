// src/features/stockfish/classificationmoves/hooks/useMoveClassification.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { analysisService, AnalisePosicao } from '../../analysis/service/analysis.service';
import { MoveClassifierService } from '../service/moveClassifier.service';
import { openingService } from '../../analysis/service/opening.service';

export function useMoveClassification(
  historicoRealFens: string[], // NOVO: Array completo do histórico real de jogo
  isEvalBarEnabled: boolean,
  onAvaliacaoPronta: (codigo: number, id: number) => void 
) {
  
  const [progressoFila, setProgressoFila] = useState({ avaliados: 0, total: 0 });
  
  const avaliacoes = useRef<AnalisePosicao[]>([]);
  const indiceAtual = useRef<number>(0);
  
  const isProcessando = useRef(false);
  const isPausado = useRef(isEvalBarEnabled); 

  // 1. Controle de pausa sincronizado com a UI
  useEffect(() => {
    isPausado.current = isEvalBarEnabled;
    if (!isEvalBarEnabled) {
      processarFilaBackground();
    }
  }, [isEvalBarEnabled]);

  // 2. NOVO: Escuta APENAS o crescimento do array de histórico real (Imune a Time Travel/Navegação)
  useEffect(() => {
    setProgressoFila(p => ({ ...p, total: historicoRealFens.length }));
    
    if (!isPausado.current && historicoRealFens.length > indiceAtual.current) {
      processarFilaBackground();
    }
  }, [historicoRealFens.length]); // A dependência na length mata o bug de navegação no passado

  // 3. O Motor que consome a fila e intercepta lances de livro
  const processarFilaBackground = useCallback(async () => {
    if (isProcessando.current || isPausado.current) return;
    
    isProcessando.current = true;

    while (indiceAtual.current < historicoRealFens.length && !isPausado.current) {
      const fenAtual = historicoRealFens[indiceAtual.current];
      
      try {
        // Verifica se a posição é um lance teórico do Livro de Aberturas
        const isStart = openingService.isStartPosition(fenAtual);
        const opening = openingService.getOpening(fenAtual);

        if (isStart || opening) {
          // Lance teórico! Pula o Stockfish e injeta um Mock neutro
          const analiseNeutra: AnalisePosicao = { 
            vantagemBrancas: 0, 
            tipo: 'cp', // Marcamos como CP para não quebrar a matemática de transição ao sair do livro
            score: 0, 
            isMate: false, 
            bestMove: '' 
          } as AnalisePosicao;

          avaliacoes.current[indiceAtual.current] = analiseNeutra;

          if (indiceAtual.current > 0) {
            onAvaliacaoPronta(0, indiceAtual.current); // 0 = Código Livro
          }
        } 
        else {
          // Saímos da teoria. Manda para a engine avaliar de verdade
          const analiseFinal = await analysisService.avaliarFenSincrono(fenAtual, 15);
          avaliacoes.current[indiceAtual.current] = analiseFinal;

          if (indiceAtual.current > 0) {
             const evalAnterior = avaliacoes.current[indiceAtual.current - 1];
             const corQueJogou = fenAtual.split(' ')[1] === 'b' ? 'w' : 'b';
             
             const codigo = MoveClassifierService.classificar(evalAnterior, analiseFinal, corQueJogou);
             onAvaliacaoPronta(codigo, indiceAtual.current); 
          }
        }

        // Avança na fila
        indiceAtual.current += 1;
        setProgressoFila(p => ({ ...p, avaliados: indiceAtual.current }));
        
      } catch (error) {
        console.error("Erro na avaliação da fila em background:", error);
        break; 
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
    analysisService.stopAnalysis(); 
  }, []);

  return {
    progressoFila,
    iniciarAvaliacaoFimDeJogo,
    pararAvaliacao
  };
}
