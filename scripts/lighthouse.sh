#!/bin/sh
# Lighthouse (performance >= 95, SEO = 100) on key pages of the preview. Runs inside the e2e service (`make lighthouse`):
# it has Chromium and reaches nginx by name. Lighthouse itself is a pinned tool, not a dependency (docs/VERSIONS.md).
set -eu
cd /app
LIGHTHOUSE_VERSION=13.6.0
origin="${E2E_PORTAL_ORIGIN:-http://nginx}"
CHROME_PATH="$(node -e "import('@playwright/test').then((m) => console.log(m.chromium.executablePath()))")"
export CHROME_PATH
bad=0

for path in / /about/ /services/daily-bread/ /gallery/ /bn/ /bn/contact/; do
  out="/tmp/lighthouse.json"
  npx --yes "lighthouse@$LIGHTHOUSE_VERSION" "$origin$path" --quiet --only-categories=performance,seo \
    --chrome-flags="--headless=new --no-sandbox" --output=json --output-path="$out" >/dev/null 2>&1 || { echo "FAIL $path (lighthouse did not run)"; bad=1; continue; }
  line="$(node -e "
    const c = JSON.parse(require('fs').readFileSync('$out', 'utf8')).categories
    const perf = Math.round(c.performance.score * 100), seo = Math.round(c.seo.score * 100)
    console.log((perf >= 95 && seo === 100 ? 'ok   ' : 'FAIL ') + '$path performance=' + perf + ' seo=' + seo)")"
  echo "$line"
  case "$line" in FAIL*) bad=1 ;; esac
done

exit $bad
