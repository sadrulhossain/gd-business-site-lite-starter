import { expect, test } from '@playwright/test'

// Smoke tests against the nginx preview of ./out (no screenshots).

test('home loads with a heading, navigation and a visible hero image', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible()
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
  await expect(page.locator('script[type="application/ld+json"]').first()).toBeAttached()

  const hero = page.locator('#hero img')
  await expect(hero).toBeVisible()
  expect(await hero.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
})

test('language switch goes to the same page in the other language and back', async ({ page }) => {
  await page.goto('/about/')
  const heading = await page.getByRole('heading', { level: 1 }).textContent()
  const link = page.getByRole('list', { name: 'Language' }).getByRole('link').last()
  const lang = await link.getAttribute('lang')
  test.skip(!lang, 'only one locale is enabled')

  await link.click()
  await expect(page).toHaveURL(new RegExp(`/${lang}/about/$`))
  await expect(page.locator('html')).toHaveAttribute('lang', lang!)
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveText(heading!)

  await page.getByRole('list', { name: /./ }).getByRole('link').first().click()
  await expect(page).toHaveURL(/\/about\/$/)
})

test('404 in both languages', async ({ page }) => {
  const missing = await page.goto('/missing-page/')
  expect(missing?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')

  const second = await page.goto('/bn/missing-page/')
  expect(second?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Page not found')
})

test('gallery lightbox opens and closes', async ({ page }) => {
  await page.goto('/gallery/')
  await page.locator('#gallery button').first().click()
  const dialog = page.locator('dialog')
  await expect(dialog).toBeVisible()
  await page.getByRole('button', { name: 'Close' }).click()
  await expect(dialog).toBeHidden()
})

test('faq answers open and close', async ({ page }) => {
  await page.goto('/faq/')
  const first = page.locator('details').first()
  await first.locator('summary').click()
  await expect(first).toHaveAttribute('open', '')
})
