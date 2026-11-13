# Specification: Multi-Tier BFF Caching, Request Deduplication & Offline-First Mode (`ui/`)

- **Status**: Approved
- **Target Subproject**: `ui/`
- **Spec Path**: `specs/ui/06-bff-caching-and-offline-mode.md`

---

## 1. Objective & Scope
Eliminate redundant network calls across the React frontend and Hono BFF and make the application **offline-ready**, while blocking online-only features (**Live Online Chat** now, and **Payments** in future phases) when the browser is offline:
1. **Tier 1 — Frontend Persistent Offline Cache & Deduplication (`ui/src/services/offlineCache.ts`)**:
   - Persists catalog (`categories`, `products`) and `contact-info` responses in both memory and `localStorage` (`tp_offline_cache_v1:*`) with a `15-minute` fresh TTL.
   - Returns cached data **synchronously on mount** and **skips `/bff/*` network requests completely** while the cache is fresh or when `navigator.onLine === false`.
   - Deduplicates concurrent in-flight requests to the same key (preventing React 19 `StrictMode` double-mounts from firing duplicate network requests).
   - Sends `If-None-Match` ETag headers when revalidating expired entries so unchanged data returns `304 Not Modified`.
2. **Tier 2 — Server-Side Hono BFF Cache (`ui/bff/cache.ts` & `ui/bff/upstream.ts`)**:
   - Caches upstream FastAPI `GET` responses in Node memory (`5-minute` fresh TTL, `24-hour` `Stale-If-Error` window) with SHA-256 weak ETags (`W/"..."`).
   - Serves fresh hits directly from BFF memory (`X-BFF-Cache: HIT` or `304 Not Modified`) with **0 calls to Python FastAPI**.
   - Serves stale cached responses (`X-BFF-Cache: STALE-OFFLINE`) if Python FastAPI is unreachable.
   - Invalidates matching cache keys automatically on `PUT /bff/contact-info`.
3. **Tier 3 — Offline Service Worker (`ui/public/sw.js`) & Reactive Offline Guard (`useNetworkStatus.ts`)**:
   - Caches static assets (JS, CSS, fonts, blind showcase images) and GET `/bff/*` responses in browser `CacheStorage` for offline page reloads.
   - Provides `useNetworkStatus()` (`{ isOnline, isOffline }`) to disable **Live Chat** inputs, `"Enviar"`, and `"Continuar en WhatsApp"` when offline, and updates `statusOnline` to `"Conectado con WhatsApp Business"` (removing `"y Base de Datos"`).

---

## 2. Technical Contracts

### 2.1 Server-Side BFF Cache (`ui/bff/cache.ts`)
```ts
export interface BffCacheEntry {
  readonly status: number
  readonly data: unknown
  readonly etag: string
  readonly updatedAt: number
}
```
- **Freshness**: `Date.now() - entry.updatedAt < bffConfig.cacheTtlMs` (`300_000` ms / 5 minutes).
- **Stale-If-Error**: `Date.now() - entry.updatedAt < bffConfig.staleIfErrorTtlMs` (`86_400_000` ms / 24 hours).
- **In-Flight Deduplication**: `inFlightUpstreamRequests: Map<string, Promise<BffCacheEntry | null>>`.

### 2.2 Frontend Persistent Offline Cache (`ui/src/services/offlineCache.ts`)
```ts
export interface OfflineCacheEnvelope<T> {
  readonly data: T
  readonly etag: string | null
  readonly updatedAt: number
}
```
- **Storage Key Prefix**: `tp_offline_cache_v1:`
- **Default Fresh TTL**: `15 * 60 * 1000` ms (15 minutes).

### 2.3 Reactive Network Status Hook (`ui/src/hooks/useNetworkStatus.ts`)
```ts
export interface NetworkStatus {
  readonly isOnline: boolean
  readonly isOffline: boolean
}
export function useNetworkStatus(): NetworkStatus
```
- Uses `useSyncExternalStore` subscribing to `window.addEventListener('online', ...)` and `window.addEventListener('offline', ...)`.

### 2.4 `LiveChatBox.tsx` & i18n Updates (`ui/src/i18n/types.ts`, `ui/src/i18n/locales/es.ts`)
- `contactPage.chat.statusOnline`: `'Conectado con WhatsApp Business'`
- `contactPage.chat.statusOffline`: `'Sin conexión · Chat en pausa'`
- `contactPage.chat.offlineBannerTitle`: `'Modo sin conexión activo'`
- `contactPage.chat.offlineBannerDescription`: `'Puedes explorar el catálogo y nuestros datos de contacto sin internet. El chat en línea y el envío a WhatsApp se reactivarán automáticamente al recuperar tu conexión.'`
