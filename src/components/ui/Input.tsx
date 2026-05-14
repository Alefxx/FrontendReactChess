// src/components/ui/Input.tsx

interface InputProps {
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  error?: string; 
  icon?: React.ReactNode;
}

export function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  icon
}: InputProps) {
  return (
    <div className="flex flex-col w-full gap-1.5">
      {/* Label profissional com cor suave */}
      <label className="text-sm font-medium text-slate-400 ml-1">
        {label}
      </label>
      
      <div className="relative">
        {/* Espaço para o ícone opcional */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full bg-slate-900 border-2 rounded-lg px-4 py-2 text-white 
            outline-none transition-all duration-200
            placeholder:text-slate-500 text-sm md:text-base
            ${icon ? 'pl-10' : 'pl-4'}
            ${error 
              ? 'border-red-500 focus:border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.2)]' 
              : 'border-slate-700 focus:border-chess-green focus:shadow-[0_0_0_2px_rgba(136,196,37,0.2)]'}
          `}
        />


      </div>

      {/* Mensagem de erro */}
      {error && <span className="text-xs text-red-500 ml-1 font-medium">{error}</span>}
    </div>
  );
}
