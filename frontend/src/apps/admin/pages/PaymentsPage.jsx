import { MOCK_ORDERS } from '@/shared/mock/mockData'
import { formatRupiah } from '@/shared/utils/format'
import Badge from '@/shared/components/Badge'

const MOCK_PAYMENTS = MOCK_ORDERS.map((o, i) => ({
  id: o.id,
  transactionId: `TRX-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
  tableNumber: o.tableNumber,
  customerName: o.customerName,
  method: o.paymentMethod,
  amount: o.totalAmount,
  status: o.status === 'done' ? 'paid' : o.status === 'cancelled' ? 'failed' : 'pending',
  created_at: o.created_at,
}))

export default function PaymentsPage() {
  return (
    <div className="space-y-5 max-w-6xl">
      <div>
        <h1 className="font-heading font-bold text-2xl text-ink-primary">Riwayat Pembayaran</h1>
        <p className="text-sm text-ink-muted">{MOCK_PAYMENTS.length} transaksi hari ini</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-placeholder/20 bg-surface-muted">
                {['#Transaksi', 'Meja', 'Pelanggan', 'Metode', 'Jumlah', 'Status', 'Waktu'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-placeholder/10">
              {MOCK_PAYMENTS.map(p => (
                <tr key={p.id} className="hover:bg-surface-muted transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-ink-muted">{p.transactionId}</td>
                  <td className="px-4 py-3 font-heading font-bold text-sm">Meja {p.tableNumber}</td>
                  <td className="px-4 py-3 text-sm text-ink-secondary">{p.customerName}</td>
                  <td className="px-4 py-3 text-sm text-ink-secondary capitalize">{p.method}</td>
                  <td className="px-4 py-3 font-heading font-bold text-sm text-brand-600">{formatRupiah(p.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      p.status === 'paid'    ? 'bg-green-100 text-green-700' :
                      p.status === 'failed'  ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {p.status === 'paid' ? '✓ Lunas' : p.status === 'failed' ? '✗ Gagal' : '⏳ Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted">
                    {new Date(p.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
