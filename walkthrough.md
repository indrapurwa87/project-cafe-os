# Walkthrough: Perbaikan Tombol Keranjang Belanja (Cart FAB)

Kami telah menemukan dan memperbaiki masalah mengapa menu/tombol keranjang belanja tidak muncul setelah Anda menambahkan menu makanan/minuman.

## Masalah yang Ditemukan
Di dalam file `frontend/src/shared/hooks/useCartStore.js`, nilai `itemCount`, `subtotal`, `tax`, dan `total` sebelumnya dideklarasikan sebagai Getter ES6 (`get itemCount()`, dll.).
Pada library state management **Zustand**, ketika fungsi `set()` dipanggil untuk memperbarui isi keranjang, Zustand melakukan penyebaran objek (*object spread* / merge) untuk state baru. Hal ini mengevaluasi fungsi getter tersebut secara instan berdasarkan nilai awal (`0`), lalu menyimpannya sebagai properti statis biasa. Akibatnya, reaktivitas dari nilai tersebut terputus dan nilainya terkunci selamanya di angka `0`.

Karena `itemCount` selalu terbaca `0`, kondisi `{itemCount > 0 && <CartFAB ... />}` di `frontend/src/apps/customer/pages/MenuPage.jsx` tidak pernah terpenuhi, sehingga tombol melayang keranjang tidak muncul.

## Perubahan yang Dilakukan
Kami memperbarui file `frontend/src/shared/hooks/useCartStore.js` dengan skema berikut:
1. Mengubah `itemCount`, `subtotal`, `tax`, dan `total` menjadi variabel state biasa yang reaktif.
2. Membuat fungsi pembantu `computeDerived(items)` yang menghitung total harga, pajak, dan jumlah item secara langsung.
3. Memperbarui setiap action (`addItem`, `removeItem`, `updateQty`, `updateNotes`, `clearCart`) agar otomatis menghitung ulang nilai-nilai tersebut setiap kali item di keranjang berubah.

Dengan cara ini, komponen visual React akan mendeteksi perubahan state secara real-time dan langsung memperbarui antarmuka pengguna (UI).
