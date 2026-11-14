# gd-business-site-lite-starter

Lite business site starter: one Next.js site at the repo root, no backend, no database. Cloned from
gd-business-site-boilerplate (see docs/SYNC.md).

## Stack
- Node 24 (patched tag), Next.js 16 App Router, static export only (`output: export`, no server, no middleware), React 19, Tailwind 4, TypeScript, pnpm (single package, no workspace)
- sharp and Zod are pinned in docs/VERSIONS.md for later phases; not installed yet
- nginx 1.30 preview in front of the dev server; Playwright for browser tests

## Layout
- `src/app/(default)` (default locale at the root) and `src/app/[locale]` (second locale) are thin routes over `src/lib/screens.tsx`; content stub in `src/lib/content.ts`
- `src/components`, `src/lib`, `src/messages`, `src/styles` (theme tokens)
- `public/`, `e2e/`, `docker/` (node dev script, nginx preview), `scripts/`, `docs/`

## Docker and env
- Containers: `gd-business-site-lite-starter-<tech>` (node, build, nginx), via COMPOSE_PROJECT_NAME
- Root `.env` (from `.env.example`) holds Docker and shared settings only; no app secrets in it beyond placeholders
- Ports, env-configured: LITE_DEV_PORT=28310 (Next dev), LITE_PREVIEW_PORT=28390 (nginx preview of ./out); both bound to 127.0.0.1

## Make
- `make up` (dev server) / `make down`, `make ports`, `make build` (static export to ./out), `make preview` (nginx on ./out), `make versions`, `make check`

## Rules
1) One phase at a time; read only this file, the phase row in docs/PHASES.md and the files it names.
2) No repo-wide exploring, no unrelated refactors, no dependency not listed in docs/VERSIONS.md.
3) Token saving: use quiet flags and `| tail -n 20`; never paste logs back; no screenshots unless the phase says so.
4) Run targeted checks while working; run `make check` once at the end of a phase.
5) Sync with the template only by copying theme tokens and shared components (docs/SYNC.md).
6) Finish: tick the phase in docs/PHASES.md, commit, reply in 8 lines or fewer (done, deviations, decisions needed),
   then STOP and wait for approval.

## Branches
- Feature branch per phase, cut from the updated `main`: `feature/phase-<phase no.>-<task name>`, lower-case, hyphenated
  (for example `feature/phase-l2-static-export`).

## Commits
- Plain messages: `phase LN: title` (for example `phase L0: clone and trim`).
- Never add any Claude signature, Co-Authored-By trailer, "Generated with" line, session link or attribution to
  commit messages, PR text, code, comments or files.
