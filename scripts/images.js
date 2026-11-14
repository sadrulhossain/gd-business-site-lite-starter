// Image pipeline: content/images/* (originals) -> public/images/<name>-<width>.webp + src/generated/images.json.
// WebP only at 480/960/1600 (never wider than the original, no AVIF). SVGs are copied as they are.
// Runs before dev, typecheck and build (package.json). Unchanged outputs are not rewritten.
import { copyFile, mkdir, readdir, stat, unlink, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))
const SOURCE = join(root, 'content/images')
const OUTPUT = join(root, 'public/images')
const MANIFEST = join(root, 'src/generated/images.json')
const WIDTHS = [480, 960, 1600]
const DEFAULT_WIDTH = 960
const RASTER = new Set(['.jpg', '.jpeg', '.png', '.webp'])

const newer = async (output, input) => {
  try {
    return (await stat(output)).mtimeMs >= (await stat(input)).mtimeMs
  } catch {
    return false
  }
}

await mkdir(SOURCE, { recursive: true })
await mkdir(OUTPUT, { recursive: true })
await mkdir(join(root, 'src/generated'), { recursive: true })

const manifest = {}
const expected = new Set()
let written = 0

for (const file of (await readdir(SOURCE)).sort()) {
  const ext = extname(file).toLowerCase()
  const input = join(SOURCE, file)
  const base = basename(file, extname(file))

  if (ext === '.svg') {
    const { width, height } = await sharp(input).metadata()
    if (!(await newer(join(OUTPUT, file), input))) {
      await copyFile(input, join(OUTPUT, file))
      written++
    }
    manifest[file] = { src: `/images/${file}`, width, height, variants: {} }
    continue
  }
  if (!RASTER.has(ext)) continue

  const meta = await sharp(input).metadata()
  // EXIF orientations 5-8 swap the sides once the image is rotated upright.
  const [width, height] = (meta.orientation ?? 1) >= 5 ? [meta.height, meta.width] : [meta.width, meta.height]
  const widths = WIDTHS.filter((w) => w <= width)
  if (widths.length === 0) widths.push(width)

  const variants = {}
  for (const w of widths) {
    const name = `${base}-${w}.webp`
    expected.add(name)
    if (!(await newer(join(OUTPUT, name), input))) {
      await sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(join(OUTPUT, name))
      written++
    }
    variants[w] = `/images/${name}`
  }

  // The plain `src` (browsers without srcset support, social cards): the widest variant up to DEFAULT_WIDTH.
  const fallback = Math.max(...widths.filter((w) => w <= DEFAULT_WIDTH), widths[0])
  manifest[file] = { src: variants[fallback], width, height, variants }
}

// Drop generated files whose original is gone or smaller (only `<name>-<digits>.webp` is ever touched).
for (const file of await readdir(OUTPUT)) {
  if (/-\d+\.webp$/.test(file) && !expected.has(file)) await unlink(join(OUTPUT, file))
}

await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`images: ${Object.keys(manifest).length} source(s), ${written} file(s) written`)
