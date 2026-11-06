import React from 'react';
import { Projector, RotateCcw, Clock, CheckCircle2 } from 'lucide-react';

function getTeacherInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function ProjectorTable({ loans, onOpenReturn }) {
  const projectorLoans = loans.filter(l => l.hasProjector);

  return (
    <div className="w-full rounded-2xl bg-neu-base neu-inset-sm border border-white/60 dark:border-white/5">
      <table className="w-full text-left border-collapse text-xs md:text-sm">
        <thead>
          <tr className="bg-[#dde4ee] dark:bg-[#1b1e24] text-slate-700 dark:text-slate-300 font-extrabold border-b border-[#c8d4e2] dark:border-[#242832] divide-x divide-[#c8d4e2] dark:divide-[#242832]">
            <th scope="col" className="py-3 px-2 text-center w-12 font-mono">No</th>
            <th scope="col" className="py-3 px-3 text-left w-36 font-mono">Tanggal & Waktu</th>
            <th scope="col" className="py-3 px-3 text-left">Peminjam & Kelas</th>
            <th scope="col" className="py-3 px-3 text-left w-44">Unit Proyektor</th>
            <th scope="col" className="py-3 px-3 text-left w-48">Kondisi & Kelengkapan</th>
            <th scope="col" className="py-3 px-3 text-center w-32 no-print">Status / Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#d4dde8] dark:divide-[#242832]">
          {projectorLoans.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500">
                <div className="w-12 h-12 bg-neu-base neu-inset-sm rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-500 dark:text-slate-400">
                  <Projector className="w-6 h-6" aria-hidden="true" />
                </div>
                <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">Belum Ada Transaksi Peminjaman Proyektor</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Klik tombol <strong>"Catat Peminjaman"</strong> di pojok kanan atas untuk mencatat keluar proyektor.
                </p>
              </td>
            </tr>
          ) : (
            projectorLoans.map((loan, index) => {
              const isBorrowed = loan.status === 'DIPINJAM';
              const projDetail = loan.projectorDetails[0] || {};
              const initials = getTeacherInitials(loan.teacher_name);

              return (
                <tr
                  key={loan.id}
                  className={`divide-x divide-[#d4dde8] dark:divide-[#242832] transition-colors ${
                    isBorrowed
                      ? 'bg-amber-50/70 dark:bg-amber-950/20 hover:bg-amber-100/60 dark:hover:bg-amber-950/30 text-slate-900 dark:text-slate-100 border-l-4 border-l-amber-500'
                      : 'hover:bg-white/40 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {/* 1. No */}
                  <td className="py-3 px-2 text-center font-bold text-slate-400 dark:text-slate-500 font-mono text-xs">
                    {String(index + 1).padStart(2, '0')}
                  </td>

                  {/* 2. Tanggal & Waktu */}
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-100 text-xs">
                      {loan.loan_date}
                    </div>
                    <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>{loan.start_time}</span>
                      <span>→</span>
                      {loan.end_time ? (
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{loan.end_time}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[10px] border border-amber-300 dark:border-amber-800">
                          <Clock className="w-2.5 h-2.5" /> Aktif
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 3. Peminjam & Kelas */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-neu-base neu-inset-xs flex items-center justify-center font-black text-[10px] text-teal-800 dark:text-teal-400 shrink-0 border border-white/60 dark:border-white/5">
                        {initials}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                        {loan.teacher_name}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 pl-8">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{loan.class_name}</span>
                      <span className="text-slate-400 dark:text-slate-600 mx-1">•</span>
                      <span>Peminjam: <strong className="text-slate-700 dark:text-slate-300 font-medium">{loan.borrower_name}</strong></span>
                    </div>
                  </td>

                  {/* 4. Unit Proyektor */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-neu-base neu-inset-xs font-mono font-bold text-[11px] text-teal-800 dark:text-teal-400 border border-white/60 dark:border-white/5">
                        {projDetail.item_code || 'PROYEKTOR'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                      {projDetail.item_name || 'Unit InFocus Kajur'}
                    </p>
                  </td>

                  {/* 5. Kondisi & Kelengkapan (Checklist Digital) */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400">Kondisi:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {projDetail.condition_before || 'Baik'}
                      </span>
                      {projDetail.condition_after && (
                        <>
                          <span className="text-slate-400">→</span>
                          <span className={`font-bold ${projDetail.condition_after === 'RUSAK' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            {projDetail.condition_after}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#dde4ee] dark:bg-[#1b1e24] text-teal-900 dark:text-teal-300 border border-white/60 dark:border-white/5">
                        ✓ Cek Fisik Lengkap
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        ({loan.admin_name || 'Petugas'})
                      </span>
                    </div>
                  </td>

                  {/* 6. Status / Aksi */}
                  <td className="py-3 px-3 text-center no-print">
                    {isBorrowed ? (
                      <button
                        type="button"
                        onClick={() => onOpenReturn(loan, projDetail.item_code)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-[2px_2px_5px_var(--neu-dark)] flex items-center justify-center gap-1 mx-auto transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                        Kembalikan
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> Selesai
                      </span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
