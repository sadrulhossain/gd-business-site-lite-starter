/**
 * Content layer stub. getContent() returns static placeholders so the static export builds with no backend;
 * a later phase replaces the body with the real content source. Types are what the views consume.
 */
export interface Media {
  url: string
  webp: Record<string, string>
}

export interface Settings {
  site_name: string
  tagline: string | null
  address: string | null
  phone: string | null
  email: string | null
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

const section = (id: number, key: string, title: string, content: string | null): Section => ({ id, key, title, content, image: null, sort_order: id * 10, is_visible: true })

/** Static placeholders, the same for every locale until the real content source exists. */
export function getContent(locale: string): Content {
  void locale

  return {
    settings: {
      site_name: 'Your Business',
      tagline: 'A short line about what you do',
      address: '1 Example Street\nYour City',
      phone: '+1 555 0100',
      email: 'hello@example.com',
      hours: {
        mon: { open: '09:00', close: '17:00', closed: false },
        tue: { open: '09:00', close: '17:00', closed: false },
        wed: { open: '09:00', close: '17:00', closed: false },
        thu: { open: '09:00', close: '17:00', closed: false },
        fri: { open: '09:00', close: '17:00', closed: false },
        sat: { open: null, close: null, closed: true },
        sun: { open: null, close: null, closed: true },
      },
      social_links: {},
    },
    sections: [
      section(1, 'hero', 'Welcome to Your Business', 'Placeholder introduction text.'),
      section(2, 'about', 'About us', 'Placeholder text about the business.'),
      section(3, 'services', 'Services', 'What we offer.'),
      section(4, 'testimonials', 'What customers say', null),
      section(5, 'gallery', 'Gallery', null),
      section(6, 'faq', 'Questions', null),
      section(7, 'team', 'Our team', null),
      section(8, 'contact', 'Contact', 'Get in touch.'),
    ],
    services: [
      { id: 1, title: 'Service one', description: 'Placeholder description of the first service.', image: null },
      { id: 2, title: 'Service two', description: 'Placeholder description of the second service.', image: null },
    ],
    testimonials: [{ id: 1, author_name: 'A customer', author_role: null, quote: 'A placeholder testimonial.', image: null }],
    team: [{ id: 1, name: 'Team member', role: 'Role', bio: null, image: null }],
    gallery: [],
    faqs: [{ id: 1, question: 'A placeholder question?', answer: 'A placeholder answer.' }],
  }
}
