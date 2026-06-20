import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, ChefHat, UtensilsCrossed, Plus } from 'lucide-react'
import { useCustomerStore } from '@/shared/hooks/useCustomerStore'
import Button from '@/shared/components/Button'
import { formatRupiah } from '@/shared/utils/format'
import api from '@/shared/api/axios'
import { io } from 'socket.io-client'

const STEPS = [
  { key: 'pending',    label: 'Pesanan Diterima',  icon: CheckCircle,     desc: 'Pesanan kamu sudah masuk!' },
  { key: 'processing', label: 'Sedang Dimasak',     icon: ChefHat,        desc: 'Chef sedang menyiapkanmu...' },
  { key: 'ready',      label: 'Siap Disajikan',     icon: UtensilsCrossed, desc: 'Pesananmu sudah siap!' },
  { key: 'done',       label: 'Selesai',            icon: CheckCircle,    desc: 'Selamat menikmati! 🎉' },
]

const STATUS_SEQ = ['pending', 'processing', 'ready', 'done']

export default function OrderStatusPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { name, tableNumber, tableId } = useCustomerStore()
  const [status, setStatus] = useState('pending')
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get(`/orders/${orderId}/status`)
        setStatus(response.data.status)
        setAmount(response.data.totalAmount)
      } catch (error) {
        console.error('Failed to fetch order status', error)
      }
    }
    
    fetchStatus()

    // Real-time updates via Socket.io
    const socket = io()

    socket.on('order:status_changed', (data) => {
      if (data.orderId === orderId) {
        if (data.status) setStatus(data.status)
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [orderId])

  const currentStepIdx = STATUS_SEQ.indexOf(status)

  return (
    <div className="page-customer flex flex-col min-h-dvh bg-gradient-to-b from-brand-50 to-surface-warm">
      {/* Top section */}
      <div className="px-6 pt-14 pb-8 text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center mx-auto shadow-glow"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-heading font-extrabold text-2xl text-ink-primary">
            {status === 'done' ? 'Selamat Menikmati! 🎉' : 'Pesanan Masuk!'}
          </h1>
          <p className="text-ink-secondary text-sm mt-1">
            Hi {name} · Meja {tableNumber}
          </p>
          <p className="text-xs text-ink-muted font-mono mt-0.5">
            #{String(orderId).slice(-8).toUpperCase()}
          </p>
        </motion.div>

        {status !== 'done' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-1.5 bg-white rounded-full px-4 py-1.5 shadow-card-sm"
          >
            <Clock className="w-4 h-4 text-brand-500" />
            <span className="text-xs font-semibold text-ink-secondary">Estimasi ~10 menit</span>
          </motion.div>
        )}
      </div>

      {/* Stepper */}
      <div className="flex-1 px-6 space-y-0">
        {STEPS.map((step, idx) => {
          const isDone    = idx < currentStepIdx
          const isActive  = idx === currentStepIdx
          const isPending = idx > currentStepIdx
          const Icon = step.icon

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="flex gap-4"
            >
              {/* Icon + connector line */}
              <div className="flex flex-col items-center">
                <motion.div
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                    isDone    ? 'bg-status-ready text-white' :
                    isActive  ? 'bg-brand-500 text-white shadow-glow' :
                    'bg-white border-2 border-ink-placeholder/30 text-ink-placeholder'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                {idx < STEPS.length - 1 && (
                  <motion.div
                    animate={{ height: isDone ? '100%' : '100%' }}
                    className={`w-0.5 min-h-[32px] transition-colors duration-700 ${
                      isDone ? 'bg-status-ready' : 'bg-ink-placeholder/20'
                    }`}
                  />
                )}
              </div>

              {/* Text */}
              <div className={`pt-1.5 pb-8 ${isPending ? 'opacity-40' : ''}`}>
                <p className={`font-heading font-bold text-base transition-colors duration-300 ${
                  isActive ? 'text-brand-600' : 'text-ink-primary'
                }`}>
                  {step.label}
                </p>
                {(isActive || isDone) && (
                  <p className="text-xs text-ink-secondary mt-0.5">{step.desc}</p>
                )}
                {isActive && step.key !== 'pending' && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse-dot" />
                    <span className="text-xs text-brand-600 font-medium">Sedang berlangsung...</span>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Action */}
      <div className="px-4 pb-10">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => navigate(`/menu/${tableId}`)}
          icon={<Plus className="w-5 h-5" />}
        >
          Tambah Pesanan
        </Button>
      </div>
    </div>
  )
}
