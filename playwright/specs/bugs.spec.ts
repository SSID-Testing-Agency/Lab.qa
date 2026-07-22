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
    const src = await page.locator('[data-testid^="product-image-"]').first().getAttribute('src')
    expect(src).toContain('broken.svg')
  })

  test('les images sont normales sans bug mode', async ({ page }) => {
    await page.goto('./#/catalog')
    await expect(page.getByTestId('bug-mode-banner')).not.toBeVisible()
    const src = await page.getByTestId('product-image-sauce-backpack').getAttribute('src')
    expect(src).not.toContain('broken.svg')
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

  test('le bouton "Ajouter au panier" disparaît après clic avec ?bugs=true', async ({ page }) => {
    await page.goto('./#/catalog?bugs=true')
    await expect(page.getByTestId('bug-mode-banner')).toBeVisible()
    const btn = page.locator('[data-testid^="add-to-cart-"]:enabled').first()
    const testId = await btn.getAttribute('data-testid')
    expect(testId).toBeTruthy()
    await btn.click()
    await expect(page.getByTestId(testId!)).toHaveCount(0)
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
    const src = await page.locator('[data-testid^="product-image-"]').first().getAttribute('src')
    expect(src).toContain('broken.svg')
  })

  test('le tri est inversé pour client_chaos', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.selectSort('name-asc')
    const names = await catalog.getAllProductNames()
    const sorted = [...names].sort((a, b) => a.localeCompare(b))
    expect(names).not.toEqual(sorted)
  })

  test('le bouton "Ajouter au panier" disparaît pour client_chaos', async ({ page }) => {
    const btn = page.locator('[data-testid^="add-to-cart-"]:enabled').first()
    const testId = await btn.getAttribute('data-testid')
    expect(testId).toBeTruthy()
    await btn.click()
    await expect(page.getByTestId(testId!)).toHaveCount(0)
  })

  test('la validation du formulaire fonctionne toujours pour client_chaos', async ({ page }) => {
    // Add item via UI (button disappears after click but item is added)
    await page.locator('[data-testid^="add-to-cart-"]:enabled').first().click()
    await page.goto('./#/checkout/info')
    await expect(page.getByTestId('bug-mode-banner')).toBeVisible()
    const checkout = new CheckoutPage(page)
    await expect(checkout.continueButton).toBeDisabled()
    await expect(page).toHaveURL(/#\/checkout\/info/)
  })
})
