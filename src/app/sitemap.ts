import type { MetadataRoute } from 'next'
import { getContent, SECTION_PAGES } from '../lib/content'
import { defaultLocale, localePath, locales } from '../lib/i18n'
import { absolute } from '../lib/seo'

export const dynamic = 'force-static'

/** Every public page in every locale, each with its hreflang alternates. Section pages are listed only while the section exists. */
export default function sitemap(): MetadataRoute.Sitemap {
  const { sections, services } = getContent(defaultLocale)

  const paths: string[] = [
    '/',
    ...sections.flatMap((s) => (SECTION_PAGES[s.key] ? [SECTION_PAGES[s.key]!] : [])),
    '/contact',
    '/privacy',
    '/terms',
    ...services.map((s) => `/services/${s.id}`),
  ]

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absolute(localePath(locale, path)),
      alternates: { languages: Object.fromEntries(locales.map((code) => [code, absolute(localePath(code, path))])) },
    })),
  )
}
