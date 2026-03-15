import { Page } from '@playwright/test'

export async function loginAsClient(page: Page) {
  await page.goto('/account/login')
  await page.fill('[name="email"]', 'testclient@example.com')
  await page.fill('[name="password"]', 'TestPassword123!')
  await page.click('[type="submit"]')
  await page.waitForURL(/\/account\/dashboard/)
}

export async function loginAsAdmin(page: Page, adminEmail: string) {
  await page.goto('/account/login')
  await page.fill('[name="email"]', adminEmail)
  await page.fill('[name="password"]', process.env.ADMIN_PASSWORD ?? '')
  await page.click('[type="submit"]')
}
