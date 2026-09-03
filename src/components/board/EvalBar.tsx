import { memo } from 'react';
import { calcularAlturaBarraBranca, formatarTextoAvaliacao } from '@/features/stockfish/analysis/utils/evalBar.utils';

interface EvalBarProps {
  vantagemBrancas: number;
  isMate: boolean;
  isInvertida?: boolean;
}

function EvalBarComponent({ vantagemBrancas, isMate, isInvertida = false }: EvalBarProps) {
  const alturaBranca = calcularAlturaBarraBranca(vantagemBrancas, isMate);
  const textoAvaliacao = formatarTextoAvaliacao(vantagemBrancas, isMate);
  const brancasGanhando = vantagemBrancas >= 0;
  const vencedorNoTopo = brancasGanhando === isInvertida;
  const backgroundColorTop = isInvertida ? 'bg-slate-100' : 'bg-slate-900';
  const backgroundColorBottom = isInvertida ? 'bg-slate-900' : 'bg-slate-100';
  const preenchimentoBottom = isInvertida ? 100 - alturaBranca : alturaBranca;

  return (
    <div
      className={`relative flex h-full min-h-0 w-5 flex-col justify-end overflow-hidden rounded-lg border border-slate-600/80 shadow-inner sm:w-6 ${backgroundColorTop}`}
      aria-label={`Avaliação: ${textoAvaliacao}`}
      title={`Avaliação: ${textoAvaliacao}`}
    >
      <div 
        className={`${backgroundColorBottom} relative flex w-full flex-col transition-[height] duration-300 ease-out`}
        style={{ height: `${preenchimentoBottom}%` }}
      />

      <div 
        className={`absolute w-full p-0.5 text-center text-[9px] font-bold sm:text-[10px] ${vencedorNoTopo ? 'top-0' : 'bottom-0'} ${brancasGanhando ? 'text-slate-800' : 'text-slate-200'}`}
      >
        {textoAvaliacao}
      </div>
    </div>
  );
}

export const EvalBar = memo(EvalBarComponent);
