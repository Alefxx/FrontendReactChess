interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'ghost' | 'danger';
}

export function IconButton({ icon, onClick, variant = 'ghost' }: IconButtonProps) {
  const styles = {
    ghost: 'hover:bg-slate-700 text-slate-400',
    danger: 'hover:bg-red-900/30 text-red-500'
  };

  return (
    <button 
      onClick={onClick}
      className={`p-2 rounded-full transition-colors flex items-center justify-center ${styles[variant]}`}
    >
      {icon}
    </button>
  );
}
