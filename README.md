# KAJURIN — Sistem Pencatatan Peminjaman Inventaris Ruang Kajur

Aplikasi Web & Desktop lokal berbasis **2x Scan QR Code & Paraf Digital** untuk menggantikan formulir fisik peminjaman proyektor dan alat/bahan di ruang Ketua Jurusan (Kajur).

---

## 🚀 Cara Menjalankan Aplikasi

### Cara 1 (Paling Mudah — Cukup Double-Click):
1. Buka folder `D:\KAJURIN`.
2. Klik ganda file **`start-kajurin.bat`**.
3. Browser PC akan otomatis terbuka ke alamat `http://localhost:3000`.

### Cara 2 (Via Terminal / PowerShell):
```powershell
$env:PATH = "D:\KAJURIN\tools\node-v20.18.0-win-x64;$env:PATH"
cd D:\KAJURIN
npm start
```

---

## 📱 Cara Akses via HP (Jaringan Wi-Fi Ruang Kajur)
1. Pastikan HP guru atau siswa terhubung ke Wi-Fi yang sama dengan PC Kajur.
2. Di layar PC Kajur, klik tombol alamat IP di bagian atas (contoh: `http://192.168.98.190:3000`).
3. Scan QR Code yang muncul di layar PC menggunakan kamera HP.
4. Browser HP akan langsung membuka form peminjaman/pengembalian KAJURIN.

---

## 🛠️ Fitur-Fitur Utama Sesuai PRD

### 1. Dual-Table Dashboard Real-Time (PC Kajur)
- **Tab 1 (Khusus Proyektor / Infocus):** Tanggal, Nama Guru, Kelas/Mapel, Jam Mulai, Jam Selesai, Kondisi Sebelum, Kondisi Sesudah, Kelengkapan, Paraf Guru/Peminjam, Paraf Petugas, dan Keterangan (✓).
- **Tab 2 (Daftar Peminjaman Alat dan Bahan):** Hari/Tanggal, Kelas, Nama Peminjam/Guru, Alat/Bahan & Jumlah, Tanda Tangan, dan Keterangan (✓).
- **Indikator Visual:** Baris kuning berkedip untuk barang yang masih aktif dipinjam, dan baris hijau untuk barang yang sudah kembali.
- **Auto-Split Multi-Item:** Jika siswa meminjam Proyektor sekaligus Cok Sambung, sistem otomatis membagi pencatatannya ke Tab 1 dan Tab 2!

### 2. Smart Mode Switcher (Scan 1 & Scan 2 di HP)
- **Scan 1 (Peminjaman):**
  - Barang utama otomatis terpilih sesuai QR stiker.
  - Tambah alat pendukung sekaligus (contoh: Cok Sambung, Kabel HDMI).
  - Autocomplete Nama Guru dan Kelas.
  - Tanggal dan Jam Mulai otomatis terisi detik itu juga.
  - **Paraf Digital (Touch Signature Pad):** Siswa/guru menggoreskan paraf langsung dengan jari di layar HP.
- **Scan 2 (Pengembalian):**
  - Saat barang sedang dipinjam, scan QR kedua otomatis membuka form **Pengembalian**.
  - Menampilkan ringkasan peminjaman aktif.
  - Checklist kelengkapan (Remote, Kabel HDMI, Kabel Power).
  - Konfirmasi kondisi sesudah (*Baik* atau *Rusak*).
  - Jam Selesai otomatis terisi dan status seketika berubah jadi selesai (✓).

### 3. Generator & Cetak Stiker Label QR KAJURIN
- Klik menu **"Stiker QR"** di navbar PC.
- Otomatis mencetak stiker QR dengan kode barang (`INF-01`, `COK-01`, dll) siap dipotong dan ditempel pada fisik barang.

### 4. Cetak Dokumen Resmi Formulir Kajur (Print/PDF)
- Klik menu **"Laporan Resmi"** di navbar PC.
- Format laporan identik 100% dengan lembar kertas asli di ruang Kajur, lengkap dengan gambar paraf peminjam dan kolom tanda tangan Ketua Jurusan & Petugas Jaga.

### 5. Manajemen Master Data
- Tambah, edit, dan hapus data inventaris barang, daftar nama guru pengampu, dan daftar kelas.

---

## 📂 Struktur File
```
D:\KAJURIN\
├── PRD.md                  # Dokumen spesifikasi kebutuhan produk
├── start-kajurin.bat       # Shortcut sekali klik untuk menjalankan server & buka browser
├── package.json            # Konfigurasi dependensi project
├── kajurin.db              # Database SQLite offline
├── server\
│   ├── index.js            # Express server & WebSocket hub
│   ├── db.js               # Driver SQLite (sql.js) & schema initialization
│   ├── routes.js           # REST API endpoints
│   └── seed-sample.js      # Seeder transaksi contoh
├── src\
│   ├── App.jsx             # Root component & WebSocket realtime sync
│   ├── main.jsx            # React bootstrap
│   ├── index.css           # Tailwind CSS & Print styles
│   ├── components\
│   │   ├── Navbar.jsx              # Navbar & Wi-Fi QR access
│   │   ├── DesktopDashboard.jsx    # Dual-table monitoring & quick actions
│   │   ├── ProjectorTable.jsx      # Format Tabel 1 (Proyektor)
│   │   ├── ToolsTable.jsx          # Format Tabel 2 (Alat & Bahan)
│   │   ├── MobileScanForm.jsx      # Form HP Peminjaman & Pengembalian
│   │   ├── SignaturePad.jsx        # HTML5 Canvas paraf digital sentuh
│   │   ├── CameraScannerModal.jsx  # Scanner QR via kamera HP/Webcam PC
│   │   ├── QrLabelGenerator.jsx    # Cetak stiker QR siap tempel
│   │   ├── PrintOfficialReport.jsx # Cetak PDF format resmi kertas Kajur
│   │   └── MasterDataManager.jsx   # CRUD Barang, Guru, Kelas
│   └── utils\
│       ├── api.js          # HTTP API & WebSocket helper
│       └── sound.js        # Sound synthesizer Web Audio API
└── dist\                   # Hasil build production siap saji
```

