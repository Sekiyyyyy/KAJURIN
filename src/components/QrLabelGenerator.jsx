import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Printer, X, CheckSquare, Square, Globe, ArrowLeft } from 'lucide-react';

export default function QrLabelGenerator({ items, networkInfo, onClose }) {
  const [qrImages, setQrImages] = useState({});
  const [selectedItemIds, setSelectedItemIds] = useState(items.map(i => i.id));
  const [customHost, setCustomHost] = useState(networkInfo?.primaryUrl || window.location.origin);

  useEffect(() => {
    generateAllQrs();
  }, [items, customHost]);

  async function generateAllQrs() {
    const images = {};
    for (const item of items) {
      try {
        const scanUrl = `${customHost.replace(/\/$/, '')}/scan?item=${encodeURIComponent(item.item_code)}`;
        const dataUrl = await QRCode.toDataURL(scanUrl, {
          width: 250,
          margin: 1,
          color: {
            dark: '#0c3547',
            light: '#ffffff'
          }
        });
        images[item.id] = dataUrl;
      } catch (err) {
        console.error('QR Generation error:', err);
      }
    }
    setQrImages(images);
  }

  const toggleSelectAll = () => {
    if (selectedItemIds.length === items.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(items.map(i => i.id));
    }
  };

  const toggleItem = (id) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter(i => i !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredItems = items.filter(i => selectedItemIds.includes(i.id));

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Header (Hidden in Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#d8e1eb] dark:border-[#242832]">
        <div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neu-base neu-flat-xs hover:neu-flat-sm active:neu-inset-xs text-slate-700 dark:text-slate-300 text-xs font-bold transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Sirkulasi</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-bold bg-neu-base neu-flat-xs text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg border border-white/60 dark:border-white/5">
              Stiker Fisik
            </span>
            <h2 id="qr-label-title" className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
              Cetak Stiker Label QR Code Barang
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Stiker siap cetak dan tempel pada badan unit proyektor, kabel, atau cok sambung di ruang Kajur SMK Negeri 1 Beringin.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            disabled={filteredItems.length === 0}
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold neu-flat-sm active:neu-inset-xs flex items-center gap-1.5 transition min-h-[38px]"
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
            Cetak Stiker ({filteredItems.length})
          </button>
        </div>
      </div>

      <div className="relative w-full bg-neu-base rounded-2xl neu-flat border border-white/60 dark:border-white/10 overflow-hidden text-slate-800 dark:text-slate-100">

        {/* Configuration Bar (Hidden in Print) */}
        <div className="no-print p-3 bg-[#e8ecf2] border-b border-[#d8e1eb] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-600 shrink-0" aria-hidden="true" />
            <label htmlFor="custom-host-input" className="font-semibold text-slate-800">Host URL Scan HP:</label>
            <input
              id="custom-host-input"
              type="text"
              value={customHost}
              onChange={(e) => setCustomHost(e.target.value)}
              placeholder="http://192.168.1.xxx:3000"
              className="px-2.5 py-1.5 bg-[#e8ecf2] shadow-[inset_2px_2px_4px_#c5d0de,inset_-2px_-2px_4px_#ffffff] rounded-xl text-xs font-mono w-64 border border-white/60 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={toggleSelectAll}
            className="flex items-center gap-1.5 text-slate-800 hover:text-teal-700 font-semibold transition px-3 py-1.5 rounded-xl bg-[#e8ecf2] shadow-[2px_2px_4px_#c5d0de,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#c5d0de]"
          >
            {selectedItemIds.length === items.length ? (
              <CheckSquare className="w-4 h-4 text-teal-700" aria-hidden="true" />
            ) : (
              <Square className="w-4 h-4 text-slate-500" aria-hidden="true" />
            )}
            Pilih Semua ({items.length})
          </button>
        </div>

        {/* Sticker Sheet Grid Preview */}
        <div className="p-6 bg-[#e8ecf2] max-h-[70vh] overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              Tidak ada barang yang dipilih untuk dicetak.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className="p-3 bg-white rounded-lg border-2 border-stone-800 shadow-xs cursor-pointer flex flex-col justify-between"
                  style={{ minHeight: '140px' }}
                >
                  {/* Sticker Header */}
                  <div className="flex items-start justify-between border-b border-stone-800 pb-1.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-stone-900 text-xs tracking-wider">KAJURIN</span>
                        <span className="text-[9px] bg-stone-200 text-stone-900 font-bold px-1 rounded">
                          SMK Negeri 1 Beringin
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-600 font-medium">Inventaris Ruang Kajur</p>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-stone-800 bg-stone-100 text-stone-900">
                      {item.category}
                    </span>
                  </div>

                  {/* Sticker Body */}
                  <div className="flex items-center gap-3 py-2">
                    {qrImages[item.id] ? (
                      <img
                        src={qrImages[item.id]}
                        alt={`QR Code ${item.item_code}`}
                        className="w-20 h-20 shrink-0 border border-stone-300 rounded p-1 bg-white"
                        width="80"
                        height="80"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-stone-200 rounded" />
                    )}

                    <div className="flex-1 min-w-0">
                      <span className="inline-block font-mono font-black text-lg text-stone-900 tracking-tight">
                        {item.item_code}
                      </span>
                      <h4 className="font-bold text-xs text-stone-900 line-clamp-2 leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-stone-600 mt-1">
                        Scan untuk Pinjam / Kembali
                      </p>
                    </div>
                  </div>

                  {/* Sticker Footer */}
                  <div className="border-t border-dashed border-stone-400 pt-1 flex justify-between items-center text-[9px] text-stone-600 font-mono">
                    <span>KONDISI: {item.condition}</span>
                    <span>WI-FI LOKAL KAJUR</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
