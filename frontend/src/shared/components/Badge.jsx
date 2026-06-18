import { cn } from '../utils/cn'

const variantMap = {
  new:       'badge-new',
  pending:   'badge-new',
  process:   'badge-process',
  processing:'badge-process',
  ready:     'badge-ready',
  done:      'badge-done',
  completed: 'badge-done',
  cancelled: 'badge-cancelled',
  brand:     'badge-brand',
  paid:      'badge-ready',
  unpaid:    'badge-new',
}

const labelMap = {
  new:        '● Baru',
  pending:    '● Menunggu',
  process:    '⟳ Diproses',
  processing: '⟳ Diproses',
  ready:      '✓ Siap',
  done:       '✓ Selesai',
  completed:  '✓ Selesai',
  cancelled:  '✗ Dibatal',
  paid:       '✓ Lunas',
  unpaid:     '○ Belum Bayar',
}

export default function Badge({ status, children, className }) {
  const variant = variantMap[status] || 'badge-brand'
  return (
    <span className={cn(variant, className)}>
      {children ?? labelMap[status] ?? status}
    </span>
  )
}
