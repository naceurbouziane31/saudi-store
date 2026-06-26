# 17 — Tracking: Pixels (web) + CAPI (server)

> This is the single source of truth for analytics. Read it before touching any pixel code.

## Architecture overview

```
                                Browser
   ┌──────────────────────────────────────────────────────────────┐
   │  Next.js page                                                 │
   │  ├── Meta Pixel (fbq)              ┐                          │
   │  ├── TikTok Pixel (ttq)            │  Web events              │
   │  └── Snap Pixel (snaptr)           ┘                          │
   │              │                                                 │
   │              └── ALSO POSTs event payload to                   │
   │                   /api/capi  (server-side route)               │
   │                   with the SAME event_id (per platform)        │
   └──────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────┐
                    │  Next.js /api/capi   │ (server-side)
                    │  → Forwards to FastAPI│
                    │     /v1/tracking/event │
                    └──────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────┐
                    │  FastAPI services/capi │
                    │  ├── meta.py            │   POSTs server-side
                    │  ├── tiktok.py          │ → events to each
                    │  └── snap.py            │   platform's API
                    └──────────────────────┘
                                  │
                                  ▼
              Meta Conversions API · TikTok Events API · Snap CAPI
```

Each user action fires **two events** for each ad platform: one from the browser (pixel) and one from the server (CAPI). They share the same `event_id` (per platform) so the platform deduplicates them — this gives us maximum match quality + iOS/ITP recovery.

## Event taxonomy (canonical → per-platform names)

| Canonical | Meta | TikTok | Snap | Triggered |
|---|---|---|---|---|
| `page_view` | `PageView` | `Pageview` | `PAGE_VIEW` | On every page mount |
| `view_content` | `ViewContent` | `ViewContent` | `VIEW_CONTENT` | Product page mount (after 1s) |
| `add_to_cart` | `AddToCart` | `AddToCart` | `ADD_CART` | "Add to cart" CTA click |
| `initiate_checkout` | `InitiateCheckout` | `InitiateCheckout` | `START_CHECKOUT` | Cart drawer "أكملي طلبچ" click |
| `lead` | `Lead` | `SubmitForm` (custom) | `SIGN_UP` | Checkout form valid + submitted (pre-purchase) |
| `purchase` | `Purchase` | `CompletePayment` | `PURCHASE` | Thank-you page mount, ONCE per order_ref |
| `upsell_impression` | `ViewContent` (custom data label="upsell") | `ViewContent` (custom) | `VIEW_CONTENT` (custom) | Upsell modal mount |
| `upsell_accept` | `AddToCart` (custom data label="upsell_accept") | `AddToCart` | `ADD_CART` | User accepts upsell |

> Upsell adjusts the existing `Purchase`'s value — we don't fire a second `Purchase`; we just include the upsell line item in the purchase event when it fires on the thank-you page.

## Event ID strategy (CRITICAL)

- Use **separate event_id namespaces per platform**. Sharing one ID across all platforms is the most common foot-gun.
- Format: `{platform}-{order_or_session}-{nanoid}`, e.g. `meta-NAD-2026-000123-Hk9aPqL2`.
- The browser pixel and the server CAPI for the **same platform** + **same logical event** use the **same event_id**.
- For pre-purchase events (PageView, ViewContent, AddToCart, InitiateCheckout): event_id = `{platform}-pv-{session_id}-{nanoid}` generated client-side and forwarded to server `/api/capi` immediately.
- For `purchase`: event_id = `{platform}-pur-{order_ref}`. The thank-you page generates these deterministically from the URL `order_ref` so both pixel and server can compute the same ID.

## Web pixel install (frontend)

### Meta Pixel

