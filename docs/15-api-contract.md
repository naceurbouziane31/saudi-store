# 15 — API Contract

> All endpoints under `https://api.alnadara.shop/v1/`. JSON in / JSON out. UTF-8. No trailing slashes. Errors follow `{ "error": { "code", "message", "details"? } }`.

## Conventions

- Auth: public endpoints are unauthenticated. `/internal/*` requires `X-Internal-Key: <env>`.
- Headers we **read**:
  - `X-Request-Id` (optional, generated server-side if missing).
  - `X-Pixel-Browser-Id` (e.g. `{"fbp":"...","ttp":"...","scid":"..."}` JSON or sent as separate headers — see below).
  - `X-Pixel-Click-Id` (sim).
  - `X-Forwarded-For`, `User-Agent`.
- Headers we **always set on response**:
  - `X-Request-Id`
  - `Cache-Control: no-store` for mutations.
- Timestamps: ISO-8601 UTC.
- Money: numbers as JSON numbers, e.g. `29.000`. Currency code separate field.

## Endpoints

### Health
```http
GET /healthz
200 OK
{"status":"ok","version":"1.0.0"}
```

```http
GET /readyz
200 OK | 503 (if DB unreachable)
{"status":"ok","db":"ok"}
```

---

### Products

```http
GET /v1/products
```
Response:
```json
{
  "products": [
    {
      "id": 1,
      "slug": "nature-bounty-collagen-gummies",
      "title_ar": "علكات كولاجين نتشرز باونتي",
      "subtitle_ar": "...",
      "origin_country": "US",
      "ingredients": [{"name": "...", "role": "...", "country": "US"}],
      "benefits": ["..."],
      "usage_ar": "...",
      "who_is_for_ar": "...",
      "who_is_not_for_ar": "...",
      "variants": [
        {"sku": "GUM-1", "bundle_size": 1, "label_ar": "1 قطعة", "price_kwd": 19.000, "compare_at_price_kwd": null, "is_upsell_offer": false, "stock_qty": null},
        {"sku": "GUM-2", "bundle_size": 2, "label_ar": "2 قطعة", "price_kwd": 29.000, "compare_at_price_kwd": 38.000, "is_upsell_offer": false, "stock_qty": null},
        {"sku": "GUM-3", "bundle_size": 3, "label_ar": "3 قطع", "price_kwd": 39.000, "compare_at_price_kwd": 57.000, "is_upsell_offer": false, "stock_qty": null}
      ]
    }
  ]
}
```

```http
GET /v1/products/{slug}
```
Same shape, single product.

---

### Orders

```http
POST /v1/orders
Content-Type: application/json
X-Request-Id: <uuid>
```

Body:
```json
{
  "customer": {
    "name": "نورة العجمي",
    "phone": "50001234"            // 8-digit Kuwait number OR +9655XXXXXXX
  },
  "items": [
    { "sku": "GUM-2", "qty": 1 }    // qty here is "carts of this bundle", almost always 1
  ],
  "meta": {
    "fbp": "fb.1.1700...",
    "fbc": "fb.1.1700.IwAR...",
    "ttp": "...",
    "ttclid": "...",
    "scid": "...",
    "sccid": "...",
    "user_agent": "Mozilla/...",
    "ip": null,                    // server overrides from XFF
    "landing_url": "https://alnadara.shop/products/...",
    "referrer": "https://t.co/...",
    "utm_source": "tiktok",
    "utm_medium": "paid",
    "utm_campaign": "launch_aug_kwt",
    "utm_content": "ugc_creator_03",
    "utm_term": null
  },
  "event_ids": {
    "meta": "ev-meta-<uuid>",
    "tiktok": "ev-tiktok-<uuid>",
    "snap": "ev-snap-<uuid>"
  }
}
```

Response 200:
```json
{
  "order_ref": "NAD-2026-000123",
  "status": "pending",
  "items": [
    { "sku": "GUM-2", "title_ar": "علكات كولاجين نتشرز باونتي", "bundle_size": 2, "unit_price_kwd": 14.500, "line_total_kwd": 29.000 }
  ],
  "subtotal_kwd": 29.000,
  "upsell_total_kwd": 0.000,
  "shipping_kwd": 0.000,
  "grand_total_kwd": 29.000,
  "currency": "KWD",
  "payment_method": "cod"
}
```

