import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'
import { HoursList } from '../components/HoursList'
import { JsonLd } from '../components/JsonLd'
import { Picture } from '../components/Media'
import { SectionBlock, SectionRenderer } from '../components/sections'
import { getContent, SECTION_PAGES } from './content'
import { fill, getMessages, localePath } from './i18n'
import { localBusinessJsonLd, pageMetadata } from './seo'

/**
 * One page, independent of where it is mounted. The default locale mounts it at the root (app/(default)), the second
 * locale under app/[locale]; both route trees are thin wrappers (lib/routes.tsx). `X` is the page's own route params.
 */
export interface Screen<X extends object = Record<string, never>> {
  metadata(locale: string, extra: X): Metadata
  Page(props: { locale: string; extra: X }): ReactElement
}

export const home: Screen = {
  // No title: the layout's default (site name | tagline) applies.
  metadata: (locale) => {
    const { settings } = getContent(locale)

    return pageMetadata({ locale, path: '/', siteName: settings.site_name, description: settings.tagline })
  },
  Page: ({ locale }) => {
    const { settings, sections } = getContent(locale)

    return (
      <>
        <JsonLd data={localBusinessJsonLd(settings, locale)} />
        <SectionRenderer sections={sections} locale={locale} settings={settings} messages={getMessages(locale)} />
      </>
    )
  },
}

/**
 * A page made of Home's section views: `main` is the page (its title is the h1 and the metadata title; a hidden or
 * missing section means the site does not offer it, so 404), `extra` sections are appended when visible.
 */
export function sectionScreen(main: string, extra: string[] = []): Screen {
  function load(locale: string) {
    const content = getContent(locale)
    const section = content.sections.find((s) => s.key === main)
    if (!section) notFound()

    return { section, extras: extra.flatMap((key) => content.sections.filter((s) => s.key === key)), settings: content.settings }
  }

  return {
    metadata: (locale) => {
      const { section, settings } = load(locale)

      return pageMetadata({ locale, path: SECTION_PAGES[main] ?? `/${main}`, siteName: settings.site_name, title: section.title, description: section.content, image: section.image?.url })
    },
    Page: ({ locale }) => {
      const { section, extras, settings } = load(locale)
      const ctx = { locale, settings, messages: getMessages(locale) }

      return (
        <>
          <SectionBlock section={section} page {...ctx} />
          {extras.map((s) => (
            <SectionBlock key={s.id} section={s} {...ctx} />
          ))}
        </>
      )
    },
  }
}

/** Privacy and terms: text lives in messages/*.json (`legal.<kind>`), with the business name and email filled in from settings. */
export function legalScreen(kind: 'privacy' | 'terms'): Screen {
  return {
    metadata: (locale) => pageMetadata({ locale, path: `/${kind}`, siteName: getContent(locale).settings.site_name, title: getMessages(locale).pages[kind] }),
    Page: ({ locale }) => {
      const messages = getMessages(locale)
      const { settings } = getContent(locale)
      const values = { site: settings.site_name, email: settings.email ?? settings.site_name }

      return (
        <article className="mx-auto max-w-3xl px-4 py-14">
          <h1 className="font-display text-3xl font-semibold">{messages.pages[kind]}</h1>
          <p className="mt-3 text-sm text-ink-muted">{messages.legal.updated}</p>
          {messages.legal[kind].map((block) => (
            <section key={block.heading} className="mt-8 space-y-2">
              <h2 className="text-xl font-semibold">{block.heading}</h2>
              <p className="text-ink-muted">{fill(block.body, values)}</p>
            </section>
          ))}
        </article>
      )
    },
  }
}

/** Contact details and opening hours (the message form needs a server and is not part of the static site). */
export const contact: Screen = {
  metadata: (locale) => {
    const t = getMessages(locale).contactPage

    return pageMetadata({ locale, path: '/contact', siteName: getContent(locale).settings.site_name, title: t.title, description: t.intro })
  },
  Page: ({ locale }) => {
    const { settings } = getContent(locale)
    const messages = getMessages(locale)
    const t = messages.contactPage
    const mapUrl = settings.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address.replace(/\s*\n\s*/g, ', '))}` : null

    return (
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="font-display text-4xl font-semibold">{t.title}</h1>
          <p className="text-ink-muted">{t.intro}</p>
        </div>

        <aside className="space-y-8" aria-label={t.details}>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">{t.details}</h2>
            <address className="space-y-1 not-italic text-ink-muted">
              {settings.address && <p className="whitespace-pre-line">{settings.address}</p>}
              {settings.phone && (
                <p>
                  <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-brand-700 hover:underline">
                    {settings.phone}
                  </a>
                </p>
              )}
              {settings.email && (
                <p>
                  <a href={`mailto:${settings.email}`} className="text-brand-700 hover:underline">
                    {settings.email}
                  </a>
                </p>
              )}
            </address>
            {mapUrl && (
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-brand-700 underline">
                {t.map}
              </a>
            )}
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">{t.hours}</h2>
            <HoursList settings={settings} messages={messages} />
          </section>
        </aside>
      </div>
    )
  },
}

/** Service detail at /services/<id>/. Pages exist for the ids getContent() lists (dynamicParams is off). */
export const serviceDetail: Screen<{ id: string }> & { params(locale: string): { id: string }[] } = {
  params: (locale) => getContent(locale).services.map((s) => ({ id: String(s.id) })),
  metadata: (locale, { id }) => {
    const content = getContent(locale)
    const service = content.services.find((s) => String(s.id) === id)
    if (!service) notFound()

    return pageMetadata({ locale, path: `/services/${service.id}`, siteName: content.settings.site_name, title: service.title, description: service.description, image: service.image?.url })
  },
  Page: ({ locale, extra: { id } }) => {
    const service = getContent(locale).services.find((s) => String(s.id) === id)
    if (!service) notFound()
    const messages = getMessages(locale)

    return (
      <article className="mx-auto max-w-4xl px-4 py-14">
        <Link href={localePath(locale, '/services')} className="text-brand-700 hover:underline">
          <span aria-hidden="true">←</span> {messages.pages.back}
        </Link>
        <h1 className="mt-4 font-display text-4xl font-semibold">{service.title}</h1>
        <div className={`mt-8 grid items-start gap-8 ${service.image ? 'md:grid-cols-2' : ''}`}>
          {service.image && <Picture image={service.image} alt={service.title} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/3] w-full rounded-lg object-cover" />}
          {service.description && <p className="text-lg whitespace-pre-line text-ink-muted">{service.description}</p>}
        </div>
      </article>
    )
  },
}
