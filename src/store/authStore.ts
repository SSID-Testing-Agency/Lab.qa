import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '@/data/users'

interface AuthState {
  username: string | null
  role: UserRole | null
  isAuthenticated: boolean
  login: (username: string, role: UserRole) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      username: null,
      role: null,
      isAuthenticated: false,
      login: (username, role) => set({ username, role, isAuthenticated: true }),
      logout: () => set({ username: null, role: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
)
