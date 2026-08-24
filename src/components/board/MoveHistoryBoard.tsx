import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MoveHistoryBoardProps {
  pgnHistory: string[]; 
  onProporEmpate: () => void;
  onAbandonar: () => void;
}

export function MoveHistoryBoard({ pgnHistory, onProporEmpate, onAbandonar }: MoveHistoryBoardProps) {
  const turnos = [];
  for (let i = 0; i < pgnHistory.length; i += 2) {
    turnos.push({
      numero: Math.floor(i / 2) + 1,
      brancas: pgnHistory[i],
      pretas: pgnHistory[i + 1]
    });
  }

  return (
    <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4 text-slate-400 font-bold uppercase text-xs tracking-widest border-b border-slate-700 pb-2">
        <Trophy size={14} />
        Histórico de Lances
      </div>
      
      {/* Lista de Movimentos */}
      <div className="flex-1 overflow-y-auto text-sm font-mono text-slate-300 grid grid-cols-[30px_1fr_1fr] gap-x-2 gap-y-1 content-start">
        {turnos.map((turno) => (
          <div key={turno.numero} className="contents">
            <div className="text-slate-500">{turno.numero}.</div>
            <div className="py-1 font-bold">{turno.brancas}</div>
            <div className="py-1 text-slate-400">{turno.pretas || ''}</div>
          </div>
        ))}
        {turnos.length === 0 && (
          <div className="col-span-3 text-center text-slate-500 italic mt-4">
            Aguardando o primeiro lance...
          </div>
        )}
      </div>

      {/* Ações da Partida */}
      <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 gap-2">
         <Button 
            label="Empate" 
            variant="secondary" 
            size="sm" 
            onClick={onProporEmpate}
         />
         <Button 
            label="Abandonar" 
            variant="danger" 
            size="sm" 
            onClick={onAbandonar}
         />
      </div>
    </div>
  );
}
