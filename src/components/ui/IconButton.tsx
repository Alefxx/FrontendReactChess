import React from 'react';

// Estendemos os atributos nativos e exigimos o aria-label para acessibilidade
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  'aria-label': string; 
  variant?: 'ghost' | 'danger' | 'outline';
}

export function IconButton({ 
  icon, 
  variant = 'ghost', 
  className = '',
  ...props 
}: IconButtonProps) {
  const styles = {
    ghost: 'hover:bg-slate-800 text-slate-400 hover:text-white',
    danger: 'hover:bg-red-500/20 text-red-500 hover:text-red-400',
    outline: 'border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white',
  };

  return (
    <button 
      className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chess-green ${styles[variant]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
