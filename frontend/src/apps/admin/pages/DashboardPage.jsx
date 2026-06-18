import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, ShoppingBag, TableProperties, DollarSign, Users
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import {
  MOCK_STATS, MOCK_ORDERS, MOCK_HOURLY
} from '@/shared/mock/mockData'
import { formatRupiah } from '@/shared/utils/format'
import Badge from '@/shared/components/Badge'

function StatCard({ label, value, trend, trendLabel, icon: Icon, color }) {
  const isUp = trend >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 shadow-card space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-secondary">{label}</p>
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="font-heading font-extrabold text-2xl text-ink-primary">{value}</p>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${isUp ? 'text-status-ready' : 'text-status-cancelled'}`}>
          {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {isUp ? '+' : ''}{trend}% {trendLabel}
        </div>
      )}
    </motion.div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-heading font-bold text-2xl text-ink-primary">Dashboard</h1>
        <p className="text-sm text-ink-muted mt-0.5">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Revenue Hari Ini" value={formatRupiah(MOCK_STATS.revenueToday)}
          trend={MOCK_STATS.revenueTrend} trendLabel="dari kemarin" icon={DollarSign} color="bg-brand-500" />
        <StatCard label="Total Pesanan" value={MOCK_STATS.ordersToday}
          trend={MOCK_STATS.ordersTrend} trendLabel="dari kemarin" icon={ShoppingBag} color="bg-status-process" />
        <StatCard label="Meja Aktif" value={`${MOCK_STATS.activeTables}/${MOCK_STATS.totalTables}`}
          icon={TableProperties} color="bg-status-ready" />
        <StatCard label="Rata-rata Pesanan" value={formatRupiah(MOCK_STATS.avgOrderValue)}
          trend={MOCK_STATS.avgTrend} trendLabel="dari kemarin" icon={Users} color="bg-purple-500" />
      </div>

      {/* Chart + Recent orders */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-card">
          <h2 className="font-heading font-bold text-lg text-ink-primary mb-4">Revenue Hari Ini (per jam)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MOCK_HOURLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                formatter={(v) => [formatRupiah(v), 'Revenue']}
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}
              />
              <Line
                type="monotone" dataKey="revenue" stroke="#F59E0B"
                strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#F59E0B' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h2 className="font-heading font-bold text-lg text-ink-primary mb-4">Pesanan Terbaru</h2>
          <div className="space-y-3">
            {MOCK_ORDERS.map((order) => (
              <div key={order.id} className="flex items-center gap-3 py-1">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-primary">Meja {order.tableNumber}</p>
                  <p className="text-xs text-ink-muted truncate">{order.customerName}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs font-bold text-ink-primary">{formatRupiah(order.totalAmount)}</p>
                  <Badge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
