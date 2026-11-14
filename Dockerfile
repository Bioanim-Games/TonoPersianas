# syntax=docker/dockerfile:1

# 1) Build the UI (Vite and sources stay in this stage only)
FROM node:24-slim AS ui-build
WORKDIR /ui
RUN corepack enable
COPY ui/package.json ui/yarn.lock ui/.yarnrc.yml ./
RUN yarn install --immutable
COPY ui/ ./
RUN yarn build

# 2) Production-only node dependencies for the BFF
FROM node:24-slim AS ui-prod-deps
WORKDIR /ui
RUN corepack enable
COPY ui/package.json ui/yarn.lock ui/.yarnrc.yml ./
RUN yarn workspaces focus --production

# 3) API virtualenv
FROM ghcr.io/astral-sh/uv:python3.14-bookworm-slim AS api-build
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
WORKDIR /app
COPY api/pyproject.toml api/uv.lock api/README.md ./
COPY api/src ./src
RUN uv sync --frozen --no-dev --no-editable
COPY api/main.py ./

# 4) Runtime: Python + Node binary only
FROM python:3.14-slim-bookworm
COPY --from=node:24-slim /usr/local/bin/node /usr/local/bin/node
RUN useradd --system --create-home app \
    && mkdir /data && chown app:app /data

WORKDIR /app
COPY --from=api-build /app/.venv /app/.venv
COPY --from=api-build /app/main.py /app/main.py

WORKDIR /srv/ui
COPY --from=ui-prod-deps /ui/node_modules ./node_modules
COPY --from=ui-build /ui/dist ./dist
COPY ui/package.json ./package.json
COPY ui/bff ./bff

COPY docker/entrypoint.sh /srv/entrypoint.sh
RUN chmod +x /srv/entrypoint.sh

ENV PATH="/app/.venv/bin:$PATH" \
    NODE_ENV=production \
    ENVIRONMENT=production \
    DATABASE_PATH=/data/tono_persianas.db \
    API_UPSTREAM_URL=http://127.0.0.1:8000 \
    BFF_PORT=3000 \
    ALLOWED_ORIGINS=http://localhost:3000

VOLUME /data
EXPOSE 3000
USER app

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
    CMD python -c "import urllib.request as u; u.urlopen('http://127.0.0.1:3000/bff/session')" || exit 1

CMD ["/srv/entrypoint.sh"]
