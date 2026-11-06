import React, { useState } from 'react';
import {
  ArrowLeft,
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

export default function ReturnPage({
  loan,
  onClose,
  onSuccess
}) {
  const [conditionAfter, setConditionAfter] = useState('BAIK');
  const [hasRemote, setHasRemote] = useState(true);
  const [hasHdmi, setHasHdmi] = useState(true);
  const [hasPower, setHasPower] = useState(true);
  const [returnNotes, setReturnNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!loan) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 text-center">
        <p className="text-slate-500 mb-4">Tidak ada transaksi yang dipilih untuk pengembalian.</p>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-neu-base neu-flat-xs text-xs font-bold rounded-xl"
        >
          Kembali ke Sirkulasi
        </button>
      </div>
    );
  }

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
            Konfirmasi Pengembalian Barang
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pencatatan verifikasi barang kembali ke ruang Kajur SMK Negeri 1 Beringin
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Waktu Sekarang: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 rounded-xl text-xs flex items-center gap-2" role="alert">
          <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Card */}
      <form onSubmit={handleSubmit} className="bg-neu-base rounded-2xl neu-flat p-6 border border-white/60 dark:border-white/5 space-y-5">
        {/* Loan Details Banner */}
        <div className="p-4 bg-neu-base neu-inset-sm rounded-xl border border-white/40 dark:border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-lg border border-amber-300 dark:border-amber-800">
              Status: Sedang Dipinjam
            </span>
            <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Mulai Pinjam: {loan.start_time} WIB
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{loan.borrower_name}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Guru Pengampu: <strong className="text-slate-800 dark:text-slate-200">{loan.teacher_name}</strong> | Kelas: <strong className="text-slate-800 dark:text-slate-200">{loan.class_name}</strong>
            </p>
          </div>

          <div className="pt-2 border-t border-[#d8e1eb] dark:border-[#242832]">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
              Daftar Barang yang Harus Masuk ke Lemari:
            </span>
            <div className="flex flex-wrap gap-2">
              {loan.details?.map(d => (
                <span
                  key={d.id}
                  className="text-xs bg-neu-base neu-flat-xs border border-white/60 dark:border-white/5 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-xl font-medium"
                >
                  <strong className="text-teal-800 dark:text-teal-400 font-mono">[{d.item_code}]</strong> {d.item_name} {d.quantity > 1 ? `(${d.quantity} unit)` : ''}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Condition Check */}
        <div>
          <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
            Kondisi Fisik Saat Dikembalikan:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setConditionAfter('BAIK')}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                conditionAfter === 'BAIK'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-neu-base neu-flat-xs text-slate-700 dark:text-slate-300 border border-white/60 dark:border-white/5'
              }`}
            >
              <Check className="w-4 h-4" />
              Lengkap & Berfungsi Baik
            </button>
            <button
              type="button"
              onClick={() => setConditionAfter('RUSAK')}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                conditionAfter === 'RUSAK'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-neu-base neu-flat-xs text-slate-700 dark:text-slate-300 border border-white/60 dark:border-white/5'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Ada Kerusakan / Masalah Fisik
            </button>
          </div>
        </div>

        {/* Checklist Kelengkapan Aksesoris */}
        <div className="p-4 bg-neu-base neu-inset-sm rounded-xl border border-white/60 dark:border-white/5">
          <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5">
            Pengecekan Aksesoris Fisik:
          </span>
          <div className="space-y-2.5 text-xs font-medium text-slate-800 dark:text-slate-200">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasRemote}
                onChange={(e) => setHasRemote(e.target.checked)}
                className="w-4 h-4 text-teal-700 accent-teal-700 rounded cursor-pointer"
              />
              <span>Remote Proyektor (Jika meminjam unit proyektor INF)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasHdmi}
                onChange={(e) => setHasHdmi(e.target.checked)}
                className="w-4 h-4 text-teal-700 accent-teal-700 rounded cursor-pointer"
              />
              <span>Kabel HDMI / Kabel VGA / Adapter Konverter</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPower}
                onChange={(e) => setHasPower(e.target.checked)}
                className="w-4 h-4 text-teal-700 accent-teal-700 rounded cursor-pointer"
              />
              <span>Kabel Power Utama & Cok Sambung Gulung</span>
            </label>
          </div>
        </div>

        {/* Return Notes */}
        <div>
          <label htmlFor="return-notes-input" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            Catatan Tambahan Pengembalian (Opsional):
          </label>
          <input
            id="return-notes-input"
            type="text"
            value={returnNotes}
            onChange={(e) => setReturnNotes(e.target.value)}
            placeholder="Contoh: Unit proyektor dan kabel dikembalikan dalam kondisi rapi ke kompartemen A"
            className="w-full px-3.5 py-2.5 bg-neu-base neu-inset-sm rounded-xl text-xs font-medium border border-white/60 dark:border-white/10 focus:outline-none focus:border-teal-600 text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#d8e1eb] dark:border-[#242832]">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Waktu Selesai: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-neu-base neu-flat-xs hover:neu-flat-sm active:neu-inset-xs text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition border border-white/60 dark:border-white/5"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold neu-flat-sm active:neu-inset-xs flex items-center gap-2 transition"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Konfirmasi Barang Masuk</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

