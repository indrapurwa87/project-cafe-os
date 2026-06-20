import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react'
import { formatRupiah } from '@/shared/utils/format'
import Modal from '@/shared/components/Modal'
import Button from '@/shared/components/Button'
import Input from '@/shared/components/Input'
import { toast } from '@/shared/components/Toast'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/api/axios'

export default function MenuManagePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset } = useForm()
  const queryClient = useQueryClient()

  const { data: categories = [], isLoading: catsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/menu/categories')
      return res.data
    }
  })

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      const res = await api.get('/menu')
      return res.data
    }
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['menu'] })
  }

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editing) {
        return api.put(`/menu/${editing.id}`, { ...data, price: Number(data.price) })
      }
      return api.post('/menu', { ...data, price: Number(data.price) })
    },
    onSuccess: () => {
      toast.success(editing ? 'Menu diperbarui!' : 'Menu ditambahkan!')
      invalidate()
      setModalOpen(false); setEditing(null); reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal menyimpan menu')
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_available }) => api.patch(`/menu/${id}/availability`, { is_available }),
    onSuccess: () => {
      toast.success('Status menu diperbarui')
      invalidate()
    },
    onError: () => toast.error('Gagal mengubah status menu')
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/menu/${id}`),
    onSuccess: () => {
      toast.success('Menu dihapus')
      invalidate()
    },
    onError: () => toast.error('Gagal menghapus menu')
  })

  const handleSave = (data) => saveMutation.mutate(data)

  const openAdd = () => { setEditing(null); reset(); setModalOpen(true) }
  const openEdit = (item) => {
    setEditing(item)
    reset({ name: item.name, description: item.description, price: item.price, category_id: item.category_id, image_url: item.image_url })
    setModalOpen(true)
  }

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-ink-primary">Manajemen Menu</h1>
          <p className="text-sm text-ink-muted">{menuItems.length} item menu</p>
        </div>
        <Button onClick={openAdd} icon={<Plus className="w-4 h-4" />} size="sm">
          Tambah Menu
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-placeholder/20 bg-surface-muted">
                {['Foto', 'Nama', 'Kategori', 'Harga', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-placeholder/10">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-ink-muted text-sm">
                    <span className="inline-block w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2" />
                    Memuat menu...
                  </td>
                </tr>
              ) : menuItems.map(item => (
                <tr key={item.id} className="hover:bg-surface-muted transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-muted">
                      {item.image_url
                        ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-sm text-ink-primary">{item.name}</p>
                    <p className="text-xs text-ink-muted line-clamp-1 max-w-xs">{item.description}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-secondary">
                    {categories.find(c => c.id === item.category_id)?.name ?? '-'}
                  </td>
                  <td className="px-4 py-3 font-heading font-bold text-sm text-brand-600">
                    {formatRupiah(item.price)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleMutation.mutate({ id: item.id, is_available: !item.is_available })}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                        item.is_available ? 'text-status-ready' : 'text-ink-muted'
                      }`}
                    >
                      {item.is_available
                        ? <><ToggleRight className="w-5 h-5" /> Tersedia</>
                        : <><ToggleLeft className="w-5 h-5" /> Habis</>
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-surface-muted rounded-lg text-ink-muted hover:text-brand-500">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { if (confirm('Hapus menu ini?')) deleteMutation.mutate(item.id) }}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-ink-muted hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Menu' : 'Tambah Menu'}>
        <form onSubmit={handleSubmit(handleSave)} className="p-6 space-y-4">
          <Input label="Nama Menu" required placeholder="contoh: Nasi Goreng Spesial" {...register('name', { required: true })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink-secondary font-heading">Kategori <span className="text-brand-500">*</span></label>
            <select className="input-base" {...register('category_id', { required: true })}>
              <option value="">Pilih kategori...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <Input label="Harga (Rp)" type="number" required placeholder="35000" {...register('price', { required: true })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink-secondary font-heading">Deskripsi</label>
            <textarea rows={3} className="input-base resize-none text-sm" placeholder="Deskripsi singkat menu..." {...register('description')} />
          </div>
          <Input label="URL Foto" placeholder="https://..." {...register('image_url')} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1" loading={saveMutation.isPending}>
              {editing ? 'Simpan Perubahan' : 'Tambah Menu'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Batal</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
