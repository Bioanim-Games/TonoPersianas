export interface BffConfig {
  readonly bffPort: number
  readonly apiUpstreamUrl: string
  readonly internalSecret: string
  readonly sessionSecret: string
  readonly cookieName: string
  readonly sessionMaxAgeSeconds: number
  readonly cacheTtlMs: number
  readonly staleIfErrorTtlMs: number
  readonly isProduction: boolean
}

export const bffConfig: BffConfig = {
  bffPort: Number(process.env.BFF_PORT ?? 3000),
  apiUpstreamUrl: (process.env.API_UPSTREAM_URL ?? 'http://127.0.0.1:8000').replace(
    /\/+$/,
    '',
  ),
  internalSecret:
    process.env.BFF_INTERNAL_SECRET ?? 'tp-internal-bff-secret-dev-2026',
  sessionSecret:
    process.env.BFF_SESSION_SECRET ?? 'tp-session-hmac-secret-dev-2026',
  cookieName: process.env.BFF_COOKIE_NAME ?? 'tp_bff_session',
  sessionMaxAgeSeconds: 60 * 60 * 24, // 24 hours
  cacheTtlMs: Number(process.env.BFF_CACHE_TTL_MS ?? 5 * 60 * 1000), // 5 minutes fresh cache
  staleIfErrorTtlMs: 24 * 60 * 60 * 1000, // 24 hours offline fallback
  isProduction: process.env.NODE_ENV === 'production',
}
