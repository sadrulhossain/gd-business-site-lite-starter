import type { Metadata } from 'next'
import { defaultLocale, locales } from './i18n'
import { notFound } from 'next/navigation'
import { findPage, listPages, type Screen } from './screens'

/** Route wrappers: mount a Screen at the root (default locale) or under the [locale] segment (second locale). */
type NoParams = Record<string, never>

export function defaultRoute<X extends object = NoParams>(screen: Screen<X>) {
  return {
    async generateMetadata({ params }: { params?: Promise<X> }): Promise<Metadata> {
      return screen.metadata(defaultLocale, (await params) ?? ({} as X))
    },
    async Page({ params }: { params?: Promise<X> }) {
      return <screen.Page locale={defaultLocale} extra={(await params) ?? ({} as X)} />
    },
  }
}

export function localeRoute<X extends object = NoParams>(screen: Screen<X>) {
  return {
    async generateMetadata({ params }: { params: Promise<{ locale: string } & X> }): Promise<Metadata> {
      const { locale, ...extra } = await params

      return screen.metadata(locale, extra as unknown as X)
    },
    async Page({ params }: { params: Promise<{ locale: string } & X> }) {
      const { locale, ...extra } = await params

      return <screen.Page locale={locale} extra={extra as unknown as X} />
    },
  }
}

/**
 * Which locale and page a [locale] URL means. In the dev server a one-segment or nested default-locale URL such as
 * /pricing/ or /services/cake/ also matches the [locale] route ("pricing" as a locale), because dynamic routes win over
 * the catch-all. A first segment that is not a configured locale is therefore the default locale's own path.
 */
export function resolveLocalePath(params: { locale?: string; slug?: string[] }): { locale: string; slug: string[] } {
  const slug = params.slug ?? []
  const first = params.locale
  if (first && !locales.includes(first)) return { locale: defaultLocale, slug: [first, ...slug] }

  return { locale: first ?? defaultLocale, slug }
}

/** The [...slug] route of a locale tree: every page listed by listPages() (the 404 for anything else). */
export function pagesRoute() {
  return {
    staticParams: (parent: { locale?: string } = {}) => {
      const locale = parent.locale ?? defaultLocale

      if (locales.includes(locale)) return listPages(locale).map((page) => ({ slug: page.path }))
      // Dev only (see resolveLocalePath): /services/cake/ reaches [locale]/[...slug] as locale "services", slug ["cake"].
      if (process.env.NODE_ENV !== 'development') return []

      const nested = listPages(defaultLocale).filter((page) => page.path.length > 1 && page.path[0] === locale).map((page) => ({ slug: page.path.slice(1) }))

      // An export needs at least one param per parent value; this placeholder is never linked and renders the 404.
      return nested.length > 0 ? nested : [{ slug: ['-'] }]
    },
    async generateMetadata({ params }: { params: Promise<{ locale?: string; slug: string[] }> }): Promise<Metadata> {
      const { locale, slug } = resolveLocalePath(await params)
      const page = findPage(locale, slug)

      return page ? page.screen.metadata(locale, page.extra) : {}
    },
    async Page({ params }: { params: Promise<{ locale?: string; slug: string[] }> }) {
      const { locale, slug } = resolveLocalePath(await params)
      const page = findPage(locale, slug)
      if (!page) notFound()
      const { Page: Screen } = page.screen

      return <Screen locale={locale} extra={page.extra} />
    },
  }
}

/** Static params of [locale]/page: the second locales; in dev also the default locale's one-segment pages (see resolveLocalePath). */
export function localeParams(): { locale: string }[] {
  const params = locales.filter((code) => code !== defaultLocale).map((locale) => ({ locale }))
  if (process.env.NODE_ENV !== 'development') return params

  return [...params, ...listPages(defaultLocale).filter((page) => page.path.length === 1).map((page) => ({ locale: page.path[0]! }))]
}
