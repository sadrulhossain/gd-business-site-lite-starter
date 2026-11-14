SHELL := /bin/sh
COMPOSE := docker compose
LOG := .cache/make.log

# .env supplies the pins (NODE_VERSION, NGINX_VERSION, TRIVY_VERSION) and the project name
-include .env
export

# run quietly: log everything, print only the last 20 lines on failure
define quiet
mkdir -p .cache; $(1) >$(LOG) 2>&1 || { tail -n 20 $(LOG); exit 1; }
endef

# one-off pnpm command in the node image (frozen install first)
define pnpm
$(COMPOSE) run --rm --no-deps node sh -c 'corepack enable && pnpm install --frozen-lockfile --reporter=silent && $(1)'
endef

.PHONY: env ports up down build preview versions typecheck audit scan e2e lighthouse check

env:
	@[ -f .env ] || { cp .env.example .env; echo "created .env from .env.example (change the placeholders)"; }

ports: env
	@sh scripts/check-ports.sh

# dev server on 127.0.0.1:LITE_DEV_PORT
up: env
	@$(call quiet,sh scripts/check-ports.sh)
	@$(call quiet,$(COMPOSE) up -d --build --wait --quiet-pull node)
	@$(COMPOSE) ps --format '{{.Name}} {{.Status}}'

# stops everything, including the preview
down:
	@$(call quiet,$(COMPOSE) --profile build --profile preview --profile e2e down --remove-orphans)
	@echo "stack down"

# data check, images (scripts/images.js) and static export into ./out (all inside pnpm build)
build: env
	@$(call quiet,$(COMPOSE) run --rm --no-deps build)
	@tail -n 1 $(LOG)

# nginx preview of ./out on 127.0.0.1:LITE_PREVIEW_PORT (run `make build` first)
preview: env
	@[ -f out/index.html ] || { echo "preview: ./out is empty, run make build"; exit 1; }
	@$(call quiet,$(COMPOSE) --profile preview up -d --build --wait --quiet-pull nginx)
	@$(COMPOSE) --profile preview ps --format '{{.Name}} {{.Status}}' nginx

# .env pins against docs/VERSIONS.md, then installed versions against their floors; fails below a floor
versions: env
	@bad=0; for kv in $$(grep -E '^[A-Z_]+_VERSION=' .env); do \
	  k=$${kv%%=*}; v=$${kv#*=}; \
	  if grep -qF "| $$v " docs/VERSIONS.md; then echo "ok       $$k=$$v"; else echo "MISMATCH $$k=$$v"; bad=1; fi; \
	done; [ $$bad = 0 ] || exit 1
	@node scripts/check-floors.mjs

# TypeScript (also generates the image manifest)
typecheck: env
	@$(call quiet,$(call pnpm,pnpm typecheck))
	@echo "typecheck: ok"

# known vulnerabilities in the production dependencies
audit: env
	@$(call quiet,$(call pnpm,pnpm audit --prod))
	@tail -n 1 $(LOG)

# HIGH and CRITICAL findings in the images this repo builds (Trivy, pinned)
scan: env
	@$(call quiet,$(COMPOSE) --profile preview build --quiet node nginx)
	@for image in $(COMPOSE_PROJECT_NAME)-node:$(NODE_VERSION) $(COMPOSE_PROJECT_NAME)-nginx:$(NGINX_VERSION); do \
	  docker run --rm -v //var/run/docker.sock:/var/run/docker.sock -v trivy-cache:/root/.cache aquasec/trivy:$(TRIVY_VERSION) \
	    image --quiet --severity HIGH,CRITICAL --scanners vuln --exit-code 1 $$image >$(LOG) 2>&1 \
	    && echo "scan ok   $$image" || { tail -n 20 $(LOG); exit 1; }; \
	done

# Playwright smoke and axe tests on the preview (make preview first)
e2e: env
	@$(call quiet,$(COMPOSE) --profile e2e run --rm --no-deps e2e npx playwright test)
	@grep -E "passed|failed" $(LOG) | tail -n 1

# Lighthouse on the preview: performance >= 95, SEO = 100 (make preview first)
lighthouse: env
	@$(COMPOSE) --profile e2e run --rm --no-deps e2e sh scripts/lighthouse.sh

# everything, once at the end of a phase
check: env
	@$(call quiet,$(COMPOSE) --profile build --profile preview --profile e2e config -q)
	@for f in scripts/*.sh docker/*/*.sh; do sh -n $$f || exit 1; done
	@$(call quiet,$(COMPOSE) --profile preview run --rm --no-deps nginx nginx -t)
	@$(MAKE) --no-print-directory versions | tail -n 1
	@node scripts/validate-data.js
	@$(call quiet,node --test scripts/*.test.js)
	@$(MAKE) --no-print-directory typecheck
	@$(MAKE) --no-print-directory audit
	@$(MAKE) --no-print-directory scan
	@$(MAKE) --no-print-directory build
	@$(MAKE) --no-print-directory preview
	@$(MAKE) --no-print-directory e2e
	@$(MAKE) --no-print-directory lighthouse
	@$(COMPOSE) --profile preview stop nginx >/dev/null 2>&1
	@echo "check: ok"
