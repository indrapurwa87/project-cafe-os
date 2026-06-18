import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { User, Phone, ChevronRight } from 'lucide-react'
import { useCustomerStore } from '@/shared/hooks/useCustomerStore'
import Input from '@/shared/components/Input'
import Button from '@/shared/components/Button'

const schema = z.object({
  name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(50, 'Nama maksimal 50 karakter')
    .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh berisi huruf'),
  phone: z
    .string()
    .regex(/^08\d{8,11}$/, 'Format: 08xxxxxxxxxx (10–13 digit)'),
  rememberMe: z.boolean().optional(),
})

export default function IdentityPage() {
  const { tableId } = useParams()
  const navigate = useNavigate()
  const { tableNumber, setCustomer } = useCustomerStore()
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', rememberMe: false },
  })

  const onSubmit = async (values) => {
    setSubmitting(true)
    setCustomer({
      name: values.name.trim(),
      phone: values.phone.trim(),
      tableId,
      tableNumber,
      rememberMe: values.rememberMe,
    })
    navigate(`/menu/${tableId}`, { replace: true })
  }

  return (
    <div className="page-customer flex flex-col min-h-dvh bg-gradient-to-b from-brand-50 via-surface-warm to-surface-warm">
      {/* Top decorative wave */}
      <div className="h-48 bg-gradient-to-br from-brand-400 to-brand-600 relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="text-center text-white"
          >
            <div className="text-6xl mb-2">☕</div>
            <p className="font-heading font-bold text-xl">Selamat Datang!</p>
          </motion.div>
        </div>
        {/* Wave shape */}
        <svg className="absolute bottom-0 w-full" viewBox="0 0 390 30" fill="none">
          <path d="M0 30 Q195 0 390 30 L390 30 L0 30Z" fill="#FFFBF5" />
        </svg>
      </div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex-1 px-5 pt-6 pb-8 flex flex-col gap-6"
      >
        {/* Table badge */}
        {tableNumber && (
          <div className="flex justify-center">
            <span className="badge-brand px-4 py-1.5 text-sm font-bold rounded-full">
              🪑 Meja {tableNumber}
            </span>
          </div>
        )}

        <div className="space-y-1">
          <h2 className="font-heading font-extrabold text-2xl text-ink-primary">
            Siapa kamu?
          </h2>
          <p className="text-ink-secondary text-sm">
            Isi data berikut untuk mulai memesan
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nama Lengkap"
            placeholder="contoh: Budi Santoso"
            required
            prefix={<User className="w-4 h-4" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Nomor HP"
            placeholder="08xxxxxxxxxx"
            type="tel"
            inputMode="numeric"
            required
            prefix={<Phone className="w-4 h-4" />}
            hint="Format: 08xxxxxxxxxx"
            error={errors.phone?.message}
            {...register('phone')}
          />

          {/* Remember me */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded accent-brand-500 cursor-pointer"
              {...register('rememberMe')}
            />
            <div>
              <p className="text-sm font-medium text-ink-primary">
                Ingat saya di perangkat ini
              </p>
              <p className="text-xs text-ink-muted">
                Data kamu akan tersimpan untuk kunjungan berikutnya
              </p>
            </div>
          </label>

          <Button
            type="submit"
            size="lg"
            loading={submitting}
            className="mt-4"
            icon={!submitting && <ChevronRight className="w-5 h-5" />}
          >
            Mulai Pesan
          </Button>
        </form>

        <p className="text-center text-xs text-ink-muted px-4">
          Data kamu hanya digunakan untuk keperluan pesanan di cafe ini
        </p>
      </motion.div>
    </div>
  )
}
