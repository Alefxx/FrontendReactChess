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
    <button 
      onClick={onClick} 
      className={`group flex items-center gap-3 p-1.5 pr-4 rounded-full border border-transparent transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chess-green
        ${onClick ? 'cursor-pointer hover:bg-slate-800/80 hover:border-slate-700 hover:shadow-lg' : ''}`}
    >
      {/* Informações de Texto */}
      <div className="text-right hidden sm:flex sm:flex-col sm:justify-center">
        <p className="text-sm font-bold text-slate-100 leading-none group-hover:text-white transition-colors">
          {nome}
        </p>
        <p className="text-[11px] text-analysis-blue font-bold tracking-widest mt-1 opacity-90">
          {rating} ELO
        </p>
      </div>
      
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-chess-green flex items-center justify-center overflow-hidden shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-300">
        {foto ? (
          <img src={foto} alt={`Foto de ${nome}`} className="w-full h-full object-cover" />
        ) : (
          <span className="text-slate-300 font-bold text-sm tracking-tighter">
            {iniciais}
          </span>
        )}
      </div>
    </button>
  );
}
