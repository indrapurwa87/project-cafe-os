# 📋 Product Requirements Document (PRD)
# CaféOS — Sistem Pemesanan Digital untuk Cafe

**Versi:** 1.1  
**Tanggal:** 20 Juni 2026  
**Status:** Updated — Ditambahkan Modul Kasir  

---

## 1. Ringkasan Eksekutif

CaféOS adalah aplikasi pemesanan digital berbasis web yang dirancang untuk menggantikan proses pemesanan manual di cafe. Pelanggan dapat memindai QR code di meja mereka, melihat menu interaktif, memesan, dan melakukan pembayaran — semua tanpa perlu berinteraksi langsung dengan waiter untuk proses pemesanan dasar.

---

## 2. Latar Belakang & Masalah

### 2.1 Kondisi Saat Ini (As-Is)

```
Pelanggan datang
      ↓
Duduk di meja → Waiter mendatangi meja → Memberikan menu fisik
      ↓
Pelanggan memilih → Waiter mencatat manual → Diteruskan ke dapur
      ↓
Makanan disiapkan → Disajikan → Pelanggan minta bill → Kasir hitung manual
```

### 2.2 Pain Points yang Teridentifikasi

| # | Masalah | Dampak |
|---|---------|--------|
| 1 | Waiter harus bolak-balik ke meja hanya untuk mengambil pesanan | Inefisiensi waktu staff |
| 2 | Kesalahan pencatatan pesanan manual | Komplain pelanggan, food waste |
| 3 | Antrian panjang di kasir / resepsionis | Pengalaman pelanggan buruk |
| 4 | Tidak ada data historis pesanan yang terstruktur | Sulit analisis bisnis |
| 5 | Menu fisik mudah rusak, mahal untuk diperbarui | Biaya operasional tinggi |
| 6 | Tidak ada notifikasi real-time ke dapur | Delay produksi |

### 2.3 Tujuan Produk (To-Be)

```
Pelanggan datang → Scan QR Code di meja
      ↓
Menu digital interaktif → Pilih & pesan sendiri
      ↓
Notifikasi otomatis ke dapur → Makanan disiapkan
      ↓
Bayar langsung via app (Payment Gateway / QRIS)
      ↓
Receipt digital — Selesai
```

---

## 3. Tujuan & Sasaran

### 3.1 Tujuan Bisnis
- Mengurangi beban kerja waiter sebesar **≥ 40%** untuk tugas pencatatan pesanan
- Meningkatkan **akurasi pesanan** hingga 99%
- Mempercepat **waktu layanan** dari rata-rata 12 menit menjadi ≤ 5 menit
- Menghasilkan **laporan penjualan real-time** untuk manajemen

### 3.2 Tujuan Produk
- Membangun sistem pemesanan self-service berbasis QR code
- Integrasi payment gateway untuk pembayaran cashless
- Dashboard manajemen untuk monitoring pesanan & laporan keuangan
- Kitchen Display System (KDS) untuk notifikasi dapur real-time

---

## 4. Pengguna (User Personas)

### 👤 Persona 1 — Pelanggan Cafe
- **Siapa:** Pelanggan berusia 18–45 tahun, familiar dengan smartphone
- **Goal:** Memesan makanan/minuman dengan cepat dan mudah
- **Frustrasi:** Menunggu waiter yang sibuk, antri di kasir

### 👤 Persona 2 — Waiter / Staff Pelayan
- **Siapa:** Staff operasional cafe
- **Goal:** Mengelola pesanan yang masuk dan memastikan pesanan tersampaikan
- **Frustrasi:** Pencatatan manual yang rawan salah, multitasking

### 👤 Persona 3 — Tim Dapur (Chef / Cook)
- **Siapa:** Staff dapur yang menyiapkan pesanan
- **Goal:** Mengetahui pesanan baru dengan cepat dan akurat
- **Frustrasi:** Kertas pesanan tidak terbaca, urutan prioritas tidak jelas

### 👤 Persona 4 — Manajer / Owner Cafe
- **Siapa:** Pemilik atau manajer operasional cafe
- **Goal:** Memantau performa bisnis, laporan penjualan, manajemen menu
- **Frustrasi:** Tidak ada data real-time, rekapitulasi manual

### 👤 Persona 5 — Kasir (Cashier)
- **Siapa:** Staff kasir di counter yang menerima pesanan langsung dari pelanggan
- **Goal:** Input pesanan pelanggan dengan cepat dan akurat, menerima pembayaran tunai/non-tunai
- **Frustrasi:** Pencatatan manual lambat, tidak ada integrasi langsung ke dapur dan laporan

