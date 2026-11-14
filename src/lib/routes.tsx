import type { Metadata } from 'next'
import { defaultLocale } from './i18n'
import type { Screen } from './screens'

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
