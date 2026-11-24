import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { localeParams, resolveLocalePath } from '../../lib/routes'
import { findPage } from '../../lib/screens'
import { home } from '../../lib/screens'

/** Home of the second locale (/<code>/). Any other first segment is a default-locale page (see resolveLocalePath). */
export const generateStaticParams = localeParams

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = resolveLocalePath(await params)
  if (slug.length === 0) return home.metadata(locale, {})
  const page = findPage(locale, slug)

  return page ? page.screen.metadata(locale, page.extra) : {}
}

export default async function LocalePage({ params }: Props) {
  const { locale, slug } = resolveLocalePath(await params)
  if (slug.length === 0) return <home.Page locale={locale} extra={{}} />
  const page = findPage(locale, slug)
  if (!page) notFound()

  return <page.screen.Page locale={locale} extra={page.extra} />
}
