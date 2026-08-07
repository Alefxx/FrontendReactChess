// src/features/stockfish/dictionary/moveClassification.dictionary.ts
import { Sparkles, Check, HelpCircle, AlertTriangle, XOctagon, BookOpen } from 'lucide-react';

export const MoveDictionary = {
  0: { 
    label: 'Livro', 
    colorClass: 'text-stone-400', 
    bgClass: 'bg-stone-400/10',
    Icon: BookOpen 
  },
  1: { 
    label: 'Excelente', 
    colorClass: 'text-cyan-400', 
    bgClass: 'bg-cyan-400/10',
    Icon: Sparkles 
  },
  2: { 
    label: 'Boa', 
    colorClass: 'text-emerald-400', 
    bgClass: 'bg-emerald-400/10',
    Icon: Check 
  },
  3: { 
    label: 'Imprecisão', 
    colorClass: 'text-yellow-400', 
    bgClass: 'bg-yellow-400/10',
    Icon: HelpCircle 
  },
  4: { 
    label: 'Erro', 
    colorClass: 'text-orange-400', 
    bgClass: 'bg-orange-400/10',
    Icon: AlertTriangle 
  },
  5: { 
    label: 'Capivara', 
    colorClass: 'text-red-500', 
    bgClass: 'bg-red-500/10',
    Icon: XOctagon 
  }
} as const;

export type MoveCode = keyof typeof MoveDictionary;
