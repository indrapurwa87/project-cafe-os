import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { cn } from '../utils/cn'

// ── External toast store (no context needed) ──
const subscribers = new Set()
let toastIdCounter = 0
const toasts = []

function notify() {
  subscribers.forEach(fn => fn([...toasts]))
}

export const toast = {
  success: (message, duration = 3000) => addToast(message, 'success', duration),
  error:   (message, duration = 3500) => addToast(message, 'error',   duration),
  info:    (message, duration = 3000) => addToast(message, 'info',    duration),
}

function addToast(message, type, duration) {
  const id = ++toastIdCounter
  toasts.push({ id, message, type })
  notify()
  setTimeout(() => {
    const idx = toasts.findIndex(t => t.id === id)
    if (idx !== -1) { toasts.splice(idx, 1); notify() }
  }, duration)
}

function removeToast(id) {
  const idx = toasts.findIndex(t => t.id === id)
  if (idx !== -1) { toasts.splice(idx, 1); notify() }
}

// ── Hook ──
export function useToast() {
  return toast
}

// ── Toaster component (render once at root) ──
const icons = {
  success: <CheckCircle className="w-5 h-5 text-status-ready flex-shrink-0" />,
  error:   <XCircle    className="w-5 h-5 text-status-cancelled flex-shrink-0" />,
  info:    <Info       className="w-5 h-5 text-status-process flex-shrink-0" />,
}

const bgMap = {
  success: 'bg-white border-l-4 border-status-ready',
  error:   'bg-white border-l-4 border-status-cancelled',
  info:    'bg-white border-l-4 border-status-process',
}

export function Toaster() {
  const [list, setList] = useState([])

  useEffect(() => {
    subscribers.add(setList)
    return () => subscribers.delete(setList)
  }, [])

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-sm px-4 space-y-2 pointer-events-none">
      <AnimatePresence>
        {list.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl shadow-card-hover pointer-events-auto',
              bgMap[t.type]
            )}
          >
            {icons[t.type]}
            <p className="flex-1 text-sm font-medium text-ink-primary">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="text-ink-muted hover:text-ink-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
