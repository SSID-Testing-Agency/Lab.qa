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

  test('chaque produit a une carte visible avec nom, prix et bouton', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()

    for (const id of PRODUCT_IDS) {
      await expect(catalog.productCard(id)).toBeVisible()
      await expect(catalog.productName(id)).toBeVisible()
      await expect(catalog.productPrice(id)).toBeVisible()
      await expect(catalog.addToCartButton(id)).toBeVisible()
    }
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
