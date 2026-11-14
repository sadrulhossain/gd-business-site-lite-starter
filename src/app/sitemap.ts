import type { MetadataRoute } from 'next'
import { defaultLocale, localePath, locales } from '../lib/i18n'
import { listPages } from '../lib/screens'
import { absolute } from '../lib/seo'

export const dynamic = 'force-static'

/** Every public page in every locale, each with its hreflang alternates. Taken from listPages(), so hidden sections are not listed. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths: string[] = ['/', ...listPages(defaultLocale).map((page) => `/${page.path.join('/')}`)]

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absolute(localePath(locale, path)),
      alternates: { languages: Object.fromEntries(locales.map((code) => [code, absolute(localePath(code, path))])) },
    })),
  )
}
