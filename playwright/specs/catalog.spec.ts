import { test, expect } from '../fixtures/auth.fixture'
import { CatalogPage } from '../pages/CatalogPage'
import { ProductPage } from '../pages/ProductPage'

const PRODUCT_IDS = [
  'sauce-backpack',
  'sauce-bike-light',
  'sauce-bolt-shirt',
  'sauce-jacket',
  'sauce-onesie',
  'test-allthethings-shirt',
]

test.describe('Catalogue produits', () => {
  test.beforeEach(async ({ loginAs }) => {
    await loginAs('jean_dupont')
  })

  test('affiche les 6 produits', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.expectProductCount(6)
  })

  test('le footer reste atteignable par défilement sur un écran de faible hauteur', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 600 })

    const main = page.locator('main')
    const sidebar = page.getByTestId('sidebar')
    const footer = page.locator('footer')

    await expect(main).toHaveCSS('overflow-y', 'visible')
    await expect(sidebar).toHaveCSS('overflow-y', 'visible')

    const mainBox = await main.boundingBox()
    expect(mainBox).not.toBeNull()
    await page.mouse.move(mainBox!.x + mainBox!.width / 2, Math.min(mainBox!.y + 100, 500))
    for (let i = 0; i < 3; i++) await page.mouse.wheel(0, 10_000)

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
    await expect.poll(async () => {
      const box = await footer.boundingBox()
      return box?.y === undefined ? Infinity : box.y + box.height
    }).toBeLessThanOrEqual(601)
  })

  test('chaque carte expose une action cohérente avec son état', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()

    for (const id of PRODUCT_IDS) {
      await expect(catalog.productCard(id)).toBeVisible()
      await expect(catalog.productName(id)).toBeVisible()
      await expect(catalog.productPrice(id)).toBeVisible()
    }
    await expect(catalog.addToCartButton('sauce-backpack')).toBeEnabled()
    await expect(catalog.addToCartButton('sauce-backpack')).toHaveText('Ajouter au panier')
    await expect(catalog.chooseSizeAction('sauce-bolt-shirt')).toBeDisabled()
    await expect(catalog.outOfStockAction('sauce-bike-light')).toBeDisabled()
    await expect(catalog.outOfStockAction('sauce-jacket')).toBeDisabled()
    await expect(catalog.chooseSizeAction('sauce-onesie')).toBeDisabled()
    await expect(catalog.chooseSizeAction('test-allthethings-shirt')).toBeDisabled()
  })

  test('une taille sélectionnée remplace l’action de choix par l’ajout', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.sizeButton('sauce-bolt-shirt', 'M').click()
    await expect(catalog.chooseSizeAction('sauce-bolt-shirt')).not.toBeVisible()
    await expect(catalog.addToCartButton('sauce-bolt-shirt')).toBeEnabled()
    await catalog.sizeButton('sauce-bolt-shirt', 'M').click()
    await expect(catalog.addToCartButton('sauce-bolt-shirt')).not.toBeVisible()
    await expect(catalog.chooseSizeAction('sauce-bolt-shirt')).toBeDisabled()
  })

  test('tri A → Z produit un ordre alphabétique croissant', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.selectSort('name-asc')
    const names = await catalog.getAllProductNames()
    const sorted = [...names].sort((a, b) => a.localeCompare(b))
    expect(names).toEqual(sorted)
  })

  test('tri Z → A produit un ordre alphabétique décroissant', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.selectSort('name-desc')
    const names = await catalog.getAllProductNames()
    const sorted = [...names].sort((a, b) => b.localeCompare(a))
    expect(names).toEqual(sorted)
  })

  test('tri prix croissant produit des prix en ordre croissant', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.selectSort('price-asc')
    const prices = await catalog.getAllProductPrices()
    const sorted = [...prices].sort((a, b) => a - b)
    expect(prices).toEqual(sorted)
  })

  test('tri prix décroissant produit des prix en ordre décroissant', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.selectSort('price-desc')
    const prices = await catalog.getAllProductPrices()
    const sorted = [...prices].sort((a, b) => b - a)
    expect(prices).toEqual(sorted)
  })

  test('filtre Vêtements n\'affiche que les produits clothing', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.filterButton('clothing').click()

    const clothingIds = ['sauce-bolt-shirt', 'sauce-jacket', 'sauce-onesie', 'test-allthethings-shirt']
    await catalog.expectProductCount(clothingIds.length)
    for (const id of clothingIds) {
      await expect(catalog.productCard(id)).toBeVisible()
    }
  })

  test('filtre Accessoires n\'affiche que les accessoires', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.filterButton('accessories').click()

    await catalog.expectProductCount(2)
    await expect(catalog.productCard('sauce-backpack')).toBeVisible()
    await expect(catalog.productCard('sauce-bike-light')).toBeVisible()
  })

  test('filtre Tout réaffiche tous les produits', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.filterButton('clothing').click()
    await catalog.filterButton('all').click()
    await catalog.expectProductCount(6)
  })

  test('clic sur le nom navigue vers la fiche produit', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.productName('sauce-backpack').click()
    await expect(page).toHaveURL(/#\/product\/sauce-backpack/)

    const productPage = new ProductPage(page)
    await expect(productPage.title).toContainText('Sac à dos')
  })

  test('clic sur l\'image navigue vers la fiche produit', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.productImage('sauce-jacket').click()
    await expect(page).toHaveURL(/#\/product\/sauce-jacket/)
  })

  test('la fiche produit affiche les détails complets', async ({ page }) => {
    const productPage = new ProductPage(page)
    await productPage.goto('sauce-backpack')

    await expect(productPage.title).toBeVisible()
    await expect(productPage.price).toBeVisible()
    await expect(productPage.description).toBeVisible()
    await expect(productPage.image).toBeVisible()
    await expect(productPage.addToCartButton).toBeVisible()
    await expect(productPage.backLink).toBeVisible()
  })

  test('lien retour depuis la fiche revient au catalogue', async ({ page }) => {
    const productPage = new ProductPage(page)
    await productPage.goto('sauce-backpack')
    await productPage.backLink.click()
    await expect(page).toHaveURL(/#\/catalog/)
  })
})
