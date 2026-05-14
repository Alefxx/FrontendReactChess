import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode; 
}

export function Card({ children }: CardProps) {
  return (
    <div className="w-full mx-auto p-5 md:p-8 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl">
      {children}
    </div>
  );
}
