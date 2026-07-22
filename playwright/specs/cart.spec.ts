import { test, expect } from '../fixtures/cart.fixture'
import { CartPage } from '../pages/CartPage'
import { CatalogPage } from '../pages/CatalogPage'

test.describe('Panier', () => {
  test.beforeEach(async ({ loginAs }) => {
    await loginAs('jean_dupont')
  })

  test('le panier est vide au départ, le badge est absent', async ({ page }) => {
    const cartPage = new CartPage(page)
    await cartPage.goto()
    await expect(cartPage.emptyMessage).toBeVisible()
    await expect(page.getByTestId('cart-count')).not.toBeVisible()
  })

  test('ajouter un produit incrémente le badge à 1', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.addToCartButton('sauce-backpack').click()
    await expect(page.getByTestId('cart-count')).toHaveText('1')
  })

  test('ajouter deux produits différents affiche 2 dans le badge', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.addToCartButton('sauce-backpack').click()
    await catalog.sizeButton('sauce-bolt-shirt', 'M').click()
    await catalog.addToCartButton('sauce-bolt-shirt').click()
    await expect(page.getByTestId('cart-count')).toHaveText('2')
  })

  test('ajouter le même produit deux fois donne quantité 2', async ({ addProductsToCart, page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.addToCartButton('sauce-backpack').click()
    await catalog.addToCartButton('sauce-backpack').click()

    const cartPage = new CartPage(page)
    await cartPage.goto()
    const qty = cartPage.quantityInput('sauce-backpack')
    await expect(qty).toHaveValue('2')
  })

  test('supprimer un article le retire du panier', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.addToCartButton('sauce-backpack').click()

    const cartPage = new CartPage(page)
    await cartPage.goto()
    await cartPage.removeButton('sauce-backpack').click()
    await expect(cartPage.emptyMessage).toBeVisible()
  })

  test('le panier persiste après navigation', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.addToCartButton('sauce-backpack').click()

    await page.goto('./#/catalog')
    await page.goto('./#/cart')

    const cartPage = new CartPage(page)
    await expect(cartPage.cartItem('sauce-backpack')).toBeVisible()
  })

  test('le panier persiste après rechargement de page', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.addToCartButton('sauce-backpack').click()

    await page.reload()
    await page.goto('./#/cart')

    const cartPage = new CartPage(page)
    await expect(cartPage.cartItem('sauce-backpack')).toBeVisible()
  })

  test('le bouton Commander est désactivé quand le panier est vide', async ({ page }) => {
    const cartPage = new CartPage(page)
    await cartPage.goto()
    await expect(cartPage.checkoutButton).toBeDisabled()
  })

  test('le bouton Commander est actif avec des articles dans le panier', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.addToCartButton('sauce-backpack').click()

    const cartPage = new CartPage(page)
    await cartPage.goto()
    await expect(cartPage.checkoutButton).toBeEnabled()
  })

  test('les totaux du panier sont corrects', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.addToCartButton('sauce-backpack').click()   // 59,99 €
    await catalog.sizeButton('sauce-onesie', 'M').click()
    await catalog.addToCartButton('sauce-onesie').click()     // 14,99 €

    const cartPage = new CartPage(page)
    await cartPage.goto()

    // Subtotal: 59,99 + 14,99 = 74,98
    await expect(cartPage.subtotal).toContainText('74,98')
    // TVA incluse : round(7498 * 20 / 120) = 1 250 cents
    await expect(cartPage.tax).toContainText('12,50')
    await expect(cartPage.total).toContainText('74,98')
  })
})
