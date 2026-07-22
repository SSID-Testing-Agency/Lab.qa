import { type Page, type Locator } from '@playwright/test'

export class CheckoutPage {
  readonly firstNameInput: Locator
  readonly lastNameInput: Locator
  readonly emailInput: Locator
  readonly postalCodeInput: Locator
  readonly continueButton: Locator
  readonly cancelButton: Locator
  readonly errorMessage: Locator
  readonly reviewContainer: Locator
  readonly reviewTotal: Locator
  readonly reviewSubtotal: Locator
  readonly reviewTax: Locator
  readonly finishButton: Locator
  readonly cardNumberInput: Locator
  readonly expiryInput: Locator
  readonly cvcInput: Locator
  readonly cardNameInput: Locator
  readonly paymentSubmitButton: Locator
  readonly confirmationContainer: Locator
  readonly confirmationTitle: Locator
  readonly confirmationHome: Locator
  readonly stepInfo: Locator
  readonly stepReview: Locator
  readonly stepConfirmation: Locator

  constructor(readonly page: Page) {
    this.firstNameInput      = page.getByTestId('checkout-first-name')
    this.lastNameInput       = page.getByTestId('checkout-last-name')
    this.emailInput          = page.getByTestId('checkout-email')
    this.postalCodeInput     = page.getByTestId('checkout-postal-code')
    this.continueButton      = page.getByTestId('checkout-continue')
    this.cancelButton        = page.getByTestId('checkout-cancel')
    this.errorMessage        = page.getByTestId('checkout-error')
    this.reviewContainer     = page.getByTestId('checkout-review')
    this.reviewTotal         = page.getByTestId('review-total')
    this.reviewSubtotal      = page.getByTestId('review-subtotal')
    this.reviewTax           = page.getByTestId('review-tax')
    this.finishButton        = page.getByTestId('checkout-finish')
    this.cardNumberInput     = page.getByTestId('payment-card-number')
    this.expiryInput         = page.getByTestId('payment-expiry')
    this.cvcInput            = page.getByTestId('payment-cvc')
    this.cardNameInput       = page.getByTestId('payment-name')
    this.paymentSubmitButton = page.getByTestId('payment-submit')
    this.confirmationContainer = page.getByTestId('confirmation-container')
    this.confirmationTitle   = page.getByTestId('confirmation-title')
    this.confirmationHome    = page.getByTestId('confirmation-home')
    this.stepInfo            = page.getByTestId('step-info')
    this.stepReview          = page.getByTestId('step-review')
    this.stepConfirmation    = page.getByTestId('step-confirmation')
  }

  async gotoInfo() {
    await this.page.goto('./#/checkout/info')
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string, email = 'jane.doe@example.com') {
    await this.firstNameInput.fill(firstName)
    await this.lastNameInput.fill(lastName)
    await this.emailInput.fill(email)
    await this.postalCodeInput.fill(postalCode)
    await this.continueButton.click()
  }

  async pay() {
    await this.cardNumberInput.fill('4242 4242 4242 4242')
    await this.expiryInput.fill('12/30')
    await this.cvcInput.fill('123')
    await this.cardNameInput.fill('JANE DOE')
    await this.paymentSubmitButton.click()
  }
}
