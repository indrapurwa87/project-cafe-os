import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Lock, User, Eye, EyeOff } from 'lucide-react'
import { MOCK_CREDENTIALS } from '@/shared/mock/mockData'
import { toast } from '@/shared/components/Toast'
import Input from '@/shared/components/Input'
import Button from '@/shared/components/Button'
import api from '@/shared/api/axios'

const schema = z.object({
  email:    z.string().min(1, 'Username wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
})

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { tenantSlug } = useParams()
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: MOCK_CREDENTIALS.admin.email,
      password: MOCK_CREDENTIALS.admin.password,
    },
  })

  const onSubmit = async ({ email, password }) => {
    setLoading(true)
    try {
      const response = await api.post('/auth/login/admin', { email, password })
      localStorage.setItem('cafeos_admin_token', response.data.token)
      toast.success('Selamat datang, Admin!')
      navigate(`/c/${tenantSlug}/admin`, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email atau password salah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-elevated w-full max-w-sm overflow-hidden"
      >
        {/* Header band */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-7 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto text-3xl mb-3">
            ☕
          </div>
          <h1 className="font-heading font-bold text-xl text-white">CaféPOS Admin</h1>
          <p className="text-brand-100 text-sm mt-1">Panel Manajemen</p>
        </div>

        {/* Form */}
        <div className="px-8 py-7 space-y-5">
          {/* Hint box */}
          <div className="bg-brand-50 border border-brand-200 rounded-xl px-4 py-3 text-xs text-brand-700 space-y-0.5">
            <p className="font-semibold">🔑 Demo Credentials</p>
            <p>Username: <span className="font-mono font-bold">{MOCK_CREDENTIALS.admin.email}</span></p>
            <p>Password: <span className="font-mono font-bold">{MOCK_CREDENTIALS.admin.password}</span></p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Username"
              type="text"
              autoComplete="username"
              prefix={<User className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              autoComplete="current-password"
              prefix={<Lock className="w-4 h-4" />}
              suffix={
                <button type="button" onClick={() => setShowPass(s => !s)} className="hover:text-ink-primary transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" size="lg" loading={loading}>
              Masuk ke Dashboard
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
