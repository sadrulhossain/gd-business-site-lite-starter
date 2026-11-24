import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getContent } from '../lib/content'
import { withBase } from '../lib/base'
import { getMessages } from '../lib/i18n'
import { siteUrl } from '../lib/seo'
import { Footer } from './Footer'
import { Header } from './Header'

const RTL = new Set(['ar', 'he', 'fa', 'ur'])

/** Layout metadata of one locale: the SEO defaults of settings.js and the template that appends the site name to page titles. */
export function siteMetadata(locale: string): Metadata {
  const { settings } = getContent(locale)

  return {
    title: { default: settings.seo.title, template: `%s | ${settings.site_name}` },
    description: settings.seo.description,
    openGraph: settings.seo.og_image ? { images: [{ url: settings.seo.og_image }] } : undefined,
    metadataBase: new URL(siteUrl()),
    icons: { icon: withBase('/icon.svg') },
  }
}

/** The whole document of one locale. Each root layout (default locale, [locale]) renders this, since each needs its own <html lang>. */
export function SiteShell({ locale, children }: { locale: string; children: ReactNode }) {
  const { settings, sections } = getContent(locale)
  const messages = getMessages(locale)

  return (
    <html lang={locale} dir={RTL.has(locale.split('-')[0]!) ? 'rtl' : 'ltr'}>
      <body className="flex min-h-screen flex-col bg-canvas font-sans text-base text-ink">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:z-10 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2">
          {messages.nav.skip}
        </a>
        <Header locale={locale} settings={settings} sections={sections} messages={messages} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} settings={settings} sections={sections} messages={messages} />
      </body>
    </html>
  )
}
