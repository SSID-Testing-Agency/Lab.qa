import { type Page, type Locator } from '@playwright/test'

export class ProductPage {
  readonly title: Locator
  readonly price: Locator
  readonly description: Locator
  readonly image: Locator
  readonly addToCartButton: Locator
  readonly backLink: Locator

  constructor(readonly page: Page) {
    this.title         = page.getByTestId('product-detail-name')
    this.price         = page.getByTestId('product-detail-price')
    this.description   = page.getByTestId('product-detail-description')
    this.image         = page.getByTestId('product-detail-image')
    this.addToCartButton = page.getByTestId('product-detail-add-to-cart')
    this.backLink      = page.getByTestId('product-detail-back')
  }

  async goto(id: string) {
    await this.page.goto(`./#/product/${id}`)
  }
}
