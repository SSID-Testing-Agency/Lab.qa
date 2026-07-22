export type PaymentResult = 'success' | 'declined' | 'error'

export interface PaymentPayload {
  cardNumber: string
  orderId: string
}

export const CARD_BEHAVIORS: Record<string, PaymentResult> = {
  '4242424242424242': 'success',
  '4000000000000002': 'declined',
  '4000000000009995': 'error',
}

export async function submitPayment(payload: PaymentPayload): Promise<PaymentResult> {
  try {
    const res = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.status === 500) return 'error'
    const data: { status: PaymentResult } = await res.json()
    return data.status
  } catch {
    // fallback local quand aucun serveur n'est disponible (prod statique)
    await new Promise(r => setTimeout(r, 1500))
    const stripped = payload.cardNumber.replace(/\s/g, '')
    return CARD_BEHAVIORS[stripped] ?? 'success'
  }
}
