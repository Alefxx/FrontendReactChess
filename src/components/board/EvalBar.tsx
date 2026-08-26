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
  const backgroundColorTop = isInvertida ? 'bg-slate-200' : 'bg-slate-800';
  const backgroundColorBottom = isInvertida ? 'bg-slate-800' : 'bg-slate-200';
  
  // A porcentagem de preenchimento vem sempre de baixo para cima
  const preenchimentoBottom = isInvertida ? (100 - alturaBranca) : alturaBranca;

  return (
    <div className={`relative flex flex-col justify-end w-6 md:w-8 h-full min-h-[300px] sm:min-h-[400px] rounded overflow-hidden border border-slate-700 shadow-inner ${backgroundColorTop}`}>
      
      {/* Container dinâmico que sobe e desce (Representa a cor de baixo) */}
      <div 
        className={`${backgroundColorBottom} w-full transition-all duration-500 ease-in-out flex flex-col relative`}
        style={{ height: `${preenchimentoBottom}%` }}
      />

      {/* Texto da Avaliação */}
      {/* Usamos position absolute para que o texto flutue por cima das cores */}
      <div 
        className={`absolute w-full text-center text-[10px] sm:text-xs font-bold p-1 transition-all duration-500
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
