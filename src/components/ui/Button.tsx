import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string; 
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function Button({ 
  label, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  icon,
  disabled = false,
  type = 'button'
}: ButtonProps) {
  
  const bgColors = {
    primary: 'bg-chess-green hover:bg-lime-300 text-slate-950 shadow-[0_10px_24px_rgba(163,230,53,0.18)]',
    secondary: 'bg-slate-700/80 hover:bg-slate-600 text-slate-100 border border-slate-600/70',
    danger: 'bg-red-500/90 hover:bg-red-400 text-white',
    ghost: 'bg-transparent hover:bg-slate-800/70 text-slate-300 hover:text-white border border-transparent hover:border-slate-700',
  };

  const sizes = {
    sm: 'min-h-9 px-3 py-1.5 text-sm',
    md: 'min-h-11 px-5 py-2.5 text-sm',
    lg: 'min-h-13 px-7 py-3.5 text-base sm:text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`flex items-center justify-center gap-2 rounded-xl font-extrabold tracking-wide transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 ${bgColors[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}
