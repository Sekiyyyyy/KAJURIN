import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, AlertCircle, Search, Keyboard, ArrowLeft } from 'lucide-react';

export default function CameraScannerModal({ isOpen = true, onClose, onScanSuccess }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [manualCode, setManualCode] = useState('');
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    setErrorMessage('');
    const qrRegionId = 'reader-region';

    const timer = setTimeout(() => {
      try {
        const html5QrCode = new Html5Qrcode(qrRegionId);
        html5QrCodeRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1.0
        };

        html5QrCode.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            handleScannedText(decodedText);
          },
          () => {}
        ).catch((err) => {
          console.warn('Camera start error:', err);
          setErrorMessage('Kamera tidak dapat diakses atau izin belum diberikan. Gunakan input kode barang manual di bawah.');
        });
      } catch (err) {
        console.warn('Init error:', err);
        setErrorMessage('Gagal menginisialisasi kamera.');
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, []);

  const stopScanner = () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      html5QrCodeRef.current.stop().then(() => {
        html5QrCodeRef.current.clear();
      }).catch(err => console.warn('Stop scanner error:', err));
    }
  };

  const handleScannedText = (text) => {
    stopScanner();
    let code = text.trim();
    try {
      if (text.includes('item=')) {
        const url = new URL(text);
        code = url.searchParams.get('item') || text;
      }
    } catch (e) {
      // not a full URL
    }
    onScanSuccess(code);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleScannedText(manualCode.trim().toUpperCase());
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
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
          <h2 id="scanner-modal-title" className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
            Pemindai Kamera QR Code
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Arahkan webcam atau kamera perangkat ke stiker fisik barang untuk deteksi cepat
          </p>
        </div>
      </div>

      <div className="relative w-full bg-neu-base rounded-2xl neu-flat overflow-hidden border border-white/60 dark:border-white/10 text-slate-800 dark:text-slate-100 p-6 space-y-5">
        {/* Camera Viewport */}
        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[300px] bg-stone-950 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-stone-800 shadow-inner">
            <div id="reader-region" className="w-full h-full" />
            <div className="absolute inset-8 pointer-events-none border-2 border-dashed border-teal-400/80 rounded-xl"></div>
          </div>

          {errorMessage && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-xl text-xs w-full max-w-md" role="alert">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Manual Input Alternative */}
          <div className="mt-5 pt-4 border-t border-[#d8e1eb] dark:border-[#242832] w-full max-w-md">
            <label htmlFor="manual-code-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" aria-hidden="true" />
              Atau Masukkan Kode Barang Manual:
            </label>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                id="manual-code-input"
                type="text"
                placeholder="Contoh: INF-01, COK-01"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 px-3 py-2 bg-neu-base neu-inset-sm rounded-xl text-xs font-mono uppercase focus:outline-none border border-white/60 dark:border-white/10 focus:border-teal-600 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!manualCode.trim()}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold neu-flat-sm active:neu-inset-xs flex items-center gap-1.5 transition"
              >
                <Search className="w-3.5 h-3.5" aria-hidden="true" />
                Pilih
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
