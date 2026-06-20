import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formatRupiah } from '@/shared/utils/format'
import { toast } from '@/shared/components/Toast'
import api from '@/shared/api/axios'
import { CheckCircle, RefreshCw } from 'lucide-react'

export default function PaymentsPage() {
  const queryClient = useQueryClient()

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const res = await api.get('/orders')
      return res.data
    },
    refetchInterval: 30000
  })

  // Confirm payment mutation
  const confirmPayMutation = useMutation({
    mutationFn: (id) => api.patch(`/orders/${id}/pay`),
    onSuccess: () => {
      toast.success('Pembayaran dikonfirmasi!')
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
    onError: () => toast.error('Gagal mengkonfirmasi pembayaran')
  })

  // Only show orders that are at least "ready" or "done" for payment tracking
  const payments = orders.map(o => ({
    id: o.id,
    transactionId: `TRX-${String(o.id).slice(-8).toUpperCase()}`,
    tableNumber: o.tableNumber,
    customerName: o.customerName,
    method: o.paymentMethod,
    amount: o.totalAmount,
    paymentStatus: o.paymentStatus,
    orderStatus: o.status,
    created_at: o.created_at,
  }))

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-ink-primary">Riwayat Pembayaran</h1>
          <p className="text-sm text-ink-muted">{payments.length} transaksi</p>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2 rounded-lg hover:bg-surface-muted text-ink-muted transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-placeholder/20 bg-surface-muted">
                {['#Transaksi', 'Meja', 'Pelanggan', 'Metode', 'Jumlah', 'Pembayaran', 'Pesanan', 'Waktu', 'Aksi'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-placeholder/10">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-ink-muted text-sm">
                    <span className="inline-block w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2" />
                    Memuat pembayaran...
                  </td>
                </tr>
              ) : payments.map(p => (
                <tr key={p.id} className="hover:bg-surface-muted transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-ink-muted">{p.transactionId}</td>
                  <td className="px-4 py-3 font-heading font-bold text-sm">Meja {p.tableNumber}</td>
                  <td className="px-4 py-3 text-sm text-ink-secondary">{p.customerName}</td>
                  <td className="px-4 py-3 text-sm text-ink-secondary capitalize">{p.method?.replace('_', ' ')}</td>
                  <td className="px-4 py-3 font-heading font-bold text-sm text-brand-600">{formatRupiah(p.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      p.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {p.paymentStatus === 'paid' ? '✓ Lunas' : '⏳ Belum Bayar'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      p.orderStatus === 'done' ? 'bg-green-100 text-green-700' :
                      p.orderStatus === 'ready' ? 'bg-blue-100 text-blue-700' :
                      p.orderStatus === 'processing' ? 'bg-orange-100 text-orange-700' :
                      p.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {p.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted">
                    {new Date(p.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="px-4 py-3">
                    {p.paymentStatus !== 'paid' && (
                      <button
                        onClick={() => {
                          if (confirm(`Konfirmasi pembayaran untuk Meja ${p.tableNumber}?`)) {
                            confirmPayMutation.mutate(p.id)
                          }
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-status-ready hover:underline"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Konfirmasi
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!isLoading && payments.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-ink-muted text-sm">
                    Belum ada transaksi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
