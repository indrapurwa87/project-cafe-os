import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldAlert, LogOut, Users, CheckCircle, AlertTriangle, Plus,
  Globe, ExternalLink, Calendar, Key, Ban, UserCheck, ShieldAlert as SaaSAlert
} from 'lucide-react'
import api from '@/shared/api/axios'
import { formatRupiah } from '@/shared/utils/format'
import { toast } from '@/shared/components/Toast'

export default function SuperAdminDashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCredentialsModal, setShowCredentialsModal] = useState(null) // holds credentials after creation

  // Form State
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [plan, setPlan] = useState('monthly')
  const [submitting, setSubmitting] = useState(false)

  // Fetch Tenants
  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const res = await api.get('/super/tenants')
      return res.data
    }
  })

  // Mutations
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await api.patch(`/super/tenants/${id}/status`, { status })
    },
    onSuccess: (res, variables) => {
      toast.success(`Client berhasil ${variables.status === 'active' ? 'diaktifkan' : 'ditangguhkan'}`)
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
    onError: () => {
      toast.error('Gagal memperbarui status client')
    }
  })

  const extendSubscriptionMutation = useMutation({
    mutationFn: async ({ id, plan }) => {
      const res = await api.patch(`/super/tenants/${id}/extend`, { plan })
      return res.data
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Langganan berhasil diperpanjang!')
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
    onError: () => {
      toast.error('Gagal memperpanjang langganan')
    }
  })

  const handleCreateTenant = async (e) => {
    e.preventDefault()
    if (!name.trim() || !slug.trim() || !ownerName.trim() || !ownerEmail.trim()) {
      toast.error('Semua kolom wajib diisi')
      return
    }

    setSubmitting(true)
    try {
      const res = await api.post('/super/tenants', {
        name: name.trim(),
        slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''),
        owner_name: ownerName.trim(),
        owner_email: ownerEmail.trim(),
        plan
      })
      
      // Close creation modal, show credentials, refresh data
      setShowAddModal(false)
      setShowCredentialsModal({
        name,
        dbName: `cafeos_${slug.toLowerCase().replace(/-/g, '_')}`,
        ...res.data.defaultCredentials
      })
      queryClient.invalidateQueries({ queryKey: ['tenants'] })

      // Reset form
      setName('')
      setSlug('')
      setOwnerName('')
      setOwnerEmail('')
      setPlan('monthly')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membuat client baru')
    } finally {
      setSubmitting(false)
    }
  }

  const handleNameChange = (val) => {
    setName(val)
    // Auto-generate slug from name
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
    setSlug(generatedSlug)
  }

  const handleLogout = () => {
    localStorage.removeItem('cafeos_super_token')
    toast.success('Keluar berhasil')
    navigate('/super-admin/login')
  }

  // Calculate Metrics
  const activeTenantsCount = tenants.filter(t => t.status === 'active' && new Date(t.expires_at) >= new Date()).length
  const suspendedTenantsCount = tenants.filter(t => t.status === 'suspended').length
  const expiredTenantsCount = tenants.filter(t => t.status === 'active' && new Date(t.expires_at) < new Date()).length
  
  // Rp 250.000 for monthly, Rp 2.400.000 for yearly (monthly average Rp 200.000)
  const estimatedMRR = tenants
    .filter(t => t.status === 'active')
    .reduce((sum, t) => sum + (t.plan === 'yearly' ? 200000 : 250000), 0)

  return (
    <div className="min-h-dvh flex flex-col bg-surface-warm text-ink-primary font-sans overflow-x-hidden">
      {/* Header */}
      <header className="bg-surface border-b border-brand-100 px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-glow">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-base text-ink-primary">CaféOS Cloud</h1>
            <p className="text-xs text-ink-secondary">SaaS Platform Control Center</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-ink-secondary hover:text-brand-600 transition-colors p-2 rounded-xl hover:bg-brand-50 flex items-center gap-2 text-xs font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-surface border border-brand-100 rounded-2xl p-5 flex items-center gap-4 shadow-card">
            <div className="w-12 h-12 bg-brand-100 text-brand-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-ink-secondary font-medium">Total Client Cafe</p>
              <h2 className="text-2xl font-bold font-mono text-ink-primary mt-0.5">{tenants.length}</h2>
            </div>
          </div>

          <div className="bg-surface border border-brand-100 rounded-2xl p-5 flex items-center gap-4 shadow-card">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-ink-secondary font-medium">Pelanggan Aktif</p>
              <h2 className="text-2xl font-bold font-mono text-emerald-600 mt-0.5">{activeTenantsCount}</h2>
            </div>
          </div>

          <div className="bg-surface border border-brand-100 rounded-2xl p-5 flex items-center gap-4 shadow-card">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-ink-secondary font-medium">Sudah Kedaluwarsa</p>
              <h2 className="text-2xl font-bold font-mono text-amber-600 mt-0.5">{expiredTenantsCount}</h2>
            </div>
          </div>

          <div className="bg-surface border border-brand-100 rounded-2xl p-5 flex items-center gap-4 shadow-card">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold">Rp</span>
            </div>
            <div>
              <p className="text-xs text-ink-secondary font-medium">Estimasi Pendapatan/Bulan</p>
              <h2 className="text-xl font-extrabold font-mono text-blue-600 mt-0.5">{formatRupiah(estimatedMRR)}</h2>
            </div>
          </div>
        </div>

        {/* Client Management Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-ink-primary">Manajemen Client (Tenant)</h3>
            <p className="text-xs text-ink-secondary mt-0.5">Daftar client penyewa aplikasi CaféOS yang aktif di database MySQL</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-glow hover:shadow-glow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Client Baru
          </button>
        </div>

        {/* Tenant Table */}
        <div className="bg-surface border border-brand-100 rounded-2xl overflow-hidden shadow-card">
          {isLoading ? (
            <div className="text-center py-12 text-ink-secondary text-sm">
              <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Memuat data client...
            </div>
          ) : tenants.length === 0 ? (
            <div className="text-center py-16 text-ink-secondary text-sm">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-30 text-brand-500" />
              <p className="font-bold text-ink-primary">Belum ada client cafe</p>
              <p className="text-xs mt-1">Klik tombol di atas untuk mendaftarkan cafe pertama Anda!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-50/50 text-brand-900 font-semibold border-b border-brand-100">
                    <th className="p-4">Nama Cafe</th>
                    <th className="p-4">Pemilik (Owner)</th>
                    <th className="p-4">Rute Aplikasi (URL)</th>
                    <th className="p-4">Paket / Masa Aktif</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100/50">
                  {tenants.map(t => {
                    const isExpired = new Date(t.expires_at) < new Date()
                    let statusBadge = (
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                        Aktif
                      </span>
                    )

                    if (t.status === 'suspended') {
                      statusBadge = (
                        <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-semibold border border-red-200">
                          Suspended
                        </span>
                      )
                    } else if (isExpired) {
                      statusBadge = (
                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
                          Expired
                        </span>
                      )
                    }

                    return (
                      <tr key={t.id} className="hover:bg-brand-50/10 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-ink-primary">{t.name}</div>
                          <div className="text-[10px] text-ink-secondary mt-0.5 font-mono">DB: {t.db_name}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-ink-primary">{t.owner_name}</div>
                          <div className="text-ink-secondary mt-0.5">{t.owner_email}</div>
                        </td>
                        <td className="p-4 font-mono text-brand-700 hover:text-brand-800">
                          <div className="space-y-1">
                            <a
                              href={`/c/${t.slug}/menu`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 hover:underline"
                            >
                              /c/{t.slug}/menu
                              <ExternalLink className="w-3 h-3 text-brand-500" />
                            </a>
                            <br />
                            <a
                              href={`/c/${t.slug}/admin`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 hover:underline text-ink-secondary hover:text-ink-primary text-[10px]"
                            >
                              /c/{t.slug}/admin
                              <ExternalLink className="w-2.5 h-2.5 text-ink-muted" />
                            </a>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="capitalize font-semibold text-ink-primary">{t.plan === 'yearly' ? 'Tahunan' : 'Bulanan'}</span>
                          <div className="text-ink-secondary flex items-center gap-1 mt-1">
                            <Calendar className="w-3.5 h-3.5 text-brand-500" />
                            {new Date(t.expires_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                          </div>
                        </td>
                        <td className="p-4">{statusBadge}</td>
                        <td className="p-4 text-right space-y-1.5 md:space-y-0 md:space-x-2 whitespace-nowrap">
                          {/* Toggle Status */}
                          {t.status === 'active' ? (
                            <button
                              onClick={() => toggleStatusMutation.mutate({ id: t.id, status: 'suspended' })}
                              className="bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1.5 rounded-lg border border-red-200 transition-all font-semibold"
                              title="Suspend Client"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleStatusMutation.mutate({ id: t.id, status: 'active' })}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-all font-semibold"
                              title="Aktifkan Client"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Extend Subscriptions */}
                          <button
                            onClick={() => extendSubscriptionMutation.mutate({ id: t.id, plan: 'monthly' })}
                            className="bg-brand-500 hover:bg-brand-600 text-white px-2.5 py-1.5 rounded-lg transition-all font-bold"
                          >
                            +30 Hari
                          </button>
                          <button
                            onClick={() => extendSubscriptionMutation.mutate({ id: t.id, plan: 'yearly' })}
                            className="bg-surface border border-brand-200 hover:bg-brand-50 text-brand-700 px-2.5 py-1.5 rounded-lg transition-all font-bold"
                          >
                            +1 Tahun
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ── Provisioning Form Modal ── */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-surface border border-brand-100 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <h3 className="font-heading font-extrabold text-xl mb-1 text-ink-primary">Tambah Client Baru</h3>
              <p className="text-xs text-ink-secondary mb-6">Mendaftarkan tenant baru dan memprovisi database terisolasi.</p>

              <form onSubmit={handleCreateTenant} className="space-y-4">
                {/* Cafe Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ink-secondary uppercase">Nama Cafe</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Contoh: Kopi Kenangan"
                    className="w-full bg-surface-muted border border-brand-100 rounded-xl px-4 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-brand-500 transition-all"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ink-secondary uppercase">URL Slug (Identitas URL)</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="kopi-kenangan"
                    className="w-full bg-surface-muted border border-brand-100 rounded-xl px-4 py-2.5 text-xs font-mono text-brand-700 focus:outline-none focus:border-brand-500 transition-all"
                  />
                  <p className="text-[10px] text-ink-secondary">URL Anda: http://localhost:3000/c/{slug || 'slug-khas'}</p>
                </div>

                {/* Owner Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ink-secondary uppercase">Nama Pemilik (Owner)</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Contoh: Budi Prasetyo"
                    className="w-full bg-surface-muted border border-brand-100 rounded-xl px-4 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-brand-500 transition-all"
                  />
                </div>

                {/* Owner Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ink-secondary uppercase">Email Pemilik (Sekaligus Akun Admin)</label>
                  <input
                    type="email"
                    required
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="budi@example.com"
                    className="w-full bg-surface-muted border border-brand-100 rounded-xl px-4 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-brand-500 transition-all"
                  />
                </div>

                {/* Subscription Plan */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ink-secondary uppercase">Paket Awal</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className="w-full bg-surface-muted border border-brand-100 rounded-xl px-4 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-brand-500 transition-all"
                  >
                    <option value="monthly">Bulanan (30 Hari)</option>
                    <option value="yearly">Tahunan (365 Hari)</option>
                  </select>
                </div>

                <div className="flex gap-3 mt-6 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-surface-muted hover:bg-brand-50 text-ink-secondary text-xs font-bold py-3 rounded-xl transition-all border border-brand-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-glow flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : 'Provisi Tenant'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Success Credentials Modal ── */}
      <AnimatePresence>
        {showCredentialsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-surface border border-brand-100 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative"
            >
              <div className="w-14 h-14 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-200">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-ink-primary mb-1">Tenant Siap Digunakan!</h3>
              <p className="text-xs text-ink-secondary mb-6">Database & user administrator berhasil diprovisi untuk **{showCredentialsModal.name}**.</p>

              <div className="bg-brand-50/50 border border-brand-100 rounded-2xl p-4 text-left space-y-3 mb-6">
                <div>
                  <p className="text-[10px] text-ink-muted uppercase font-bold">Nama Database</p>
                  <p className="text-xs font-mono text-ink-primary">{showCredentialsModal.dbName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-ink-muted uppercase font-bold">Akun Admin</p>
                  <p className="text-xs font-mono text-brand-700">{showCredentialsModal.username}</p>
                </div>
                <div>
                  <p className="text-[10px] text-ink-muted uppercase font-bold">Password Default</p>
                  <p className="text-xs font-mono text-brand-700">{showCredentialsModal.password}</p>
                </div>
              </div>

              <button
                onClick={() => setShowCredentialsModal(null)}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl transition-all shadow-glow text-xs"
              >
                Selesai & Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
