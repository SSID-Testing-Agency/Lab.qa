import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PRODUCTS_MAP } from '@/data/products'

export interface CartItem {
  productId: string
  quantity: number
  size?: string
}

export interface AppliedPromo {
  code: string
  label: string
  rate: number
}

export const PROMO_CODES: Record<string, { label: string; rate: number }> = {
  TESTQA:     { label: '−10 %', rate: 0.10 },
  PLAYWRIGHT: { label: '−15 %', rate: 0.15 },
  SHOPLAB:    { label: '−5 %',  rate: 0.05 },
}

interface CartState {
  items: CartItem[]
  appliedPromo: AppliedPromo | null
  addItem: (productId: string, size?: string, quantity?: number) => void
  removeItem: (productId: string, size?: string) => void
  updateQuantity: (productId: string, quantity: number, size?: string) => void
  clearCart: () => void
  applyPromo: (input: string) => boolean
  removePromo: () => void
  totalItems: () => number
}

function matches(item: CartItem, productId: string, size?: string) {
  return item.productId === productId && item.size === size
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedPromo: null,
      addItem: (productId, size, quantity = 1) => {
        const product = PRODUCTS_MAP.get(productId)
        if (!product || product.inventory === 0) return
        const totalInCart = get().items
          .filter(i => i.productId === productId)
          .reduce((sum, i) => sum + i.quantity, 0)
        const available = product.inventory - totalInCart
        if (available <= 0) return
        const toAdd = Math.min(quantity, available)
        const existing = get().items.find(i => matches(i, productId, size))
        if (existing) {
          set({ items: get().items.map(i => matches(i, productId, size) ? { ...i, quantity: i.quantity + toAdd } : i) })
        } else {
          set({ items: [...get().items, { productId, quantity: toAdd, size }] })
        }
      },
      removeItem: (productId, size) =>
        set({ items: get().items.filter(i => !matches(i, productId, size)) }),
      updateQuantity: (productId, quantity, size) => {
        const product = PRODUCTS_MAP.get(productId)
        const maxQty = product?.inventory ?? 99
        const clamped = Math.min(Math.max(quantity, 0), maxQty)
        set({
          items: clamped <= 0
            ? get().items.filter(i => !matches(i, productId, size))
            : get().items.map(i => matches(i, productId, size) ? { ...i, quantity: clamped } : i),
        })
      },
      clearCart: () => set({ items: [], appliedPromo: null }),
      applyPromo: (input) => {
        const code = input.trim().toUpperCase()
        const promo = PROMO_CODES[code]
        if (!promo) return false
        set({ appliedPromo: { code, ...promo } })
        return true
      },
      removePromo: () => set({ appliedPromo: null }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
)
