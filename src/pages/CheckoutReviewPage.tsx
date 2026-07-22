import { useNavigate, Navigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { useBugStore } from '@/store/bugStore'
import { useCheckoutStore } from '@/store/checkoutStore'
import { CheckoutStepper } from '@/components/CheckoutStepper'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { DELIVERY_OPTIONS } from '@/types'
import type { OrderSummary } from '@/types'
import { effectivePrice } from '@/data/products'
import { formatPrice } from '@/utils/price'

export function CheckoutReviewPage() {
  const navigate = useNavigate()
  const { items, subtotal, discount, tax, total, appliedPromo, isEmpty } = useCart()
  const form = useCheckoutStore(s => s.form)
  const hasBug = useBugStore(s => s.hasBug)

  if (isEmpty || !form) return <Navigate to="/cart" replace />

  const deliveryOpt = DELIVERY_OPTIONS.find(o => o.value === form.delivery) ?? DELIVERY_OPTIONS[0]
  const deliveryCost = deliveryOpt.price

  const rawSubtotalWithTax = total / 100
  const displaySubtotalWithTax = hasBug('price-off-by-one') ? rawSubtotalWithTax - 0.01 : rawSubtotalWithTax
  const grandTotal = displaySubtotalWithTax + deliveryCost / 100

  function handleFinish() {
    const summary: OrderSummary = {
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: effectivePrice(i.product) })),
      subtotal,
      discount,
      tax,
      deliveryCost,
      total: total + deliveryCost,
      customerInfo: form!,
      orderId: `ORD-${Date.now()}`,
    }
    navigate('/checkout/payment', { state: { summary } })
  }

  return (
    <div className="max-w-lg mx-auto">
      <Breadcrumb items={[
        { label: 'Catalogue', to: '/catalog' },
        { label: 'Panier', to: '/cart' },
        { label: 'Livraison', to: '/checkout/info' },
        { label: 'Récapitulatif' },
      ]} />
      <div className="mb-8">
        <CheckoutStepper current="review" />
      </div>

      <div
        data-testid="checkout-review"
        className="bg-surface border border-border rounded-lg p-6"
      >
        <h1 className="text-lg font-medium text-fg mb-6">Récapitulatif de commande</h1>

        <div className="mb-4 p-3 bg-canvas rounded text-sm text-fg-muted flex flex-col gap-0.5">
          <p className="text-fg font-medium">{form.firstName} {form.lastName}</p>
          <p>{form.email}</p>
          <p>Code postal : {form.postalCode}</p>
          <p className="mt-1">
            Livraison : <span className="text-fg">{deliveryOpt.label}</span>
            <span className="text-fg-faint"> — {deliveryOpt.desc}</span>
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          {items.map(item => (
            <div
              key={item.productId}
              data-testid={`review-item-${item.productId}`}
              className="flex justify-between items-start text-sm"
            >
              <span className="text-fg">
                {item.product.name}
                <span className="text-fg-muted ml-1">× {item.quantity}</span>
              </span>
              <span className="font-mono text-fg ml-4 flex-shrink-0">
                {formatPrice((item.product.price * item.quantity) / 100)}
              </span>
            </div>
          ))}
        </div>

        <div className="h-px bg-border mb-4" />

        <div className="flex flex-col gap-2 text-sm mb-6">
          <div className="flex justify-between text-fg-muted">
            <span>Sous-total</span>
            <span data-testid="review-subtotal" className="font-mono">
              {formatPrice(subtotal / 100)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-success">
              <span>{appliedPromo!.label} — {appliedPromo!.code}</span>
              <span data-testid="review-discount" className="font-mono">
                −{formatPrice(discount / 100)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-fg-muted">
            <span>dont TVA (20 %)</span>
            <span data-testid="review-tax" className="font-mono">
              {formatPrice(tax / 100)}
            </span>
          </div>
          <div className="flex justify-between text-fg-muted">
            <span>Livraison ({deliveryOpt.label})</span>
            <span data-testid="review-delivery" className="font-mono">
              {deliveryCost === 0 ? 'Gratuit' : formatPrice(deliveryCost / 100)}
            </span>
          </div>
          <div className="flex justify-between font-medium text-fg">
            <span>Total</span>
            <span data-testid="review-total" className="font-mono">
              {formatPrice(grandTotal)}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            data-testid="checkout-review-back"
            onClick={() => navigate('/checkout/info')}
          >
            Retour
          </Button>
          <Button
            data-testid="checkout-finish"
            onClick={handleFinish}
            className="flex-1"
          >
            Confirmer la commande
          </Button>
        </div>
      </div>
    </div>
  )
}
