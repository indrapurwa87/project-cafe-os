import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid
} from 'recharts'
import {
  MOCK_STATS, MOCK_TOP_ITEMS, MOCK_PAYMENT_BREAKDOWN, MOCK_HOURLY
} from '@/shared/mock/mockData'
import { formatRupiah } from '@/shared/utils/format'

const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#F97316']

export default function ReportsPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-heading font-bold text-2xl text-ink-primary">Laporan & Analitik</h1>
        <p className="text-sm text-ink-muted">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue Hari Ini',   value: formatRupiah(MOCK_STATS.revenueToday) },
          { label: 'Total Pesanan',      value: MOCK_STATS.ordersToday },
          { label: 'Total Item Terjual', value: MOCK_TOP_ITEMS.reduce((s, i) => s + i.quantity, 0) },
          { label: 'Rata-rata Pesanan',  value: formatRupiah(MOCK_STATS.avgOrderValue) },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-card">
            <p className="text-xs text-ink-muted font-semibold uppercase tracking-wide">{card.label}</p>
            <p className="font-heading font-extrabold text-2xl text-ink-primary mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top items */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h2 className="font-heading font-bold text-lg text-ink-primary mb-4">Menu Terlaris</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MOCK_TOP_ITEMS} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} width={130} />
              <Tooltip
                formatter={(v) => [v, 'Terjual']}
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="quantity" fill="#F59E0B" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment methods pie */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h2 className="font-heading font-bold text-lg text-ink-primary mb-4">Metode Pembayaran</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={MOCK_PAYMENT_BREAKDOWN}
                dataKey="amount"
                nameKey="method"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={55}
                paddingAngle={3}
              >
                {MOCK_PAYMENT_BREAKDOWN.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [formatRupiah(v), 'Revenue']}
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {MOCK_PAYMENT_BREAKDOWN.map((item, i) => (
              <div key={item.method} className="flex items-center gap-1.5 text-xs text-ink-secondary">
                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                {item.method}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue per hour */}
      <div className="bg-white rounded-2xl p-5 shadow-card">
        <h2 className="font-heading font-bold text-lg text-ink-primary mb-4">Revenue per Jam</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={MOCK_HOURLY}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip
              formatter={(v) => [formatRupiah(v), 'Revenue']}
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="revenue" fill="#F59E0B" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
