import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Package,
  User,
  GraduationCap,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../utils/api';
import { playChime } from '../utils/sound';

export default function NewLoanPage({
  onClose,
  onSuccess,
  prefilledItemCode = '',
  allItems = [],
  teachers = [],
  classes = []
}) {
  const [primaryItemCode, setPrimaryItemCode] = useState(prefilledItemCode || '');
  const [teacherName, setTeacherName] = useState('');
  const [className, setClassName] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [conditionBefore, setConditionBefore] = useState('BAIK');
  const [isVerified, setIsVerified] = useState(true);
  const [adminName, setAdminName] = useState('Petugas Kajur');
  const [additionalItems, setAdditionalItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (prefilledItemCode) {
      setPrimaryItemCode(prefilledItemCode);
    } else if (allItems.length > 0 && !primaryItemCode) {
      const firstAvailable = allItems.find(i => i.status === 'TERSEDIA');
      if (firstAvailable) setPrimaryItemCode(firstAvailable.item_code);
    }
  }, [prefilledItemCode, allItems]);

  const selectedItemObj = allItems.find(i => i.item_code === primaryItemCode);

  const handleAddExtraItem = () => {
    const availableTools = allItems.filter(i => i.category === 'ALAT_BEBAS' && i.status === 'TERSEDIA');
    if (availableTools.length === 0) {
      alert('Semua alat dan bahan pendukung sedang dipinjam.');
      return;
    }
    setAdditionalItems([
      ...additionalItems,
      { itemId: availableTools[0].id, quantity: 1 }
    ]);
  };

  const handleUpdateExtraItem = (index, field, val) => {
    const updated = [...additionalItems];
    updated[index][field] = val;
    setAdditionalItems(updated);
  };

  const handleRemoveExtraItem = (index) => {
    setAdditionalItems(additionalItems.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!primaryItemCode) {
      setError('Pilih barang utama yang dipinjam.');
      return;
    }
    if (!teacherName) {
      setError('Pilih atau ketik Nama Guru Pengampu.');
      return;
    }
    if (!className) {
      setError('Pilih atau ketik Kelas / Mata Pelajaran.');
      return;
    }
    if (!borrowerName.trim()) {
      setError('Ketik Nama Siswa yang mengambil barang.');
      return;
    }
    if (!isVerified) {
      setError('Centang checklist konfirmasi serah terima barang.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        primaryItemCode,
        additionalItems,
        teacherName,
        className,
        borrowerName,
        conditionBefore,
        signatureBase64: 'VERIFIED_CHECKLIST',
        adminName
      };

      const result = await api.createLoan(payload);
      playChime('loan');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      if (onSuccess) onSuccess(result);
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan peminjaman.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Header with Breadcrumb Back */}
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
            Catat Peminjaman Inventaris
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Formulir digital sirkulasi barang keluar ruang Kajur SMK Negeri 1 Beringin
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
          <span>Waktu Sekarang: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 rounded-xl text-xs flex items-center gap-2" role="alert">
          <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Body (Responsive 2 Columns) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Barang & Peralatan */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card: Pilihan Barang Utama */}
          <div className="bg-neu-base rounded-2xl neu-flat p-5 border border-white/60 dark:border-white/5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#d8e1eb] dark:border-[#242832]">
              <div className="p-1.5 bg-neu-base neu-inset-xs text-teal-700 dark:text-teal-400 rounded-lg">
                <Package className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                1. Unit Barang Utama
              </h3>
            </div>

            <div>
              <label htmlFor="primary-item-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Pilih Barang dari Lemari Kajur:
              </label>
              <select
                id="primary-item-select"
                value={primaryItemCode}
                onChange={(e) => setPrimaryItemCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neu-base neu-flat-xs rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 border border-white/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-600/50"
              >
                {allItems.map(item => (
                  <option
                    key={item.id}
                    value={item.item_code}
                    disabled={item.status === 'DIPINJAM'}
                  >
                    [{item.item_code}] {item.name} {item.status === 'DIPINJAM' ? '(SEDANG DIPINJAM)' : '(Siap di Rak)'}
                  </option>
                ))}
              </select>

              {selectedItemObj && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-neu-base neu-inset-xs text-teal-900 dark:text-teal-300 font-bold border border-white/60 dark:border-white/5">
                    {selectedItemObj.category === 'PROYEKTOR' ? 'Tabel Format Proyektor (INF)' : 'Tabel Format Alat & Bahan'}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    Kondisi Fisik: <strong className="text-emerald-700 dark:text-emerald-400">{selectedItemObj.condition || 'BAIK'}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Kondisi Fisik Sebelum Pinjam */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Kondisi Fisik Saat Dikeluarkan:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConditionBefore('BAIK')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    conditionBefore === 'BAIK'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-neu-base neu-flat-xs text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Kondisi Baik & Lengkap
                </button>
                <button
                  type="button"
                  onClick={() => setConditionBefore('PERLU_PERHATIAN')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    conditionBefore === 'PERLU_PERHATIAN'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-neu-base neu-flat-xs text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Ada Catatan Fisik
                </button>
              </div>
            </div>

            {/* Alat Tambahan Pendukung */}
            <div className="pt-3 border-t border-[#d8e1eb] dark:border-[#242832]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                  Alat Tambahan / Pendukung:
                </span>
                <button
                  type="button"
                  onClick={handleAddExtraItem}
                  className="text-xs font-bold text-teal-900 dark:text-teal-300 bg-neu-base neu-flat-xs hover:neu-flat-sm active:neu-inset-xs border border-white/60 dark:border-white/5 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                >
                  <Plus className="w-3 h-3" aria-hidden="true" />
                  Tambah Cok / Kabel
                </button>
              </div>

              {additionalItems.length === 0 ? (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-neu-base neu-inset-xs p-3 rounded-xl border border-white/40 dark:border-white/5">
                  Klik "Tambah Cok / Kabel" jika peminjaman proyektor disertai kabel HDMI 10M, cok sambung gulung, atau laser pointer.
                </p>
              ) : (
                <div className="space-y-2">
                  {additionalItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-neu-base p-2.5 rounded-xl neu-flat-xs border border-white/60 dark:border-white/5">
                      <select
                        value={item.itemId}
                        onChange={(e) => handleUpdateExtraItem(idx, 'itemId', parseInt(e.target.value, 10))}
                        className="flex-1 text-xs px-2 py-1 bg-transparent rounded font-medium focus:outline-none text-slate-800 dark:text-slate-200"
                      >
                        {allItems
                          .filter(i => i.id !== selectedItemObj?.id)
                          .map(i => (
                            <option key={i.id} value={i.id} disabled={i.status === 'DIPINJAM'} className="dark:bg-slate-900">
                              [{i.item_code}] {i.name} {i.status === 'DIPINJAM' ? '(Dipinjam)' : ''}
                            </option>
                          ))}
                      </select>

                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>Jml:</span>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={item.quantity}
                          onChange={(e) => handleUpdateExtraItem(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                          className="w-12 text-center text-xs px-1 py-0.5 rounded-lg bg-neu-base neu-inset-xs font-bold focus:outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveExtraItem(idx)}
                        className="p-1 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Hapus item tambahan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Identitas Peminjam & Verifikasi */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card: Peminjam */}
          <div className="bg-neu-base rounded-2xl neu-flat p-5 border border-white/60 dark:border-white/5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#d8e1eb] dark:border-[#242832]">
              <div className="p-1.5 bg-neu-base neu-inset-xs text-teal-700 dark:text-teal-400 rounded-lg">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                2. Identitas Peminjam
              </h3>
            </div>

            {/* Nama Guru */}
            <div>
              <label htmlFor="teacher-input" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Guru Pengampu:
              </label>

              {/* Quick Teacher Chips */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {teachers.slice(0, 4).map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTeacherName(t.name)}
                    className={`text-[11px] px-2.5 py-1 rounded-xl transition font-medium ${
                      teacherName === t.name
                        ? 'bg-teal-700 text-white shadow-xs font-bold'
                        : 'bg-neu-base neu-flat-xs text-slate-700 dark:text-slate-300 border border-white/60 dark:border-white/5'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              <input
                id="teacher-input"
                type="text"
                list="teachers-list-page"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Pilih atau ketik nama guru..."
                className="w-full px-3 py-2 bg-neu-base neu-inset-sm rounded-xl text-xs font-semibold focus:outline-none border border-white/60 dark:border-white/10 focus:border-teal-600/60 text-slate-800 dark:text-slate-100"
                required
              />
              <datalist id="teachers-list-page">
                {teachers.map(t => (
                  <option key={t.id} value={t.name} />
                ))}
              </datalist>
            </div>

            {/* Kelas & Siswa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="class-input" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                  Kelas:
                </label>
                <input
                  id="class-input"
                  type="text"
                  list="classes-list-page"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Contoh: XII TJKT 1"
                  className="w-full px-3 py-2 bg-neu-base neu-inset-sm rounded-xl text-xs font-semibold uppercase focus:outline-none border border-white/60 dark:border-white/10 focus:border-teal-600/60 text-slate-800 dark:text-slate-100"
                  required
                />
                <datalist id="classes-list-page">
                  {classes.map(c => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label htmlFor="borrower-input" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Siswa Pengambil:
                </label>
                <input
                  id="borrower-input"
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="Nama siswa perwakilan"
                  className="w-full px-3 py-2 bg-neu-base neu-inset-sm rounded-xl text-xs font-semibold focus:outline-none border border-white/60 dark:border-white/10 focus:border-teal-600/60 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
            </div>

            {/* Verifikasi Checklist Digital */}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-3 bg-neu-base neu-inset-sm rounded-xl border border-white/60 dark:border-white/5 cursor-pointer select-none transition hover:bg-black/5 dark:hover:bg-white/5">
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-teal-700 accent-teal-700 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">
                    Konfirmasi Serah Terima & Cek Fisik
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed block mt-0.5">
                    Peminjam telah menerima unit dalam kondisi baik dan lengkap, serta diverifikasi oleh petugas Kajur SMK Negeri 1 Beringin.
                  </span>
                </div>
              </label>
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-4 border-t border-[#d8e1eb] dark:border-[#242832] flex items-center justify-end gap-3">
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
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold neu-flat-sm active:neu-inset-xs flex items-center gap-2 transition"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Simpan Peminjaman</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