`frontend/src/components/analytics/MetaPixel.tsx` (`'use client'`):
```tsx
'use client';
import Script from 'next/script';
import { env } from '@/lib/env';

export function MetaPixel() {
  if (!env.NEXT_PUBLIC_META_PIXEL_ID) return null;
  return (
    <>
      <Script id="meta-pixel" strategy="lazyOnload">
        {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${env.NEXT_PUBLIC_META_PIXEL_ID}');
        `}
      </Script>
      <noscript>
        <img height="1" width="1" style={{display:'none'}}
          src={`https://www.facebook.com/tr?id=${env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`} />
      </noscript>
    </>
  );
}
```

Fire events with the 4-arg form to pass `eventID`:
```ts
fbq('track', 'AddToCart',
  { value: 29.0, currency: 'KWD', contents: [{id:'GUM-2', quantity:1, item_price:29.0}], content_type: 'product' },
  { eventID: metaEventId }
);
```

### TikTok Pixel

```tsx
<Script id="tt-pixel" strategy="lazyOnload">
{`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"]; ...`}
</Script>
```

Fire:
```ts
ttq.track('AddToCart', {
  contents: [{ content_id:'GUM-2', content_name:'علكات كولاجين 2 قطعة', quantity:1, price:29.0 }],
  value: 29.0,
  currency: 'KWD'
}, { event_id: tiktokEventId });
```

### Snap Pixel

```tsx
<Script id="snap-pixel" strategy="lazyOnload">
{`(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u)})(window,document,'https://sc-static.net/scevent.min.js');
snaptr('init', '${env.NEXT_PUBLIC_SNAP_PIXEL_ID}');`}
</Script>
```

Fire:
```ts
snaptr('track', 'ADD_CART', {
  item_ids: ['GUM-2'],
  item_category: 'Beauty',
  price: 29.0,
  currency: 'KWD',
  client_dedup_id: snapEventId,
});
```

### Performance: defer & dedup

- All three pixel `<Script>` tags use `strategy="lazyOnload"` (they load after `load` event) so they don't block LCP/INP.
- `PageView` fires inside `useEffect(() => requestIdleCallback(...))` to avoid jank.
- We **never** load pixels server-side; they are exclusively browser-side.
- Pixels only load **after consent** (consent gate). Until then, the global helper `track()` queues events and flushes on consent.

## Server-side CAPI (FastAPI)

### Phone normalization rules (verified specs)

```
Input (any of): "50001234", "+96550001234", "0096550001234"

Canonical E.164:  "+96550001234"
```

Per-platform normalization for hashing:

| Platform | Phone format before SHA-256 | Example |
|---|---|---|
| **Meta** | digits only, country code, **no `+`**, no leading zeros | `96550001234` |
| **TikTok** | E.164 **with `+`** | `+96550001234` |
| **Snap** | digits only, **no `+`**, no leading zeros (same as Meta) | `96550001234` |

Email normalization (all platforms): trim + lowercase, then SHA-256 lowercase hex.

Hashing helpers — `backend/src/alnadara/services/capi/hashing.py`:

```python
import hashlib

def sha256_lower(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()

def normalize_phone_meta_snap(e164: str) -> str:
    # +96550001234 -> 96550001234
    return e164.lstrip("+")

def normalize_phone_tiktok(e164: str) -> str:
    # Keep the +
    return e164 if e164.startswith("+") else f"+{e164}"

def hash_email(email: str) -> str:
    return sha256_lower(email.strip().lower())

def hash_phone_meta(e164: str) -> str:
    return sha256_lower(normalize_phone_meta_snap(e164))

def hash_phone_tiktok(e164: str) -> str:
    return sha256_lower(normalize_phone_tiktok(e164))

def hash_phone_snap(e164: str) -> str:
    return sha256_lower(normalize_phone_meta_snap(e164))
```

> Per docs: **never hash** IP or User-Agent — they are sent in plaintext (Meta `client_ip_address`/`client_user_agent`; TikTok `ip`/`user_agent`; Snap `user_agent` + `hashed_ip_address` is an exception — Snap requires IP hashed; check current spec at integration time).

### Meta CAPI payload

`POST https://graph.facebook.com/v18.0/{META_PIXEL_ID}/events?access_token={META_CAPI_ACCESS_TOKEN}`

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1717000000,
      "event_id": "meta-pur-NAD-2026-000123",
      "event_source_url": "https://alnadara.shop/thank-you?order=NAD-2026-000123",
      "action_source": "website",
      "user_data": {
        "em": ["<hashed email or omit>"],
        "ph": ["<hashed phone — digits only, no +>"],
        "fn": ["<hashed first name>"],
        "client_ip_address": "x.x.x.x",
        "client_user_agent": "Mozilla/...",
        "fbp": "fb.1.1700...",
        "fbc": "fb.1.1700.IwAR..."
      },
      "custom_data": {
        "currency": "KWD",
        "value": 38.0,
        "contents": [
          {"id":"GUM-2","quantity":1,"item_price":14.5},
          {"id":"UPS-9-MAS","quantity":1,"item_price":9.0}
        ],
        "content_type": "product",
        "order_id": "NAD-2026-000123"
      }
    }
  ],
  "test_event_code": "TEST12345"   // only when META_TEST_EVENT_CODE set
}
```

### TikTok Events API payload

`POST https://business-api.tiktok.com/open_api/v1.3/event/track/`
Header: `Access-Token: <TIKTOK_CAPI_ACCESS_TOKEN>`

