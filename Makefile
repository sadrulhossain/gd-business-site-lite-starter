SHELL := /bin/sh
COMPOSE := docker compose
LOG := .cache/make.log

# run quietly: log everything, print only the last 20 lines on failure
define quiet
mkdir -p .cache; $(1) >$(LOG) 2>&1 || { tail -n 20 $(LOG); exit 1; }
endef

.PHONY: up down ports versions check env web e2e

env:
	@[ -f .env ] || { cp .env.example .env; echo "created .env from .env.example (change the placeholders)"; }

up: env
	@$(call quiet,sh scripts/check-ports.sh)
	@$(call quiet,$(COMPOSE) up -d --build --wait --quiet-pull)
	@$(COMPOSE) ps --format '{{.Name}} {{.Status}}'

down:
	@$(call quiet,$(COMPOSE) down --remove-orphans)
	@echo "stack down"

ports:
	@sh scripts/check-ports.sh

versions:
	@bad=0; for kv in $$(grep -E '^[A-Z_]+_VERSION=' .env); do \
	  k=$${kv%%=*}; v=$${kv#*=}; \
	  if grep -qF "| $$v " docs/VERSIONS.md; then echo "ok       $$k=$$v"; else echo "MISMATCH $$k=$$v"; bad=1; fi; \
	done; exit $$bad

# run once at the end of a phase (needs the stack up)
check:
	@$(call quiet,$(COMPOSE) config -q)
	@for f in scripts/*.sh docker/*/*.sh; do sh -n $$f || exit 1; done
	@$(call quiet,$(COMPOSE) exec -T nginx nginx -t)
	@$(MAKE) --no-print-directory versions
	@node scripts/check-floors.mjs | tail -n 1
	@echo "check: ok"

# install, typecheck, build (one-off node container)
web:
	@$(call quiet,$(COMPOSE) run --rm --no-deps -T -e NODE_ENV=production node sh -c 'cd /app && corepack enable && pnpm install --frozen-lockfile && pnpm typecheck && pnpm build')
	@tail -n 3 $(LOG)

# Home screenshots (e2e/screenshots). Needs the stack up.
e2e:
	@$(COMPOSE) --profile e2e run --rm --no-deps -T e2e npx playwright test 2>&1 | tail -n 15
