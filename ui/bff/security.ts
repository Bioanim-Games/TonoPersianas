import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import type { Context, Next } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { bffConfig } from './config.ts'

export interface BffVariables {
  sessionId: string
}

function signPayload(payload: string): string {
  return createHmac('sha256', bffConfig.sessionSecret)
    .update(payload)
    .digest('hex')
}

export function createSignedSessionToken(): {
  sessionId: string
  token: string
} {
  const sessionId = randomUUID()
  const issuedAt = Date.now().toString()
  const payload = `${sessionId}.${issuedAt}`
  const signature = signPayload(payload)
  return {
    sessionId,
    token: `${payload}.${signature}`,
  }
}

export function verifySignedSessionToken(token: string | undefined): string | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const [sessionId, issuedAt, providedSig] = parts
  if (!sessionId || !issuedAt || !providedSig) return null

  const payload = `${sessionId}.${issuedAt}`
  const expectedSig = signPayload(payload)

  const providedBuf = Buffer.from(providedSig, 'utf8')
  const expectedBuf = Buffer.from(expectedSig, 'utf8')
  if (providedBuf.length !== expectedBuf.length) return null

  if (!timingSafeEqual(providedBuf, expectedBuf)) return null

  const issuedAtMs = Number(issuedAt)
  if (
    Number.isNaN(issuedAtMs) ||
    Date.now() - issuedAtMs > bffConfig.sessionMaxAgeSeconds * 1000
  ) {
    return null
  }

  return sessionId
}

export async function bffSecurityMiddleware(
  c: Context<{ Variables: BffVariables }>,
  next: Next,
): Promise<Response | void> {
  // 1. Verify or mint HttpOnly signed session cookie
  const rawCookie = getCookie(c, bffConfig.cookieName)
  let sessionId = verifySignedSessionToken(rawCookie)

  if (!sessionId) {
    const fresh = createSignedSessionToken()
    sessionId = fresh.sessionId
    setCookie(c, bffConfig.cookieName, fresh.token, {
      httpOnly: true,
      sameSite: 'Lax',
      path: '/',
      maxAge: bffConfig.sessionMaxAgeSeconds,
      secure: bffConfig.isProduction,
    })
  }

  c.set('sessionId', sessionId)

  // 2. Enforce Same-Origin / CSRF check on state-changing methods
  const method = c.req.method.toUpperCase()
  if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    const secFetchSite = c.req.header('sec-fetch-site')
    if (
      secFetchSite &&
      secFetchSite !== 'same-origin' &&
      secFetchSite !== 'none'
    ) {
      return c.json({ error: 'Origen no autorizado por el BFF' }, 403)
    }
  }

  await next()

  // 3. Attach strict BFF security headers and smart cache-control
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-Frame-Options', 'DENY')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')

  const isCacheableGet =
    method === 'GET' && !c.req.path.endsWith('/session')
  c.header(
    'Cache-Control',
    isCacheableGet
      ? 'private, max-age=60, stale-while-revalidate=300'
      : 'private, no-store',
  )
}
