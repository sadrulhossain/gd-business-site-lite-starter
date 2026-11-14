/** Types of the content the views consume. The data lives in src/data/*.js; getContent(locale) returns it resolved for one locale. */
export interface Media {
  url: string
  webp: Record<string, string>
}

export interface Settings {
  site_name: string
  tagline: string | null
  logo: string | null
  favicon: string | null
  address: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  map_url: string | null
  seo: { title: string; description: string; og_image: string | null }
  /** Which contact methods are shown. */
  contact: { call: boolean; whatsapp: boolean; email: boolean; hours: boolean; map: boolean }
  hours: Record<string, { open: string | null; close: string | null; closed: boolean }> | null
  social_links: Record<string, string | null>
}

export interface Section {
  id: number
  key: string
  title: string
  content: string | null
  image: Media | null
  sort_order: number
  is_visible: boolean
}

export interface Service {
  id: number
  slug: string
  title: string
  description: string | null
  image: Media | null
}

export interface Testimonial {
  id: number
  author_name: string
  author_role: string | null
  quote: string
  image: Media | null
}

export interface TeamMember {
  id: number
  name: string
  role: string
  bio: string | null
  image: Media | null
}

export interface GalleryItem {
  id: number
  title: string | null
  caption: string | null
  image: Media | null
}

export interface Faq {
  id: number
  question: string
  answer: string
}

export interface Content {
  settings: Settings
  /** Visible sections in display order. */
  sections: Section[]
  services: Service[]
  testimonials: Testimonial[]
  team: TeamMember[]
  gallery: GalleryItem[]
  faqs: Faq[]
}

/** Section keys that have a page of their own, and where it lives. The header links here instead of to a Home anchor. */
export const SECTION_PAGES: Record<string, string> = { about: '/about', services: '/services', gallery: '/gallery', faq: '/faq' }

export { getContent } from '../data/index.js'
