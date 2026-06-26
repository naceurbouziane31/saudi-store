# 13 — Backend Architecture

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **FastAPI** 0.115+ | Async, typed, OpenAPI auto |
| Server | **Uvicorn** behind Gunicorn (`-k uvicorn.workers.UvicornWorker`) | Battle-tested |
| Python | **3.12** | Modern, perf, typing |
| ORM | **SQLAlchemy 2.x** (async) | Mature, async, typed |
| Migrations | **Alembic** | Standard |
| Validation | **Pydantic v2** | Native FastAPI |
| HTTP client | **httpx** (async) | Modern, async, retries via wrapper |
| Background tasks | **Background tasks (FastAPI)** for fire-and-forget; **arq** (Redis) ONLY if scale demands; v1 = no Redis | |
| Auth (admin internal) | **API key in header** (env var) for internal endpoints | |
| Settings | **pydantic-settings** | Env-driven config |
| Logging | **structlog** JSON | Easy to ingest |
| Tests | **pytest** + `pytest-asyncio` + `httpx`-based test client | |
| Linter | **Ruff** (lint + format) | Fast |
| Type check | **mypy** (strict) | |
| Process manager (container) | `gunicorn alnadara.main:app -k uvicorn.workers.UvicornWorker -w 2 --bind 0.0.0.0:8000` | |

> Do not add: Celery, Redis (v1), Django, Flask, Tornado.

## Folder structure (`backend/`)

```
backend/
├── Dockerfile
├── docker-entrypoint.sh
├── .env.example
├── .env                       (gitignored)
├── pyproject.toml
├── poetry.lock OR uv.lock     (pick uv — faster)
├── alembic.ini
├── alembic/
│   ├── env.py
│   └── versions/
│       └── 0001_initial.py
└── src/
    └── alnadara/
        ├── __init__.py
        ├── main.py            (FastAPI app factory)
        ├── config.py          (pydantic-settings)
        ├── logging.py
        ├── deps.py            (DI: get_db, get_settings, get_current_request)
        ├── db.py              (async engine, session)
        ├── models/
        │   ├── __init__.py
        │   ├── base.py
        │   ├── product.py
        │   ├── variant.py
        │   ├── order.py
        │   ├── order_item.py
        │   └── event_log.py
        ├── schemas/           (pydantic v2)
        │   ├── product.py
        │   ├── order.py
        │   └── tracking.py
        ├── api/
        │   ├── __init__.py
        │   ├── v1/
        │   │   ├── __init__.py
        │   │   ├── health.py
        │   │   ├── products.py
        │   │   ├── orders.py
        │   │   └── tracking.py
        │   └── internal/
        │       ├── __init__.py
        │       └── admin.py    (API-key protected)
        ├── services/
        │   ├── pricing.py      (server-side price computation)
        │   ├── orders.py
        │   ├── codnetwork.py   (COD Network API client)
        │   ├── sheets_webhook.py
        │   ├── capi/
        │   │   ├── meta.py
        │   │   ├── tiktok.py
        │   │   ├── snap.py
        │   │   └── hashing.py
        │   └── notifications.py
        ├── seed/
        │   └── products_seed.py
        └── utils/
            ├── phone.py        (Kuwait validation + normalization)
            ├── retry.py
            └── ids.py          (UUID / order ref generator)
```

## App composition

`main.py`:

```python
def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Al Nadara API",
        version="1.0.0",
        docs_url="/docs" if settings.debug else None,
        redoc_url=None,
        openapi_url="/openapi.json" if settings.debug else None,
    )
    configure_logging(settings)
    configure_cors(app, settings)
    configure_middleware(app)
    register_routes(app)
    register_exception_handlers(app)
    register_startup_tasks(app)  # includes Alembic upgrade head
    return app

app = create_app()
```

## Startup migration (per user spec)

On container start (`docker-entrypoint.sh`):

```sh
#!/bin/sh
set -e
# Wait for DB (simple retry)
python -m alnadara.scripts.wait_for_db
# Apply migrations
alembic upgrade head
# Seed products if empty
python -m alnadara.scripts.seed
# Start server
exec gunicorn alnadara.main:app -k uvicorn.workers.UvicornWorker -w 2 --bind 0.0.0.0:8000
```

`alembic upgrade head` is idempotent — safe on every boot.

## CORS

