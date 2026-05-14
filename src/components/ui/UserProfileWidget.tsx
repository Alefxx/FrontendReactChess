// src/components/ui/UserProfileWidget.tsx

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
      className={`flex items-center gap-3 p-2 pr-4 rounded-full border transition-all
        ${onClick ? 'cursor-pointer hover:bg-slate-800 border-transparent hover:border-slate-700' : 'border-transparent'}`}
    >
      {/* Informações de Texto (Escondidas em telas muito pequenas) */}
      <div className="text-right hidden sm:block">
        <p className="text-sm font-bold text-white leading-tight">{nome}</p>
        <p className="text-xs text-analysis-blue font-bold tracking-wider">{rating} ELO</p>
      </div>
      
      {/* Círculo do Avatar */}
      <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-chess-green flex items-center justify-center overflow-hidden shadow-lg shrink-0">
        {foto ? (
          <img src={foto} alt={nome} className="w-full h-full object-cover" />
        ) : (
          <span className="text-slate-300 font-bold text-sm">{iniciais}</span>
        )}
      </div>
    </div>
  );
}
