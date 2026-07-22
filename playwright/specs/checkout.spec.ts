import { test, expect } from '../fixtures/cart.fixture'
import { type Page } from '@playwright/test'
import { CatalogPage } from '../pages/CatalogPage'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'

async function setupCartAndCheckout(page: Page, loginAs: (u: string) => Promise<void>) {
  await loginAs('jean_dupont')
  const catalog = new CatalogPage(page)
  await catalog.goto()
  await catalog.addToCartButton('sauce-backpack').click()
  const cart = new CartPage(page)
  await cart.goto()
  await cart.checkoutButton.click()
}

test.describe('Parcours de commande', () => {
  test('happy path complet : info → review → confirmation → panier vidé', async ({ loginAs, page }) => {
    await loginAs('jean_dupont')
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.addToCartButton('sauce-backpack').click()

    await page.goto('./#/cart')
    await page.getByTestId('cart-checkout-button').click()

    const checkout = new CheckoutPage(page)
    await expect(page).toHaveURL(/#\/checkout\/info/)
    await expect(checkout.stepInfo).toBeVisible()

    await checkout.fillInfo('Jane', 'Doe', '75001')
    await expect(page).toHaveURL(/#\/checkout\/review/)
    await expect(checkout.reviewContainer).toBeVisible()
    await expect(checkout.stepReview).toBeVisible()

    await expect(checkout.reviewSubtotal).toContainText('59,99')
    await expect(checkout.reviewTotal).toBeVisible()

    await checkout.finishButton.click()
    await expect(page).toHaveURL(/#\/checkout\/payment/)
    await checkout.pay()
    await expect(page).toHaveURL(/#\/checkout\/confirmation/)
    await expect(checkout.confirmationTitle).toContainText('confirmée')
    await expect(checkout.stepConfirmation).toBeVisible()

    await expect(page.getByTestId('cart-count')).not.toBeVisible()
  })

  test('étape info : prénom manquant bloque la progression', async ({ loginAs, page }) => {
    await setupCartAndCheckout(page, loginAs)
    const checkout = new CheckoutPage(page)
    await checkout.lastNameInput.fill('Doe')
    await checkout.emailInput.fill('jane.doe@example.com')
    await checkout.postalCodeInput.fill('75001')
    await expect(checkout.continueButton).toBeDisabled()
    await expect(page).toHaveURL(/#\/checkout\/info/)
  })

  test('étape info : nom manquant bloque la progression', async ({ loginAs, page }) => {
    await setupCartAndCheckout(page, loginAs)
    const checkout = new CheckoutPage(page)
    await checkout.firstNameInput.fill('Jane')
    await checkout.emailInput.fill('jane.doe@example.com')
    await checkout.postalCodeInput.fill('75001')
    await expect(checkout.continueButton).toBeDisabled()
  })

  test('étape info : code postal manquant bloque la progression', async ({ loginAs, page }) => {
    await setupCartAndCheckout(page, loginAs)
    const checkout = new CheckoutPage(page)
    await checkout.firstNameInput.fill('Jane')
    await checkout.lastNameInput.fill('Doe')
    await checkout.emailInput.fill('jane.doe@example.com')
    await expect(checkout.continueButton).toBeDisabled()
  })

  test('le bouton Retour depuis info revient au panier', async ({ loginAs, page }) => {
    await setupCartAndCheckout(page, loginAs)
    const checkout = new CheckoutPage(page)
    await checkout.cancelButton.click()
    await expect(page).toHaveURL(/#\/cart/)
  })

  test('naviguer vers /checkout/info avec panier vide redirige vers /cart', async ({ loginAs, page }) => {
    await loginAs('jean_dupont')
    await page.goto('./#/checkout/info')
    await expect(page).toHaveURL(/#\/cart/)
  })

  test('le bouton Retour sur la page review revient à info', async ({ loginAs, page }) => {
    await setupCartAndCheckout(page, loginAs)
    const checkout = new CheckoutPage(page)
    await checkout.fillInfo('Jane', 'Doe', '75001')
    await expect(page).toHaveURL(/#\/checkout\/review/)
    await page.locator('button', { hasText: 'Retour' }).click()
    await expect(page).toHaveURL(/#\/checkout\/info/)
  })

  test('la page confirmation a un lien vers le catalogue', async ({ loginAs, page }) => {
    await loginAs('jean_dupont')
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.addToCartButton('sauce-backpack').click()
    await page.goto('./#/cart')
    await page.getByTestId('cart-checkout-button').click()

    const checkout = new CheckoutPage(page)
    await checkout.fillInfo('Jane', 'Doe', '75001')
    await checkout.finishButton.click()
    await checkout.pay()
    await checkout.confirmationHome.click()
    await expect(page).toHaveURL(/#\/catalog/)
  })

  test('le code promo est pris en compte dans tout le tunnel (issue #4)', async ({ loginAs, page }) => {
    await loginAs('jean_dupont')
    const catalog = new CatalogPage(page)
    await catalog.goto()
    await catalog.addToCartButton('sauce-backpack').click()  // 59,99 €

    // Applique PLAYWRIGHT (−15 %) dans le panier
    await page.goto('./#/cart')
    await page.getByTestId('cart-promo-input').fill('PLAYWRIGHT')
    await page.getByTestId('cart-promo-apply').click()
    await expect(page.getByTestId('cart-discount')).toContainText('9,00')
    await expect(page.getByTestId('cart-total')).toContainText('50,99')

    // La remise doit survivre au tunnel
    await page.getByTestId('cart-checkout-button').click()
    const checkout = new CheckoutPage(page)
    await checkout.fillInfo('Jane', 'Doe', '75001')
    await expect(checkout.reviewSubtotal).toContainText('59,99')       // sous-total brut
    await expect(page.getByTestId('review-discount')).toContainText('9,00')
    await expect(checkout.reviewTotal).toContainText('54,98')          // 50,99 + 3,99 livraison standard

    await checkout.finishButton.click()
    await expect(page.getByTestId('payment-submit')).toContainText('54,98')  // « Payer 54,98 € »
    await checkout.pay()
    await expect(checkout.confirmationContainer).toContainText('54,98')
  })
})
