import { useRef } from 'react'
import { cn } from '@/shared/utils/cn'

export default function CategoryTabs({ categories, selected, onChange }) {
  const scrollRef = useRef(null)

  const allCategories = [
    { id: 'all', name: 'Semua' },
    ...categories,
  ]

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5"
    >
      {allCategories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            selected === cat.id ? 'chip-active' : 'chip-inactive',
            'flex-shrink-0'
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
