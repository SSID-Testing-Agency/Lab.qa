import { test, expect } from '../fixtures/auth.fixture'
import { CatalogPage } from '../pages/CatalogPage'

test.describe('Autocomplétion de recherche', () => {
  test.beforeEach(async ({ loginAs }) => {
    await loginAs('jean_dupont')
  })

  test('une requête < 3 lettres affiche le hint et ne lance pas la recherche', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()

    await page.getByTestId('search-input').fill('ve')

    await expect(page.getByTestId('search-hint')).toBeVisible()
    expect(page.url()).not.toContain('q=')
  })

  test('une requête ≥ 3 lettres masque le hint et filtre le catalogue', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()

    await page.getByTestId('search-input').fill('ves')

    await expect(page.getByTestId('search-hint')).toHaveCount(0)
    await expect(page).toHaveURL(/q=ves/)
    await expect(catalog.productCard('sauce-jacket')).toBeVisible()
  })

  test('la datalist expose les noms de produits comme suggestions', async ({ page }) => {
    const catalog = new CatalogPage(page)
    await catalog.goto()

    const options = page.locator('#product-suggestions option')
    await expect(options.first()).toBeAttached()
    await expect(page.locator('#product-suggestions option[value="Veste polaire"]')).toBeAttached()
  })
})