Errors:
- `422` validation error (`PHONE_INVALID`, `SKU_NOT_FOUND`, `OUT_OF_STOCK`)
- `429` too many requests
- `500` server error (logged, opaque message)

Server-side actions on success (background tasks):
1. Send CAPI events to Meta / TikTok / Snap (`Purchase` / `CompletePayment` / `PURCHASE`) using the `event_ids` and hashed user data.
2. POST order to COD Network.
3. POST order to Sheets webhook.
4. Each result written to `event_log`.

---

### Add upsell to an existing order

```http
POST /v1/orders/{order_ref}/upsell
Content-Type: application/json
```
Body:
```json
{
  "sku": "UPS-9-MAS"
}
```
Response 200:
```json
{
  "order_ref": "NAD-2026-000123",
  "upsell_added": true,
  "upsell_total_kwd": 9.000,
  "grand_total_kwd": 38.000
}
```

Rules:
- Only allowed if order is `status=pending` AND was created < 30 minutes ago.
- Only one upsell per order (idempotent: second call returns 409 `UPSELL_ALREADY_APPLIED`).
- Re-syncs to COD Network + Sheets (updates not duplicate).

---

### Tracking forward (server-side CAPI proxy)

When the **frontend** wants to fire a non-purchase event (e.g. `ViewContent`, `AddToCart`, `InitiateCheckout`) server-side as well:

```http
POST /v1/tracking/event
Content-Type: application/json
```

Body:
```json
{
  "event_name": "AddToCart",       // canonical name; server maps per platform
  "event_time_unix": 1717000000,
  "event_source_url": "https://alnadara.shop/products/sakura-japanese-shampoo",
  "event_ids": { "meta": "...", "tiktok": "...", "snap": "..." },
  "user": {
    "ip": null,                    // server overrides from XFF
    "user_agent": "...",
    "fbp": "...", "fbc": "...",
    "ttp": "...", "ttclid": "...",
    "scid": "...", "sccid": "...",
    "phone_e164": null,            // if known (e.g., post-checkout)
    "email": null
  },
  "custom": {
    "currency": "KWD",
    "value": 29.0,
    "contents": [{"id":"GUM-2","quantity":1,"item_price":29.0}],
    "content_type": "product"
  }
}
```

Response 200:
```json
{
  "results": {
    "meta": {"status": "ok"},
    "tiktok": {"status": "ok"},
    "snap": {"status": "ok"}
  }
}
```

(Failures are non-blocking; events queued to `event_log`.)

---

### Internal admin (API-key)

```http
GET /internal/orders?status=pending&limit=50
X-Internal-Key: <env>
```

```http
POST /internal/orders/{order_ref}/resend-codnetwork
POST /internal/orders/{order_ref}/resend-sheets
POST /internal/orders/{order_ref}/resend-capi  # body: {"platform":"meta|tiktok|snap"}
```

These exist for manual recovery from a Notion/CLI script — no admin UI is in scope for v1.

---

## Idempotency

- `POST /v1/orders` accepts an optional `Idempotency-Key` header. If provided, repeated calls with the same key within 24h return the original response (200 with the same `order_ref`).
- Useful for the frontend retry-on-network-error case.

## Rate limits

| Path | Limit |
|---|---|
| `POST /v1/orders` | 5 / IP / minute |
| `POST /v1/orders/{ref}/upsell` | 5 / order / minute |
| `POST /v1/tracking/event` | 60 / IP / minute |
| `GET /v1/products*` | 300 / IP / minute |

Exceeded → `429` with `Retry-After`.

## OpenAPI

The FastAPI auto-generated OpenAPI lives at `/openapi.json` (only when `DEBUG=true`). Frontend types are generated from it using `openapi-typescript` and committed into `frontend/src/lib/api/types.gen.ts` for full type safety end-to-end.
