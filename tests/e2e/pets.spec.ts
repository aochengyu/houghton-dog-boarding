import { test, expect } from '@playwright/test'

test.describe('pet pages (structural tests)', () => {
  test('login page has correct form fields', async ({ page }) => {
    await page.goto('/account/login')
    await expect(page.locator('[name="email"]')).toBeVisible()
    await expect(page.locator('[name="password"]')).toBeVisible()
    await expect(page.locator('[type="submit"]')).toBeVisible()
  })

  test('login page has honeypot field', async ({ page }) => {
    await page.goto('/account/login')
    // Honeypot is aria-hidden and off-screen — check it exists in DOM
    const honeypot = page.locator('[name="website"]')
    await expect(honeypot).toHaveCount(1)
    // It should be visually hidden (aria-hidden="true")
    await expect(honeypot).toHaveAttribute('aria-hidden', 'true')
  })

  test('pets page redirects unauthenticated', async ({ page }) => {
    await page.goto('/account/pets')
    await page.waitForURL(/\/account\/login/, { timeout: 8000 })
    expect(page.url()).toMatch(/\/account\/login/)
  })
})
