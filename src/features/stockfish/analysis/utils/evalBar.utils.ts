/**
 * Calcula a altura da barra branca (em porcentagem).
 * O chess.com não usa uma escala linear perfeita para que vantagens pequenas (como +1) 
 * sejam mais visíveis. Aqui usamos um fator multiplicador com limites (clamp).
 */
export function calcularAlturaBarraBranca(vantagemBrancas: number, isMate: boolean): number {
  if (isMate) {
    // Se for mate para as brancas (positivo), barra cheia. Se for para as pretas (negativo), barra vazia.
    return vantagemBrancas > 0 ? 100 : 0;
  }

  // Multiplicamos a vantagem para dar um "peso" visual maior.
  // Ex: +1 peão = 50 + (1 * 8) = 58% da barra.
  const peso = vantagemBrancas * 8; 
  let porcentagem = 50 + peso;

  // Garantimos que a barra nunca passe de 95% ou caia de 5% 
  // a menos que seja um xeque-mate garantido, para sempre mostrar um pedacinho da cor de quem tá perdendo.
  if (porcentagem > 95) porcentagem = 95;
  if (porcentagem < 5) porcentagem = 5;

  return porcentagem;
}

/**
 * Formata o texto exibido na barra (ex: "+1.2", "-0.8", "M3").
 */
export function formatarTextoAvaliacao(vantagemBrancas: number, isMate: boolean): string {
  if (isMate) {
    return `M${Math.abs(vantagemBrancas)}`;
  }

  // Arredonda para 1 casa decimal
  const valorArredondado = Math.abs(vantagemBrancas).toFixed(1);

  // Se for exatamente 0.0, não mostra sinal
  if (vantagemBrancas === 0) return "0.0";

  // Se for positivo, adiciona o "+", se for negativo, o "-" já é subentendido visualmente 
  // (mas vamos retornar o número puro, a cor do texto indicará a vantagem)
  return vantagemBrancas > 0 ? `+${valorArredondado}` : `-${valorArredondado}`;
}
