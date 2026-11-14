import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const path = (rel) => fileURLToPath(new URL(rel, import.meta.url))

test('the pipeline writes WebP widths (no AVIF) and a manifest that points at real files', () => {
  const run = spawnSync(process.execPath, [path('./images.js')], { encoding: 'utf8' })
  assert.equal(run.status, 0, run.stderr)

  const manifest = JSON.parse(readFileSync(path('../src/generated/images.json'), 'utf8'))
  assert.ok(manifest['hero.jpg'], 'hero.jpg is in the manifest')

  for (const [name, entry] of Object.entries(manifest)) {
    assert.ok(entry.width > 0 && entry.height > 0, `${name} has a size`)
    for (const [width, url] of Object.entries(entry.variants)) {
      assert.ok([480, 960, 1600].includes(Number(width)), `${name}: unexpected width ${width}`)
      assert.ok(Number(width) <= entry.width, `${name}: ${width} is wider than the original`)
      assert.match(url, /\.webp$/)
      assert.ok(existsSync(path(`../public${url}`)), `${url} exists`)
    }
  }
})
