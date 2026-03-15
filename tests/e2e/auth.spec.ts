import { test, expect } from '@playwright/test'

test.describe('auth flows', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/account/login')
    await expect(page.locator('[name="email"]')).toBeVisible()
    await expect(page.locator('[name="password"]')).toBeVisible()
    await expect(page.locator('[type="submit"]')).toBeVisible()
  })

  test('invalid credentials shows error', async ({ page }) => {
    await page.goto('/account/login')
    await page.fill('[name="email"]', 'notareal@user.com')
    await page.fill('[name="password"]', 'WrongPassword999!')
    await page.click('[type="submit"]')
    // Expect an error message to appear (Supabase returns auth error)
    const errorDiv = page.locator('[class*="rose"]').first()
    await expect(errorDiv).toBeVisible({ timeout: 8000 })
  })

  test('unauthenticated user redirected from protected page', async ({ page }) => {
    await page.goto('/account/pets')
    // Should redirect to login
    await page.waitForURL(/\/account\/login/, { timeout: 8000 })
    expect(page.url()).toMatch(/\/account\/login/)
  })
})
