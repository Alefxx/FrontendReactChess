// src/components/analysis/MoveQualityIcon.tsx
import { BookOpen } from 'lucide-react';

export type MoveQuality = 'book' | 'best' | 'great' | 'inaccuracy' | 'mistake' | 'blunder';

interface MoveQualityIconProps {
  quality: MoveQuality;
  className?: string;
}

export function MoveQualityIcon({ quality, className = '' }: MoveQualityIconProps) {
  // Tratamento especial para Lances de Livro (Teoria)
  if (quality === 'book') {
    return (
      <div 
        className={`flex items-center justify-center p-1 rounded-full bg-slate-800/50 text-stone-400 ${className}`}
        title="Teoria de Abertura"
      >
        <BookOpen className="w-5 h-5" strokeWidth={2.5} />
      </div>
    );
  }

  // Mapeamento das qualidades padrão (Setas)
  const styleMap: Record<Exclude<MoveQuality, 'book'>, { color: string; rotation: string }> = {
    best: { color: 'text-yellow-500', rotation: '-rotate-90' },       // Dourado, Cima
    great: { color: 'text-blue-500', rotation: '-rotate-45' },        // Azul, Diagonal Cima
    inaccuracy: { color: 'text-green-500', rotation: 'rotate-0' },    // Verde, Meio (Direita)
    mistake: { color: 'text-orange-500', rotation: 'rotate-45' },     // Laranja, Diagonal Baixo
    blunder: { color: 'text-red-500', rotation: 'rotate-90' }         // Vermelho, Baixo
  };

  const { color, rotation } = styleMap[quality];

  return (
    <div 
      className={`flex items-center justify-center p-1 rounded-full bg-slate-800/50 ${color} ${className}`}
      title={quality}
    >
      <svg 
        className={`w-5 h-5 transform transition-transform duration-300 ${rotation}`} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={3} 
          d="M14 5l7 7m0 0l-7 7m7-7H3" 
        />
      </svg>
    </div>
  );
}
