import { type Page, type Locator, expect } from '@playwright/test'

export class LoginPage {
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator

  constructor(readonly page: Page) {
    this.usernameInput = page.getByTestId('login-username')
    this.passwordInput = page.getByTestId('login-password')
    this.submitButton  = page.getByTestId('login-submit')
    this.errorMessage  = page.getByTestId('login-error')
  }

  async goto() {
    await this.page.goto('./#/login')
  }

  async login(username: string, password = 'Baguette42!') {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async expectError(text: string) {
    await expect(this.errorMessage).toBeVisible()
    await expect(this.errorMessage).toContainText(text)
  }

  async expectRedirectedToCatalog(timeout = 10_000) {
    await expect(this.page).toHaveURL(/#\/catalog/, { timeout })
  }
}
