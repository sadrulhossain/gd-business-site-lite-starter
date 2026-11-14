import type { Media } from '../lib/content'
import { withBase } from '../lib/base'

interface ImgProps {
  image: Media
  /** Empty unless given: pictures are decorative by default. */
  alt?: string
  className?: string
  /** What the browser picks from srcset: the display width of the image. */
  sizes?: string
  /** Above-the-fold pictures (the hero): load at once instead of lazily. */
  priority?: boolean
}

/**
 * The only way pictures are rendered. A plain <img> with the WebP widths from scripts/images.js as srcset and the
 * intrinsic width and height (no layout shift). Never next/image: under `output: 'export'` it points at /_next/image,
 * which does not exist on a static host.
 */
export function Img({ image, alt = '', className, sizes = '(min-width: 768px) 33vw, 100vw', priority = false }: ImgProps) {
  const srcSet = Object.entries(image.webp)
    .map(([width, url]) => `${withBase(url)} ${width}w`)
    .join(', ')

  return (
    // eslint-disable-next-line @next/next/no-img-element -- see above: next/image cannot be used in a static export.
    <img
      src={withBase(image.url)}
      srcSet={srcSet || undefined}
      sizes={srcSet ? sizes : undefined}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={className}
    />
  )
}
