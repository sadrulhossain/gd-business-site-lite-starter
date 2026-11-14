import { defineConfig } from '@playwright/test'

/** Browser tests against the nginx preview of ./out (make build, make preview). */
const origin = process.env.E2E_PORTAL_ORIGIN ?? 'http://127.0.0.1:28390'

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'e2e/.results',
  reporter: 'line',
  timeout: 90_000,
  expect: { timeout: 20_000 },
  use: {
    baseURL: origin,
    viewport: { width: 1280, height: 900 },
  },
})