---

## 5. Scope & Fitur

### 5.1 Modul Pelanggan (Customer-Facing Web App)

#### F-01: QR Code per Meja
- Setiap meja memiliki QR code unik yang tertaut ke nomor meja
- QR code dapat dicetak dan dipasang di meja (stiker / standing card)
- Scan QR → langsung masuk ke menu digital tanpa perlu install aplikasi (Progressive Web App)
- QR code dapat di-regenerasi oleh admin jika diperlukan

#### F-02: Menu Digital Interaktif
- Tampilan menu dengan kategori (Makanan Berat, Ringan, Minuman, Dessert, dll.)
- Foto produk, deskripsi, harga, dan label (Best Seller, New, Spicy, Vegan, dll.)
- Pencarian menu dan filter berdasarkan kategori
- Status ketersediaan menu real-time (Tersedia / Habis)

#### F-03: Keranjang & Pemesanan
- Pelanggan dapat menambah/mengurangi item di keranjang
- Catatan khusus per item (contoh: "tanpa bawang", "pedas sedang")
- Review pesanan sebelum submit
- Konfirmasi pesanan dengan estimasi waktu

#### F-04: Pembayaran (Payment Gateway)
- **Metode yang didukung:**
  - QRIS (Quick Response Code Indonesian Standard)
  - Transfer Bank Virtual Account (BCA, BNI, Mandiri, BRI)
  - E-Wallet (GoPay, OVO, Dana, ShopeePay)
  - Kartu Kredit / Debit
  - Bayar di Kasir (Cash on Counter)
- **Payment Gateway Provider:** Midtrans (direkomendasikan untuk pasar Indonesia)
- Receipt/struk digital via tampilan layar atau email opsional

#### F-05: Status Pesanan Real-Time
- Pelanggan dapat melihat status pesanan: `Diterima` → `Diproses` → `Siap` → `Selesai`
- Notifikasi push (jika izin browser diberikan)

---

### 5.2 Modul Dapur (Kitchen Display System / KDS)

#### F-06: Dashboard Dapur
- Tampilan antrian pesanan real-time
- Setiap tiket pesanan menampilkan: nomor meja, item pesanan, catatan khusus, waktu masuk
- Prioritas berdasarkan waktu pesanan (FIFO)
- Tombol konfirmasi: "Mulai Proses" dan "Selesai"
- Alert visual/audio untuk pesanan baru

---

### 5.3 Modul Kasir (Cashier POS)

#### F-11: Point of Sale (POS) Kasir
- Login kasir terpisah (`/cashier/login`) menggunakan username + password
- Hanya user dengan role `cashier` atau `admin` yang dapat mengakses
- Tampilan 2 kolom (desktop-optimized):
  - **Kolom Kiri**: Pemilihan meja, input nama/telepon pelanggan, kategori menu, grid menu dengan quick-add
  - **Kolom Kanan**: Keranjang belanja, catatan dapur, ringkasan harga (subtotal + pajak), metode pembayaran, tombol submit
- Pesanan dikirim ke endpoint yang sama (`POST /api/orders`) dan langsung muncul di KDS
- Modal konfirmasi setelah pesanan berhasil dengan nomor order
- Reset otomatis untuk input pesanan baru
- Akses URL: `/cashier`

---

### 5.4 Modul Admin & Manajemen

#### F-07: Dashboard Admin
- Overview real-time: pesanan aktif, total pendapatan hari ini, meja yang terisi
- Manajemen menu (CRUD: tambah, edit, hapus, nonaktifkan item)
- Manajemen meja (tambah meja, generate QR code)
- Manajemen kategori menu

#### F-08: Manajemen Pesanan
- Daftar semua pesanan dengan filter status dan tanggal
- Detail per pesanan
- Override status pesanan (untuk kasus khusus)

#### F-09: Laporan & Analitik
- Laporan penjualan harian, mingguan, bulanan
- Item terlaris / terbawah
- Revenue breakdown per metode pembayaran
- Export laporan ke PDF / Excel

#### F-10: Manajemen Staff & Role
- Role: `Super Admin`, `Manajer`, `Kasir`, `Dapur`, `Waiter`
- Akses berbeda per role
- Log aktivitas staff

---

## 6. Arsitektur Teknis

