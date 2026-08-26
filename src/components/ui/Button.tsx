import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; // <-- Adicionado 'ghost'
  size?: 'sm' | 'md' | 'lg';
  className?: string; 
  icon?: React.ReactNode; // <-- Adicionado para suportar os ícones do Lucide-react
}

export function Button({ 
  label, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  icon
}: ButtonProps) {
  
  const bgColors = {
    primary: 'bg-chess-green hover:brightness-110 text-slate-900',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
    ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white', // <-- Estilos padrão do ghost
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-10 py-4 text-xl',
  };

  return (
    <button
      onClick={onClick}
      // Adicionado flex, items-center, justify-center e gap-2 para alinhar o ícone com o texto
      className={`flex items-center justify-center gap-2 ${bgColors[variant]} ${sizes[size]} ${className} rounded-md font-bold transition-all active:scale-95 shadow-md`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}