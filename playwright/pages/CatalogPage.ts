import { type Page, type Locator, expect } from '@playwright/test'

export class CatalogPage {
  readonly productGrid: Locator
  readonly sortSelect: Locator

  constructor(readonly page: Page) {
    this.productGrid = page.getByTestId('product-grid')
    this.sortSelect  = page.getByTestId('sort-select')
  }

  async goto() {
    await this.page.goto('./#/catalog')
  }

  productCard(id: string) {
    return this.page.getByTestId(`product-card-${id}`)
  }

  productName(id: string) {
    return this.page.getByTestId(`product-name-${id}`)
  }

  productPrice(id: string) {
    return this.page.getByTestId(`product-price-${id}`)
  }

  productImage(id: string) {
    return this.page.getByTestId(`product-image-${id}`)
  }

  addToCartButton(id: string) {
    return this.page.getByTestId(`add-to-cart-${id}`)
  }

  sizeButton(id: string, size: string) {
    return this.page.getByTestId(`size-btn-${id}-${size}`)
  }

  filterButton(category: string) {
    return category === 'all'
      ? this.page.getByTestId('sidebar-all-products')
      : this.page.getByTestId(`sidebar-category-${category}`)
  }

  async selectSort(value: string) {
    await this.sortSelect.selectOption(value)
  }

  async getAllProductNames(): Promise<string[]> {
    const cards = this.productGrid.locator('[data-testid^="product-name-"]')
    return cards.allInnerTexts()
  }

  async getAllProductPrices(): Promise<number[]> {
    const prices = this.productGrid.locator('[data-testid^="product-price-"]')
    const texts = await prices.allInnerTexts()
    return texts.map(t => parseFloat(t.replace(' €', '').replace(',', '.')))
  }

  async expectProductCount(count: number) {
    await expect(this.productGrid.locator('[data-testid^="product-card-"]')).toHaveCount(count)
  }
}
