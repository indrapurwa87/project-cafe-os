# 🎨 UI/UX & Navigation Design
# CaféOS — Frontend Specification

**Versi:** 1.0  
**Tanggal:** 18 Juni 2026  
**Scope:** 3 Aplikasi — Customer PWA · Kitchen Display · Admin Dashboard

---

## 1. Design System

### 1.1 Color Palette

#### Brand Colors
| Token | Hex | Penggunaan |
|-------|-----|-----------|
| `--brand-primary` | `#F59E0B` (Amber 400) | CTA utama, highlight, badge aktif |
| `--brand-secondary` | `#D97706` (Amber 600) | Hover state, gradient |
| `--brand-glow` | `#FCD34D` (Amber 300) | Glow effect, icon accent |

#### Background (Dark Theme)
| Token | Hex | Penggunaan |
|-------|-----|-----------|
| `--bg-base` | `#0F0F1A` | Background utama |
| `--bg-surface` | `#1A1A2E` | Card, panel |
| `--bg-elevated` | `#242438` | Modal, dropdown, input |
| `--bg-overlay` | `rgba(15,15,26,0.85)` | Backdrop blur overlay |

#### Text
| Token | Hex | Penggunaan |
|-------|-----|-----------|
| `--text-primary` | `#F8FAFC` | Judul, konten utama |
| `--text-secondary` | `#94A3B8` | Label, deskripsi, placeholder |
| `--text-muted` | `#475569` | Disabled, watermark |

#### Semantic Colors
| Token | Hex | Penggunaan |
|-------|-----|-----------|
| `--success` | `#10B981` | Status selesai, paid |
| `--warning` | `#F59E0B` | Proses, pending |
| `--danger` | `#EF4444` | Error, habis, cancel |
| `--info` | `#3B82F6` | Info, sedang diproses |

### 1.2 Typography

```
Font Family:
  Heading  → "Plus Jakarta Sans" (Google Fonts) — Bold, clean, modern
  Body     → "Inter" (Google Fonts) — Readable, neutral
  Mono     → "JetBrains Mono" — Harga, kode pesanan

Scale (rem-based, 16px base):
  --text-xs    : 0.75rem  (12px)  → Badge, timestamp
  --text-sm    : 0.875rem (14px)  → Label, deskripsi pendek
  --text-base  : 1rem     (16px)  → Body text
  --text-lg    : 1.125rem (18px)  → Subtitle
  --text-xl    : 1.25rem  (20px)  → Section header
  --text-2xl   : 1.5rem   (24px)  → Page title
  --text-3xl   : 1.875rem (30px)  → Hero number, table number di KDS
  --text-4xl   : 2.25rem  (36px)  → Splash/landing besar

Weight:
  400 → Regular (body)
  500 → Medium (label, nav)
  600 → Semibold (card title, button)
  700 → Bold (heading)
  800 → Extrabold (KDS table number, harga besar)
```

### 1.3 Spacing & Border

```
Spacing scale (4px base):
  --space-1: 4px   --space-2: 8px   --space-3: 12px
  --space-4: 16px  --space-5: 20px  --space-6: 24px
  --space-8: 32px  --space-10: 40px --space-12: 48px

Border radius:
  --radius-sm  : 6px   → Input, badge kecil
  --radius-md  : 12px  → Card, button
  --radius-lg  : 16px  → Modal, bottom sheet
  --radius-xl  : 24px  → Floating button, chip
  --radius-full: 9999px → Pill, avatar

Shadows:
  --shadow-card   : 0 4px 24px rgba(0,0,0,0.4)
  --shadow-elevated: 0 8px 40px rgba(0,0,0,0.6)
  --shadow-glow   : 0 0 20px rgba(245,158,11,0.3)  ← Amber glow
```

### 1.4 Komponen UI Utama

