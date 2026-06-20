# Walkthrough: Implementasi Halaman Kasir & Manajemen User Cashier — CaféOS

Kami telah berhasil mengimplementasikan Modul Kasir (Cashier POS) beserta dengan penambahan role Cashier pada dashboard admin CaféOS.

## Fitur Baru & Perubahan yang Dilakukan

### 1. Backend Updates
- **`user.routes.js`**: Menambahkan role `'cashier'` ke dalam daftar role yang diperbolehkan saat pembuatan user baru di database (`admin`, `kitchen`, `cashier`).
- **`auth.routes.js`**: Menambahkan endpoint `/login/cashier` yang dapat memvalidasi kredensial login user dengan role `'cashier'` atau `'admin'` dan mengembalikan token JWT.

### 2. Admin Dashboard — Manajemen User Kasir
- **`UsersPage.jsx`**:
  - Menambahkan role `'cashier'` (Kasir) ke dalam konfigurasi visual `ROLE_CONFIG` dengan ikon `Receipt` dan skema warna hijau emerald.
  - Memperbarui statistik info card menjadi 3 kolom (Admin, Dapur, Kasir) untuk memantau jumlah staf per role.
  - Menyediakan opsi radio button baru "Kasir" di dalam modal form Tambah User Baru beserta penjelasan deskripsi aksesnya.
  - Menghubungkan input placeholder & validasi panjang password/PIN untuk staf kasir baru.

### 3. Modul Kasir (Cashier POS)
- **`CashierLoginPage.jsx`**: Halaman login khusus kasir (`/cashier/login`) menggunakan kombinasi username dan password, dengan warna tema hijau emerald.
- **`CashierPOSPage.jsx`**: Halaman Point of Sale (POS) kasir berpenampilan premium (2 kolom layout) untuk input pemesanan manual di meja kasir.
- **`CashierGuard.jsx`**: Menjaga halaman `/cashier` agar hanya dapat diakses oleh user yang telah terautentikasi dengan role `cashier` atau `admin`.
- **`useCashierCart.js`**: Zustand store lokal yang memanajemen keranjang belanja kasir secara terpisah dari keranjang pelanggan.

---

## Cara Verifikasi & Hasil Pengujian

1. **Membuat Akun Kasir via Admin**:
   - Login ke Admin Dashboard (`/admin/login`).
   - Masuk ke menu **Manajemen User** di sidebar.
   - Klik **Tambah User**, pilih role **Kasir**, masukkan username `kasir01`, password `kasir123`, lalu klik **Buat User**.
   - User baru bermunculan di tabel dengan badge hijau **Kasir**.

2. **Login & Akses Kasir POS**:
   - Navigasi ke `/cashier/login`.
   - Login dengan username `kasir01` dan password `kasir123`.
   - Berhasil login dan diarahkan ke dashboard POS `/cashier`.
   - Nama pengguna `kasir01` tampil di pojok kanan atas POS.
