// Static site: `next build` writes ./out. No server runtime, no middleware, no Cache Components.
// STATIC_EXPORT=1 (the build service) only writes the export to ./out (with distDir set, Next exports there) so it does not clash with the dev server's .next.
export default {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  distDir: process.env.STATIC_EXPORT === '1' ? 'out' : '.next',
  poweredByHeader: false,
  allowedDevOrigins: [process.env.APP_DOMAIN].filter(Boolean),
  // Needed for the single 404 page while the default and second locale have separate root layouts.
  experimental: { globalNotFound: true },
}
