import { useCartStore } from '@/store/cartStore'
import { PRODUCTS_MAP, effectivePrice } from '@/data/products'

const TAX_RATE = 0.20

export function useCart() {
  const { items, appliedPromo, addItem, removeItem, updateQuantity, clearCart, applyPromo, removePromo, totalItems } = useCartStore()

  const enrichedItems = items
    .map(item => {
      const product = PRODUCTS_MAP.get(item.productId)
      if (!product) return null
      return { ...item, product }
    })
    .filter(Boolean) as Array<{ productId: string; quantity: number; size?: string; product: NonNullable<ReturnType<typeof PRODUCTS_MAP.get>> }>

  // Les prix affichés sont TTC — la TVA est incluse, non ajoutée
  const subtotal = enrichedItems.reduce((sum, i) => sum + effectivePrice(i.product) * i.quantity, 0)
  const discount = appliedPromo ? Math.round(subtotal * appliedPromo.rate) : 0
  const total = subtotal - discount
  const tax = Math.round(total * TAX_RATE / (1 + TAX_RATE))

  return {
    items: enrichedItems,
    rawItems: items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyPromo,
    removePromo,
    appliedPromo,
    totalItems: totalItems(),
    subtotal,
    discount,
    tax,
    total,
    isEmpty: items.length === 0,
  }
}
