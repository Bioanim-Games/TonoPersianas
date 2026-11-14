# Spec: Single-container Docker deployment (UI build + BFF + API) and CI

Decisions: single container; SQLite on `/data` volume; workflow builds on PRs, builds + pushes to GHCR on `main`/tags `v*`.
Target future path: `specs/api/07-docker-deployment.md` (repo `specs/` has `ui/` and `api/`; this is infra, I propose `specs/api/`—tell me if you prefer another place).

## 1. Runtime topology
| Process | Bind | Exposure |
|---|---|---|
| FastAPI (`uvicorn main:app`) | `127.0.0.1:8000` | internal only |
| Hono BFF + static UI (`node bff/server.ts`) | `0.0.0.0:3000` | public (`EXPOSE 3000`) |

Browser → `:3000` → static files or `/bff/*` → BFF → `http://127.0.0.1:8000/api/*`. API is never published, so CORS is irrelevant for browsers.

## 2. `ui/bff/server.ts` (new, ≤ 60 lines)
- `const app = new Hono()`; `app.route('/', bffApp)` (bffApp already has basePath `/bff`).
- `app.use('/*', serveStatic({ root: './dist' }))`.
- Fallback `app.get('*', ...)` returns `dist/index.html` (SPA routing) for any non-`/bff` path; unknown `/bff/*` stays 404 from bffApp.
- `serve({ fetch: app.fetch, port: bffConfig.bffPort, hostname: '0.0.0.0' })`, logs the port.
- Imports use `.ts` extensions (consistent with existing code). Executed by Node 24 native type stripping; no build step. Working dir at runtime is `/srv/ui` so `./dist` resolves.
- Tradeoff: `tsc -b` already type-checks `bff/` if included by tsconfig; I'll confirm `yarn build` still passes.

## 3. `Dockerfile` (repo root), stages
1. **ui-build** (`node:24-slim`): corepack enable; copy `ui/package.json yarn.lock .yarnrc.yml`; `yarn install --immutable`; copy `ui/`; `yarn build` → `dist/`.
2. **ui-prod-deps** (`node:24-slim`): same manifests; `yarn workspaces focus --all --production` (fallback `yarn install --immutable` then `yarn workspaces focus --production`) → only runtime deps (hono, @hono/node-server).
3. **api-build** (`ghcr.io/astral-sh/uv:python3.14-bookworm-slim`): copy `api/pyproject.toml uv.lock README.md src main.py`; `uv sync --frozen --no-dev` into `/app/.venv` (`UV_COMPILE_BYTECODE=1`, `UV_LINK_MODE=copy`).
4. **runtime** (`python:3.14-slim-bookworm`, same Debian as venv's interpreter):
   - Copy Node binary from `node:24-slim` (`/usr/local/bin/node`) — no npm/yarn/Vite in the image.
   - `/srv/api` ← venv, `main.py`, `src`; `/srv/ui` ← `dist`, `bff`, prod `node_modules`, `package.json` (needed for `"type":"module"`).
   - `docker/entrypoint.sh` → `/srv/entrypoint.sh`.
   - Non-root user `app`; `/data` owned by `app`; `VOLUME /data`.
   - Env: `NODE_ENV=production ENVIRONMENT=production DATABASE_PATH=/data/tono_persianas.db API_UPSTREAM_URL=http://127.0.0.1:8000 BFF_PORT=3000 ALLOWED_ORIGINS=http://localhost:3000 PATH=/srv/api/.venv/bin:$PATH`.
   - `HEALTHCHECK` using python `urllib` against `http://127.0.0.1:3000/bff/session` (no curl needed).
   - `CMD ["/srv/entrypoint.sh"]`.

Risk: `requires-python >=3.14` — if the `python:3.14-slim` / uv 3.14 images are unavailable at build time, I'll stop and report (Rule 4).

## 4. `docker/entrypoint.sh`
```sh
#!/bin/sh
set -eu
cd /srv/api && uvicorn main:app --host 127.0.0.1 --port 8000 &
API_PID=$!
cd /srv/ui && node bff/server.ts &
BFF_PID=$!
trap 'kill $API_PID $BFF_PID 2>/dev/null' TERM INT
# exit when either process dies so the container restarts
wait -n 2>/dev/null || wait
kill $API_PID $BFF_PID 2>/dev/null || true
```
(`#!/bin/sh` → will use `bash` if `wait -n` unsupported by dash; I'll use `#!/bin/bash` and install nothing extra since slim has bash.)

## 5. Secrets
`BFF_SESSION_SECRET` and `BFF_INTERNAL_SECRET` are **not** baked in; passed at `docker run -e`. Defaults in `config.ts` are dev values; the entrypoint will fail fast in production if either is unset (`: "${BFF_SESSION_SECRET:?}"`). Does the API check `BFF_INTERNAL_SECRET`? To verify during implementation; if so, same value must be exported to both processes (the entrypoint shares env, so fine).

## 6. `.dockerignore`
`.git`, `**/node_modules`, `ui/dist`, `**/__pycache__`, `**/.venv`, `api/data`, `.yarn/cache`, `specs`, `.cursor`, `*.md` except `api/README.md`.

## 7. `.github/workflows/docker.yml`
```yaml
name: docker
on:
  push: { branches: [main], tags: ['v*'] }
  pull_request:
  workflow_dispatch:
permissions: { contents: read, packages: write }
env: { IMAGE: ghcr.io/bioanim-games/tonopersianas }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        if: github.event_name != 'pull_request'
        with: { registry: ghcr.io, username: "${{ github.actor }}", password: "${{ secrets.GITHUB_TOKEN }}" }
      - id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.IMAGE }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=sha
      - uses: docker/build-push-action@v6
        with:
          context: .
          file: ./Dockerfile
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```
Note: image name must be lowercase (it is).

## 8. Files touched, in order
Step 1 (`ui/`): `ui/bff/server.ts` (new) — 1 file.
Step 2 (root): `Dockerfile`, `docker/entrypoint.sh`, `.dockerignore`, `.github/workflows/docker.yml` — 4 files. `api/` untouched.
Persist spec: `specs/api/07-docker-deployment.md` (after approval).

## 9. Verification (each run once)
`cd ui && yarn build`; `docker build -t tono-persianas .`; `docker run` with secrets + volume; `curl /`, `/bff/session`, `/bff/catalog/categories`; confirm image lacks `vite` and `ui/src`. Report failures without retry loops.
