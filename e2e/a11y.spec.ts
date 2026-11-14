import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// WCAG 2.1 A/AA scan of every public page in both languages, against the nginx preview of ./out (no screenshots).
const paths = ['/', '/about/', '/services/', '/services/daily-bread/', '/gallery/', '/faq/', '/contact/', '/privacy/', '/terms/', '/missing-page/']
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

const summary = (violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']) =>
  violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)

for (const prefix of ['', '/bn']) {
  for (const path of paths) {
    const url = prefix ? `${prefix}${path}` : path

    test(`axe: ${url}`, async ({ page }) => {
      await page.goto(url)
      await expect(page.locator('h1').first()).toBeVisible()

      expect(summary((await new AxeBuilder({ page }).withTags(tags).analyze()).violations)).toEqual([])
    })
  }
}

test('axe: gallery lightbox open', async ({ page }) => {
  await page.goto('/gallery/')
  await page.locator('#gallery button').first().click()
  await expect(page.locator('dialog')).toBeVisible()

  expect(summary((await new AxeBuilder({ page }).withTags(tags).analyze()).violations)).toEqual([])
})
