/**
 * Path prefix when the site is served from a sub-path (GitHub Pages project site: /repo-name). Empty at the root of a domain.
 * Set BASE_PATH at build time (next.config.mjs). Next adds it to links and its own assets; plain <img> and icon URLs need withBase().
 */
export const basePath: string = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const withBase = (path: string): string => (path.startsWith('/') ? `${basePath}${path}` : path)
