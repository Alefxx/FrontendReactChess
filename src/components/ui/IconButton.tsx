interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'ghost' | 'danger';
}

export function IconButton({ icon, onClick, variant = 'ghost' }: IconButtonProps) {
  const styles = {
    ghost: 'border-slate-700/70 bg-slate-900/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800',
    danger: 'border-red-500/20 bg-red-950/20 text-red-400 hover:bg-red-900/30'
  };

  return (
    <button 
      onClick={onClick}
      type="button"
      className={`flex items-center justify-center rounded-xl border p-2.5 transition-colors ${styles[variant]}`}
    >
      {icon}
    </button>
  );
}
