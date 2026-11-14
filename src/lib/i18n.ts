import en from '../messages/en.json'
import second from '../messages/second.json'

/**
 * Locales come from env at build time (LOCALE_DEFAULT, LOCALE_SUPPORTED). The default locale has no URL prefix;
 * the second one (first supported code that is not the default) lives at /<code>/. Only two languages are modelled.
 */
const supported = (process.env.LOCALE_SUPPORTED ?? 'en').split(',').map((s) => s.trim()).filter(Boolean)

export const defaultLocale = process.env.LOCALE_DEFAULT ?? 'en'
export const secondLocale = supported.find((code) => code !== defaultLocale)
export const locales = secondLocale ? [defaultLocale, secondLocale] : [defaultLocale]

export type Messages = typeof en

export function isLocale(value: string): boolean {
  return locales.includes(value)
}

/** Objects merge key by key; anything else (strings, arrays) from `override` replaces, but only when it is non-empty. */
function withFallback<T>(base: T, override: unknown): T {
  if (override === undefined || override === null || override === '') return base
  if (typeof base === 'object' && base !== null && !Array.isArray(base) && typeof override === 'object' && !Array.isArray(override)) {
    return Object.fromEntries(Object.entries(base).map(([key, value]) => [key, withFallback(value, (override as Record<string, unknown>)[key])])) as T
  }

  return override as T
}

/**
 * messages/en.json belongs to the default locale, messages/second.json to the second. A key missing or empty in
 * second.json shows the default text instead of nothing.
 */
export function getMessages(locale: string): Messages {
  return locale === secondLocale ? withFallback(en, second) : en
}

/** Replaces {site}, {email} ... in a message. */
export function fill(text: string, values: Record<string, string | null | undefined>): string {
  return text.replace(/{(w+)}/g, (_, key: string) => values[key] ?? '')
}

/** Browser-facing path of `path` ("/", "/about") in `locale`, always with a trailing slash (trailingSlash: true). `unprefixed` is the default locale. */
export function localePath(locale: string, path = '/', unprefixed = defaultLocale): string {
  const clean = path.replace(/\/+$/, '')

  return `${locale === unprefixed ? clean : `/${locale}${clean}`}/`
}

/**
 * Removes a leading locale prefix from a browser pathname: "/bn/about/" -> "/about/", "/bn/" -> "/".
 * Client components get `all` and `unprefixed` as props because the env vars exist only at build time.
 */
export function stripLocale(pathname: string, all: string[] = locales, unprefixed = defaultLocale): string {
  for (const code of all) {
    if (code !== unprefixed && (pathname === `/${code}` || pathname.startsWith(`/${code}/`))) {
      return pathname.slice(code.length + 1) || '/'
    }
  }

  return pathname
}

/** Display name of a locale in its own language, for the switcher. */
export function localeName(locale: string): string {
  try {
    const name = new Intl.DisplayNames([locale], { type: 'language' }).of(locale) ?? locale

    return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1)
  } catch {
    return locale.toUpperCase()
  }
}
