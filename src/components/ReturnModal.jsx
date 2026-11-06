import React, { useState, useEffect } from 'react';
import {
  X,
  RotateCcw,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../utils/api';
import { playChime } from '../utils/sound';

export default function ReturnModal({
  isOpen,
  onClose,
  onSuccess,
  loan
}) {
  const [conditionAfter, setConditionAfter] = useState('BAIK');
  const [hasRemote, setHasRemote] = useState(true);
  const [hasHdmi, setHasHdmi] = useState(true);
  const [hasPower, setHasPower] = useState(true);
  const [returnNotes, setReturnNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !loan) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        conditionAfter,
        isComplete: true,
        hasRemote,
        hasHdmi,
        hasPower,
        returnNotes
      };

      const result = await api.returnLoan(loan.id, payload);
      playChime('return');
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      if (onSuccess) onSuccess(result);
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menyelesaikan pengembalian.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-return-title"
    >
      <div className="relative w-full max-w-lg bg-neu-base rounded-2xl neu-flat border border-white/60 dark:border-white/10 overflow-hidden my-4 text-slate-800 dark:text-slate-100">
        {/* Header: Neumorphic Soft Surface */}
        <div className="px-5 py-4 border-b border-[#d8e1eb] dark:border-[#242832] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neu-base neu-inset-sm text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 id="modal-return-title" className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                Konfirmasi Pengembalian Barang
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Pencatatan barang kembali ke ruang Kajur
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-neu-base neu-flat-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
            aria-label="Tutup formulir pengembalian"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 p-3 bg-rose-50 border border-rose-300 text-rose-900 rounded-xl text-xs flex items-center gap-2" role="alert">
            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Active Loan Details Card with Neumorphic Inset */}
          <div className="p-4 bg-[#e8ecf2] rounded-xl shadow-[inset_2px_2px_5px_#c5d0de,inset_-2px_-2px_5px_#ffffff] border border-white/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-900 bg-orange-200/80 px-2 py-0.5 rounded-lg border border-orange-300">
                Status: Sedang Dipinjam
              </span>
              <span className="text-xs font-mono font-bold text-orange-900 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                Mulai Pinjam: {loan.start_time}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{loan.borrower_name}</h3>
              <p className="text-xs text-slate-600">
                Guru: <span className="font-bold">{loan.teacher_name}</span> | Kelas: <span className="font-bold">{loan.class_name}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-[#d8e1eb]">
              <span className="text-[11px] font-bold text-slate-800 block mb-1">Barang yang harus dikembalikan:</span>
              <div className="flex flex-wrap gap-1.5">
                {loan.details?.map(d => (
                  <span key={d.id} className="text-xs bg-[#e8ecf2] shadow-[2px_2px_4px_#c5d0de,-2px_-2px_4px_#ffffff] border border-white/60 text-slate-800 px-2.5 py-1 rounded-lg font-medium">
                    [{d.item_code}] {d.item_name} {d.quantity > 1 ? `(${d.quantity})` : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Condition After Check */}
          <div>
            <span className="block text-xs font-bold text-slate-800 mb-1.5">
              Kondisi Fisik Saat Dikembalikan:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setConditionAfter('BAIK')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  conditionAfter === 'BAIK'
                    ? 'bg-green-700 text-white shadow-xs'
                    : 'bg-[#e8ecf2] text-slate-700 shadow-[2px_2px_4px_#c5d0de,-2px_-2px_4px_#ffffff] border border-white/60'
                }`}
              >
                <Check className="w-4 h-4" aria-hidden="true" />
                Lengkap & Berfungsi Baik
              </button>
              <button
                type="button"
                onClick={() => setConditionAfter('RUSAK')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  conditionAfter === 'RUSAK'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'bg-[#e8ecf2] text-slate-700 shadow-[2px_2px_4px_#c5d0de,-2px_-2px_4px_#ffffff] border border-white/60'
                }`}
              >
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                Ada Kerusakan / Masalah
              </button>
            </div>
          </div>

          {/* Checklist Kelengkapan */}
          <div className="p-3 bg-[#e8ecf2] rounded-xl shadow-[inset_2px_2px_4px_#c5d0de,inset_-2px_-2px_4px_#ffffff] border border-white/60">
            <span className="block text-xs font-bold text-slate-800 mb-2">
              Kelengkapan Aksesori:
            </span>
            <div className="space-y-2 text-xs font-medium text-slate-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasRemote}
                  onChange={(e) => setHasRemote(e.target.checked)}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600"
                />
                <span>Remote Proyektor (Jika meminjam unit proyektor)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasHdmi}
                  onChange={(e) => setHasHdmi(e.target.checked)}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600"
                />
                <span>Kabel HDMI / Kabel VGA / Konverter</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPower}
                  onChange={(e) => setHasPower(e.target.checked)}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600"
                />
                <span>Kabel Power & Cok Sambung</span>
              </label>
            </div>
          </div>

          {/* Return Notes */}
          <div>
            <label htmlFor="modal-return-notes" className="block text-xs font-bold text-slate-800 mb-1">
              Catatan Pengembalian (Opsional)
            </label>
            <input
              id="modal-return-notes"
              type="text"
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              placeholder="Contoh: Unit dan kelengkapan diterima rapi"
              className="w-full px-3 py-2 bg-[#e8ecf2] shadow-[inset_2px_2px_4px_#c5d0de,inset_-2px_-2px_4px_#ffffff] rounded-xl text-xs font-medium border border-white/60 focus:outline-none focus:border-teal-600"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-[#d8e1eb]">
            <span className="text-xs text-slate-500 font-mono">
              Jam Selesai: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#e8ecf2] shadow-[2px_2px_5px_#c5d0de,-2px_-2px_5px_#ffffff] text-slate-700 hover:text-slate-900 rounded-xl text-xs font-semibold transition border border-white/60"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-[3px_3px_7px_#c5d0de,-3px_-3px_7px_#ffffff] active:shadow-[inset_2px_2px_4px_#00000030] flex items-center gap-1.5 transition"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Menyelesaikan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Selesaikan Pengembalian</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
