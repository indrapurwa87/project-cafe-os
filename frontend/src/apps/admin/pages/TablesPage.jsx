import { useState } from 'react'
import { QrCode, Plus, Download } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import Modal from '@/shared/components/Modal'
import Button from '@/shared/components/Button'
import Input from '@/shared/components/Input'
import { toast } from '@/shared/components/Toast'
import { useForm } from 'react-hook-form'
import { cn } from '@/shared/utils/cn'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/api/axios'

const BASE_URL = window.location.origin

function TableCard({ table, onShowQR }) {
  const isOccupied = table.status === 'occupied'
  return (
    <div className={cn(
      'bg-white rounded-2xl shadow-card p-5 space-y-3 border-2 transition-colors',
      isOccupied ? 'border-orange-200' : 'border-green-200'
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-heading font-extrabold text-3xl text-ink-primary">
            {String(table.table_number).padStart(2, '0')}
          </p>
          <p className="text-xs text-ink-muted">Meja</p>
        </div>
        <span className={cn(
          'text-xs font-bold px-2.5 py-1 rounded-full',
          isOccupied
            ? 'bg-orange-100 text-orange-600'
            : 'bg-green-100 text-green-600'
        )}>
          {isOccupied ? '● Terisi' : '● Tersedia'}
        </span>
      </div>
      {table.capacity && (
        <p className="text-xs text-ink-secondary">👥 {table.capacity} orang</p>
      )}
      <Button
        variant="secondary"
        size="sm"
        className="w-full"
        icon={<QrCode className="w-4 h-4" />}
        onClick={() => onShowQR(table)}
      >
        QR Code
      </Button>
    </div>
  )
}

function QRModal({ table, onClose }) {
  if (!table) return null
  // QR URL points to menu/{tableId} — use table.id (numeric primary key)
  const url = `${BASE_URL}/menu/${table.id}`

  const downloadQR = () => {
    const canvas = document.getElementById('qr-canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `qr-meja-${table.table_number}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    toast.success('QR Code berhasil didownload!')
  }

  return (
    <Modal isOpen={Boolean(table)} onClose={onClose} title={`QR Code — Meja ${table.table_number}`} size="sm">
      <div className="p-6 flex flex-col items-center gap-5">
        {/* QR */}
        <div className="p-4 bg-white rounded-2xl border-2 border-ink-placeholder/20 shadow-card">
          <QRCodeCanvas
            id="qr-canvas"
            value={url}
            size={180}
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Info */}
        <div className="text-center space-y-1">
          <p className="font-heading font-bold text-xl text-ink-primary">Meja {table.table_number}</p>
          <p className="text-xs text-ink-muted break-all max-w-xs">{url}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <Button onClick={downloadQR} icon={<Download className="w-4 h-4" />} className="flex-1">
            Download PNG
          </Button>
          <Button variant="secondary" onClick={onClose} className="flex-1">Tutup</Button>
        </div>
      </div>
    </Modal>
  )
}

export default function TablesPage() {
  const [addOpen, setAddOpen] = useState(false)
  const [qrTable, setQrTable] = useState(null)
  const { register, handleSubmit, reset } = useForm()
  const queryClient = useQueryClient()

  const { data: tables = [], isLoading } = useQuery({
    queryKey: ['admin-tables'],
    queryFn: async () => {
      const res = await api.get('/tables')
      return res.data
    }
  })

  const addMutation = useMutation({
    mutationFn: (data) => api.post('/tables', {
      table_number: Number(data.table_number),
      capacity: Number(data.capacity) || 4
    }),
    onSuccess: () => {
      toast.success('Meja berhasil ditambahkan!')
      queryClient.invalidateQueries({ queryKey: ['admin-tables'] })
      setAddOpen(false); reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal menambahkan meja')
  })

  const handleAdd = (data) => addMutation.mutate(data)

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-ink-primary">Meja & QR Code</h1>
          <p className="text-sm text-ink-muted">{tables.length} meja terdaftar</p>
        </div>
        <Button onClick={() => setAddOpen(true)} icon={<Plus className="w-4 h-4" />} size="sm">
          Tambah Meja
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-ink-muted text-sm">
          <span className="inline-block w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2" />
          Memuat data meja...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {tables.map(table => (
            <TableCard key={table.id} table={table} onShowQR={setQrTable} />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Tambah Meja Baru" size="sm">
        <form onSubmit={handleSubmit(handleAdd)} className="p-6 space-y-4">
          <Input label="Nomor Meja" type="number" required placeholder="contoh: 13"
            {...register('table_number', { required: true })} />
          <Input label="Kapasitas (orang)" type="number" placeholder="contoh: 4"
            {...register('capacity')} />
          <div className="flex gap-3">
            <Button type="submit" className="flex-1" loading={addMutation.isPending}>Tambah Meja</Button>
            <Button type="button" variant="secondary" onClick={() => setAddOpen(false)}>Batal</Button>
          </div>
        </form>
      </Modal>

      {/* QR Modal */}
      <QRModal table={qrTable} onClose={() => setQrTable(null)} />
    </div>
  )
}
