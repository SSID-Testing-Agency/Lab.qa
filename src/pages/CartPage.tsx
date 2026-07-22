import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { useBugStore } from '@/store/bugStore'
import { CartItem } from '@/components/CartItem'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/utils/price'

interface UndoState {
  label: string
  snapshot: Array<{ productId: string; quantity: number; size?: string }>
}

export function CartPage() {
  const navigate = useNavigate()
  const { items, isEmpty, subtotal, discount, tax, total, appliedPromo, removeItem, clearCart, addItem, applyPromo, removePromo } = useCart()
  const hasBug = useBugStore(s => s.hasBug)

  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')

  const [undoState, setUndoState] = useState<UndoState | null>(null)
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showUndo(snapshot: Array<{ productId: string; quantity: number; size?: string }>, label: string) {
    if (undoTimer.current) clearTimeout(undoTimer.current)
    setUndoState({ snapshot, label })
    undoTimer.current = setTimeout(() => setUndoState(null), 5000)
  }

  function handleUndo() {
    if (!undoState) return
    if (undoTimer.current) clearTimeout(undoTimer.current)
    for (const { productId, quantity, size } of undoState.snapshot) {
      addItem(productId, size, quantity)
    }
    setUndoState(null)
  }

  function handleRemoveItem(productId: string, quantity: number, size?: string) {
    const name = items.find(i => i.productId === productId && i.size === size)?.product.name ?? 'Article'
    removeItem(productId, size)
    showUndo([{ productId, quantity, size }], `« ${name} » supprimé`)
  }

  function handleClearCart() {
    const snapshot = items.map(i => ({ productId: i.productId, quantity: i.quantity, size: i.size }))
    clearCart()
    showUndo(snapshot, 'Panier vidé')
  }

  function handleApplyPromo() {
    if (applyPromo(promoInput)) {
      setPromoError('')
      setPromoInput('')
    } else {
      setPromoError('Code promo invalide')
    }
  }

  const displayTotal = hasBug('price-off-by-one') ? total / 100 - 0.01 : total / 100

  const totalQty = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium text-fg">
          Panier
          {!isEmpty && (
            <span className="text-sm font-normal text-fg-muted ml-2">
              ({totalQty} article{totalQty > 1 ? 's' : ''})
            </span>
          )}
        </h1>
        {!isEmpty && (
          <button
            data-testid="cart-clear"
            onClick={handleClearCart}
            className="text-sm text-fg-muted hover:text-danger transition-colors bg-transparent border-none cursor-pointer"
          >
            Vider le panier
          </button>
        )}
      </div>

      {/* Undo banner */}
      {undoState && (
        <div
          data-testid="cart-undo-banner"
          role="status"
          className="mb-4 flex items-center justify-between gap-4 px-4 py-3 bg-surface border border-border rounded-lg text-sm"
        >
          <span className="text-fg-muted">{undoState.label}</span>
          <button
            data-testid="cart-undo-btn"
            onClick={handleUndo}
            className="text-accent hover:text-accent-hover font-medium bg-transparent border-none cursor-pointer shrink-0"
          >
            Annuler
          </button>
        </div>
      )}

      <div data-testid="cart-container" className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Items */}
        <div className="lg:col-span-2">
          {isEmpty ? (
            <div data-testid="cart-empty" className="bg-surface border border-border rounded-lg p-12 text-center">
              <p className="text-fg-muted mb-4">Votre panier est vide.</p>
              <Link to="/catalog">Continuer les achats →</Link>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-lg px-4">
              {items.map(item => (
                <CartItem
                  key={`${item.productId}-${item.size ?? ''}`}
                  productId={item.productId}
                  size={item.size}
                  quantity={item.quantity}
                  product={item.product}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-lg p-6 sticky top-20 flex flex-col gap-4">
            <h2 className="text-base font-medium text-fg">Récapitulatif</h2>

            {/* Lines */}
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-fg-muted">
                <span>Sous-total</span>
                <span data-testid="cart-subtotal" className="font-mono">
                  {formatPrice(subtotal / 100)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>{appliedPromo!.label} — {appliedPromo!.code}</span>
                  <span data-testid="cart-discount" className="font-mono">
                    −{formatPrice(discount / 100)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-fg-muted">
                <span>dont TVA (20 %)</span>
                <span data-testid="cart-tax" className="font-mono">
                  {formatPrice(tax / 100)}
                </span>
              </div>

              <div className="flex justify-between text-fg-muted">
                <span>Livraison</span>
                <span data-testid="cart-shipping" className="text-xs text-right leading-snug">
                  Calculée à la commande
                </span>
              </div>
            </div>

            {/* Promo code */}
            <div className="border-t border-border pt-4">
              {appliedPromo ? (
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-success">
                    Code « {appliedPromo.code} » appliqué ✓
                  </span>
                  <button
                    data-testid="cart-remove-promo"
                    onClick={() => { removePromo(); setPromoError('') }}
                    className="text-xs text-fg-muted hover:text-danger transition-colors bg-transparent border-none cursor-pointer shrink-0"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="promo-input" className="text-xs font-medium text-fg-faint uppercase tracking-wide">
                    Code promo
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="promo-input"
                      data-testid="cart-promo-input"
                      type="text"
                      value={promoInput}
                      onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoError('') }}
                      onKeyDown={e => e.key === 'Enter' && handleApplyPromo()}
                      placeholder="ex. PLAYWRIGHT"
                      className="flex-1 px-3 py-1.5 bg-canvas border border-border rounded-md text-sm text-fg placeholder:text-fg-faint focus:outline-none focus:border-accent transition-colors"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      data-testid="cart-promo-apply"
                      onClick={handleApplyPromo}
                    >
                      OK
                    </Button>
                  </div>
                  {promoError && (
                    <p data-testid="cart-promo-error" className="text-xs text-danger">
                      {promoError}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Total TTC */}
            <div className="border-t border-border pt-4 flex flex-col gap-1">
              <div className="flex items-baseline justify-between">
                <span className="text-base font-semibold text-fg">Total TTC</span>
                <span data-testid="cart-total" className="font-mono text-2xl font-bold text-fg">
                  {formatPrice(displayTotal)}
                </span>
              </div>
              <p className="text-xs text-fg-faint text-right">TVA incluse — hors livraison</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button
                size="lg"
                data-testid="cart-checkout-button"
                disabled={isEmpty}
                onClick={() => navigate('/checkout/info')}
                aria-label={isEmpty ? 'Panier vide, impossible de commander' : 'Passer la commande'}
                className="w-full"
              >
                Commander
              </Button>

              {!isEmpty && (
                <Button
                  variant="secondary"
                  size="md"
                  data-testid="cart-continue-shopping"
                  onClick={() => navigate('/catalog')}
                  className="w-full"
                >
                  ← Continuer mes achats
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
