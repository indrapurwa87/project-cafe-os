import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, RefreshCw } from 'lucide-react'
import { formatRupiah } from '@/shared/utils/format'
import Badge from '@/shared/components/Badge'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/api/axios'
import { toast } from '@/shared/components/Toast'
import { io } from 'socket.io-client'
import { useEffect } from 'react'

const STATUS_FILTERS = ['all', 'pending', 'processing', 'ready', 'done', 'cancelled']

const PAYMENT_LABELS = {
  qris: '📱 QRIS',
  gopay: '💚 GoPay',
  ovo: '💜 OVO',
  dana: '🔵 DANA',
  shopeepay: '🧡 ShopeePay',
  bca: '🏦 VA BCA',
  bni: '🏦 VA BNI',
  bri: '🏦 VA BRI',
  mandiri: '🏦 VA Mandiri',
  cash: '💵 Tunai',
}

function paymentLabel(method) {
  return PAYMENT_LABELS[method] || method || '-'
}

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-orders-page'],
    queryFn: async () => {
      const res = await api.get('/orders')
      return res.data
    },
    refetchInterval: 60000
  })

  // Real-time order updates via Socket.io
  useEffect(() => {
    const socket = io()

    socket.on('order:new', () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders-page'] })
    })

    socket.on('order:status_changed', () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders-page'] })
    })

    return () => socket.disconnect()
  }, [queryClient])

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/orders/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders-page'] })
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success('Status pesanan diperbarui')
    },
    onError: () => toast.error('Gagal memperbarui status')
  })

  const filtered = orders.filter(o =>
    (statusFilter === 'all' || o.status === statusFilter) &&
    (!search || o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    String(o.tableNumber).includes(search))
  )

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-ink-primary">Manajemen Pesanan</h1>
        <button
          onClick={() => refetch()}
          className="p-2 rounded-lg hover:bg-surface-muted text-ink-muted transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            className="input-base pl-10 py-2.5 text-sm"
            placeholder="Cari nama atau nomor meja..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`chip flex-shrink-0 ${statusFilter === s ? 'chip-active' : 'chip-inactive'}`}
            >
              {s === 'all' ? 'Semua' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-placeholder/20 bg-surface-muted">
                {['#ID', 'Meja', 'Pelanggan', 'Item', 'Subtotal', 'Pajak', 'Total', 'Pembayaran', 'Status', 'Waktu', 'Aksi'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-placeholder/10">
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-ink-muted text-sm">
                    <span className="inline-block w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2" />
                    Memuat pesanan...
                  </td>
                </tr>
              ) : filtered.map(order => {
                // totalAmount includes 10% tax: total = subtotal + (subtotal * 0.1)
                // so subtotal = totalAmount / 1.1
                const subtotal = Math.round(order.totalAmount / 1.1)
                const tax = order.totalAmount - subtotal

                return (
                <tr key={order.id} className="hover:bg-surface-muted transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-ink-muted">
                    #{String(order.id).slice(-4).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 font-heading font-bold text-ink-primary whitespace-nowrap">
                    Meja {order.tableNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-secondary">{order.customerName}</td>
                  <td className="px-4 py-3 text-sm text-ink-secondary">{order.itemCount} item</td>
                  <td className="px-4 py-3 text-sm text-ink-secondary whitespace-nowrap">
                    {formatRupiah(subtotal)}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-muted whitespace-nowrap">
                    {formatRupiah(tax)}
                  </td>
                  <td className="px-4 py-3 font-heading font-bold text-sm text-brand-600 whitespace-nowrap">
                    {formatRupiah(order.totalAmount)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-surface-muted px-2.5 py-1 rounded-full text-ink-secondary">
                      {paymentLabel(order.paymentMethod)}
                    </span>
                  </td>
                  <td className="px-4 py-3"><Badge status={order.status} /></td>
                  <td className="px-4 py-3 text-xs text-ink-muted whitespace-nowrap">
                    {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'processing' })}
                        className="text-xs font-semibold text-status-process hover:underline"
                      >
                        Proses
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'ready' })}
                        className="text-xs font-semibold text-status-ready hover:underline"
                      >
                        Siap
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'done' })}
                        className="text-xs font-semibold text-ink-muted hover:underline"
                      >
                        Selesai
                      </button>
                    )}
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-12 text-ink-muted text-sm">Tidak ada pesanan</div>
          )}
        </div>
      </div>
    </div>
  )
}
