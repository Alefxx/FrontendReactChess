// src/components/board/GameOverModal.tsx
import { useState } from 'react';
import { Trophy, Frown, Minus, Activity, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// ATUALIZADO: Importando a tela de resumo que refatoramos
import { AnalysisSummaryScreen, MoveStats } from '@/components/analysis/PlayReport'; 

interface GameOverModalProps {
  vencedor: 'branca' | 'preta' | null;
  motivo: string;
  minhaCor: 'branca' | 'preta';
  progressoFila?: { avaliados: number; total: number };
  erroAnalise?: string | null;
  stats?: MoveStats;
  onAvaliar?: () => void;
  onVerNoTabuleiro: () => void;
  onClose: () => void;
}

export function GameOverModal({ 
  vencedor, 
  motivo, 
  minhaCor, 
  progressoFila, 
  erroAnalise,
  stats,
  onAvaliar, 
  onVerNoTabuleiro,
  onClose 
}: GameOverModalProps) {
  
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // NOVO: Fallback seguro. Se a tela anterior não enviar o stats, não quebraremos o botão.
  const defaultStats: MoveStats = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const safeStats = stats || defaultStats;

  // CORRIGIDO: Removemos a dependência do "&& stats" que causava a falha silenciosa
  if (showSummary) {
    return (
      <div className="absolute inset-0 z-50 flex">
        <AnalysisSummaryScreen 
          stats={safeStats} 
          onVerNoTabuleiro={onVerNoTabuleiro} 
          onVoltarAoMenu={onClose} 
        />
      </div>
    );
  }

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

  const pAvaliados = progressoFila?.avaliados || 0;
  const pTotal = progressoFila?.total || 0;
  const progressPercent = pTotal > 0 ? Math.round((pAvaliados / pTotal) * 100) : 0;
  const isFinished = isEvaluating && pTotal > 0 && pAvaliados === pTotal;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-sm">
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
        
        {!isEvaluating ? (
          <div className="w-full flex flex-col gap-3 mt-4">
            <Button 
              label="Avaliar Partida" 
              variant="primary" 
              onClick={() => { setIsEvaluating(true); onAvaliar?.(); }} 
              className="w-full font-bold" 
              icon={<Activity size={18} />}
            />
            <Button label="Menu Superior" variant="secondary" onClick={onClose} className="w-full" />
          </div>
        ) : !isFinished ? (
          <div className="w-full flex flex-col items-center mt-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <Loader2 size={28} className="text-analysis-blue animate-spin mb-3" />
            <p className="text-white font-medium text-sm mb-1">Avaliando jogadas...</p>
            <p className="text-slate-400 text-xs mb-4">{pAvaliados} de {pTotal} lances</p>
            
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-analysis-blue transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>

            <Button label="Cancelar" variant="secondary" onClick={onClose} className="w-full text-xs" />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center mt-4 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 size={40} className="text-emerald-500 mb-3" />
            <p className="text-white font-bold mb-4">Avaliação Concluída!</p>
            {erroAnalise && <p className="text-amber-300 text-xs mb-4">{erroAnalise}</p>}
            
            <Button 
              label="Ver Relatório" 
              variant="primary" 
              onClick={() => setShowSummary(true)} 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
            />
          </div>
        )}
      </div>
    </div>
  );
}
