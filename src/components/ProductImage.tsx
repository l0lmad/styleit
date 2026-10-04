import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface Props {
  src?: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

export default function ProductImage({ src, alt, className = '', wrapperClassName = '' }: Props) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  const placeholder = (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-300 select-none">
      <ImageOff className="w-6 h-6" />
      <span className="text-[10px] font-cairo font-bold">لا توجد صورة</span>
    </div>
  );

  // No fixed-size box requested: let the caller's own classes control layout.
  if (!wrapperClassName) {
    if (showPlaceholder) return <div className={`${className}`}>{placeholder}</div>;
    return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={className} />;
  }

  // A wrapperClassName was supplied, so it must be honoured for real images too,
  // otherwise the <img> renders at its natural size and overflows the layout.
  return (
    <div className={`overflow-hidden flex-shrink-0 ${wrapperClassName}`}>
      {showPlaceholder ? (
        placeholder
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`w-full h-full object-cover ${className}`}
        />
      )}
    </div>
  );
}