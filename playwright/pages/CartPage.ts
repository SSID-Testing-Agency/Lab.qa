import { type Page, type Locator, expect } from '@playwright/test'

export class CartPage {
  readonly container: Locator
  readonly emptyMessage: Locator
  readonly subtotal: Locator
  readonly tax: Locator
  readonly total: Locator
  readonly checkoutButton: Locator
  readonly cartCount: Locator

  constructor(readonly page: Page) {
    this.container      = page.getByTestId('cart-container')
    this.emptyMessage   = page.getByTestId('cart-empty')
    this.subtotal       = page.getByTestId('cart-subtotal')
    this.tax            = page.getByTestId('cart-tax')
    this.total          = page.getByTestId('cart-total')
    this.checkoutButton = page.getByTestId('cart-checkout-button')
    this.cartCount      = page.getByTestId('cart-count')
  }

  async goto() {
    await this.page.goto('./#/cart')
  }

  cartItem(id: string) {
    return this.page.getByTestId(`cart-item-${id}`)
  }

  quantityInput(id: string) {
    return this.page.getByTestId(`cart-quantity-${id}`)
  }

  removeButton(id: string) {
    return this.page.getByTestId(`cart-remove-${id}`)
  }

  async expectItemCount(count: number) {
    await expect(this.page.locator('[data-testid^="cart-item-"]')).toHaveCount(count)
  }

  async getTotal(): Promise<number> {
    const text = await this.total.innerText()
    return parseFloat(text.replace(' €', '').replace(',', '.'))
  }
}
