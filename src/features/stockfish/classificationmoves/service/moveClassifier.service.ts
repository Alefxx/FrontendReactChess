// src/features/stockfish/classificationmoves/service/moveClassifier.service.ts
import { AnalisePosicao } from '../../analysis/service/analysis.service';

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
    const isBrancas = corQueJogou === 'w';

    // 1. Alguém tomou mate na posição atual (ou permitiu mate forçado do oponente)
    if (evalAtual.tipo === 'mate') {
      const tomandoMate = isBrancas ? evalAtual.vantagemBrancas < 0 : evalAtual.vantagemBrancas > 0;
      if (tomandoMate) return 5; // Capivara!
    }

    // 2. Alguém acabou de dar um xeque-mate (ou achou um mate forçado novo)
    if (evalAnterior.tipo === 'cp' && evalAtual.tipo === 'mate') {
      const dandoMate = isBrancas ? evalAtual.vantagemBrancas > 0 : evalAtual.vantagemBrancas < 0;
      if (dandoMate) return 1; // Excelente!
    }

    // 3. Tinha um mate a favor, mas deixou escapar (voltou a ser CP)
    if (evalAnterior.tipo === 'mate' && evalAtual.tipo === 'cp') {
      const tinhaMate = isBrancas ? evalAnterior.vantagemBrancas > 0 : evalAnterior.vantagemBrancas < 0;
      if (tinhaMate) return 4; // Erro grave (perdeu a sequência de mate)
    }

    // 4. Se o mate forçado já existia e o jogador manteve a sequência, é um lance bom
    return 2; 
  }
}
