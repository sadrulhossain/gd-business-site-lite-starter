// getContent(locale): the validated content of src/data/*.js, resolved for one locale.
// Data is parsed once at import time, so invalid data fails the build (scripts/validate-data.js reports it earlier, with paths).
import { secondLocale } from '../lib/i18n'
import manifest from '../generated/images.json'
import { parseContent } from './schema.js'
import faqs from './faqs.js'
import gallery from './gallery.js'
import sections from './sections.js'
import pricing from './pricing.js'
import services from './services.js'
import settings from './settings.js'
import team from './team.js'
import testimonials from './testimonials.js'

const data = parseContent({ settings, sections, services, pricing, faqs, testimonials, team, gallery })

/**
 * Picks `x_2nd` over `x` for the second locale when it is non-empty; otherwise the default text stays. `_2nd` keys are dropped.
 * @template T
 * @param {T} value
 * @param {boolean} useSecond
 * @returns {T}
 */
function localize(value, useSecond) {
  if (Array.isArray(value)) return /** @type {any} */ (value.map((item) => localize(item, useSecond)))
  if (value && typeof value === 'object') {
    /** @type {Record<string, unknown>} */
    const out = {}
    for (const [key, item] of Object.entries(value)) {
      if (key.endsWith('_2nd')) continue
      const alt = /** @type {Record<string, unknown>} */ (value)[`${key}_2nd`]
      out[key] = useSecond && typeof alt === 'string' && alt.trim() !== '' ? alt : localize(item, useSecond)
    }

    return /** @type {any} */ (out)
  }

  return value
}

/**
 * An image file name from the data (content/images/hero.jpg) as the manifest entry scripts/images.js wrote for it.
 * Throws, naming the file, when the pipeline has not produced it.
 * @param {string} name
 */
function entry(name) {
  const found = /** @type {Record<string, { src: string, width: number, height: number, variants: Record<string, string> }>} */ (manifest)[name]
  if (!found) throw new Error(`Image "${name}" is not in the manifest: add it to content/images and run pnpm images`)

  return found
}

/** The Media the views take: plain src, WebP widths for srcset and the intrinsic size. */
const media = (/** @type {string | null} */ name) => {
  if (!name) return null
  const { src, width, height, variants } = entry(name)

  return { url: src, webp: variants, width, height }
}

/** Plain URL of an image for places that take a string (logo, favicon, social card): the widest generated variant. */
const widest = (/** @type {string | null} */ name) => {
  if (!name) return null
  const { src, variants } = entry(name)
  const widths = Object.keys(variants).map(Number)

  return widths.length ? /** @type {string} */ (variants[String(Math.max(...widths))]) : src
}

/**
 * @param {string} locale
 * @returns {import('../lib/content').Content}
 */
export function getContent(locale) {
  const l = localize(data, locale === secondLocale)

  return {
    settings: {
      site_name: l.settings.site_name,
      tagline: l.settings.tagline ?? null,
      logo: widest(l.settings.logo),
      favicon: widest(l.settings.favicon),
      address: l.settings.address ?? null,
      phone: l.settings.phone,
      whatsapp: l.settings.whatsapp,
      email: l.settings.email,
      hours: l.settings.hours,
      social_links: l.settings.social_links,
      map_url: l.settings.map_url,
      seo: { title: l.settings.seo.title, description: l.settings.seo.description, og_image: widest(l.settings.seo.og_image) },
      contact: l.settings.contact,
    },
    // Visible sections in display order.
    sections: l.sections
      .map((s, i) => ({ id: i + 1, key: s.key, title: s.heading, content: s.text ?? null, image: media(s.image), sort_order: s.order, is_visible: s.visible }))
      .filter((s) => s.is_visible)
      .sort((a, b) => a.sort_order - b.sort_order),
    services: l.services.map((s, i) => ({ id: i + 1, slug: s.slug, title: s.title, description: s.description ?? null, image: media(s.image) })),
    pricing: l.pricing.map((p, i) => ({ id: i + 1, service: p.service, title: p.title, price: p.price, unit: p.unit ?? null, description: p.description ?? null, features: p.features.map((f) => f.text), featured: p.featured })),
    testimonials: l.testimonials.map((t, i) => ({ id: i + 1, author_name: t.author_name, author_role: t.author_role ?? null, quote: t.quote, image: media(t.image) })),
    team: l.team.map((m, i) => ({ id: i + 1, name: m.name, role: m.role, bio: m.bio ?? null, image: media(m.image) })),
    gallery: l.gallery.map((g, i) => ({ id: i + 1, title: g.title ?? null, caption: g.caption ?? null, image: media(g.image) })),
    faqs: l.faqs.map((f, i) => ({ id: i + 1, question: f.question, answer: f.answer })),
  }
}
