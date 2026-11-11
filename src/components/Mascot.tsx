import React from 'react';

interface MascotProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withRing?: boolean;
  animate?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({
  size = 'md',
  className = '',
  withRing = false,
  animate = false
}) => {
  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${
        animate ? 'hover:scale-105 transition-transform duration-300' : ''
      } ${className}`}
    >
      <div
        className={`relative ${sizeClasses[size]} rounded-2xl overflow-hidden flex items-center justify-center ${
          withRing
            ? 'p-1 bg-[#87CEEB]/20 border-2 border-[#87CEEB] shadow-md'
            : ''
        }`}
      >
        <img
          src="/mindora_mascot.png"
          alt="Mindora Mascot - Pink brain with glasses and pink bow"
          className="w-full h-full object-contain filter drop-shadow-sm"
          loading="eager"
          onError={(e) => {
            // Fallback in case of path issue
            const target = e.currentTarget as HTMLImageElement;
            if (!target.src.includes('mindora_mascot_1794382095076.jpg')) {
              target.src = '/src/assets/images/mindora_mascot_1794382095076.jpg';
            }
          }}
        />
      </div>
    </div>
  );
};
