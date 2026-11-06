import React, { useState } from 'react';
import {
  ArrowLeft,
  Smartphone,
  Wifi,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function MobileAccessPage({
  networkInfo,
  onClose
}) {
  const [copied, setCopied] = useState(false);
  const primaryUrl = networkInfo?.primaryUrl || window.location.origin;

  const handleCopy = () => {
    navigator.clipboard.writeText(primaryUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#d8e1eb] dark:border-[#242832]">
        <div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neu-base neu-flat-xs hover:neu-flat-sm active:neu-inset-xs text-slate-700 dark:text-slate-300 text-xs font-bold transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Sirkulasi</span>
          </button>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
            Akses Mobile HP Petugas (Wi-Fi)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pindai kode QR fisik barang secara nirkabel saat memeriksa lemari dan rak di ruang Kajur
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl bg-neu-base neu-inset-xs text-teal-800 dark:text-teal-400 border border-white/60 dark:border-white/5">
          <Wifi className="w-3.5 h-3.5" />
          <span>Local LAN Server</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Card: QR Code Display */}
        <div className="md:col-span-5 bg-neu-base rounded-2xl neu-flat p-6 border border-white/60 dark:border-white/5 text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-neu-base neu-inset-sm rounded-2xl border border-white/60 dark:border-white/10 mb-4 inline-block">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(primaryUrl)}`}
              alt="QR Code HP Admin"
              className="w-52 h-52 mx-auto rounded-lg"
              width="208"
              height="208"
            />
          </div>

          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
            Scan via Kamera HP
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mb-4">
            Buka kamera HP Anda dan arahkan ke QR di atas untuk membuka web app ini di browser HP.
          </p>

          {/* Copy URL Box */}
          <div className="w-full flex items-center gap-2 p-2 bg-neu-base neu-inset-xs rounded-xl border border-white/60 dark:border-white/5">
            <span className="flex-1 font-mono text-[11px] font-bold text-teal-800 dark:text-teal-400 truncate text-left px-2">
              {primaryUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 bg-neu-base neu-flat-xs hover:neu-flat-sm active:neu-inset-xs rounded-lg text-slate-600 dark:text-slate-300 transition shrink-0"
              title="Salin tautan"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Right Card: Petunjuk Penggunaan & Keuntungan */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-neu-base rounded-2xl neu-flat p-6 border border-white/60 dark:border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              Petunjuk Penggunaan Petugas di Ruang Kajur
            </h3>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-3 p-3 bg-neu-base neu-inset-xs rounded-xl border border-white/40 dark:border-white/5">
                <span className="w-6 h-6 rounded-lg bg-teal-700 text-white font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <strong className="block text-slate-900 dark:text-slate-100">Koneksi Wi-Fi yang Sama</strong>
                  <span className="text-slate-500 dark:text-slate-400">Pastikan HP / tablet petugas tersambung ke jaringan Wi-Fi lab / ruang Kajur yang sama dengan komputer server ini.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-neu-base neu-inset-xs rounded-xl border border-white/40 dark:border-white/5">
                <span className="w-6 h-6 rounded-lg bg-teal-700 text-white font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <strong className="block text-slate-900 dark:text-slate-100">Pindai QR Akses</strong>
                  <span className="text-slate-500 dark:text-slate-400">Gunakan aplikasi kamera bawaan HP untuk memindai QR code di sebelah kiri, lalu klik tautan yang muncul.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-neu-base neu-inset-xs rounded-xl border border-white/40 dark:border-white/5">
                <span className="w-6 h-6 rounded-lg bg-teal-700 text-white font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <strong className="block text-slate-900 dark:text-slate-100">Scan Langsung di Rak Fisik</strong>
                  <span className="text-slate-500 dark:text-slate-400">Anda dapat langsung berjalan ke rak lemari dan memindai stiker QR pada badan proyektor / kabel untuk mencatat peminjaman tanpa harus bolak-balik ke meja PC.</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#d8e1eb] dark:border-[#242832] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Sistem Offline LAN Aktif</span>
              <span className="font-mono font-semibold">SMK Negeri 1 Beringin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

