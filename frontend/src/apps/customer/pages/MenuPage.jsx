import { useState, useMemo } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import { MOCK_CATEGORIES, MOCK_MENU } from '@/shared/mock/mockData'
import { useCustomerStore } from '@/shared/hooks/useCustomerStore'
import { useCartStore } from '@/shared/hooks/useCartStore'
import { debounce } from '@/shared/utils/format'
import { SkeletonCard } from '@/shared/components/Skeleton'
import EmptyState from '@/shared/components/EmptyState'
import MenuCard from '../components/MenuCard'
import CategoryTabs from '../components/CategoryTabs'
import CartFAB from '../components/CartFAB'
import ItemDetailSheet from '../components/ItemDetailSheet'

export default function MenuPage() {
  const { tableId } = useParams()
  const navigate = useNavigate()
  const { name, tableNumber } = useCustomerStore()
  const itemCount = useCartStore(s => s.itemCount)

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [isLoading] = useState(false)

  // Guard — jika belum isi identitas
  if (!name) {
    return <Navigate to={`/menu/${tableId}/identify`} replace />
  }

  const handleSearch = debounce((val) => setSearchQuery(val), 300)

  const filteredItems = useMemo(() => {
    let items = MOCK_MENU
    if (selectedCategory !== 'all') {
      items = items.filter(i => i.category_id === selectedCategory)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q)
      )
    }
    return items
  }, [selectedCategory, searchQuery])

  // Group by category for "All" view
  const groupedItems = useMemo(() => {
    if (selectedCategory !== 'all' || searchQuery) return null
    const groups = {}
    MOCK_CATEGORIES.forEach(cat => {
      const items = MOCK_MENU.filter(i => i.category_id === cat.id)
      if (items.length > 0) groups[cat.name] = items
    })
    return groups
  }, [selectedCategory, searchQuery])

  return (
    <div className="page-customer flex flex-col min-h-dvh">
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-30 bg-surface-warm/95 backdrop-blur-sm border-b border-ink-placeholder/10 px-4 pt-4 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-muted">Selamat datang 👋</p>
            <h1 className="font-heading font-bold text-xl text-ink-primary">
              Hi, {name.split(' ')[0]}!
            </h1>
          </div>
          <span className="badge-brand px-3 py-1 text-xs font-bold rounded-full">
            🪑 Meja {tableNumber}
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="search"
            placeholder="Cari menu..."
            className="input-base pl-10 py-2.5 text-sm"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Category tabs */}
        <CategoryTabs
          categories={MOCK_CATEGORIES}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </header>

      {/* ── Content ── */}
      <main className="flex-1 px-4 pt-4 pb-32">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={<Search className="w-8 h-8 text-brand-400" />}
            title="Menu tidak ditemukan"
            description="Coba kata kunci lain atau pilih kategori berbeda"
          />
        ) : groupedItems ? (
          Object.entries(groupedItems).map(([catName, items]) => (
            <section key={catName} className="mb-6">
              <h2 className="font-heading font-bold text-lg text-ink-primary mb-3">
                {catName}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {items.map((item) => (
                  <MenuCard key={item.id} item={item} onTap={() => setSelectedItem(item)} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} onTap={() => setSelectedItem(item)} />
            ))}
          </div>
        )}
      </main>

      {/* ── Cart FAB ── */}
      <AnimatePresence>
        {itemCount > 0 && (
          <CartFAB
            count={itemCount}
            onClick={() => navigate(`/menu/${tableId}/cart`)}
          />
        )}
      </AnimatePresence>

      {/* ── Item Detail Sheet ── */}
      <ItemDetailSheet
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  )
}
