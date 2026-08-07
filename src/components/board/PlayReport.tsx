// src/screens/AnalysisSummaryScreen.tsx
import React from 'react';
import { Search, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MoveDictionary, MoveCode } from '@/features/stockfish/dictionary/moveClassification.dictionary';

// Esta interface representa as estatísticas consolidadas que você vai passar pra essa tela
export interface MoveStats {
  1: number; // Excelentes
  2: number; // Boas
  3: number; // Imprecisões
  4: number; // Erros
  5: number; // Capivaras
}

interface AnalysisSummaryScreenProps {
  stats: MoveStats;
  onVerNoTabuleiro: () => void; // Ação para ir para /analysisview
  onVoltarAoMenu: () => void;
}


export function AnalysisSummaryScreen({ stats, onVerNoTabuleiro, onVoltarAoMenu }: AnalysisSummaryScreenProps) {
  // Mais simples e à prova de erros de tipagem no TypeScript do que usar Object.keys()
  const codes: MoveCode[] = [1, 2, 3, 4, 5]; 

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black text-white mb-2">Resumo da Partida</h1>
          <p className="text-slate-400 text-sm">Quantidade de lances por precisão</p>
        </div>

        {/* Lista de dados gerada pelo Dicionário */}
        <div className="flex flex-col gap-3 mb-8">
          {codes.map((codigo) => {
            const config = MoveDictionary[codigo];
            const quantidade = stats[codigo];
            const { Icon } = config;

            return (
              <div 
                key={codigo} 
                className={`flex items-center justify-between p-3 rounded-xl ${config.bgClass} border border-white/5`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={config.colorClass} />
                  <span className={`text-base font-bold ${config.colorClass}`}>
                    {config.label}
                  </span>
                </div>
                <span className="text-white font-black text-lg bg-slate-900/50 px-3 py-1 rounded-md">
                  {quantidade}
                </span>
              </div>
            );
          })}
        </div>

        {/* Botão para ir para o tabuleiro interativo */}
        <div className="flex flex-col gap-3">
          <Button 
            label="Ver no Tabuleiro" 
            variant="primary" 
            onClick={onVerNoTabuleiro} // Redireciona para /analysisview
            className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-3 text-lg"
            icon={<Search size={20} />}
          />
          
          <Button 
            label="Voltar" 
            variant="ghost" 
            onClick={onVoltarAoMenu} 
            className="w-full text-slate-400 hover:text-white"
            icon={<ChevronLeft size={18} />}
          />
        </div>
        
      </div>
    </div>
  );
}
