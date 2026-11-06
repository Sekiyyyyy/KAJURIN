import React from 'react';
import {
  Package,
  Clock,
  RotateCcw,
  CheckCircle2,
  Layers
} from 'lucide-react';

export default function WorkstationOverview({
  stats,
  items = [],
  loans = []
}) {
  const total = items.length || stats?.totalItems || 11;
  const activeLoans = loans.filter(l => l.status === 'DIPINJAM');
  const activeCount = activeLoans.length;
  const availableCount = Math.max(0, total - activeCount);
  const returnedToday = stats?.returnedToday ?? 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      {/* Stat 1: Tersedia di Rak */}
      <div className="bg-neu-base neu-flat-sm rounded-2xl p-4 flex items-center gap-3.5 transition border border-white/60 dark:border-white/5">
        <div className="w-11 h-11 rounded-xl bg-neu-base neu-inset-sm text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
          <Package className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Tersedia di Rak
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {availableCount}
            </span>
            <span className="text-xs font-semibold text-teal-800 dark:text-teal-400">
              Unit Siap
            </span>
          </div>
        </div>
      </div>

      {/* Stat 2: Sedang Dipinjam */}
      <div className={`rounded-2xl p-4 flex items-center gap-3.5 transition border border-white/60 dark:border-white/5 ${
        activeCount > 0
          ? 'bg-neu-base neu-flat-sm ring-1 ring-amber-500/40'
          : 'bg-neu-base neu-flat-sm'
      }`}>
        <div className={`w-11 h-11 rounded-xl bg-neu-base neu-inset-sm flex items-center justify-center shrink-0 ${
          activeCount > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-400'
        }`}>
          <Clock className={`w-5 h-5 ${activeCount > 0 ? 'animate-pulse' : ''}`} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Sedang di Kelas
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className={`text-2xl font-black font-mono tabular-nums ${activeCount > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'}`}>
              {activeCount}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {activeCount > 0 ? 'Perlu Pantau' : 'Nihil'}
            </span>
          </div>
        </div>
      </div>

      {/* Stat 3: Selesai Hari Ini */}
      <div className="bg-neu-base neu-flat-sm rounded-2xl p-4 flex items-center gap-3.5 transition border border-white/60 dark:border-white/5">
        <div className="w-11 h-11 rounded-xl bg-neu-base neu-inset-sm text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Selesai Hari Ini
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {returnedToday}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Pengembalian
            </span>
          </div>
        </div>
      </div>

      {/* Stat 4: Total Inventaris Terdata */}
      <div className="bg-neu-base neu-flat-sm rounded-2xl p-4 flex items-center gap-3.5 transition border border-white/60 dark:border-white/5">
        <div className="w-11 h-11 rounded-xl bg-neu-base neu-inset-sm text-slate-700 dark:text-slate-400 flex items-center justify-center shrink-0">
          <Layers className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Total Inventaris
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {total}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Item Terdata
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
