import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteShell, siteMetadata } from '../../components/SiteShell'
import { defaultLocale, locales } from '../../lib/i18n'
import { localeParams } from '../../lib/routes'
import '../globals.css'

/** Root layout of the second locale (/<code>/). Only those locales are exported; the dev server also routes default-locale paths here (resolveLocalePath). */
const localeOf = (segment: string) => (locales.includes(segment) ? segment : defaultLocale)

export const generateStaticParams = localeParams

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return siteMetadata(localeOf((await params).locale))
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  return <SiteShell locale={localeOf((await params).locale)}>{children}</SiteShell>
}
