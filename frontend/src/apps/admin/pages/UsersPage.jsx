import { useState } from 'react'
import { Plus, Trash2, KeyRound, ChefHat, ShieldCheck, RefreshCw, Receipt } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '@/shared/api/axios'
import Modal from '@/shared/components/Modal'
import Button from '@/shared/components/Button'
import Input from '@/shared/components/Input'
import { toast } from '@/shared/components/Toast'

const ROLE_CONFIG = {
  admin: {
    label: 'Admin',
    icon: ShieldCheck,
    color: 'bg-purple-100 text-purple-700',
    desc: 'Akses penuh ke semua fitur admin panel',
  },
  kitchen: {
    label: 'Dapur',
    icon: ChefHat,
    color: 'bg-orange-100 text-orange-700',
    desc: 'Akses ke Kitchen Display System (KDS)',
  },
  cashier: {
    label: 'Kasir',
    icon: Receipt,
    color: 'bg-emerald-100 text-emerald-700',
    desc: 'Akses ke Point of Sale (POS) Kasir',
  },
}

export default function UsersPage() {
  const queryClient = useQueryClient()
  const [addOpen, setAddOpen] = useState(false)
  const [changePassTarget, setChangePassTarget] = useState(null) // { id, username }

  const addForm = useForm({ defaultValues: { username: '', password: '', role: 'kitchen' } })
  const passForm = useForm({ defaultValues: { password: '' } })

  // ── Fetch users ──
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/users')
      return res.data
    }
  })

  // ── Create user ──
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/users', data),
    onSuccess: () => {
      toast.success('User berhasil dibuat!')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setAddOpen(false)
      addForm.reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal membuat user')
  })

  // ── Change password ──
  const changePassMutation = useMutation({
    mutationFn: ({ id, password }) => api.patch(`/users/${id}/password`, { password }),
    onSuccess: () => {
      toast.success('Password/PIN berhasil diubah!')
      setChangePassTarget(null)
      passForm.reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal mengubah password')
  })

  // ── Delete user ──
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => {
      toast.success('User dihapus')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal menghapus user')
  })

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-ink-primary">Manajemen User</h1>
          <p className="text-sm text-ink-muted">Kelola akun admin, staf kasir, dan staf dapur</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => refetch()}
            className="p-2 rounded-lg hover:bg-surface-muted text-ink-muted transition-colors"
            title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setAddOpen(true)}>
            Tambah User
          </Button>
        </div>
      </div>

      {/* Role Info Cards */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
          const count = users.filter(u => u.role === key).length
          const Icon = cfg.icon
          return (
            <div key={key} className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cfg.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-heading font-bold text-2xl text-ink-primary">{count}</p>
                <p className="text-sm text-ink-muted">{cfg.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-ink-placeholder/10">
          <h2 className="font-heading font-semibold text-ink-primary">Daftar User</h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-ink-muted text-sm gap-2">
            <span className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            Memuat data user...
          </div>
        ) : (
          <div className="divide-y divide-ink-placeholder/10">
            {users.map(user => {
              const cfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.kitchen
              const Icon = cfg.icon
              return (
                <div key={user.id} className="flex items-center justify-between px-5 py-4 hover:bg-surface-muted transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-heading font-semibold text-ink-primary">{user.username}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted mt-0.5">{cfg.desc}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setChangePassTarget(user); passForm.reset() }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-ink-secondary hover:text-brand-500 px-3 py-1.5 rounded-lg hover:bg-surface-muted transition-colors"
                      title="Ganti Password/PIN"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      Ganti {user.role === 'kitchen' ? 'PIN' : 'Password'}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus user "${user.username}"?`)) {
                          deleteMutation.mutate(user.id)
                        }
                      }}
                      className="p-1.5 rounded-lg text-ink-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Hapus User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Modal: Tambah User ── */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Tambah User Baru" size="sm">
        <form
          onSubmit={addForm.handleSubmit(d => createMutation.mutate(d))}
          className="p-6 space-y-4"
        >
          {/* Role selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink-secondary font-heading">
              Role <span className="text-brand-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
                const Icon = cfg.icon
                const isSelected = addForm.watch('role') === key
                return (
                  <label
                    key={key}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-brand-400 bg-brand-50'
                        : 'border-ink-placeholder/30 hover:border-ink-placeholder'
                    }`}
                  >
                    <input
                      type="radio"
                      value={key}
                      className="sr-only"
                      {...addForm.register('role')}
                    />
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-brand-500' : 'text-ink-muted'}`} />
                    <span className={`text-sm font-semibold ${isSelected ? 'text-brand-600' : 'text-ink-secondary'}`}>
                      {cfg.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          <Input
            label="Username"
            placeholder={
              addForm.watch('role') === 'kitchen' 
                ? 'contoh: dapur1' 
                : addForm.watch('role') === 'cashier' 
                ? 'contoh: kasir1' 
                : 'contoh: admin2'
            }
            required
            {...addForm.register('username', { required: true })}
          />

          <Input
            label={addForm.watch('role') === 'kitchen' ? 'PIN (min. 4 digit)' : 'Password (min. 6 karakter)'}
            type="password"
            placeholder={addForm.watch('role') === 'kitchen' ? '••••••' : '••••••••'}
            required
            {...addForm.register('password', {
              required: true,
              minLength: addForm.watch('role') === 'kitchen' ? 4 : 6
            })}
          />

          <div className={`text-xs text-ink-muted rounded-xl p-3 ${
            addForm.watch('role') === 'kitchen' 
              ? 'bg-orange-50' 
              : addForm.watch('role') === 'cashier'
              ? 'bg-emerald-50'
              : 'bg-purple-50'
          }`}>
            {addForm.watch('role') === 'kitchen'
              ? '🍳 User dapur hanya bisa login ke Kitchen Display System via PIN.'
              : addForm.watch('role') === 'cashier'
              ? '💵 User kasir dapat mengakses halaman POS Kasir untuk mencatat pesanan.'
              : '🛡️ User admin punya akses penuh ke seluruh panel manajemen.'}
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="submit" className="flex-1" loading={createMutation.isPending}>
              Buat User
            </Button>
            <Button type="button" variant="secondary" onClick={() => setAddOpen(false)}>
              Batal
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Modal: Ganti Password/PIN ── */}
      <Modal
        isOpen={Boolean(changePassTarget)}
        onClose={() => setChangePassTarget(null)}
        title={`Ganti ${changePassTarget?.role === 'kitchen' ? 'PIN' : 'Password'} — ${changePassTarget?.username}`}
        size="sm"
      >
        <form
          onSubmit={passForm.handleSubmit(d =>
            changePassMutation.mutate({ id: changePassTarget.id, password: d.password })
          )}
          className="p-6 space-y-4"
        >
          <Input
            label={changePassTarget?.role === 'kitchen' ? 'PIN Baru (min. 4 digit)' : 'Password Baru (min. 6 karakter)'}
            type="password"
            placeholder="••••••"
            required
            {...passForm.register('password', { required: true, minLength: 4 })}
          />
          <div className="flex gap-3">
            <Button type="submit" className="flex-1" loading={changePassMutation.isPending}>
              Simpan
            </Button>
            <Button type="button" variant="secondary" onClick={() => setChangePassTarget(null)}>
              Batal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
