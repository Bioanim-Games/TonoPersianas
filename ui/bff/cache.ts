import { createHash } from 'node:crypto'
import { bffConfig } from './config.ts'

export interface BffCacheEntry {
  readonly status: number
  readonly data: unknown
  readonly etag: string
  readonly updatedAt: number
}

const bffResponseCache = new Map<string, BffCacheEntry>()
const inFlightUpstreamRequests = new Map<
  string,
  Promise<BffCacheEntry | null>
>()

export function computeWeakEtag(payload: unknown): string {
  const serialized = JSON.stringify(payload)
  const digest = createHash('sha256')
    .update(serialized)
    .digest('hex')
    .slice(0, 24)
  return `W/"${digest}"`
}

export function getFreshBffCache(key: string): BffCacheEntry | null {
  const entry = bffResponseCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.updatedAt > bffConfig.cacheTtlMs) {
    return null
  }
  return entry
}

export function getStaleBffCache(key: string): BffCacheEntry | null {
  const entry = bffResponseCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.updatedAt > bffConfig.staleIfErrorTtlMs) {
    return null
  }
  return entry
}

export function setBffCache(
  key: string,
  status: number,
  data: unknown,
): BffCacheEntry {
  const entry: BffCacheEntry = {
    status,
    data,
    etag: computeWeakEtag(data),
    updatedAt: Date.now(),
  }
  bffResponseCache.set(key, entry)
  return entry
}

export function invalidateBffCache(pathPrefix: string): void {
  for (const key of bffResponseCache.keys()) {
    if (key.startsWith(pathPrefix)) {
      bffResponseCache.delete(key)
    }
  }
}

export function getOrRunInFlightUpstream(
  key: string,
  runner: () => Promise<BffCacheEntry | null>,
): Promise<BffCacheEntry | null> {
  const existing = inFlightUpstreamRequests.get(key)
  if (existing) return existing

  const promise = runner().finally(() => {
    inFlightUpstreamRequests.delete(key)
  })
  inFlightUpstreamRequests.set(key, promise)
  return promise
}
