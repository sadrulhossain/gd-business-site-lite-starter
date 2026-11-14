SHELL := /bin/sh
COMPOSE := docker compose
LOG := .cache/make.log

# run quietly: log everything, print only the last 20 lines on failure
define quiet
mkdir -p .cache; $(1) >$(LOG) 2>&1 || { tail -n 20 $(LOG); exit 1; }
endef

.PHONY: env ports up down build preview versions check

env:
	@[ -f .env ] || { cp .env.example .env; echo "created .env from .env.example (change the placeholders)"; }

ports: env
	@sh scripts/check-ports.sh

# dev server on 127.0.0.1:LITE_DEV_PORT
up: env
	@$(call quiet,sh scripts/check-ports.sh)
	@$(call quiet,$(COMPOSE) up -d --wait --quiet-pull node)
	@$(COMPOSE) ps --format '{{.Name}} {{.Status}}'

# stops everything, including the preview
down:
	@$(call quiet,$(COMPOSE) --profile build --profile preview down --remove-orphans)
	@echo "stack down"

# static export into ./out
build: env
	@$(call quiet,$(COMPOSE) run --rm --no-deps build)
	@tail -n 1 $(LOG)

# nginx preview of ./out on 127.0.0.1:LITE_PREVIEW_PORT (run `make build` first)
preview: env
	@[ -f out/index.html ] || { echo "preview: ./out is empty, run make build"; exit 1; }
	@$(call quiet,$(COMPOSE) --profile preview up -d --wait --quiet-pull nginx)
	@$(COMPOSE) --profile preview ps --format '{{.Name}} {{.Status}}' nginx

# .env pins against docs/VERSIONS.md, then installed versions against their floors; fails below a floor
versions: env
	@bad=0; for kv in $$(grep -E '^[A-Z_]+_VERSION=' .env); do \
	  k=$${kv%%=*}; v=$${kv#*=}; \
	  if grep -qF "| $$v " docs/VERSIONS.md; then echo "ok       $$k=$$v"; else echo "MISMATCH $$k=$$v"; bad=1; fi; \
	done; [ $$bad = 0 ] || exit 1
	@node scripts/check-floors.mjs

# run once at the end of a phase
check: env
	@$(call quiet,$(COMPOSE) --profile build --profile preview config -q)
	@for f in scripts/*.sh docker/*/*.sh; do sh -n $$f || exit 1; done
	@node scripts/validate-data.js
	@$(call quiet,node --test scripts/)
	@$(call quiet,$(COMPOSE) --profile preview run --rm --no-deps nginx nginx -t)
	@$(MAKE) --no-print-directory versions | tail -n 1
	@echo "check: ok"