| Komponen | Deskripsi |
|---------|-----------|
| `MenuCard` | Card menu dengan foto, nama, harga, tombol tambah |
| `CategoryChip` | Pill scrollable untuk filter kategori |
| `CartFAB` | Floating Action Button keranjang di bawah layar |
| `OrderTicket` | Card pesanan di KDS, color-coded by status |
| `StatusStepper` | Progress tracker pesanan pelanggan |
| `PaymentMethodCard` | Kartu pilihan metode pembayaran dengan logo |
| `StatCard` | Kartu statistik di admin dashboard |
| `SidebarNav` | Navigasi sidebar admin dengan icon |
| `Toast` | Notifikasi pop-up sukses/gagal/info |
| `BottomSheet` | Detail item, konfirmasi, dll (mobile) |

---

## 2. Sitemap & Navigasi

### 2.1 Overview — 3 Aplikasi

```
CaféOS
├── 🛒 CUSTOMER PWA         → cafe.app/menu?table=5
├── 👨‍🍳 KITCHEN DISPLAY      → cafe.app/kitchen
└── ⚙️  ADMIN DASHBOARD     → cafe.app/admin
```

---

## 3. Customer PWA — Navigation Map

### 3.1 Sitemap

```
/ (root — redirect berdasarkan QR)
└── /menu?table={id}
    ├── [SCREEN 1] Splash / Table Detected
    ├── [SCREEN 2] Menu Browser (Home)
    │   └── /menu/item/{id} → Bottom Sheet Detail
    ├── [SCREEN 3] Cart & Checkout
    │   ├── /checkout/payment → Pilih Metode Bayar
    │   └── /checkout/midtrans → Midtrans Snap (iframe/redirect)
    └── [SCREEN 4] Order Status
        └── /order/{orderId}/status
```

### 3.2 Screen-by-Screen Detail

#### SCREEN 1 — Splash / Welcome
```
┌─────────────────────────────┐
│   🍵  BrewHouse Cafe        │
│                             │
│   ✓ Table 5 Detected        │
│                             │
│   [ Lihat Menu →  ]         │
└─────────────────────────────┘
```
- **Trigger:** QR Code scan, URL `?table=5`
- **Durasi:** 1.5 detik otomatis lanjut, atau tap langsung
- **Konten:** Logo cafe + animasi masuk + nomor meja confirmed
- **Transisi:** Fade-in → slide up ke Menu Screen

---

#### SCREEN 2 — Menu Browser (Main Screen)
```
┌─────────────────────────────┐
│ ☰  BrewHouse    [Table 5] ▾ │  ← Header sticky
├─────────────────────────────┤
│ 🔍 Cari menu...             │  ← Search bar
├─────────────────────────────┤
│ [Semua][Makanan][Minuman]   │  ← Category tabs (scroll horizontal)
│ [Camilan][Dessert]          │
├─────────────────────────────┤
│ 🔥 Populer Hari Ini         │  ← Section header
│ ┌──────┐ ┌──────┐          │
│ │ 📷   │ │ 📷   │          │  ← Menu card grid (2 kolom)
│ │Nasi  │ │Kopi  │          │
│ │Goreng│ │Susu  │          │
│ │35rb  │ │28rb  │          │
│ │  [+] │ │  [+] │          │
│ └──────┘ └──────┘          │
│                             │
│ ☕ Minuman                  │
│ ┌──────┐ ┌──────┐          │
│ │ 📷   │ │ 📷   │          │
│ └──────┘ └──────┘          │
├─────────────────────────────┤
│ 🛒  2 item  •  Rp 85.000 → │  ← Floating cart bar (sticky bottom)
└─────────────────────────────┘
```

**Navigasi & Interaksi:**
- Tap menu card → buka **Bottom Sheet Detail Item**
- Tap `[+]` langsung → tambah ke keranjang (tanpa buka detail), toast muncul
- Tap kategori tab → scroll ke section atau filter
- Tap search → keyboard muncul, filter real-time
- Tap cart bar → navigasi ke **Cart Screen**
- Kategori tab: `sticky` saat scroll ke bawah
- Pull-to-refresh untuk update ketersediaan menu

