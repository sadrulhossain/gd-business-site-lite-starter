import { expect, test } from '@playwright/test'

// SEO and locale checks on the static output served by the nginx preview. HTTP only: no browser needed.
const pathOf = (url: string) => new URL(url).pathname

test('sitemap lists every page in both locales with hreflang alternates', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => pathOf(m[1]!))

  expect(locs).toContain('/')
  expect(locs).toContain('/bn/')
  expect(locs).toContain('/about/')
  expect(locs).toContain('/bn/services/daily-bread/')
  expect(xml).toContain('hreflang="bn"')
  expect(new Set(locs).size).toBe(locs.length)
})

test('robots.txt points at the sitemap', async ({ request }) => {
  const body = await (await request.get('/robots.txt')).text()
  expect(body).toMatch(/Allow: \//)
  expect(body).toMatch(/Sitemap: .*\/sitemap\.xml/)
})

test('home: canonical, hreflang, LocalBusiness JSON-LD', async ({ request }) => {
  const html = await (await request.get('/')).text()
  expect(html).toContain('<html lang="en"')
  expect(html).toMatch(/rel="canonical" href="[^"]+\/"/)
  for (const code of ['en', 'bn', 'x-default']) expect(html).toMatch(new RegExp(`hrefLang="${code}"`, 'i'))
  const ld = html.match(/application\/ld\+json">([^<]+)</)?.[1]
  expect(JSON.parse(ld!)['@type']).toBe('LocalBusiness')
})

test('second locale: lang, canonical and a switcher link to the same page', async ({ request }) => {
  const second = await (await request.get('/bn/about/')).text()
  expect(second).toContain('<html lang="bn"')
  expect(pathOf(second.match(/rel="canonical" href="([^"]+)"/)![1]!)).toBe('/bn/about/')

  const first = await (await request.get('/about/')).text()
  expect(first).toMatch(/href="\/bn\/about\/"[^>]*lang="bn"|lang="bn"[^>]*href="\/bn\/about\/"/)
})

test('unknown pages answer 404 with the 404 page', async ({ request }) => {
  for (const url of ['/nope/', '/bn/nope/', '/team/']) {
    const response = await request.get(url)
    expect(response.status(), url).toBe(404)
    expect(await response.text()).toContain('404')
  }
})
