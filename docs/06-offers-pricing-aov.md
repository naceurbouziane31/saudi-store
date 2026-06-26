# 06 — Offers, Pricing & AOV Engineering

## Pricing table (every product, every time)

| Pack | Price | Per-piece | Savings vs 1-pack | Badge |
|---|---|---|---|---|
| 1 piece | **19 KWD** | 19 KWD | — | (no badge) |
| 2 pieces | **29 KWD** | 14.50 KWD | save 9 KWD | الأكثر مبيعاً (most popular) |
| 3 pieces | **39 KWD** | 13.00 KWD | save 18 KWD | أفضل قيمة (best value) |

## AOV strategy (the math)

We assume:
- 30% of buyers choose the 1-pack
- 45% choose the 2-pack
- 25% choose the 3-pack

Base AOV = 0.30 × 19 + 0.45 × 29 + 0.25 × 39 = **28.50 KWD**

With cross-sell attach in cart drawer at 18% acceptance × ~19 KWD average attach = **+3.42 KWD**

With upsell at 20% acceptance × 9 KWD = **+1.80 KWD**

**Projected AOV ≈ 33.7 KWD** (vs. 19 KWD if we just sold a 1-pack — that's +77%).

Every UI decision below is designed to defend or improve these conversion rates.

## Offer selector UI (on every product page)

Three large clickable cards stacked vertically on mobile (horizontally on desktop ≥768px). Pattern:

```
┌─────────────────────────────────────────────┐
│  ○  3 قطع  •  أفضل قيمة                    │
│      ✓ وفّري 18 KWD                          │
│      39 KWD   ⊘ 57 KWD                       │
│      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │
│      13 KWD للقطعة                          │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  ●  2 قطعة  •  الأكثر مبيعاً                │
│      ✓ وفّري 9 KWD                           │
│      29 KWD   ⊘ 38 KWD                       │
│      14.50 KWD للقطعة                       │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  ○  1 قطعة                                  │
│      19 KWD                                  │
└─────────────────────────────────────────────┘
```

Rules:
- The **2-piece** option is selected by default (highest combined acceptance × AOV).
- **Strike-through** anchor pricing = N × 19 KWD (1-pack price × quantity).
- The selected card is highlighted with brand-primary border + brand-cream background.
- Card title row uses the bundle name from `05-products.md`.
- "Per-piece" line uses smaller font + brand-accent color.
- Tapping a card updates the **sticky CTA** at the bottom of the page (price + quantity reflected).

## Sticky CTA bar (mobile, every product page)

Pinned to the bottom of the viewport on mobile, always visible above the keyboard except in inputs:

```
┌─────────────────────────────────────────────┐
│  أضيفيها للسلة — 29 KWD          [ أضيفي → ]│
└─────────────────────────────────────────────┘
```

- Uses currently-selected offer's price.
- Tap → adds correct SKU (e.g., `GUM-2`) to cart + opens cart drawer.

## Cross-sell strip in cart drawer

Right under the cart line items, before the totals:

```
┌─────────────────────────────────────────────┐
│  أضيفي لطلبچ                                │
│  ┌────────┐  ┌────────┐                      │
│  │ Shampoo│  │  Mask  │   <- horizontal      │
│  │ 19 KWD │  │ 19 KWD │      scroll on      │
│  │  + Add │  │  + Add │      narrow mobile  │
│  └────────┘  └────────┘                      │
└─────────────────────────────────────────────┘
```

- Items shown = cross-sell matrix entries NOT already in cart.
- Always 1-piece price (don't confuse the buyer with bundles here).
- Tap "+ Add" → adds product as a 1-pack to cart without closing the drawer.

## Post-form upsell modal (the only place we discount a product)

Triggered the **instant** the checkout form is successfully submitted (after phone validates + order created server-side), BEFORE the thank-you page renders.

```
┌────────────────────────────────────────────────┐
│   فرصة وحدة — لا تروح عليچ ⏱ 00:14            │
│   ─────────────────────────────────────         │
│                                                 │
│   [ صورة المنتج ]                              │
│                                                 │
│   أضيفي [اسم المنتج] لطلبچ بسعر               │
│   حصري لمرة وحدة                                │
│                                                 │
│   ⊘ 19 KWD   →   9 KWD                          │
│                                                 │
│   [  ✔  أضيفيه لطلبچ بـ 9 KWD  ]                │
│                                                 │
│   لا، شكراً — أكملي طلبي                       │
└────────────────────────────────────────────────┘
```

Rules:
- **Live 15-second countdown** in the top right. When it hits 0, the modal auto-dismisses and the user lands on the thank-you page.
- Tapping "Add" → updates the order on the backend (adds upsell line item), shows a brief confirmation toast, then proceeds to thank-you page.
- Tapping "No thanks" → goes to thank-you page immediately.
- Product selected = the cross-sell that is NOT in the cart, with priority Gummies > Shampoo > Mask.
- Track: `Upsell_Impression`, `Upsell_Accept`, `Upsell_Decline` events.

## Order line-item structure (sent to backend & COD Network)

Every cart and order line item must carry:

```json
{
  "sku": "GUM-2",
  "product_slug": "nature-bounty-collagen-gummies",
  "title_ar": "علكات كولاجين نتشرز باونتي",
  "bundle_size": 2,
  "unit_price_kwd": 14.5,
  "line_total_kwd": 29.0,
  "is_upsell": false
}
```

For the upsell:

```json
{
  "sku": "UPS-9",
  "product_slug": "<the upsell product>",
  "title_ar": "<اسم المنتج>",
  "bundle_size": 1,
  "unit_price_kwd": 9.0,
  "line_total_kwd": 9.0,
  "is_upsell": true
}
```

## Order total fields

```json
{
  "subtotal_kwd": 29.0,
  "upsell_total_kwd": 9.0,
  "shipping_kwd": 0.0,
  "grand_total_kwd": 38.0,
  "currency": "KWD",
  "payment_method": "cod"
}
```

(Shipping = 0 for v1 — free delivery to incentivize conversion. If we add a paid-shipping tier later, this field already exists.)

## Pricing rules engine (server-side)

- All prices live in **Postgres** in a `products` + `product_variants` (bundle 1/2/3) table.
- Frontend NEVER sets the final price — it sends `sku`, server returns `line_total_kwd`.
- This prevents tampering and lets us A/B test pricing without redeploys.
- Upsell price is also server-controlled (a `is_upsell_offer` flag on a variant).

## Forbidden discount patterns

- ❌ Sitewide coupon codes (cheapens premium positioning, leaks via coupon sites).
- ❌ "Flash sale" timer banners (looks scammy, ICP distrusts).
- ❌ Showing 1-piece "regular price" anchor with a fake crossed-out 39 KWD.
- ❌ Free shipping threshold (we offer free shipping to everyone; calling it out as a threshold creates AOV friction without payoff in COD market).

## Allowed urgency

- ✅ Real low-stock indicators (driven by backend inventory threshold).
- ✅ Upsell countdown (15s post-form) — clearly framed as a one-time offer.
- ✅ Cohort scarcity: "آخر دفعة وصلت — متوفر [N] قطعة بس هالشهر" (only shown if real).
- ✅ "العرض الحالي بسعر افتتاح البراند" (launch-pricing framing — pull off once we're profitable).

## A/B test ideas (do NOT ship in v1, but architect for them)

- Default-selected card: 2-pack vs. 3-pack.
- Bundle naming variants.
- Upsell product priority order.
- Sticky CTA wording: "أضيفي للسلة" vs "اطلبيها الحين".
- Header trust bar copy.

Architecture: each test gets a `variant` query param + cookie; events tagged with variant ID; analytics filter by variant.
