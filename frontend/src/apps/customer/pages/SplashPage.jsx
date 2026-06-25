import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { MOCK_TABLE } from '@/shared/mock/mockData'
import { useCustomerStore } from '@/shared/hooks/useCustomerStore'
import api from '@/shared/api/axios'

export default function SplashPage() {
  const [searchParams] = useSearchParams()
  const { tenantSlug } = useParams()
  const navigate = useNavigate()
  const tableParam = searchParams.get('table')
  const { name, rememberMe, setTable } = useCustomerStore()
  const [tableError, setTableError] = useState(false)

  useEffect(() => {
    const fetchTableData = async () => {
      const id = tableParam || '1'
      try {
        const response = await api.get(`/tables/${id}`)
        const table = response.data
        setTable({ tableId: table.id, tableNumber: table.table_number })
        
        if (rememberMe && name) {
          navigate(`/c/${tenantSlug}/menu/${table.hash}`, { replace: true })
        } else {
          navigate(`/c/${tenantSlug}/menu/${table.hash}/identify`, { replace: true })
        }
      } catch (error) {
        console.error('Failed to verify table from backend:', error)
        setTableError(true)
      }
    }

    const timer = setTimeout(() => {
      fetchTableData()
    }, 1500)

    return () => clearTimeout(timer)
  }, [tableParam, name, rememberMe, navigate, setTable, tenantSlug])

  if (tableError) {
    return (
      <div className="page-customer flex flex-col items-center justify-center min-h-dvh bg-gradient-to-b from-brand-50 to-surface-warm p-6">
        <div className="bg-surface rounded-2xl shadow-card border border-brand-100 p-8 text-center max-w-sm space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-extrabold text-xl text-ink-primary">Meja Tidak Terdaftar</h2>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Nomor meja ini tidak terdaftar di sistem kami. Silakan hubungi pelayan atau periksa kembali QR Code meja Anda.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-customer flex flex-col items-center justify-center min-h-dvh bg-gradient-to-b from-brand-50 to-surface-warm">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6"
      >
        {/* Logo */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="w-24 h-24 bg-brand-500 rounded-3xl flex items-center justify-center shadow-glow"
        >
          <span className="text-5xl">☕</span>
        </motion.div>

        <div className="text-center space-y-1">
          <h1 className="font-heading font-extrabold text-3xl text-ink-primary">CaféPOS</h1>
          <p className="text-ink-secondary text-sm">Pesan dengan mudah, bayar dengan cepat</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="card px-5 py-2.5 flex items-center gap-2">
            <span className="text-brand-500">🪑</span>
            <span className="font-heading font-bold text-ink-primary">
              Meja {tableParam ? MOCK_TABLE.table_number : '—'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-ink-muted text-xs">
            <span className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            Membuka menu...
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
