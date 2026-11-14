# gd-business-site-lite-starter

A small business website: one Next.js 16 site, no backend, no database. Content lives in `src/data/*.js`; the build
produces plain files in `./out` that any static host can serve. English plus an optional second language (Bengali in the sample).

## Quick start (Docker, no local Node needed)
```sh
make up        # dev server with live reload: http://127.0.0.1:28310
make build     # validate data, optimise images, static export into ./out
make preview   # nginx on ./out: http://127.0.0.1:28390
make down      # stop everything
```
`make up` creates `.env` from `.env.example` on first run. Without `make`: `docker compose up -d node`, and
`docker compose run --rm --no-deps build`.

## Edit and ship
1. Change the content in `src/data/` and put pictures in `content/images/` ([docs/CUSTOMIZE.md](docs/CUSTOMIZE.md)).
2. `make build`, then upload `./out` ([docs/DEPLOY.md](docs/DEPLOY.md)).
3. `make check` runs every check (data, types, audit, image scan, browser, accessibility, Lighthouse).

## Docs
[CUSTOMIZE](docs/CUSTOMIZE.md) · [DEPLOY](docs/DEPLOY.md) · [CLIENT_HANDOVER](docs/CLIENT_HANDOVER.md) ·
[UPGRADE](docs/UPGRADE.md) · [VERSIONS](docs/VERSIONS.md) · [SYNC](docs/SYNC.md) · [PHASES](docs/PHASES.md) ·
[CHANGELOG](CHANGELOG.md) · rules for AI-assisted work: [CLAUDE.md](CLAUDE.md)
