# gd-business-site-lite-starter

A small business website: one Next.js 16 site, no backend, no database. Content lives in `src/data/*.js`; the build
produces plain files in `./out` that any static host can serve. English plus an optional second language (Bengali in the sample).

## Quick start (Docker, no local Node needed)
```sh
cp .env.example .env                                   # first time only, change the placeholders
docker compose up -d --build node                      # dev server with live reload: http://127.0.0.1:28310
docker compose run --rm --no-deps build                # validate data, optimise images, static export into ./out
docker compose --profile preview up -d --build nginx   # nginx on ./out: http://127.0.0.1:28390
docker compose --profile build --profile preview --profile e2e down --remove-orphans   # stop everything
```

## Edit and ship
1. Change the content in `src/data/` and put pictures in `content/images/` ([docs/CUSTOMIZE.md](docs/CUSTOMIZE.md)).
2. `docker compose run --rm --no-deps build`, then upload `./out` ([docs/DEPLOY.md](docs/DEPLOY.md)).
3. Checks (browser tests need the preview up):
   - data and scripts: `node scripts/validate-data.js`, `node --test scripts/*.test.js`, `node scripts/check-floors.mjs`
   - types and audit: `docker compose run --rm --no-deps node sh -c 'corepack enable && pnpm install --frozen-lockfile && pnpm typecheck'` (same pattern for `pnpm audit --prod`)
   - browser and accessibility: `docker compose --profile e2e run --rm --no-deps e2e npx playwright test`
   - Lighthouse: `docker compose --profile e2e run --rm --no-deps e2e sh scripts/lighthouse.sh`
   - image scan: Trivy (version pinned in `.env`) on the node and nginx images

## Docs
[CUSTOMIZE](docs/CUSTOMIZE.md) · [DEPLOY](docs/DEPLOY.md) · [CLIENT_HANDOVER](docs/CLIENT_HANDOVER.md) ·
[UPGRADE](docs/UPGRADE.md) · [VERSIONS](docs/VERSIONS.md) · [SYNC](docs/SYNC.md) · [PHASES](docs/PHASES.md) ·
[CHANGELOG](CHANGELOG.md) · rules for AI-assisted work: [CLAUDE.md](CLAUDE.md)
