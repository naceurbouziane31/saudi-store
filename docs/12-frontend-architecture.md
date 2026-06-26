# 12 — Frontend Architecture

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15** (App Router) | SSR/RSC, image opt, edge-ready, best SEO + perf for storefronts |
| Language | **TypeScript** strict mode | Catch bugs at compile time; PR-able contracts |
| Styling | **Tailwind CSS** + CSS variables | Speed + token discipline |
| UI primitives | **Radix UI** (Dialog, Popover, Accordion) + custom | Accessibility + RTL out of the box |
| Icons | **lucide-react** | Tree-shakable, consistent |
| Forms | **react-hook-form** + **zod** | Performant, schema-first validation |
| Data fetching (client) | **TanStack Query v5** | Cache, retry, optimistic for cart/order ops |
| State (cart, UI) | **Zustand** | Tiny, no boilerplate, RSC-friendly |
| Animations | **Framer Motion** (drawer/modal only) | Used sparingly |
| Internationalization | None (Arabic-only UI) | Don't pay the i18n tax for one locale |
| Linter | **ESLint** (`next/core-web-vitals`, `@typescript-eslint`) | |
| Formatter | **Prettier** + `prettier-plugin-tailwindcss` | |
| Tests (unit) | **Vitest** + `@testing-library/react` | |
| Tests (e2e) | **Playwright** | Full checkout flow smoke |
| Analytics SDK | First-party scripts via `next/script` with `strategy="afterInteractive"` for non-critical and `"lazyOnload"` for ad pixels | |

> Do not add: Redux, Apollo, MUI, Bootstrap, jQuery, sass, lodash. If you think you need them, you don't.

## Folder structure (`frontend/`)

```
frontend/
├── Dockerfile
├── docker-entrypoint.sh
├── .env.example
├── .env.local             (gitignored)
├── package.json
├── pnpm-lock.yaml         (we use pnpm)
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── prettier.config.mjs
├── playwright.config.ts
├── vitest.config.ts
├── public/
│   ├── images/
│   │   ├── hero/
│   │   ├── products/
│   │   ├── placeholders/
│   │   └── og/
│   ├── fonts/             (self-hosted if any)
│   ├── favicon.ico
│   └── robots.txt
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx                              (Home)
    │   ├── shop/page.tsx
    │   ├── products/[slug]/page.tsx
    │   ├── about/page.tsx
    │   ├── contact/page.tsx
    │   ├── thank-you/page.tsx
    │   ├── policies/
    │   │   ├── shipping/page.tsx
    │   │   ├── returns/page.tsx
    │   │   ├── privacy/page.tsx
    │   │   └── terms/page.tsx
    │   ├── api/
    │   │   ├── orders/route.ts       (server proxy → backend)
    │   │   └── capi/route.ts         (server-side CAPI forwarder)
    │   ├── not-found.tsx
    │   ├── error.tsx
    │   └── opengraph-image.tsx
    ├── components/
    │   ├── atoms/
    │   ├── molecules/
    │   ├── organisms/
    │   └── templates/
    ├── content/
    │   └── policies/
    │       ├── shipping.md
    │       ├── returns.md
    │       ├── privacy.md
    │       └── terms.md
    ├── data/
    │   ├── products.ts          (fetched server-side, fallback static)
    │   └── testimonials.ts
    ├── hooks/
    ├── lib/
    │   ├── api/                 (typed client for our backend)
    │   ├── analytics/
    │   │   ├── events.ts        (event taxonomy)
    │   │   ├── meta.ts
    │   │   ├── tiktok.ts
    │   │   ├── snap.ts
    │   │   └── eventId.ts       (UUIDv4 helpers, separate namespaces per platform)
    │   ├── validation.ts        (zod schemas)
    │   ├── phone.ts             (Kuwait phone normalize+validate)
    │   ├── currency.ts          (KWD formatter)
    │   ├── cn.ts                (className helper)
    │   └── env.ts               (typed env loader)
    ├── stores/
    │   ├── cartStore.ts
    │   ├── checkoutStore.ts
    │   └── uiStore.ts
    ├── styles/
    │   ├── globals.css          (Tailwind layers + tokens)
    │   └── tokens.css
    └── types/
        ├── product.ts
        ├── order.ts
        └── analytics.ts
```

## App Router conventions

- **Server Components by default**. Add `'use client'` only when:
  - The component uses state, refs, effects.
  - The component subscribes to a store (Zustand) or analytics events.
  - The component is a portal (modal, drawer).
- Each route has a `page.tsx`. Use `loading.tsx` and `error.tsx` selectively.
- `metadata` exported from each page (title, description, OG, alternates).
- Use `generateStaticParams` for product pages (3 slugs, fully static, ISR with 60s revalidate).
- Use `revalidatePath('/products/[slug]')` server actions when inventory or pricing changes.

## Routing

- `/` — home (RSC, ISR 60s).
- `/shop` — collection (RSC, ISR 60s).
- `/products/[slug]` — product (RSC, ISR 60s, `generateStaticParams` for our 3 slugs).
- `/about`, `/contact`, `/policies/*` — RSC static.
- `/thank-you` — client-rendered (needs query param + tracking on mount).

## Cart store (`stores/cartStore.ts`) — shape

