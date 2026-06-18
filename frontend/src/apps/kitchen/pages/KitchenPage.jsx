import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Volume2, VolumeX, Clock, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MOCK_MENU, MOCK_CATEGORIES } from '@/shared/mock/mockData'
import OrderTicket from '../components/OrderTicket'

// Generate mock kitchen orders
function generateMockOrders() {
  return [
    {
      id: 'k-1', tableNumber: 3, customerName: 'Budi',
      status: 'pending',
      kitchenNote: 'Jangan terlalu pedas',
      created_at: new Date(Date.now() - 2 * 60000).toISOString(),
      items: [
        { name: 'Nasi Goreng Spesial', quantity: 1, notes: 'Tanpa bawang' },
        { name: 'Es Teh Manis', quantity: 2, notes: '' },
      ],
    },
    {
      id: 'k-2', tableNumber: 7, customerName: 'Siti',
      status: 'pending',
      kitchenNote: '',
      created_at: new Date(Date.now() - 1 * 60000).toISOString(),
      items: [
        { name: 'Kopi Susu Gula Aren', quantity: 2, notes: 'Extra shot' },
        { name: 'Roti Bakar Coklat', quantity: 1, notes: '' },
      ],
    },
    {
      id: 'k-3', tableNumber: 1, customerName: 'Ahmad',
      status: 'processing',
      kitchenNote: '',
      created_at: new Date(Date.now() - 8 * 60000).toISOString(),
      items: [
        { name: 'Ayam Bakar Madu', quantity: 1, notes: '' },
        { name: 'Jus Alpukat', quantity: 1, notes: 'Tanpa es' },
      ],
    },
    {
      id: 'k-4', tableNumber: 5, customerName: 'Dewi',
      status: 'ready',
      kitchenNote: '',
      created_at: new Date(Date.now() - 15 * 60000).toISOString(),
      items: [
        { name: 'Matcha Latte', quantity: 1, notes: '' },
      ],
    },
  ]
}

const TABS = [
  { key: 'pending',    label: 'Baru',   color: 'text-status-new' },
  { key: 'processing', label: 'Proses', color: 'text-status-process' },
  { key: 'ready',      label: 'Siap',   color: 'text-status-ready' },
]

export default function KitchenPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pending')
  const [soundOn, setSoundOn] = useState(true)
  const [now, setNow] = useState(Date.now())
  const [orders, setOrders] = useState(generateMockOrders())

  // Tick every second
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const updateStatus = (orderId, status) => {
    setOrders(prev =>
      status === 'done'
        ? prev.filter(o => o.id !== orderId)
        : prev.map(o => o.id === orderId ? { ...o, status } : o)
    )
  }

  const tabOrders = orders.filter(o => o.status === activeTab)
  const counts = { pending: 0, processing: 0, ready: 0 }
  orders.forEach(o => { if (counts[o.status] !== undefined) counts[o.status]++ })

  return (
    <div className="min-h-dvh bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👨‍🍳</span>
          <div>
            <h1 className="font-heading font-bold text-xl text-white">Kitchen Display</h1>
            <p className="text-xs text-gray-400">
              {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {counts.pending > 0 && (
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center gap-1.5 bg-amber-500/20 px-3 py-1.5 rounded-full"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400">{counts.pending} pesanan baru</span>
            </motion.div>
          )}
          <button onClick={() => setSoundOn(s => !s)} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400">
            {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={() => { localStorage.removeItem('cafeos_kitchen_token'); navigate('/kitchen/login') }}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 flex gap-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 text-sm font-semibold font-heading transition-colors relative ${
              activeTab === tab.key ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
            {counts[tab.key] > 0 && (
              <span className={`ml-1.5 ${tab.color} font-bold`}>({counts[tab.key]})</span>
            )}
            {activeTab === tab.key && (
              <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
            )}
          </button>
        ))}
      </div>

      {/* Ticket grid */}
      <main className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {tabOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-gray-600"
            >
              <Clock className="w-12 h-12 mb-3" />
              <p className="font-heading font-semibold text-lg">Tidak ada pesanan</p>
              <p className="text-sm mt-1">Pesanan baru akan muncul di sini</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {tabOrders.map(order => (
                <OrderTicket
                  key={order.id}
                  order={order}
                  now={now}
                  onAction={(status) => updateStatus(order.id, status)}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
