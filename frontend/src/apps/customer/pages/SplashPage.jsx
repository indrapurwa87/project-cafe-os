import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MOCK_TABLE } from '@/shared/mock/mockData'
import { useCustomerStore } from '@/shared/hooks/useCustomerStore'
import api from '@/shared/api/axios'

export default function SplashPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tableParam = searchParams.get('table')
  const { name, rememberMe, setTable } = useCustomerStore()

  useEffect(() => {
    const fetchTableData = async () => {
      const id = tableParam || '1'
      try {
        const response = await api.get(`/tables/${id}`)
        const table = response.data
        setTable({ tableId: table.id, tableNumber: table.table_number })
        
        if (rememberMe && name) {
          navigate(`/menu/${table.id}`, { replace: true })
        } else {
          navigate(`/menu/${table.id}/identify`, { replace: true })
        }
      } catch (error) {
        console.error('Failed to verify table from backend, using fallback:', error)
        const table = { ...MOCK_TABLE, id: id }
        setTable({ tableId: table.id, tableNumber: table.table_number })
        
        if (rememberMe && name) {
          navigate(`/menu/${table.id}`, { replace: true })
        } else {
          navigate(`/menu/${table.id}/identify`, { replace: true })
        }
      }
    }

    const timer = setTimeout(() => {
      fetchTableData()
    }, 1500)

    return () => clearTimeout(timer)
  }, [tableParam, name, rememberMe, navigate, setTable])

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
          <h1 className="font-heading font-extrabold text-3xl text-ink-primary">CaféOS</h1>
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
