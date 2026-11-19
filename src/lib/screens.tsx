import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'
import { HoursList } from '../components/HoursList'
import { JsonLd } from '../components/JsonLd'
import { Img } from '../components/Img'
import { PricingPlans } from '../components/PricingPlans'
import { SectionBlock, SectionRenderer } from '../components/sections'
import { contactMethods, mapHref } from './contact'
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
  // No title: the layout's default (seo.title) applies.
  metadata: (locale) => {
    const { settings } = getContent(locale)

    return pageMetadata({ locale, path: '/', siteName: settings.site_name, description: settings.seo.description })
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
          <h1 className="font-display text-3xl font-extrabold tracking-tight">{messages.pages[kind]}</h1>
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

/** Call, WhatsApp, email, hours and map link, each toggled by the flags in settings.js (no message form: the site has no server). */
export const contact: Screen = {
  metadata: (locale) => {
    const t = getMessages(locale).contactPage

    return pageMetadata({ locale, path: '/contact', siteName: getContent(locale).settings.site_name, title: t.title, description: t.intro })
  },
  Page: ({ locale }) => {
    const { settings } = getContent(locale)
    const messages = getMessages(locale)
    const t = messages.contactPage
    const methods = contactMethods(settings, messages.sections)
    const mapUrl = mapHref(settings)

    return (
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">{t.title}</h1>
          <p className="text-ink-muted">{t.intro}</p>
        </div>

        <aside className="space-y-8" aria-label={t.details}>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">{t.details}</h2>
            <address className="space-y-1 not-italic text-ink-muted">
              {settings.address && <p className="whitespace-pre-line">{settings.address}</p>}
              {methods.map((m) => (
                <p key={m.key}>
                  <span className="text-ink">{m.label}: </span>
                  <a href={m.href} className="text-brand-700 hover:underline">
                    {m.text}
                  </a>
                </p>
              ))}
            </address>
            {mapUrl && (
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-brand-700 underline">
                {t.map}
              </a>
            )}
          </section>

          {settings.contact.hours && (
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">{t.hours}</h2>
              <HoursList settings={settings} messages={messages} />
            </section>
          )}
        </aside>
      </div>
    )
  },
}

/** Service detail at /services/<slug>/. */
export const serviceDetail: Screen<{ slug: string }> = {
  metadata: (locale, { slug }) => {
    const content = getContent(locale)
    const service = content.services.find((s) => s.slug === slug)
    if (!service) notFound()

    return pageMetadata({ locale, path: `/services/${service.slug}`, siteName: content.settings.site_name, title: service.title, description: service.description, image: service.image?.url })
  },
  Page: ({ locale, extra: { slug } }) => {
    const { services, sections, pricing } = getContent(locale)
    const service = services.find((s) => s.slug === slug)
    if (!service) notFound()
    const messages = getMessages(locale)
    // Pricing shows only while the pricing section is visible.
    const plans = sections.some((s) => s.key === 'pricing') ? pricing.filter((p) => p.service === service.slug) : []

    return (
      <article className="mx-auto max-w-4xl px-4 py-14">
        <Link prefetch={false} href={localePath(locale, '/services')} className="text-brand-700 hover:underline">
          <span aria-hidden="true">←</span> {messages.pages.back}
        </Link>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">{service.title}</h1>
        <div className={`mt-8 grid items-start gap-8 ${service.image ? 'md:grid-cols-2' : ''}`}>
          {service.image && <Img image={service.image} alt={service.title} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/3] w-full rounded-lg object-cover" />}
          {service.description && <p className="text-lg whitespace-pre-line text-ink-muted">{service.description}</p>}
        </div>
        {plans.length > 0 && (
          <section aria-labelledby="service-pricing" className="mt-14">
            <h2 id="service-pricing" className="mb-6 text-2xl font-bold tracking-tight">
              {messages.pages.pricing}
            </h2>
            <PricingPlans plans={plans} messages={messages} />
          </section>
        )}
      </article>
    )
  },
}

export interface PageEntry {
  /** URL segments below the locale root: ['about'], ['services', 'daily-bread']. */
  path: string[]
  screen: Screen<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  extra: object
}

/**
 * Every page of a locale except Home, from the data: a section's page exists only while that section is visible
 * (hidden sections generate nothing). Privacy and terms are always there. Both [...slug] routes build from this list.
 */
export function listPages(locale: string): PageEntry[] {
  const { sections, services } = getContent(locale)
  const visible = (key: string) => sections.some((s) => s.key === key)
  const pages: PageEntry[] = []

  for (const key of Object.keys(SECTION_PAGES)) {
    if (visible(key)) pages.push({ path: [key], screen: sectionScreen(key), extra: {} })
  }
  if (visible('services')) {
    for (const service of services) pages.push({ path: ['services', service.slug], screen: serviceDetail, extra: { slug: service.slug } })
  }
  if (visible('contact')) pages.push({ path: ['contact'], screen: contact, extra: {} })
  pages.push({ path: ['privacy'], screen: legalScreen('privacy'), extra: {} }, { path: ['terms'], screen: legalScreen('terms'), extra: {} })

  return pages
}

export function findPage(locale: string, slug: string[]): PageEntry | undefined {
  const wanted = slug.join('/')

  return listPages(locale).find((page) => page.path.join('/') === wanted)
}
