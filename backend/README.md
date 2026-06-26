# Al Nadara — Backend

FastAPI + async SQLAlchemy 2 + Alembic + uv. Python 3.12.

See [`../docs/13-backend-architecture.md`](../docs/13-backend-architecture.md)
for the full spec.

## Local dev

```bash
cp .env.example .env
uv sync
uv run alembic upgrade head
uv run alnadara-seed
uv run alnadara-dev
```

API runs on `http://127.0.0.1:8000`. Try `/healthz`, `/readyz`,
`/docs` (only when `DEBUG=true`).

## Tests

```bash
uv run pytest
uv run ruff check src tests
uv run mypy src
```

## Docker

```bash
docker build -t alnadara-backend .
docker run --rm -p 8000:8000 --env-file .env alnadara-backend
```

The entrypoint waits for Postgres, runs `alembic upgrade head`, seeds the
catalog (idempotent), and then starts gunicorn.
