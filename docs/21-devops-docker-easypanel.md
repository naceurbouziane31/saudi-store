# 21 — DevOps: Docker + EasyPanel Deployment

## Architecture

```
                Internet
                    │
                    ▼
          ┌──────────────────┐
          │  Cloudflare      │ (recommended; user manages DNS + WAF + cache)
          └──────────────────┘
                    │
                    ▼
          ┌──────────────────┐
          │  EasyPanel host  │  (VPS — Caddy/Traefik with Let's Encrypt)
          ├──────────────────┤
          │  ┌────────────┐  │
          │  │ frontend   │  │  next.js, port 3000 internal
          │  │ container  │  │  alnadara.shop
          │  └────────────┘  │
          │  ┌────────────┐  │
          │  │ backend    │  │  fastapi, port 8000 internal
          │  │ container  │  │  api.alnadara.shop
          │  └────────────┘  │
          │  ┌────────────┐  │
          │  │ postgres   │  │  alnadara_database (already exists)
          │  │ (existing) │  │  internal hostname: alnadara_database:5432
          │  └────────────┘  │
          └──────────────────┘
```

## Domains (EasyPanel side)

- `alnadara.shop` → frontend container (port 3000)
- `www.alnadara.shop` → 301 redirect → `alnadara.shop`
- `api.alnadara.shop` → backend container (port 8000)

EasyPanel handles TLS via Let's Encrypt; user just adds the domain in the EasyPanel UI.

## Postgres connection (per user spec)

Internal connection string:

```
postgres://alnadara:alnadara@alnadara_database:5432/alnadara?sslmode=disable
```

In SQLAlchemy 2 (asyncpg), this becomes:

```
postgresql+asyncpg://alnadara:alnadara@alnadara_database:5432/alnadara
```

(SSL is disabled inside the internal network — no `sslmode` needed for asyncpg; just omit `?sslmode=disable` in the SQLAlchemy URL.)

Backend `config.py` reads the raw URL from env `DATABASE_URL` and normalizes:

```python
def _normalize_db_url(raw: str) -> str:
    url = raw.replace("postgres://", "postgresql+asyncpg://", 1)
    if "?sslmode=disable" in url:
        url = url.replace("?sslmode=disable", "")
    return url
```

## Dockerfiles

### Frontend (`frontend/Dockerfile`)

```dockerfile
# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable
ENV NEXT_TELEMETRY_DISABLED=1

# deps
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_META_PIXEL_ID
ARG NEXT_PUBLIC_TIKTOK_PIXEL_ID
ARG NEXT_PUBLIC_SNAP_PIXEL_ID
ARG NEXT_PUBLIC_WHATSAPP_NUMBER
RUN pnpm build

# runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

> Requires `next.config.mjs` with `output: 'standalone'`.

### Backend (`backend/Dockerfile`)

```dockerfile
# syntax=docker/dockerfile:1.7

FROM python:3.12-slim AS base
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential libpq-dev curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# install uv (fast pip)
RUN pip install uv

# deps
COPY pyproject.toml uv.lock* ./
RUN uv sync --frozen --no-dev

# code
COPY src ./src
COPY alembic.ini ./
COPY alembic ./alembic
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENV PYTHONPATH=/app/src

# non-root
RUN useradd --create-home --shell /bin/bash appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:8000/healthz || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
```

### `backend/docker-entrypoint.sh`

```sh
#!/bin/sh
set -e

echo "→ Waiting for database..."
python -m alnadara.scripts.wait_for_db

echo "→ Running migrations..."
.venv/bin/alembic upgrade head

echo "→ Seeding products..."
.venv/bin/python -m alnadara.scripts.seed

echo "→ Starting server..."
exec .venv/bin/gunicorn alnadara.main:app \
  -k uvicorn.workers.UvicornWorker \
  -w 2 \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
