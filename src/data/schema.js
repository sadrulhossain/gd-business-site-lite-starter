// Zod schemas for src/data/*.js. Plain JS on purpose: scripts/validate-data.js imports this under Node, no build step.
// Every translatable field `x` has an optional `x_2nd`; empty or missing `x_2nd` falls back to `x` (see index.js).
import { z } from 'zod'

const text = z.string().trim().min(1)
const optionalText = z.string().trim().nullish()
// A file name in content/images (the originals); scripts/images.js turns it into WebP sizes.
const imagePath = z.string().regex(/^[\w.-]+\.(jpe?g|png|webp|svg)$/i, 'use a file name from content/images, for example hero.jpg')
const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'use HH:MM')

/** `name` and `name_2nd`: the default-language text and its optional second-language text. */
const tr = (name, required = true) => ({ [name]: required ? text : optionalText, [`${name}_2nd`]: optionalText })

export const SECTION_KEYS = ['hero', 'about', 'services', 'testimonials', 'gallery', 'faq', 'team', 'contact']
export const SOCIAL_NETWORKS = ['facebook', 'instagram', 'x', 'linkedin', 'youtube', 'tiktok']
const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const day = z
  .strictObject({ open: hhmm.nullable(), close: hhmm.nullable(), closed: z.boolean() })
  .refine((d) => d.closed || (d.open !== null && d.close !== null && d.open < d.close), 'an open day needs open < close')

export const settingsSchema = z.strictObject({
  ...tr('site_name'),
  ...tr('tagline', false),
  logo: imagePath.nullable(),
  favicon: imagePath.nullable(),
  hours: z.strictObject(Object.fromEntries(DAYS.map((d) => [d, day]))),
  ...tr('address', false),
  phone: z.string().regex(/^\+?[\d\s()-]{6,20}$/, 'digits, spaces, + ( ) -').nullable(),
  whatsapp: z.string().regex(/^\d{7,15}$/, 'digits only, with country code, no +').nullable(),
  email: z.email().nullable(),
  social_links: z.partialRecord(z.enum(SOCIAL_NETWORKS), z.url()),
  map_url: z.url().nullable(),
  seo: z.strictObject({ ...tr('title'), ...tr('description'), og_image: imagePath.nullable() }),
  // Which contact methods the Contact page and footer show (a method also needs its value set above).
  contact: z.strictObject({ call: z.boolean(), whatsapp: z.boolean(), email: z.boolean(), hours: z.boolean(), map: z.boolean() }),
})

export const sectionsSchema = z
  .array(z.strictObject({ key: z.enum(SECTION_KEYS), visible: z.boolean(), order: z.int().min(0), ...tr('heading'), ...tr('text', false), image: imagePath.nullable() }))
  .refine((rows) => new Set(rows.map((r) => r.key)).size === rows.length, 'duplicate section key')

export const servicesSchema = z
  .array(z.strictObject({ slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'lower-case words joined by -'), ...tr('title'), ...tr('description', false), image: imagePath.nullable() }))
  .refine((rows) => new Set(rows.map((r) => r.slug)).size === rows.length, 'duplicate service slug')

export const faqsSchema = z.array(z.strictObject({ ...tr('question'), ...tr('answer') }))

export const testimonialsSchema = z.array(z.strictObject({ author_name: text, ...tr('author_role', false), ...tr('quote'), image: imagePath.nullable() }))

export const teamSchema = z.array(z.strictObject({ name: text, ...tr('role'), ...tr('bio', false), image: imagePath.nullable() }))

export const gallerySchema = z.array(z.strictObject({ ...tr('title', false), ...tr('caption', false), image: imagePath.nullable() }))

/** File name (without .js) -> schema. Each file default-exports its value. */
export const schemas = {
  settings: settingsSchema,
  sections: sectionsSchema,
  services: servicesSchema,
  faqs: faqsSchema,
  testimonials: testimonialsSchema,
  team: teamSchema,
  gallery: gallerySchema,
}

/** Parses `{ settings, sections, ... }`; returns the parsed content or throws a ZodError naming every bad path. */
export function parseContent(raw) {
  return z.strictObject(schemas).parse(raw)
}

/** Like parseContent, but returns `{ data }` or `{ errors: ['settings.site_name: ...'] }`. */
export function checkContent(raw) {
  const result = z.object(schemas).safeParse(raw)
  if (result.success) return { data: result.data }

  return { errors: result.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`) }
}
