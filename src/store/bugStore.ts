import { create } from 'zustand'
import type { UserRole } from '@/data/users'

export type BugId =
  | 'broken-images'
  | 'reversed-sort'
  | 'invalid-form-accepted'
  | 'price-off-by-one'
  | 'disappearing-button'

interface BugState {
  activeBugs: Set<BugId>
  isBugMode: boolean
  hasBug: (id: BugId) => boolean
  initFromContext: (urlParam: boolean, role: UserRole | null) => void
}

export const useBugStore = create<BugState>()((set, get) => ({
  activeBugs: new Set(),
  isBugMode: false,
  hasBug: (id) => get().activeBugs.has(id),
  initFromContext: (urlParam, role) => {
    const bugs = new Set<BugId>()

    if (urlParam || role === 'problem_user') {
      bugs.add('broken-images')
      bugs.add('reversed-sort')
      bugs.add('disappearing-button')
    }
    if (urlParam) {
      bugs.add('invalid-form-accepted')
      bugs.add('price-off-by-one')
    }

    // Create a new hasBug function reference so that components subscribed to
    // s.hasBug via Object.is equality will re-render when bugs change.
    set({
      activeBugs: bugs,
      isBugMode: bugs.size > 0,
      hasBug: (id) => bugs.has(id),
    })
  },
}))
