import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MoveQuality, MoveQualityIcon } from '@/components/analysis/MoveQualityIcon';

const QUALITY_BY_CODE: Record<number, MoveQuality> = {
  0: 'book',
  1: 'best',
  2: 'great',
  3: 'inaccuracy',
  4: 'mistake',
  5: 'blunder',
};

interface MoveHistoryBoardProps {
  pgnHistory: string[]; 
  onProporEmpate?: () => void; // Marcado como opcional
  onAbandonar?: () => void;    // Marcado como opcional
  abandonLabel?: string;
  currentMoveIndex?: number;   // Adicionado para a tela de análise
  onMoveClick?: (index: number) => void; // Adicionado para navegar na análise
  moveCodes?: number[];
}

export function MoveHistoryBoard({ 
  pgnHistory, 
  onProporEmpate, 
  onAbandonar,
  abandonLabel = 'Abandonar',
  currentMoveIndex = -1,
  onMoveClick,
  moveCodes,
}: MoveHistoryBoardProps) {
  const turnos = [];
  for (let i = 0; i < pgnHistory.length; i += 2) {
    turnos.push({
      numero: Math.floor(i / 2) + 1,
      brancas: pgnHistory[i],
      pretas: pgnHistory[i + 1],
      indiceBrancas: i,
      indicePretas: i + 1
    });
  }

  // Classes utilitárias para os lances (interatividade e destaque)
  const baseMoveClass = "py-1 px-2 rounded-md transition-colors duration-200";
  const interactiveClass = onMoveClick ? "cursor-pointer hover:bg-slate-700/60" : "";

  return (
    <div className="surface-card flex min-h-[250px] flex-1 flex-col rounded-2xl p-4">
      <div className="mb-4 flex items-center gap-2 border-b border-slate-700/70 pb-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        <Trophy size={14} />
        Histórico de Lances
      </div>
      
      {/* Lista de Movimentos */}
      <div className="grid flex-1 grid-cols-[30px_1fr_1fr] content-start gap-x-2 gap-y-1 overflow-y-auto pr-2 font-mono text-sm">
        {turnos.map((turno) => {
          const isBrancasAtivo = currentMoveIndex === turno.indiceBrancas;
          const isPretasAtivo = currentMoveIndex === turno.indicePretas;

          return (
            <div key={turno.numero} className="contents">
              <div className="text-slate-500 py-1">{turno.numero}.</div>
              
              {/* Lance das Brancas */}
              <div 
                className={`${baseMoveClass} ${interactiveClass} ${isBrancasAtivo ? 'bg-slate-600 text-white font-bold shadow-sm' : 'text-slate-300 font-bold'}`}
                onClick={() => onMoveClick && onMoveClick(turno.indiceBrancas)}
              >
                <span className="flex items-center gap-1.5">
                  {turno.brancas}
                  {moveCodes?.[turno.indiceBrancas] !== undefined && (
                    <MoveQualityIcon quality={QUALITY_BY_CODE[moveCodes[turno.indiceBrancas]]} className="scale-75 origin-left" />
                  )}
                </span>
              </div>

              {/* Lance das Pretas */}
              <div 
                className={`${baseMoveClass} ${interactiveClass} ${isPretasAtivo ? 'bg-slate-600 text-white font-bold shadow-sm' : 'text-slate-400'}`}
                onClick={() => turno.pretas && onMoveClick && onMoveClick(turno.indicePretas)}
              >
                {turno.pretas && (
                  <span className="flex items-center gap-1.5">
                    {turno.pretas}
                    {moveCodes?.[turno.indicePretas] !== undefined && (
                      <MoveQualityIcon quality={QUALITY_BY_CODE[moveCodes[turno.indicePretas]]} className="scale-75 origin-left" />
                    )}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {turnos.length === 0 && (
          <div className="col-span-3 text-center text-slate-500 italic mt-4">
            Aguardando o primeiro lance...
          </div>
        )}
      </div>

      {/* Ações da Partida (só renderiza se as funções existirem, ou seja, se estiver na partida ao vivo) */}
      {(onProporEmpate || onAbandonar) && (
        <div className={`mt-4 grid gap-2 border-t border-slate-700/70 pt-4 ${onProporEmpate && onAbandonar ? 'grid-cols-2' : 'grid-cols-1'}`}>
           {onProporEmpate && (
             <Button 
               label="Empate" 
               variant="secondary" 
               size="sm" 
               onClick={onProporEmpate}
             />
           )}
           {onAbandonar && (
             <Button 
               label={abandonLabel}
               variant="danger" 
               size="sm" 
               onClick={onAbandonar}
             />
           )}
        </div>
      )}
    </div>
  );
}
