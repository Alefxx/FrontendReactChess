import React from 'react';

// Estendemos ButtonHTMLAttributes para aceitar disabled, type="submit", etc.
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode; 
}

export function Button({ 
  label, 
  variant = 'primary', 
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  
  const baseStyles = "flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chess-green focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-md";

  const variants = {
    primary: 'bg-chess-green hover:bg-[#a3d92b] text-slate-900 shadow-chess-green/20 hover:shadow-chess-green/40',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600',
    danger: 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20',
    outline: 'bg-transparent border-2 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      disabled={disabled}
      // CORREÇÃO: Espaços adicionados entre as variáveis
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {label && <span>{label}</span>}
      {props.children}
    </button>
  );
}