```

## Local dev — `docker-compose.yml`

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: alnadara
      POSTGRES_PASSWORD: alnadara
      POSTGRES_DB: alnadara
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  backend:
    build: ./backend
    depends_on: [db]
    environment:
      APP_ENV: development
      DEBUG: "true"
      DATABASE_URL: postgres://alnadara:alnadara@db:5432/alnadara
      ALLOWED_ORIGINS: http://localhost:3000
      INTERNAL_API_KEY: dev
      CODNETWORK_API_KEY: mock
      META_PIXEL_ID: ""
      META_CAPI_ACCESS_TOKEN: ""
      TIKTOK_PIXEL_ID: ""
      TIKTOK_CAPI_ACCESS_TOKEN: ""
      SNAP_PIXEL_ID: ""
      SNAP_CAPI_ACCESS_TOKEN: ""
      SHEETS_WEBHOOK_URL: ""
      SHEETS_WEBHOOK_SECRET: dev
    ports: ["8000:8000"]

  frontend:
    build:
      context: ./frontend
      args:
        NEXT_PUBLIC_SITE_URL: http://localhost:3000
        NEXT_PUBLIC_API_BASE_URL: http://localhost:8000
    depends_on: [backend]
    environment:
      BACKEND_INTERNAL_URL: http://backend:8000
    ports: ["3000:3000"]

volumes:
  pgdata:
```

`docker compose up --build` → site at `http://localhost:3000`, API at `http://localhost:8000/healthz`.

## EasyPanel setup (one-time, by user)

1. **Create the project** "alnadara".
2. **Database**: already exists as `alnadara_database` (Postgres). Verify the internal hostname matches our env (`alnadara_database:5432`).
3. **Service: backend**
   - Type: Github (repo connected) OR Docker build from monorepo path `backend/`.
   - Domain: `api.alnadara.shop` → expose port `8000`.
   - Env vars: copy from `backend/.env.example` and fill values.
   - Resources: 1 vCPU / 1 GB RAM.
4. **Service: frontend**
   - Type: Github, monorepo path `frontend/`.
   - Build args: set the `NEXT_PUBLIC_*` vars at build time (they bake into the bundle).
   - Domain: `alnadara.shop` (+ `www.alnadara.shop` redirect) → expose port `3000`.
   - Env vars: copy from `frontend/.env.example` and fill values.
   - Resources: 1 vCPU / 1 GB RAM.
5. **Healthchecks**:
   - backend: `GET /healthz` every 30s.
   - frontend: `GET /` 200.
6. **Auto-deploy on push** to `main` (or branch of choice).
7. **Cloudflare** (recommended): point DNS for both domains to EasyPanel host, enable proxy (orange cloud), set SSL mode to Full (strict).

## env.example files

### `frontend/.env.example`
(see `12-frontend-architecture.md` for full list — keep both files in sync)

### `backend/.env.example`
(see `13-backend-architecture.md` — keep both files in sync)

> Rule: every variable read by `Settings` (or `process.env`) must be listed in the corresponding `.env.example` with a comment explaining what it is and where to get it.

## CI/CD (GitHub Actions)

`.github/workflows/ci.yml`:
- On PR/push: install, lint, typecheck, unit tests for both frontend and backend.
- Build Docker images (no push).
- Lighthouse CI on the built frontend.

`.github/workflows/deploy.yml`:
- On push to `main`: build & push Docker images to registry (Docker Hub or GHCR), then call EasyPanel API to redeploy.
- Or: rely on EasyPanel's built-in "auto-deploy on push" and skip a custom CD pipeline (simpler for v1).

## Logging in production

- Both services log JSON to stdout.
- EasyPanel collects container logs (UI).
- For external aggregation: optionally pipe to Better Stack / Logtail / Grafana Loki.

## Monitoring

- EasyPanel built-in metrics (CPU, memory, request count).
- Uptime monitor: external (UptimeRobot / Better Stack) pinging `/healthz` every 1 min.
- Error tracking (optional v1): Sentry SDK in both frontend (`@sentry/nextjs`) and backend (`sentry-sdk[fastapi]`). Defer if not budgeted.

## Backup strategy

- Postgres: daily snapshot via EasyPanel, 7-day retention.
- Application code: lives in git (GitHub).
- Env vars: documented per service in EasyPanel; user has a copy in 1Password / Bitwarden.

## Rollback

- EasyPanel keeps the previous image; one-click rollback in UI.
- Or redeploy a specific Git commit/tag via EasyPanel.
