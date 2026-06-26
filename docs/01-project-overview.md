# 01 — Project Overview

## What we are building

A direct-to-consumer (DTC), Arabic-first, Kuwait-focused branded e-commerce store called **النضارة / Al Nadara** that sells three beauty & self-care products at a premium price by:

1. Making the brand feel like it owns the products (not a reseller).
2. Stacking authority, social proof, ingredient transparency, and emotional copy so customers trust the price.
3. Engineering every page for conversion (CRO 12/10) — especially on mobile, especially for the Kuwaiti woman ICP.
4. Driving traffic from paid social (Snapchat / TikTok / Meta) using AI video + UGC + edited videos.

This is **not** an open marketplace, a generic catalog store, or a Shopify clone. It is a high-AOV, COD-only landing-page-style brand site optimized to convert cold paid-social traffic.

## Business model

- **Channel**: Cold paid social → website → COD order → fulfillment via COD Network.
- **Payment**: Cash on Delivery (COD) only. No card processing in v1.
- **Currency**: KWD (Kuwaiti Dinar).
- **Market**: Kuwait only (v1). GCC expansion later.
- **Fulfillment**: All orders pushed to **CODNetwork.com** via their API (they handle warehousing, last-mile, COD collection).
- **AOV strategy**: Tiered "buy more, save more" offers (1 / 2 / 3 pieces) + cross-sell in cart drawer + post-checkout one-time upsell.

## Products (v1)

| # | Arabic name | English / Internal | Function |
|---|---|---|---|
| 1 | علكات كولاجين نتشرز باونتي | Nature's Bounty Collagen Gummies | Skin, hair, nails (oral) |
| 2 | شامبو ساكورا الياباني | Sakura Japanese Shampoo | Hair nourishment & shine |
| 3 | ماسك الكولاجين الليلي | Overnight Collagen Mask | Skin hydration & glow (topical) |

(Full product spec lives in `05-products.md`.)

## Pricing (per product, COD only)

| Quantity | Price (KWD) |
|---|---|
| 1 piece | 19 KWD |
| 2 pieces | 29 KWD |
| 3 pieces | 39 KWD |

Plus a single post-form **upsell** at **9 KWD** for a relevant complementary product (this is the **only** place a product is ever shown at a discount).

## Domains

| Service | Domain |
|---|---|
| Frontend (store) | `https://alnadara.shop` |
| Backend (API) | `https://api.alnadara.shop` |

## Hosting

- VPS with **EasyPanel**.
- Postgres already installed; internal connection string:
  ```
  postgres://alnadara:alnadara@alnadara_database:5432/alnadara?sslmode=disable
  ```
- Both frontend and backend deploy as Docker containers managed by EasyPanel.

## Success metrics (what "done" means)

### Build-time (acceptance)
- All pages render correctly on mobile (375px–428px) and desktop (≥1280px).
- RTL layout is correct everywhere; English LTR fallback works on language toggle.
- Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- All web pixels fire on the right events with the right payloads (verified in each platform's debugger).
- All CAPI events arrive within 60 seconds and deduplicate against the web pixel (Meta EMQ ≥ 7.0).
- Orders submitted in the checkout popup are:
  1. Stored in Postgres.
  2. Pushed to COD Network API.
  3. Mirrored to a Google Sheet via webhook.
  4. All three confirmed before showing thank-you page.
- Kuwaiti phone validation rejects invalid numbers in real time.
- Site loads cold in < 2.5s LCP on a mid-range Android over 4G.

### Business KPIs (post-launch, what we optimize for)
- Conversion rate (sessions → orders): target ≥ 2.5% cold paid social
- AOV: target ≥ 31 KWD (driven by 2/3-piece selection + cross-sell + upsell)
- Delivery rate (orders confirmed by COD Network): target ≥ 70%
- Cost per delivered order ≤ blended target from media buying

## Out of scope for v1

- User accounts / login
- Online card payments
- Reviews submission (we ship with static, curated reviews)
- Search
- Blog / content marketing
- Multi-language UI (Arabic is the only UI language; English is for the brand wordmark only)
- Wishlist
- Multi-currency
- Admin dashboard (we use Postgres + Google Sheet + COD Network dashboard)

## Folder structure (top level)

```
/
├── frontend/          # Next.js 15 (App Router, TypeScript, Tailwind)
│   ├── Dockerfile
│   ├── .env.example
│   └── ...
├── backend/           # FastAPI (Python 3.12, SQLAlchemy 2.x, Alembic)
│   ├── Dockerfile
│   ├── .env.example
│   └── ...
├── docs/              # This folder
├── docker-compose.yml # Local dev orchestration
└── README.md
```
