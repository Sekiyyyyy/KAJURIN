import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import KajurinLogo from './KajurinLogo';
import {
  Wifi,
  Camera,
  Printer,
  QrCode,
  Database,
  PlusCircle,
  Smartphone,
  X
} from 'lucide-react';

export default function Navbar({
  networkInfo,
  onOpenNewLoan,
  onOpenScanner,
  onOpenQrLabels,
  onOpenPrintReport,
  onOpenMasterData,
  isRealtimeConnected
}) {
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [wifiQrUrl, setWifiQrUrl] = useState('');

  const primaryUrl = networkInfo?.primaryUrl || window.location.origin;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showWifiModal) {
        setShowWifiModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showWifiModal]);

  const handleOpenWifiModal = async () => {
    try {
      const qrData = await QRCode.toDataURL(primaryUrl, {
        width: 280,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' }
      });
      setWifiQrUrl(qrData);
      setShowWifiModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0f2438] text-white border-b border-slate-700 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Identity */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800/80 flex items-center justify-center shadow-sm border border-slate-700/60 p-1">
                <KajurinLogo size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-base md:text-lg tracking-tight">
                    KAJURIN
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-600">
                    SMK Negeri 1 Beringin
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">
                  Sistem Inventaris Ruang Ketua Jurusan
                </p>
              </div>
            </div>

            {/* Middle: Wi-Fi Access & Realtime Indicator */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                type="button"
                onClick={handleOpenWifiModal}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-600 rounded-lg text-xs font-semibold transition"
                title="Buka QR Akses untuk HP / Tablet Admin di Wi-Fi Lokal"
                aria-label="Lihat alamat dan QR Code akses Wi-Fi lokal"
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
                <span>Akses HP Admin</span>
                <span className="font-mono text-slate-300">({primaryUrl.replace(/^https?:\/\//, '')})</span>
                <QrCode className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              </button>

              <div
                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-[11px] font-medium"
                role="status"
                aria-live="polite"
              >
                <span className={`inline-block w-2 h-2 rounded-full ${isRealtimeConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className="text-slate-300">{isRealtimeConnected ? 'Real-Time Sync' : 'Menghubungkan'}</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Primary Action: Catat Peminjaman */}
              <button
                type="button"
                onClick={onOpenNewLoan}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition min-h-[38px]"
                aria-label="Catat peminjaman baru"
              >
                <PlusCircle className="w-4 h-4" aria-hidden="true" />
                <span>Catat Pinjam</span>
              </button>

              {/* Scan Camera */}
              <button
                type="button"
                onClick={onOpenScanner}
                className="p-2 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition min-h-[38px]"
                aria-label="Scan QR Code Barang menggunakan Kamera"
                title="Scan QR Code Barang via Kamera"
              >
                <Camera className="w-4 h-4 text-slate-300" aria-hidden="true" />
                <span className="hidden sm:inline">Scan QR</span>
              </button>

              {/* Stiker QR */}
              <button
                type="button"
                onClick={onOpenQrLabels}
                className="p-2 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition min-h-[38px]"
                title="Cetak Stiker Label QR Barang"
                aria-label="Buka Generator Stiker QR Code"
              >
                <QrCode className="w-4 h-4 text-slate-300" aria-hidden="true" />
                <span className="hidden lg:inline">Stiker QR</span>
              </button>

              {/* Laporan Resmi */}
              <button
                type="button"
                onClick={onOpenPrintReport}
                className="p-2 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition min-h-[38px]"
                title="Cetak Formulir Dokumen Fisik Kajur (PDF)"
                aria-label="Cetak Laporan Format Dokumen Fisik Kajur"
              >
                <Printer className="w-4 h-4 text-slate-300" aria-hidden="true" />
                <span className="hidden lg:inline">Cetak Laporan</span>
              </button>

              {/* Master Data */}
              <button
                type="button"
                onClick={onOpenMasterData}
                className="p-2 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition min-h-[38px]"
                title="Kelola Master Data Barang, Guru, dan Kelas"
                aria-label="Buka Manajemen Master Data"
              >
                <Database className="w-4 h-4 text-slate-300" aria-hidden="true" />
                <span className="hidden lg:inline">Master Data</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Wi-Fi Connection Modal for Admin's Phone/Tablet */}
      {showWifiModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs no-print"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wifi-modal-title"
        >
          <div className="relative w-full max-w-sm bg-white rounded-xl shadow-xl p-6 text-center border border-slate-300">
            <button
              type="button"
              onClick={() => setShowWifiModal(false)}
              className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-slate-700 rounded-md"
              aria-label="Tutup jendela QR Wi-Fi"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="w-11 h-11 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center mx-auto mb-3 border border-blue-200">
              <Smartphone className="w-6 h-6" aria-hidden="true" />
            </div>

            <h3 id="wifi-modal-title" className="font-bold text-slate-900 text-base mb-1">
              Buka KAJURIN di HP Petugas / Admin
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Petugas dapat menggunakan HP untuk scan stiker barang sambil berjalan di ruang Kajur. Hubungkan ke Wi-Fi lokal, lalu scan QR ini:
            </p>

            <div className="bg-white p-3 rounded-lg border border-slate-300 inline-block mx-auto mb-3">
              {wifiQrUrl && (
                <img
                  src={wifiQrUrl}
                  alt="QR Code Akses Wi-Fi"
                  className="w-48 h-48 mx-auto"
                  width="192"
                  height="192"
                />
              )}
            </div>

            <p className="p-2 bg-slate-100 rounded-md text-xs font-mono font-bold text-slate-800 break-all mb-4 border border-slate-200">
              {primaryUrl}
            </p>

            <button
              type="button"
              onClick={() => setShowWifiModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
