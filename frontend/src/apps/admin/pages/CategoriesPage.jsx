import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { MOCK_CATEGORIES } from '@/shared/mock/mockData'
import { useForm } from 'react-hook-form'
import Modal from '@/shared/components/Modal'
import Button from '@/shared/components/Button'
import Input from '@/shared/components/Input'
import { toast } from '@/shared/components/Toast'

export default function CategoriesPage() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset } = useForm()

  const handleSave = (data) => {
    if (editing) {
      setCategories(prev => prev.map(c => c.id === editing.id ? { ...c, ...data } : c))
      toast.success('Kategori diperbarui!')
    } else {
      setCategories(prev => [...prev, { ...data, id: `cat-${Date.now()}` }])
      toast.success('Kategori ditambahkan!')
    }
    setModalOpen(false); setEditing(null); reset()
  }

  const handleDelete = (id) => {
    if (confirm('Hapus kategori ini?')) {
      setCategories(prev => prev.filter(c => c.id !== id))
      toast.success('Kategori dihapus')
    }
  }

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
        {categories.map(cat => (
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
                onClick={() => handleDelete(cat.id)}
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
        <form onSubmit={handleSubmit(handleSave)} className="p-6 space-y-4">
          <Input label="Nama Kategori" required placeholder="contoh: Minuman" {...register('name', { required: true })} />
          <Input label="Deskripsi" placeholder="opsional..." {...register('description')} />
          <div className="flex gap-3">
            <Button type="submit" className="flex-1">Simpan</Button>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Batal</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
