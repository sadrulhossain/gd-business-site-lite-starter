import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteShell, siteMetadata } from '../../components/SiteShell'
import { defaultLocale, locales } from '../../lib/i18n'
import '../globals.css'

/** Root layout of the second locale (/<code>/). Only the locales listed below exist; anything else is a 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return locales.filter((code) => code !== defaultLocale).map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return siteMetadata((await params).locale)
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  return <SiteShell locale={(await params).locale}>{children}</SiteShell>
}
