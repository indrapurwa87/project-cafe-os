import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import Modal from '@/shared/components/Modal'
import Button from '@/shared/components/Button'
import Input from '@/shared/components/Input'
import { toast } from '@/shared/components/Toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/api/axios'

export default function CategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset } = useForm()
  const queryClient = useQueryClient()

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/menu/categories')
      return res.data
    }
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['categories'] })

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editing) return api.put(`/menu/categories/${editing.id}`, data)
      return api.post('/menu/categories', data)
    },
    onSuccess: () => {
      toast.success(editing ? 'Kategori diperbarui!' : 'Kategori ditambahkan!')
      invalidate()
      setModalOpen(false); setEditing(null); reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal menyimpan kategori')
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/menu/categories/${id}`),
    onSuccess: () => { toast.success('Kategori dihapus'); invalidate() },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal menghapus kategori')
  })

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-ink-primary">Manajemen Kategori</h1>
        <Button size="sm" icon={<Plus className="w-4 h-4" />}
          onClick={() => { setEditing(null); reset(); setModalOpen(true) }}>
          Tambah
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card divide-y divide-ink-placeholder/10 overflow-hidden">
        {isLoading ? (
          <div className="px-5 py-8 text-center text-ink-muted text-sm">
            <span className="inline-block w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2" />
            Memuat kategori...
          </div>
        ) : categories.map(cat => (
          <div key={cat.id} className="flex items-center justify-between px-5 py-4 hover:bg-surface-muted transition-colors">
            <div>
              <p className="font-semibold text-ink-primary">{cat.name}</p>
              {cat.description && <p className="text-xs text-ink-muted mt-0.5">{cat.description}</p>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditing(cat); reset({ name: cat.name, description: cat.description }); setModalOpen(true) }}
                className="p-1.5 hover:bg-surface-muted rounded-lg text-ink-muted hover:text-brand-500"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => { if (confirm('Hapus kategori ini? Semua menu di kategori ini juga akan terhapus.')) deleteMutation.mutate(cat.id) }}
                className="p-1.5 hover:bg-red-50 rounded-lg text-ink-muted hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Kategori' : 'Tambah Kategori'} size="sm">
        <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="p-6 space-y-4">
          <Input label="Nama Kategori" required placeholder="contoh: Minuman" {...register('name', { required: true })} />
          <Input label="Deskripsi" placeholder="opsional..." {...register('description')} />
          <div className="flex gap-3">
            <Button type="submit" className="flex-1" loading={saveMutation.isPending}>Simpan</Button>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Batal</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
