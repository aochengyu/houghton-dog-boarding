import { test, expect } from '@playwright/test'

const ACCEPTABLE_LOAD_MS = 5000

test.describe('performance checks', () => {
  test('home page responds with 200 within acceptable time', async ({ page }) => {
    const start = Date.now()
    const response = await page.goto('/')
    const elapsed = Date.now() - start

    expect(response?.status()).toBe(200)
    console.log(`  / loaded in ${elapsed}ms`)
    expect(elapsed).toBeLessThan(ACCEPTABLE_LOAD_MS)
  })

  test('login page responds with 200 within acceptable time', async ({ page }) => {
    const start = Date.now()
    const response = await page.goto('/account/login')
    const elapsed = Date.now() - start

    expect(response?.status()).toBe(200)
    console.log(`  /account/login loaded in ${elapsed}ms`)
    expect(elapsed).toBeLessThan(ACCEPTABLE_LOAD_MS)
  })

  test('services page responds with 200 within acceptable time', async ({ page }) => {
    const start = Date.now()
    const response = await page.goto('/services')
    const elapsed = Date.now() - start

    expect(response?.status()).toBe(200)
    console.log(`  /services loaded in ${elapsed}ms`)
    expect(elapsed).toBeLessThan(ACCEPTABLE_LOAD_MS)
  })

  test('page response sizes are logged', async ({ page }) => {
    const pages = ['/', '/account/login', '/services', '/faq', '/contact']

    for (const path of pages) {
      let totalBytes = 0
      page.on('response', (res) => {
        const contentLength = res.headers()['content-length']
        if (contentLength) totalBytes += parseInt(contentLength, 10)
      })

      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
      console.log(`  ${path}: ~${Math.round(totalBytes / 1024)}KB transferred`)

      // Reset listener for next iteration
      page.removeAllListeners('response')
    }
  })
})
