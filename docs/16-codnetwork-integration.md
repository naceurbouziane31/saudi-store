# 16 — COD Network Integration

## Overview

All orders submitted through the site are fulfilled by **COD Network** (https://codnetwork.com / developer portal https://developer.cod.network). They handle:
- Phone-confirmation call-center (Lead mode)
- Warehousing
- Last-mile delivery to Kuwait
- COD cash collection
- Returns + reconciliation
- Status webhooks back to us

We push every order to their API immediately after our backend persists it.

## Where the API key lives

- Env var: `CODNETWORK_API_KEY` (set in EasyPanel → backend service → secrets)
- Optional: `CODNETWORK_BRAND_ID` / `CODNETWORK_OUTLET_ID` if their API requires it (set per the user's COD Network account)
- Source of token: COD Network seller dashboard → **My Profile → API Developer → API Token**

> **The exact JSON schema for COD Network's create-order endpoint is not publicly indexable** (their developer portal is an SPA). The contract below is based on standard COD-fulfillment patterns. When the user provides their API key, the AI coder must:
> 1. Open the COD Network developer portal logged-in to see the actual create-order spec.
> 2. Verify field names / required fields / auth header format (`Authorization: Bearer …` vs `X-API-Key: …`).
> 3. Update **only** `backend/src/alnadara/services/codnetwork.py` (the adapter) — the rest of the system never sees their schema.

## Recommended mode: **Lead mode**

- **Lead mode**: Orders go into COD Network's call-center queue; an agent calls the customer in Kuwaiti Arabic to confirm address + items before shipping. Drastically reduces fake/duplicate orders and lifts delivery rate to ~70%+.
- **Order mode**: Skip the call; ship directly. Higher RTO (return-to-origin) risk.

**Default in `services/codnetwork.py`: Lead mode.** Make it switchable via env `CODNETWORK_MODE=lead|order`.

## Adapter design

```python
# backend/src/alnadara/services/codnetwork.py
class CodNetworkClient:
    def __init__(self, settings: Settings, http: httpx.AsyncClient):
        self.base = settings.codnetwork_api_base.rstrip("/")
        self.token = settings.codnetwork_api_key
        self.outlet_id = settings.codnetwork_brand_id
        self.mode = settings.codnetwork_mode  # "lead" | "order"
        self.http = http

    async def create_order(self, order: Order) -> CodNetworkResult:
        payload = self._to_codnetwork_payload(order)
        url = f"{self.base}/v1/leads" if self.mode == "lead" else f"{self.base}/v1/orders"
        resp = await self._post_with_retries(url, payload)
        return CodNetworkResult(
            external_id=resp.get("id") or resp.get("reference"),
            status=resp.get("status", "pending"),
            raw=resp,
        )
```

`_post_with_retries`: 3 attempts, exponential backoff (1s, 3s, 9s), retry only on 5xx and network errors. 4xx returns immediately (caller logs to `event_log` for manual review).

## Payload mapper (template — verify against live spec)

Sample payload structure (adjust field names once we see the live spec):

```json
{
  "external_reference": "NAD-2026-000123",
  "store": {
    "name": "Al Nadara",
    "domain": "alnadara.shop",
    "outlet_id": "<from env>"
  },
  "customer": {
    "name": "نورة العجمي",
    "phone": "+96550001234",
    "country": "KW"
  },
  "shipping_address": null,
  "items": [
    {
      "sku": "GUM-2",
      "name_ar": "علكات كولاجين نتشرز باونتي - 2 قطعة",
      "quantity": 1,
      "unit_price": 29.000,
      "currency": "KWD"
    },
    {
      "sku": "UPS-9-MAS",
      "name_ar": "ماسك الكولاجين الليلي (عرض خاص)",
      "quantity": 1,
      "unit_price": 9.000,
      "currency": "KWD"
    }
  ],
  "totals": {
    "subtotal": 29.000,
    "upsell": 9.000,
    "shipping": 0.000,
    "grand_total": 38.000,
    "currency": "KWD"
  },
  "payment": {
    "method": "cod"
  },
  "metadata": {
    "utm_source": "tiktok",
    "utm_campaign": "launch_aug_kwt",
    "landing_url": "https://alnadara.shop/products/sakura-japanese-shampoo"
  }
}
```

Address is **omitted on create**. The COD Network call-center agent collects address by phone (this is the Kuwait/GCC convention) — our 2-field form is intentional.

## Status sync (webhook from COD Network → us)

COD Network supports outbound webhooks for status changes. Configure in their dashboard:

- **Webhook URL**: `https://api.alnadara.shop/v1/codnetwork/webhook`
- **Webhook secret**: stored in `CODNETWORK_WEBHOOK_SECRET`
- **Events**: `lead.confirmed`, `lead.rejected`, `order.shipped`, `order.delivered`, `order.returned`, `order.cancelled`

Endpoint:

```http
POST /v1/codnetwork/webhook
X-CodNetwork-Signature: <hmac-sha256 of body with shared secret>
```

Our endpoint:
1. Verifies HMAC signature.
2. Finds `order_ref` via `external_reference` in payload.
3. Updates `orders.codnetwork_status` and `orders.status` (mapping below).
4. If `delivered`: fires a **server-side `Purchase`-equivalent confirmation event** to all CAPI platforms again with the same `event_id` (extends optimization signal). Optional v2.
5. Returns 200 OK quickly; processes in background task.

### Status mapping

| COD Network status | Our `orders.status` |
|---|---|
| `lead.confirmed` | `confirmed` |
| `lead.rejected` / `cancelled` | `cancelled` |
| `order.shipped` | `shipped` |
| `order.delivered` | `delivered` |
| `order.returned` | `returned` |
| `order.no_answer` (3+ attempts) | `cancelled` (configurable) |

## Failure handling

If COD Network create-order returns 4xx (validation error):
- Log full request + response to `event_log` with status `failed`.
- Order remains `status=pending` in our DB.
- WhatsApp notification to support number.
- Manual retrigger via `POST /internal/orders/{ref}/resend-codnetwork`.

If COD Network returns 5xx or network error:
- Auto-retry up to 3x with backoff (in same request lifecycle since FastAPI BackgroundTasks run inline).
- On final failure: `event_log` status `failed`, notification.

## SKU sync requirement

> **Critical**: SKUs in our database must match SKUs registered in COD Network's product catalog (per their docs).

Before launch:
1. Create products in COD Network dashboard with exact SKUs: `GUM-1`, `GUM-2`, `GUM-3`, `SHA-1`, `SHA-2`, `SHA-3`, `MAS-1`, `MAS-2`, `MAS-3`, `UPS-9-GUM`, `UPS-9-SHA`, `UPS-9-MAS`.
2. Map them to physical stock in their warehouse.
3. Set prices in their system to match ours (so reconciliation is clean).

## Local dev / mocking

- `CODNETWORK_API_KEY=mock` in dev → adapter responds with deterministic fake success, `external_id = f"mock-{order_ref}"`.
- All tests use the mock; only staging hits the real API.

## Reconciliation

- Daily 09:00 KWT (UTC+3) cron (initially manual): fetch yesterday's orders from COD Network via their GET orders endpoint; cross-check our `orders` table for discrepancies; alert on any mismatch.
- Skip in v1 if it requires extra work; add when order volume justifies (target month 2).

## Compliance

- We do not store payment data (COD — none exists).
- Customer phone & name are PII; encrypted-at-rest via Postgres (EasyPanel-managed) and only transmitted to COD Network over HTTPS.
- Retention: 24 months per typical KW DTC practice; document in privacy policy.