**Bottom Sheet — Detail Item:**
```
┌─────────────────────────────┐
│ ────────── (drag handle)    │
│                             │
│ [    Foto Besar Menu    ]   │
│                             │
│ Nasi Goreng Spesial  [PEDAS]│
│ Rp 35.000                   │
│                             │
│ Nasi goreng dengan telur,   │
│ ayam suwir, dan sambal...   │
│                             │
│ Catatan khusus:             │
│ ┌─────────────────────────┐ │
│ │ mis: tanpa bawang...    │ │
│ └─────────────────────────┘ │
│                             │
│ Qty: [ - ] [ 1 ] [ + ]      │
│                             │
│ [ Tambah ke Keranjang 35rb ]│
└─────────────────────────────┘
```

---

#### SCREEN 3 — Cart & Checkout

**3a. Review Cart**
```
┌─────────────────────────────┐
│ ← Pesanan Kamu   Table 5   │
├─────────────────────────────┤
│ Nasi Goreng Spesial         │
│ [Tanpa bawang]              │
│ [ - ] 1 [ + ]   Rp 35.000  │
│ ─────────────────────────── │
│ Kopi Susu Gula Aren         │
│ [ - ] 2 [ + ]   Rp 56.000  │
├─────────────────────────────┤
│ Catatan untuk dapur:        │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ Subtotal          Rp 91.000 │
│ Pajak (10%)        Rp 9.100 │
│ ─────────────────────────── │
│ Total            Rp 100.100 │
├─────────────────────────────┤
│ [ Pilih Cara Bayar →      ] │
└─────────────────────────────┘
```

**3b. Pilih Metode Pembayaran**
```
┌─────────────────────────────┐
│ ← Metode Pembayaran         │
├─────────────────────────────┤
│ ◉ QRIS           [logo]    │  ← Direkomendasikan
│ ○ GoPay          [logo]    │
│ ○ OVO            [logo]    │
│ ○ Dana           [logo]    │
│ ○ ShopeePay      [logo]    │
│ ─────────────────────────── │
│ ○ Virtual Account BCA      │
│ ○ Virtual Account BNI      │
│ ─────────────────────────── │
│ ○ Kartu Kredit/Debit       │
│ ─────────────────────────── │
│ ○ Bayar di Kasir (Cash)    │
├─────────────────────────────┤
│ [ Bayar Sekarang Rp100.100]│  ← Amber gradient button
└─────────────────────────────┘
```

---

#### SCREEN 4 — Order Status & Tracking
```
┌─────────────────────────────┐
│         ✅ Pesanan Masuk!   │
│         Order #1042         │
│         Table 5             │
├─────────────────────────────┤
│   Estimasi: ~8 menit        │
│                             │
│  ● Pesanan Diterima    ✓   │  ← Step 1 (done, green)
│  │                          │
│  ●⟳ Sedang Dimasak...      │  ← Step 2 (active, pulsing)
│  │  Chef sedang menyiapkan  │
│  │                          │
│  ○ Siap Disajikan           │  ← Step 3 (upcoming)
│  │                          │
│  ○ Selesai                  │  ← Step 4 (upcoming)
├─────────────────────────────┤
│ ▼ Detail Pesanan            │  ← Collapsible
│   Nasi Goreng x1            │
│   Kopi Susu x2              │
├─────────────────────────────┤
│ [ + Tambah Pesanan Lagi ]   │  ← Kembali ke menu
└─────────────────────────────┘
```
- Status **polling setiap 10 detik** atau via **WebSocket push**
- Saat status berubah: animasi transisi step + haptic feedback (jika mobile)

---

## 4. Kitchen Display System — Navigation

### 4.1 Sitemap
```
/kitchen
├── [SCREEN 1] Login KDS (PIN sederhana)
└── [SCREEN 2] Order Queue Dashboard
    └── Order Ticket Card (inline, no navigation)
```

