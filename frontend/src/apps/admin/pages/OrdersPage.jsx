import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { MOCK_ORDERS } from '@/shared/mock/mockData'
import { formatRupiah } from '@/shared/utils/format'
import Badge from '@/shared/components/Badge'

const STATUS_FILTERS = ['all', 'pending', 'processing', 'ready', 'done', 'cancelled']

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [orders, setOrders] = useState(MOCK_ORDERS)

  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const filtered = orders.filter(o =>
    (statusFilter === 'all' || o.status === statusFilter) &&
    (!search || o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    String(o.tableNumber).includes(search))
  )

  return (
    <div className="space-y-5 max-w-6xl">
      <h1 className="font-heading font-bold text-2xl text-ink-primary">Manajemen Pesanan</h1>

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
                {['#ID', 'Meja', 'Pelanggan', 'Item', 'Total', 'Status', 'Waktu', 'Aksi'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-placeholder/10">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-surface-muted transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-ink-muted">
                    #{String(order.id).slice(-4).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 font-heading font-bold text-ink-primary">
                    Meja {order.tableNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-secondary">{order.customerName}</td>
                  <td className="px-4 py-3 text-sm text-ink-secondary">{order.itemCount} item</td>
                  <td className="px-4 py-3 font-heading font-bold text-sm text-brand-600">
                    {formatRupiah(order.totalAmount)}
                  </td>
                  <td className="px-4 py-3"><Badge status={order.status} /></td>
                  <td className="px-4 py-3 text-xs text-ink-muted">
                    {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(order.id, 'processing')}
                        className="text-xs font-semibold text-status-process hover:underline"
                      >
                        Proses
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button
                        onClick={() => updateStatus(order.id, 'ready')}
                        className="text-xs font-semibold text-status-ready hover:underline"
                      >
                        Siap
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-ink-muted text-sm">Tidak ada pesanan</div>
          )}
        </div>
      </div>
    </div>
  )
}
