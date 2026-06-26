# النضارة / Al Nadara

> A Kuwait-first, Arabic-first, COD-only DTC beauty storefront.

This monorepo contains everything needed to build, run, and ship the **Al
Nadara** site:

```
/
├── frontend/        Next.js 15 storefront (TypeScript, Tailwind, RTL) — Docker
├── backend/         FastAPI orders & integrations (Python 3.12, async SQLAlchemy 2) — Docker
├── docs/            The contract. Read it before touching code.
├── docker-compose.yml
├── .github/workflows/ci.yml
└── README.md
```

## Start here

Read [`docs/README.md`](./docs/README.md) and then go through every numbered
doc in `docs/` in order. They are the spec; the code must match.

## Local dev

```bash
docker compose up --build
```

- Storefront: <http://localhost:3000>
- API:       <http://localhost:8000/healthz>
- Postgres:  `localhost:5432` (user `alnadara` / db `alnadara`)

To work on services individually:

```bash
# Frontend
cd frontend && cp .env.example .env.local && pnpm install && pnpm dev

# Backend
cd backend && cp .env.example .env && uv sync && uv run alembic upgrade head && uv run alnadara-dev
```

## Deployment

Both services are Docker images that EasyPanel deploys directly from this repo
(see [`docs/21-devops-docker-easypanel.md`](./docs/21-devops-docker-easypanel.md)).
All secrets are injected via EasyPanel environment variables — never commit a
real `.env` file.

## Mission

> Make the small business owner whose 3 products are their last hope succeed.
> Every UI decision is a conversion decision. Treat the docs as the contract,
> never invent credentials, never ship broken integrations.
