# 24 — Pre-Launch Checklist

> Tick every box before sending real ad traffic. If any unchecked, do NOT launch.

## Code & infrastructure

- [ ] Frontend builds locally without warnings (`pnpm build`).
- [ ] Backend builds locally without warnings (`uv sync` clean, `mypy` strict pass).
- [ ] All unit tests pass.
- [ ] All integration tests pass.
- [ ] E2E Playwright suite passes against staging.
- [ ] Docker images build for both services.
- [ ] EasyPanel services running, healthy: `alnadara.shop`, `api.alnadara.shop`.
- [ ] DNS pointed: `alnadara.shop`, `www.alnadara.shop`, `api.alnadara.shop`. HTTPS valid.
- [ ] Postgres: `alembic upgrade head` ran on container boot; tables present.
- [ ] Products seeded: 3 products, 3+1 variants each (`GUM-1/2/3`, `SHA-1/2/3`, `MAS-1/2/3`, `UPS-9-*`).

## Content

- [ ] Every page has final Arabic copy (no placeholders).
- [ ] Each of 3 products has: name, subtitle, 6 benefits, mechanism, ingredients, usage, who-for/not-for, 6 FAQs, before/after images (or labeled placeholders).
- [ ] Home page: hero, brand-promise sections, social proof, founder note, FAQ all populated.
- [ ] About page: founder story, manifesto cards.
- [ ] Contact page: WhatsApp number live (clicking opens chat), email, hours.
- [ ] Policies (shipping / returns / privacy / terms) written and linked from footer.
- [ ] OG images present for `/`, `/shop`, and each `/products/{slug}`.
- [ ] favicon, apple-touch-icon present.

## CRO must-haves

- [ ] Trust bar visible on every page.
- [ ] WhatsApp floating button present + working.
- [ ] Sticky mobile CTA on product pages appears on scroll.
- [ ] Cart drawer cross-sell shows products NOT in cart.
- [ ] Checkout popup has only 2 fields (name, phone) + honeypot.
- [ ] Phone validates Kuwait format (8 digits, starts 5/6/9).
- [ ] Upsell modal shows, timer counts down, accept + decline + timeout all work.
- [ ] Thank-you page shows order ref, line items, expected delivery, WhatsApp follow-up.

## Integrations

- [ ] **COD Network**: order created in staging gets pushed; reference ID stored; status webhook (if configured) updates DB.
- [ ] **Google Sheets webhook**: order appears in the sheet; upsell updates the row.
- [ ] **Meta Pixel**:
  - [ ] Pixel ID set.
  - [ ] Browser events fire (verified in Pixel Helper extension).
  - [ ] CAPI events arrive (verified in Test Events with `META_TEST_EVENT_CODE`).
  - [ ] Dedup status "Deduplicated" on Purchase.
  - [ ] EMQ ≥ 7.0 on Purchase.
- [ ] **TikTok Pixel + Events API**:
  - [ ] Pixel ID set.
  - [ ] Browser `ttq.track` fires (verified in TikTok Pixel Helper).
  - [ ] CAPI `event/track` 200 OK (verified in Test Events).
  - [ ] Phone payload includes `+` prefix before hashing — confirmed.
- [ ] **Snap Pixel + CAPI**:
  - [ ] Pixel ID set.
  - [ ] Browser `snaptr` fires (verified in Snap Pixel Helper / Events Manager).
  - [ ] CAPI events 200 OK; `event_name` UPPERCASE.
  - [ ] `transaction_id` (pixel) and `order_id` (CAPI) match for Purchase.
  - [ ] Phone payload digits-only (no `+`) before hashing — confirmed.

## Performance

- [ ] Lighthouse mobile (`/`): Performance ≥ 85, A11y ≥ 95, BP ≥ 95, SEO ≥ 95.
- [ ] Lighthouse mobile (`/products/{slug}`): same thresholds.
- [ ] LCP < 2.5s on real mid-range Android over 4G (manual test or WebPageTest).
- [ ] No CLS issues during page scroll.
- [ ] Bundle size: first-load JS < 180 KB gz.

## Cross-browser / device

- [ ] iPhone Safari (latest).
- [ ] iPhone Chrome (latest).
- [ ] Android Chrome (latest).
- [ ] Samsung Internet.
- [ ] iPad Safari.
- [ ] Mac Chrome / Safari.
- [ ] Windows Chrome / Edge.

## Security

- [ ] CSP headers active.
- [ ] HSTS active.
- [ ] All cookies `Secure` + `SameSite=Lax`.
- [ ] Rate limiting active on `/v1/orders`.
- [ ] Honeypot field present in checkout form.
- [ ] No secrets committed to git (audit with `gitleaks` or similar).
- [ ] Backend `/docs` and `/openapi.json` disabled in prod.

## Legal / compliance

- [ ] Privacy policy mentions: what we collect, why, retention, deletion request flow, third-party tracking.
- [ ] Terms of service published.
- [ ] Cookie consent banner functional.
- [ ] Marketing copy avoids medical "cure" claims.

## Monitoring & ops

- [ ] Uptime monitor pings `/healthz` every minute.
- [ ] Error logs accessible (EasyPanel UI or external).
- [ ] Daily Postgres backup confirmed.
- [ ] Runbook (`RUNBOOK.md`) covers: site down, API down, COD Network outage, pixel down.
- [ ] Owner has 1Password / Bitwarden record of all env values.

## Media / launch prep

- [ ] Snapchat / TikTok / Meta ad accounts linked to pixel IDs.
- [ ] At least 5 ad creatives (UGC or AI video) ready in 9:16.
- [ ] UTM parameters defined: `utm_source=tiktok|snap|meta`, `utm_medium=paid`, `utm_campaign=launch_aug_kwt`, `utm_content={creator_id}_{variant}`.
- [ ] Daily budget cap set per platform.
- [ ] First-week conversion tracking baseline noted (sessions, AOV, CR, delivery rate).

## Soft launch

- [ ] Run KWD 50–100 of test ad spend per platform to one product before scaling.
- [ ] Watch first 20 orders manually; confirm each lands in Postgres + Sheet + COD Network.
- [ ] Confirm at least 1 successful "delivered" status flowing back from COD Network webhook.

## Once all checked → LAUNCH 🚀
