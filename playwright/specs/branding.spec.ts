import { test, expect } from '../fixtures/auth.fixture'

const PODCAST_URL    = 'https://linktr.ee/QGQualite'
const FORMATIONS_URL = 'https://www.ssid.fr/on-vous-forme/'

test.describe('Branding — page d\'accueil (3 colonnes)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./')
  })

  test('colonne gauche : encart SSID avec logo et descriptif', async ({ page }) => {
    const card = page.getByTestId('ssid-card')
    await expect(card).toBeVisible()
    await expect(card.getByRole('img', { name: /SSID Testing Agency/i })).toBeVisible()
    await expect(card).toContainText('qualification logicielle')
  })

  test('colonne gauche : bloc Podcast vers Linktree (nouvel onglet, sécurisé)', async ({ page }) => {
    const link = page.getByTestId('podcast-link')
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', PODCAST_URL)
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noopener/)
    await expect(link.getByRole('img', { name: /QG Qualité/i })).toBeVisible()
  })

  test('colonne droite : carte Formations avec CTA vers le site SSID', async ({ page }) => {
    const card = page.getByTestId('formations-card')
    await expect(card).toBeVisible()
    const cta = page.getByTestId('landing-formations')
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', FORMATIONS_URL)
    await expect(cta).toHaveAttribute('target', '_blank')
    await expect(cta).toHaveAttribute('rel', /noopener/)
  })

  test('colonne centrale : le CTA principal mène toujours au login (non-régression)', async ({ page }) => {
    await page.getByTestId('landing-start').click()
    await expect(page).toHaveURL(/#\/login/)
  })

  test('les comptes de test restent affichés dans la colonne centrale', async ({ page }) => {
    await expect(page.getByText('jean_dupont').first()).toBeVisible()
  })
})

test.describe('Branding — après connexion', () => {
  test('le logo entreprise est visible dans la navbar', async ({ loginAs, page }) => {
    await loginAs('jean_dupont')
    await expect(page.getByTestId('navbar')).toBeVisible()
    const logo = page.locator('[data-testid^="company-logo-"]:visible')
    await expect(logo).toBeVisible()
    await expect(logo).toHaveAttribute('alt', /SSID Testing Agency/i)
  })

  test('le logo entreprise n\'apparaît pas avant connexion', async ({ page }) => {
    await page.goto('./')
    await expect(page.getByTestId('company-logo')).toHaveCount(0)
  })
})
