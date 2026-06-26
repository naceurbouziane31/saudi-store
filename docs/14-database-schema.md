# 14 — Database Schema (Postgres + Alembic)

## Database

- Name: **`alnadara`** (already provisioned in EasyPanel)
- Internal URL: `postgres://alnadara:alnadara@alnadara_database:5432/alnadara?sslmode=disable`
- Driver: `asyncpg` via SQLAlchemy 2.x
- Migrations: Alembic, applied on container boot

## Naming conventions

- Tables: snake_case, plural (`products`, `orders`).
- Columns: snake_case.
- Primary keys: `id BIGSERIAL` for owned domain entities; UUID where externally referenced.
- Timestamps: `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`, `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()` (with trigger).
- Soft delete: `deleted_at TIMESTAMPTZ NULL` where needed; do NOT add for v1 unless mentioned.
- Indexes: explicit, named `ix_<table>__<columns>`.
- Foreign keys: explicit, `fk_<table>__<col>`.

## Tables (v1)

### `products`

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| slug | TEXT UNIQUE NOT NULL | URL slug, e.g. `nature-bounty-collagen-gummies` |
| sku_prefix | TEXT NOT NULL | `GUM`, `SHA`, `MAS` |
| title_ar | TEXT NOT NULL | |
| subtitle_ar | TEXT NULL | |
| short_description_ar | TEXT NULL | |
| long_description_ar | TEXT NULL | Markdown allowed |
| ingredients_ar | JSONB NOT NULL | Array of `{name, role, country?}` |
| benefits_ar | JSONB NOT NULL | Array of strings |
| usage_ar | TEXT NULL | |
| who_is_for_ar | TEXT NULL | |
| who_is_not_for_ar | TEXT NULL | |
| origin_country | TEXT NULL | e.g. `US`, `JP` |
| order | INT NOT NULL DEFAULT 0 | Display order |
| is_active | BOOLEAN NOT NULL DEFAULT true | |
| created_at, updated_at | TIMESTAMPTZ | |

Indexes:
- `ix_products__slug` (unique)
- `ix_products__is_active__order`

### `product_variants`

Pricing per bundle size lives here.

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| product_id | BIGINT FK → products.id ON DELETE CASCADE | |
| sku | TEXT UNIQUE NOT NULL | e.g. `GUM-1`, `GUM-2`, `GUM-3`, `UPS-9` |
| bundle_size | SMALLINT NOT NULL | 1, 2, 3 — or 1 for upsell |
| label_ar | TEXT NOT NULL | e.g. "1 قطعة", "2 قطعة" |
| price_kwd | NUMERIC(10,3) NOT NULL | KWD has 3 decimals |
| compare_at_price_kwd | NUMERIC(10,3) NULL | For strikethrough display |
| is_upsell_offer | BOOLEAN NOT NULL DEFAULT false | Marks the 9 KWD upsell variant |
| is_active | BOOLEAN NOT NULL DEFAULT true | |
| stock_qty | INT NULL | NULL = unlimited; otherwise threshold for "low stock" UI |
| created_at, updated_at | TIMESTAMPTZ | |

Indexes:
- `ix_product_variants__sku` (unique)
- `ix_product_variants__product_id`

### `orders`

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| order_ref | TEXT UNIQUE NOT NULL | Human-readable, e.g. `NAD-2026-000123` |
| customer_name | TEXT NOT NULL | |
| customer_phone_e164 | TEXT NOT NULL | Stored as `+9655XXXXXXX` |
| customer_phone_country | TEXT NOT NULL DEFAULT 'KW' | |
| ip_address | INET NULL | |
| user_agent | TEXT NULL | |
| fbp | TEXT NULL | Meta browser id (`_fbp` cookie) |
| fbc | TEXT NULL | Meta click id (`_fbc` cookie / fbclid param) |
| ttp | TEXT NULL | TikTok browser id |
| ttclid | TEXT NULL | TikTok click id |
| scid | TEXT NULL | Snap browser id |
| sccid | TEXT NULL | Snap click id |
| utm_source | TEXT NULL | |
| utm_medium | TEXT NULL | |
| utm_campaign | TEXT NULL | |
| utm_content | TEXT NULL | |
| utm_term | TEXT NULL | |
| referrer | TEXT NULL | |
| landing_url | TEXT NULL | |
| subtotal_kwd | NUMERIC(10,3) NOT NULL | |
| upsell_total_kwd | NUMERIC(10,3) NOT NULL DEFAULT 0 | |
| shipping_kwd | NUMERIC(10,3) NOT NULL DEFAULT 0 | |
| grand_total_kwd | NUMERIC(10,3) NOT NULL | |
| currency | TEXT NOT NULL DEFAULT 'KWD' | |
| payment_method | TEXT NOT NULL DEFAULT 'cod' | |
| status | TEXT NOT NULL DEFAULT 'pending' | `pending | confirmed | shipped | delivered | returned | cancelled` |
| codnetwork_order_id | TEXT NULL | external id from COD Network |
| codnetwork_status | TEXT NULL | mirror of their status |
| sheets_webhook_sent_at | TIMESTAMPTZ NULL | |
| sheets_webhook_status | TEXT NULL | `ok | failed` |
| event_ids | JSONB NOT NULL DEFAULT '{}' | per-platform event ids `{meta:"...", tiktok:"...", snap:"..."}` |
| created_at, updated_at | TIMESTAMPTZ | |

