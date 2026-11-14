# Phases

Tick a phase only when it is finished and committed.

| Done | # | Phase | Scope / files |
|------|---|-------|---------------|
| [x] | L0 | Clone and trim | Clone template, drop api/admin/php/db/redis/mailpit, flatten portal to repo root, CLAUDE.md, docs |
| [x] | L1 | Docker and Make | node dev service, build service (static export to ./out), optional nginx preview, ports on 127.0.0.1, quiet Makefile |
| [x] | L2 | Static export | output export + trailingSlash, content stub getContent(), default locale at root via (default) group and second under [locale] (dynamicParams false), no API/ISR/blog/contact form/middleware |
| [x] | L3 | JS data layer | src/data/*.js content with x / x_2nd, Zod schemas, scripts/validate-data.js (make check, before build) with a bad-fixture test, getContent(locale) with locale fallback, bakery sample data |
| [ ] | L4 | TBD | TBD |
| [ ] | L5 | TBD | TBD |
| [ ] | L6 | TBD | TBD |
| [ ] | L7 | TBD | TBD |
| [ ] | L8 | TBD | TBD |
