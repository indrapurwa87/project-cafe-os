# 🛠️ Implementation Plan — Frontend CaféOS

**Versi:** 1.0  
**Tanggal:** 18 Juni 2026  
**Scope:** Frontend React (Customer PWA + Kitchen KDS + Admin Dashboard)

---

## Keputusan Desain Final

| Aspek | Keputusan |
|-------|-----------|
| **Tema** | ✅ Light theme — warm cream/white (`#FFFBF5`) + amber accent |
| **Customer identity** | ✅ Input Nama + No. HP wajib sebelum akses menu |
| **Simpan data** | Checkbox "ingat saya" → `localStorage` |
| **Flow baru** | Splash → **Identity Form** → Menu → Cart → Bayar → Status |

---

## Tech Stack Final

| Layer | Library / Tool | Alasan |
|-------|---------------|--------|
| **Framework** | React 18 + Vite | Fast HMR, modern build |
| **Routing** | React Router v6 | Nested routes, lazy loading |
| **State (global)** | Zustand | Ringan, cart + user state |
| **State (server)** | TanStack Query (React Query) | Cache, refetch, loading state otomatis |
| **Styling** | Tailwind CSS v3 | Utility-first, cepat kustomisasi |
| **Animation** | Framer Motion | Page transition, micro-animation |
| **Icons** | Lucide React | Konsisten, tree-shakeable |
| **Charts (admin)** | Recharts | Ringan, composable |
| **Form** | React Hook Form + Zod | Validasi input identity & admin form |
| **WebSocket** | Socket.io-client | Real-time KDS + order status |
| **HTTP Client** | Axios | Interceptor, base URL config |
| **QR Code** | `qrcode.react` | Generate QR preview di admin |

---

## Struktur Proyek

```
cafeos-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── apps/
│   │   ├── customer/
│   │   │   ├── pages/
│   │   │   │   ├── SplashPage.jsx
│   │   │   │   ├── IdentityPage.jsx       ← BARU
│   │   │   │   ├── MenuPage.jsx
│   │   │   │   ├── CartPage.jsx
│   │   │   │   ├── PaymentPage.jsx
│   │   │   │   └── OrderStatusPage.jsx
│   │   │   └── components/
│   │   │       ├── MenuCard.jsx
│   │   │       ├── CategoryTabs.jsx
│   │   │       ├── CartFAB.jsx
│   │   │       ├── ItemDetailSheet.jsx
│   │   │       ├── PaymentMethodCard.jsx
│   │   │       └── StatusStepper.jsx
│   │   ├── kitchen/
│   │   │   ├── pages/
│   │   │   │   ├── KitchenLoginPage.jsx
│   │   │   │   └── KitchenPage.jsx
│   │   │   └── components/
│   │   │       ├── OrderTicket.jsx
│   │   │       └── OrderQueue.jsx
│   │   └── admin/
│   │       ├── pages/
│   │       │   ├── LoginPage.jsx
│   │       │   ├── DashboardPage.jsx
│   │       │   ├── OrdersPage.jsx
│   │       │   ├── MenuManagePage.jsx
│   │       │   ├── CategoriesPage.jsx
│   │       │   ├── TablesPage.jsx
│   │       │   ├── PaymentsPage.jsx
│   │       │   └── ReportsPage.jsx
│   │       ├── layouts/
│   │       │   └── AdminLayout.jsx
│   │       └── components/
│   │           ├── Sidebar.jsx
│   │           ├── StatCard.jsx
│   │           ├── RevenueChart.jsx
│   │           ├── OrdersTable.jsx
│   │           ├── MenuTable.jsx
│   │           ├── TableGrid.jsx
│   │           └── QRCodeCard.jsx
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── BottomSheet.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── hooks/
│   │   │   ├── useCart.js
│   │   │   ├── useCustomer.js
│   │   │   ├── useSocket.js
│   │   │   └── useOrderStatus.js
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   ├── menu.api.js
│   │   │   ├── orders.api.js
│   │   │   ├── tables.api.js
│   │   │   └── payments.api.js
│   │   └── styles/
│   │       └── global.css
│   ├── router.jsx
│   └── main.jsx
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Design Tokens (Tailwind Config)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FFFBF5',
          100: '#FEF3C7',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',  // ← CTA utama
          600: '#D97706',
          700: '#B45309',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted:   '#F9FAFB',
        },
        ink: {
          primary:   '#1C1917',
          secondary: '#57534E',
          muted:     '#A8A29E',
        },
        status: {
          new:       '#F59E0B',
          process:   '#3B82F6',
          ready:     '#10B981',
          done:      '#6B7280',
          cancelled: '#EF4444',
        }
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card:       '0 2px 16px rgba(0,0,0,0.08)',
        'card-hover':'0 8px 32px rgba(0,0,0,0.12)',
        glow:       '0 0 20px rgba(245,158,11,0.25)',
      }
    }
  }
}
```

