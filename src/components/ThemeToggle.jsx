import React from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * ThemeToggle: Tactile Neumorphic Light / Dark Mode Switch
 * Inset pill track with an extruded tactile knob that slides smoothly between
 * Sun (Warm Linen White) and Moon (Midnight Obsidian Dark) states.
 */
export default function ThemeToggle({ isDark, onToggle, className = '' }) {
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Beralih ke mode terang (Warm Linen)' : 'Beralih ke mode gelap (Midnight Obsidian)'}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      title={isDark ? 'Mode Gelap aktif (Klik untuk Mode Terang Hangat)' : 'Mode Terang Hangat aktif (Klik untuk Mode Gelap)'}
      className={`relative w-16 h-8 rounded-full cursor-pointer select-none transition-colors duration-300 p-1 flex items-center justify-between border border-neu-border neu-inset-sm ${className}`}
      style={{
        backgroundColor: 'var(--neu-base)',
      }}
    >
      {/* Background Track Icons */}
      <div className="w-full flex items-center justify-between px-1.5 text-xs pointer-events-none">
        <Sun
          className={`w-3.5 h-3.5 transition-opacity duration-200 ${
            isDark ? 'text-slate-400 opacity-40' : 'text-amber-600 opacity-90'
          }`}
          aria-hidden="true"
        />
        <Moon
          className={`w-3.5 h-3.5 transition-opacity duration-200 ${
            isDark ? 'text-teal-300 opacity-100' : 'text-slate-400 opacity-40'
          }`}
          aria-hidden="true"
        />
      </div>

      {/* Tactile Extruded Sliding Knob */}
      <div
        className={`absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ease-out neu-flat-xs border border-white/40 dark:border-white/10 ${
          isDark ? 'translate-x-8 bg-slate-800 text-teal-300' : 'translate-x-0 bg-neu-base text-amber-700'
        }`}
        style={{
          backgroundColor: isDark ? '#1f232b' : 'var(--neu-base)',
        }}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-teal-300" aria-hidden="true" />
        ) : (
          <Sun className="w-3 h-3 text-amber-600" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

