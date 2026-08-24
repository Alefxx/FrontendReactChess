import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string; 
}

export function Button({ 
  label, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = ''
}: ButtonProps) {
  
  const bgColors = {
    primary: 'bg-chess-green hover:brightness-110 text-slate-900',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-10 py-4 text-xl',
  };

  return (
    <button
      onClick={onClick}

      className={`${bgColors[variant]} ${sizes[size]} ${className} rounded-md font-bold transition-all active:scale-95 shadow-md`}
    >
      {label}
    </button>
  );
}