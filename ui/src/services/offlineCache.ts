export interface OfflineCacheEnvelope<T> {
  readonly data: T
  readonly etag: string | null
  readonly updatedAt: number
}

const STORAGE_PREFIX = 'tp_offline_cache_v1:'
const DEFAULT_FRESH_TTL_MS = 15 * 60 * 1000 // 15 minutes

const memoryCache = new Map<string, OfflineCacheEnvelope<unknown>>()
const inFlightClientRequests = new Map<string, Promise<unknown>>()

function isBrowserOnline(): boolean {
  return typeof navigator === 'undefined' ? true : navigator.onLine
}

export function readCachedEnvelope<T>(
  key: string,
): OfflineCacheEnvelope<T> | null {
  const inMem = memoryCache.get(key) as OfflineCacheEnvelope<T> | undefined
  if (inMem) return inMem

  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`)
    if (!raw) return null
    const parsed = JSON.parse(raw) as OfflineCacheEnvelope<T>
    if (
      !parsed ||
      typeof parsed.updatedAt !== 'number' ||
      parsed.data === undefined
    ) {
      return null
    }
    memoryCache.set(key, parsed)
    return parsed
  } catch {
    return null
  }
}

export function readCachedData<T>(key: string): T | null {
  const envelope = readCachedEnvelope<T>(key)
  return envelope ? envelope.data : null
}

export function writeCachedEnvelope<T>(
  key: string,
  data: T,
  etag: string | null = null,
): OfflineCacheEnvelope<T> {
  const envelope: OfflineCacheEnvelope<T> = {
    data,
    etag,
    updatedAt: Date.now(),
  }
  memoryCache.set(key, envelope)
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(
        `${STORAGE_PREFIX}${key}`,
        JSON.stringify(envelope),
      )
    } catch {
      // Ignore storage quota errors
    }
  }
  return envelope
}

/**
 * Fetches from a `/bff/*` endpoint only when the local persistent cache is
 * missing or expired, deduplicating concurrent requests (such as React
 * StrictMode double-mounts) and returning cached/fallback data immediately
 * when offline.
 */
export async function fetchWithOfflineCache<T>(
  key: string,
  url: string,
  fallbackData: T,
  ttlMs: number = DEFAULT_FRESH_TTL_MS,
): Promise<T> {
  const existing = readCachedEnvelope<T>(key)
  const online = isBrowserOnline()

  // 1. If offline, never attempt network call; return cached snapshot or fallback
  if (!online) {
    if (existing) return existing.data
    return writeCachedEnvelope(key, fallbackData, null).data
  }

  // 2. If cache is still fresh within TTL, return immediately (0 network calls)
  if (existing && Date.now() - existing.updatedAt < ttlMs) {
    return existing.data
  }

  // 3. Deduplicate concurrent in-flight requests for the same key
  const inFlight = inFlightClientRequests.get(key) as Promise<T> | undefined
  if (inFlight) return inFlight

  const requestPromise = (async (): Promise<T> => {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/json',
      }
      if (existing?.etag) {
        headers['If-None-Match'] = existing.etag
      }

      const res = await fetch(url, {
        credentials: 'same-origin',
        headers,
      })

      if (res.status === 304 && existing) {
        return writeCachedEnvelope(key, existing.data, existing.etag).data
      }

      if (!res.ok) {
        if (existing) return existing.data
        return writeCachedEnvelope(key, fallbackData, null).data
      }

      const data = (await res.json()) as T
      const etag = res.headers.get('etag')
      return writeCachedEnvelope(key, data, etag).data
    } catch {
      if (existing) return existing.data
      return writeCachedEnvelope(key, fallbackData, null).data
    } finally {
      inFlightClientRequests.delete(key)
    }
  })()

  inFlightClientRequests.set(key, requestPromise)
  return requestPromise
}
