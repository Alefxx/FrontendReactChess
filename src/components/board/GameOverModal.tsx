import React from 'react';
import { Trophy, Frown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface GameOverModalProps {
  vencedor: 'branca' | 'preta' | null;
  motivo: string;
  minhaCor: 'branca' | 'preta';
  onClose: () => void;
}

export function GameOverModal({ vencedor, motivo, minhaCor, onClose }: GameOverModalProps) {
  const isEmpate = vencedor === null;
  const isVitoria = vencedor === minhaCor;

  let Icon = Minus;
  let title = "Empate";
  let colorClass = "text-slate-400";

  if (!isEmpate) {
    if (isVitoria) {
      Icon = Trophy;
      title = "Você Venceu!";
      colorClass = "text-yellow-400";
    } else {
      Icon = Frown;
      title = "Você Perdeu";
      colorClass = "text-red-400";
    }
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md rounded-sm">
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-2xl flex flex-col items-center text-center max-w-sm w-full mx-4">
        
        <div className={`p-4 rounded-full bg-slate-800 mb-4 shadow-inner ${colorClass}`}>
          <Icon size={48} />
        </div>
        
        <h2 className={`text-3xl font-black mb-2 tracking-tight ${colorClass}`}>
          {title}
        </h2>
        
        <p className="text-slate-300 font-medium mb-1 capitalize">
          Por {motivo.replace('-', ' ')}
        </p>
        
        {vencedor && (
          <p className="text-slate-500 text-sm mb-8">
            As {vencedor}s ganharam a partida.
          </p>
        )}

        <Button label="Voltar ao Dashboard" onClick={onClose} className="w-full" />
      </div>
    </div>
  );
}
