import React, { useState } from 'react';
import { Cpu, Bot as BotIcon } from 'lucide-react';
import { Bot } from '@/features/botselection/service/bot.service';

interface BotCardProps {
  bot: Bot;
  isSelected: boolean;
  onClick: () => void;
}

export function BotCard({ bot, isSelected, onClick }: BotCardProps) {
  // Controle de estado para lidar com o erro de imagem do jeito React (sem injetar HTML no DOM)
  const [imgError, setImgError] = useState(false);

  return (
    <button 
      onClick={onClick}
      className={`
        group relative w-full flex flex-col items-center p-5 rounded-2xl cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chess-green
        ${isSelected 
          ? 'bg-gradient-to-b from-slate-800 to-slate-800/80 border-2 border-chess-green shadow-[0_0_20px_rgba(136,196,37,0.15)] -translate-y-2' 
          : 'bg-slate-900 border-2 border-slate-800 hover:border-slate-600 hover:bg-slate-800'}
      `}
    >
      {/* Selo de Selecionado */}
      <div className={`absolute -top-3.5 transition-all duration-300 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
        <div className="bg-chess-green text-slate-900 text-[11px] font-black tracking-wider uppercase px-4 py-1 rounded-full shadow-lg">
          Oponente
        </div>
      </div>

      {/* Foto do Bot */}
      <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-4 border-2 flex items-center justify-center shrink-0 transition-colors duration-300 ${isSelected ? 'border-chess-green bg-slate-800' : 'border-slate-700 bg-slate-800 group-hover:border-slate-500'}`}>
        {!imgError && bot.foto ? (
          <img 
            src={bot.foto} 
            alt={`Avatar do bot ${bot.nome}`} 
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <BotIcon size={40} className="text-slate-500" />
        )}
      </div>

      <h3 className={`font-bold text-lg text-center leading-tight mb-1.5 transition-colors ${isSelected ? 'text-white' : 'text-slate-200'}`}>
        {bot.nome}
      </h3>
      
      <div className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${isSelected ? 'text-[#b5f233]' : 'text-analysis-blue'}`}>
        <Cpu size={14} strokeWidth={2.5} />
        <span>{bot.rating} ELO</span>
      </div>
    </button>
  );
}
