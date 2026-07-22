import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { useCheckoutStore } from '@/store/checkoutStore'
import { submitPayment } from '@/api/payment'
import { CheckoutStepper } from '@/components/CheckoutStepper'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { OrderSummary } from '@/types'
import { formatPrice } from '@/utils/price'

type PaymentStatus = 'idle' | 'loading' | 'declined' | 'error'

interface CardForm {
  number: string
  expiry: string
  cvc: string
  name: string
}

type CardFieldErrors = Partial<Record<keyof CardForm, string>>

const TEST_CARDS = [
  { number: '4242 4242 4242 4242', label: 'Paiement accepté', color: 'text-success' },
  { number: '4000 0000 0000 0002', label: 'Paiement refusé',  color: 'text-danger'  },
  { number: '4000 0000 0000 9995', label: 'Erreur serveur',   color: 'text-warning' },
]

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})(?=.)/g, '$1 ')
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export function CheckoutPaymentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isEmpty } = useCart()
  const form = useCheckoutStore(s => s.form)
  const summary: OrderSummary | undefined = location.state?.summary

  const [card, setCard] = useState<CardForm>({ number: '', expiry: '', cvc: '', name: '' })
  const [errors, setErrors] = useState<CardFieldErrors>({})
  const [status, setStatus] = useState<PaymentStatus>('idle')

  if (isEmpty || !form || !summary) return <Navigate to="/cart" replace />

  const isLoading = status === 'loading'
  const hasFailed = status === 'declined' || status === 'error'

  function validateCard(): CardFieldErrors {
    const e: CardFieldErrors = {}
    const digits = card.number.replace(/\s/g, '')
    if (!digits) e.number = 'Le numéro de carte est requis'
    else if (digits.length !== 16) e.number = 'Le numéro doit contenir 16 chiffres'
    if (!card.expiry) e.expiry = "La date d'expiration est requise"
    else if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = 'Format MM/AA attendu'
    if (!card.cvc) e.cvc = 'Le cryptogramme est requis'
    else if (!/^\d{3}$/.test(card.cvc)) e.cvc = '3 chiffres requis'
    if (!card.name.trim()) e.name = 'Le nom du porteur est requis'
    return e
  }

  function updateCard(key: keyof CardForm, value: string) {
    setCard(c => ({ ...c, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
    if (hasFailed) setStatus('idle')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const fieldErrors = validateCard()
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    setStatus('loading')
    const result = await submitPayment({ cardNumber: card.number, orderId: summary!.orderId })

    if (result === 'success') {
      navigate('/checkout/confirmation', { state: { summary } })
    } else {
      setStatus(result)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <Breadcrumb items={[
        { label: 'Catalogue', to: '/catalog' },
        { label: 'Panier', to: '/cart' },
        { label: 'Récapitulatif', to: '/checkout/review' },
        { label: 'Paiement' },
      ]} />
      <div className="mb-8">
        <CheckoutStepper current="payment" />
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <h1 className="text-lg font-medium text-fg mb-1">Paiement</h1>
        <p className="text-sm text-fg-muted mb-6">
          Total à régler :{' '}
          <span className="font-mono font-semibold text-fg">
            {formatPrice(summary.total / 100)}
          </span>
        </p>

        {status === 'declined' && (
          <div
            data-testid="payment-error-declined"
            role="alert"
            className="mb-4 text-sm text-danger bg-danger-bg border border-danger/30 rounded-md px-4 py-3"
          >
            <p className="font-medium">Paiement refusé</p>
            <p className="mt-0.5 opacity-80">Vérifiez vos informations ou utilisez une autre carte.</p>
          </div>
        )}

        {status === 'error' && (
          <div
            data-testid="payment-error-server"
            role="alert"
            className="mb-4 text-sm bg-[var(--warning-subtle)] border border-warning/30 rounded-md px-4 py-3"
          >
            <p className="font-medium text-warning">Erreur serveur</p>
            <p className="mt-0.5 text-fg-muted">Une erreur inattendue s'est produite. Veuillez réessayer.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            id="card-number"
            label="Numéro de carte"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            value={card.number}
            onChange={e => updateCard('number', formatCardNumber(e.target.value))}
            data-testid="payment-card-number"
            placeholder="4242 4242 4242 4242"
            error={errors.number}
            disabled={isLoading}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              id="card-expiry"
              label="Date d'expiration"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              value={card.expiry}
              onChange={e => updateCard('expiry', formatExpiry(e.target.value))}
              data-testid="payment-expiry"
              placeholder="MM/AA"
              error={errors.expiry}
              disabled={isLoading}
            />
            <Input
              id="card-cvc"
              label="Cryptogramme"
              type="text"
              inputMode="numeric"
              autoComplete="cc-csc"
              value={card.cvc}
              onChange={e => updateCard('cvc', e.target.value.replace(/\D/g, '').slice(0, 3))}
              data-testid="payment-cvc"
              placeholder="123"
              error={errors.cvc}
              disabled={isLoading}
            />
          </div>

          <Input
            id="card-name"
            label="Nom du porteur"
            type="text"
            autoComplete="cc-name"
            value={card.name}
            onChange={e => updateCard('name', e.target.value)}
            data-testid="payment-name"
            placeholder="JANE DOE"
            error={errors.name}
            disabled={isLoading}
          />

          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="secondary"
              data-testid="payment-back"
              onClick={() => navigate('/checkout/review')}
              disabled={isLoading}
            >
              Retour
            </Button>

            {hasFailed && (
              <Button
                type="button"
                variant="secondary"
                data-testid="payment-back-cart"
                onClick={() => navigate('/cart')}
                disabled={isLoading}
              >
                Retour au panier
              </Button>
            )}

            <Button
              type="submit"
              data-testid="payment-submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Spinner /> Traitement en cours…</>
              ) : hasFailed ? (
                'Réessayer'
              ) : (
                `Payer ${formatPrice(summary.total / 100)}`
              )}
            </Button>
          </div>
        </form>
      </div>

      <details className="mt-4 bg-surface border border-border rounded-lg p-4">
        <summary className="text-sm text-fg-muted cursor-pointer hover:text-fg transition-colors select-none">
          Cartes de test disponibles
        </summary>
        <div className="mt-3 flex flex-col gap-2.5">
          {TEST_CARDS.map(tc => (
            <div key={tc.number} className="flex items-center justify-between gap-4">
              <span className="font-mono text-sm text-accent">{tc.number}</span>
              <span className={`text-xs shrink-0 ${tc.color}`}>{tc.label}</span>
            </div>
          ))}
          <p className="text-xs text-fg-faint mt-1">
            Date d'expiration : toute date future &mdash; CVC : n'importe quel chiffre
          </p>
        </div>
      </details>
    </div>
  )
}
