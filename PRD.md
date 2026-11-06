# Product Requirements Document (PRD) — KAJURIN

**Nama Aplikasi:** KAJURIN (Sistem Pencatatan Peminjaman Inventaris Ruang Kajur)

**Platform:** KAJURIN Desktop App (Windows/PC Kajur) & KAJURIN Mobile Web Form (Lokal Wi-Fi)

**Status Dokumen:** Draft 1.1

## 1. Latar Belakang & Masalah Utama

Pencatatan peminjaman inventaris di ruang Ketua Jurusan (Kajur) saat ini masih menggunakan dua lembar formulir kertas terpisah, yaitu lembar khusus **Proyektor (Infocus)** dan lembar **Daftar Peminjaman Alat dan Bahan**. Berdasarkan evaluasi lembar fisik di lapangan, ditemukan beberapa kendala utama:

1. **Kolom Penting Sering Dikosongkan:** Kolom *Kelas / Mata Pelajaran*, *Jam Pemakaian (Mulai & Selesai)*, serta *Paraf Guru* sering terlewat karena antrean peminjaman saat pergantian jam pelajaran.

2. **Validasi Kondisi Tidak Berjalan:** Opsi kondisi proyektor (*Baik / Rusak*) sebelum dan sesudah pemakaian jarang dilingkari atau dicoret.

3. **Pencatatan Tumpang Tindih:** Peminjaman proyektor terkadang masih ditulis di lembar alat dan bahan umum, atau sebaliknya saat siswa meminjam proyektor sekaligus cok sambung.

4. **Sulit Melacak Barang yang Belum Kembali:** Petugas harus memeriksa baris kertas satu per satu untuk mengetahui barang apa yang masih tertahan di kelas.

## 2. Tujuan Produk (KAJURIN)

1. Mengubah proses input manual di kertas menjadi sistem **2x Scan QR Code** melalui kamera HP di **KAJURIN** (Scan 1 untuk Peminjaman, Scan 2 untuk Pengembalian).

2. Mengotomatisasi pengisian **Tanggal**, **Jam Mulai**, dan **Jam Selesai** tepat saat QR di-scan.

3. Menyediakan fitur **Paraf Digital (Signature Pad)** langsung di layar HP saat meminjam.

4. Memisahkan tampilan monitoring dan cetak laporan otomatis ke dalam **2 format tabel resmi Kajur** (Khusus Proyektor dan Alat/Bahan Bebas) secara *real-time* di layar **KAJURIN Desktop**.

## 3. Alur Kerja Sistem (User Flow)

### A. Persiapan & Cetak Stiker QR Code (Di KAJURIN Desktop)

1. Admin mendaftarkan data barang di aplikasi **KAJURIN Desktop** (contoh: `INF-01` untuk Infocus 1 dengan kategori `PROYEKTOR`, dan `ALT-01` untuk Cok Sambung 1 dengan kategori `ALAT_BEBAS`).

2. Sistem **KAJURIN** menghasilkan stiker QR Code yang berisi URL lokal menuju form barang tersebut, misalnya `http://192.168.1.100:3000/scan?item=INF-01`.

3. Stiker QR Code berlabel **KAJURIN** dicetak dan ditempelkan pada fisik barang.

### B. Scan ke-1: Proses Peminjaman Barang (Via HP)

1. Siswa atau guru datang ke ruang Kajur untuk meminjam barang (misal: Infocus + Cok Sambung).

2. Admin membuka kamera HP dan men-scan QR Code pada fisik barang utama (`INF-01`).

3. Browser HP otomatis membuka halaman **KAJURIN Web Form** pada tab **Peminjaman**:

   * **Barang Utama:** Otomatis terpilih sesuai QR yang di-scan.

   * **Tambah Barang Sekaligus:** Admin dapat menekan tombol tambah barang (misal memilih `Cok Sambung` beserta jumlahnya) dalam satu form yang sama.

   * **Data Peminjam:** Admin memilih *Nama Guru*, *Kelas / Mapel*, dan mengetik *Nama Siswa* yang mengambil.

   * **Kondisi Awal:** Otomatis terpilih *Baik* (dapat diubah jika ada catatan khusus).

   * **Paraf Peminjam:** Peminjam mencoret paraf menggunakan jari pada kotak sentuh (*Signature Pad*) di bagian bawah layar HP.

4. Admin menekan tombol **Simpan Peminjaman**.

