// Validates src/data/*.js against src/data/schema.js. Usage: node scripts/validate-data.js [dir]
// Runs in `make check` and before `pnpm build`; exits 1 and lists every bad path when the data is invalid.
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { schemas } from '../src/data/schema.js'

const dir = resolve(process.argv[2] ?? fileURLToPath(new URL('../src/data', import.meta.url)))
const images = fileURLToPath(new URL('../content/images', import.meta.url))
const problems = []

// Every image reference (a file name) must exist in content/images.
function checkImages(value, where) {
  if (Array.isArray(value)) return value.forEach((item, i) => checkImages(item, `${where}.${i}`))
  if (!value || typeof value !== 'object') return
  for (const [key, item] of Object.entries(value)) {
    if (['image', 'logo', 'favicon', 'og_image'].includes(key) && typeof item === 'string') {
      if (!existsSync(join(images, item))) problems.push(`${where}.${key}: image "${item}" not found in content/images`)
    } else checkImages(item, `${where}.${key}`)
  }
}

for (const [name, schema] of Object.entries(schemas)) {
  const file = join(dir, `${name}.js`)
  if (!existsSync(file)) {
    problems.push(`${name}: missing file ${name}.js`)
    continue
  }

  const value = (await import(pathToFileURL(file).href)).default
  checkImages(value, name)
  const result = schema.safeParse(value)
  if (!result.success) {
    for (const issue of result.error.issues) problems.push(`${[name, ...issue.path].join('.')}: ${issue.message}`)
  }
}

if (problems.length) {
  console.error(`data: ${problems.length} problem(s) in ${dir}`)
  for (const line of problems.slice(0, 30)) console.error(`  ${line}`)
  process.exit(1)
}

console.log('data: ok')
