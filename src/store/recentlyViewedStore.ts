import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_ITEMS = 8

interface RecentlyViewedState {
  ids: string[]
  addViewed: (id: string) => void
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      ids: [],
      addViewed: (id) => {
        const without = get().ids.filter(i => i !== id)
        set({ ids: [id, ...without].slice(0, MAX_ITEMS) })
      },
    }),
    { name: 'recently-viewed-storage' }
  )
)
