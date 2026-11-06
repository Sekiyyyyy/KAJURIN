import React, { useState } from 'react';
import { Printer, X, ArrowLeft } from 'lucide-react';

export default function PrintOfficialReport({ loans, onClose }) {
  const [reportType, setReportType] = useState('ALL'); // 'PROYEKTOR' | 'ALAT_BEBAS' | 'ALL'
  const [kajurName, setKajurName] = useState('Ketua Jurusan TJKT');
  const [petugasName, setPetugasName] = useState('Petugas Inventaris Kajur');

  const projectorLoans = loans.filter(l => l.hasProjector);
  const toolsLoans = loans.filter(l => l.hasTools);

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Controls Header (Hidden in Print) */}
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
              Dokumen Resmi
            </span>
            <h2 id="print-report-title" className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
              Cetak Formulir Fisik Peminjaman Ruang Kajur
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Format lembar dokumen kertas resmi di ruang Kajur SMK Negeri 1 Beringin lengkap dengan verifikasi peminjam.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold neu-flat-sm active:neu-inset-xs flex items-center gap-1.5 transition min-h-[38px]"
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
            Cetak Dokumen Sekarang (PDF)
          </button>
        </div>
      </div>

      <div className="relative w-full bg-neu-base rounded-2xl neu-flat border border-white/60 dark:border-white/10 overflow-hidden text-slate-800 dark:text-slate-100">

        {/* Filter & Options (Hidden in Print) */}
        <div className="no-print p-3 bg-[#e8ecf2] border-b border-[#d8e1eb] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <label htmlFor="report-type-select" className="font-semibold text-slate-800">Pilih Format Cetak:</label>
            <select
              id="report-type-select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-1.5 bg-[#e8ecf2] shadow-[inset_2px_2px_4px_#c5d0de,inset_-2px_-2px_4px_#ffffff] rounded-xl text-xs font-semibold border border-white/60 focus:outline-none"
            >
              <option value="ALL">Keduanya (Khusus Proyektor & Alat Bahan)</option>
              <option value="PROYEKTOR">Format 1: Khusus Proyektor (Infocus)</option>
              <option value="ALAT_BEBAS">Format 2: Daftar Peminjaman Alat dan Bahan</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label htmlFor="kajur-name-input" className="text-stone-600">Nama Kajur:</label>
              <input
                id="kajur-name-input"
                type="text"
                value={kajurName}
                onChange={(e) => setKajurName(e.target.value)}
                className="px-2 py-1 border border-stone-300 rounded text-xs bg-white"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label htmlFor="petugas-name-input" className="text-stone-600">Nama Petugas:</label>
              <input
                id="petugas-name-input"
                type="text"
                value={petugasName}
                onChange={(e) => setPetugasName(e.target.value)}
                className="px-2 py-1 border border-stone-300 rounded text-xs bg-white"
              />
            </div>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-8 bg-white max-h-[75vh] overflow-y-auto space-y-10">
          {/* FORMAT 1: KHUSUS PROYEKTOR */}
          {(reportType === 'ALL' || reportType === 'PROYEKTOR') && (
            <div className="border border-stone-800 p-6 rounded-sm bg-white">
              {/* Header Dokumen */}
              <div className="text-center border-b-2 border-double border-stone-900 pb-3 mb-4">
                <h3 className="font-extrabold text-sm uppercase tracking-wide text-stone-900">
                  DAFTAR PEMINJAMAN PROYEKTOR (INFOCUS)
                </h3>
                <h4 className="font-bold text-xs uppercase text-stone-800">
                  RUANG KETUA JURUSAN (KAJUR) SMK NEGERI 1 BERINGIN
                </h4>
                <p className="text-[10px] text-stone-600 italic mt-0.5">
                  Sistem Pencatatan Inventaris KAJURIN | Tanggal Cetak: {todayStr}
                </p>
              </div>

              {/* Tabel Proyektor */}
              <table className="w-full border-collapse border border-stone-900 text-[11px]">
                <thead>
                  <tr className="bg-stone-100 text-stone-900 font-bold border border-stone-900 text-center">
                    <th scope="col" className="border border-stone-900 py-1.5 px-1 w-7">No</th>
                    <th scope="col" className="border border-stone-900 py-1.5 px-1.5">Tanggal</th>
                    <th scope="col" className="border border-stone-900 py-1.5 px-2">Nama Guru</th>
                    <th scope="col" className="border border-stone-900 py-1.5 px-2">Kelas / Mapel</th>
                    <th scope="col" className="border border-stone-900 py-1.5 px-1">Mulai</th>
                    <th scope="col" className="border border-stone-900 py-1.5 px-1">Selesai</th>
                    <th scope="col" className="border border-stone-900 py-1.5 px-1">Kond. Sblm</th>
                    <th scope="col" className="border border-stone-900 py-1.5 px-1">Kond. Ssdh</th>
                    <th scope="col" className="border border-stone-900 py-1.5 px-1">Kelengkapan</th>
                    <th scope="col" className="border border-stone-900 py-1.5 px-1.5">Cek Fisik</th>
                    <th scope="col" className="border border-stone-900 py-1.5 px-1.5">Petugas</th>
                    <th scope="col" className="border border-stone-900 py-1.5 px-1">Ket.</th>
                  </tr>
                </thead>
                <tbody>
                  {projectorLoans.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="border border-stone-900 py-4 text-center text-stone-500 italic">
                        Tidak ada catatan peminjaman proyektor pada periode ini.
                      </td>
                    </tr>
                  ) : (
                    projectorLoans.map((loan, idx) => {
                      const projDetail = loan.projectorDetails[0] || {};
                      return (
                        <tr key={loan.id} className="border border-stone-900 text-center">
                          <td className="border border-stone-900 py-1 px-1">{idx + 1}</td>
                          <td className="border border-stone-900 py-1 px-1.5 font-mono">{loan.loan_date}</td>
                          <td className="border border-stone-900 py-1 px-2 text-left font-bold">{loan.teacher_name}</td>
                          <td className="border border-stone-900 py-1 px-2 text-left">
                            <div>{loan.class_name}</div>
                            <div className="text-[9px] text-stone-600 font-normal">({loan.borrower_name})</div>
                          </td>
                          <td className="border border-stone-900 py-1 px-1 font-mono">{loan.start_time}</td>
                          <td className="border border-stone-900 py-1 px-1 font-mono">{loan.end_time || '-'}</td>
                          <td className="border border-stone-900 py-1 px-1 font-bold">{projDetail.condition_before || 'Baik'}</td>
                          <td className="border border-stone-900 py-1 px-1 font-bold">{projDetail.condition_after || '-'}</td>
                          <td className="border border-stone-900 py-1 px-1">{loan.status === 'SELESAI' ? '✓' : '-'}</td>
                          <td className="border border-stone-900 py-1 px-1.5 font-bold text-teal-800">✓ Cek</td>
                          <td className="border border-stone-900 py-1 px-1.5 text-[10px]">{loan.admin_name || 'Petugas'}</td>
                          <td className="border border-stone-900 py-1 px-1 font-bold">{loan.status === 'SELESAI' ? '✓' : 'Dipinjam'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Tanda Tangan Footer */}
              <div className="grid grid-cols-2 text-center text-xs mt-8 pt-4">
                <div>
                  <p className="text-stone-600">Mengetahui,</p>
                  <p className="font-bold text-stone-900">Ketua Jurusan</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline text-stone-900">{kajurName}</p>
                </div>
                <div>
                  <p className="text-stone-600">Ruang Kajur, {todayStr}</p>
                  <p className="font-bold text-stone-900">Petugas Piket / Admin</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline text-stone-900">{petugasName}</p>
                </div>
              </div>
            </div>
          )}

          {/* Page break in print between tables if printing both */}
          {reportType === 'ALL' && <div className="page-break my-6 border-t-2 border-dashed border-stone-300 no-print" />}

          {/* FORMAT 2: DAFTAR PEMINJAMAN ALAT DAN BAHAN */}
          {(reportType === 'ALL' || reportType === 'ALAT_BEBAS') && (
            <div className="border border-stone-800 p-6 rounded-sm bg-white">
              {/* Header Dokumen */}
              <div className="text-center border-b-2 border-double border-stone-900 pb-3 mb-4">
                <h3 className="font-extrabold text-sm uppercase tracking-wide text-stone-900">
                  DAFTAR PEMINJAMAN ALAT DAN BAHAN
                </h3>
                <h4 className="font-bold text-xs uppercase text-stone-800">
                  RUANG KETUA JURUSAN (KAJUR) SMK NEGERI 1 BERINGIN
                </h4>
                <p className="text-[10px] text-stone-600 italic mt-0.5">
                  Sistem Pencatatan Inventaris KAJURIN | Tanggal Cetak: {todayStr}
                </p>
              </div>

              {/* Tabel Alat dan Bahan */}
              <table className="w-full border-collapse border border-stone-900 text-[11px]">
                <thead>
                  <tr className="bg-stone-100 text-stone-900 font-bold border border-stone-900 text-center">
                    <th scope="col" className="border border-stone-900 py-1.5 px-1 w-7">No</th>
                    <th scope="col" className="border border-stone-900 py-1.5 px-2">Hari / Tanggal</th>
                    <th scope="col" className="border border-stone-900 py-1.5 px-2">Kelas</th>
                    <th scope="col" className="border border-stone-900 py-1.5 px-2.5">Nama Peminjam / Guru</th>
                    <th scope="col" className="border border-stone-900 py-1.5 px-3">Alat / Bahan</th>
                    <th scope="col" className="border border-stone-900 py-1.5 px-2">Cek Fisik</th>
                    <th scope="col" className="border border-stone-900 py-1.5 px-1 w-12">Ket.</th>
                  </tr>
                </thead>
                <tbody>
                  {toolsLoans.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="border border-stone-900 py-4 text-center text-stone-500 italic">
                        Tidak ada catatan peminjaman alat dan bahan pada periode ini.
                      </td>
                    </tr>
                  ) : (
                    toolsLoans.map((loan, idx) => {
                      const toolsText = loan.toolDetails
                        .map(d => `${d.item_name} (${d.quantity})`)
                        .join(', ');

                      return (
                        <tr key={loan.id} className="border border-stone-900 text-center">
                          <td className="border border-stone-900 py-1 px-1">{idx + 1}</td>
                          <td className="border border-stone-900 py-1 px-2 whitespace-nowrap">
                            <span className="font-bold">{loan.day_name}</span>, {loan.loan_date}
                          </td>
                          <td className="border border-stone-900 py-1 px-2 font-bold text-stone-900">{loan.class_name}</td>
                          <td className="border border-stone-900 py-1 px-2.5 text-left">
                            <div className="font-bold text-stone-900">{loan.teacher_name}</div>
                            <div className="text-[9px] text-stone-600 font-normal">Peminjam: {loan.borrower_name}</div>
                          </td>
                          <td className="border border-stone-900 py-1 px-3 text-left font-medium">
                            {toolsText}
                          </td>
                          <td className="border border-stone-900 py-1 px-2 font-bold text-teal-800">
                            ✓ Cek
                          </td>
                          <td className="border border-stone-900 py-1 px-1 font-bold">
                            {loan.status === 'SELESAI' ? '✓' : 'Dipinjam'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Tanda Tangan Footer */}
              <div className="grid grid-cols-2 text-center text-xs mt-8 pt-4">
                <div>
                  <p className="text-stone-600">Mengetahui,</p>
                  <p className="font-bold text-stone-900">Ketua Jurusan</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline text-stone-900">{kajurName}</p>
                </div>
                <div>
                  <p className="text-stone-600">Ruang Kajur, {todayStr}</p>
                  <p className="font-bold text-stone-900">Petugas Piket / Admin</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline text-stone-900">{petugasName}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
