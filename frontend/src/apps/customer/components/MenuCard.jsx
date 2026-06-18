import { motion } from 'framer-motion'
import { Plus, Check } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/shared/hooks/useCartStore'
import { formatRupiah } from '@/shared/utils/format'
import { cn } from '@/shared/utils/cn'

export default function MenuCard({ item, onTap }) {
  const addItem = useCartStore(s => s.addItem)
  const [justAdded, setJustAdded] = useState(false)

  const handleQuickAdd = (e) => {
    e.stopPropagation()
    if (!item.is_available) return
    addItem({ menuItemId: item.id, name: item.name, price: item.price, image: item.image_url })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onTap}
      className={cn(
        'card-hover cursor-pointer overflow-hidden flex flex-col',
        !item.is_available && 'opacity-60'
      )}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-surface-muted">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
        )}
        {/* Sold out overlay */}
        {!item.is_available && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="badge-cancelled text-xs">Habis</span>
          </div>
        )}
        {/* Featured badge */}
        {item.is_featured && item.is_available && (
          <span className="absolute top-2 left-2 badge-brand text-xs px-2 py-0.5">🔥 Populer</span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="font-heading font-semibold text-sm text-ink-primary leading-snug line-clamp-2">
          {item.name}
        </p>
        {item.description && (
          <p className="text-xs text-ink-muted line-clamp-1">{item.description}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-heading font-bold text-brand-600 text-sm">
            {formatRupiah(item.price)}
          </span>
          {/* Quick add button */}
          <motion.button
            onClick={handleQuickAdd}
            disabled={!item.is_available}
            animate={justAdded ? { scale: [1, 1.3, 1] } : {}}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
              item.is_available
                ? justAdded
                  ? 'bg-status-ready text-white'
                  : 'bg-brand-500 text-white hover:bg-brand-600'
                : 'bg-ink-placeholder/30 text-ink-muted cursor-not-allowed'
            )}
          >
            {justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