- Allow origins: `https://alnadara.shop` (and `http://localhost:3000` in dev only).
- Allow methods: `GET, POST, OPTIONS`.
- Allow headers: `Content-Type, X-Request-Id, X-Pixel-Browser-Id, X-Pixel-Click-Id`.

## Middleware

1. **RequestId** — assign UUID per request, add to `X-Request-Id` header.
2. **StructuredLogging** — log method, path, status, latency, request id.
3. **RateLimit** — IP-based, 60 req/min for `/v1/orders`, 300 req/min default. Implement with `slowapi` or a simple in-memory token bucket (v1 single-instance), upgrade to Redis if scaled.
4. **HoneypotGuard** — drop requests with honeypot field populated (returns 200 OK silently).
5. **TrustedHost** — only allow our domains.
6. **Compression** — gzip responses.

## Error handling

- All errors return JSON `{ "error": { "code", "message" } }`.
- 4xx for client errors, 5xx for server.
- 422 for validation errors with field-level details.
- Internal errors logged with full traceback, but client sees a generic message.

## Settings (`config.py`)

Pydantic-settings reads from env. Required:

```env
APP_ENV=production            # development | staging | production
DEBUG=false
DATABASE_URL=postgres+asyncpg://alnadara:alnadara@alnadara_database:5432/alnadara
SECRET_KEY=...
ALLOWED_ORIGINS=https://alnadara.shop
INTERNAL_API_KEY=...          # for /api/internal/* endpoints

# COD Network
CODNETWORK_API_BASE=https://api.codnetwork.com
CODNETWORK_API_KEY=
CODNETWORK_BRAND_ID=

# Meta CAPI
META_PIXEL_ID=
META_CAPI_ACCESS_TOKEN=
META_TEST_EVENT_CODE=

# TikTok Events API
TIKTOK_PIXEL_ID=
TIKTOK_CAPI_ACCESS_TOKEN=

# Snap CAPI
SNAP_PIXEL_ID=
SNAP_CAPI_ACCESS_TOKEN=

# Google Sheets webhook
SHEETS_WEBHOOK_URL=
SHEETS_WEBHOOK_SECRET=

# Notifications
WHATSAPP_SUPPORT_NUMBER=+96550001234
SUPPORT_EMAIL=support@alnadara.shop
```

Note the DB driver: SQLAlchemy 2 async uses `postgres+asyncpg://...`. We will **translate** the user's existing connection string from `postgres://alnadara:alnadara@alnadara_database:5432/alnadara?sslmode=disable` to `postgres+asyncpg://...` automatically inside `config.py` (and strip `?sslmode=disable` — asyncpg uses `ssl=False` via URL `?ssl=disable` or a separate parameter; we'll handle in code).

## Dependency injection

- `get_db()` yields async session from `async_sessionmaker`.
- `get_settings()` returns cached `Settings()`.
- `get_request_meta()` extracts IP, UA, browser pixel IDs from request headers.

## Background tasks (no Redis in v1)

- Use FastAPI `BackgroundTasks` for fire-and-forget:
  - Send order to COD Network
  - Send order to Google Sheets webhook
  - Send CAPI events to Meta/TikTok/Snap
- All have retries inside the task (exponential backoff 3 tries). Failures are logged + persisted to `event_log` table for manual recovery.

## API versioning

- All public endpoints under `/v1/`.
- Future breaking changes go to `/v2/`.

## Health & readiness

- `GET /healthz` → `{"status":"ok"}` (cheap; for EasyPanel healthcheck).
- `GET /readyz` → checks DB connection (used during deploys).

## Documentation

- `/docs` (Swagger) and `/openapi.json` ONLY enabled if `DEBUG=true`. In prod they're disabled to reduce attack surface — internal team uses staging.

## Testing strategy

- Unit: `services/`, `utils/`, `schemas/`.
- Integration: API routes with in-memory SQLite via `aiosqlite` (fast). Postgres-specific bits guarded.
- E2E: leave to frontend Playwright suite hitting staging.

## Coding rules

- Async/await everywhere. No sync DB calls.
- All public functions have type hints + Pydantic schemas for I/O.
- No raw SQL strings; use SQLAlchemy 2 style (`select(...)`, `update(...)`, `insert(...)`).
- One responsibility per service file.
- Routes are thin: parse → call service → return.
