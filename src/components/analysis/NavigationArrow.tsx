
interface NavigationArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function NavigationArrow({ 
  direction, 
  onClick, 
  disabled = false,
  className = '' 
}: NavigationArrowProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center p-3 rounded-md transition-all duration-200
        ${disabled 
          ? 'text-slate-600 cursor-not-allowed bg-transparent' 
          : 'text-slate-300 hover:text-white hover:bg-slate-700 active:bg-slate-600 cursor-pointer shadow-sm'}
        ${className}
      `}
      aria-label={`Navigate ${direction}`}
    >
      <svg 
        className="w-6 h-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        strokeWidth={2.5}
      >
        {direction === 'left' ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}
