import { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { useCheckoutStore } from '@/store/checkoutStore'
import { CheckoutStepper } from '@/components/CheckoutStepper'
import type { OrderSummary } from '@/types'
import { formatPrice } from '@/utils/price'

export function ConfirmationPage() {
  const location = useLocation()
  const summary: OrderSummary | undefined = location.state?.summary
  const clearCart = useCartStore(s => s.clearCart)
  const clearForm = useCheckoutStore(s => s.clearForm)

  useEffect(() => {
    clearCart()
    clearForm()
  }, [])

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <CheckoutStepper current="confirmation" />
      </div>

      <div
        data-testid="confirmation-container"
        className="bg-surface border border-border rounded-lg p-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-success/20 border border-success/40 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#3fb950" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1
          data-testid="confirmation-title"
          className="text-xl font-medium text-fg mb-2"
        >
          Commande confirmée !
        </h1>

        {summary && (
          <p className="text-sm font-mono text-fg-muted mb-1">
            {summary.orderId}
          </p>
        )}

        <p className="text-sm text-fg-muted mb-8">
          Merci pour votre achat. Votre commande a bien été enregistrée.
        </p>

        {summary && (
          <div className="text-sm text-fg-muted bg-canvas rounded p-4 text-left mb-8 flex flex-col gap-0.5">
            <p className="text-fg font-medium">
              {summary.customerInfo.firstName} {summary.customerInfo.lastName}
            </p>
            <p>{summary.customerInfo.email}</p>
            <p>Code postal : {summary.customerInfo.postalCode}</p>
            <p className="mt-2 font-mono font-medium text-fg">
              Total payé : {formatPrice(summary.total / 100)}
            </p>
          </div>
        )}

        <Link
          to="/catalog"
          data-testid="confirmation-home"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-canvas font-medium rounded-md hover:bg-accent-hover transition-colors no-underline"
        >
          Retour au catalogue
        </Link>
      </div>
    </div>
  )
}
