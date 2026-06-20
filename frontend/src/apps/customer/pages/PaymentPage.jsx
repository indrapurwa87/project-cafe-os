import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useCartStore } from '@/shared/hooks/useCartStore'
import { useCustomerStore } from '@/shared/hooks/useCustomerStore'
import { formatRupiah } from '@/shared/utils/format'
import { toast } from '@/shared/components/Toast'
import Button from '@/shared/components/Button'
import api from '@/shared/api/axios'

const PAYMENT_METHODS = [
  {
    group: 'Dompet Digital',
    methods: [
      { id: 'qris',      label: 'QRIS',      icon: '🔲', note: 'Semua e-wallet' },
      { id: 'gopay',     label: 'GoPay',     icon: '💚' },
      { id: 'ovo',       label: 'OVO',       icon: '💜' },
      { id: 'dana',      label: 'DANA',      icon: '🔵' },
      { id: 'shopeepay', label: 'ShopeePay', icon: '🧡' },
    ],
  },
  {
    group: 'Transfer Bank',
    methods: [
      { id: 'va_bca',     label: 'Virtual Account BCA',     icon: '🏦' },
      { id: 'va_bni',     label: 'Virtual Account BNI',     icon: '🏦' },
      { id: 'va_bri',     label: 'Virtual Account BRI',     icon: '🏦' },
      { id: 'va_mandiri', label: 'Virtual Account Mandiri', icon: '🏦' },
    ],
  },
  {
    group: 'Lainnya',
    methods: [
      { id: 'credit_card', label: 'Kartu Kredit / Debit', icon: '💳' },
      { id: 'cash',        label: 'Bayar di Kasir',        icon: '💵', note: 'Bayar tunai saat selesai' },
    ],
  },
]

export default function PaymentPage() {
  const { tableId } = useParams()
  const navigate = useNavigate()
  const { name, phone, tableNumber } = useCustomerStore()
  const { items, kitchenNote, total, clearCart } = useCartStore()
  const [selectedMethod, setSelectedMethod] = useState('qris')
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    setLoading(true)
    try {
      const response = await api.post('/orders', {
        table_id: tableId,
        customer_name: name,
        customer_phone: phone,
        items: items,
        kitchen_note: kitchenNote,
        total_amount: total,
        payment_method: selectedMethod
      })

      if (response.data.success) {
        clearCart()
        toast.success('Pesanan berhasil dibuat!')
        navigate(`/order/${response.data.orderId}/status`, { replace: true })
      } else {
        toast.error(response.data.message || 'Gagal mengirim pesanan')
      }
    } catch (error) {
      console.error('Failed to create order', error)
      toast.error('Gagal mengirim pesanan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-customer flex flex-col min-h-dvh">
      <header className="sticky top-0 z-10 bg-surface-warm/95 backdrop-blur-sm px-4 pt-6 pb-3 border-b border-ink-placeholder/10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-icon">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-bold text-xl text-ink-primary">Metode Pembayaran</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-48 space-y-5">
        {/* Order summary */}
        <div className="card p-4 space-y-2">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Ringkasan Pesanan</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-ink-secondary">
              Meja {tableNumber} · {items.reduce((s, i) => s + i.qty, 0)} item · {name}
            </span>
            <span className="font-heading font-bold text-xl text-brand-600">{formatRupiah(total)}</span>
          </div>
        </div>

        {/* Payment methods */}
        {PAYMENT_METHODS.map((group) => (
          <div key={group.group} className="space-y-2">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide px-1">
              {group.group}
            </p>
            <div className="card overflow-hidden divide-y divide-ink-placeholder/10">
              {group.methods.map((method) => (
                <motion.button
                  key={method.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMethod(method.id)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-brand-50 transition-colors"
                >
                  <span className="text-2xl w-8 text-center">{method.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm text-ink-primary">{method.label}</p>
                    {method.note && (
                      <p className="text-xs text-ink-muted">{method.note}</p>
                    )}
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    selectedMethod === method.id
                      ? 'border-brand-500 bg-brand-500'
                      : 'border-ink-placeholder'
                  }`}>
                    {selectedMethod === method.id && (
                      <CheckCircle className="w-3 h-3 text-white fill-white" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-warm/95 backdrop-blur-sm border-t border-ink-placeholder/10 px-4 py-4 max-w-md mx-auto safe-pb">
        <Button size="lg" loading={loading} onClick={handlePay}>
          Bayar Sekarang · {formatRupiah(total)}
        </Button>
      </div>
    </div>
  )
}