### 6.1 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend (Customer)** | React 18 + Vite, Tailwind CSS, React Query |
| **Frontend (Admin/KDS)** | React 18 + Vite, Tailwind CSS, Recharts (grafik) |
| **Backend API** | Node.js + Express.js (REST API) |
| **Database** | MySQL 8.x |
| **ORM** | Prisma ORM |
| **Real-time** | Socket.io (WebSocket untuk KDS & status pesanan) |
| **Payment Gateway** | Midtrans (Snap API) |
| **QR Code Generator** | `qrcode` npm package |
| **Authentication** | JWT (JSON Web Token) + Refresh Token |
| **File Storage** | Local Storage / AWS S3 (untuk foto menu) |
| **Hosting** | VPS (Ubuntu) / Railway / Render |

### 6.2 Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                      │
│  ┌─────────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Customer PWA   │  │ Admin    │  │  Kitchen KDS  │  │
│  │  (React + QR)   │  │ Dashboard│  │  (React)      │  │
│  └────────┬────────┘  └────┬─────┘  └──────┬────────┘  │
└───────────┼───────────────┼────────────────┼────────────┘
            │               │                │
            └───────────────┴────────────────┘
                            │ HTTPS / WSS
┌───────────────────────────┼────────────────────────────┐
│                    API LAYER (Node.js)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Express.js REST API + Socket.io         │  │
│  │  /api/menu  /api/orders  /api/tables  /api/auth   │  │
│  └──────────────────┬───────────────────────────────┘  │
└─────────────────────┼──────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
┌───────▼──────┐          ┌─────────▼────────┐
│  MySQL 8.x   │          │ Midtrans API      │
│  Database    │          │ (Payment Gateway) │
└──────────────┘          └──────────────────┘
```

### 6.3 Skema Database (ERD — High Level)

```
users          tables         categories
────────       ────────       ────────────
id             id             id
name           table_number   name
email          qr_code_url    description
password       status         created_at
role           capacity
created_at     created_at

menu_items              orders
────────────────        ─────────────────
id                      id
category_id (FK)        table_id (FK)
name                    user_id (FK, optional)
description             status [pending|processing|ready|done|cancelled]
price                   total_amount
image_url               payment_status [unpaid|paid]
is_available            payment_method
is_featured             payment_token (Midtrans)
created_at              notes
                        created_at

order_items             payments
────────────            ────────────────
id                      id
order_id (FK)           order_id (FK)
menu_item_id (FK)       amount
quantity                method
notes                   status
unit_price              midtrans_transaction_id
subtotal                paid_at
                        created_at
```

---

## 7. Alur Pengguna (User Flows)

### 7.1 Alur Pemesanan Pelanggan

```
1. Pelanggan duduk di meja
2. Scan QR Code → Browser otomatis buka URL: cafe.app/menu?table=5
3. Halaman menu tampil dengan nomor meja teridentifikasi
4. Pelanggan browse & pilih menu
5. Tambah ke keranjang (+ catatan khusus jika perlu)
6. Review keranjang → Klik "Pesan Sekarang"
7. Pilih metode pembayaran
   ├── Jika cashless → Midtrans payment page → Bayar → Konfirmasi
   └── Jika cash → "Bayar di Kasir" → Pesanan langsung masuk
8. Pesanan masuk ke sistem → Notifikasi ke dapur
9. Pelanggan dapat track status di halaman yang sama
10. Makanan datang → Status "Selesai"
```

### 7.2 Alur Dapur (KDS)

```
1. Pesanan baru masuk → Bunyi notifikasi + tiket muncul di KDS
2. Chef klik "Mulai Proses" → Status berubah ke "Diproses"
3. Makanan selesai → Chef klik "Selesai" → Status "Siap Diantar"
4. Waiter antar makanan → Klik "Sudah Diantar" (opsional)
```

### 7.3 Alur Pembayaran

```
Pelanggan pilih metode bayar
        │
        ├── QRIS / E-Wallet / Kartu
        │       ↓
        │   Midtrans Snap terbuka
        │       ↓
        │   Pelanggan bayar
        │       ↓
        │   Midtrans webhook → Backend update status
        │       ↓
        │   Receipt tampil di layar pelanggan
        │
        └── Bayar di Kasir
                ↓
            Pesanan masuk, status pembayaran "Pending"
                ↓
            Kasir terima pembayaran manual
                ↓
            Kasir update status di dashboard → "Lunas"
