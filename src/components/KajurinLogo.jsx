import React, { useId } from 'react';

/**
 * KajurinLogo: Bespoke geometric vector emblem for KAJURIN
 * 
 * Visual Concept Breakdown:
 * 1. Monogram "K": The overarching silhouette forms a bold, architectural letter "K" for KAJURIN.
 * 2. Left Pillar (Rak & Lemari Kajur): A rounded structural cabinet pillar with physical shelf
 *    slots and an active emerald status LED indicator (Tersedia / Siap Operasional).
 * 3. Center Core (Proyektor Infocus): The physical chassis of a projector with heat vents and
 *    an optical lens aperture featuring specular reflection.
 * 4. Upper Wing (Sorotan Cahaya Proyektor): Dynamic expanding light cone beam projecting forward
 *    into the classroom, forming the upper diagonal of the "K".
 * 5. Lower Wing (Sirkulasi 2x Scan & Kabel): Precision angled circulation track symbolizing
 *    fast borrow & return verification.
 */
export default function KajurinLogo({
  className = '',
  size = 24,
  showWordmark = false
}) {
  const uniqueId = useId().replace(/:/g, '');
  const beamGradId = `kajurin-beam-${uniqueId}`;
  const lensGradId = `kajurin-lens-${uniqueId}`;
  const stemGradId = `kajurin-stem-${uniqueId}`;

  const emblem = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      role="img"
      aria-label="Logo KAJURIN - Inventaris Proyektor & Alat Ruang Kajur"
    >
      <defs>
        {/* Upper Beam Gradient: Radiant Cyan-Teal Light Flare */}
        <linearGradient id={beamGradId} x1="19" y1="18" x2="33" y2="7" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#0d9488" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#0f766e" stopOpacity="0.75" />
        </linearGradient>

        {/* Lens Glass Gradient: Optical Sensor Aperture */}
        <linearGradient id={lensGradId} x1="16" y1="15" x2="22" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="45%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#042f2e" />
        </linearGradient>

        {/* Left Column Gradient: Structural Rack Cabinet */}
        <linearGradient id={stemGradId} x1="4" y1="5" x2="10" y2="31" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="60%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#042f2e" />
        </linearGradient>
      </defs>

      {/* 1. LEFT PILLAR: Lemari & Rak Kompartemen Inventaris Kajur (Spine of "K") */}
      <rect
        x="4"
        y="5"
        width="6"
        height="26"
        rx="3"
        fill={`url(#${stemGradId})`}
        className="transition-colors"
      />

      {/* Rack Shelf Slot Dividers (Kompartemen A & Kompartemen B) */}
      <line
        x1="5.5"
        y1="14"
        x2="8.5"
        y2="14"
        stroke="#5eead4"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.65"
      />
      <line
        x1="5.5"
        y1="22"
        x2="8.5"
        y2="22"
        stroke="#5eead4"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.65"
      />

      {/* LED Status Indicator: Green (Siap / Tersedia di Rak) */}
      <circle
        cx="7"
        cy="8.5"
        r="1.25"
        fill="#10b981"
        className="animate-pulse"
      />

      {/* 2. UPPER DIAGONAL OF "K": Sorotan Cahaya Proyektor (Projection Cone Beam) */}
      <path
        d="M 19 15.5 L 29.5 5.5 C 30.6 4.6 32 5.3 32 6.7 L 32 11.2 C 32 12.1 31.4 12.8 30.6 13.4 L 21 18.5 Z"
        fill={`url(#${beamGradId})`}
      />

      {/* Projection Light Waves / Radiant Aperture Rays */}
      <path
        d="M 23 13.5 L 30 7"
        stroke="#ffffff"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M 24 16 L 31 9.5"
        stroke="#ffffff"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* 3. LOWER DIAGONAL OF "K": Sirkulasi 2x Scan & Pengembalian Alat */}
      <path
        d="M 20.5 17.5 L 29.5 26.5 C 30.5 27.5 32 27 32 25.6 L 32 21 C 32 20.2 31.3 19.5 30.5 18.9 L 20 14 Z"
        fill="#0d9488"
        className="dark:fill-teal-600 transition-colors"
      />
      {/* Return circulation cable / check groove */}
      <path
        d="M 24.5 22.5 L 30 28"
        stroke="#5eead4"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* 4. CENTER CHASSIS: Proyektor Box Body */}
      <rect
        x="9.5"
        y="13"
        width="10.5"
        height="10"
        rx="2.5"
        fill="#134e4a"
        stroke="#14b8a6"
        strokeWidth="1.2"
        className="dark:fill-[#0c2e2c]"
      />

      {/* Projector Cooling Air Vents */}
      <line
        x1="12"
        y1="15.5"
        x2="12"
        y2="20.5"
        stroke="#5eead4"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1="14"
        y1="15.5"
        x2="14"
        y2="20.5"
        stroke="#5eead4"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* 5. INFOCUS OPTICAL LENS: Outer Ring & Focused Optical Core */}
      <circle
        cx="18.5"
        cy="18"
        r="4.2"
        fill="#042f2e"
        stroke="#2dd4bf"
        strokeWidth="1.4"
      />
      <circle
        cx="18.5"
        cy="18"
        r="2.4"
        fill={`url(#${lensGradId})`}
      />
      {/* Specular Highlight on Lens Glass */}
      <circle
        cx="17.6"
        cy="17.1"
        r="0.8"
        fill="#ffffff"
        opacity="0.9"
      />
    </svg>
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
