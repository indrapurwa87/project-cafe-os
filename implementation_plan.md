# 🧾 Halaman Kasir (Cashier POS) — CaféOS

Menambahkan modul kasir baru agar staff di counter bisa membuat pesanan secara manual. Fitur ini melengkapi alur pemesanan self-service (QR code) yang sudah ada, untuk kasus di mana pelanggan langsung memesan di kasir tanpa scan QR.

## User Review Required

> [!IMPORTANT]
> **Modul baru `cashier`** akan dibuat sebagai app terpisah di `frontend/src/apps/cashier/`, bukan di dalam admin panel. Ini agar kasir punya tampilan yang lebih ringkas dan fokus untuk alur pemesanan cepat, tanpa akses ke manajemen menu/laporan/user.

> [!NOTE]
> **Login kasir**: Kasir akan login menggunakan **username + password** (mirip admin login), tetapi hanya user dengan role `cashier` atau `admin` yang bisa masuk. Ini berarti perlu menambahkan user baru dengan role `cashier` di menu User Management admin.

---

## Proposed Changes

### 1. Frontend — Modul Kasir

#### [NEW] `frontend/src/apps/cashier/pages/CashierLoginPage.jsx`
Halaman login kasir dengan username + password. UI mirip admin login tetapi dengan branding "CaféOS Kasir". Hanya menerima role `cashier` atau `admin`.

#### [NEW] `frontend/src/apps/cashier/pages/CashierPOSPage.jsx`
Halaman utama POS (Point of Sale) kasir. Layout desktop-friendly (landscape) dengan 2 kolom:

**Kolom Kiri — Menu Browser (≈60%)**
- Dropdown/selector pemilihan meja (dari data `tables` API)
- Input nama pelanggan & nomor telepon
- Tab kategori menu (menggunakan data dari API `/menu/categories`)
- Grid menu items (dari API `/menu`) dengan tombol quick-add
- Search bar untuk cari menu cepat

**Kolom Kanan — Keranjang & Checkout (≈40%)**
- Daftar item yang dipilih dengan +/- qty dan tombol hapus
- Catatan dapur (kitchen note)
- Ringkasan harga: subtotal, pajak (10%), total
- Pilihan metode pembayaran (Cash / QRIS / E-Wallet)
- Tombol "Buat Pesanan" yang submit ke `POST /api/orders`
- Setelah sukses: tampilkan modal konfirmasi dengan nomor order, lalu reset form

#### [NEW] `frontend/src/apps/cashier/components/CashierGuard.jsx`
Auth guard yang mengecek token & role (`cashier` atau `admin`) di `localStorage`. Redirect ke `/cashier/login` jika belum login.

#### [NEW] `frontend/src/apps/cashier/hooks/useCashierCart.js`
Zustand store lokal untuk keranjang kasir (terpisah dari `useCartStore` customer). Berisi: items, addItem, removeItem, updateQty, kitchenNote, subtotal, tax, total, clearCart.

---

### 2. Routing

#### [MODIFY] [App.jsx](file:///d:/Development/project_cafe/frontend/src/App.jsx)
Tambahkan route baru:
```
/cashier/login  → CashierLoginPage
/cashier        → CashierGuard > CashierPOSPage
```

---

### 3. Backend

#### [MODIFY] [auth.routes.js](file:///d:/Development/project_cafe/backend/src/routes/auth.routes.js)
Tambahkan endpoint `POST /api/auth/login/cashier` yang menerima `username` + `password`, memvalidasi dari tabel `users` dengan role `cashier` or `admin`, dan mengembalikan JWT token.

**Tidak perlu ubah `order.routes.js`** — endpoint `POST /api/orders` yang ada sudah cukup untuk menerima pesanan dari kasir (sama persis dengan dari customer). Pesanan dari kasir dikirim dengan data yang sama: `table_id`, `customer_name`, `customer_phone`, `items`, `kitchen_note`, `total_amount`, `payment_method`.

---

### 4. Dokumen PRD & Navigasi

#### [MODIFY] [PRD_CafeApp.md](file:///C:/Users/indra/.gemini/antigravity-ide/brain/7717e64d-90cb-43f6-a599-889b1d237152/PRD_CafeApp.md)
Tambahkan:
- **Persona Kasir** di bagian User Personas
- **F-11: Modul Kasir (Cashier POS)** di bagian Scope & Fitur
- Update arsitektur diagram untuk menyertakan Cashier app

#### [MODIFY] [UIUX_Navigation.md](file:///C:/Users/indra/.gemini/antigravity-ide/brain/7717e64d-90cb-43f6-a599-889b1d237152/UIUX_Navigation.md)
Tambahkan alur navigasi kasir:
```
/cashier/login → /cashier (POS Page)
```

---

## Ringkasan File

| Status | File | Deskripsi |
|--------|------|-----------|
| 🆕 NEW | `cashier/pages/CashierLoginPage.jsx` | Login kasir (username + password) |
| 🆕 NEW | `cashier/pages/CashierPOSPage.jsx` | Halaman POS utama (2 kolom) |
| 🆕 NEW | `cashier/components/CashierGuard.jsx` | Auth guard untuk kasir |
| 🆕 NEW | `cashier/hooks/useCashierCart.js` | Zustand store keranjang kasir |
| ✏️ MODIFY | `App.jsx` | Tambah route `/cashier/*` |
| ✏️ MODIFY | `auth.routes.js` | Tambah endpoint login kasir |
| ✏️ MODIFY | `PRD_CafeApp.md` | Tambah persona & fitur kasir |
| ✏️ MODIFY | `UIUX_Navigation.md` | Tambah alur navigasi kasir |

---

## Verification Plan

### Manual Verification
1. Buat user `cashier` role `cashier` via admin User Management
2. Login di `/cashier/login` dengan user tersebut
3. Pilih meja, isi nama pelanggan, tambah menu ke keranjang
4. Submit pesanan → verifikasi order muncul di:
   - Admin panel > Pesanan
   - Kitchen Display System (KDS)
5. Verifikasi pesanan masuk ke database MySQL (`orders` + `order_items`)
