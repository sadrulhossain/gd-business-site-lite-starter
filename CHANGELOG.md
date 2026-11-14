# Changelog

## v1.0.0
First release: a static, two-language business site starter cut from gd-business-site-boilerplate (green portal theme, template `main` b7dd103).

- Next.js 16 static export (`output: export`, trailing slashes, no server, no middleware), Tailwind 4, TypeScript.
- Content in `src/data/*.js` with `x` / `x_2nd` fields, validated by Zod at build.
- Home, about, services (list and detail), gallery with lightbox, FAQ, contact, privacy and terms; hidden sections generate no page.
- Default language at the root, optional second language under its own path, hreflang, sitemap, robots, LocalBusiness JSON-LD, 404.
- Image pipeline: sharp to WebP at 480/960/1600 with srcset.
- Docker: dev server, build, nginx preview; `make` targets for build, checks, audit, Trivy scan, Playwright, axe and Lighthouse.
- GitHub Actions: check on push, packaged site on tag. Host files: `_headers` and `.htaccess`.
- Docs: customize, deploy, client handover, upgrade, versions, template sync.
