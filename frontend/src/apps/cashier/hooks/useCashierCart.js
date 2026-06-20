import { create } from 'zustand'

const computeDerived = (items) => {
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + tax
  return { itemCount, subtotal, tax, total }
}

export const useCashierCart = create((set) => ({
  items: [],
  kitchenNote: '',
  itemCount: 0,
  subtotal: 0,
  tax: 0,
  total: 0,

  addItem: (item) => set((state) => {
    const existing = state.items.find((i) => i.menuItemId === item.menuItemId)
    let newItems
    if (existing) {
      newItems = state.items.map((i) =>
        i.id === existing.id ? { ...i, qty: i.qty + 1 } : i
      )
    } else {
      newItems = [
        ...state.items,
        {
          id: `${item.menuItemId}-${Date.now()}`,
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          qty: 1,
          notes: '',
          image: item.image || null,
        },
      ]
    }
    return { items: newItems, ...computeDerived(newItems) }
  }),

  removeItem: (id) => set((state) => {
    const newItems = state.items.filter((i) => i.id !== id)
    return { items: newItems, ...computeDerived(newItems) }
  }),

  updateQty: (id, qty) => set((state) => {
    const newItems = qty <= 0
      ? state.items.filter((i) => i.id !== id)
      : state.items.map((i) => (i.id === id ? { ...i, qty } : i))
    return { items: newItems, ...computeDerived(newItems) }
  }),

  updateNotes: (id, notes) => set((state) => {
    const newItems = state.items.map((i) => (i.id === id ? { ...i, notes } : i))
    return { items: newItems, ...computeDerived(newItems) }
  }),

  setKitchenNote: (kitchenNote) => set({ kitchenNote }),

  clearCart: () => set({
    items: [], kitchenNote: '', itemCount: 0, subtotal: 0, tax: 0, total: 0
  }),
}))
