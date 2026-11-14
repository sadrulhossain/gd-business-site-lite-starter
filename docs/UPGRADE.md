# Upgrade to the full edition

Move a client when they need to edit content without a developer, take forms or bookings, run a blog, or have staff accounts.
The full edition is `gd-business-site-boilerplate` (API, admin, database, portal). The lite starter was cut from it, so the data
shapes match.

## What carries over
- Theme tokens and the portal components (copied from the template, see SYNC.md).
- Content shape: `settings`, `sections`, `services`, `faqs`, `testimonials`, `team`, `gallery` with the same fields. The `x` / `x_2nd`
  pairs are the two-language fields the full edition stores as translations.
- Section keys, `SECTION_PAGES` paths, locale routing (default at root, second under `/<code>/`) and the SEO rules.
- Images: the originals in `content/images/` are uploaded through the admin.

## What changes
| Lite | Full edition |
|------|--------------|
| `src/data/*.js`, validated at build | Rows in the database, edited in the admin |
| `getContent(locale)` | API client and fetchers with cache tags |
| Static export in `out/` | Server-rendered portal with revalidation |
| Contact by call, WhatsApp, email, map | Contact form, captcha, blog |
| Any static host | Containers: portal, API, PHP, database, Redis |

## Steps
1. Start the template (`gd-business-site-boilerplate`) for the client and create the admin account.
2. In the admin, enter settings, sections, services, FAQs, testimonials, team and gallery from the `src/data` files, field for field; upload the images.
3. Set the same `LOCALE_DEFAULT` and `LOCALE_SUPPORTED`, and copy any custom theme tokens (`src/styles/portal.css`) and components you changed.
4. Compare the pages side by side (same URLs), then switch DNS. Keep the old static site for a week as a fallback.
5. Add redirects only if a URL changed; the page paths are the same by design.

There is no one-click migration: the content is small enough to enter by hand, and a script would hide mistakes.
