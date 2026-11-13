# Specification: Hono BFF Architecture & UI-to-API Integration (`ui/`)

- **Status**: Approved
- **Target Subproject**: `ui/` (Step 1 of 2 — Single-Folder Focus per Rule 6)
- **Spec Path**: `specs/ui/05-hono-bff-and-api-connection.md`

---

## 1. Objective & Scope
Implement a **Backend-For-Frontend (BFF)** inside `ui/bff/` using **Hono** and connect the React frontend (`ui/src/`) exclusively to `/bff/*` routes so that:
1. **Zero Upstream API Trace in Browser Inspector**:
   - The browser only makes same-origin requests to `/bff/*`.
   - The raw `/api` proxy in `ui/vite.config.ts` is removed.
   - Upstream headers (`server`, `date`, `x-powered-by`) and internal addresses (`127.0.0.1:8000`) are stripped by the BFF before returning responses.
2. **Server-Managed Authentication & Verification (No Browser Tokens)**:
   - The BFF manages client sessions via an `HttpOnly; SameSite=Lax; Path=/` HMAC-SHA256 signed cookie (`tp_bff_session`).
   - Mutating requests (`POST`, `PUT`, `DELETE`) are checked for valid `HttpOnly` session cookies and same-origin headers (`Sec-Fetch-Site` / `Origin`).
   - Server-to-server calls from the BFF to FastAPI automatically inject `X-BFF-Secret` and `X-Client-Session` headers from Node-only environment variables (`process.env`).
3. **Full Catalog & Contact Hydration**:
   - `catalogApi.ts` fetches categories and products from `/bff/catalog/categories` and `/bff/catalog/products`.
   - `contactApi.ts` fetches and caches business contact info from `/bff/contact-info` and hydrates `ContactPage`, `ContactInfoPanel`, `LocationMapCard`, and `LiveChatBox`.

---

## 2. Port & Network Architecture (Zero Port Collision)

| Service Layer | Port | Role |
| :--- | :--- | :--- |
| **React UI + Hono BFF (Dev)** | **`5173`** | Vite serves both the React UI and the Hono `/bff/*` middleware on the exact same port (`5173`). |
| **React UI + Hono BFF (Prod)** | **`3000`** (`BFF_PORT`) | Standalone Hono Node server serves `dist/` static files and `/bff/*` routes on port `3000`. |
| **Python FastAPI (`api/`)** | **`8000`** | Internal backend database API (`http://127.0.0.1:8000`). The Hono BFF connects *to* port `8000` as a client; Hono never binds to port `8000`. |

### 2.1 Server Configuration (`ui/bff/config.ts`)
| Setting | Env Variable | Default (Dev) | Exposure |
| :--- | :--- | :--- | :--- |
| `bffPort` | `BFF_PORT` | `3000` (Prod standalone; in Dev shares Vite's `5173`) | Server-only (`process.env`) |
| `apiUpstreamUrl` | `API_UPSTREAM_URL` | `http://127.0.0.1:8000` *(Outgoing target URL to Python FastAPI)* | Server-only (`process.env`) |
| `internalSecret` | `BFF_INTERNAL_SECRET` | `tp-internal-bff-secret-dev-2026` | Server-only (`process.env`) |
| `sessionSecret` | `BFF_SESSION_SECRET` | `tp-session-hmac-secret-dev-2026` | Server-only (`process.env`) |
| `cookieName` | `BFF_COOKIE_NAME` | `tp_bff_session` | `HttpOnly` Cookie Only |

### 2.2 Session Cookie & CSRF Middleware (`ui/bff/security.ts`)
- **Token Format**: `<uuid>.<issuedAtMs>.<hmacSha256Hex>`
- **Verification**:
  - Recomputes HMAC-SHA256 over `<uuid>.<issuedAtMs>` using `bffConfig.sessionSecret` and compares digests with `crypto.timingSafeEqual`.
  - If valid, attaches `sessionId` to Hono context; if missing or invalid, generates a new signed token and sets `Set-Cookie: tp_bff_session=<token>; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400`.
- **CSRF / Same-Origin Guard**:
  - On `POST`, `PUT`, `PATCH`, `DELETE`, verifies that `Sec-Fetch-Site` is `'same-origin'` or `'none'` (or `Origin` matches `Host`), returning `403 Forbidden` (`{ error: 'Origen no autorizado por el BFF' }`) otherwise.
- **Security Headers**:
  - Sets `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Cache-Control: private, no-store`.

### 2.3 BFF Routes (`ui/bff/app.ts`)
| BFF Route | Method | Outgoing Upstream FastAPI Call | Description |
| :--- | :--- | :--- | :--- |
| `/bff/session` | `GET` | *(Handled by BFF)* | Verifies/mints `HttpOnly` session cookie; returns `{ status: 'ok', authenticated: true }`. |
| `/bff/catalog/categories` | `GET` | `GET http://127.0.0.1:8000/api/categories` | Returns active blind categories from SQLite. |
| `/bff/catalog/products` | `GET` | `GET http://127.0.0.1:8000/api/products` | Returns active blind products (forwards optional `?category=` slug). |
| `/bff/contact-info` | `GET` | `GET http://127.0.0.1:8000/api/contact-info` | Returns singleton `ContactInfoData` from SQLite. |
| `/bff/contact-info` | `PUT` | `PUT http://127.0.0.1:8000/api/contact-info` | Verifies CSRF + session and updates `ContactInfoData` in SQLite. |

### 2.4 Vite Dev & Preview Middleware (`ui/bff/vitePlugin.ts`)
- Custom Vite plugin `tonoPersianasBffPlugin()`:
  - Hooks into `configureServer` and `configurePreviewServer`.
  - Intercepts requests where `req.url` starts with `/bff` on Vite's port (`5173`).
  - Converts Node `IncomingMessage` into a Web Standard `Request`, invokes `await bffApp.fetch(request)`, and writes status, headers (including `Set-Cookie`), and body to Node `ServerResponse`.

---

## 3. Frontend Service & Component Contracts (`ui/src/`)

### 3.1 `ui/src/services/catalogApi.ts`
- `fetchCategories()` calls `fetch('/bff/catalog/categories', { credentials: 'same-origin' })`.
- `fetchProducts()` calls `fetch('/bff/catalog/products', { credentials: 'same-origin' })`.
- Preserves synchronous in-memory cache (`getCachedCategories`, `getCachedProducts`) and fallback data if upstream FastAPI is offline.

### 3.2 `ui/src/services/contactApi.ts`
- Exports `getCachedContactInfo(): ContactInfoData | null` and `fetchContactInfo(): Promise<ContactInfoData>`.
- Calls `fetch('/bff/contact-info', { credentials: 'same-origin' })`, caches the response, and falls back to `DEFAULT_CONTACT_CONFIG` on network error.

### 3.3 Contact Components (`ContactPage.tsx`, `ContactInfoPanel.tsx`, `LocationMapCard.tsx`, `LiveChatBox.tsx`)
- `ContactPage.tsx` initializes `contactInfo` from `getCachedContactInfo() ?? DEFAULT_CONTACT_CONFIG` and refreshes via `fetchContactInfo()` in `useEffect`.
- Passes `contactInfo: ContactInfoData` as a prop to `ContactInfoPanel`, `LocationMapCard`, and `LiveChatBox`.
