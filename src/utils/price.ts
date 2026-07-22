const FMT = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

export function formatPrice(euros: number): string {
  return FMT.format(euros)
}
