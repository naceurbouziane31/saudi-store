# 00 — The Prompt for the AI Coder

> Copy everything between the lines below and paste it as the first message to the AI coder agent that will actually build the codebase. The agent must have the repo open and access to the `docs/` folder.

---

You are the lead engineer building **النضارة / Al Nadara**, a high-AOV Kuwaiti DTC beauty storefront. This is a production launch for a small business owner whose 3 products are their last hope — your work has to convert.

## Your mission

Deliver a complete, production-ready monorepo with two services — `frontend/` (Next.js 15 storefront) and `backend/` (FastAPI orders + integrations) — both Docker-ready and configured for EasyPanel deployment. The site must convert paid social traffic from Kuwait at premium AOV, exclusively cash-on-delivery, and must push every order to **CODNetwork.com** for fulfillment, mirror it to **Google Sheets**, and fire **Meta + TikTok + Snap** web pixels and server-side CAPI events with correct deduplication.

## Read this first

Before writing a single line of code, read all 25 docs in `docs/`, in numerical order. Each one is a specification, not a suggestion. Treat them as the contract.

The most important docs to absorb:

- `docs/01-project-overview.md` — what + why + scope
- `docs/05-products.md` — the 3 products
- `docs/06-offers-pricing-aov.md` — pricing tiers + upsell mechanics
- `docs/11-page-specs.md` — every page section-by-section
- `docs/12-frontend-architecture.md` + `docs/13-backend-architecture.md` — stack & folder structure
- `docs/15-api-contract.md` — exact endpoint shapes
- `docs/16-codnetwork-integration.md` — COD Network integration
- `docs/17-tracking-pixels-capi.md` — all tracking specs (this is dense; read twice)
- `docs/21-devops-docker-easypanel.md` — Dockerfiles + deployment
- `docs/24-launch-checklist.md` — definition of done
- `docs/25-copy-bank-kuwaiti-arabic.md` — copy you'll wire into the UI

## Deliverable (the monorepo)

```
/
├── frontend/        Next.js 15 (TypeScript, App Router, Tailwind) — Docker
│   ├── Dockerfile
│   ├── docker-entrypoint.sh
│   ├── .env.example          ← every env var listed with a comment
│   ├── next.config.mjs       ← output: 'standalone'
│   ├── package.json          ← pnpm
│   └── src/...               ← per docs/12-frontend-architecture.md
├── backend/         FastAPI (Python 3.12, async SQLAlchemy 2) — Docker
│   ├── Dockerfile
│   ├── docker-entrypoint.sh  ← waits for DB, runs `alembic upgrade head`, seeds, starts gunicorn
│   ├── .env.example
│   ├── pyproject.toml        ← uv
│   ├── alembic/...
│   └── src/alnadara/...      ← per docs/13-backend-architecture.md
├── docs/            (already populated — do NOT modify unless behavior diverges; if it does, update the doc in the same PR)
├── docker-compose.yml         ← local dev orchestration: db + backend + frontend
├── .github/workflows/         ← ci.yml (lint, typecheck, test, build, Lighthouse), deploy.yml (optional)
├── .gitignore
└── README.md                  ← brief intro pointing to docs/
```

Both Dockerfiles must be ready to push to GitHub and deploy to EasyPanel with zero hand-fiddling — env vars come from EasyPanel UI.

## Frontend non-negotiables

1. Next.js 15 App Router, **Server Components by default**.
2. Arabic-first (`<html lang="ar" dir="rtl">`), Kuwaiti dialect copy throughout.
3. Mobile-first responsive; perfect on iPhone (375px–430px) and Galaxy (360px); equally good on desktop.
4. **All pages** built per `docs/11-page-specs.md`: home, shop, product (×3), about, contact, thank-you, policies (4), 404. Plus cart drawer, checkout popup, upsell modal.
5. Use Tailwind + tokens defined in `docs/10-design-system.md`. Use logical CSS properties (`ms-*`, `pe-*`) for RTL safety.
6. Image sections alternate (text on the start side / image on the end side) and flip in following sections, as specified.
7. Where real images are missing, use tasteful **sample placeholder images** (curated Unsplash exports under `public/images/placeholders/`), with a README inside that folder explaining how to swap them.
8. The header is **always**: circle mark with the letter `ن` (brand-primary background) + 2-line wordmark (`النضارة` over `Al Nadara`) on the start side, nav in the middle, cart icon on the end side. On mobile, nav collapses to hamburger.
9. Footer has all menu links, policies, contact, socials, payment & trust icons — per `docs/09-information-architecture.md`.
10. Product page CTA adds the **selected offer** to cart and **opens the cart drawer**. The cart drawer shows cross-sells (products not currently in cart). The cart CTA opens the **checkout popup** with the order summary, social proof, and scarcity (where real).
11. Checkout form has **only 2 fields** (`name`, `phone`) with **live Kuwait phone validation** (`^[569]\d{7}$` — 8 digits starting 5/6/9). A honeypot field is included.
12. On submit, frontend posts to `/api/orders` (Next.js route handler that proxies to FastAPI) and on success opens the **Upsell Modal**: 15-second live countdown, the upsell is the cross-sell NOT in cart, priced at **9 KWD** (the only place a product is ever discounted). Accept → add line item to order. Decline / timeout → proceed.
13. Thank-you page shows order ref, line items, total, expected delivery, WhatsApp follow-up CTA. Fires `Purchase` (Meta) / `CompletePayment` (TikTok) / `PURCHASE` (Snap) on mount, **once per `order_ref`**, with deterministic `event_id`.
14. All web pixels load with `next/script` strategy `lazyOnload`. Server-side CAPI events fire from `/api/capi` route handler.
15. Lighthouse mobile ≥ 85 Performance, ≥ 95 Accessibility / Best Practices / SEO.

