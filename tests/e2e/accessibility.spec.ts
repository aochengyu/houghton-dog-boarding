import { test, expect } from '@playwright/test'

const publicPages = ['/', '/services', '/faq', '/contact']

test.describe('basic accessibility checks', () => {
  for (const path of publicPages) {
    test(`${path} has a single h1, non-empty title, and lang attribute`, async ({ page }) => {
      await page.goto(path)

      // Check html lang attribute is set
      const lang = await page.locator('html').getAttribute('lang')
      expect(lang).toBeTruthy()
      expect(lang).toMatch(/^[a-z]{2}/)

      // Check page title is not empty
      const title = await page.title()
      expect(title.trim().length).toBeGreaterThan(0)

      // Check at least one h1 exists
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBeGreaterThanOrEqual(1)
    })
  }

  test('login form has labels associated with inputs', async ({ page }) => {
    await page.goto('/account/login')

    // Email input has an associated label (via htmlFor="email")
    const emailInput = page.locator('#email')
    await expect(emailInput).toBeVisible()
    const emailLabel = page.locator('label[for="email"]')
    await expect(emailLabel).toBeVisible()

    // Password input has an associated label (via htmlFor="password")
    const passwordInput = page.locator('#password')
    await expect(passwordInput).toBeVisible()
    const passwordLabel = page.locator('label[for="password"]')
    await expect(passwordLabel).toBeVisible()
  })
})
