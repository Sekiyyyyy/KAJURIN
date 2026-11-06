import React from 'react';

/**
 * KajurinLogo: Official geometric vector emblem for KAJURIN
 * Replaces generic emojis and single-letter boxes with an authentic,
 * technical hardware/inventory emblem representing the department workstation.
 */
export default function KajurinLogo({ className = 'w-6 h-6', size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="kajurin-grad-primary" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id="kajurin-grad-accent" x1="16" y1="8" x2="28" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>

      {/* Outer Technical Frame (Rounded Hex-Squircle) */}
      <rect
        x="3"
        y="3"
        width="26"
        height="26"
        rx="7"
        className="stroke-teal-700 dark:stroke-teal-400"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Upper Rack Shelf Beam */}
      <path
        d="M8 9H24"
        className="stroke-teal-600 dark:stroke-teal-300"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Optical Lens Aperture Ring (Center) */}
      <circle
        cx="16"
        cy="17"
        r="5.5"
        className="stroke-teal-800 dark:stroke-teal-200"
        strokeWidth="2"
      />

      {/* Center Laser/Sensor Core */}
      <circle
        cx="16"
        cy="17"
        r="2"
        fill="url(#kajurin-grad-primary)"
      />

      {/* Physical Alignment Indicators */}
      <path
        d="M16 6V8M16 23V25M7 17H9M23 17H25"
        className="stroke-teal-500/70 dark:stroke-teal-400/80"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Corner Status Notch */}
      <circle
        cx="23"
        cy="9"
        r="1"
        className="fill-amber-500"
      />
    </svg>
  );
}

