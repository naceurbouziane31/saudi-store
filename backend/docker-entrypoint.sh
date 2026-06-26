#!/bin/sh
set -e

echo "→ Waiting for database..."
python -m alnadara.scripts.wait_for_db

echo "→ Running migrations..."
alembic upgrade head

echo "→ Seeding catalog (idempotent)..."
python -m alnadara.scripts.seed || echo "[seed] skipped (non-fatal)"

echo "→ Starting gunicorn..."
exec gunicorn alnadara.main:app \
  -k uvicorn.workers.UvicornWorker \
  -w "${WEB_CONCURRENCY:-2}" \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