5. Data langsung tampil secara *real-time* di layar **KAJURIN Desktop** dengan status *Sedang Dipinjam*. Jika meminjam Infocus sekaligus Cok Sambung, sistem otomatis membagi item tersebut ke tabel masing-masing.

### C. Scan ke-2: Proses Pengembalian Barang (Via HP)

1. Saat jam pelajaran selesai, siswa mengembalikan barang ke ruang Kajur.

2. Admin men-scan ulang QR Code pada barang tersebut menggunakan HP.

3. Browser HP membuka **KAJURIN Web Form** pada tab **Pengembalian**:

   * Menampilkan ringkasan peminjam aktif (Nama Guru, Kelas, dan Jam Mulai).

   * Admin memilih **Kondisi Sesudah** (*Baik* atau *Rusak*) dan mencentang **Kelengkapan Dikembalikan** (Remote, Kabel HDMI/Power).

   * Jika dalam sesi tersebut terdapat lebih dari satu barang (Infocus + Cok), tersedia opsi *Kembalikan Semua Sekaligus*.

4. Admin menekan tombol **Selesaikan Pengembalian**.

5. Pada layar **KAJURIN Desktop**, kolom **Jam Selesai** otomatis terisi waktu saat itu, serta kolom **Kelengkapan Dikembalikan** dan **Keterangan (Ket.)** langsung berubah menjadi tanda centang ($\checkmark$).

## 4. Spesifikasi Fitur Berdasarkan Modul

### Modul 1: KAJURIN Desktop (Monitoring & Admin PC Kajur)

* **Live Dual-Table Dashboard:** Menampilkan dua tab tabel peminjaman harian secara *real-time* (Tab 1: *Khusus Proyektor*, Tab 2: *Daftar Peminjaman Alat dan Bahan*).

* **Indikator Status Visual:** Baris peminjaman yang masih aktif berwarna kuning, sedangkan yang sudah dikembalikan berwarna hijau dengan tanda centang ($\checkmark$).

* **Manajemen Master Data:** CRUD untuk daftar *Barang Inventaris*, *Data Guru*, dan *Daftar Kelas / Jurusan*.

* **Generator & Cetak Label QR KAJURIN:** Fitur membuat dan mencetak stiker QR Code per barang lengkap dengan identitas aplikasi **KAJURIN** dalam format siap tempel.

* **Export & Cetak Laporan Resmi (PDF/Print):** Mencetak laporan bulanan atau harian dengan tata letak kolom yang identik dengan formulir kertas asli di ruang Kajur, lengkap dengan gambar paraf peminjam dan paraf petugas.

### Modul 2: KAJURIN Mobile Web Form (Akses via Scan QR di HP)

* **Smart Mode Switcher:** Memiliki 2 tab utama (*Peminjaman* dan *Pengembalian*) yang otomatis menyesuaikan dengan status ketersediaan barang saat QR di-scan.

* **Multi-Item Picker:** Memungkinkan penambahan alat pendukung (seperti Cok Sambung) di dalam satu kali pengisian form.

* **Autocomplete Input:** Pencarian cepat untuk memilih *Nama Guru* dan *Kelas* tanpa perlu mengetik penuh.

* **Touch Signature Pad:** Area tanda tangan berbasis HTML5 Canvas untuk merekam paraf peminjam langsung dari layar HP.

## 5. Pemetaan Kolom Tabel (Sesuai Standar Kertas Kajur)

**KAJURIN** menyajikan dua format tabel laporan yang merujuk langsung pada kolom dokumen fisik Kajur:

### A. Struktur Tabel 1: Khusus Peminjaman Proyektor

 1. **Tanggal:** Terisi otomatis (`DD-MM-YY`) saat Scan ke-1.

 2. **Nama Guru:** Dipilih dari daftar guru saat Scan ke-1.

 3. **Kelas / Mata Pelajaran:** Dipilih dari daftar kelas beserta nama siswa perwakilan.

 4. **Jam Pemakaian (Mulai):** Terisi jam otomatis (`HH:mm`) saat Scan ke-1.

 5. **Jam Pemakaian (Selesai):** Terisi jam otomatis (`HH:mm`) saat Scan ke-2.

 6. **Kondisi Proyektor (Sebelum):** Otomatis diset *Baik* saat Scan ke-1.

 7. **Kondisi Proyektor (Sesudah):** Dikonfirmasi *Baik* atau *Rusak* saat Scan ke-2.

 8. **Kelengkapan Dikembalikan:** Otomatis berisi tanda $\checkmark$ setelah Scan ke-2.

 9. **Paraf Guru / Peminjam:** Menampilkan gambar paraf digital dari layar HP.

