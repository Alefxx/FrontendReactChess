import { Bot } from '@/features/botselection/service/bot.service';
import { Cpu } from 'lucide-react'; // iconeIA

interface BotCardProps {
  bot: Bot;
  isSelected: boolean;
  onClick: () => void;
}

export function BotCard({ bot, isSelected, onClick }: BotCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`
        relative flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'bg-slate-800 border-2 border-chess-green shadow-[0_0_15px_rgba(136,196,37,0.3)] scale-105' 
          : 'bg-slate-900 border-2 border-slate-700 hover:border-slate-500 hover:bg-slate-800'}
      `}
    >
      {/* Selo de Selecionado (Aparece apenas quando clicado) */}
      {isSelected && (
        <div className="absolute -top-3 bg-chess-green text-slate-900 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md z-10">
          Adversário
        </div>
      )}

      {/* Foto do Bot */}
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-slate-700 mb-4 border border-slate-600 flex items-center justify-center shrink-0">
        {/* Como as fotos não existem ainda, mostramos o ícone ou o alt */}
        <img 
          src={bot.foto} 
          alt={bot.nome} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback caso a imagem '/img/bot_1.png' falhe ao carregar
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
            e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<span class="text-slate-500">Bot</span>');
          }}
        />
      </div>

      {}
      <h3 className="text-white font-bold text-lg text-center leading-tight mb-1">
        {bot.nome}
      </h3>
      
      <div className="flex items-center gap-1 text-analysis-blue text-sm font-semibold">
        <Cpu size={14} />
        <span>{bot.rating} ELO</span>
      </div>
    </div>
  );
}
