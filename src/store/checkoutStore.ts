import { create } from 'zustand'
import type { CheckoutForm } from '@/types'

interface CheckoutState {
  form: CheckoutForm | null
  setForm: (form: CheckoutForm) => void
  clearForm: () => void
}

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  form: null,
  setForm: (form) => set({ form }),
  clearForm: () => set({ form: null }),
}))
