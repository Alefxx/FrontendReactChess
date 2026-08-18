import React, { useEffect, useRef } from 'react';
import { Trophy, Flag, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MoveHistoryBoardProps {
  pgnHistory: string[]; 
  onProporEmpate: () => void;
  onAbandonar: () => void;
}

export function MoveHistoryBoard({ pgnHistory, onProporEmpate, onAbandonar }: MoveHistoryBoardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll sempre que um novo lance for adicionado ao histórico
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [pgnHistory]);

  const turnos = [];
  for (let i = 0; i < pgnHistory.length; i += 2) {
    turnos.push({
      numero: Math.floor(i / 2) + 1,
      brancas: pgnHistory[i],
      pretas: pgnHistory[i + 1]
    });
  }

  return (
    <div className="flex-1 bg-slate-900/60 rounded-2xl border-2 border-slate-800 p-4 flex flex-col max-h-[400px] lg:max-h-none">
      {/* Cabeçalho */}
      <div className="flex items-center gap-2 mb-4 text-slate-400 font-bold uppercase text-xs tracking-widest border-b border-slate-800 pb-3">
        <Trophy size={16} className="text-chess-green" />
        Histórico de Lances
      </div>
      
      {/* Lista de Movimentos com Custom Scrollbar */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 text-sm font-mono text-slate-300 grid grid-cols-[40px_1fr_1fr] gap-x-2 gap-y-1 content-start
        [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-500"
      >
        {turnos.length === 0 ? (
          <div className="col-span-3 h-full flex items-center justify-center text-slate-600 italic text-sm">
            Aguardando o primeiro lance...
          </div>
        ) : (
          turnos.map((turno, index) => {
            const isLastTurn = index === turnos.length - 1;
            const isWhiteLast = isLastTurn && !turno.pretas;
            const isBlackLast = isLastTurn && !!turno.pretas;

            return (
              <div key={turno.numero} className="contents group">
                <div className="py-1.5 text-slate-600 select-none group-hover:text-slate-500 transition-colors">
                  {turno.numero}.
                </div>
                
                {/* Lance das Brancas */}
                <div className={`py-1.5 px-2 rounded-md transition-colors
                  ${isWhiteLast ? 'bg-slate-700/80 text-white font-bold' : 'hover:bg-slate-800/50 cursor-pointer'}
                `}>
                  {turno.brancas}
                </div>
                
                {/* Lance das Pretas */}
                <div className={`py-1.5 px-2 rounded-md transition-colors
                  ${isBlackLast ? 'bg-slate-700/80 text-white font-bold' : turno.pretas ? 'hover:bg-slate-800/50 cursor-pointer' : ''}
                `}>
                  {turno.pretas || ''}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Ações da Partida */}
      <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
         <Button 
            label="Empate" 
            variant="outline" 
            size="sm" 
            icon={<Handshake size={16} />}
            className="w-full text-xs"
            onClick={onProporEmpate}
         />
         <Button 
            label="Abandonar" 
            variant="danger" 
            size="sm" 
            icon={<Flag size={16} />}
            className="w-full text-xs hover:bg-red-600/90"
            onClick={onAbandonar}
         />
      </div>
    </div>
  );
}