```ts
type CartItem = {
  sku: string;             // e.g. "GUM-2"
  productSlug: string;
  titleAr: string;
  bundleSize: 1 | 2 | 3;
  unitPriceKwd: number;
  lineTotalKwd: number;
  thumbnailUrl: string;
};

type CartState = {
  items: CartItem[];
  isDrawerOpen: boolean;
  add(item: CartItem): void;
  remove(sku: string): void;
  updateBundle(productSlug: string, newSize: 1 | 2 | 3): void;
  clear(): void;
  openDrawer(): void;
  closeDrawer(): void;
  subtotalKwd: () => number;
  itemCount: () => number;
};
```

- Persist to `localStorage` (Zustand `persist` middleware) so cart survives reloads.
- All math in client store is **display only**; the backend recomputes totals on order create (anti-tamper).

## Checkout store (`stores/checkoutStore.ts`)

Tracks current order ref + name + phone after submission, used by upsell + thank-you.

## Server actions vs API routes

- For order creation we use a Next.js **Route Handler** (`/api/orders`) that proxies to the FastAPI backend. Why:
  - Avoids exposing backend URL to the browser (the browser hits Next.js, Next.js calls backend with internal URL).
  - Lets us fire server-side CAPI events from the same place.
- The route handler:
  1. Validates the body with zod.
  2. Calls FastAPI `POST /v1/orders`.
  3. Fires CAPI events in parallel (Meta + TikTok + Snap).
  4. Returns `{ order_ref, grand_total_kwd, currency }`.

## SEO / metadata

- All pages export `metadata` (title, description, OG, twitter, canonical, alternates).
- Default OG image from `app/opengraph-image.tsx` (dynamic with brand cover).
- Per-product OG image generation (Next.js OG image API).
- `hreflang="ar-KW"` on `<html>`.
- JSON-LD on home (`Organization`), collection (`ItemList`), product (`Product`+`Offer`), thank-you (none — noindex).
- `<meta name="robots" content="index, follow">` everywhere except `/thank-you` (`noindex, nofollow`).

## Performance budget (must enforce in CI via Lighthouse)

| Metric | Budget (mobile 4G) |
|---|---|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.05 |
| TTI | < 3.5s |
| JS transferred | < 180 KB gzipped above-the-fold |
| Total page weight | < 1.2 MB first load |
| Lighthouse Performance | ≥ 85 |

Techniques:
- `next/font` with preload + display swap.
- `next/image` everywhere, `priority` for hero image only.
- Code-split heavy components (modal, framer-motion) via `dynamic(() => import(...), { ssr: false })`.
- Tracking pixel scripts loaded with `strategy="lazyOnload"`; fire critical `PageView` after `requestIdleCallback`.
- Avoid third-party CSS frameworks; Tailwind purges to small CSS file.

## Error & loading UX

- `error.tsx` per route: branded fallback ("شي صار غلط — جربي مرة ثانية").
- `loading.tsx` per route: subtle skeleton.
- Network errors in cart/order: inline toast + retry button.

## Cookie / consent banner

- Bottom bar (small, dismissible).
- Two buttons: "أوافق" / "تفاصيل".
- We track without cookies for essential analytics (server-side CAPI uses IP + UA). Pixel cookies (`_fbp`, `_ttp`, `_scid`) load only after consent (or after 5s grace period if user neither accepts nor declines — adjust per legal advice).

## Environment variables (`frontend/.env.example`)

```env
# Public (NEXT_PUBLIC_*) are exposed to browser
NEXT_PUBLIC_SITE_URL=https://alnadara.shop
NEXT_PUBLIC_API_BASE_URL=https://api.alnadara.shop

# Pixel IDs (public)
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=+96550001234
NEXT_PUBLIC_SUPPORT_EMAIL=support@alnadara.shop

# Server-side only (used by /api routes for CAPI forwarding)
META_CAPI_ACCESS_TOKEN=
META_TEST_EVENT_CODE=                  # optional during dev
TIKTOK_CAPI_ACCESS_TOKEN=
SNAP_CAPI_ACCESS_TOKEN=

# Internal backend URL (server-side only — not exposed to browser)
BACKEND_INTERNAL_URL=http://backend:8000

# Misc
NODE_ENV=production
```

> `.env.local` is gitignored; `.env.example` is committed and lists every variable with a comment.

## Image strategy

- Local placeholders under `public/images/placeholders/`.
- Real product images uploaded to `public/images/products/{slug}/{n}.jpg` later.
- Use `next/image` with `sizes` set everywhere.
- Generate blur placeholder via `plaiceholder` build-time helper.
- Hero LCP image: `priority` + `fetchPriority="high"`.

## Accessibility — quick checklist

- All buttons have visible focus.
- All forms have labels.
- All modals trap focus, return focus on close, can be closed with Esc.
- All images have meaningful alt.
- Color contrast verified.
- Reduced-motion respected (`prefers-reduced-motion`).

## Build / dev commands

```jsonc
// package.json (relevant scripts)
{
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint && eslint .",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test"
  }
}
```

## Dockerfile (high-level)

Multi-stage:
1. **deps**: `node:22-alpine`, install pnpm, `pnpm install --frozen-lockfile`.
2. **builder**: copy source, `pnpm build` (produces `.next/standalone`).
3. **runner**: copy `.next/standalone`, `public`, `next.config.mjs`. Run as non-root user. `CMD ["node", "server.js"]`.

EasyPanel deploys this image; environment variables come from EasyPanel UI (no `.env` file in container).
