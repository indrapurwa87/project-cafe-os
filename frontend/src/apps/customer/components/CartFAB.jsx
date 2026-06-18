import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/shared/hooks/useCartStore'
import { formatRupiah } from '@/shared/utils/format'

export default function CartFAB({ count, onClick }) {
  const { total } = useCartStore()

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="fixed bottom-6 left-4 right-4 z-30 max-w-md mx-auto"
    >
      <button
        onClick={onClick}
        className="w-full bg-gradient-brand text-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-glow-lg active:scale-95 transition-transform"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <motion.span
              key={count}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-white text-brand-600 text-xs font-bold rounded-full flex items-center justify-center"
            >
              {count}
            </motion.span>
          </div>
          <span className="font-heading font-semibold text-sm">
            {count} item dipilih
          </span>
        </div>
        <span className="font-heading font-bold text-base">
          {formatRupiah(total)} →
        </span>
      </button>
    </motion.div>
  )
}