```json
{
  "event_source": "web",
  "event_source_id": "<TIKTOK_PIXEL_ID>",
  "data": [
    {
      "event": "CompletePayment",
      "event_time": 1717000000,
      "event_id": "tiktok-pur-NAD-2026-000123",
      "user": {
        "email": "<hashed email or omit>",
        "phone_number": "<hashed phone with + prefix>",
        "external_id": "<hashed order_ref or user id>",
        "ttp": "...",
        "ttclid": "...",
        "ip": "x.x.x.x",
        "user_agent": "Mozilla/..."
      },
      "properties": {
        "currency": "KWD",
        "value": 38.0,
        "contents": [
          {"content_id":"GUM-2","content_name":"علكات كولاجين 2 قطعة","quantity":1,"price":14.5},
          {"content_id":"UPS-9-MAS","content_name":"ماسك الكولاجين (عرض)","quantity":1,"price":9.0}
        ],
        "content_type": "product",
        "order_id": "NAD-2026-000123"
      },
      "page": {
        "url": "https://alnadara.shop/thank-you?order=NAD-2026-000123",
        "referrer": "..."
      }
    }
  ]
}
```

### Snap CAPI payload

`POST https://tr.snapchat.com/v3/{SNAP_PIXEL_ID}/events?access_token=<SNAP_CAPI_ACCESS_TOKEN>`
(Confirm endpoint version against current Snap docs.)

```json
{
  "data": [
    {
      "event_name": "PURCHASE",
      "event_time": 1717000000,
      "event_id": "snap-pur-NAD-2026-000123",
      "action_source": "web",
      "event_source_url": "https://alnadara.shop/thank-you?order=NAD-2026-000123",
      "user_data": {
        "em": ["<hashed email>"],
        "ph": ["<hashed phone — digits only, no +>"],
        "fn": ["<hashed first name>"],
        "hashed_ip_address": "<hashed IP>",
        "user_agent": "Mozilla/...",
        "sc_cookie1": "<scid>",
        "sc_click_id": "<sccid>"
      },
      "custom_data": {
        "currency": "KWD",
        "value": 38.0,
        "contents": [
          {"id":"GUM-2","quantity":1,"item_price":14.5},
          {"id":"UPS-9-MAS","quantity":1,"item_price":9.0}
        ],
        "content_category": "Beauty",
        "transaction_id": "NAD-2026-000123",
        "order_id": "NAD-2026-000123"
      }
    }
  ]
}
```

> Snap field names have shifted between v2 / v3. The AI coder must verify against the Snap CAPI dashboard at implementation time and adjust the keys (`em`/`hashed_email`, `ph`/`hashed_phone_number`, etc.) accordingly.

## Deduplication rules (must match exactly)

| Platform | Pixel field | CAPI field | Window |
|---|---|---|---|
| Meta | `eventID` (4th arg of fbq track) | `event_id` (top-level) | 48h |
| TikTok | `event_id` (3rd arg of ttq.track) | `event_id` (per data item) | 48h |
| Snap | `client_dedup_id` (in payload arg) | `event_id` (per data item) | ~24-48h |

For Purchase events on Snap, **also** set `transaction_id` (pixel) and `order_id` (CAPI) to the same value (`order_ref`).

For TikTok, advertiser commonly also passes `event_source_url` matching exactly between pixel and server.

## Where event_ids are generated

| Event | Generated where | How |
|---|---|---|
| Pre-purchase (PageView, ViewContent, AddToCart, InitiateCheckout, Lead) | Browser | nanoid → forwarded to /api/capi with `meta`, `tiktok`, `snap` namespaces |
| Purchase | Frontend (thank-you page) | Deterministic from `order_ref` so both browser pixel and any later server replay can use the same ID |
| Upsell impression / accept | Browser | nanoid |

Helper file: `frontend/src/lib/analytics/eventId.ts`:
```ts
export const eventIdFor = (platform: 'meta'|'tiktok'|'snap', kind: string, key: string) =>
  `${platform}-${kind}-${key}`;
```

## Consent + privacy

- All pixels gated behind a consent decision (accept = load; decline = never load).
- Without consent, server-side CAPI **still fires** but with no PII (no email/phone/click ids), action_source=`website`, and `data_processing_options: ["LDU"]` for Meta (limited data use).
- IP & UA are not considered PII for most jurisdictions but we follow each platform's "consent mode" recommendations.

## Test plan

1. Each platform has a **Test Events** dashboard. Use a test event code while in staging.
2. End-to-end smoke (Playwright):
   - Visit `/products/sakura-japanese-shampoo`.
   - Click "Add to cart".
   - Open cart, click "أكملي طلبچ".
   - Fill in fake phone `99999999` (test number we whitelist or use a test mode flag).
   - Submit. Get to thank-you page.
   - Assert: in Meta test events dashboard, `Purchase` shows up with EMQ ≥ 7.0, dedup status "browser+server merged".

## Failures are silent

Tracking failures **must never** block user UX. All CAPI requests are fire-and-forget background tasks. Failures go to `event_log` for manual retry.

## What we do NOT track

- No keystroke logging.
- No session-replay tools (Hotjar / FullStory) in v1 — defer to v2 after we know what to look for.
- No third-party tag managers in v1 (GTM optional in v2 if media team wants).
