# Customize

Everything a client sees comes from `src/data/*.js`, `content/images/` and the theme tokens. The build fails with a
readable message if the data is invalid (`pnpm validate`, or the docker build).

## Edit the content (`src/data/`)
| File | What it holds |
|------|---------------|
| `settings.js` | Business name, tagline, hours, address, phone, WhatsApp, email, socials, map link, SEO defaults, and which contact methods to show (`contact` flags) |
| `sections.js` | The home page blocks: `key`, `visible`, `order`, heading, text, image |
| `services.js` | Services. `slug` is the page address (`/services/<slug>/`) |
| `pricing.js` | Plans per service (`service` is a slug from `services.js`). Shown on `/pricing/` and on that service's page; hide the `pricing` section in `sections.js` to remove both |
| `faqs.js`, `testimonials.js`, `team.js`, `gallery.js` | Lists shown by their sections |

Set `visible: false` to hide a section; a hidden section has no block, no nav link and no page. Change `order` to move one.
Turn a contact method off with the `contact` flags in `settings.js`.

## Brand
Colours, radii, shadows and the heading font are tokens in `src/styles/portal.css` (`--color-brand-*`, `--color-accent-*`,
`--color-night`, `--font-display`). Change the `brand` and `accent` ramps and the whole site follows. Replace the logo mark
in `src/components/SiteLogo.tsx` and `public/icon.svg` with the client's logo.

## Second language
Every translatable field has a default key and a `_2nd` key (`title`, `title_2nd`). An empty `_2nd` falls back to the default text.
- Languages are set at build time in `.env`: `LOCALE_DEFAULT=en`, `LOCALE_SUPPORTED=en,bn`. The default language is at the
  root, the second under `/<code>/`.
- UI strings (menu, footer, legal text) are in `src/messages/en.json` and `src/messages/second.json`.
- One language only: set `LOCALE_SUPPORTED=en`. No second routes, sitemap entries or switcher are generated.
- A different second language: change the code in `LOCALE_SUPPORTED`, translate `second.json`, fill the `_2nd` fields.

## Add a section
1. Add a row to `src/data/sections.js` and, if it has its own list, a data file plus a schema in `src/data/schema.js`.
2. Add a view for its `key` in `src/components/sections/index.tsx` (a section without a view renders title, text and image).
3. For its own page, add the key to `SECTION_PAGES` in `src/lib/content.ts`; otherwise it appears on the home page only.

## Images
Put originals (jpg or png) in `content/images/` and refer to them by file name (`image: 'hero.jpg'`). `scripts/images.js` writes
WebP at 480, 960 and 1600 px into `public/images/` and a manifest; the build runs it. Render pictures only with
`src/components/Img.tsx`, never `next/image`, which does not work in a static export.
Keep originals under about 2 MB and wide enough for the largest use (1600 px for a hero).

## Contact
Contact is by call, WhatsApp, email, opening hours and a map link only. There is no form, because there is no server.
For bookings or forms, see [UPGRADE.md](UPGRADE.md).
