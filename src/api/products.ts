import type { Product } from '@/data/products'
import { PRODUCTS } from '@/data/products'

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  } catch {
    return PRODUCTS
  }
}
