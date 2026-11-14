import { expect, test } from '@playwright/test'

// Smoke tests against the nginx preview of ./out (no screenshots).

test('home loads with a heading and navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible()
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
  await expect(page.locator('script[type="application/ld+json"]').first()).toBeAttached()
})

test('language switch', async ({ page }) => {
  await page.goto('/')
  const link = page.getByRole('list', { name: 'Language' }).getByRole('link').last()
  const lang = await link.getAttribute('lang')
  test.skip(!lang, 'only one locale is enabled')

  await link.click()
  await expect(page).toHaveURL(new RegExp(`/${lang}/$`))
  await expect(page.locator('html')).toHaveAttribute('lang', lang!)
})

test('contact page and 404', async ({ page }) => {
  await page.goto('/contact/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  const response = await page.goto('/missing-page/')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