### 4.2 Screen Detail — KDS Dashboard

**Layout: Grid responsive (tablet landscape)**
```
┌──────────────────────────────────────────────────────┐
│ 👨‍🍳 Kitchen Display   22:10  🔔 3 pesanan baru   [⚙️]│  ← Header sticky
├──────────────────────────────────────────────────────┤
│  [🔴 BARU (3)]    [🔵 PROSES (2)]    [🟢 SIAP (1)]  │  ← Tab filter
├────────────┬───────────────┬───────────────┬──────────┤
│ MEJA 3     │ MEJA 7        │ MEJA 1        │ MEJA 12  │
│ #1041      │ #1042         │ #1038         │ #1043    │
│ 🕐 2 mnt   │ 🕐 8 mnt     │ 🕐 15 mnt    │ 🕐 1 mnt │
│ ────────── │ ────────────  │ ────────────  │ ──────── │
│ • Nasi Grg │ • Kopi Susu  │ • Pasta       │ • Jus    │
│   x1       │   x2         │   x1          │   Alpukat│
│ • Es Teh   │ • Roti Bakar │ ⚠ tanpa keju  │   x1     │
│   x2       │   x1         │               │          │
│            │ ⚠ Extra hot  │               │          │
│ ────────── │ ──────────── │ ────────────  │ ──────── │
│[🟠 MULAI ] │[🔵 PROSES.. ]│[🟢 SIAP ✓  ] │[🟠 MULAI]│
└────────────┴───────────────┴───────────────┴──────────┘
```

**Behavior:**
- Pesanan baru: card muncul dengan animasi slide-in dari kiri + suara notifikasi
- Timer berjalan otomatis, berubah warna merah jika > 15 menit
- Klik `MULAI` → status berubah jadi `PROSES`, warna card berubah biru
- Klik `SIAP` → card pindah ke kolom siap, notifikasi ke waiter
- Pesanan `SELESAI` (setelah diantar) → card hilang dengan animasi

---

## 5. Admin Dashboard — Navigation

### 5.1 Sitemap
```
/admin/login
└── /admin (Dashboard Home)
    ├── /admin/orders         → Manajemen Pesanan
    │   └── /admin/orders/:id → Detail Pesanan
    ├── /admin/menu           → Manajemen Menu
    │   ├── /admin/menu/new   → Tambah Item
    │   └── /admin/menu/:id   → Edit Item
    ├── /admin/categories     → Manajemen Kategori
    ├── /admin/tables         → Manajemen Meja & QR Code
    ├── /admin/payments       → Riwayat Pembayaran
    ├── /admin/reports        → Laporan & Analitik
    └── /admin/settings       → Pengaturan & Staff
```

### 5.2 Layout Admin

**Persistent Layout (semua halaman admin):**
```
┌──────────────────────────────────────────────────────┐
│ [≡] BrewHouse Admin    🔔  👤 Admin ▾               │ ← Top bar
├───────────┬──────────────────────────────────────────┤
│           │                                          │
│ 📊 Dashboard         MAIN CONTENT AREA              │
│ 📋 Orders                                           │
│ 🍽️ Menu               (berubah per halaman)          │
│ 🏷️ Categories                                        │
│ 🪑 Tables                                            │
│ 💳 Payments                                          │
│ 📈 Reports                                           │
│ ⚙️  Settings                                         │
│           │                                          │
│           │                                          │
└───────────┴──────────────────────────────────────────┘
  Sidebar      Content (80% lebar)
  (240px)
```

### 5.3 Halaman Admin — Detail

