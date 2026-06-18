import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCustomerStore = create(
  persist(
    (set, get) => ({
      name: '',
      phone: '',
      tableId: null,
      tableNumber: null,
      rememberMe: false,

      setCustomer: ({ name, phone, tableId, tableNumber, rememberMe }) =>
        set({ name, phone, tableId, tableNumber, rememberMe }),

      setTable: ({ tableId, tableNumber }) =>
        set({ tableId, tableNumber }),

      clearCustomer: () =>
        set({ name: '', phone: '', tableId: null, tableNumber: null, rememberMe: false }),

      isIdentified: () => {
        const { name, phone } = get()
        return Boolean(name && phone)
      },
    }),
    {
      name: 'cafeos_customer',
      // Only persist if rememberMe is true
      partialize: (state) =>
        state.rememberMe
          ? { name: state.name, phone: state.phone, rememberMe: state.rememberMe }
          : {},
    }
  )
)
