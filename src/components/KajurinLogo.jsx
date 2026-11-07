import React from 'react';
import logoImg from '../assets/logo.png';

/**
 * KajurinLogo: Monogram "K" 3D Ribbon Emblem for KAJURIN
 */
export default function KajurinLogo({
  className = '',
  size = 24,
  showWordmark = false
}) {
  const emblem = (
    <img
      src={logoImg}
      alt="Logo KAJURIN"
      width={size}
      height={size}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`shrink-0 object-contain drop-shadow-sm select-none transition-transform duration-200 ${className}`}
      loading="eager"
      role="img"
      aria-label="Logo KAJURIN - Inventaris Proyektor & Alat Ruang Kajur"
    />
  );

  if (!showWordmark) {
    return emblem;
  }

  return (
    <div className="inline-flex items-center gap-2.5">
      {emblem}
      <div className="flex flex-col">
        <span className="font-extrabold text-slate-900 dark:text-slate-100 text-base tracking-tight font-display leading-tight">
          KAJURIN
        </span>
        <span className="text-[10px] font-semibold text-teal-800 dark:text-teal-400 tracking-wider uppercase leading-none mt-0.5">
          Inventaris Ruang Kajur
        </span>
      </div>
    </div>
  );
}
