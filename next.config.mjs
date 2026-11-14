// Static site: `next build` writes ./out. No server runtime, no middleware, no Cache Components.
// STATIC_EXPORT=1 (the build service) writes the export to ./out (with distDir set, Next exports there) so it does not clash with the dev server's .next.

// Same rule as src/lib/i18n.ts: the second locale is the first supported code that is not the default.
const supported = (process.env.LOCALE_SUPPORTED ?? 'en').split(',').map((code) => code.trim()).filter(Boolean)
const second = supported.find((code) => code !== (process.env.LOCALE_DEFAULT ?? 'en'))

// BASE_PATH: the site is served from a sub-path, e.g. /repo-name on a GitHub Pages project site. Empty (the default) at a domain root.
const basePath = (process.env.BASE_PATH ?? '').replace(/\/+$/, '')

export default {
  output: 'export',
  basePath: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  trailingSlash: true,
  images: { unoptimized: true },
  distDir: process.env.STATIC_EXPORT === '1' ? 'out' : '.next',
  poweredByHeader: false,
  allowedDevOrigins: [process.env.APP_DOMAIN].filter(Boolean),
  // The second locale's routes live in src/app/[locale]/*.l2.tsx. They are pages only when a second locale is
  // configured; with one locale they are plain files, so no second-locale route is generated (an export cannot
  // contain a dynamic route with no params).
  pageExtensions: second ? ['tsx', 'ts', 'l2.tsx'] : ['tsx', 'ts'],
  // Needed for the single 404 page while the default and second locale have separate root layouts.
  experimental: { globalNotFound: true },
}
