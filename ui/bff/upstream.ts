import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import {
  getFreshBffCache,
  getOrRunInFlightUpstream,
  getStaleBffCache,
  invalidateBffCache,
  setBffCache,
} from './cache.ts'
import { bffConfig } from './config.ts'
import type { BffVariables } from './security.ts'

export interface UpstreamRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: string
}

/**
 * Performs a server-to-server request from the Hono BFF to the upstream Python
 * FastAPI service with multi-tier server-side caching, ETag 304 support,
 * in-flight deduplication, and stale-if-error offline resilience.
 */
export async function forwardToUpstream(
  c: Context<{ Variables: BffVariables }>,
  upstreamPath: string,
  options: UpstreamRequestOptions = {},
): Promise<Response> {
  const method = options.method ?? 'GET'
  const sessionId = c.get('sessionId')

  if (method === 'GET') {
    const clientIfNoneMatch = c.req.header('if-none-match')
    const freshEntry = getFreshBffCache(upstreamPath)

    if (freshEntry) {
      c.header('ETag', freshEntry.etag)
      c.header('X-BFF-Cache', 'HIT')
      if (clientIfNoneMatch && clientIfNoneMatch === freshEntry.etag) {
        return c.body(null, 304)
      }
      return c.json(
        freshEntry.data,
        freshEntry.status as ContentfulStatusCode,
      )
    }

    const fetchedEntry = await getOrRunInFlightUpstream(
      upstreamPath,
      async () => {
        try {
          const targetUrl = `${bffConfig.apiUpstreamUrl}${upstreamPath}`
          const upstreamRes = await fetch(targetUrl, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-BFF-Secret': bffConfig.internalSecret,
              'X-Client-Session': sessionId,
            },
          })
          if (!upstreamRes.ok) return null
          const payload = (await upstreamRes.json()) as unknown
          return setBffCache(upstreamPath, upstreamRes.status, payload)
        } catch {
          return null
        }
      },
    )

    if (fetchedEntry) {
      c.header('ETag', fetchedEntry.etag)
      c.header('X-BFF-Cache', 'MISS')
      if (clientIfNoneMatch && clientIfNoneMatch === fetchedEntry.etag) {
        return c.body(null, 304)
      }
      return c.json(
        fetchedEntry.data,
        fetchedEntry.status as ContentfulStatusCode,
      )
    }

    // Stale-if-error fallback when Python FastAPI is offline
    const staleEntry = getStaleBffCache(upstreamPath)
    if (staleEntry) {
      c.header('ETag', staleEntry.etag)
      c.header('X-BFF-Cache', 'STALE-OFFLINE')
      return c.json(
        staleEntry.data,
        staleEntry.status as ContentfulStatusCode,
      )
    }

    return c.json({ error: 'Servicio temporalmente no disponible' }, 502)
  }

  // Mutating requests (POST, PUT, DELETE) bypass read cache and invalidate it
  try {
    const targetUrl = `${bffConfig.apiUpstreamUrl}${upstreamPath}`
    const upstreamRes = await fetch(targetUrl, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-BFF-Secret': bffConfig.internalSecret,
        'X-Client-Session': sessionId,
      },
      body: options.body,
    })

    const payload = await upstreamRes.json().catch(() => ({
      error: 'Respuesta inválida del servicio interno',
    }))

    if (upstreamRes.ok) {
      invalidateBffCache(upstreamPath)
    }

    return c.json(
      payload,
      upstreamRes.status as ContentfulStatusCode,
    )
  } catch {
    return c.json({ error: 'Servicio temporalmente no disponible' }, 502)
  }
}
