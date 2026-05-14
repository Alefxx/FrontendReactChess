interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };

  return (
    <div className={`${sizeClasses[size]} font-black tracking-tighter flex items-center leading-none`}>
      {/* Verde Lima */}
      <span className="text-chess-green">CHESS</span>
      
      {/* Sky Blue */}
      <span className="text-analysis-blue ml-1">ANALYSIS</span>
      
      {/* Ponto pulsante acompanhando o azul da análise */}
      <span className="bg-analysis-blue block w-1.5 h-1.5 rounded-full ml-2 animate-pulse"></span>
    </div>
  );
}
