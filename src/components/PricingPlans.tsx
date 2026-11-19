import type { PricingPlan } from '../lib/content'
import type { Messages } from '../lib/i18n'

/** The plans of one service as cards. `Heading` is the level of each plan title (h3 under a section heading). */
export function PricingPlans({ plans, messages, Heading = 'h3' }: { plans: PricingPlan[]; messages: Messages; Heading?: 'h3' | 'h4' }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((p) => (
        <li
          key={p.id}
          className={`relative flex flex-col rounded-lg border bg-surface p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift ${p.featured ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-line'}`}
        >
          {p.featured && <span className="mb-3 w-fit rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold tracking-widest text-brand-700 uppercase">{messages.sections.popular}</span>}
          <Heading className="text-xl font-bold tracking-tight">{p.title}</Heading>
          <p className="mt-3">
            <span className="font-display text-3xl font-extrabold tracking-tight text-brand-700">{p.price}</span>
            {p.unit && <span className="ms-2 text-sm text-ink-muted">{p.unit}</span>}
          </p>
          {p.description && <p className="mt-3 whitespace-pre-line text-ink-muted">{p.description}</p>}
          {p.features.length > 0 && (
            <ul className="mt-4 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-600" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}