10. **Paraf Petugas:** Otomatis menampilkan paraf/inisial Admin yang bertugas.

11. **Keterangan:** Otomatis berisi tanda $\checkmark$ saat pengembalian selesai.

### B. Struktur Tabel 2: Daftar Peminjaman Alat dan Bahan

1. **Hari / Tanggal:** Terisi otomatis saat Scan ke-1.

2. **Kelas:** Terisi sesuai kelas peminjam.

3. **Nama Peminjam / Guru:** Menampilkan nama guru pengampu dan siswa peminjam.

4. **Alat / Bahan:** Menampilkan nama alat dan jumlahnya (contoh: *Cok 2*).

5. **T. Tangan:** Menampilkan gambar paraf digital peminjam dari HP.

6. **Ket.:** Otomatis berisi tanda $\checkmark$ setelah barang di-scan kembali pada Scan ke-2.

## 6. Arsitektur & Tech Stack KAJURIN

| Komponen | Teknologi Pilihan | Fungsi Utama | 
| ----- | ----- | ----- | 
| **Desktop Wrapper** | Electron.js | Membungkus **KAJURIN** menjadi program desktop (`.exe`) di PC Kajur. | 
| **Backend Lokal** | Node.js + Express | Menjalankan web server lokal di jaringan Wi-Fi ruang Kajur. | 
| **Frontend UI** | React.js + Tailwind CSS | Membangun antarmuka tabel **KAJURIN Desktop** dan halaman Web Form di HP. | 
| **Database** | SQLite + Prisma ORM | Menyimpan seluruh data transaksi dan paraf secara *offline* di PC (`kajurin.db`). | 
| **Real-Time Sync** | Socket.io | Memperbarui tabel di layar PC detik itu juga saat form HP di-submit. | 
| **Fitur Khusus** | `qrcode.react` & `react-signature-canvas` | Membuat stiker QR Code dan menangkap tanda tangan sentuh di HP. | 

## 7. Rancangan Skema Database (`kajurin.db` - SQLite)

### Tabel `items` (Master Barang)

* `id` (Primary Key, Integer)

* `item_code` (String, Unique) — Contoh: `INF-01`, `COK-01`

* `name` (String) — Contoh: `Proyektor Epson 01`, `Cok Sambung`

* `category` (Enum: `PROYEKTOR`, `ALAT_BEBAS`)

* `condition` (Enum: `BAIK`, `RUSAK`)

* `status` (Enum: `TERSEDIA`, `DIPINJAM`)

### Tabel `teachers` (Master Guru)

* `id` (Primary Key, Integer)

* `name` (String) — Contoh: `Buk Widya`, `Buk Yuli`, `Pak Ican`, `Bunda`

### Tabel `loans` (Transaksi Peminjaman & Pengembalian)

* `id` (Primary Key, Integer)

* `loan_date` (String) — Format `DD-MM-YY`

* `teacher_name` (String) — Nama guru pengampu

* `borrower_name` (String) — Nama siswa/perwakilan (contoh: `Azi`, `Loby`)

* `class_name` (String) — Kelas / Mata Pelajaran

* `start_time` (String) — Jam mulai otomatis (`HH:mm`)

* `end_time` (String, Nullable) — Jam selesai otomatis saat dikembalikan (`HH:mm`)

* `signature_base64` (Text) — Data gambar PNG paraf peminjam dari HP

* `admin_name` (String) — Nama/paraf petugas jaga

* `status` (Enum: `DIPINJAM`, `SELESAI`)

### Tabel `loan_details` (Detail Barang per Transaksi)

* `id` (Primary Key, Integer)

* `loan_id` (Foreign Key $\rightarrow$ `loans.id`)

* `item_id` (Foreign Key $\rightarrow$ `items.id`)

* `quantity` (Integer) — Default `1` (bisa `2` jika pinjam *Cok 2*)

* `condition_before` (Enum: `BAIK`, `RUSAK`)

* `condition_after` (Enum: `BAIK`, `RUSAK`, Nullable)

* `is_complete` (Boolean) — Status kelengkapan dikembalikan ($\checkmark$)