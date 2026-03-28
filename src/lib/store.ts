// src/lib/store.ts
// Global state with Zustand — cart, user preferences

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id:       string
  title:    string
  price:    number
  image:    string
  seller:   string
  sellerId: string
  quantity: number
  stock:    number
}

interface CartStore {
  items:      CartItem[]
  addItem:    (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQty:  (id: string, qty: number) => void
  clearCart:  () => void
  total:      () => number
  count:      () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find(i => i.id === item.id)
        if (existing) {
          set(s => ({ items: s.items.map(i => i.id === item.id ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) } : i) }))
        } else {
          set(s => ({ items: [...s.items, { ...item, quantity: 1 }] }))
        }
      },

      removeItem: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),

      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id)
        } else {
          set(s => ({ items: s.items.map(i => i.id === id ? { ...i, quantity: Math.min(qty, i.stock) } : i) }))
        }
      },

      clearCart: () => set({ items: [] }),
      total:     () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count:     () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'findsolace-cart' }
  )
)
