export interface AnalisePosicao {
  tipo: 'cp' | 'mate';
  valorOriginal: number;
  vantagemBrancas: number;
  profundidade: number;
}

export function parseStockfishEvaluation(line: string, blackToMove: boolean): AnalisePosicao | null {
  if (!line.startsWith('info ') || /\b(?:lowerbound|upperbound)\b/.test(line)) return null;
  const multipv = line.match(/\bmultipv\s+(\d+)/)?.[1];
  if (multipv && multipv !== '1') return null;

  const score = line.match(/\bscore\s+(cp|mate)\s+(-?\d+)/);
  if (!score) return null;

  const profundidade = Number(line.match(/\bdepth\s+(\d+)/)?.[1] ?? 0);
  const valorOriginal = Number(score[2]);

  if (score[1] === 'cp') {
    return {
      tipo: 'cp',
      valorOriginal,
      vantagemBrancas: (blackToMove ? -valorOriginal : valorOriginal) / 100,
      profundidade,
    };
  }

  const sideToMoveWins = valorOriginal > 0;
  const whiteWins = blackToMove ? !sideToMoveWins : sideToMoveWins;
  return {
    tipo: 'mate',
    valorOriginal,
    vantagemBrancas: (whiteWins ? 1 : -1) * Math.max(1, Math.abs(valorOriginal)),
    profundidade,
  };
}

export function stabilizeEvaluation(
  previous: AnalisePosicao | null,
  current: AnalisePosicao,
): AnalisePosicao {
  if (!previous || previous.tipo !== 'cp' || current.tipo !== 'cp') return current;

  const delta = current.vantagemBrancas - previous.vantagemBrancas;
  const magnitude = Math.abs(delta);
  if (magnitude >= 1.5) return current;

  const weight = magnitude >= 0.6 ? 0.65 : 0.35;
  return {
    ...current,
    vantagemBrancas: Math.round((previous.vantagemBrancas + delta * weight) * 100) / 100,
  };
}
