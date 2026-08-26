import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface CheckAlertProps {
  isCheck: boolean;
}

export function CheckAlert({ isCheck }: CheckAlertProps) {
  

  useEffect(() => {
    if (isCheck && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([150, 80, 150]); 
    }
  }, [isCheck]);

  
  if (!isCheck) return null;

  return (
    <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-50 bg-red-600 text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-black border-2 border-red-900 shadow-[0_0_20px_rgba(220,38,38,0.8)] animate-pulse">
      <AlertTriangle size={18} />
      XEQUE!
    </div>
  );
}
