import { test, expect } from '../fixtures/auth.fixture'
import { CatalogPage } from '../pages/CatalogPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { CartPage } from '../pages/CartPage'

test.describe('Mode bugs — ?bugs=true', () => {
  test.beforeEach(async ({ loginAs }) => {
    await loginAs('jean_dupont')
  })

  test('le banner bug est visible avec ?bugs=true', async ({ page }) => {
    await page.goto('./#/catalog?bugs=true')
    await expect(page.getByTestId('bug-mode-banner')).toBeVisible()
  })

  test('le banner bug est absent pour jean_dupont sans paramètre', async ({ page }) => {
    await page.goto('./#/catalog')
    await expect(page.getByTestId('bug-mode-banner')).not.toBeVisible()
  })

  test('les images sont cassées avec ?bugs=true', async ({ page }) => {
    await page.goto('./#/catalog?bugs=true')
    await expect(page.getByTestId('bug-mode-banner')).toBeVisible()
    const image = page.locator('[data-testid^="product-image-"]').first()
    await expect.poll(() => image.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBe(0)
  })

  test('les images sont normales sans bug mode', async ({ page }) => {
    await page.goto('./#/catalog')
    await expect(page.getByTestId('bug-mode-banner')).not.toBeVisible()
    const image = page.getByTestId('product-image-sauce-backpack')
    await expect.poll(() => image.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  })

  test('le tri est inversé avec ?bugs=true', async ({ page }) => {
    await page.goto('./#/catalog?bugs=true')
    await expect(page.getByTestId('bug-mode-banner')).toBeVisible()
    const catalog = new CatalogPage(page)
    await catalog.selectSort('name-asc')
    const names = await catalog.getAllProductNames()
    const expectedSorted = [...names].sort((a, b) => a.localeCompare(b))
    expect(names).not.toEqual(expectedSorted)
  })

  test('le tri fonctionne correctement sans bug mode', async ({ page }) => {
    await page.goto('./#/catalog')
    const catalog = new CatalogPage(page)
    await catalog.selectSort('name-asc')
    const names = await catalog.getAllProductNames()
    const sorted = [...names].sort((a, b) => a.localeCompare(b))
    expect(names).toEqual(sorted)
  })

  test('le formulaire checkout accepte les champs vides avec ?bugs=true', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.addToCartButton('sauce-backpack').click()
    await page.goto('./#/checkout/info?bugs=true')
    await expect(page.getByTestId('bug-mode-banner')).toBeVisible()

    const checkout = new CheckoutPage(page)
    await checkout.continueButton.click()
    await expect(page).toHaveURL(/#\/checkout\/review/)
  })

  test('le total est décalé de -0.01€ avec ?bugs=true', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.addToCartButton('sauce-backpack').click()

    await page.goto('./#/cart?bugs=true')
    await expect(page.getByTestId('bug-mode-banner')).toBeVisible()

    const cart = new CartPage(page)
    const total = await cart.getTotal()
    // Without bug: 59,99 + 4,80 de taxe = 64,79
    expect(total).toBeLessThan(64.79)
  })

  test('certains boutons "Ajouter au panier" sont attachés mais invisibles avec ?bugs=true', async ({ page }) => {
    await page.goto('./#/catalog?bugs=true')
    await expect(page.getByTestId('bug-mode-banner')).toBeVisible()
    const hiddenButton = page.getByTestId('add-to-cart-book-playwright')
    await expect(hiddenButton).toBeAttached()
    await expect(hiddenButton).not.toBeVisible()
    await expect(page.getByTestId('add-to-cart-book-ddd')).toBeVisible()
  })
})

test.describe('Mode bugs — client_chaos', () => {
  test.beforeEach(async ({ loginAs, page }) => {
    await loginAs('client_chaos')
    await expect(page.getByTestId('bug-mode-banner')).toBeVisible()
  })

  test('le banner bug est visible pour client_chaos', async ({ page }) => {
    await expect(page.getByTestId('bug-mode-banner')).toBeVisible()
  })

  test('les images sont cassées pour client_chaos', async ({ page }) => {
    const image = page.locator('[data-testid^="product-image-"]').first()
    await expect.poll(() => image.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBe(0)
  })

  test('le tri est inversé pour client_chaos', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.selectSort('name-asc')
    const names = await catalog.getAllProductNames()
    const sorted = [...names].sort((a, b) => a.localeCompare(b))
    expect(names).not.toEqual(sorted)
  })

  test('certains boutons "Ajouter au panier" sont attachés mais invisibles pour client_chaos', async ({ page }) => {
    const hiddenButton = page.getByTestId('add-to-cart-book-playwright')
    await expect(hiddenButton).toBeAttached()
    await expect(hiddenButton).not.toBeVisible()
    await expect(page.getByTestId('add-to-cart-book-ddd')).toBeVisible()
  })

  test('la validation du formulaire fonctionne toujours pour client_chaos', async ({ page }) => {
    // Add an unaffected item via UI before entering checkout.
    await page.getByTestId('add-to-cart-book-ddd').click()
    await page.goto('./#/checkout/info')
    await expect(page.getByTestId('bug-mode-banner')).toBeVisible()
    const checkout = new CheckoutPage(page)
    await expect(checkout.continueButton).toBeDisabled()
    await expect(page).toHaveURL(/#\/checkout\/info/)
  })

  test('le QA Lab indique le compte client_chaos comme méthode d\'activation', async ({ page }) => {
    await page.goto('./#/qa-lab')

    const activationLabels = page.locator('article').filter({ hasText: 'Activation :' }).locator('code')
    await expect(activationLabels.filter({ hasText: /^client_chaos$/ })).toHaveCount(3)
    await expect(activationLabels.filter({ hasText: /^problem_user$/ })).toHaveCount(0)
  })
})
