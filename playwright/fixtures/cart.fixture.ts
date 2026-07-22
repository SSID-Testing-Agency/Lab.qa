import { test as authTest, expect } from './auth.fixture'
import { CartPage } from '../pages/CartPage'
import { CatalogPage } from '../pages/CatalogPage'

type CartFixtures = {
  cartPage: CartPage
  addProductsToCart: (productIds: string[]) => Promise<void>
}

export const test = authTest.extend<CartFixtures>({
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page))
  },

  addProductsToCart: async ({ page }, use) => {
    await use(async (productIds: string[]) => {
      const catalogPage = new CatalogPage(page)
      await catalogPage.goto()
      for (const id of productIds) {
        await catalogPage.addToCartButton(id).click()
      }
    })
  },
})

export { expect }
