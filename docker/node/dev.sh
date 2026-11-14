#!/bin/sh
# Next dev server on LITE_DEV_PORT.
set -eu
cd /app
corepack enable
echo "installing deps"
if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile --reporter=silent
else pnpm install --reporter=silent; fi
exec pnpm run dev
