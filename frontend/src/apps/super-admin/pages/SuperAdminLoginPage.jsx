import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldAlert, User, Lock, ArrowRight } from 'lucide-react'
import api from '@/shared/api/axios'
import { toast } from '@/shared/components/Toast'

export default function SuperAdminLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      toast.error('Semua kolom wajib diisi')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/super/auth/login', { username, password })
      localStorage.setItem('cafeos_super_token', res.data.token)
      toast.success('Login Super Admin Berhasil!')
      navigate('/super-admin')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login gagal, kredensial salah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-surface-warm px-4 relative overflow-hidden">
      {/* Background soft glow decoration */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-brand-300/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface border border-brand-100 rounded-3xl p-8 shadow-card relative z-10"
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-100 text-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-200">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-ink-primary">CaféOS Cloud</h1>
          <p className="text-sm text-ink-secondary mt-1">Super Admin Control Panel</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-secondary">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Super admin username"
                className="w-full bg-surface-muted border border-brand-100 rounded-xl pl-11 pr-4 py-3 text-ink-primary text-sm placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-secondary">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-muted border border-brand-100 rounded-xl pl-11 pr-4 py-3 text-ink-primary text-sm placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-glow hover:shadow-glow-lg"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Masuk Sistem
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
