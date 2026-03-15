import { test, expect } from '@playwright/test'

// Business name from content.ts
const BUSINESS_NAME = 'Paws and Petals'

test.describe('public pages', () => {
  test('home page loads', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    // Check for business name or main heading
    const bodyText = await page.locator('body').innerText()
    expect(bodyText).toContain(BUSINESS_NAME)
  })

  test('services page loads', async ({ page }) => {
    const response = await page.goto('/services')
    expect(response?.status()).toBe(200)
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
  })

  test('faq page loads', async ({ page }) => {
    const response = await page.goto('/faq')
    expect(response?.status()).toBe(200)
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
    // Content from content.ts: faq.h1 = "Frequently Asked Questions"
    await expect(h1).toContainText('Frequently Asked Questions')
  })

  test('contact page loads', async ({ page }) => {
    const response = await page.goto('/contact')
    expect(response?.status()).toBe(200)
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
    // Content from content.ts: contact.h1 = "Get in Touch"
    await expect(h1).toContainText('Get in Touch')
  })

  test('booking page loads', async ({ page }) => {
    const response = await page.goto('/booking')
    expect(response?.status()).toBe(200)
    await expect(page.locator('body')).toBeVisible()
  })

  test('gallery page loads', async ({ page }) => {
    const response = await page.goto('/gallery')
    expect(response?.status()).toBe(200)
    await expect(page.locator('body')).toBeVisible()
  })
})
