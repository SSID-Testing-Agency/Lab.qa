import { test as base } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

type AuthFixtures = {
  loginPage: LoginPage
  loginAs: (username: string, password?: string) => Promise<void>
}

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },

  loginAs: async ({ page }, use) => {
    await use(async (username: string, password = 'Baguette42!') => {
      const loginPage = new LoginPage(page)
      await loginPage.goto()
      await loginPage.login(username, password)
      await page.waitForURL(/#\/catalog/, { timeout: 10_000 })
    })
  },
})

export { expect } from '@playwright/test'
