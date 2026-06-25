import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Volume2, VolumeX, Clock, LogOut } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { MOCK_MENU, MOCK_CATEGORIES } from '@/shared/mock/mockData'
import OrderTicket from '../components/OrderTicket'
import api from '@/shared/api/axios'
import { io } from 'socket.io-client'

const TABS = [
  { key: 'pending',    label: 'Baru',   color: 'text-status-new' },
  { key: 'processing', label: 'Proses', color: 'text-status-process' },
  { key: 'ready',      label: 'Siap',   color: 'text-status-ready' },
]

export default function KitchenPage() {
  const navigate = useNavigate()
  const { tenantSlug } = useParams()
  const [activeTab, setActiveTab] = useState('pending')
  const [soundOn, setSoundOn] = useState(true)
  const [now, setNow] = useState(Date.now())
  const [orders, setOrders] = useState([])
  const soundOnRef = useRef(true)

  // Keep ref in sync so socket callbacks always read latest value
  useEffect(() => { soundOnRef.current = soundOn }, [soundOn])

  // ── Alarm beep sound (tot-tot-tot) using Web Audio API ──
  const playChimeSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const beepCount = 3
      const freq = 1800       // High-pitched frequency (Hz)
      const beepDur = 0.15    // Each beep duration (seconds)
      const gap = 0.12        // Gap between beeps (seconds)

      for (let i = 0; i < beepCount; i++) {
        const startTime = ctx.currentTime + i * (beepDur + gap)
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'square'   // Harsh, alarm-like tone
        osc.frequency.setValueAtTime(freq, startTime)
        gain.gain.setValueAtTime(0.45, startTime)
        gain.gain.setValueAtTime(0, startTime + beepDur) // Sharp cut
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(startTime)
        osc.stop(startTime + beepDur + 0.01)
      }

      setTimeout(() => ctx.close(), 1500)
    } catch (err) {
      console.error('Alarm beep failed:', err)
    }
  }

  // ── Voice AI using SpeechSynthesis ──
  const speakAnnouncement = (tableNumber) => {
    try {
      if (!('speechSynthesis' in window)) return
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const text = `Ada pesanan masuk, Meja ${tableNumber}`
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'id-ID'
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Try to pick an Indonesian voice, fallback to default
      const voices = window.speechSynthesis.getVoices()
      const idVoice = voices.find(v => v.lang.startsWith('id')) || voices.find(v => v.lang.startsWith('ms')) || null
      if (idVoice) utterance.voice = idVoice

      window.speechSynthesis.speak(utterance)
    } catch (err) {
      console.error('Speech synthesis failed:', err)
    }
  }

  // ── Combined notification: chime + voice ──
  const notifyNewOrder = (tableNumber) => {
    if (!soundOnRef.current) return
    playChimeSound()
    // Slight delay so chime plays first, then voice
    setTimeout(() => speakAnnouncement(tableNumber), 800)
  }

  // ── 30-second reminder for pending orders ──
  const ordersRef = useRef([])
  const remindedRef = useRef(new Set()) // track which orders have been reminded

  useEffect(() => { ordersRef.current = orders }, [orders])

  useEffect(() => {
    const reminderInterval = setInterval(() => {
      if (!soundOnRef.current) return

      const pendingOrders = ordersRef.current.filter(o => o.status === 'pending')
      if (pendingOrders.length === 0) {
        remindedRef.current.clear()
        return
      }

      // Find first pending order that hasn't been reminded yet in this cycle
      let target = pendingOrders.find(o => !remindedRef.current.has(o.id))

      // If all have been reminded, reset and start over
      if (!target) {
        remindedRef.current.clear()
        target = pendingOrders[0]
      }

      remindedRef.current.add(target.id)

      playChimeSound()
      setTimeout(() => {
        speakAnnouncement(target.tableNumber)
      }, 800)
    }, 20000) // 20 seconds

    return () => clearInterval(reminderInterval)
  }, [])

  // Ensure voices are loaded (some browsers load them asynchronously)
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices()
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
    }
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders')
      setOrders(res.data)
    } catch (err) {
      console.error('Failed to fetch kitchen orders:', err)
    }
  }

  useEffect(() => {
    fetchOrders()

    const socket = io()

    socket.on('order:new', (newOrder) => {
      setOrders(prev => {
        if (prev.some(o => o.id === newOrder.id)) return prev
        notifyNewOrder(newOrder.tableNumber)
        return [newOrder, ...prev]
      })
    })

    socket.on('order:status_changed', (data) => {
      setOrders(prev => {
        if (data.status === 'done') {
          return prev.filter(o => o.id !== data.orderId)
        }
        const updated = prev.map(o => o.id === data.orderId ? { ...o, status: data.status } : o)
        // If order moved out of pending, remove from reminded set
        if (data.status !== 'pending') {
          remindedRef.current.delete(data.orderId)
        }
        return updated
      })
    })

    const t = setInterval(() => setNow(Date.now()), 1000)

    return () => {
      clearInterval(t)
      socket.disconnect()
    }
  }, [])

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status })
      setOrders(prev =>
        status === 'done'
          ? prev.filter(o => o.id !== orderId)
          : prev.map(o => o.id === orderId ? { ...o, status } : o)
      )
    } catch (err) {
      console.error('Failed to update status:', err)
    }
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
            onClick={() => { localStorage.removeItem('cafeos_kitchen_token'); navigate(`/c/${tenantSlug}/kitchen/login`) }}
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
