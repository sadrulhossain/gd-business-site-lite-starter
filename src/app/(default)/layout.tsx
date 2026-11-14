import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteShell, siteMetadata } from '../../components/SiteShell'
import { defaultLocale } from '../../lib/i18n'
import '../globals.css'

/** Root layout of the default locale, served without a URL prefix. */
export const metadata: Metadata = siteMetadata(defaultLocale)

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale={defaultLocale}>{children}</SiteShell>
}
