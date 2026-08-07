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
    
    // Normalizamos o delta para o ponto de vista de quem jogou.
    const perdaVantagem = corQueJogou === 'w' ? deltaBrancas : -deltaBrancas;

    // Tabela de calibração baseada em códigos
    if (perdaVantagem >= -0.2) return 1; // 1 = Excelente
    if (perdaVantagem >= -0.5) return 2; // 2 = Boa
    if (perdaVantagem >= -1.0) return 3; // 3 = Imprecisão
    if (perdaVantagem >= -2.0) return 4; // 4 = Erro
    
    return 5; // 5 = Capivara
  }

  private static classificarComMate(
    evalAnterior: AnalisePosicao,
    evalAtual: AnalisePosicao,
    corQueJogou: 'w' | 'b'
  ): number {
    const isBrancas = corQueJogou === 'w';

    // Tomou um mate de bobeira
    if (evalAtual.tipo === 'mate') {
      const tomandoMate = isBrancas ? evalAtual.vantagemBrancas < 0 : evalAtual.vantagemBrancas > 0;
      if (tomandoMate) return 5; // Capivara
    }

    // Achou um mate que não existia na avaliação anterior
    if (evalAnterior.tipo === 'cp' && evalAtual.tipo === 'mate') {
      const dandoMate = isBrancas ? evalAtual.vantagemBrancas > 0 : evalAtual.vantagemBrancas < 0;
      if (dandoMate) return 1; // Excelente
    }

    // Continuou em progressão de mate esperada
    return 2; // Boa
  }
}
