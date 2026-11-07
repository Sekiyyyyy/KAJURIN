import React from 'react';
import {
  Layers,
  PlusCircle,
  QrCode,
  Printer,
  Database,
  Camera,
  Smartphone,
  Wifi,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import KajurinLogo from './KajurinLogo';

export default function Sidebar({
  currentView,
  setCurrentView,
  activeLoansCount = 0,
  networkInfo,
  isRealtimeConnected,
  isCollapsed = false,
  onToggleCollapse
}) {
  const primaryUrl = networkInfo?.primaryUrl || window.location.origin;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Sirkulasi Peminjaman',
      desc: 'Dual-table proyektor & alat',
      icon: Layers,
      badge: activeLoansCount > 0 ? `${activeLoansCount}` : null,
    },
    {
      id: 'new-loan',
      label: 'Catat Peminjaman',
      desc: 'Formulir keluar barang',
      icon: PlusCircle
    },
    {
      id: 'qr-labels',
      label: 'Cetak Stiker QR',
      desc: 'Label tempel fisik barang',
      icon: QrCode
    },
    {
      id: 'reports',
      label: 'Laporan Resmi Kajur',
      desc: 'Format kertas fisik (PDF)',
      icon: Printer
    },
    {
      id: 'master-data',
      label: 'Master Data',
      desc: 'Barang, guru & kelas',
      icon: Database
    },
    {
      id: 'scanner',
      label: 'Scanner Kamera',
      desc: 'Scan QR via webcam/PC',
      icon: Camera
    },
    {
      id: 'mobile-access',
      label: 'Akses HP Petugas',
      desc: 'Koneksi Wi-Fi smartphone',
      icon: Smartphone
    }
  ];

  return (
    <aside
      className={`bg-neu-base text-slate-800 dark:text-slate-200 flex flex-col shrink-0 border-r border-[#d4dde8] dark:border-[#242832] z-20 no-print select-none transition-[width,background-color] duration-300 ease-in-out ${
        isCollapsed ? 'w-[76px]' : 'w-64'
      }`}
      aria-label="Sidebar Navigasi"
    >
      {/* Brand Header: Aligned with TopHeader height (h-16) */}
      <div
        className={`h-16 border-b border-[#d8e1eb] dark:border-[#242832] flex items-center transition-all ${
          isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
        }`}
      >
        {isCollapsed ? (
          /* Minimized Logo Button: Clean tactile squircle that can be clicked to expand */
          <button
            type="button"
            onClick={onToggleCollapse}
            className="w-11 h-11 rounded-2xl bg-neu-base neu-flat-xs hover:neu-flat-sm active:neu-inset-xs text-teal-800 dark:text-teal-400 flex items-center justify-center shrink-0 border border-white/60 dark:border-white/10 transition group relative"
            title="Buka Sidebar (Ctrl+B)"
            aria-label="Expand Sidebar"
          >
            <KajurinLogo size={26} />
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900/95 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 flex items-center gap-1.5 border border-white/10 dark:border-slate-800">
              <span className="font-extrabold font-display">KAJURIN</span>
              <span className="text-[10px] text-teal-400 dark:text-teal-600 font-mono font-normal">Buka (Ctrl+B)</span>
            </div>
          </button>
        ) : (
          /* Expanded Brand Header */
          <>
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-xl bg-neu-base neu-flat-sm text-teal-800 dark:text-teal-400 flex items-center justify-center shrink-0 border border-white/60 dark:border-white/10"
                title="KAJURIN - Ruang Kajur SMK Negeri 1 Beringin"
              >
                <KajurinLogo size={24} />
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-slate-900 dark:text-slate-100 text-base tracking-tight font-display block leading-tight">
                  KAJURIN
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">
                  Inventaris Ruang Kajur
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-2 rounded-xl bg-neu-base neu-flat-xs hover:neu-flat-sm active:neu-inset-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
              title="Tutup Sidebar (Ctrl+B)"
              aria-label="Collapse Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Institution Info (Expanded only) */}
      {!isCollapsed && (
        <div className="px-4 pt-3 pb-1">
          <div className="py-1 px-2.5 rounded-xl bg-neu-base neu-inset-sm flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Instansi:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] truncate max-w-[130px]">
              SMK Negeri 1 Beringin
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav
        className={`flex-1 p-2 space-y-2 ${
          isCollapsed ? 'flex flex-col items-center overflow-visible' : 'overflow-y-auto px-3'
        }`}
      >
        {!isCollapsed && (
          <p className="px-2 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
            Menu Utama
          </p>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          if (isCollapsed) {
            /* Minimized Mode: Tactile centered squircle button with active pill and floating flyout tooltip */
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentView(item.id)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-neu-base neu-inset text-teal-800 dark:text-teal-300 font-bold border border-teal-600/30'
                    : 'bg-neu-base neu-flat-xs hover:neu-flat-sm active:neu-inset-xs text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 border border-white/60 dark:border-white/5'
                }`}
                aria-label={item.label}
              >
                {/* Active Pill Indicator on Left Edge */}
                {isActive && (
                  <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-r-full bg-teal-600 dark:bg-teal-400 shadow-xs" />
                )}

                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-teal-700 dark:text-teal-300' : 'group-hover:scale-110'
                  }`}
                  aria-hidden="true"
                />

                {/* Floating Micro Badge for Active Loans */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-amber-500 text-white font-mono font-black text-[9px] rounded-full flex items-center justify-center shadow-xs ring-2 ring-neu-base">
                    {item.badge}
                  </span>
                )}

                {/* Floating Flyout Tooltip (Smooth & Non-Clipping) */}
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900/95 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 flex items-center gap-2 border border-white/10 dark:border-slate-800">
                  <span>{item.label}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">{item.desc}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500 text-white">
                      {item.badge} Aktif
                    </span>
                  )}
                </div>
              </button>
            );
          }

          /* Expanded Mode: Full width row */
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition group relative ${
                isActive
                  ? 'bg-neu-base neu-inset text-teal-900 dark:text-teal-300 font-bold'
                  : 'bg-neu-base neu-flat-sm hover:neu-flat-xs text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-1.5 rounded-lg transition shrink-0 ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-neu-base text-slate-600 dark:text-slate-400 group-hover:text-teal-700 dark:group-hover:text-teal-400'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="text-left min-w-0">
                  <span className="block truncate font-bold text-[13px]">{item.label}</span>
                  <span className="text-[10px] block truncate font-normal text-slate-500 dark:text-slate-400">{item.desc}</span>
                </div>
              </div>

              {item.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  {item.badge} Aktif
                </span>
              )}

              {!item.badge && (
                <ChevronRight
                  className={`w-3.5 h-3.5 transition opacity-0 group-hover:opacity-100 ${
                    isActive ? 'text-teal-700 dark:text-teal-400 opacity-100' : 'text-slate-400'
                  }`}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Network & Realtime Status */}
      <div className={`p-3 border-t border-[#d8e1eb] dark:border-[#242832] ${isCollapsed ? 'flex flex-col items-center gap-3' : 'space-y-2'}`}>
        {isCollapsed ? (
          /* Minimized Footer: Dedicated Expand Toggle + Sleek Status Dot with Flyout Tooltip */
          <>
            <button
              type="button"
              onClick={onToggleCollapse}
              className="w-10 h-10 rounded-xl bg-neu-base neu-flat-xs hover:neu-flat-sm active:neu-inset-xs text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center justify-center border border-white/60 dark:border-white/5 transition group relative"
              title="Buka Sidebar (Ctrl+B)"
              aria-label="Expand Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900/95 text-white dark:bg-slate-100 dark:text-slate-900 text-[11px] font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 border border-white/10 dark:border-slate-800">
                Perluas Sidebar (Ctrl+B)
              </div>
            </button>

            <div
              className="relative group cursor-pointer flex items-center justify-center py-1"
              title={isRealtimeConnected ? 'Sistem Terhubung Realtime' : 'Menghubungkan...'}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRealtimeConnected ? 'bg-emerald-400 opacity-75' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRealtimeConnected ? 'bg-emerald-600' : 'bg-amber-500'}`}></span>
              </span>
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900/95 text-white dark:bg-slate-100 dark:text-slate-900 text-[11px] font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 border border-white/10 dark:border-slate-800 flex items-center gap-1.5">
                <span>{isRealtimeConnected ? 'Sistem Terhubung Realtime' : 'Menghubungkan jaringan...'}</span>
                <span className="text-[10px] font-mono text-slate-400">v1.4</span>
              </div>
            </div>
          </>
        ) : (
          /* Expanded Footer */
          <>
            <div className="flex items-center justify-between text-[11px] px-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                Wi-Fi Server:
              </span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-[10px]">
                {primaryUrl.replace(/^https?:\/\//, '')}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-neu-base neu-inset-sm text-[11px]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRealtimeConnected ? 'bg-emerald-400 opacity-75' : 'bg-amber-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isRealtimeConnected ? 'bg-emerald-600' : 'bg-amber-500'}`}></span>
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                  {isRealtimeConnected ? 'Sistem Terhubung' : 'Menghubungkan'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">v1.4</span>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
