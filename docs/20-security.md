# 20 — Security & Anti-fraud

## Threat model (v1)

| Threat | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Bot-submitted fake orders flood COD Network | High | Wastes call-center time + RTO costs | Rate limit + honeypot + Lead-mode + behavioral signals |
| Replay attack on order endpoint | Med | Duplicates in COD Network / Sheets | Idempotency key + dedup by phone+timestamp window |
| Price tampering (client sends fake `price`) | Med | Revenue loss | Server-side pricing — client never sends price, only SKU |
| XSS via name/notes field | Med | Customer compromise / brand harm | Strict input validation + content security policy + escape all outputs |
| Pixel ID / token leakage | Low | Wasted ad spend | Public IDs are public by nature; CAPI tokens server-side only |
| DDoS | Med | Site down | Cloudflare in front |
| SQL injection | Low | Catastrophic | ORM-only queries, no string concatenation, Pydantic validation |
| CSRF on order endpoint | Low | Spam orders | SameSite cookies + same-origin policy + origin check on POST |
| Admin endpoint exposed | Low | Data leak | API-key auth on `/internal/*`, separate path |
| Cookie consent non-compliance | Med | Legal / fines | Consent gate before pixel load |

## Frontend security

- Strict CSP via `next.config.mjs` headers:
  ```
  Content-Security-Policy: default-src 'self';
    script-src 'self' 'unsafe-inline' https://connect.facebook.net https://analytics.tiktok.com https://sc-static.net;
    img-src 'self' data: blob: https://www.facebook.com https://analytics.tiktok.com https://*.snapchat.com https://*.snap.com https://images.unsplash.com;
    style-src 'self' 'unsafe-inline';
    connect-src 'self' https://api.alnadara.shop https://www.facebook.com https://business-api.tiktok.com https://tr.snapchat.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  ```
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- No `eval`, no `dangerouslySetInnerHTML` except for analytics script bodies (whitelisted).
- All form inputs sanitized + length-limited.
- All outputs auto-escaped by React (no raw HTML rendering of user content).

## Backend security

- All routes require explicit Pydantic schemas (input validation by default).
- ORM-only DB access; no f-string SQL.
- All secrets via env vars; never in code; never in version control.
- Rate limiting (see `13-backend-architecture.md`).
- HMAC verification on incoming webhooks (COD Network, Sheets if we add inbound).
- HTTPS-only (EasyPanel handles cert via Let's Encrypt + Caddy/Traefik).
- CORS allowlist by env (`ALLOWED_ORIGINS`).
- 422 errors include field-level messages but NEVER stack traces in prod.
- Logging strips PII: phone numbers logged as `+9655***1234` (last 4 visible).

## Order-creation anti-abuse stack

In order of operations:

1. **Origin check** — `Origin`/`Referer` must match `https://alnadara.shop` (or staging). Block POST otherwise.
2. **Rate limit** — 5 orders/IP/min on `POST /v1/orders`.
3. **Honeypot field** — hidden `<input name="company">` in the form; if filled → silently 200 OK without creating order.
4. **Min time-on-page** — frontend records first interaction timestamp; if `submit_at - first_interaction_at < 2.5s` → discard.
5. **Phone format validation** — Kuwait E.164 only.
6. **Duplicate-phone debounce** — if same phone has an order created in last 60s → return the existing order_ref (idempotent feel) and do NOT push a duplicate to COD Network.
7. **Lead mode at COD Network** — agents filter the rest.

## Bot detection (lightweight)

For v1 we do NOT integrate Cloudflare Turnstile or hCaptcha (adds friction). If we see attacks post-launch:
- Add Turnstile invisible captcha to checkout form (`POST /v1/orders` requires valid token).
- Add IP reputation check via Cloudflare.

## Customer PII

- **What we store**: name (Arabic), phone (E.164), IP, UA, browser pixel cookies, click ids, UTM params.
- **What we DON'T store**: passwords (no accounts), payment cards (no online payment), location data (we don't ask).
- **Retention**: 24 months from order creation.
- **Deletion**: support@alnadara.shop email request → manual delete from Postgres + Sheet (privacy policy documents this).
- **Encryption-at-rest**: handled by EasyPanel-managed Postgres.
- **Transport**: HTTPS only (HSTS).

## Secrets management

- All secrets in EasyPanel env vars (encrypted at rest by EasyPanel).
- Never committed to git.
- `.env.example` lists keys with **placeholder** values + a comment explaining each.
- Rotation procedure:
  1. Rotate the secret with its provider (Meta/TikTok/Snap/COD Network/Sheets).
  2. Update env var in EasyPanel.
  3. Restart container.
  4. Verify in test events dashboard.

## Compliance posture

- Kuwait PDPL (Personal Data Protection Law): present a privacy policy, get consent for marketing cookies, allow deletion on request.
- Each pixel vendor's own ToS (Meta, TikTok, Snap) requires consent before loading non-essential trackers.
- No card data → PCI-DSS does not apply.

## Incident response (lightweight)

- All errors logged with `X-Request-Id` for traceability.
- 500-rate alarm: > 1% of requests over 5 min → email alert (configure in EasyPanel monitoring or external like Better Stack).
- Backups: daily Postgres snapshot in EasyPanel.
- Runbook (write this once code lands): `RUNBOOK.md` covering: site down, payment processor outage (n/a here), COD Network outage, pixel down.
