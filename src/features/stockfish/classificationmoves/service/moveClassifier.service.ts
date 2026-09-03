// src/features/stockfish/classificationmoves/service/moveClassifier.service.ts
import type { AnalisePosicao } from '../../analysis/utils/evaluation.utils';

export class MoveClassifierService {
  /**
   * Avalia a qualidade de um lance baseado na perda de vantagem.
   * Retorna um código numérico (1 a 5).
   */
  static classificar(
    evalAnterior: AnalisePosicao,
    evalAtual: AnalisePosicao,
    corQueJogou: 'w' | 'b'
  ): number {
    
    // Tratamento especial para situações envolvendo Xeque-Mate
    if (evalAnterior.tipo === 'mate' || evalAtual.tipo === 'mate') {
      return this.classificarComMate(evalAnterior, evalAtual, corQueJogou);
    }

    // Lógica padrão em Centipeões (CP)
    const deltaBrancas = evalAtual.vantagemBrancas - evalAnterior.vantagemBrancas;
    
    // Normalizamos o delta para o ponto de vista de quem jogou
    const perdaVantagem = corQueJogou === 'w' ? deltaBrancas : -deltaBrancas;

    // --- NOVO: Proteção de Escalada (Scaling) ---
    // Pega a vantagem do ponto de vista do jogador na posição atual e anterior
    const vantagemAnteriorJogador = corQueJogou === 'w' ? evalAnterior.vantagemBrancas : -evalAnterior.vantagemBrancas;
    const vantagemAtualJogador = corQueJogou === 'w' ? evalAtual.vantagemBrancas : -evalAtual.vantagemBrancas;

    // Se o jogador estava com vantagem esmagadora (+5 peões) e manteve vantagem esmagadora (+4 peões), suaviza a punição
    if (vantagemAnteriorJogador >= 5.0 && vantagemAtualJogador >= 4.0) {
      if (perdaVantagem >= -1.0) return 1; // Excelente
      if (perdaVantagem >= -2.5) return 2; // Boa
      return 3; // Imprecisão (Nunca será erro/capivara se continua +4 peões na frente)
    }

    // --- Tabela Padrão de Calibração ---
    if (perdaVantagem >= -0.5) return 1; // 1 = Excelente
    if (perdaVantagem >= -0.8) return 2; // 2 = Boa
    if (perdaVantagem >= -1.5) return 3; // 3 = Imprecisão
    if (perdaVantagem >= -2.7) return 4; // 4 = Erro
    
    return 5; // 5 = Capivara
  }

  private static classificarComMate(
    evalAnterior: AnalisePosicao,
    evalAtual: AnalisePosicao,
    corQueJogou: 'w' | 'b'
  ): number {
    const sinalJogador = corQueJogou === 'w' ? 1 : -1;
    const mateAnteriorFavoravel = evalAnterior.tipo === 'mate'
      && evalAnterior.vantagemBrancas * sinalJogador > 0;
    const mateAtualFavoravel = evalAtual.tipo === 'mate'
      && evalAtual.vantagemBrancas * sinalJogador > 0;

    if (evalAnterior.tipo === 'mate' && evalAtual.tipo === 'cp') {
      return mateAnteriorFavoravel ? 4 : 1;
    }

    if (evalAnterior.tipo === 'mate' && evalAtual.tipo === 'mate') {
      if (mateAnteriorFavoravel && !mateAtualFavoravel) return 5;
      if (!mateAnteriorFavoravel && mateAtualFavoravel) return 1;
      return 2;
    }

    return mateAtualFavoravel ? 1 : 5;
  }
}
