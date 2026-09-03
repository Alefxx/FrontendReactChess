export function calcularAlturaBarraBranca(vantagemBrancas: number, isMate: boolean): number {
  if (isMate) return vantagemBrancas > 0 ? 100 : 0;
  const percentage = 50 + 50 * Math.tanh(vantagemBrancas * 0.184);
  return Math.min(98, Math.max(2, percentage));
}

export function formatarTextoAvaliacao(vantagemBrancas: number, isMate: boolean): string {
  if (isMate) return `M${Math.max(1, Math.abs(vantagemBrancas))}`;
  const valorArredondado = Math.abs(vantagemBrancas).toFixed(1);
  if (Object.is(vantagemBrancas, -0) || vantagemBrancas === 0) return '0.0';
  return vantagemBrancas > 0 ? `+${valorArredondado}` : `-${valorArredondado}`;
}
