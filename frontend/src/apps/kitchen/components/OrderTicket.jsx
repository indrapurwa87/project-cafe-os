import { motion } from 'framer-motion'
import { AlarmClock } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

const ACTION_MAP = {
  pending:    { label: 'Mulai Masak',  nextStatus: 'processing', color: 'bg-status-new text-white' },
  processing: { label: 'Tandai Siap', nextStatus: 'ready',      color: 'bg-status-process text-white' },
  ready:      { label: 'Sudah Diantar', nextStatus: 'done',     color: 'bg-status-ready text-white' },
}

export default function OrderTicket({ order, now, onAction }) {
  const elapsedSec = Math.floor((now - new Date(order.created_at)) / 1000)
  const elapsedMin = Math.floor(elapsedSec / 60)
  const isLate = elapsedMin >= 15
  const action = ACTION_MAP[order.status]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        'bg-gray-900 rounded-2xl overflow-hidden border',
        order.status === 'pending'    && 'border-status-new/40',
        order.status === 'processing' && 'border-status-process/40',
        order.status === 'ready'      && 'border-status-ready/40',
        isLate && 'border-red-500 animate-pulse'
      )}
    >
      {/* Ticket header */}
      <div className={cn(
        'px-4 py-3 flex items-center justify-between',
        order.status === 'pending'    && 'bg-status-new/10',
        order.status === 'processing' && 'bg-status-process/10',
        order.status === 'ready'      && 'bg-status-ready/10',
      )}>
        <div>
          <p className="font-heading font-extrabold text-3xl text-white">
            Meja {order.tableNumber}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{order.customerName} · #{String(order.id).slice(-4).toUpperCase()}</p>
        </div>
        <div className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-xl',
          isLate ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-300'
        )}>
          <AlarmClock className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">
            {elapsedMin > 0 ? `${elapsedMin} mnt` : `${elapsedSec} dtk`}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="px-4 py-3 space-y-2">
        {order.items?.map((item, i) => (
          <div key={i} className="flex gap-2">
            <span className="font-heading font-bold text-white text-sm w-6 text-right flex-shrink-0">
              ×{item.quantity}
            </span>
            <div>
              <p className="text-sm text-gray-200">{item.name}</p>
              {item.notes && (
                <p className="text-xs text-status-new font-medium">⚠ {item.notes}</p>
              )}
            </div>
          </div>
        ))}
        {order.kitchenNote && (
          <div className="mt-3 bg-gray-800 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-400">📝 {order.kitchenNote}</p>
          </div>
        )}
      </div>

      {/* Action button */}
      {action && (
        <div className="px-4 pb-4">
          <button
            onClick={() => onAction(action.nextStatus)}
            className={cn(
              'w-full py-3 rounded-xl font-heading font-bold text-sm transition-all active:scale-95',
              action.color
            )}
          >
            {action.label}
          </button>
        </div>
      )}
    </motion.div>
  )
}
