// src/features/match/hooks/useMatchAnalysisMemory.ts
import { useState, useCallback, useMemo } from 'react';
import { matchService } from '@/features/match/service/match.service';

interface UseMatchAnalysisMemoryProps {
  partidaId?: string;
  fenInicial?: string;
  minhaCor: string;
}

/**
 * Hook de Memória e Análise: Responsável por gravar a "fita" da partida (FENs e Coordenadas)
 * e processar as estatísticas de avaliações (Engine) geradas no cliente.
 */
export function useMatchAnalysisMemory({ partidaId, fenInicial, minhaCor }: UseMatchAnalysisMemoryProps) {
  
  // 1. RAM: Acumulador de avaliações geradas pelo motor no cliente
  const [avaliacoesLocais, setAvaliacoesLocais] = useState<number[]>([]);
  
  // 2. RAM: A "Fita da Partida" (FENs). Inicializa com a posição de origem.
  const defaultFen = fenInicial || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const [fenHistory, setFenHistory] = useState<string[]>([defaultFen]);
  
  // 3. RAM: Histórico de coordenadas de origem/destino para destaque visual
  const [moveCoordsHistory, setMoveCoordsHistory] = useState<{origem: string, destino: string}[]>([]);

  /**
   * Adiciona o FEN e as coordenadas do último lance ao histórico.
   * Centraliza a lógica de evitar duplicações por re-render do React.
   */
  const registrarQuadroHistorico = useCallback((novoFen?: string, moveRealizado?: { origem: string; destino: string }) => {
    if (novoFen) {
      setFenHistory(prev => {
        if (prev[prev.length - 1] === novoFen) return prev;
        return [...prev, novoFen];
      });
    }

    if (moveRealizado) {
      setMoveCoordsHistory(prev => [...prev, moveRealizado]);
    }
  }, []);

  /**
   * Registra a nota do lance na memória RAM e tenta persistir no backend.
   * Como o service foi refatorado para lançar erros (throw), usamos try/catch aqui.
   */
  const registrarAvaliacaoLocal = useCallback(async (codigo: number, id: number) => {
    setAvaliacoesLocais((prev) => {
      const novoArray = [...prev];
      novoArray[id - 1] = codigo; // Index 0 para lance 1, Index 1 para lance 2...
      return novoArray;
    });

    if (partidaId) {
      try {
        await matchService.registrarAvaliacao(partidaId, { codigo });
      } catch (error) {
        // Apenas logamos, pois a avaliação visual (RAM) é o que importa para a UX imediata
        console.error("[Analysis Memory] Falha ao salvar avaliação no banco:", error);
      }
    }
  }, [partidaId]);

  /**
   * Filtra e processa as estatísticas prontas para o AnalysisSummaryScreen.
   */
  const minhasEstatisticas = useMemo(() => {
    // Filtra apenas os lances do jogador logado
    const minhasAvaliacoes = avaliacoesLocais.filter((_, index) => {
      // O index 0, 2, 4 (Pares) são das Brancas. O index 1, 3, 5 (Ímpares) são das Pretas.
      const isBranca = minhaCor === 'w' || minhaCor === 'branca';
      return isBranca ? index % 2 === 0 : index % 2 !== 0; 
    });

    // Agrupa as contagens
    const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    minhasAvaliacoes.forEach(codigo => {
      if (stats[codigo as keyof typeof stats] !== undefined) {
        stats[codigo as keyof typeof stats]++;
      }
    });
    
    return stats;
  }, [avaliacoesLocais, minhaCor]);

  return {
    avaliacoesLocais,
    fenHistory,
    moveCoordsHistory,
    minhasEstatisticas,
    registrarQuadroHistorico,
    registrarAvaliacaoLocal
  };
}
