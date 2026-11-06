import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  Plus,
  Trash2,
  Package,
  RotateCcw,
  Clock,
  User,
  GraduationCap,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SignaturePad from './SignaturePad';
import { api } from '../utils/api';
import { playChime } from '../utils/sound';

export default function MobileScanForm({ initialItemCode, onBack, onComplete }) {
  const [activeTab, setActiveTab] = useState('pinjam'); // 'pinjam' | 'kembali'
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Master Data
  const [allItems, setAllItems] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  // Active Loan lookup info (for Pengembalian)
  const [lookupResult, setLookupResult] = useState(null);

  // Form State: Peminjaman
  const [primaryItemCode, setPrimaryItemCode] = useState(initialItemCode || '');
  const [additionalItems, setAdditionalItems] = useState([]);
  const [teacherName, setTeacherName] = useState('');
  const [className, setClassName] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [conditionBefore, setConditionBefore] = useState('BAIK');
  const [signatureBase64, setSignatureBase64] = useState('');
  const [adminName, setAdminName] = useState('Petugas Kajur');

  // Form State: Pengembalian
  const [conditionAfter, setConditionAfter] = useState('BAIK');
  const [hasRemote, setHasRemote] = useState(true);
  const [hasHdmi, setHasHdmi] = useState(true);
  const [hasPower, setHasPower] = useState(true);
  const [returnNotes, setReturnNotes] = useState('');

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, [initialItemCode]);

  async function loadInitialData() {
    setLoading(true);
    setError('');
    try {
      const [itemsRes, teachersRes, classesRes] = await Promise.all([
        api.getItems(),
        api.getTeachers(),
        api.getClasses()
      ]);

      setAllItems(itemsRes);
      setTeachers(teachersRes);
      setClasses(classesRes);

      const codeToLookup = initialItemCode || (itemsRes.length > 0 ? itemsRes[0].item_code : '');
      if (codeToLookup) {
        setPrimaryItemCode(codeToLookup);
        await checkItemStatus(codeToLookup);
      }
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data inventaris: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function checkItemStatus(code) {
    if (!code) return;
    try {
      const statusRes = await api.getActiveLoanByItem(code);
      setLookupResult(statusRes);

      // Smart Mode Switcher
      if (statusRes.isBorrowed && statusRes.loan) {
        setActiveTab('kembali');
      } else {
        setActiveTab('pinjam');
      }
    } catch (err) {
      console.warn('Status lookup error:', err);
    }
  }

  const handlePrimaryItemChange = async (e) => {
    const code = e.target.value;
    setPrimaryItemCode(code);
    await checkItemStatus(code);
  };

  const handleAddExtraItem = () => {
    const availableTools = allItems.filter(i => i.category === 'ALAT_BEBAS' && i.status === 'TERSEDIA');
    if (availableTools.length === 0) {
      alert('Semua alat dan bahan pendukung saat ini sedang dipinjam.');
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

  const handleSubmitPinjam = async (e) => {
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
    if (!signatureBase64) {
      setError('Wajib membubuhkan paraf peminjam pada kotak sentuh.');
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
        signatureBase64,
        adminName
      };

      const result = await api.createLoan(payload);
      playChime('loan');
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      setSuccessData({
        type: 'PINJAM',
        loan: result,
        message: 'Peminjaman inventaris berhasil dicatat dalam sistem.'
      });
      if (onComplete) onComplete(result);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan peminjaman.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitKembali = async (e) => {
    e.preventDefault();
    setError('');

    if (!lookupResult || !lookupResult.loan) {
      setError('Tidak ada data peminjaman aktif untuk barang ini.');
      return;
    }

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

      const result = await api.returnLoan(lookupResult.loan.id, payload);
      playChime('return');
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
      setSuccessData({
        type: 'KEMBALI',
        loan: result,
        message: 'Pengembalian barang berhasil diselesaikan.'
      });
      if (onComplete) onComplete(result);
    } catch (err) {
      setError(err.message || 'Gagal menyelesaikan pengembalian.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center" role="status">
        <div className="w-9 h-9 border-3 border-blue-700 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-slate-700 font-semibold text-sm">Memeriksa status inventaris...</p>
      </div>
    );
  }

  // Success view
  if (successData) {
    const isPinjam = successData.type === 'PINJAM';
    return (
      <div className="max-w-md mx-auto p-5 text-center bg-white rounded-xl shadow-lg border border-slate-300 my-4">
        <div className="w-14 h-14 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-8 h-8" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          {isPinjam ? 'Peminjaman Berhasil Dicatat' : 'Pengembalian Selesai'}
        </h2>
        <p className="text-xs text-slate-600 mb-4">{successData.message}</p>

        <div className="p-3.5 bg-slate-50 rounded-lg text-left text-xs space-y-2 border border-slate-200 mb-5">
          <div className="flex justify-between">
            <span className="text-slate-500">Peminjam:</span>
            <span className="font-bold text-slate-900">{successData.loan.borrower_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Guru / Kelas:</span>
            <span className="font-semibold text-slate-800">{successData.loan.teacher_name} ({successData.loan.class_name})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Waktu:</span>
            <span className="font-mono font-bold text-slate-900">
              {isPinjam ? `Mulai ${successData.loan.start_time}` : `Mulai ${successData.loan.start_time} - Selesai ${successData.loan.end_time}`}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              setSuccessData(null);
              loadInitialData();
            }}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold text-sm shadow-xs transition min-h-[44px]"
          >
            Scan / Transaksi Baru
          </button>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-full py-2.5 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold text-xs transition min-h-[40px]"
            >
              Kembali ke Halaman Utama
            </button>
          )}
        </div>
      </div>
    );
  }

  const selectedItemObj = allItems.find(i => i.item_code === primaryItemCode);
  const isSelectedItemBorrowed = selectedItemObj?.status === 'DIPINJAM';

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden my-2">
      {/* Top Header: Academic Solid Navy (No AI gradient) */}
      <div className="px-4 py-3.5 bg-[#0f2438] text-white flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-md text-white transition min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Kembali ke Dashboard PC"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
              Formulir Ruang Kajur
            </span>
            <h2 className="text-sm font-bold leading-tight">Peminjaman & Pengembalian</h2>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-slate-200 bg-slate-800 px-2 py-1 rounded border border-slate-700">
            {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Smart Mode Switcher Tabs */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 border-b border-slate-300 text-xs font-bold" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'pinjam'}
          onClick={() => setActiveTab('pinjam')}
          className={`py-2.5 rounded-md transition flex items-center justify-center gap-1.5 min-h-[44px] ${
            activeTab === 'pinjam'
              ? 'bg-white text-blue-900 shadow-xs border border-slate-300'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4 text-blue-700" aria-hidden="true" />
          <span>Tab 1: Peminjaman</span>
          {!isSelectedItemBorrowed && (
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" title="Barang Siap Dipinjam" />
          )}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'kembali'}
          onClick={() => setActiveTab('kembali')}
          className={`py-2.5 rounded-md transition flex items-center justify-center gap-1.5 min-h-[44px] ${
            activeTab === 'kembali'
              ? 'bg-white text-amber-900 shadow-xs border border-slate-300'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-amber-700" aria-hidden="true" />
          <span>Tab 2: Pengembalian</span>
          {isSelectedItemBorrowed && (
            <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" title="Barang Sedang Dipinjam" />
          )}
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mx-4 mt-3 p-3 bg-rose-50 border border-rose-300 text-rose-900 rounded-lg text-xs flex items-start gap-2" role="alert">
          <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* ===================== TAB 1: FORM PEMINJAMAN ===================== */}
      {activeTab === 'pinjam' && (
        <form onSubmit={handleSubmitPinjam} className="p-4 space-y-4">
          {/* Primary Item Selector */}
          <div>
            <label htmlFor="primary-item-select" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Barang Utama (Sesuai QR)
            </label>
            <select
              id="primary-item-select"
              value={primaryItemCode}
              onChange={handlePrimaryItemChange}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none min-h-[44px]"
            >
              {allItems.map(item => (
                <option
                  key={item.id}
                  value={item.item_code}
                  disabled={item.status === 'DIPINJAM'}
                >
                  [{item.item_code}] {item.name} {item.status === 'DIPINJAM' ? '(SEDANG DIPINJAM)' : '✓ Tersedia'}
                </option>
              ))}
            </select>
            {selectedItemObj && (
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-600">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                  {selectedItemObj.category === 'PROYEKTOR' ? 'Kategori Proyektor' : 'Kategori Alat & Bahan'}
                </span>
                <span>Kondisi Awal: <strong className="text-emerald-800">{selectedItemObj.condition}</strong></span>
              </div>
            )}
          </div>

          {/* Multi-Item Picker: Tambah Alat Pendukung */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
                Tambah Alat Pendukung Sekaligus
              </span>
              <button
                type="button"
                onClick={handleAddExtraItem}
                className="text-xs font-bold text-blue-800 bg-blue-100 hover:bg-blue-200 border border-blue-200 px-2.5 py-1 rounded flex items-center gap-1 transition min-h-[32px]"
              >
                <Plus className="w-3 h-3" aria-hidden="true" />
                Tambah
              </button>
            </div>

            {additionalItems.length === 0 ? (
              <p className="text-[11px] text-slate-500">
                Pilih barang tambahan jika meminjam proyektor sekaligus cok kabel atau konverter.
              </p>
            ) : (
              <div className="space-y-2">
                {additionalItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded border border-slate-300 shadow-2xs">
                    <select
                      value={item.itemId}
                      onChange={(e) => handleUpdateExtraItem(idx, 'itemId', parseInt(e.target.value, 10))}
                      className="flex-1 text-xs px-2 py-1.5 border border-slate-300 rounded font-medium min-h-[38px]"
                      aria-label="Pilih barang pendukung"
                    >
                      {allItems
                        .filter(i => i.id !== selectedItemObj?.id)
                        .map(i => (
                          <option key={i.id} value={i.id} disabled={i.status === 'DIPINJAM'}>
                            [{i.item_code}] {i.name} {i.status === 'DIPINJAM' ? '(Dipinjam)' : ''}
                          </option>
                        ))}
                    </select>

                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-600 font-semibold">Jml:</span>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={item.quantity}
                        onChange={(e) => handleUpdateExtraItem(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                        className="w-12 text-center text-xs px-1 py-1 border border-slate-300 rounded font-bold min-h-[38px]"
                        aria-label="Jumlah unit"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveExtraItem(idx)}
                      className="p-1.5 text-rose-700 hover:bg-rose-50 rounded min-h-[36px] min-w-[36px] flex items-center justify-center"
                      aria-label="Hapus barang pendukung"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Teacher Selection */}
          <div>
            <label htmlFor="teacher-input" className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
              Nama Guru Pengampu
            </label>
            <input
              id="teacher-input"
              type="text"
              list="teachers-list"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Pilih atau ketik nama guru..."
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none min-h-[44px]"
              required
            />
            <datalist id="teachers-list">
              {teachers.map(t => (
                <option key={t.id} value={t.name} />
              ))}
            </datalist>
          </div>

          {/* Class Selection & Borrower Name */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="class-input" className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
                Kelas / Mapel
              </label>
              <input
                id="class-input"
                type="text"
                list="classes-list"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Misal: XII TJKT 1"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs font-medium uppercase focus:ring-2 focus:ring-blue-600 focus:outline-none min-h-[44px]"
                required
              />
              <datalist id="classes-list">
                {classes.map(c => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="borrower-input" className="block text-xs font-bold text-slate-800 mb-1">
                Siswa Pengambil
              </label>
              <input
                id="borrower-input"
                type="text"
                value={borrowerName}
                onChange={(e) => setBorrowerName(e.target.value)}
                placeholder="Nama perwakilan"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none min-h-[44px]"
                required
              />
            </div>
          </div>

          {/* Initial Condition & On-Duty Admin */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="block text-xs font-bold text-slate-800 mb-1">
                Kondisi Awal
              </span>
              <div className="flex rounded-lg overflow-hidden border border-slate-300 p-0.5 bg-slate-100">
                <button
                  type="button"
                  onClick={() => setConditionBefore('BAIK')}
                  className={`flex-1 py-2 text-xs font-bold rounded transition min-h-[38px] ${
                    conditionBefore === 'BAIK'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-700'
                  }`}
                >
                  Baik
                </button>
                <button
                  type="button"
                  onClick={() => setConditionBefore('RUSAK')}
                  className={`flex-1 py-2 text-xs font-bold rounded transition min-h-[38px] ${
                    conditionBefore === 'RUSAK'
                      ? 'bg-rose-700 text-white shadow-2xs'
                      : 'text-slate-700'
                  }`}
                >
                  Catatan
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="admin-input" className="block text-xs font-bold text-slate-800 mb-1">
                Petugas Jaga Kajur
              </label>
              <input
                id="admin-input"
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50 min-h-[44px]"
              />
            </div>
          </div>

          {/* Digital Signature Pad */}
          <SignaturePad onSave={setSignatureBase64} value={signatureBase64} />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-sm min-h-[48px]"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan Data Peminjaman...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" aria-hidden="true" />
                Simpan Peminjaman (Scan 1 Selesai)
              </>
            )}
          </button>
        </form>
      )}

      {/* ===================== TAB 2: FORM PENGEMBALIAN ===================== */}
      {activeTab === 'kembali' && (
        <form onSubmit={handleSubmitKembali} className="p-4 space-y-4">
          {/* Active Loan Info Card */}
          {lookupResult?.loan ? (
            <div className="p-4 bg-amber-50/90 rounded-lg border border-amber-300 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                  Sedang Dipinjam
                </span>
                <span className="text-xs font-mono font-bold text-amber-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  Mulai: {lookupResult.loan.start_time}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{lookupResult.loan.borrower_name}</h3>
                <p className="text-xs text-slate-700">
                  Guru: <span className="font-bold">{lookupResult.loan.teacher_name}</span> | Kelas: <span className="font-bold">{lookupResult.loan.class_name}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-amber-200">
                <span className="text-[11px] font-bold text-amber-950 block mb-1">Daftar Barang Sesi Ini:</span>
                <div className="flex flex-wrap gap-1">
                  {lookupResult.loan.details.map(d => (
                    <span key={d.id} className="text-xs bg-white border border-amber-300 text-slate-800 px-2 py-0.5 rounded font-medium">
                      [{d.item_code}] {d.item_name} {d.quantity > 1 ? `(${d.quantity})` : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-300 text-center text-xs text-slate-600">
              <Package className="w-8 h-8 text-slate-400 mx-auto mb-1.5" aria-hidden="true" />
              Barang <strong className="text-slate-900">{primaryItemCode}</strong> saat ini tidak tercatat dalam status peminjaman aktif.
            </div>
          )}

          {/* Condition After */}
          <div>
            <span className="block text-xs font-bold text-slate-800 mb-1.5">
              Kondisi Barang Sesudah Pemakaian
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConditionAfter('BAIK')}
                className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 min-h-[44px] ${
                  conditionAfter === 'BAIK'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <CheckCircle className="w-4 h-4" aria-hidden="true" />
                Baik & Berfungsi
              </button>
              <button
                type="button"
                onClick={() => setConditionAfter('RUSAK')}
                className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 min-h-[44px] ${
                  conditionAfter === 'RUSAK'
                    ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                Ada Kerusakan
              </button>
            </div>
          </div>

          {/* Checklist Kelengkapan */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-300">
            <span className="block text-xs font-bold text-slate-800 mb-2">
              Kelengkapan yang Dikembalikan:
            </span>
            <div className="space-y-2 text-xs font-medium text-slate-800">
              <label className="flex items-center gap-2 cursor-pointer min-h-[30px]">
                <input
                  type="checkbox"
                  checked={hasRemote}
                  onChange={(e) => setHasRemote(e.target.checked)}
                  className="w-4 h-4 text-blue-700 rounded border-slate-300 focus:ring-blue-600"
                />
                <span>Remote Proyektor (Jika Meminjam Proyektor)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer min-h-[30px]">
                <input
                  type="checkbox"
                  checked={hasHdmi}
                  onChange={(e) => setHasHdmi(e.target.checked)}
                  className="w-4 h-4 text-blue-700 rounded border-slate-300 focus:ring-blue-600"
                />
                <span>Kabel HDMI / Kabel VGA</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer min-h-[30px]">
                <input
                  type="checkbox"
                  checked={hasPower}
                  onChange={(e) => setHasPower(e.target.checked)}
                  className="w-4 h-4 text-blue-700 rounded border-slate-300 focus:ring-blue-600"
                />
                <span>Kabel Power / Cok Sambung</span>
              </label>
            </div>
          </div>

          {/* Return Notes */}
          <div>
            <label htmlFor="return-notes" className="block text-xs font-bold text-slate-800 mb-1">
              Catatan Pengembalian (Opsional)
            </label>
            <input
              id="return-notes"
              type="text"
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              placeholder="Contoh: Lengkap dan berfungsi normal"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none min-h-[44px]"
            />
          </div>

          {/* Selesaikan Button */}
          <button
            type="submit"
            disabled={submitting || !lookupResult?.loan}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-sm min-h-[48px]"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyelesaikan Pengembalian...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" aria-hidden="true" />
                Selesaikan Pengembalian (Scan 2 Selesai)
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
