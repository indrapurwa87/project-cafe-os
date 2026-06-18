import { ShoppingBag } from 'lucide-react'

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
        {icon ?? <ShoppingBag className="w-9 h-9 text-brand-400" />}
      </div>
      <h3 className="font-heading font-bold text-xl text-ink-primary mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-ink-secondary max-w-xs leading-relaxed mb-6">{description}</p>
      )}
      {action}
    </div>
  )
}
