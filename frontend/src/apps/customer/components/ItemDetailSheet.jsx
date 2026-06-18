import { useState } from 'react'
import { motion } from 'framer-motion'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import BottomSheet from '@/shared/components/BottomSheet'
import Button from '@/shared/components/Button'
import { useCartStore } from '@/shared/hooks/useCartStore'
import { formatRupiah } from '@/shared/utils/format'
import { useToast } from '@/shared/components/Toast'

export default function ItemDetailSheet({ item, onClose }) {
  const [qty, setQty] = useState(1)
  const [notes, setNotes] = useState('')
  const addItem = useCartStore(s => s.addItem)
  const toast = useToast()

  const handleAdd = () => {
    addItem({ menuItemId: item.id, name: item.name, price: item.price, image: item.image_url, qty, notes })
    toast.success(`${item.name} ditambahkan ke keranjang!`)
    onClose()
    setQty(1)
    setNotes('')
  }

  if (!item) return null

  return (
    <BottomSheet isOpen={Boolean(item)} onClose={onClose} snapHeight="90vh">
      {/* Image */}
      <div className="w-full aspect-video bg-surface-muted overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🍽️</div>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Name & price */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-heading font-bold text-xl text-ink-primary">{item.name}</h2>
            {item.is_featured && (
              <span className="badge-brand text-xs mt-1">🔥 Populer</span>
            )}
          </div>
          <span className="font-heading font-extrabold text-2xl text-brand-600 flex-shrink-0">
            {formatRupiah(item.price)}
          </span>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-ink-secondary leading-relaxed">{item.description}</p>
        )}

        {/* Notes */}
        <div>
          <label className="text-sm font-semibold text-ink-secondary block mb-1.5 font-heading">
            Catatan khusus (opsional)
          </label>
          <textarea
            rows={2}
            placeholder="Contoh: tanpa bawang, extra pedas..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-base resize-none text-sm"
          />
        </div>

        {/* Qty stepper + Add button */}
        <div className="flex items-center gap-4">
          {/* Qty */}
          <div className="flex items-center gap-3 bg-surface-muted rounded-xl p-1">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-ink-primary shadow-card-sm active:scale-90 transition-transform"
            >
              <Minus className="w-4 h-4" />
            </button>
            <motion.span
              key={qty}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="font-heading font-bold text-lg text-ink-primary w-6 text-center"
            >
              {qty}
            </motion.span>
            <button
              onClick={() => setQty(q => q + 1)}
              className="w-9 h-9 rounded-lg bg-brand-500 text-white flex items-center justify-center shadow-glow active:scale-90 transition-transform"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to cart */}
          <Button
            className="flex-1"
            onClick={handleAdd}
            disabled={!item.is_available}
            icon={<ShoppingCart className="w-4 h-4" />}
          >
            {item.is_available
              ? `Tambah • ${formatRupiah(item.price * qty)}`
              : 'Menu Habis'
            }
          </Button>
        </div>
      </div>
    </BottomSheet>
  )
}
