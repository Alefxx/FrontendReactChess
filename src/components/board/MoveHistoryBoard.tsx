import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MoveHistoryBoardProps {
  pgnHistory: string[]; 
  onProporEmpate?: () => void; // Marcado como opcional
  onAbandonar?: () => void;    // Marcado como opcional
  currentMoveIndex?: number;   // Adicionado para a tela de análise
  onMoveClick?: (index: number) => void; // Adicionado para navegar na análise
}

export function MoveHistoryBoard({ 
  pgnHistory, 
  onProporEmpate, 
  onAbandonar,
  currentMoveIndex = -1,
  onMoveClick
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
    <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col min-h-[250px]">
      <div className="flex items-center gap-2 mb-4 text-slate-400 font-bold uppercase text-xs tracking-widest border-b border-slate-700 pb-2">
        <Trophy size={14} />
        Histórico de Lances
      </div>
      
      {/* Lista de Movimentos */}
      <div className="flex-1 overflow-y-auto text-sm font-mono grid grid-cols-[30px_1fr_1fr] gap-x-2 gap-y-1 content-start pr-2">
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
                {turno.brancas}
              </div>

              {/* Lance das Pretas */}
              <div 
                className={`${baseMoveClass} ${interactiveClass} ${isPretasAtivo ? 'bg-slate-600 text-white font-bold shadow-sm' : 'text-slate-400'}`}
                onClick={() => turno.pretas && onMoveClick && onMoveClick(turno.indicePretas)}
              >
                {turno.pretas || ''}
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
        <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 gap-2">
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
               label="Abandonar" 
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