---

## Fase Pengerjaan

### ✅ FASE 1 — Project Setup & Design System (Hari 1–2)

#### 1.1 Inisialisasi Proyek
- [x] Inisialisasi Vite + React
- [x] Install semua dependencies utama (Tailwind CSS, React Router, Zustand, dll.)
- [x] Setup Tailwind dengan tokens custom
- [x] Konfigurasi Google Fonts & path alias `@/`

#### 1.2 Shared Components
- [x] `Button`
- [x] `Input`
- [x] `Badge`
- [x] `Skeleton`
- [x] `Toast`
- [x] `EmptyState`
- [x] `Modal`
- [x] `BottomSheet`

---

### ✅ FASE 2 — Customer PWA (Hari 3–6)

#### 2.1 Zustand Stores
- [x] `useCustomerStore` (dengan sinkronisasi `localStorage`)
- [x] `useCartStore` (diperbaiki agar nilainya reaktif)

#### 2.2 Screen Details
- [x] `SplashPage` (dengan deteksi `tableId` otomatis)
- [x] `IdentityPage` (form nama & nomor HP pelanggan)
- [x] `MenuPage` (dilengkapi search, tabs, & tombol keranjang belanja melayang/Cart FAB)
- [x] `CartPage` (dilengkapi qty editor & catatan khusus dapur)
- [x] `PaymentPage` (pilihan e-wallet, virtual account, kasir)
- [x] `OrderStatusPage` (status pelacakan pesanan real-time)

---

### ✅ FASE 3 — Kitchen Display System (Hari 7–8)

- [x] PIN Login halaman Kitchen (`/kitchen/login`)
- [x] `KitchenPage` (tampilan antrean pesanan berdasarkan status: Baru, Proses, Siap)
- [x] `OrderTicket` card (detail menu pesanan beserta pengukur waktu)

---

### ✅ FASE 4 — Admin Dashboard (Hari 9–12)

- [x] `AdminLayout` dengan sidebar yang dinamis
- [x] `DashboardPage` (ringkasan statistik penjualan, bagan rekapitulasi)
- [x] `MenuManagePage` (tambah/sunting/hapus menu cafe, status ketersediaan)
- [x] `TablesPage` (manajemen tata letak meja + generate QR Code)
- [x] `OrdersPage` (catatan pesanan masuk, kontrol override status)
- [x] `ReportsPage` (laporan performa, cetak dokumen PDF/Excel mock)

---

## Routing Map

```jsx
<Routes>
  {/* CUSTOMER */}
  <Route path="/menu" element={<SplashPage />} />
  <Route path="/menu/:tableId/identify" element={<IdentityPage />} />
  <Route path="/menu/:tableId" element={<MenuPage />} />
  <Route path="/menu/:tableId/cart" element={<CartPage />} />
  <Route path="/menu/:tableId/payment" element={<PaymentPage />} />
  <Route path="/order/:orderId/status" element={<OrderStatusPage />} />

  {/* KITCHEN */}
  <Route path="/kitchen/login" element={<KitchenLoginPage />} />
  <Route path="/kitchen" element={<KitchenGuard><KitchenPage /></KitchenGuard>} />

  {/* ADMIN */}
  <Route path="/admin/login" element={<AdminLoginPage />} />
  <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
    <Route index element={<DashboardPage />} />
    <Route path="orders" element={<OrdersPage />} />
    <Route path="menu" element={<MenuManagePage />} />
    <Route path="categories" element={<CategoriesPage />} />
    <Route path="tables" element={<TablesPage />} />
    <Route path="payments" element={<PaymentsPage />} />
    <Route path="reports" element={<ReportsPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
</Routes>
```
