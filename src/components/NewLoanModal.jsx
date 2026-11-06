import React, { useState, useEffect } from 'react';
import {
  X,
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

export default function NewLoanModal({
  isOpen,
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-loan-title"
    >
      <div className="relative w-full max-w-2xl bg-neu-base rounded-2xl neu-flat border border-white/60 dark:border-white/10 overflow-hidden my-4 text-slate-800 dark:text-slate-100">
        {/* Header: Neumorphic Soft Surface */}
        <div className="px-5 py-4 border-b border-[#d8e1eb] dark:border-[#242832] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neu-base neu-inset-sm text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold text-sm shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-loan-title" className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                Catat Peminjaman Inventaris
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Pencatatan keluar barang ruang Kajur (Otomatis masuk ke buku peminjaman)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-neu-base neu-flat-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
            aria-label="Tutup formulir"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-5 mt-4 p-3 bg-rose-50 border border-rose-300 text-rose-900 rounded-xl text-xs flex items-center gap-2" role="alert">
            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[78vh] overflow-y-auto">
          {/* Section 1: Barang yang Dipinjam */}
          <div className="p-4 bg-[#e8ecf2] rounded-xl shadow-[inset_2px_2px_5px_#c5d0de,inset_-2px_-2px_5px_#ffffff] border border-white/60 space-y-3">
            <div>
              <label htmlFor="modal-primary-item" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Barang Utama yang Dipinjam:
              </label>
              <select
                id="modal-primary-item"
                value={primaryItemCode}
                onChange={(e) => setPrimaryItemCode(e.target.value)}
                className="w-full px-3 py-2 bg-[#e8ecf2] shadow-[2px_2px_4px_#c5d0de,-2px_-2px_4px_#ffffff] rounded-xl text-xs font-bold text-slate-900 border border-white/60 focus:outline-none focus:ring-2 focus:ring-teal-600/50"
              >
                {allItems.map(item => (
                  <option
                    key={item.id}
                    value={item.item_code}
                    disabled={item.status === 'DIPINJAM'}
                  >
                    [{item.item_code}] {item.name} {item.status === 'DIPINJAM' ? '(SEDANG DIPINJAM)' : '(Tersedia)'}
                  </option>
                ))}
              </select>

              {selectedItemObj && (
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-600">
                  <span className="px-2 py-0.5 rounded-lg bg-[#e8ecf2] shadow-[1px_1px_3px_#c5d0de,-1px_-1px_3px_#ffffff] text-slate-800 font-semibold">
                    {selectedItemObj.category === 'PROYEKTOR' ? 'Tabel 1: Format Proyektor' : 'Tabel 2: Format Alat & Bahan'}
                  </span>
                  <span>Kondisi Awal: <strong className="text-green-800">{selectedItemObj.condition}</strong></span>
                </div>
              )}
            </div>

            {/* Tambah Alat Pendukung (Multi-Item) */}
            <div className="pt-2 border-t border-[#d8e1eb]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                  Alat Tambahan / Pendukung:
                </span>
                <button
                  type="button"
                  onClick={handleAddExtraItem}
                  className="text-xs font-bold text-teal-900 bg-[#e8ecf2] shadow-[2px_2px_4px_#c5d0de,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#c5d0de] border border-white/60 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                >
                  <Plus className="w-3 h-3" aria-hidden="true" />
                  Tambah Cok / Kabel
                </button>
              </div>

              {additionalItems.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic">
                  Klik tombol diatas jika meminjam proyektor sekaligus kabel sambung, konverter, atau remote.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {additionalItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#e8ecf2] p-2 rounded-xl shadow-[2px_2px_4px_#c5d0de,-2px_-2px_4px_#ffffff] border border-white/60">
                      <select
                        value={item.itemId}
                        onChange={(e) => handleUpdateExtraItem(idx, 'itemId', parseInt(e.target.value, 10))}
                        className="flex-1 text-xs px-2 py-1 bg-transparent rounded font-medium focus:outline-none"
                      >
                        {allItems
                          .filter(i => i.id !== selectedItemObj?.id)
                          .map(i => (
                            <option key={i.id} value={i.id} disabled={i.status === 'DIPINJAM'}>
                              [{i.item_code}] {i.name} {i.status === 'DIPINJAM' ? '(Dipinjam)' : ''}
                            </option>
                          ))}
                      </select>

                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                        <span>Jml:</span>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={item.quantity}
                          onChange={(e) => handleUpdateExtraItem(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                          className="w-12 text-center text-xs px-1 py-0.5 rounded-lg bg-[#e8ecf2] shadow-[inset_1px_1px_3px_#c5d0de] font-bold"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveExtraItem(idx)}
                        className="p-1 text-rose-700 hover:bg-rose-50 rounded-lg"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Data Peminjam (Guru & Siswa) */}
          <div className="space-y-3">
            {/* Guru Pengampu */}
            <div>
              <label htmlFor="modal-teacher" className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                  Nama Guru Pengampu
                </span>
                <span className="text-[10px] text-slate-500 font-normal">Pilih chip cepat atau ketik</span>
              </label>

              {/* Quick Teacher Chips */}
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {teachers.slice(0, 6).map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTeacherName(t.name)}
                    className={`text-[11px] px-2.5 py-1 rounded-xl transition font-medium ${
                      teacherName === t.name
                        ? 'bg-teal-700 text-white shadow-xs font-bold'
                        : 'bg-[#e8ecf2] text-slate-700 shadow-[2px_2px_4px_#c5d0de,-2px_-2px_4px_#ffffff] hover:text-slate-900 border border-white/60'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              <input
                id="modal-teacher"
                type="text"
                list="modal-teachers-list"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Ketik atau pilih nama guru..."
                className="w-full px-3 py-2 bg-[#e8ecf2] shadow-[inset_2px_2px_4px_#c5d0de,inset_-2px_-2px_4px_#ffffff] rounded-xl text-xs font-semibold focus:outline-none border border-white/60 focus:border-teal-600/60"
                required
              />
              <datalist id="modal-teachers-list">
                {teachers.map(t => (
                  <option key={t.id} value={t.name} />
                ))}
              </datalist>
            </div>

            {/* Kelas & Nama Siswa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="modal-class" className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                  Kelas / Mapel
                </label>

                {/* Quick Class Chips */}
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {classes.slice(0, 4).map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setClassName(c.name)}
                      className={`text-[10px] px-2 py-0.5 rounded-xl transition font-medium ${
                        className === c.name
                          ? 'bg-teal-700 text-white shadow-xs font-bold'
                          : 'bg-[#e8ecf2] text-slate-700 shadow-[2px_2px_4px_#c5d0de,-2px_-2px_4px_#ffffff] border border-white/60'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                <input
                  id="modal-class"
                  type="text"
                  list="modal-classes-list"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Contoh: XII TJKT 1"
                  className="w-full px-3 py-2 bg-[#e8ecf2] shadow-[inset_2px_2px_4px_#c5d0de,inset_-2px_-2px_4px_#ffffff] rounded-xl text-xs font-semibold uppercase focus:outline-none border border-white/60 focus:border-teal-600/60"
                  required
                />
                <datalist id="modal-classes-list">
                  {classes.map(c => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label htmlFor="modal-borrower" className="block text-xs font-bold text-slate-800 mb-1">
                  Nama Siswa yang Mengambil
                </label>
                <div className="h-6"></div>
                <input
                  id="modal-borrower"
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="Ketik nama siswa perwakilan"
                  className="w-full px-3 py-2 bg-[#e8ecf2] shadow-[inset_2px_2px_4px_#c5d0de,inset_-2px_-2px_4px_#ffffff] rounded-xl text-xs font-semibold focus:outline-none border border-white/60 focus:border-teal-600/60"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Verifikasi Checklist Digital */}
          <div className="pt-2 border-t border-[#d8e1eb]">
            <label className="flex items-start gap-3 p-3 bg-[#e8ecf2] shadow-[inset_2px_2px_4px_#c5d0de,inset_-2px_-2px_4px_#ffffff] rounded-xl border border-white/60 cursor-pointer select-none transition hover:bg-[#e2e7ee]">
              <input
                type="checkbox"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-teal-700 accent-teal-700 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">
                  Konfirmasi Serah Terima & Cek Fisik
                </span>
                <span className="text-slate-500 font-medium leading-relaxed block mt-0.5">
                  Peminjam telah menerima unit dalam kondisi baik dan lengkap, serta diverifikasi oleh petugas Kajur SMK Negeri 1 Beringin.
                </span>
              </div>
            </label>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-between pt-3 border-t border-[#d8e1eb]">
            <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>Jam Pinjam: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

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
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-[3px_3px_7px_#c5d0de,-3px_-3px_7px_#ffffff] active:shadow-[inset_2px_2px_4px_#00000030] flex items-center gap-1.5 transition"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Simpan Peminjaman</span>
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
