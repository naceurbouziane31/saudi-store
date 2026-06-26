# Al Nadara — Build Documentation

> Complete specification for building the **النضارة / Al Nadara** Kuwait DTC beauty storefront.
> Every document below is the source of truth. If reality diverges, update the doc first, then the code.

## Reading order (for a new AI coder or human dev)

1. **`01-project-overview.md`** — what we're building, why, and what's in/out of scope
2. **`02-brand-identity.md`** — name, logo, colors, typography, voice
3. **`03-icp-kuwait-women.md`** — who we're selling to (and what they fear/want)
4. **`04-positioning-and-usp.md`** — how we win
5. **`05-products.md`** — the 3 products with full copy templates
6. **`06-offers-pricing-aov.md`** — pricing tiers + AOV engineering
7. **`07-copywriting-and-dialect.md`** — Kuwaiti voice & dialect rulebook
8. **`08-cro-playbook.md`** — conversion principles for COD DTC
9. **`09-information-architecture.md`** — sitemap & navigation
10. **`10-design-system.md`** — tokens, components, RTL
11. **`11-page-specs.md`** — every page section-by-section
12. **`12-frontend-architecture.md`** — Next.js 15 stack & structure
13. **`13-backend-architecture.md`** — FastAPI stack & structure
14. **`14-database-schema.md`** — Postgres tables & Alembic
15. **`15-api-contract.md`** — REST endpoints & payloads
16. **`16-codnetwork-integration.md`** — COD Network fulfillment integration
17. **`17-tracking-pixels-capi.md`** — Meta / TikTok / Snap web + CAPI
18. **`18-google-sheets-webhook.md`** — Orders mirror to Google Sheets
19. **`19-performance-seo-schema.md`** — performance budgets, SEO, JSON-LD
20. **`20-security.md`** — security & anti-fraud posture
21. **`21-devops-docker-easypanel.md`** — Dockerfiles, EasyPanel deploy
22. **`22-coding-standards.md`** — language conventions & rules
23. **`23-testing-qa.md`** — testing strategy & manual QA matrix
24. **`24-launch-checklist.md`** — pre-launch gate
25. **`25-copy-bank-kuwaiti-arabic.md`** — ready-to-use Arabic copy

## Top-level repo layout

```
/
├── frontend/        Next.js 15 storefront (Docker)
├── backend/         FastAPI orders & integrations (Docker)
├── docs/            (you are here)
├── docker-compose.yml
└── README.md
```

## What this brand stands for

> النضارة هي نضارة بشرتچ، شعرچ، وثقتچ — مدعومة بمكونات يابانية وأمريكية معتمدة، يوصلوچ لباب بيتچ، وتدفعين بس عند الاستلام.

## Tech stack at a glance

| Layer | Choice |
|---|---|
| Frontend | Next.js 15 (App Router) · TypeScript · Tailwind · Radix · Zustand · TanStack Query · Framer Motion · react-hook-form · zod |
| Backend | FastAPI · SQLAlchemy 2 (async) · Pydantic v2 · Alembic · httpx · structlog · pytest |
| Database | Postgres 16 (EasyPanel-managed `alnadara_database`) |
| Fulfillment | COD Network API (Lead mode) |
| Tracking | Meta Pixel + CAPI, TikTok Pixel + Events API, Snap Pixel + CAPI |
| Backup mirror | Google Sheets via Apps Script webhook |
| Hosting | EasyPanel on VPS · domains: `alnadara.shop`, `api.alnadara.shop` |

## Quick links

- Live frontend: https://alnadara.shop *(post-launch)*
- API: https://api.alnadara.shop *(post-launch)*
- COD Network developer portal: https://developer.cod.network
- Meta CAPI docs: https://developers.facebook.com/docs/marketing-api/conversions-api
- TikTok Events API docs: https://business-api.tiktok.com/portal/docs?id=1771100865818625
- Snap CAPI docs: https://developers.snap.com/marketing-api/Conversions-API/Parameters

## Non-negotiables (the team is fired if any of these slip)

1. **Arabic-first UI** (Kuwaiti dialect, RTL everywhere).
2. **Mobile-first, mobile-perfect** — desktop is a bonus.
3. **COD-only** — never ask for card.
4. **2-field form** — name + phone, nothing else.
5. **Server-side pricing** — client never decides the price.
6. **Per-platform event_id namespaces** for pixel/CAPI dedup.
7. **No fake urgency, no scammy popups.**
8. **No medical "cure" claims.**
9. **Every API token in env vars, never in git.**
10. **Lighthouse mobile ≥ 85** before launch.
