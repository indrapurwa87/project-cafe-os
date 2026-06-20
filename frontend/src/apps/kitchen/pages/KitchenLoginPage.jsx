import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Delete } from 'lucide-react'
import { MOCK_CREDENTIALS } from '@/shared/mock/mockData'
import { toast } from '@/shared/components/Toast'
import api from '@/shared/api/axios'

const PINS = ['1','2','3','4','5','6','7','8','9','','0','⌫']

export default function KitchenLoginPage() {
  const navigate = useNavigate()
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (fullPin) => {
    setLoading(true)
    try {
      const response = await api.post('/auth/login/kitchen', { pin: fullPin })
      localStorage.setItem('cafeos_kitchen_token', response.data.token)
      navigate('/kitchen', { replace: true })
    } catch (err) {
      setError(true)
      toast.error(err.response?.data?.message || 'PIN salah. Gunakan: 123456')
      setPin('')
      setTimeout(() => setError(false), 1000)
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (key) => {
    if (key === '⌫') { setPin(p => p.slice(0, -1)); return }
    if (!key) return
    const next = pin + key
    if (next.length > 6) return
    setPin(next)
    if (next.length === 6) setTimeout(() => handleLogin(next), 200)
  }

  return (
    <div className="min-h-dvh bg-gray-950 flex flex-col items-center justify-center gap-10 p-6">
      <div className="text-center space-y-2">
        <motion.div
          animate={{ rotate: error ? [-5, 5, -5, 5, 0] : 0 }}
          transition={{ duration: 0.4 }}
          className="text-6xl"
        >
          👨‍🍳
        </motion.div>
        <h1 className="font-heading font-bold text-3xl text-white">Kitchen Display</h1>
        <p className="text-gray-400 text-sm">Masukkan PIN 6 digit untuk masuk</p>
        <p className="text-gray-600 text-xs">Demo PIN: <span className="text-brand-400 font-mono font-bold">123456</span></p>
      </div>

      {/* PIN dots */}
      <div className="flex gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            animate={pin.length === i + 1 ? { scale: [1.4, 1] } : {}}
            className={`w-4 h-4 rounded-full border-2 transition-colors duration-200 ${
              error
                ? 'bg-red-500 border-red-500'
                : i < pin.length
                  ? 'bg-brand-500 border-brand-500'
                  : 'border-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-4 w-72">
        {PINS.map((key, i) => (
          <button
            key={i}
            onClick={() => handleKey(key)}
            disabled={loading || (!key && key !== '0')}
            className={`h-16 rounded-2xl font-heading font-bold text-xl transition-all active:scale-90
              ${key === '⌫'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : key === ''
                  ? 'invisible'
                  : 'bg-gray-800 text-white hover:bg-gray-700 shadow-lg'
              }`}
          >
            {key === '⌫' ? <Delete className="w-6 h-6 mx-auto" /> : key}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          Memverifikasi...
        </div>
      )}
    </div>
  )
}
