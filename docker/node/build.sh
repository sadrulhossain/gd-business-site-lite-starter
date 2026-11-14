#!/bin/sh
# Static export into /app/out (STATIC_EXPORT=1 is set by the build service).
set -eu
cd /app
corepack enable
pnpm install --frozen-lockfile --reporter=silent
rm -rf out
pnpm run build
test -f out/index.html
echo "export ok: out/"