#### /admin — Dashboard Home
```
Stat Cards (row):
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│Revenue   │ │Orders    │ │Active    │ │Avg Order │
│Rp 2.4jt  │ │47        │ │Meja: 8   │ │Rp 51rb   │
│↑ +12%    │ │↑ +5%     │ │/12 total │ │↑ +3%     │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

Row 2:
┌───────────────────────┐  ┌─────────────────────┐
│ Grafik Revenue Hari   │  │ Pesanan Terbaru      │
│ Ini (per jam)         │  │ (live update)        │
│ [Line Chart]          │  │ #1042 Meja7 Rp100rb  │
│                       │  │ [PROSES]             │
│                       │  │ #1041 Meja3 Rp 63rb  │
│                       │  │ [BARU]               │
└───────────────────────┘  └─────────────────────┘

Row 3:
┌───────────────────────┐  ┌─────────────────────┐
│ Menu Terlaris (Top 5) │  │ Status Meja (Grid)   │
│ Bar chart horizontal  │  │ Hijau=Tersedia       │
│                       │  │ Merah=Terisi         │
└───────────────────────┘  └─────────────────────┘
```

#### /admin/menu — Manajemen Menu
- **Table view** dengan kolom: Foto, Nama, Kategori, Harga, Status (toggle), Aksi
- **Search & filter** by kategori dan status
- Tombol `+ Tambah Menu` → form modal/halaman baru
- **Drag-and-drop** reorder urutan tampilan menu
- Toggle cepat "Habis/Tersedia" langsung dari tabel

#### /admin/tables — Manajemen Meja & QR Code
```
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│  1  │ │  2  │ │  3  │ │  4  │  ← Grid meja
│🟢   │ │🔴   │ │🟢   │ │🔴   │
│     │ │Terisi│ │     │ │Terisi│
│[QR] │ │[QR] │ │[QR] │ │[QR] │  ← Tombol download QR
└─────┘ └─────┘ └─────┘ └─────┘
```
- Setiap meja punya tombol **Download QR** (PNG/PDF siap cetak)
- **Regenerate QR** jika QR lama hilang/rusak
- Tambah/hapus meja
- Set kapasitas per meja

---

## 6. UX Principles & Guidelines

### 6.1 Mobile-First
- Customer PWA dirancang untuk layar **360px – 430px**
- Touch target minimum **44×44px**
- Semua aksi penting menggunakan **bottom-sheet** bukan modal penuh
- Gunakan **swipe gesture** untuk kembali / dismiss

### 6.2 Micro-Animations
| Elemen | Animasi |
|--------|---------|
| Tambah ke keranjang | Item "fly" ke cart FAB |
| Cart FAB | Bounce + scale saat item bertambah |
| Status step | Pulsing dot + fade-in check |
| KDS card baru | Slide-in dari atas + glow border |
| Tab active | Underline slide smooth |
| Page transition | Shared element transition (menu → detail) |
| Button press | Scale-down 0.95 + ripple |
| Toast | Slide-up dari bawah, auto-dismiss 3 detik |

### 6.3 States yang Harus Di-handle
- **Empty state** — Keranjang kosong, menu tidak ditemukan
- **Loading state** — Skeleton loader (bukan spinner polos)
- **Error state** — Koneksi putus, pembayaran gagal
- **Success state** — Animasi konfirmasi yang memuaskan
- **Offline state** — Banner peringatan + disable checkout

### 6.4 Aksesibilitas
- Contrast ratio minimum **4.5:1** untuk text
- Semua interactive element punya `aria-label`
- Support pinch-to-zoom di mobile
- Font minimum 14px untuk body text

---

## 7. Responsive Breakpoints

| Breakpoint | Lebar | Target Perangkat |
|------------|-------|-----------------|
| `mobile` | < 640px | Customer (smartphone) |
| `tablet` | 640px – 1024px | KDS (tablet landscape) |
| `desktop` | > 1024px | Admin (laptop/monitor) |

**Grid Menu:**
- Mobile: 2 kolom
- Tablet: 3 kolom
- Desktop: 4 kolom

---

## 8. Visual Mockups

