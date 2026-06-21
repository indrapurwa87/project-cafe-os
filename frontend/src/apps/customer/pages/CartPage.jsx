import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Minus, Plus, Trash2, MessageSquare } from 'lucide-react'
import { useCartStore } from '@/shared/hooks/useCartStore'
import { useCustomerStore } from '@/shared/hooks/useCustomerStore'
import { formatRupiah } from '@/shared/utils/format'
import Button from '@/shared/components/Button'
import EmptyState from '@/shared/components/EmptyState'

export default function CartPage() {
  const { tableId, tenantSlug } = useParams()
  const navigate = useNavigate()
  const { name, tableNumber } = useCustomerStore()
  const { items, kitchenNote, updateQty, removeItem, setKitchenNote, subtotal, tax, total } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="page-customer flex flex-col min-h-dvh">
        <header className="px-4 pt-6 pb-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-icon">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-bold text-xl text-ink-primary">Keranjang</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            title="Keranjangmu kosong"
            description="Yuk, pilih menu favoritmu dulu!"
            action={
              <Button onClick={() => navigate(`/c/${tenantSlug}/menu/${tableId}`)}>
                Lihat Menu
              </Button>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="page-customer flex flex-col min-h-dvh">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-surface-warm/95 backdrop-blur-sm px-4 pt-6 pb-3 border-b border-ink-placeholder/10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-icon">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading font-bold text-xl text-ink-primary">Pesanan Kamu</h1>
            <p className="text-xs text-ink-muted">Hi {name} · Meja {tableNumber}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 space-y-3 pb-48">
        {/* Order items */}
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="card p-4 space-y-3"
          >
            <div className="flex gap-3">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-muted flex-shrink-0">
                {item.image
                  ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-sm text-ink-primary truncate">{item.name}</p>
                {item.notes && (
                  <p className="text-xs text-ink-muted mt-0.5">📝 {item.notes}</p>
                )}
                <p className="font-heading font-bold text-brand-600 text-sm mt-1">
                  {formatRupiah(item.price * item.qty)}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-ink-muted hover:text-red-500 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Qty stepper */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-muted">{formatRupiah(item.price)} / item</span>
              <div className="flex items-center gap-3 bg-surface-muted rounded-xl p-1">
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shadow-card-sm active:scale-90 transition-transform"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-ink-primary w-4 text-center text-sm">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center active:scale-90 transition-transform"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Kitchen note */}
        <div className="card p-4 space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-secondary font-heading">
            <MessageSquare className="w-4 h-4" />
            Catatan untuk dapur
          </label>
          <textarea
            rows={2}
            placeholder="Contoh: tolong jangan terlalu pedas, pisahkan saus..."
            value={kitchenNote}
            onChange={(e) => setKitchenNote(e.target.value)}
            className="input-base resize-none text-sm"
          />
        </div>

        {/* Price breakdown */}
        <div className="card p-4 space-y-2">
          <div className="flex justify-between text-sm text-ink-secondary">
            <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} item)</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-ink-secondary">
            <span>Pajak (10%)</span>
            <span>{formatRupiah(tax)}</span>
          </div>
          <div className="divider" />
          <div className="flex justify-between font-heading font-bold text-lg text-ink-primary">
            <span>Total</span>
            <span className="text-brand-600">{formatRupiah(total)}</span>
          </div>
        </div>
      </main>

      {/* Sticky bottom action */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-warm/95 backdrop-blur-sm border-t border-ink-placeholder/10 px-4 py-4 max-w-md mx-auto safe-pb">
        <Button
          size="lg"
          onClick={() => navigate(`/c/${tenantSlug}/menu/${tableId}/payment`)}
        >
          Pilih Cara Bayar →
        </Button>
      </div>
    </div>
  )
}
