# Phases

Tick a phase only when it is finished and committed.

| Done | # | Phase | Scope / files |
|------|---|-------|---------------|
| [x] | L0 | Clone and trim | Clone template, drop api/admin/php/db/redis/mailpit, flatten portal to repo root, CLAUDE.md, docs |
| [x] | L1 | Docker | node dev service, build service (static export to ./out), optional nginx preview, ports on 127.0.0.1, compose services |
| [x] | L2 | Static export | output export + trailingSlash, content stub getContent(), default locale at root via (default) group and second under [locale] (dynamicParams false), no API/ISR/blog/contact form/middleware |
| [x] | L3 | JS data layer | src/data/*.js content with x / x_2nd, Zod schemas, scripts/validate-data.js (before build) with a bad-fixture test, getContent(locale) with locale fallback, bakery sample data |
| [x] | L4 | Rewire sections and pages | Sections and pages read getContent(); one [...slug] route per locale tree from listPages() (hidden sections generate no page), services/<slug>, contact by settings.js flags, native details and dialog lightbox |
| [x] | L5 | Locale routing and SEO | Second-locale routes are *.l2.tsx pages only when a second locale is configured (pageExtensions), SEO defaults and OG from settings.js, hreflang/canonical, LocalBusiness JSON-LD, force-static sitemap and robots, 404, HTTP e2e (e2e/seo.spec.ts) |
| [x] | L6 | Image pipeline | scripts/images.js (sharp): content/images originals -> public/images WebP 480/960/1600 + src/generated/images.json; <Img> plain img with srcset, sizes, width, height, lazy; runs before dev, typecheck and build (docker build); data image fields are file names, checked by validate-data |
| [x] | L7 | Quality, CI, deploy files | Playwright smoke + axe (both languages) on the preview, Lighthouse 95/100, pnpm audit, Trivy on both images (node and nginx Dockerfiles), GitHub Actions check + tag release, public/_headers and public/.htaccess, checks documented in the README |
| [x] | L8 | Release and docs | README quick start, docs/CUSTOMIZE.md, DEPLOY.md, CLIENT_HANDOVER.md, UPGRADE.md, SYNC.md record, CHANGELOG; tag v1.0.0 only after the checks pass |
| [x] | L9 | Pricing | pricing.js (plans per service, Zod + service cross-check), `pricing` section (Home teaser with See pricing button), /pricing page under Explore, pricing block on service pages, messages, a11y path |
