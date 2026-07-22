import { useState, type FormEvent } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { useBugStore } from '@/store/bugStore'
import { useCheckoutStore } from '@/store/checkoutStore'
import { CheckoutStepper } from '@/components/CheckoutStepper'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { DELIVERY_OPTIONS } from '@/types'
import type { CheckoutForm } from '@/types'
import { formatPrice } from '@/utils/price'

type FieldErrors = Partial<Record<keyof CheckoutForm, string>>

export function CheckoutInfoPage() {
  const navigate = useNavigate()
  const { isEmpty } = useCart()
  const storedForm = useCheckoutStore(s => s.form)
  const setForm = useCheckoutStore(s => s.setForm)
  const hasBug = useBugStore(s => s.hasBug)

  const [data, setData] = useState<CheckoutForm>(() => storedForm ?? {
    firstName: '',
    lastName: '',
    email: '',
    postalCode: '',
    delivery: 'standard',
  })
  const [errors, setErrors] = useState<FieldErrors>({})

  if (isEmpty) return <Navigate to="/cart" replace />

  const isValid =
    !!data.firstName.trim() &&
    !!data.lastName.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
    /^\d{5}$/.test(data.postalCode)

  function validate(): FieldErrors {
    const e: FieldErrors = {}
    if (!data.firstName.trim()) e.firstName = 'Le prénom est requis'
    if (!data.lastName.trim()) e.lastName = 'Le nom est requis'
    if (!data.email.trim()) e.email = "L'email est requis"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "L'adresse email n'est pas valide"
    if (!data.postalCode.trim()) e.postalCode = 'Le code postal est requis'
    else if (!/^\d{5}$/.test(data.postalCode)) e.postalCode = 'Le code postal doit contenir 5 chiffres'
    return e
  }

  function updateField(key: keyof CheckoutForm, value: string) {
    setData(d => ({ ...d, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!hasBug('invalid-form-accepted')) {
      const fieldErrors = validate()
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors)
        return
      }
    }

    setForm(data)
    navigate('/checkout/review')
  }

  return (
    <div className="max-w-lg mx-auto">
      <Breadcrumb items={[
        { label: 'Catalogue', to: '/catalog' },
        { label: 'Panier', to: '/cart' },
        { label: 'Livraison' },
      ]} />
      <div className="mb-8">
        <CheckoutStepper current="info" />
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <h1 className="text-lg font-medium text-fg mb-6">Informations de livraison</h1>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="first-name"
              label="Prénom"
              type="text"
              autoComplete="given-name"
              value={data.firstName}
              onChange={e => updateField('firstName', e.target.value)}
              data-testid="checkout-first-name"
              placeholder="Jane"
              error={errors.firstName}
            />
            <Input
              id="last-name"
              label="Nom"
              type="text"
              autoComplete="family-name"
              value={data.lastName}
              onChange={e => updateField('lastName', e.target.value)}
              data-testid="checkout-last-name"
              placeholder="Doe"
              error={errors.lastName}
            />
          </div>

          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={data.email}
            onChange={e => updateField('email', e.target.value)}
            data-testid="checkout-email"
            placeholder="jane.doe@example.com"
            error={errors.email}
          />

          <Input
            id="postal-code"
            label="Code postal"
            type="text"
            autoComplete="postal-code"
            value={data.postalCode}
            onChange={e => updateField('postalCode', e.target.value)}
            data-testid="checkout-postal-code"
            placeholder="75001"
            inputMode="numeric"
            maxLength={5}
            error={errors.postalCode}
          />

          <fieldset className="flex flex-col gap-2 border-none p-0 m-0">
            <legend className="text-sm font-medium text-fg mb-1">Mode de livraison</legend>
            {DELIVERY_OPTIONS.map(opt => (
              <label
                key={opt.value}
                data-testid={`delivery-${opt.value}`}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-md border cursor-pointer transition-colors ${
                  data.delivery === opt.value
                    ? 'border-accent bg-[var(--accent-subtle)]'
                    : 'border-border hover:border-border-strong'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value={opt.value}
                  checked={data.delivery === opt.value}
                  onChange={() => updateField('delivery', opt.value)}
                  className="sr-only"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-fg">{opt.label}</span>
                  <span className="text-xs text-fg-muted">{opt.desc}</span>
                </span>
                <span className="text-sm font-mono font-medium text-fg shrink-0">
                  {opt.price === 0 ? 'Gratuit' : formatPrice(opt.price / 100)}
                </span>
              </label>
            ))}
          </fieldset>

          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="secondary"
              data-testid="checkout-cancel"
              onClick={() => navigate('/cart')}
            >
              Retour
            </Button>
            <Button
              type="submit"
              data-testid="checkout-continue"
              className="flex-1"
              disabled={!hasBug('invalid-form-accepted') && !isValid}
            >
              Continuer →
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
