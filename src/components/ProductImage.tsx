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

  if (showPlaceholder) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-300 select-none ${wrapperClassName} ${className}`}
      >
        <ImageOff className="w-6 h-6" />
        <span className="text-[10px] font-cairo font-bold">لا توجد صورة</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}