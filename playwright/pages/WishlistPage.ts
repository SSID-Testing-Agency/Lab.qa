import { type Page, type Locator } from '@playwright/test'

export class WishlistPage {
  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto('./#/wishlist')
  }

  item(id: string): Locator { return this.page.getByTestId(`wishlist-item-${id}`) }
  addToCartButton(id: string): Locator { return this.page.getByTestId(`wishlist-add-to-cart-${id}`) }
  chooseSizeAction(id: string): Locator { return this.page.getByTestId(`wishlist-choose-size-${id}`) }
  outOfStockAction(id: string): Locator { return this.page.getByTestId(`wishlist-out-of-stock-${id}`) }
  maxReachedAction(id: string): Locator { return this.page.getByTestId(`wishlist-max-reached-${id}`) }
  removeButton(id: string): Locator { return this.page.getByTestId(`wishlist-remove-${id}`) }
}
