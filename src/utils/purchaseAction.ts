export type PurchaseActionState =
  | 'out-of-stock'
  | 'max-reached'
  | 'choose-size'
  | 'add-to-cart'

export interface PurchaseActionInput {
  inventory: number
  cartQuantity: number
  hasSizes: boolean
  hasSelectedSize: boolean
}

export function getPurchaseActionState(input: PurchaseActionInput): PurchaseActionState {
  if (input.inventory === 0) return 'out-of-stock'
  if (input.inventory - input.cartQuantity <= 0) return 'max-reached'
  if (input.hasSizes && !input.hasSelectedSize) return 'choose-size'
  return 'add-to-cart'
}

export function getPurchaseActionLabel(
  state: PurchaseActionState,
  options?: { compact?: boolean },
): string {
  if (state === 'out-of-stock') return 'Rupture de stock'
  if (state === 'max-reached') return 'Max atteint'
  if (state === 'choose-size') return options?.compact ? 'Choisir taille' : 'Choisir une taille'
  return options?.compact ? '+ Panier' : 'Ajouter au panier'
}
