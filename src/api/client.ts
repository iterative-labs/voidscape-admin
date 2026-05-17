/** Base path for management API calls.
 *  Default "/management-api" routes through the Vite dev proxy (see vite.config.ts).
 *  Set VITE_API_BASE_PATH to a full URL to bypass the proxy (requires CORS on the server). */
const API_BASE = (import.meta.env.VITE_API_BASE_PATH as string | undefined)?.replace(/\/$/, '')
  ?? '/management-api'

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `${res.status} ${res.statusText}`)
  }
  if (res.status === 204) {
    return undefined as T
  }
  return res.json() as Promise<T>
}
