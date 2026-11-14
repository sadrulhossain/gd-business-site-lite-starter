import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const run = (...args) => spawnSync(process.execPath, [fileURLToPath(new URL('./validate-data.js', import.meta.url)), ...args], { encoding: 'utf8' })

test('the shipped sample data is valid', () => {
  const result = run()
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /data: ok/)
})

test('a bad fixture fails and names the bad paths', () => {
  const result = run(fileURLToPath(new URL('./fixtures/bad-data', import.meta.url)))
  assert.equal(result.status, 1)
  assert.match(result.stderr, /settings\.site_name/)
  assert.match(result.stderr, /settings\.email/)
  assert.match(result.stderr, /settings\.logo: image "missing-logo\.png" not found/)
  assert.match(result.stderr, /sections: duplicate section key/)
  assert.match(result.stderr, /services: missing file services\.js/)
})
