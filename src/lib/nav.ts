import type { Section } from './content'
import { SECTION_PAGES } from './content'
import { localePath, type Messages } from './i18n'

export interface NavItem {
  key: string
  label: string
  href: string
}

/**
 * Menu entries for the header and footer: one per visible section (hero is the page top). The label is the short
 * `nav.labels` text of the section, since section titles are headings and can be long; the title is the fallback.
 */
export function navItems(locale: string, sections: Section[], messages: Messages, { contact = false } = {}): NavItem[] {
  const labels = messages.nav.labels as Record<string, string>

  return sections
    .filter((s) => s.key !== 'hero' && (contact || s.key !== 'contact'))
    .map((s) => ({
      key: s.key,
      label: labels[s.key] ?? s.title,
      href: s.key === 'contact' ? localePath(locale, '/contact') : SECTION_PAGES[s.key] ? localePath(locale, SECTION_PAGES[s.key]!) : `${localePath(locale)}#${s.key}`,
    }))
}
