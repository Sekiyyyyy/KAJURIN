import React, { useState, useMemo } from 'react';
import { Printer, ArrowLeft, Filter, CheckCircle2, SlidersHorizontal, Eye } from 'lucide-react';

export default function PrintOfficialReport({ loans = [], items = [], onClose }) {
  const [reportType, setReportType] = useState('PROYEKTOR'); // 'PROYEKTOR' | 'ALAT_BEBAS' | 'ALL'
  const [selectedProjectorCode, setSelectedProjectorCode] = useState('ALL');
  const [includeEmptyRows, setIncludeEmptyRows] = useState(true);
  const [targetRowCount, setTargetRowCount] = useState(12);

  // Editable Document Metadata (Default values matching physical administration at SMK Negeri 1 Beringin)
  const [schoolName, setSchoolName] = useState('SMK NEGERI 1 BERINGIN');
  const [jurusanName, setJurusanName] = useState('JURUSAN TEKNIK JARINGAN KOMPUTER & TELEKOMUNIKASI (TJKT)');
  const [petugasName, setPetugasName] = useState('Petugas Inventaris Kajur');
  const [kajurName, setKajurName] = useState('Ketua Jurusan TJKT');
  const [storageLocation, setStorageLocation] = useState('Ruang Kajur TJKT (Lemari Kompartemen A)');

  // Month & Year string
  const currentMonthYear = useMemo(() => {
    return new Date().toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric'
    });
  }, []);

  const [monthYear, setMonthYear] = useState(currentMonthYear);

  // Available Projectors in Inventory
  const projectorItems = useMemo(() => {
    return items.filter(i => i.category === 'PROYEKTOR');
  }, [items]);

  // Determine Metadata: Merk / Tipe & Kode Inventaris based on selected filter
  const activeProjectorMeta = useMemo(() => {
    if (selectedProjectorCode === 'ALL') {
      return {
        brandType: 'Semua Unit Proyektor (INF-01, INF-02, INF-03)',
        itemCode: 'INF-01 ~ INF-03',
        location: storageLocation
      };
    }
    const item = projectorItems.find(p => p.item_code === selectedProjectorCode);
    if (item) {
      return {
        brandType: item.name,
        itemCode: item.item_code,
        location: storageLocation
      };
    }
    return {
      brandType: 'Proyektor Jurusan TJKT',
      itemCode: selectedProjectorCode,
      location: storageLocation
    };
  }, [selectedProjectorCode, projectorItems, storageLocation]);

  // Filtered Loans for Projector
  const filteredProjectorLoans = useMemo(() => {
    const list = loans.filter(l => l.hasProjector);
    if (selectedProjectorCode === 'ALL') return list;
    return list.filter(l =>
      l.projectorDetails && l.projectorDetails.some(d => d.item_code === selectedProjectorCode)
    );
  }, [loans, selectedProjectorCode]);

  // Filtered Loans for Tools & Materials
  const filteredToolsLoans = useMemo(() => {
    return loans.filter(l => l.hasTools);
  }, [loans]);

  const handlePrint = () => {
    window.print();
  };

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Calculate empty rows padding to match the full height of the physical printed sheet
  const projectorEmptyRowCount = Math.max(0, targetRowCount - filteredProjectorLoans.length);
  const toolsEmptyRowCount = Math.max(0, targetRowCount - filteredToolsLoans.length);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* =========================================================================
          CONTROLS & CONFIGURATION PANEL (HIDDEN IN PRINT VIA `no-print`)
         ========================================================================= */}
      <div className="no-print space-y-4">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#dbd5ca] dark:border-[#242832]">
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
              <span className="text-[10px] uppercase tracking-wider font-extrabold bg-teal-600/10 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-lg border border-teal-600/20">
                Format Lembar Fisik Resmi
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
                Cetak Lembar Kontrol Pemakaian Proyektor & Alat (PDF)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Tata letak disesuaikan 100% presisi dengan formulir fisik ruang Kajur SMK Negeri 1 Beringin.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold neu-flat-sm active:neu-inset-xs flex items-center gap-2 transition min-h-[40px] shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF (Ctrl+P)</span>
            </button>
          </div>
        </div>

        {/* Filter & Customizer Form */}
        <div className="bg-neu-base rounded-2xl neu-flat p-4 sm:p-5 border border-white/60 dark:border-white/5 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold border-b border-[#dbd5ca] dark:border-[#242832] pb-2">
            <SlidersHorizontal className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <span>Pengaturan Dokumen & Filter Data</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Format Selector */}
            <div>
              <label htmlFor="report-type-select" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pilih Format Lembar:
              </label>
              <select
                id="report-type-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 bg-neu-base neu-inset-xs rounded-xl font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
              >
                <option value="PROYEKTOR">Format 1: Lembar Kontrol Proyektor (Sesuai Foto)</option>
                <option value="ALAT_BEBAS">Format 2: Lembar Kontrol Alat & Bahan Praktik</option>
                <option value="ALL">Cetak Keduanya (Semua Format)</option>
              </select>
            </div>

            {/* Projector Unit Filter */}
            {(reportType === 'PROYEKTOR' || reportType === 'ALL') && (
              <div>
                <label htmlFor="projector-unit-select" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Unit Proyektor:
                </label>
                <select
                  id="projector-unit-select"
                  value={selectedProjectorCode}
                  onChange={(e) => setSelectedProjectorCode(e.target.value)}
                  className="w-full px-3 py-2 bg-neu-base neu-inset-xs rounded-xl font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                >
                  <option value="ALL">Semua Unit Proyektor (Gabungan)</option>
                  {projectorItems.map(p => (
                    <option key={p.id} value={p.item_code}>
                      {p.item_code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Bulan / Tahun */}
            <div>
              <label htmlFor="month-year-input" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Bulan / Tahun:
              </label>
              <input
                id="month-year-input"
                type="text"
                value={monthYear}
                onChange={(e) => setMonthYear(e.target.value)}
                className="w-full px-3 py-2 bg-neu-base neu-inset-xs rounded-xl font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                placeholder="Contoh: November 2026"
              />
            </div>

            {/* Lokasi Penyimpanan */}
            <div>
              <label htmlFor="storage-location-input" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Lokasi Penyimpanan:
              </label>
              <input
                id="storage-location-input"
                type="text"
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                className="w-full px-3 py-2 bg-neu-base neu-inset-xs rounded-xl font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                placeholder="Ruang Kajur TJKT"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#dbd5ca]/60 dark:border-[#242832]/60">
            {/* Nama Petugas */}
            <div>
              <label htmlFor="petugas-name-input" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Petugas Inventaris:
              </label>
              <input
                id="petugas-name-input"
                type="text"
                value={petugasName}
                onChange={(e) => setPetugasName(e.target.value)}
                className="w-full px-3 py-2 bg-neu-base neu-inset-xs rounded-xl font-medium text-slate-800 dark:text-slate-100 focus:outline-none"
              />
            </div>

            {/* Nama Ketua Jurusan */}
            <div>
              <label htmlFor="kajur-name-input" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Ketua Jurusan:
              </label>
              <input
                id="kajur-name-input"
                type="text"
                value={kajurName}
                onChange={(e) => setKajurName(e.target.value)}
                className="w-full px-3 py-2 bg-neu-base neu-inset-xs rounded-xl font-medium text-slate-800 dark:text-slate-100 focus:outline-none"
              />
            </div>

            {/* Target Baris Kosong Cadangan */}
            <div className="flex items-center gap-3 pt-4 sm:pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeEmptyRows}
                  onChange={(e) => setIncludeEmptyRows(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                  Sertakan Baris Cadangan (Total 12 Baris)
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PRINTABLE PAPER CANVAS (A4 LANDSCAPE)
         ========================================================================= */}
      <div className="bg-stone-200/50 dark:bg-black/40 p-2 sm:p-6 rounded-2xl overflow-x-auto">
        <div className="space-y-12 min-w-[950px]">

          {/* ---------------------------------------------------------------------
              FORMAT 1: LEMBAR KONTROL PEMAKAIAN PROYEKTOR (SESUAI FOTO FISIK)
             --------------------------------------------------------------------- */}
          {(reportType === 'PROYEKTOR' || reportType === 'ALL') && (
            <div className="bg-white text-stone-900 p-8 sm:p-10 shadow-xl border border-stone-300 mx-auto w-full font-sans print:shadow-none print:border-none print:p-0">
              {/* Document Header */}
              <div className="text-center mb-6">
                <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-black font-sans">
                  LEMBAR KONTROL PEMAKAIAN PROYEKTOR
                </h1>
                <p className="text-xs font-bold text-stone-700 tracking-wide uppercase mt-0.5">
                  {schoolName} — {jurusanName}
                </p>
              </div>

              {/* Dotted Metadata Section (2 Columns exactly like the photo) */}
              <div className="grid grid-cols-2 gap-x-10 text-[12px] leading-relaxed mb-4 text-stone-900">
                {/* Left Column */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline">
                    <span className="w-44 font-semibold text-stone-800">Merk / Tipe Proyektor</span>
                    <span className="mr-2">:</span>
                    <span className="flex-1 font-bold border-b border-dotted border-stone-800 pb-0.5">
                      {activeProjectorMeta.brandType}
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-44 font-semibold text-stone-800">Kode Inventaris</span>
                    <span className="mr-2">:</span>
                    <span className="flex-1 font-mono font-bold border-b border-dotted border-stone-800 pb-0.5">
                      {activeProjectorMeta.itemCode}
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-44 font-semibold text-stone-800">Petugas</span>
                    <span className="mr-2">:</span>
                    <span className="flex-1 font-semibold border-b border-dotted border-stone-800 pb-0.5">
                      {petugasName}
                    </span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline">
                    <span className="w-40 font-semibold text-stone-800">Bulan / Tahun</span>
                    <span className="mr-2">:</span>
                    <span className="flex-1 font-bold border-b border-dotted border-stone-800 pb-0.5">
                      {monthYear}
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-40 font-semibold text-stone-800">Lokasi Penyimpanan</span>
                    <span className="mr-2">:</span>
                    <span className="flex-1 font-semibold border-b border-dotted border-stone-800 pb-0.5">
                      {activeProjectorMeta.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Physical Master Table */}
              <div className="border-t border-black">
                <table className="w-full border-collapse border border-black text-[11px] leading-tight text-center">
                  <thead>
                    {/* Header Row 1 */}
                    <tr className="bg-[#eef2f6] text-black font-extrabold border border-black">
                      <th scope="col" rowSpan={2} className="border border-black py-2 px-1 w-8">
                        No
                      </th>
                      <th scope="col" rowSpan={2} className="border border-black py-2 px-2 w-20">
                        Tanggal
                      </th>
                      <th scope="col" rowSpan={2} className="border border-black py-2 px-3 text-left w-36">
                        Nama Guru
                      </th>
                      <th scope="col" rowSpan={2} className="border border-black py-2 px-2 text-left w-32">
                        Kelas / Mata Pelajaran
                      </th>
                      <th scope="col" colSpan={2} className="border border-black py-1.5 px-1">
                        Jam Pemakaian
                      </th>
                      <th scope="col" colSpan={2} className="border border-black py-1.5 px-1">
                        Kondisi Proyektor
                      </th>
                      <th scope="col" rowSpan={2} className="border border-black py-2 px-2 w-28">
                        Kelengkapan Dikembalikan
                      </th>
                      <th scope="col" rowSpan={2} className="border border-black py-2 px-1.5 w-20">
                        Paraf Guru
                      </th>
                      <th scope="col" rowSpan={2} className="border border-black py-2 px-1.5 w-20">
                        Paraf Petugas
                      </th>
                      <th scope="col" rowSpan={2} className="border border-black py-2 px-1.5 w-24">
                        Keterangan
                      </th>
                    </tr>

                    {/* Header Row 2 (Sub-headers for Jam Pemakaian & Kondisi Proyektor) */}
                    <tr className="bg-[#eef2f6] text-black font-bold border border-black">
                      <th scope="col" className="border border-black py-1 px-1 w-12 text-[10px]">
                        Mulai
                      </th>
                      <th scope="col" className="border border-black py-1 px-1 w-12 text-[10px]">
                        Selesai
                      </th>
                      <th scope="col" className="border border-black py-1 px-1 w-24 text-[10px]">
                        Sebelum
                      </th>
                      <th scope="col" className="border border-black py-1 px-1 w-24 text-[10px]">
                        Sesudah
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* Render Real Loan Data */}
                    {filteredProjectorLoans.map((loan, idx) => {
                      const projDetail = (loan.projectorDetails && loan.projectorDetails[0]) || {};
                      const isFinished = loan.status === 'SELESAI';
                      const condBefore = projDetail.condition_before || 'BAIK';
                      const condAfter = projDetail.condition_after || (isFinished ? 'BAIK' : null);

                      return (
                        <tr key={loan.id} className="border border-black hover:bg-stone-50 transition-colors">
                          {/* 1. No */}
                          <td className="border border-black py-1.5 px-1 font-medium">
                            {idx + 1}
                          </td>

                          {/* 2. Tanggal */}
                          <td className="border border-black py-1.5 px-1 font-mono font-bold text-stone-900">
                            {loan.loan_date}
                          </td>

                          {/* 3. Nama Guru */}
                          <td className="border border-black py-1.5 px-3 text-left font-bold text-stone-900">
                            {loan.teacher_name}
                          </td>

                          {/* 4. Kelas / Mata Pelajaran */}
                          <td className="border border-black py-1.5 px-2 text-left">
                            <div className="font-bold text-stone-900">{loan.class_name}</div>
                            {loan.borrower_name && loan.borrower_name !== loan.teacher_name && (
                              <div className="text-[9px] text-stone-600 font-normal leading-none mt-0.5">
                                Peminjam: {loan.borrower_name}
                              </div>
                            )}
                          </td>

                          {/* 5. Jam Mulai */}
                          <td className="border border-black py-1.5 px-1 font-mono font-medium">
                            {loan.start_time || '—'}
                          </td>

                          {/* 6. Jam Selesai */}
                          <td className="border border-black py-1.5 px-1 font-mono font-medium">
                            {loan.end_time || '—'}
                          </td>

                          {/* 7. Kondisi Sebelum: Baik / Rusak */}
                          <td className="border border-black py-1.5 px-1 text-[10px]">
                            {condBefore === 'BAIK' ? (
                              <div className="inline-flex items-center gap-0.5">
                                <span className="font-bold border border-black rounded-full px-1.5 py-0.2 bg-stone-100">
                                  Baik
                                </span>
                                <span className="text-stone-400">/ Rusak</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-0.5">
                                <span className="text-stone-400">Baik /</span>
                                <span className="font-bold border border-black rounded-full px-1.5 py-0.2 text-red-700">
                                  Rusak
                                </span>
                              </div>
                            )}
                          </td>

                          {/* 8. Kondisi Sesudah: Baik / Rusak */}
                          <td className="border border-black py-1.5 px-1 text-[10px]">
                            {isFinished ? (
                              condAfter === 'RUSAK' ? (
                                <div className="inline-flex items-center gap-0.5">
                                  <span className="text-stone-400">Baik /</span>
                                  <span className="font-bold border border-black rounded-full px-1.5 py-0.2 text-red-700">
                                    Rusak
                                  </span>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-0.5">
                                  <span className="font-bold border border-black rounded-full px-1.5 py-0.2 bg-stone-100">
                                    Baik
                                  </span>
                                  <span className="text-stone-400">/ Rusak</span>
                                </div>
                              )
                            ) : (
                              <span className="text-stone-400 italic">Baik / Rusak</span>
                            )}
                          </td>

                          {/* 9. Kelengkapan Dikembalikan */}
                          <td className="border border-black py-1.5 px-2">
                            {isFinished ? (
                              <span className="text-sm font-bold text-black">✓</span>
                            ) : (
                              <span className="text-stone-400">—</span>
                            )}
                          </td>

                          {/* 10. Paraf Guru */}
                          <td className="border border-black py-1 px-1">
                            {loan.signature_base64 ? (
                              <img
                                src={loan.signature_base64}
                                alt="Paraf"
                                className="max-h-7 max-w-[65px] mx-auto object-contain filter contrast-200"
                              />
                            ) : (
                              <span className="font-serif italic text-xs font-semibold text-stone-800">
                                ✓ Paraf
                              </span>
                            )}
                          </td>

                          {/* 11. Paraf Petugas */}
                          <td className="border border-black py-1 px-1">
                            <span className="font-serif italic font-extrabold text-sm text-stone-900">
                              f
                            </span>
                          </td>

                          {/* 12. Keterangan */}
                          <td className="border border-black py-1.5 px-1 font-bold">
                            {isFinished ? (
                              <span className="text-sm font-black text-black">✓</span>
                            ) : (
                              <span className="text-[10px] uppercase font-bold text-amber-800">
                                Dipinjam
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Pad with Empty Lines (Photocopy Master format like the physical form) */}
                    {includeEmptyRows &&
                      Array.from({ length: projectorEmptyRowCount }).map((_, i) => {
                        const rowNum = filteredProjectorLoans.length + i + 1;
                        return (
                          <tr key={`empty-p-${i}`} className="border border-black h-8 text-stone-400">
                            <td className="border border-black py-1 px-1 font-light text-stone-500">{rowNum}</td>
                            <td className="border border-black py-1 px-1"></td>
                            <td className="border border-black py-1 px-3"></td>
                            <td className="border border-black py-1 px-2"></td>
                            <td className="border border-black py-1 px-1"></td>
                            <td className="border border-black py-1 px-1"></td>
                            <td className="border border-black py-1 px-1 text-[9px] text-stone-300">
                              Baik / Rusak
                            </td>
                            <td className="border border-black py-1 px-1 text-[9px] text-stone-300">
                              Baik / Rusak
                            </td>
                            <td className="border border-black py-1 px-2"></td>
                            <td className="border border-black py-1 px-1"></td>
                            <td className="border border-black py-1 px-1"></td>
                            <td className="border border-black py-1 px-1"></td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Official Signatures Footer (Bottom of Document) */}
              <div className="grid grid-cols-2 text-center text-xs mt-8 pt-2 text-stone-900">
                <div className="flex flex-col items-center">
                  <p className="font-medium">Mengetahui,</p>
                  <p className="font-bold uppercase tracking-wider mt-0.5">Ketua Jurusan TJKT</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline text-stone-900 tracking-wide">
                    {kajurName}
                  </p>
                  <p className="text-[10px] text-stone-600 mt-0.5">NIP. ........................................</p>
                </div>

                <div className="flex flex-col items-center">
                  <p className="font-medium">Beringin, {todayFormatted}</p>
                  <p className="font-bold uppercase tracking-wider mt-0.5">Petugas Inventaris Kajur</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline text-stone-900 tracking-wide">
                    {petugasName}
                  </p>
                  <p className="text-[10px] text-stone-600 mt-0.5">NIP / NUPTK. ........................................</p>
                </div>
              </div>
            </div>
          )}

          {/* Page break in print between tables if printing both */}
          {reportType === 'ALL' && <div className="page-break" />}

          {/* ---------------------------------------------------------------------
              FORMAT 2: LEMBAR KONTROL PEMAKAIAN ALAT & BAHAN PRAKTIK
             --------------------------------------------------------------------- */}
          {(reportType === 'ALAT_BEBAS' || reportType === 'ALL') && (
            <div className="bg-white text-stone-900 p-8 sm:p-10 shadow-xl border border-stone-300 mx-auto w-full font-sans print:shadow-none print:border-none print:p-0">
              {/* Document Header */}
              <div className="text-center mb-6">
                <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-black font-sans">
                  LEMBAR PEMINJAMAN ALAT & BAHAN PRAKTIK
                </h1>
                <p className="text-xs font-bold text-stone-700 tracking-wide uppercase mt-0.5">
                  {schoolName} — {jurusanName}
                </p>
              </div>

              {/* Dotted Metadata Section */}
              <div className="grid grid-cols-2 gap-x-10 text-[12px] leading-relaxed mb-4 text-stone-900">
                <div className="space-y-1.5">
                  <div className="flex items-baseline">
                    <span className="w-44 font-semibold text-stone-800">Kategori Alat / Bahan</span>
                    <span className="mr-2">:</span>
                    <span className="flex-1 font-bold border-b border-dotted border-stone-800 pb-0.5">
                      Cok Sambung, Kabel HDMI/VGA, Speaker & Mic
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-44 font-semibold text-stone-800">Petugas Inventaris</span>
                    <span className="mr-2">:</span>
                    <span className="flex-1 font-semibold border-b border-dotted border-stone-800 pb-0.5">
                      {petugasName}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-baseline">
                    <span className="w-40 font-semibold text-stone-800">Bulan / Tahun</span>
                    <span className="mr-2">:</span>
                    <span className="flex-1 font-bold border-b border-dotted border-stone-800 pb-0.5">
                      {monthYear}
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-40 font-semibold text-stone-800">Lokasi Penyimpanan</span>
                    <span className="mr-2">:</span>
                    <span className="flex-1 font-semibold border-b border-dotted border-stone-800 pb-0.5">
                      Ruang Kajur TJKT (Lemari Kompartemen B)
                    </span>
                  </div>
                </div>
              </div>

              {/* Table Alat & Bahan */}
              <div className="border-t border-black">
                <table className="w-full border-collapse border border-black text-[11px] leading-tight text-center">
                  <thead>
                    <tr className="bg-[#eef2f6] text-black font-extrabold border border-black">
                      <th scope="col" className="border border-black py-2 px-1 w-8">
                        No
                      </th>
                      <th scope="col" className="border border-black py-2 px-2 w-24">
                        Hari / Tanggal
                      </th>
                      <th scope="col" className="border border-black py-2 px-2 w-28 text-left">
                        Kelas
                      </th>
                      <th scope="col" className="border border-black py-2 px-3 text-left w-44">
                        Nama Peminjam / Guru
                      </th>
                      <th scope="col" className="border border-black py-2 px-3 text-left">
                        Nama Alat & Bahan / Jumlah
                      </th>
                      <th scope="col" className="border border-black py-2 px-2 w-20">
                        Kondisi Sblm
                      </th>
                      <th scope="col" className="border border-black py-2 px-2 w-20">
                        Kondisi Ssdh
                      </th>
                      <th scope="col" className="border border-black py-2 px-1.5 w-20">
                        Paraf Peminjam
                      </th>
                      <th scope="col" className="border border-black py-2 px-1.5 w-20">
                        Paraf Petugas
                      </th>
                      <th scope="col" className="border border-black py-2 px-1.5 w-24">
                        Keterangan
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredToolsLoans.map((loan, idx) => {
                      const toolsText = loan.toolDetails
                        ? loan.toolDetails.map(d => `${d.item_name} (${d.quantity} unit)`).join(', ')
                        : 'Alat Praktik';
                      const isFinished = loan.status === 'SELESAI';

                      return (
                        <tr key={loan.id} className="border border-black hover:bg-stone-50 transition-colors">
                          <td className="border border-black py-1.5 px-1 font-medium">{idx + 1}</td>
                          <td className="border border-black py-1.5 px-1 font-mono">
                            <span className="font-bold">{loan.day_name}</span>, {loan.loan_date}
                          </td>
                          <td className="border border-black py-1.5 px-2 text-left font-bold text-stone-900">
                            {loan.class_name}
                          </td>
                          <td className="border border-black py-1.5 px-3 text-left">
                            <div className="font-bold text-stone-900">{loan.teacher_name}</div>
                            {loan.borrower_name && (
                              <div className="text-[9px] text-stone-600 font-normal leading-none mt-0.5">
                                Siswa: {loan.borrower_name}
                              </div>
                            )}
                          </td>
                          <td className="border border-black py-1.5 px-3 text-left font-medium text-stone-800">
                            {toolsText}
                          </td>
                          <td className="border border-black py-1.5 px-1 font-bold">Baik</td>
                          <td className="border border-black py-1.5 px-1 font-bold">
                            {isFinished ? 'Baik' : '—'}
                          </td>
                          <td className="border border-black py-1 px-1">
                            {loan.signature_base64 ? (
                              <img
                                src={loan.signature_base64}
                                alt="Paraf"
                                className="max-h-7 max-w-[65px] mx-auto object-contain filter contrast-200"
                              />
                            ) : (
                              <span className="font-serif italic text-xs font-semibold text-stone-800">
                                ✓ Paraf
                              </span>
                            )}
                          </td>
                          <td className="border border-black py-1 px-1">
                            <span className="font-serif italic font-extrabold text-sm text-stone-900">
                              f
                            </span>
                          </td>
                          <td className="border border-black py-1.5 px-1 font-bold">
                            {isFinished ? (
                              <span className="text-sm font-black text-black">✓</span>
                            ) : (
                              <span className="text-[10px] uppercase font-bold text-amber-800">
                                Dipinjam
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Pad with Empty Lines */}
                    {includeEmptyRows &&
                      Array.from({ length: toolsEmptyRowCount }).map((_, i) => {
                        const rowNum = filteredToolsLoans.length + i + 1;
                        return (
                          <tr key={`empty-t-${i}`} className="border border-black h-8 text-stone-400">
                            <td className="border border-black py-1 px-1 font-light text-stone-500">{rowNum}</td>
                            <td className="border border-black py-1 px-1"></td>
                            <td className="border border-black py-1 px-2"></td>
                            <td className="border border-black py-1 px-3"></td>
                            <td className="border border-black py-1 px-3"></td>
                            <td className="border border-black py-1 px-1"></td>
                            <td className="border border-black py-1 px-1"></td>
                            <td className="border border-black py-1 px-1"></td>
                            <td className="border border-black py-1 px-1"></td>
                            <td className="border border-black py-1 px-1"></td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Signatures Footer */}
              <div className="grid grid-cols-2 text-center text-xs mt-8 pt-2 text-stone-900">
                <div className="flex flex-col items-center">
                  <p className="font-medium">Mengetahui,</p>
                  <p className="font-bold uppercase tracking-wider mt-0.5">Ketua Jurusan TJKT</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline text-stone-900 tracking-wide">
                    {kajurName}
                  </p>
                  <p className="text-[10px] text-stone-600 mt-0.5">NIP. ........................................</p>
                </div>

                <div className="flex flex-col items-center">
                  <p className="font-medium">Beringin, {todayFormatted}</p>
                  <p className="font-bold uppercase tracking-wider mt-0.5">Petugas Inventaris Kajur</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline text-stone-900 tracking-wide">
                    {petugasName}
                  </p>
                  <p className="text-[10px] text-stone-600 mt-0.5">NIP / NUPTK. ........................................</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
