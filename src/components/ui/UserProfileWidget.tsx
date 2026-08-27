import { Avatar } from './Avatar';

interface UserProfileWidgetProps {
  nome: string;
  rating: number;
  iniciais: string;
  foto?: string; 
  onClick?: () => void;  
}

export function UserProfileWidget({ nome, rating, iniciais, foto, onClick }: UserProfileWidgetProps) {
  return (
    <div 
      onClick={onClick} 
      className={`flex items-center gap-3 rounded-2xl border px-2 py-1.5 pr-3 transition-all
        ${onClick ? 'cursor-pointer border-slate-700/50 bg-slate-900/35 hover:border-slate-600 hover:bg-slate-800/80' : 'border-transparent'}`}
    >
      {/* Informações de Texto (Escondidas em telas muito pequenas) */}
      <div className="text-right hidden sm:block">
        <p className="max-w-32 truncate text-sm font-bold text-white leading-tight">{nome}</p>
        <p className="text-[11px] font-bold tracking-wider text-analysis-blue">{rating} ELO</p>
      </div>
      
      {/* Círculo do Avatar */}
      <Avatar name={nome} src={foto} initials={iniciais} className="h-10 w-10 shrink-0 border-2 border-chess-green shadow-lg shadow-lime-500/10" />
    </div>
  );
}
