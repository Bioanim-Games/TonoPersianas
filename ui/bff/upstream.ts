import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { bffConfig } from './config.ts'
import type { BffVariables } from './security.ts'

export interface UpstreamRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: string
}

/**
 * Performs a server-to-server request from the Hono BFF to the upstream Python
 * FastAPI service, injecting the internal BFF secret and scrubbing all upstream
 * headers so no trace of the upstream service leaks to the browser.
 */
export async function forwardToUpstream(
  c: Context<{ Variables: BffVariables }>,
  upstreamPath: string,
  options: UpstreamRequestOptions = {},
): Promise<Response> {
  const targetUrl = `${bffConfig.apiUpstreamUrl}${upstreamPath}`
  const sessionId = c.get('sessionId')

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: options.method ?? 'GET',
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

    return c.json(
      payload,
      upstreamRes.status as ContentfulStatusCode,
    )
  } catch {
    return c.json(
      {
        error: 'Servicio temporalmente no disponible',
      },
      502,
    )
  }
}
