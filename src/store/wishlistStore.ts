import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
  ids: string[]
  toggle: (id: string) => void
  remove: (id: string) => void
  clear: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const { ids } = get()
        set({ ids: ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id] })
      },
      remove: (id) => set({ ids: get().ids.filter(i => i !== id) }),
      clear: () => set({ ids: [] }),
    }),
    { name: 'wishlist-storage' }
  )
)
