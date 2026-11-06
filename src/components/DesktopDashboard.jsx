import React, { useState } from 'react';
import {
  Projector,
  Wrench,
  Search,
  Calendar,
  X,
  Bell
} from 'lucide-react';
import ProjectorTable from './ProjectorTable';
import ToolsTable from './ToolsTable';
import WorkstationOverview from './WorkstationOverview';

export default function DesktopDashboard({
  loans,
  items,
  stats,
  onOpenReturn,
  onOpenNewLoan,
  activeNotification,
  onDismissNotification
}) {
  const [activeTab, setActiveTab] = useState('PROYEKTOR');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  const filteredLoans = loans.filter(loan => {
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      const matchTeacher = (loan.teacher_name || '').toLowerCase().includes(q);
      const matchBorrower = (loan.borrower_name || '').toLowerCase().includes(q);
      const matchClass = (loan.class_name || '').toLowerCase().includes(q);
      const matchItems = (loan.details || []).some(d =>
        (d.item_code || '').toLowerCase().includes(q) ||
        (d.item_name || '').toLowerCase().includes(q)
      );
      if (!matchTeacher && !matchBorrower && !matchClass && !matchItems) return false;
    }

    if (statusFilter !== 'ALL' && loan.status !== statusFilter) {
      return false;
    }

    if (dateFilter) {
      const parts = dateFilter.split('-');
      if (parts.length === 3) {
        const dd = parts[2];
        const mm = parts[1];
        const yy = parts[0].slice(-2);
        const formatted = `${dd}-${mm}-${yy}`;
        if (loan.loan_date !== formatted) return false;
      }
    }

    return true;
  });

  const projectorCount = loans.filter(l => l.hasProjector && (statusFilter === 'ALL' || l.status === statusFilter)).length;
  const toolsCount = loans.filter(l => l.hasTools && (statusFilter === 'ALL' || l.status === statusFilter)).length;

  return (
    <div className="space-y-6">
      {/* Realtime Notification Banner */}
      {activeNotification && (
        <div
          role="alert"
          className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 px-4 py-3 rounded-2xl flex items-center justify-between neu-flat-xs animate-in fade-in"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 rounded-lg neu-inset-xs">
              <Bell className="w-4 h-4 animate-bounce" aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold">{activeNotification.message}</span>
          </div>
          <button
            type="button"
            onClick={onDismissNotification}
            className="text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 p-1 rounded-lg"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Clean Minimalist Neumorphic Stat Counters */}
      <WorkstationOverview
        stats={stats}
        items={items}
        loans={loans}
        onOpenReturn={onOpenReturn}
        onOpenNewLoan={onOpenNewLoan}
      />

      {/* Main Dual-Table Container with Extruded Neumorphic Plate */}
      <div className="bg-neu-base rounded-2xl neu-flat border border-white/60 dark:border-white/5 overflow-hidden transition-colors duration-200">
        {/* Tab & Filter Header */}
        <div className="p-4 sm:p-5 border-b border-[#d8e1eb] dark:border-[#242832] flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Neumorphic Segmented Tab Track */}
          <div className="inline-flex p-1.5 bg-neu-base neu-inset-sm rounded-xl gap-1.5 self-start" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'PROYEKTOR'}
              onClick={() => setActiveTab('PROYEKTOR')}
              className={`py-2 px-4 font-extrabold text-xs sm:text-sm rounded-lg transition flex items-center gap-2 font-display ${
                activeTab === 'PROYEKTOR'
                  ? 'bg-neu-base neu-flat-sm text-teal-900 dark:text-teal-300 border border-white/60 dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Projector className="w-4 h-4 text-teal-700 dark:text-teal-400" aria-hidden="true" />
              <span>Format 1: Khusus Proyektor</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'PROYEKTOR'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-neu-base neu-inset-xs text-slate-700 dark:text-slate-300'
              }`}>
                {projectorCount}
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'ALAT_BEBAS'}
              onClick={() => setActiveTab('ALAT_BEBAS')}
              className={`py-2 px-4 font-extrabold text-xs sm:text-sm rounded-lg transition flex items-center gap-2 font-display ${
                activeTab === 'ALAT_BEBAS'
                  ? 'bg-neu-base neu-flat-sm text-teal-900 dark:text-teal-300 border border-white/60 dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Wrench className="w-4 h-4 text-teal-700 dark:text-teal-400" aria-hidden="true" />
              <span>Format 2: Alat & Bahan</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'ALAT_BEBAS'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-neu-base neu-inset-xs text-slate-700 dark:text-slate-300'
              }`}>
                {toolsCount}
              </span>
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">
            Format lembar fisik resmi Kajur SMK Negeri 1 Beringin
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 border-b border-[#d8e1eb] dark:border-[#242832] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Inset Search Field */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <label htmlFor="search-input" className="sr-only">Cari catatan peminjaman</label>
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              id="search-input"
              type="text"
              placeholder="Cari guru, siswa, kelas, kode barang..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-neu-base neu-inset-sm rounded-xl text-xs font-medium focus:outline-none border border-white/40 dark:border-white/5 focus:border-teal-600/60 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {searchKeyword && (
              <button
                type="button"
                onClick={() => setSearchKeyword('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label="Bersihkan pencarian"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter Segment */}
            <div className="inline-flex p-1 bg-neu-base neu-inset-xs rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === 'ALL'
                    ? 'bg-neu-base neu-flat-xs text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('DIPINJAM')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  statusFilter === 'DIPINJAM'
                    ? 'bg-amber-600 text-white neu-flat-xs'
                    : 'text-amber-800 dark:text-amber-400 hover:bg-amber-100/30'
                }`}
              >
                Dipinjam
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('SELESAI')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  statusFilter === 'SELESAI'
                    ? 'bg-emerald-700 text-white neu-flat-xs'
                    : 'text-emerald-800 dark:text-emerald-400 hover:bg-emerald-100/30'
                }`}
              >
                Selesai
              </button>
            </div>

            {/* Date filter with Neumorphic Raised Surface */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neu-base neu-flat-xs border border-white/60 dark:border-white/5">
              <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-mono bg-transparent"
                aria-label="Filter tanggal"
              />
              {dateFilter && (
                <button
                  type="button"
                  onClick={() => setDateFilter('')}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  aria-label="Hapus filter tanggal"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tables Area */}
        <div className="p-4 sm:p-5">
          {activeTab === 'PROYEKTOR' ? (
            <ProjectorTable
              loans={filteredLoans}
              onOpenReturn={onOpenReturn}
            />
          ) : (
            <ToolsTable
              loans={filteredLoans}
              onOpenReturn={onOpenReturn}
            />
          )}
        </div>
      </div>
    </div>
  );
}
