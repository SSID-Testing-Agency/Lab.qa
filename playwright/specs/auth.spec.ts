import { test, expect } from '../fixtures/auth.fixture'
import { LoginPage } from '../pages/LoginPage'

test.describe('Authentification', () => {
  test('jean_dupont peut se connecter et arrive sur le catalogue', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('jean_dupont')
    await loginPage.expectRedirectedToCatalog()
    await expect(page.getByTestId('navbar')).toBeVisible()
  })

  test('compte_banni voit une erreur et reste sur login', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('compte_banni')
    await loginPage.expectError('verrouillé')
    await expect(page).toHaveURL(/#\/login/)
  })

  test('mauvais mot de passe affiche une erreur', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('jean_dupont', 'wrong_password')
    await loginPage.expectError('ne correspondent')
    await expect(page).toHaveURL(/#\/login/)
  })

  test('nom d\'utilisateur vide affiche une erreur', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('')
    await loginPage.expectError('requis')
  })

  test('mot de passe vide affiche une erreur', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await page.getByTestId('login-username').fill('jean_dupont')
    await page.getByTestId('login-submit').click()
    await loginPage.expectError('requis')
  })

  test('tortue_du_web finit par se connecter (login lent)', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('tortue_du_web')
    await loginPage.expectRedirectedToCatalog(10_000)
  })

  test('utilisateur connecté ne peut pas revenir sur /login', async ({ loginAs, page }) => {
    await loginAs('jean_dupont')
    await page.goto('./#/login')
    await page.reload()
    await expect(page).toHaveURL(/#\/catalog/)
  })

  test('déconnexion redirige vers la page login', async ({ loginAs, page }) => {
    await loginAs('jean_dupont')
    await page.getByTestId('logout-button').click()
    await expect(page).toHaveURL(/#\/login/)
  })

  test('utilisateur non connecté redirige vers login depuis une route protégée', async ({ page }) => {
    await page.goto('./#/catalog')
    await expect(page).toHaveURL(/#\/login/)
  })
})
