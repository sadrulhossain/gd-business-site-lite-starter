import type { Settings } from './content'

export interface ContactMethod {
  key: 'call' | 'whatsapp' | 'email'
  label: string
  /** What the link shows. */
  text: string
  href: string
}

/** Call, WhatsApp and email links, each only when its flag in settings.js is on and its value is set. */
export function contactMethods(settings: Settings, labels: { call: string; whatsapp: string; email: string }): ContactMethod[] {
  const methods: ContactMethod[] = []
  if (settings.contact.call && settings.phone) methods.push({ key: 'call', label: labels.call, text: settings.phone, href: `tel:${settings.phone.replace(/\s+/g, '')}` })
  if (settings.contact.whatsapp && settings.whatsapp) methods.push({ key: 'whatsapp', label: labels.whatsapp, text: `+${settings.whatsapp}`, href: `https://wa.me/${settings.whatsapp}` })
  if (settings.contact.email && settings.email) methods.push({ key: 'email', label: labels.email, text: settings.email, href: `mailto:${settings.email}` })

  return methods
}

/** The map link: `map_url` from settings.js, else a maps search for the address; null when the map flag is off. */
export function mapHref(settings: Settings): string | null {
  if (!settings.contact.map) return null
  if (settings.map_url) return settings.map_url
  if (!settings.address) return null

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address.replace(/\s*\n\s*/g, ', '))}`
}
