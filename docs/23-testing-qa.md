# 23 — Testing & QA

## Test pyramid

```
        ▲
        │   E2E (Playwright) — 1 happy path + 3 critical
        │   Integration — backend routes + service contracts
        │   Unit — pure functions, hooks, components
        ▼
```

## Frontend tests

### Unit (Vitest + Testing Library)
Cover:
- `lib/phone.ts` — Kuwait validation (`50001234` ✓, `40001234` ✗, `+96550001234` ✓).
- `lib/currency.ts` — KWD formatting (`29` → `29.000 KWD`).
- `lib/validation.ts` — zod schemas.
- `stores/cartStore.ts` — add/remove/update bundle.
- `components/molecules/OfferCard` — selected state, price display.
- `components/atoms/CountdownTimer` — counts down, calls `onComplete`.

### Component
Cover key organisms with happy path + 1 edge case each:
- `CartDrawer` — opens, lists items, cross-sell visible, CTA disabled if empty.
- `CheckoutModal` — phone validation states; submit disabled until valid.
- `UpsellModal` — timer counts down; auto-decline at 0.

### E2E (Playwright)

`frontend/e2e/`:
- `01-checkout-happy.spec.ts`:
  - Visit `/products/sakura-japanese-shampoo`.
  - Select 2-pack.
  - Click "أضيفي للسلة" → cart drawer opens.
  - Click "أكملي طلبچ" → checkout modal opens.
  - Fill name + phone (test number).
  - Submit → upsell modal opens.
  - Accept upsell → thank-you page.
  - Assert order ref visible, price reflects upsell.
- `02-checkout-decline-upsell.spec.ts`:
  - Same as above but decline upsell → thank-you page no upsell line.
- `03-checkout-upsell-timeout.spec.ts`:
  - Same as above; wait 15s → auto-redirect to thank-you.
- `04-phone-validation.spec.ts`:
  - Invalid numbers rejected inline.
  - Valid Kuwaiti numbers accepted in multiple formats.

Run against a staging environment with `CODNETWORK_API_KEY=mock`.

## Backend tests

### Unit (pytest)
- `services/pricing.py` — totals for 1/2/3 pack + upsell.
- `services/capi/hashing.py` — hash format matches spec (Meta phone digits-only, TikTok with `+`).
- `services/codnetwork.py` — payload mapper produces expected JSON given an `Order`.
- `services/sheets_webhook.py` — payload structure.
- `utils/phone.py` — Kuwait normalize/validate.
- `schemas/*.py` — accept valid, reject invalid.

### Integration
- `POST /v1/orders` with valid body → 200 + order in DB.
- `POST /v1/orders` with invalid phone → 422.
- `POST /v1/orders/{ref}/upsell` once → 200; twice → 409.
- Health endpoints.
- Honeypot field → 200 OK but no order persisted.
- Rate limiting → 429 after threshold.

Use `httpx.AsyncClient(app=app, base_url="http://test")` + SQLite in-memory for speed. Postgres-specific tests run in CI via a service container.

## Pixel / CAPI tests

These are hard to fully automate end-to-end (Meta/TikTok/Snap dashboards). Strategy:

1. **Unit-test the CAPI payload shape** (with hashing) — assert exact JSON for a known input.
2. **Snapshot the payloads sent to each platform** — `respx` mocks; assert the body matches.
3. **Manual verification** on each platform's Test Events dashboard during staging walkthrough (see `24-launch-checklist.md`).

## CI matrix

| Job | OS | Languages | What it runs |
|---|---|---|---|
| frontend-lint | ubuntu-latest | Node 22 | `pnpm lint && pnpm typecheck` |
| frontend-test | ubuntu-latest | Node 22 | `pnpm test` |
| frontend-build | ubuntu-latest | Node 22 | `pnpm build` |
| frontend-lhci | ubuntu-latest | Node 22 | Lighthouse CI mobile preset against built app |
| backend-lint | ubuntu-latest | Python 3.12 | `ruff check && ruff format --check && mypy src` |
| backend-test | ubuntu-latest + postgres svc | Python 3.12 | `pytest` |
| docker-build | ubuntu-latest | — | Build both Dockerfiles (no push) |
| e2e | ubuntu-latest | Node 22 + Python 3.12 | `docker compose up -d && pnpm playwright test` |

PR cannot merge unless all green.

## Manual QA matrix

Run before every launch:

| Device | OS | Browser |
|---|---|---|
| iPhone 13 (375×812) | iOS 17 | Safari, Chrome |
| iPhone 15 Pro Max (430×932) | iOS 18 | Safari |
| Galaxy S22 (360×800) | Android 14 | Chrome, Samsung Internet |
| iPad (768×1024) | iPadOS | Safari |
| MacBook (1440×900) | macOS | Chrome, Safari, Firefox |
| Windows desktop (1920×1080) | Win 11 | Edge, Chrome |

Pages to walk through:
- `/` (scroll all sections, check RTL, check trust bar)
- `/shop`
- `/products/{each slug}`
- Add to cart, open drawer, cross-sell visible
- Checkout form: invalid phone (live error), valid phone (green check), submit
- Upsell modal (accept + decline + timeout)
- Thank-you page

## Accessibility QA

- Run axe DevTools on each page (target: zero serious / critical).
- Keyboard-only navigation: Tab through hero → CTA → header → footer.
- VoiceOver pass on home + product page.
- Color contrast: verify all text/background pairs ≥ 4.5:1 (3:1 for large).

## Performance QA

- Lighthouse mobile preset (throttled 4G) on `/`, `/shop`, `/products/{slug}`.
- Target: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- WebPageTest run on real Kuwait device (or proxied location) before launch.

## Pixel verification in staging

For each platform:

| Platform | Tool | What to verify |
|---|---|---|
| Meta | Events Manager → Test Events | `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase` arrive; dedup status "Deduplicated"; EMQ ≥ 7.0 on Purchase |
| TikTok | TikTok Ads Manager → Events → Web Events → Test Events | Same event funnel; EMQ ≥ 65/100 |
| Snap | Snap Ads Manager → Snap Pixel → Test Events | Same; PURCHASE arrives with `transaction_id` matching |

Document each verification in `docs/launch-evidence/` (screenshots).