```

---

## 8. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan |
|----------|-----------|
| **Performa** | Halaman menu load < 2 detik |
| **Availability** | Uptime ≥ 99.5% saat jam operasional |
| **Keamanan** | HTTPS, JWT Auth, Input validation, SQL injection prevention |
| **Skalabilitas** | Mendukung hingga 50 meja secara bersamaan |
| **Responsivitas** | Mobile-first design, kompatibel iOS & Android browser |
| **Offline Handling** | Tampilkan pesan error jika koneksi putus saat checkout |
| **Browser Support** | Chrome, Safari, Firefox (3 versi terakhir) |

---

## 9. Milestone & Roadmap

### Phase 1 — MVP (Bulan 1–2)
- [ ] Setup proyek React + Node.js + MySQL
- [ ] Modul manajemen meja & QR code generator
- [ ] Menu digital (tampilan & CRUD admin)
- [ ] Sistem pemesanan dasar (keranjang → submit)
- [ ] Kitchen Display System (KDS) sederhana
- [ ] Payment: Bayar di Kasir (cash)

### Phase 2 — Payment Integration (Bulan 2–3)
- [ ] Integrasi Midtrans (QRIS, VA, E-Wallet)
- [ ] Webhook handler & konfirmasi pembayaran otomatis
- [ ] Receipt digital
- [ ] Status pesanan real-time (Socket.io)

### Phase 3 — Dashboard & Analytics (Bulan 3–4)
- [ ] Dashboard admin lengkap
- [ ] Laporan penjualan & export
- [ ] Manajemen role & staff
- [ ] Notifikasi push (opsional)

### Phase 4 — Enhancement (Bulan 4+)
- [ ] Loyalty program / poin pelanggan
- [ ] Integrasi printer struk thermal
- [ ] Multiple branch support
- [ ] Mobile app native (React Native)

---

## 10. Kriteria Penerimaan (Acceptance Criteria)

| Fitur | Kriteria Sukses |
|-------|----------------|
| QR Code | Scan QR → menu tampil dalam < 3 detik, nomor meja terdeteksi benar |
| Pemesanan | Pesanan tersimpan di DB dan muncul di KDS dalam < 5 detik |
| Payment Gateway | Pembayaran berhasil/gagal terkonfirmasi otomatis via webhook |
| Admin Dashboard | Menu baru yang ditambahkan langsung tampil di customer app |
| Laporan | Laporan harian dapat diexport dalam format PDF/Excel |
| KDS | Pesanan baru memicu notifikasi audio/visual di dapur |

---

## 11. Risiko & Mitigasi

| Risiko | Probabilitas | Dampak | Mitigasi |
|--------|-------------|--------|---------|
| Koneksi internet tidak stabil di cafe | Tinggi | Tinggi | Mode offline sederhana, fallback ke pemesanan manual |
| Midtrans downtime | Rendah | Tinggi | Selalu sediakan opsi "Bayar di Kasir" |
| Pelanggan tidak familiar dengan QR code | Sedang | Sedang | Panduan singkat di meja, staff siap membantu |
| Keamanan data pembayaran | Rendah | Tinggi | Gunakan Midtrans (PCI-DSS compliant), tidak simpan data kartu |

---

## 12. Open Questions (Perlu Dikonfirmasi)

> [!IMPORTANT]
> Pertanyaan berikut perlu dijawab sebelum pengembangan dimulai:

1. **Berapa jumlah meja** yang perlu didukung saat ini?
2. **Apakah ada sistem kasir (POS)** yang sudah ada dan perlu diintegrasikan?
3. **Nama merchant Midtrans** sudah terdaftar atau perlu didaftarkan baru?
4. **Apakah perlu fitur reservasi meja** atau hanya walk-in?
5. **Apakah menu multi-bahasa** (Indonesia + Inggris) diperlukan?
6. **Apakah pelanggan perlu login/registrasi** atau bisa langsung pesan (guest mode)?
7. **Printer struk thermal** — apakah akan diintegrasikan di Phase 1 atau nanti?
8. **Domain & hosting** — sudah ada preferensi provider hosting?

---

## 13. Referensi & Inspirasi

- Sistem serupa: GoFood (merchant dashboard), Moka POS, Moselo
- Payment: [Midtrans Documentation](https://docs.midtrans.com/)
- QR Standard: [QRIS Bank Indonesia](https://www.bi.go.id/id/sistem-pembayaran/qris/)
