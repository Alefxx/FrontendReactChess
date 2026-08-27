import { calcularAlturaBarraBranca, formatarTextoAvaliacao } from '@/features/stockfish/analysis/utils/evalBar.utils';

interface EvalBarProps {
  vantagemBrancas: number;
  isMate: boolean;
  // Opcional: Se o jogador estiver de pretas, a barra inverte a posição das cores
  isInvertida?: boolean; 
}

export function EvalBar({ vantagemBrancas, isMate, isInvertida = false }: EvalBarProps) {
  // 1. Calcula os dados usando nossa inteligência separada
  const alturaBranca = calcularAlturaBarraBranca(vantagemBrancas, isMate);
  const textoAvaliacao = formatarTextoAvaliacao(vantagemBrancas, isMate);
  
  // 2. Determina quem está ganhando para saber onde posicionar o texto
  const brancasGanhando = vantagemBrancas > 0;

  // 3. Aplica a inversão de cores caso o jogador jogue de pretas
  const backgroundColorTop = isInvertida ? 'bg-slate-100' : 'bg-slate-900';
  const backgroundColorBottom = isInvertida ? 'bg-slate-900' : 'bg-slate-100';
  
  // A porcentagem de preenchimento vem sempre de baixo para cima
  const preenchimentoBottom = isInvertida ? (100 - alturaBranca) : alturaBranca;

  return (
    <div className={`relative flex h-full min-h-0 w-5 flex-col justify-end overflow-hidden rounded-lg border border-slate-600/80 shadow-inner sm:w-6 ${backgroundColorTop}`}>
      
      {/* Container dinâmico que sobe e desce (Representa a cor de baixo) */}
      <div 
        className={`${backgroundColorBottom} w-full transition-all duration-500 ease-in-out flex flex-col relative`}
        style={{ height: `${preenchimentoBottom}%` }}
      />

      {/* Texto da Avaliação */}
      {/* Usamos position absolute para que o texto flutue por cima das cores */}
      <div 
        className={`absolute w-full text-center text-[9px] font-bold p-0.5 transition-all duration-500 sm:text-[10px]
          ${brancasGanhando 
            ? 'top-0 text-slate-800' // Brancas ganhando: texto fica na cor clara (ou na escura se invertido)
            : 'bottom-0 text-slate-300' // Pretas ganhando: texto fica na área preta
          }
        `}
      >
        {textoAvaliacao}
      </div>

    </div>
  );
}
