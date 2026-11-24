import { getContent, type Section, type Settings } from '../lib/content'
import Link from 'next/link'
import { contactMethods } from '../lib/contact'
import { localePath, type Messages } from '../lib/i18n'
import { navItems } from '../lib/nav'
import { SiteLogo } from './SiteLogo'
import { SocialIcon } from './SocialIcon'

const SOCIAL: Record<string, string> = { facebook: 'Facebook', instagram: 'Instagram', x: 'X', linkedin: 'LinkedIn', youtube: 'YouTube', tiktok: 'TikTok', whatsapp: 'WhatsApp' }

/** Dark footer: brand, contact with social links, important links and services, all from public settings. */
export function Footer({ locale, settings, sections, messages }: { locale: string; settings: Settings; sections: Section[]; messages: Messages }) {
  const social = Object.entries(settings.social_links ?? {}).filter(([, url]) => url)
  const methods = contactMethods(settings, messages.sections)
  const pages = navItems(locale, sections, messages, { contact: true })
  const services = getContent(locale).services.slice(0, 6)
  const heading = 'text-sm font-semibold tracking-widest text-accent-400 uppercase'
  const link = 'text-white/75 transition-colors hover:text-white'

  return (
    <footer className="relative overflow-hidden bg-night text-white/80">
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 -end-32 size-96 rounded-full bg-brand-600/25 blur-3xl" />
      <div className="relative mx-auto grid w-[92%] max-w-7xl gap-10 py-12 sm:grid-cols-2 md:py-16 lg:grid-cols-4">
        <div className="space-y-4">
          <SiteLogo settings={settings} dark />
          {settings.tagline && <p className="max-w-xs text-white/70">{settings.tagline}</p>}
        </div>

        <div className="space-y-4">
          <h2 className={heading}>{messages.footer.contact}</h2>
          <address className="space-y-2 not-italic">
            {settings.address && <p className="whitespace-pre-line text-white/75">{settings.address}</p>}
            {methods.map((m) => (
              <p key={m.key} className="break-words">
                <a href={m.href} className={link}>
                  {m.text}
                </a>
              </p>
            ))}
          </address>
          {social.length > 0 && (
            <ul aria-label={messages.footer.follow} className="flex flex-wrap gap-3 pt-1">
              {social.map(([network, url]) => (
                <li key={network}>
                  <a
                    href={url!}
                    rel="noopener noreferrer"
                    target="_blank"
                    aria-label={SOCIAL[network] ?? network}
                    title={SOCIAL[network] ?? network}
                    className="flex size-10 items-center justify-center rounded-full border border-white/20 text-white/85 transition hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-night"
                  >
                    <SocialIcon network={network} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label={messages.footer.links} className="space-y-4">
          <h2 className={heading}>{messages.footer.links}</h2>
          <ul className="space-y-2">
            <li>
              <Link prefetch={false} href={localePath(locale)} className={link}>
                {messages.nav.home}
              </Link>
            </li>
            {pages.map((x) => (
              <li key={x.key}>
                <Link prefetch={false} href={x.href} className={link}>
                  {x.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {services.length > 0 && (
          <nav aria-label={messages.footer.services} className="space-y-4">
            <h2 className={heading}>{messages.footer.services}</h2>
            <ul className="space-y-2">
              {services.map((x) => (
                <li key={x.id}>
                  <Link prefetch={false} href={localePath(locale, '/services')} className={link}>
                    {x.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      <div className="relative border-t border-white/10 py-5">
        <div className="mx-auto flex w-[92%] max-w-7xl flex-col items-start justify-between gap-2 text-start text-sm text-white/65 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {settings.site_name}. {messages.footer.rights} {messages.footer.poweredBy} Orvyx Technologies
          </p>
          <nav aria-label={messages.footer.legal} className="flex gap-5">
            <Link prefetch={false} href={localePath(locale, '/privacy')} className={link}>
              {messages.footer.privacy}
            </Link>
            <Link prefetch={false} href={localePath(locale, '/terms')} className={link}>
              {messages.footer.terms}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
