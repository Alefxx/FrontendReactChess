import { useEffect, useState } from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  initials?: string;
  className?: string;
}

export function Avatar({ name, src, initials, className = '' }: AvatarProps) {
  const [hasImage, setHasImage] = useState(Boolean(src));
  const fallback = initials || name.slice(0, 2).toUpperCase() || '??';

  useEffect(() => {
    setHasImage(Boolean(src));
  }, [src]);

  return (
    <div className={`relative grid place-items-center overflow-hidden rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-xs font-black text-slate-100 ring-1 ring-white/10 ${className}`}>
      {hasImage && src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setHasImage(false)}
        />
      ) : (
        <span aria-label={name}>{fallback}</span>
      )}
    </div>
  );
}
