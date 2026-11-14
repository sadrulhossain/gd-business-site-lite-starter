import type { Metadata } from 'next'
import { NotFoundContent } from '../components/NotFoundContent'
import { SiteShell } from '../components/SiteShell'
import { defaultLocale, getMessages, locales } from '../lib/i18n'
import './globals.css'

export const metadata: Metadata = { title: '404' }

/**
 * The one 404 page (out/404.html). There are two root layouts, so no layout can wrap it; it renders the default locale's
 * shell and NotFoundContent swaps in the second locale's text from the URL in the browser.
 */
export default function GlobalNotFound() {
  const texts = Object.fromEntries(locales.map((code) => [code, getMessages(code).notFound]))

  return (
    <SiteShell locale={defaultLocale}>
      <NotFoundContent texts={texts} defaultLocale={defaultLocale} />
    </SiteShell>
  )
}
