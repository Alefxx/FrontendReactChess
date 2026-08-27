import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode; 
}

export function Card({ children }: CardProps) {
  return (
    <div className="surface-card w-full max-w-md mx-auto rounded-3xl p-5 sm:p-7">
      {children}
    </div>
  );
}
