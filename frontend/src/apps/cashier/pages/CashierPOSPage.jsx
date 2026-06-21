import { useState, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Plus, Minus, Trash2, ShoppingCart, ChefHat,
  LogOut, Coffee, Monitor, MessageSquare, CheckCircle2,
  X, User, Phone, Hash, Printer
} from 'lucide-react'
import api from '@/shared/api/axios'
import { formatRupiah } from '@/shared/utils/format'
import { useCashierCart } from '../hooks/useCashierCart'
import { toast } from '@/shared/components/Toast'
export default function CashierPOSPage() {
  const navigate = useNavigate()
  const { tenantSlug } = useParams()
  const cart = useCashierCart()

  // Form state
  const [selectedTable, setSelectedTable] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastOrderId, setLastOrderId] = useState('')

  // Fetch data
  const { data: tables = [] } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => { const res = await api.get('/tables'); return res.data }
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => { const res = await api.get('/menu/categories'); return res.data }
  })

  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => { const res = await api.get('/menu'); return res.data }
  })

  // Filter menu
  const filteredItems = useMemo(() => {
    let items = menuItems.filter(i => i.is_available)
    if (selectedCategory !== 'all') {
      items = items.filter(i => i.category_id === selectedCategory)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q)
      )
    }
    return items
  }, [menuItems, selectedCategory, searchQuery])

  // Submit order
  const handleSubmit = async () => {
    if (!selectedTable) { toast.error('Pilih meja terlebih dahulu'); return }
    if (!customerName.trim()) { toast.error('Nama pelanggan wajib diisi'); return }
    if (cart.items.length === 0) { toast.error('Keranjang masih kosong'); return }

    setSubmitting(true)
    try {
      const res = await api.post('/orders', {
        table_id: Number(selectedTable),
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim() || '-',
        items: cart.items.map(i => ({
          menuItemId: i.menuItemId,
          name: i.name,
          qty: i.qty,
          price: i.price,
          notes: i.notes
        })),
        kitchen_note: cart.kitchenNote,
        total_amount: cart.total,
        payment_method: paymentMethod
      })

      setLastOrderId(res.data.orderId)
      setShowSuccess(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membuat pesanan')
    } finally {
      setSubmitting(false)
    }
  }

  // Reset after success
  const handleNewOrder = () => {
    cart.clearCart()
    setSelectedTable('')
    setCustomerName('')
    setCustomerPhone('')
    setPaymentMethod('cash')
    setSearchQuery('')
    setSelectedCategory('all')
    setShowSuccess(false)
    setLastOrderId('')
  }

  const handleLogout = () => {
    localStorage.removeItem('cafeos_cashier_token')
    localStorage.removeItem('cafeos_cashier_user')
    navigate(`/c/${tenantSlug}/cashier/login`)
  }

  const cashierUser = (() => {
    try { return JSON.parse(localStorage.getItem('cafeos_cashier_user') || '{}') } catch { return {} }
  })()

  return (
    <div className="h-dvh flex flex-col bg-slate-50 overflow-hidden">
      {/* ── Top Bar ── */}
      <header className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Monitor className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-sm">CaféOS Kasir</h1>
            <p className="text-xs text-slate-400">Point of Sale</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">
            <User className="w-3 h-3 inline mr-1" />
            {cashierUser.username || 'Kasir'}
          </span>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ═══ LEFT PANEL — Menu Browser ═══ */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-200">

          {/* Customer Info Bar */}
          <div className="bg-white px-5 py-3 border-b border-slate-200 flex gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 min-w-[140px]">
              <Hash className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
              >
                <option value="">Pilih Meja</option>
                {tables.map(t => (
                  <option key={t.id} value={t.id}>Meja {t.table_number}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama pelanggan"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
              />
            </div>
            <div className="flex items-center gap-2 min-w-[160px]">
              <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="No. HP (opsional)"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Search + Category Tabs */}
          <div className="bg-white px-5 py-3 border-b border-slate-200 space-y-3 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari menu..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {menuLoading ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                Memuat menu...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                Menu tidak ditemukan
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredItems.map(item => {
                  const inCart = cart.items.find(ci => ci.menuItemId === item.id)
                  return (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => cart.addItem({
                        menuItemId: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image_url
                      })}
                      className={`relative bg-white rounded-xl border-2 overflow-hidden text-left transition-all hover:shadow-md group ${
                        inCart ? 'border-emerald-400 shadow-emerald-100' : 'border-transparent shadow-sm'
                      }`}
                    >
                      {/* Image */}
                      <div className="aspect-square bg-slate-100 overflow-hidden">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-2.5">
                        <p className="font-semibold text-xs text-slate-800 leading-tight line-clamp-2">{item.name}</p>
                        <p className="font-bold text-emerald-600 text-xs mt-1">{formatRupiah(item.price)}</p>
                      </div>

                      {/* Cart badge */}
                      {inCart && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                          {inCart.qty}
                        </div>
                      )}

                      {/* Add indicator */}
                      <div className="absolute top-2 left-2 w-6 h-6 bg-white/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                        <Plus className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ═══ RIGHT PANEL — Cart & Checkout ═══ */}
        <div className="w-[380px] xl:w-[420px] flex flex-col bg-white flex-shrink-0">
          {/* Cart Header */}
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
              <h2 className="font-heading font-bold text-slate-800">Keranjang</h2>
              {cart.itemCount > 0 && (
                <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.itemCount}
                </span>
              )}
            </div>
            {cart.items.length > 0 && (
              <button
                onClick={() => cart.clearCart()}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Kosongkan
              </button>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
            {cart.items.length === 0 ? (
              <div className="text-center py-16 text-slate-300">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium">Keranjang kosong</p>
                <p className="text-xs mt-1">Klik menu di sebelah kiri untuk menambahkan</p>
              </div>
            ) : (
              <AnimatePresence>
                {cart.items.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-slate-50 rounded-xl p-3 space-y-2"
                  >
                    <div className="flex items-start gap-2">
                      {/* Thumbnail */}
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm">🍽️</div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs text-slate-800 truncate">{item.name}</p>
                        <p className="text-xs text-emerald-600 font-bold mt-0.5">{formatRupiah(item.price * item.qty)}</p>
                      </div>

                      <button
                        onClick={() => cart.removeItem(item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">{formatRupiah(item.price)} / item</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => cart.updateQty(item.id, item.qty - 1)}
                          className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 active:scale-90 transition-all"
                        >
                          <Minus className="w-3 h-3 text-slate-500" />
                        </button>
                        <span className="font-bold text-xs text-slate-700 w-4 text-center">{item.qty}</span>
                        <button
                          onClick={() => cart.updateQty(item.id, item.qty + 1)}
                          className="w-6 h-6 rounded-md bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-400 active:scale-90 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Kitchen Note */}
          {cart.items.length > 0 && (
            <div className="px-5 py-2 border-t border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2 mb-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-medium text-slate-500">Catatan dapur</span>
              </div>
              <textarea
                rows={2}
                value={cart.kitchenNote}
                onChange={(e) => cart.setKitchenNote(e.target.value)}
                placeholder="Misal: tidak pedas, pisahkan saus..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
              />
            </div>
          )}

          {/* Checkout Summary */}
          {cart.items.length > 0 && (
            <div className="px-5 py-4 border-t border-slate-200 space-y-3 flex-shrink-0 bg-slate-50/50">
              {/* Price breakdown */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal ({cart.itemCount} item)</span>
                  <span>{formatRupiah(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Pajak (10%)</span>
                  <span>{formatRupiah(cart.tax)}</span>
                </div>
                <div className="h-px bg-slate-200 my-1" />
                <div className="flex justify-between font-heading font-bold text-base text-slate-800">
                  <span>Total</span>
                  <span className="text-emerald-600">{formatRupiah(cart.total)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-slate-500">Metode Bayar</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'cash', label: '💵 Cash' },
                    { value: 'qris', label: '📱 QRIS' },
                    { value: 'transfer', label: '🏦 Transfer' },
                  ].map(m => (
                    <button
                      key={m.value}
                      onClick={() => setPaymentMethod(m.value)}
                      className={`py-2 rounded-lg text-xs font-medium transition-all ${
                        paymentMethod === m.value
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting || cart.items.length === 0}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <ChefHat className="w-4 h-4" />
                    Buat Pesanan — {formatRupiah(cart.total)}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Success Modal ── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-800 mb-1">Pesanan Berhasil!</h3>
              <p className="text-sm text-slate-500 mb-2">Pesanan telah dikirim ke dapur</p>
              <div className="bg-slate-50 rounded-xl px-4 py-3 mb-6">
                <p className="text-xs text-slate-400">Order ID</p>
                <p className="font-mono font-bold text-slate-700 text-sm">{lastOrderId}</p>
              </div>
              <button
                onClick={() => window.print()}
                className="w-full mb-3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
              >
                <Printer className="w-4 h-4" />
                Cetak Struk
              </button>
              <button
                onClick={handleNewOrder}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-sm"
              >
                Buat Pesanan Baru
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Print Receipt Portal ── */}
      {showSuccess && ReactDOM.createPortal(
        <div id="receipt-print-area">
          <div className="text-center mb-4">
            <h2 className="text-base font-bold uppercase">CaféOS</h2>
            <p className="text-[10px] text-slate-600">Jl. Pemuda No. 123, Semarang</p>
            <p className="text-[10px] text-slate-600">Telp: 0812-3456-7890</p>
          </div>

          <div className="pb-2 mb-2 text-[10px] space-y-0.5" style={{ borderBottom: '1px dashed black' }}>
            <div className="flex justify-between">
              <span>No. Order:</span>
              <span className="font-bold">{lastOrderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal:</span>
              <span>{new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</span>
            </div>
            <div className="flex justify-between">
              <span>Kasir:</span>
              <span className="capitalize">{cashierUser.username || 'Kasir'}</span>
            </div>
            <div className="flex justify-between">
              <span>Meja:</span>
              <span className="font-bold">Meja {tables.find(t => String(t.id) === String(selectedTable))?.table_number || selectedTable}</span>
            </div>
            <div className="flex justify-between">
              <span>Pelanggan:</span>
              <span>{customerName} {customerPhone ? `(${customerPhone})` : ''}</span>
            </div>
          </div>

          <div className="pb-2 mb-2" style={{ borderBottom: '1px dashed black' }}>
            <div className="text-[10px] font-bold mb-1">Daftar Pesanan:</div>
            <div className="space-y-2">
              {cart.items.map(item => (
                <div key={item.id} className="text-[10px]">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span>{formatRupiah(item.price * item.qty)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-[9px] pl-2">
                    <span>{item.qty} x {formatRupiah(item.price)}</span>
                  </div>
                  {item.notes && (
                    <div className="text-slate-500 text-[9px] pl-2 italic">
                      * {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pb-2 mb-2 text-[10px] space-y-1" style={{ borderBottom: '1px dashed black' }}>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatRupiah(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak (10%):</span>
              <span>{formatRupiah(cart.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-1" style={{ borderTop: '1px dotted black' }}>
              <span>TOTAL:</span>
              <span>{formatRupiah(cart.total)}</span>
            </div>
          </div>

          <div className="text-center text-[10px] space-y-1 mt-4">
            <p className="font-bold uppercase">Metode Pembayaran: {paymentMethod === 'cash' ? 'Tunai' : paymentMethod.toUpperCase()}</p>
            <p className="mt-2 text-slate-500 italic">Terima kasih atas kunjungan Anda!</p>
            <p className="text-slate-500 italic">Silakan datang kembali</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