## Backend non-negotiables

1. FastAPI + async SQLAlchemy 2 + Pydantic v2 + Alembic. Python 3.12. uv for deps.
2. Folder structure per `docs/13-backend-architecture.md`.
3. **All endpoints** per `docs/15-api-contract.md`. Server-side pricing only.
4. **Alembic migration runs on container start** (`docker-entrypoint.sh` calls `alembic upgrade head` then runs the seeder, then starts gunicorn).
5. Postgres connection string normalization: incoming `postgres://...?sslmode=disable` → outgoing `postgresql+asyncpg://...` (strip the sslmode param).
6. Order creation pipeline (after DB persist, all as background tasks with retries + `event_log`):
   - POST to COD Network (`services/codnetwork.py` — Lead mode by default).
   - POST to Google Sheets webhook (`services/sheets_webhook.py`).
   - POST to Meta CAPI, TikTok Events API, Snap CAPI (`services/capi/*`).
7. Phone hashing per `docs/17-tracking-pixels-capi.md`:
   - Meta + Snap: digits only, no `+`, no leading zeros, then SHA-256 lowercase hex.
   - TikTok: keep `+` prefix, then SHA-256 lowercase hex.
8. Snap event names UPPERCASE (`PURCHASE`, `ADD_CART`, etc.). TikTok purchase = `CompletePayment`. Meta = `Purchase`.
9. Dedup IDs per platform, **separate namespaces** (`meta-...`, `tiktok-...`, `snap-...`).
10. Snap purchase: set `transaction_id` (pixel) = `order_id` (CAPI) = `order_ref`.
11. Honeypot + rate limiting + Origin check on `POST /v1/orders` as in `docs/20-security.md`.
12. Idempotency-Key support on order creation for safe client retries.

## Database

- DB name: `alnadara` (already provisioned in EasyPanel).
- Internal URL: `postgres://alnadara:alnadara@alnadara_database:5432/alnadara?sslmode=disable` — normalize in code as above.
- Schema per `docs/14-database-schema.md`.
- Seeder is idempotent (`ON CONFLICT DO NOTHING` on slug + sku).

## env.example files

Both `frontend/.env.example` and `backend/.env.example` must list **every** variable the code reads, with a one-line comment explaining what each is and where to get it. These are the files the user will copy into EasyPanel UI verbatim.

## Domains (already chosen)

- Frontend: `https://alnadara.shop`
- Backend: `https://api.alnadara.shop`

## Build & dev

- `docker compose up --build` on a developer machine launches: Postgres + backend (with migrations + seed) + frontend. Site reachable at `http://localhost:3000`, API at `http://localhost:8000/healthz`.
- `frontend/`: `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm test`, `pnpm e2e`.
- `backend/`: `uv sync`, `uv run alembic upgrade head`, `uv run pytest`, `uv run gunicorn ...`.

## CI (GitHub Actions)

Set up `.github/workflows/ci.yml` covering: frontend lint/typecheck/test/build/Lighthouse + backend ruff/mypy/pytest + Docker build sanity for both.

## Definition of done (every box in `docs/24-launch-checklist.md` checked)

- All pages render exactly as specified.
- All forms validate as specified.
- All tracking events fire and deduplicate (verifiable in each platform's Test Events dashboard).
- COD Network integration works against either the mock (`CODNETWORK_API_KEY=mock`) or the real key.
- Google Sheets webhook adds + updates rows.
- Docker images build and run with EasyPanel-style env injection.
- Lighthouse mobile ≥ 85 on home + product pages.
- All unit + integration + e2e tests pass.

## Working style

- Open a PR per logical change. Keep PRs small.
- Update docs in the **same PR** as the behavior change.
- When you need a credential I haven't given you (COD Network API key, pixel IDs, CAPI tokens, Google Apps Script URL), stop and ask in your turn summary; do not proceed with fake values that mask broken integrations.
- For COD Network specifically: the exact JSON schema for create-order is not publicly indexable — when the user provides the API key, log into their dashboard, fetch the live spec, and update **only** `backend/src/alnadara/services/codnetwork.py`. The rest of the system is shielded.
- Never invent product copy. Pull from `docs/05-products.md` and `docs/25-copy-bank-kuwaiti-arabic.md`. If something is missing, ask.

Ship it.

---
