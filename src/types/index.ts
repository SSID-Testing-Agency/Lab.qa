export type Size = 'S' | 'M' | 'L'

export type DeliveryOption = 'standard' | 'express' | 'pickup'

export const DELIVERY_OPTIONS: Array<{
  value: DeliveryOption
  label: string
  desc: string
  price: number
}> = [
  { value: 'standard', label: 'Standard',        desc: '5–7 jours ouvrés',    price: 399 },
  { value: 'express',  label: 'Express',          desc: '1–2 jours ouvrés',    price: 999 },
  { value: 'pickup',   label: 'Retrait magasin',  desc: 'Sous 2h en boutique', price: 0   },
]

export interface CheckoutForm {
  firstName: string
  lastName: string
  email: string
  postalCode: string
  delivery: DeliveryOption
}

export type SortOption = 'default' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'

export type Category = 'clothing' | 'accessories' | 'electronics' | 'books'

export interface OrderSummary {
  items: Array<{ productId: string; quantity: number; unitPrice: number }>
  subtotal: number
  discount: number
  tax: number
  deliveryCost: number
  total: number
  customerInfo: CheckoutForm
  orderId: string
}
