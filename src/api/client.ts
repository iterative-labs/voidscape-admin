/** Management routes live at the server HTTP origin (`/stats`, `/users`, …), not under `/admin`. */
export function getApiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL
  if (typeof base !== 'string' || !base.trim()) {
    throw new Error('VITE_API_BASE_URL is not set (copy .env.example to .env)')
  }
  const trimmed = base.trim().replace(/\/$/, '')
  try {
    return new URL(trimmed).origin
  } catch {
    return trimmed
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
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
