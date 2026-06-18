/**
 * MOCK DATA — Hardcoded untuk demo tanpa backend
 * Ganti dengan API calls nyata saat backend sudah siap
 */

export const MOCK_CREDENTIALS = {
  admin: { email: 'admin@cafe.com', password: 'admin123' },
  kitchen: { pin: '123456' },
}

export const MOCK_TABLE = {
  id: '1',
  table_number: 5,
  status: 'available',
  capacity: 4,
}

export const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Makanan' },
  { id: 'cat-2', name: 'Minuman' },
  { id: 'cat-3', name: 'Camilan' },
  { id: 'cat-4', name: 'Dessert' },
]

export const MOCK_MENU = [
  {
    id: 'item-1', name: 'Nasi Goreng Spesial', category_id: 'cat-1',
    price: 35000, description: 'Nasi goreng dengan telur, ayam suwir, dan sambal spesial chef.',
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80',
    is_available: true, is_featured: true,
  },
  {
    id: 'item-2', name: 'Mie Ayam Bakso', category_id: 'cat-1',
    price: 30000, description: 'Mie ayam segar dengan bakso sapi jumbo dan kuah kaldu gurih.',
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80',
    is_available: true, is_featured: false,
  },
  {
    id: 'item-3', name: 'Ayam Bakar Madu', category_id: 'cat-1',
    price: 45000, description: 'Ayam bakar dengan bumbu madu dan rempah pilihan, disajikan dengan lalapan.',
    image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80',
    is_available: true, is_featured: true,
  },
  {
    id: 'item-4', name: 'Pasta Carbonara', category_id: 'cat-1',
    price: 48000, description: 'Pasta creamy dengan saus carbonara autentik, bacon, dan parmesan.',
    image_url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80',
    is_available: false, is_featured: false,
  },
  {
    id: 'item-5', name: 'Kopi Susu Gula Aren', category_id: 'cat-2',
    price: 28000, description: 'Espresso double shot dengan susu segar dan gula aren asli.',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    is_available: true, is_featured: true,
  },
  {
    id: 'item-6', name: 'Matcha Latte', category_id: 'cat-2',
    price: 32000, description: 'Matcha premium Jepang dengan steamed milk yang creamy.',
    image_url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80',
    is_available: true, is_featured: false,
  },
  {
    id: 'item-7', name: 'Jus Alpukat', category_id: 'cat-2',
    price: 25000, description: 'Jus alpukat segar dengan susu kental manis dan es batu.',
    image_url: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&q=80',
    is_available: true, is_featured: false,
  },
  {
    id: 'item-8', name: 'Es Teh Manis', category_id: 'cat-2',
    price: 12000, description: 'Teh hitam dingin dengan gula aren, segar dan menyegarkan.',
    image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80',
    is_available: true, is_featured: false,
  },
  {
    id: 'item-9', name: 'Kentang Goreng', category_id: 'cat-3',
    price: 22000, description: 'Kentang goreng crispy dengan bumbu tabur keju dan mayo dip.',
    image_url: 'https://images.unsplash.com/photo-1576107232684-1279f8be9d38?w=400&q=80',
    is_available: true, is_featured: false,
  },
  {
    id: 'item-10', name: 'Roti Bakar Coklat', category_id: 'cat-3',
    price: 18000, description: 'Roti bakar tebal dengan selai coklat Nutella dan taburan keju.',
    image_url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80',
    is_available: true, is_featured: false,
  },
  {
    id: 'item-11', name: 'Pisang Bakar Keju', category_id: 'cat-4',
    price: 20000, description: 'Pisang kepok bakar dengan lelehan keju mozzarella dan saus coklat.',
    image_url: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=400&q=80',
    is_available: true, is_featured: false,
  },
  {
    id: 'item-12', name: 'Es Krim Vanilla', category_id: 'cat-4',
    price: 25000, description: '2 scoop es krim vanilla premium dengan topping sprinkle dan waffle.',
    image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80',
    is_available: true, is_featured: false,
  },
]

export const MOCK_TABLES = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  table_number: i + 1,
  status: [2, 5, 7, 10].includes(i + 1) ? 'occupied' : 'available',
  capacity: i % 3 === 0 ? 6 : 4,
}))

export const MOCK_ORDERS = [
  { id: 'ord-1', tableNumber: 3, customerName: 'Budi Santoso', itemCount: 3, totalAmount: 95000, status: 'pending',    created_at: new Date(Date.now() - 120000).toISOString(), paymentMethod: 'qris' },
  { id: 'ord-2', tableNumber: 7, customerName: 'Siti Rahayu',  itemCount: 2, totalAmount: 60000, status: 'processing', created_at: new Date(Date.now() - 480000).toISOString(), paymentMethod: 'gopay' },
  { id: 'ord-3', tableNumber: 1, customerName: 'Ahmad Fauzi',  itemCount: 4, totalAmount: 127000, status: 'ready',    created_at: new Date(Date.now() - 900000).toISOString(), paymentMethod: 'cash' },
  { id: 'ord-4', tableNumber: 5, customerName: 'Dewi Lestari', itemCount: 1, totalAmount: 28000, status: 'done',      created_at: new Date(Date.now() - 1800000).toISOString(), paymentMethod: 'ovo' },
]

export const MOCK_STATS = {
  revenueToday: 2450000,
  revenueTrend: 12,
  ordersToday: 47,
  ordersTrend: 5,
  activeTables: 4,
  totalTables: 12,
  avgOrderValue: 52100,
  avgTrend: 3,
}

export const MOCK_HOURLY = [
  { hour: '08:00', revenue: 120000 },
  { hour: '09:00', revenue: 185000 },
  { hour: '10:00', revenue: 240000 },
  { hour: '11:00', revenue: 310000 },
  { hour: '12:00', revenue: 480000 },
  { hour: '13:00', revenue: 390000 },
  { hour: '14:00', revenue: 220000 },
  { hour: '15:00', revenue: 175000 },
  { hour: '16:00', revenue: 195000 },
  { hour: '17:00', revenue: 135000 },
]

export const MOCK_TOP_ITEMS = [
  { name: 'Kopi Susu Gula Aren', quantity: 34 },
  { name: 'Nasi Goreng Spesial', quantity: 28 },
  { name: 'Ayam Bakar Madu', quantity: 21 },
  { name: 'Matcha Latte', quantity: 19 },
  { name: 'Kentang Goreng', quantity: 15 },
]

export const MOCK_PAYMENT_BREAKDOWN = [
  { method: 'QRIS',    amount: 980000 },
  { method: 'GoPay',   amount: 640000 },
  { method: 'Cash',    amount: 450000 },
  { method: 'OVO',     amount: 230000 },
  { method: 'Dana',    amount: 150000 },
]
