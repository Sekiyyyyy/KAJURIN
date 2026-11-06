import React, { useState, useEffect, useRef } from 'react';
import {
  PlusCircle,
  Barcode,
  Clock
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function TopHeader({
  currentViewTitle = 'Sirkulasi Peminjaman',
  onOpenNewLoan,
  onQuickScanSubmit,
  isDark = false,
  onToggleTheme
}) {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [scanInput, setScanInput] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // F2 -> open new loan modal
      if (e.key === 'F2') {
        e.preventDefault();
        onOpenNewLoan();
        return;
      }

      // / or F3 or Ctrl+K -> focus barcode search
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      if ((e.key === '/' || e.key === 'F3' || (e.ctrlKey && e.key === 'k')) && !isInput) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onOpenNewLoan]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    onQuickScanSubmit(scanInput.trim().toUpperCase());
    setScanInput('');
  };

  return (
    <header className="h-16 bg-neu-base border-b border-[#d8e1eb] dark:border-[#242832] px-6 flex items-center justify-between gap-4 shrink-0 neu-flat-sm no-print sticky top-0 z-10 transition-colors duration-200">
      {/* Left: View Title & Live Clock */}
      <div className="flex items-center gap-4 min-w-0">
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight truncate font-display">
            {currentViewTitle}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>{currentDate}</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="font-mono font-bold text-teal-800 dark:text-teal-400 tabular-nums flex items-center gap-1">
              <Clock className="w-3 h-3 text-teal-700 dark:text-teal-400" aria-hidden="true" />
              {currentTime}
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Universal Barcode & Search Bar with Inset Neumorphic Styling */}
      <div className="flex-1 max-w-md hidden md:block">
        <form onSubmit={handleSubmit} className="relative">
          <Barcode className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Scan / ketik barcode barang (INF-01, COK-01)... [ / ]"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            className="w-full pl-10 pr-20 py-2 bg-neu-base neu-inset-sm rounded-xl text-xs font-mono font-bold uppercase transition focus:outline-none focus:ring-2 focus:ring-teal-600/50 border border-white/40 dark:border-white/5 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-neu-base neu-flat-xs px-1.5 py-0.5 rounded border border-white/40 dark:border-white/5">
              Enter
            </span>
          </div>
        </form>
      </div>

      {/* Right: Theme Toggle & Primary Action Button */}
      <div className="flex items-center gap-3.5 shrink-0">
        {/* Neumorphic Dark/Light Mode Switch */}
        {onToggleTheme && (
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
        )}

        <button
          type="button"
          onClick={() => onOpenNewLoan()}
          className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[3px_3px_7px_var(--neu-dark),-3px_-3px_7px_var(--neu-light)] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3)] transition"
        >
          <PlusCircle className="w-4 h-4" aria-hidden="true" />
          <span>Catat Peminjaman</span>
          <kbd className="hidden sm:inline-block text-[10px] bg-teal-800/80 border border-teal-500/40 px-1.5 py-0.5 rounded font-mono font-medium">
            F2
          </kbd>
        </button>
      </div>
    </header>
  );
}
