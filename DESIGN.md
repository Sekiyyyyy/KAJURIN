# Design Direction: KAJURIN (Tema Neumorphism / Soft UI)

## 1. Aesthetic Direction: Neumorphism (Soft UI) Dual-Mode
- **Light Mode Base (Warm Alabaster Linen):** `#f0ede6`
  - Warna putih hangat dengan sentuhan linen alami, dirancang khusus agar mata tidak cepat lelah saat menatap layar berjam-jam (zero blue glare).
  - Highlight Kiri-Atas: `#ffffff`
  - Bayangan Kanan-Bawah: `#d3cdc2` (Warm Soft Taupe Shadow)
  - Teks Utama: `#1e2421` (Warm Dark Graphite, kontras tinggi lolos WCAG AAA)
- **Dark Mode Base (Midnight Obsidian):** `#17191e`
  - Warna gelap arang pekat dengan nuansa slate hangat yang tenang.
  - Highlight Kiri-Atas: `#252932`
  - Bayangan Kanan-Bawah: `#0e1014`
  - Teks Utama: `#f0ede6`
- **Neumorphic Theme Toggle:**
  - Track debossed/inset kapsul dengan thumb/knob tactile cembung yang meluncur halus antara mode matahari hangat (Sun) dan bulan tenang (Moon).

## 2. Branding & Identitas Visual:
1. **Logo Vektor Resmi (No Emojis, No Generic Letters):**
   - Menggantikan emoji kardus dan kotak huruf tunggal dengan emblem vektor geometris presisi (`KajurinLogo.jsx`).
   - Melambangkan rak kompartemen peralatan dan sensor optik aperture proyektor jurusan TJKT SMK Negeri 1 Beringin.
2. **Pembersihan Slop Badge:**
   - Menghapus badge label "PRO" yang tidak fungsional.
3. **Instansi Resmi:**
   - **SMK Negeri 1 Beringin** pada seluruh kop, header, dokumen cetak, dan stiker QR.

## 3. Arsitektur Halaman Penuh (Bebas Pop-up / Modal Overlay):
1. **Sidebar-Driven Single Page Navigation:**
   - Mengubah seluruh formulir dan fitur yang sebelumnya berupa pop-up / modal overlay gelap (`fixed inset-0 bg-slate-900/40`) menjadi **Halaman Asli (Full Page Views)** di dalam container utama `<main>`.
   - **Halaman yang Ditransformasi:**
     - `new-loan`: Halaman Formulir Catat Peminjaman Inventaris (`NewLoanPage.jsx`) dengan grid 2-kolom lega.
     - `return-loan`: Halaman Konfirmasi Pengembalian Barang (`ReturnPage.jsx`).
     - `mobile-access`: Halaman Panduan & QR Akses HP Petugas (`MobileAccessPage.jsx`).
     - `master-data`: Halaman Manajemen Data Barang, Guru, & Kelas (`MasterDataManager.jsx`).
     - `reports`: Halaman Cetak Formulir Fisik Resmi Kajur (`PrintOfficialReport.jsx`).
     - `qr-labels`: Halaman Generator Stiker Label QR Barang (`QrLabelGenerator.jsx`).
     - `scanner`: Halaman Pemindai Kamera QR Code (`CameraScannerModal.jsx`).
2. **Navigasi Mulus & Breadcrumbs:**
   - Setiap sub-halaman memiliki tombol navigasi `← Kembali ke Sirkulasi` yang konsisten.
   - Tidak ada lagi scrollbar ganda atau jendela modal yang membatasi luas layar kerja.

## 2. Mengeliminasi AI Slop & Mengatasi Keluhan User:
1. **Tidak Ada Konten Ramai yang Tidak Penting:**
   - Hilangkan simulasi kompartemen rak raksasa yang memakan separuh layar.
   - Sediakan ringkasan status neumorphic yang super minimalis, ramping, dan fungsional.
   - Fokus langsung ke konten esensial: **Tabel Sirkulasi Peminjaman & Pengembalian**.
2. **Tombol Minimize Tunggal (Tidak Redundant):**
   - Hapus tombol duplikat dari Top Header!
   - Hanya gunakan SATU tombol toggle di Sidebar yang taktil dan bersih.
3. **Tipografi Modern:**
   - Font Display: `Outfit` (bersih, geometric sans).
   - Font Angka & Waktu: `JetBrains Mono` (`font-mono tabular-nums`).
   - Kontras Tinggi: Teks hitam pekat `#1e293b` & `#0f172a` (Lolos WCAG AA).

## 3. Penyempurnaan UX & Digitalisasi:
1. **Bebas Horizontal Scroll (100% Fit Display):**
   - Mengonsolidasi 13 kolom terpisah menjadi 6 kolom terstruktur secara vertikal (No, Tanggal & Waktu, Peminjam & Kelas, Unit Barang, Kondisi & Kelengkapan, Status/Aksi).
   - Menghapus pembatas `overflow-x-auto` yang memaksa scroll, sehingga seluruh informasi langsung terbaca tanpa geser kanan-kiri.
2. **Icon & Teks Bersih (No Double Plus):**
   - Tombol utama hanya menggunakan 1 icon `<PlusCircle>` dan teks bersih `Catat Peminjaman`.
3. **Pencahayaan Matte & Halus (No Overdone Glows):**
   - Menghapus efek neon/radioactive halo pada badge hijau.
   - Menggunakan warna matte sage/emerald dan debossed slate yang seimbang dengan tema Neumorphism.
4. **Verifikasi Digital Checklist (Bebas Paraf Fisik):**
   - Sistem murni digital untuk petugas Kajur: mengganti canvas paraf manual dengan checkbox checklist verifikasi serah terima fisik secara instan.
5. **Identitas Instansi Resmi:**
   - Nama instansi diseragamkan menjadi **SMK Negeri 1 Beringin** di seluruh komponen (Sidebar, Header, Dokumen Cetak PDF, Label Stiker QR).