Indexes:
- `ix_orders__order_ref` (unique)
- `ix_orders__customer_phone_e164`
- `ix_orders__status__created_at`
- `ix_orders__created_at`

### `order_items`

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| order_id | BIGINT FK → orders.id ON DELETE CASCADE | |
| product_id | BIGINT FK → products.id | |
| variant_id | BIGINT FK → product_variants.id | |
| sku | TEXT NOT NULL | snapshot |
| title_ar | TEXT NOT NULL | snapshot |
| bundle_size | SMALLINT NOT NULL | snapshot |
| unit_price_kwd | NUMERIC(10,3) NOT NULL | snapshot |
| line_total_kwd | NUMERIC(10,3) NOT NULL | |
| is_upsell | BOOLEAN NOT NULL DEFAULT false | |
| created_at | TIMESTAMPTZ | |

Indexes:
- `ix_order_items__order_id`
- `ix_order_items__sku`

### `event_log`

For idempotent server-side event delivery (CAPI / COD Network / Sheets).

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| event_type | TEXT NOT NULL | `capi.meta.purchase`, `capi.tiktok.completepayment`, `capi.snap.purchase`, `codnetwork.create_order`, `sheets.webhook`, etc. |
| reference | TEXT NOT NULL | order_ref or other key |
| payload | JSONB NOT NULL | request body |
| status | TEXT NOT NULL DEFAULT 'queued' | `queued | sent | failed | dead` |
| attempts | INT NOT NULL DEFAULT 0 | |
| last_error | TEXT NULL | |
| sent_at | TIMESTAMPTZ NULL | |
| created_at, updated_at | TIMESTAMPTZ | |

Indexes:
- `ix_event_log__event_type__status`
- `ix_event_log__reference`

### `consents` (optional v1; build for future)

For storing cookie consent decisions tied to a session id. Not strictly required for KW PDPL v1 but recommended.

### `health` / `migrations`

Alembic manages its own `alembic_version` table. No additional metadata table needed.

## Seed data (`seed/products_seed.py`)

Idempotent seeder run on container boot. Inserts 3 products + their 1/2/3 variants + the 3 upsell `UPS-9-*` variants (one per product, since the upsell shows the product NOT in cart).

Pseudocode:

```python
PRODUCTS = [
  {
    "slug": "nature-bounty-collagen-gummies",
    "sku_prefix": "GUM",
    "title_ar": "علكات كولاجين نتشرز باونتي",
    "subtitle_ar": "نضارة بشرة، قوة شعر، صلابة أظافر — بعلكة واحدة باليوم.",
    "origin_country": "US",
    "ingredients_ar": [
      {"name": "كولاجين النوع I و III", "role": "بناء وتجديد البشرة"},
      {"name": "فيتامين C", "role": "يدعم امتصاص الكولاجين"},
      {"name": "بيوتين", "role": "صحة الشعر والأظافر"}
    ],
    "benefits_ar": [
      "تحفيز إنتاج الكولاجين الطبيعي",
      "تقليل الخطوط الدقيقة",
      "تقوية بصيلات الشعر",
      "تطويل وتقوية الأظافر",
      "خالية من الجلوتين",
      "علكة واحدة باليوم"
    ],
    "variants": [
      {"sku": "GUM-1", "bundle_size": 1, "label_ar": "1 قطعة", "price_kwd": 19, "compare_at_price_kwd": null},
      {"sku": "GUM-2", "bundle_size": 2, "label_ar": "2 قطعة", "price_kwd": 29, "compare_at_price_kwd": 38},
      {"sku": "GUM-3", "bundle_size": 3, "label_ar": "3 قطع", "price_kwd": 39, "compare_at_price_kwd": 57},
      {"sku": "UPS-9-GUM", "bundle_size": 1, "label_ar": "إضافة بسعر خاص", "price_kwd": 9, "compare_at_price_kwd": 19, "is_upsell_offer": true}
    ]
  },
  ...
]
```

Run idempotently: `INSERT ... ON CONFLICT DO NOTHING` on `slug` and `sku`.

## Numeric precision rules

- KWD has 3 decimals officially (1 KWD = 1000 fils). Use `NUMERIC(10,3)`.
- All money math in Python uses `Decimal`, never `float`.
- Display rounds to 2 decimals on most surfaces; full 3 decimals only when fils are non-zero.

## Constraints

- `orders.grand_total_kwd >= 0`
- `orders.status IN ('pending','confirmed','shipped','delivered','returned','cancelled')` — enforce via CHECK
- `product_variants.bundle_size IN (1,2,3)` — CHECK
- `product_variants.price_kwd > 0` — CHECK

## Migration 0001 (initial)

Creates all 5 tables above. Add 2 generic triggers:
- `trigger_set_updated_at()` → fires `BEFORE UPDATE` on each table with `updated_at`.
- `trigger_orders_event_ids_default()` → ensures jsonb default.

## Backups

- EasyPanel-level Postgres backups: enable daily snapshot + 7-day retention.
- On-demand: `pg_dump alnadara > backup-YYYY-MM-DD.sql` ad hoc.

## Performance / scale notes (v1 expectations)

- Expected order volume v1: 50–500 orders/day → trivially small.
- Indexes above cover all current query patterns (lookup by `order_ref`, recent orders by status, customer history by phone).
- No read replicas in v1.
