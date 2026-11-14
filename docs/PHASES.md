# Phases

Tick a phase only when it is finished and committed.

| Done | # | Phase | Scope / files |
|------|---|-------|---------------|
| [x] | L0 | Clone and trim | Clone template, drop api/admin/php/db/redis/mailpit, flatten portal to repo root, CLAUDE.md, docs |
| [x] | L1 | Docker and Make | node dev service, build service (static export to ./out), optional nginx preview, ports on 127.0.0.1, quiet Makefile |
| [x] | L2 | Static export | output export + trailingSlash, content stub getContent(), default locale at root via (default) group and second under [locale] (dynamicParams false), no API/ISR/blog/contact form/middleware |
| [x] | L3 | JS data layer | src/data/*.js content with x / x_2nd, Zod schemas, scripts/validate-data.js (make check, before build) with a bad-fixture test, getContent(locale) with locale fallback, bakery sample data |
| [x] | L4 | Rewire sections and pages | Sections and pages read getContent(); one [...slug] route per locale tree from listPages() (hidden sections generate no page), services/<slug>, contact by settings.js flags, native details and dialog lightbox |
| [x] | L5 | Locale routing and SEO | Second-locale routes are *.l2.tsx pages only when a second locale is configured (pageExtensions), SEO defaults and OG from settings.js, hreflang/canonical, LocalBusiness JSON-LD, force-static sitemap and robots, 404, HTTP e2e (e2e/seo.spec.ts) |
| [ ] | L6 | TBD | TBD |
| [ ] | L7 | TBD | TBD |
| [ ] | L8 | TBD | TBD |
