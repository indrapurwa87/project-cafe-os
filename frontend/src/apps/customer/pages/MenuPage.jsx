import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, AlertTriangle } from 'lucide-react'

import { useCustomerStore } from '@/shared/hooks/useCustomerStore'
import { useCartStore } from '@/shared/hooks/useCartStore'
import { debounce } from '@/shared/utils/format'
import { SkeletonCard } from '@/shared/components/Skeleton'
import EmptyState from '@/shared/components/EmptyState'
import MenuCard from '../components/MenuCard'
import CategoryTabs from '../components/CategoryTabs'
import CartFAB from '../components/CartFAB'
import ItemDetailSheet from '../components/ItemDetailSheet'
import { useQuery } from '@tanstack/react-query'
import api from '@/shared/api/axios'

export default function MenuPage() {
  const { tableId, tenantSlug } = useParams()
  const navigate = useNavigate()
  const { name, tableNumber, setTable } = useCustomerStore()
  const itemCount = useCartStore(s => s.itemCount)

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [tableError, setTableError] = useState(false)

  // Fetch table info from backend if not in store (direct QR scan bypass)
  useEffect(() => {
    if (!tableNumber && tableId) {
      api.get(`/tables/h/${tableId}`)
        .then(res => setTable({ tableId: String(res.data.id), tableNumber: res.data.table_number }))
        .catch((err) => {
          console.error('Table verification failed:', err)
          setTableError(true)
        })
    }
  }, [tableId, tableNumber, setTable])

  // Fetch categories from backend
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/menu/categories')
      return res.data
    }
  })

  // Fetch menu from backend
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      const res = await api.get('/menu')
      return res.data
    }
  })

  if (tableError) {
    return (
      <div className="page-customer flex flex-col items-center justify-center min-h-dvh bg-gradient-to-b from-brand-50 to-surface-warm p-6">
        <div className="bg-surface rounded-2xl shadow-card border border-brand-100 p-8 text-center max-w-sm space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-extrabold text-xl text-ink-primary">Meja Tidak Terdaftar</h2>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Nomor meja ini tidak terdaftar di sistem kami. Silakan hubungi pelayan atau periksa kembali QR Code meja Anda.
          </p>
        </div>
      </div>
    )
  }

  // Guard — jika belum isi identitas
  if (!name) {
    return <Navigate to={`/c/${tenantSlug}/menu/${tableId}/identify`} replace />
  }

  const handleSearch = debounce((val) => setSearchQuery(val), 300)

  const filteredItems = useMemo(() => {
    let items = menuItems
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
  }, [selectedCategory, searchQuery, menuItems])

  // Group by category for "All" view
  const groupedItems = useMemo(() => {
    if (selectedCategory !== 'all' || searchQuery) return null
    const groups = {}
    categories.forEach(cat => {
      const items = menuItems.filter(i => i.category_id === cat.id)
      if (items.length > 0) groups[cat.name] = items
    })
    return groups
  }, [selectedCategory, searchQuery, categories, menuItems])

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
          categories={categories}
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
            onClick={() => navigate(`/c/${tenantSlug}/menu/${tableId}/cart`)}
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