### Customer — Menu Screen
![Customer Menu Screen](C:\Users\indra\.gemini\antigravity-ide\brain\7717e64d-90cb-43f6-a599-889b1d237152\customer_menu_screen_1781795193679.png)

### Customer — Cart & Checkout
![Cart & Checkout Screen](C:\Users\indra\.gemini\antigravity-ide\brain\7717e64d-90cb-43f6-a599-889b1d237152\cart_checkout_screen_1781795240666.png)

### Customer — Order Status Tracker
![Order Status Screen](C:\Users\indra\.gemini\antigravity-ide\brain\7717e64d-90cb-43f6-a599-889b1d237152\order_status_screen_1781795251834.png)

### Kitchen Display System (KDS)
![Kitchen Display](C:\Users\indra\.gemini\antigravity-ide\brain\7717e64d-90cb-43f6-a599-889b1d237152\kitchen_display_screen_1781795206347.png)

### Admin Dashboard
![Admin Dashboard](C:\Users\indra\.gemini\antigravity-ide\brain\7717e64d-90cb-43f6-a599-889b1d237152\admin_dashboard_screen_1781795219239.png)

---

## 9. Struktur Folder React

```
src/
├── apps/
│   ├── customer/          ← Customer PWA
│   │   ├── pages/
│   │   │   ├── SplashPage.jsx
│   │   │   ├── MenuPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   └── OrderStatusPage.jsx
│   │   └── components/
│   │       ├── MenuCard.jsx
│   │       ├── CategoryTabs.jsx
│   │       ├── CartFAB.jsx
│   │       ├── ItemDetailSheet.jsx
│   │       ├── PaymentMethodCard.jsx
│   │       └── StatusStepper.jsx
│   │
│   ├── kitchen/           ← Kitchen Display
│   │   ├── pages/
│   │   │   └── KitchenPage.jsx
│   │   └── components/
│   │       ├── OrderTicket.jsx
│   │       └── OrderQueue.jsx
│   │
│   └── admin/             ← Admin Dashboard
│       ├── pages/
│       │   ├── DashboardPage.jsx
│       │   ├── OrdersPage.jsx
│       │   ├── MenuPage.jsx
│       │   ├── TablesPage.jsx
│       │   ├── PaymentsPage.jsx
│       │   └── ReportsPage.jsx
│       ├── layouts/
│       │   └── AdminLayout.jsx   ← Sidebar + topbar wrapper
│       └── components/
│           ├── StatCard.jsx
│           ├── RevenueChart.jsx
│           ├── MenuTable.jsx
│           └── TableGrid.jsx
│
├── shared/                ← Shared across all apps
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── Toast.jsx
│   │   ├── Skeleton.jsx
│   │   ├── Badge.jsx
│   │   └── Modal.jsx
│   ├── hooks/
│   │   ├── useCart.js
│   │   ├── useSocket.js
│   │   └── useOrderStatus.js
│   └── styles/
│       ├── tokens.css     ← Design tokens (variables)
│       └── global.css     ← Reset + base styles
│
└── main.jsx               ← Router (menentukan app berdasarkan path)
```

---

## 10. Open Questions — UI/UX

> [!IMPORTANT]
> Keputusan desain berikut perlu dikonfirmasi:

1. **Tema warna** — Apakah dark theme sudah sesuai dengan branding cafe? Atau prefer light theme?
2. **Nama & Logo Cafe** — Perlu aset logo/branding untuk dimasukkan ke app
3. **Bahasa** — Indonesia saja, atau bilingual Indonesia + Inggris?
4. **Guest mode** — Apakah pelanggan perlu input nama/no HP sebelum pesan?
5. **Customer login** — Apakah ada fitur "Pesanan Saya" untuk pelanggan repeat?
6. **KDS input** — Apakah KDS perlu touchscreen-optimized atau mouse/keyboard?
7. **Notifikasi waiter** — Apakah waiter perlu app/device sendiri untuk terima notif "pesanan siap"?
