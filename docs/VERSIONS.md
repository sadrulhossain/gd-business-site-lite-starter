# Versions

Rebuilt from the template's docs/VERSIONS.md; floors re-verified 2026-11-14 (phase L7: pnpm audit clean, Trivy clean, npm latest compared). Pin = what we build against. Floor = minimum safe version (never go below).
Dependencies not listed here must not be added (CLAUDE.md rule 2).

| Component | Pin | Floor | Source | Date | Docker Hub |
|-----------|-----|-------|--------|------|------------|
| Node.js 24 LTS "Krypton" | 24.22.3 | 24.22.3 | https://nodejs.org/en/blog/vulnerability/november-2026-security-releases | 2026-11-11 | `node:24.22.3-alpine` (recheck the tag exists before building) |
| Next.js | 16.4.6 | 16.4.6 | https://github.com/vercel/next.js/releases/tag/v16.4.6 | 2026-11-12 | n/a |
| nginx | 1.30.6 | 1.30.6 | https://nginx.org/en/CHANGES-1.30 | 2026-11-11 | `nginx:1.30.6-alpine` exists |
| React / React DOM | 19.3.1 | 19.3.1 | https://www.npmjs.com/package/react/v/19.3.1 | 2026-11-12 | n/a (npm) |
| pnpm | 12.18.0 | 12.18.0 | https://www.npmjs.com/package/pnpm/v/12.18.0 | 2026-11-12 | n/a (corepack, `packageManager` in package.json) |
| tailwindcss | 4.3.5 | 4.3.5 | https://www.npmjs.com/package/tailwindcss/v/4.3.5 | 2026-11-12 | n/a (npm) |
| @tailwindcss/postcss | 4.3.5 | 4.3.5 | https://www.npmjs.com/package/@tailwindcss/postcss/v/4.3.5 | 2026-11-12 | n/a (npm) |
| postcss | 8.5.32 | 8.5.32 | https://www.npmjs.com/package/postcss/v/8.5.32 | 2026-11-12 | n/a (npm; forced by `pnpm.overrides`, Next pins an older one) |
| typescript | 5.9.3 | 5.9.3 | https://www.npmjs.com/package/typescript/v/5.9.3 | 2026-11-12 | n/a (npm) |
| @types/react / @types/react-dom | 19.3.0 | 19.3.0 | https://www.npmjs.com/package/@types/react/v/19.3.0 | 2026-11-12 | n/a (npm) |
| @types/node | 24.19.2 | 24.19.2 | https://www.npmjs.com/package/@types/node/v/24.19.2 | 2026-11-12 | n/a (npm; 24.x line to match Node 24) |
| @playwright/test | 1.65.0 | 1.65.0 | https://www.npmjs.com/package/@playwright/test/v/1.65.0 | 2026-11-13 | image `mcr.microsoft.com/playwright:v1.65.0-noble` (must match) |
| @axe-core/playwright | 4.14.0 | 4.14.0 | https://www.npmjs.com/package/@axe-core/playwright/v/4.14.0 | 2026-11-13 | n/a (npm) |
| sharp | 0.35.5 | 0.35.5 | https://www.npmjs.com/package/sharp/v/0.35.5 | 2026-11-14 | n/a (npm) |
| Trivy | 0.76.2 | 0.76.2 | https://github.com/aquasecurity/trivy/releases/tag/v0.76.2 | 2026-11-14 | `aquasec/trivy:0.76.2` (tool run on demand, not a dependency) |
| Lighthouse | 13.6.0 | 13.6.0 | https://www.npmjs.com/package/lighthouse/v/13.6.0 | 2026-11-14 | n/a (npx inside the e2e container; not a dependency) |
| Zod | 4.6.7 | 4.6.7 | https://www.npmjs.com/package/zod/v/4.6.7 | 2026-11-14 | n/a (npm) |

## Notes
- Dropped from the template: PHP, Laravel, Composer, MariaDB, Redis, Mailpit, Vite, TipTap and all PHP packages.
- Node: 24.22.3 is the patched 24.x line (November 2026 security release). The official image may lag; do not build from an older 24.x as the pin.
- Next.js: 16.4.6 is kept as in the template (bumped from 16.4.5 on 2026-11-12, a recorded user decision, and the floor).
- sharp and Zod: newest versions on npm at 2026-11-14; floors equal pins and advisories were not checked yet (L7 re-verifies). Zod is installed (L3); sharp is installed (L6, image pipeline).
- Phase L7 (2026-11-14): `pnpm audit` (production and dev) found nothing; Trivy (HIGH/CRITICAL) on the node and nginx images found 3 libxslt issues in nginx and 6 bundled-npm issues (undici, brace-expansion) in node. docker/nginx/Dockerfile runs `apk upgrade` and docker/node/Dockerfile removes the unused bundled npm; both images now scan clean. Newer patch releases exist for postcss (8.5.33) and @playwright/test (1.65.1, must match the Playwright image); pins stay until a floor requires them. TypeScript stays on 5.9.3 on purpose (7.x is the native compiler without the JS API Next uses).
- Tools run on demand, not dependencies: Trivy (Trivy) and Lighthouse (Lighthouse). GitHub Actions use actions/checkout, setup-node and upload-artifact at major version 4.
