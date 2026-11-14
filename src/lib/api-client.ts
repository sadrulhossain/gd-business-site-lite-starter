/** Minimal fetch client: path templating, `?lang=` default for public reads, ApiError on non-2xx. */

export interface ClientOptions {
  /** Everything before the path, e.g. `http://api.example.test/api`. */
  baseUrl: string
  fetch?: typeof fetch
  /** Default `?lang=` for public reads (`/v1/public/*`). */
  lang?: string
}

/** Non-2xx answer. `code`, `message` and `details` come from the `{"error": {...}}` body. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    /** Field => messages for 422 validation errors. */
    readonly details?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function createClient(options: ClientOptions) {
  const doFetch = options.fetch ?? ((...args: Parameters<typeof fetch>) => fetch(...args))

  async function request(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    init: { path?: Record<string, unknown>; query?: Record<string, unknown>; body?: unknown } = {},
  ): Promise<unknown> {
    const pathParams = init.path ?? {}
    const query = { ...init.query }
    if (options.lang && path.startsWith('/v1/public/') && query.lang === undefined) {
      query.lang = options.lang
    }

    const filled = path.replace(/\{(\w+)\}/g, (_, name: string) => encodeURIComponent(String(pathParams[name])))
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) search.set(key, String(value))
    }
    const url = options.baseUrl.replace(/\/+$/, '') + filled + (search.size ? `?${search}` : '')

    const headers: Record<string, string> = { Accept: 'application/json' }

    let body: BodyInit | undefined
    if (init.body instanceof FormData) {
      body = init.body
    } else if (init.body !== undefined) {
      body = JSON.stringify(init.body)
      headers['Content-Type'] = 'application/json'
    }

    const response = await doFetch(url, { method, headers, body })

    if (response.status === 204) return undefined
    const payload: unknown = await response.json().catch(() => undefined)

    if (!response.ok) {
      const error = (payload as { error?: { code?: string; message?: string; details?: Record<string, string[]> } } | undefined)?.error
      throw new ApiError(response.status, error?.code ?? 'http_error', error?.message ?? response.statusText, error?.details)
    }

    return payload
  }

  return { request }
}
