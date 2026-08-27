import { Bot } from '@/features/botselection/service/bot.service';
import { Cpu, Sparkles } from 'lucide-react';
import { Avatar } from './Avatar';

interface BotCardProps {
  bot: Bot;
  isSelected: boolean;
  onClick: () => void;
}

export function BotCard({ bot, isSelected, onClick }: BotCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        surface-interactive relative flex min-h-48 flex-col items-center rounded-2xl p-4 text-left cursor-pointer
        ${isSelected 
          ? 'border-chess-green bg-lime-400/8 shadow-[0_12px_28px_rgba(163,230,53,0.12)]' 
          : ''}
      `}
    >
      {/* Selo de Selecionado (Aparece apenas quando clicado) */}
      {isSelected && (
        <div className="absolute -top-3 flex items-center gap-1 rounded-full bg-chess-green px-3 py-1 text-[10px] font-black uppercase text-slate-950 shadow-md z-10">
          <Sparkles size={11} /> Selecionado
        </div>
      )}

      <Avatar name={bot.nome} src={bot.foto} className="mb-3 h-20 w-20 border-2 border-slate-500/70 shadow-lg md:h-24 md:w-24" />

      {}
      <h3 className="text-white font-bold text-lg text-center leading-tight mb-1">
        {bot.nome}
      </h3>
      
      <div className="flex items-center gap-1 text-sm font-semibold text-analysis-blue">
        <Cpu size={14} />
        <span>{bot.rating} ELO</span>
      </div>
    </button>
  );
}
