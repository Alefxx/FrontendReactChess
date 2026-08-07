// src/screens/AnalysisSummaryScreen.tsx
import React from 'react';
import { Search, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MoveQualityIcon, MoveQuality } from '@/components/analysis/MoveQualityIcon';

export interface MoveStats {
  0: number; // Lances de Livro (Teoria)
  1: number; // Excelentes
  2: number; // Boas
  3: number; // Imprecisões
  4: number; // Erros
  5: number; // Capivaras
}

interface AnalysisSummaryScreenProps {
  stats: MoveStats;
  onVerNoTabuleiro: () => void;
  onVoltarAoMenu: () => void;
}

interface QualityConfig {
  quality: MoveQuality;
  label: string;
  bgClass: string;
  textClass: string;
}

const SUMMARY_CONFIG: Record<keyof MoveStats, QualityConfig> = {
  0: { quality: 'book', label: 'Lances de Livro', bgClass: 'bg-stone-500/10', textClass: 'text-stone-400' },
  1: { quality: 'best', label: 'Excelentes', bgClass: 'bg-yellow-500/10', textClass: 'text-yellow-500' },
  2: { quality: 'great', label: 'Boas', bgClass: 'bg-blue-500/10', textClass: 'text-blue-500' },
  3: { quality: 'inaccuracy', label: 'Imprecisões', bgClass: 'bg-green-500/10', textClass: 'text-green-500' },
  4: { quality: 'mistake', label: 'Erros', bgClass: 'bg-orange-500/10', textClass: 'text-orange-500' },
  5: { quality: 'blunder', label: 'Capivaras', bgClass: 'bg-red-500/10', textClass: 'text-red-500' },
};

export function AnalysisSummaryScreen({ stats, onVerNoTabuleiro, onVoltarAoMenu }: AnalysisSummaryScreenProps) {
  // ATUALIZAÇÃO: Incluído o código 0 no início do array
  const statKeys = [0, 1, 2, 3, 4, 5] as const;

  return (
    <div className="min-h-screen bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Relatório da Partida</h1>
          <p className="text-slate-400 text-sm">Resumo da precisão dos seus lances</p>
        </div>

        <div className="flex flex-col gap-3 mb-10">
          {statKeys.map((key) => {
            const config = SUMMARY_CONFIG[key];
            const quantidade = stats[key] || 0; // Fallback de segurança

            return (
              <div 
                key={key} 
                className={`flex items-center justify-between p-4 rounded-2xl ${config.bgClass} border border-white/5 transition-colors`}
              >
                <div className="flex items-center gap-4">
                  <MoveQualityIcon 
                    quality={config.quality} 
                    className="!bg-transparent !p-0 scale-125" 
                  />
                  <span className={`text-lg font-bold ${config.textClass}`}>
                    {config.label}
                  </span>
                </div>
                <span className={`font-black text-xl ${config.textClass} bg-slate-950/40 px-4 py-1.5 rounded-xl`}>
                  {quantidade}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            label="Ver no Tabuleiro" 
            variant="primary" 
            onClick={onVerNoTabuleiro} 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 text-lg rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
            icon={<Search size={22} />}
          />
          
          <Button 
            label="Voltar ao Menu" 
            variant="ghost" 
            onClick={onVoltarAoMenu} 
            className="w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl py-3 transition-colors"
            icon={<ChevronLeft size={18} />}
          />
        </div>
        
      </div>
    </div>
  );
}
