import { test as authTest, expect } from './auth.fixture'
import { CartPage } from '../pages/CartPage'
import { CatalogPage } from '../pages/CatalogPage'

type ProductSelection = string | {
  id: string
  size?: string
  quantity?: number
}

type CartFixtures = {
  cartPage: CartPage
  addProductsToCart: (products: ProductSelection[]) => Promise<void>
}

export const test = authTest.extend<CartFixtures>({
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page))
  },

  addProductsToCart: async ({ page }, use) => {
    await use(async (products: ProductSelection[]) => {
      const catalogPage = new CatalogPage(page)
      await catalogPage.goto()
      for (const selection of products) {
        const { id, size, quantity = 1 } = typeof selection === 'string'
          ? { id: selection, size: undefined, quantity: 1 }
          : selection
        if (size) await catalogPage.sizeButton(id, size).click()
        else if (await catalogPage.chooseSizeAction(id).count()) {
          throw new Error(`A size is required to add ${id} to the cart`)
        }
        for (let i = 1; i < quantity; i++) {
          await catalogPage.productCard(id).getByTestId(`qty-increase-${id}`).click()
        }
        await catalogPage.addToCartButton(id).click()
      }
    })
  },
})

export { expect }
