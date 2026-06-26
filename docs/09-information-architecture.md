# 09 — Information Architecture

## Sitemap

```
/                                       Home
/shop                                   Collection (all 3 products)
/products/nature-bounty-collagen-gummies   Product page — gummies
/products/sakura-japanese-shampoo          Product page — shampoo
/products/overnight-collagen-mask          Product page — mask
/about                                  About us
/contact                                Contact us
/thank-you?order={orderRef}             Post-order confirmation
/policies/shipping                      Shipping & delivery
/policies/returns                       Return & satisfaction
/policies/privacy                       Privacy
/policies/terms                         Terms
404                                     Not found (branded)
```

> All routes Arabic UI, RTL. URLs are intentionally English/Latin for SEO + share clarity.

## Global header

Layout (RTL — Arabic primary direction):

```
[ ن ]  النضارة         ☰ Menu items        🛒 (cart count)
       Al Nadara
```

Header contents (right-to-left order in RTL):

1. **Logo** — Circle mark `[ ن ]` + stacked wordmark (النضارة / Al Nadara). Clicking goes to `/`.
2. **Primary nav** — collapses to hamburger ☰ on mobile (< 1024px):
   - الرئيسية (Home)
   - المنتجات (Shop / Collection)
   - من نحن (About us)
   - تواصلي معنا (Contact us)
3. **Cart icon** with a badge for item count. Tapping opens the **Cart Drawer**.

Header rules:
- Sticky on scroll (translucent white background `rgba(255,255,255,0.95)` + backdrop-blur).
- Height: 64px mobile, 80px desktop.
- Shadow on scroll (none at top, `shadow-sm` after 8px scroll).
- Language toggle button? **No** — Arabic-only UI in v1.

## Global footer

Three-column layout on desktop, single-column accordion on mobile.

```
┌────────────────────┬────────────────────┬────────────────────┐
│ النضارة            │ روابط سريعة         │ تواصلي معنا       │
│ — brand statement  │ الرئيسية            │ واتساب              │
│ — logo & tagline   │ المنتجات            │ phone               │
│ — payment icons    │ من نحن              │ email               │
│ — social icons     │ تواصلي معنا         │ ساعات العمل        │
│                    │ سياسة الإرجاع       │                     │
│                    │ سياسة التوصيل       │                     │
│                    │ سياسة الخصوصية      │                     │
│                    │ الشروط والأحكام     │                     │
└────────────────────┴────────────────────┴────────────────────┘
─────────────────────────────────────────────────────────────────
   © 2026 النضارة — صنع لچ من الكويت 🇰🇼   |   جميع الحقوق محفوظة
```

Footer must include:
- Brand mark + tagline
- All policy links
- Phone, email, WhatsApp
- Working hours
- COD / shipping reassurance microcopy
- Social: Instagram, TikTok, Snapchat
- Payment / trust icons (COD label, "إرسال آمن")
- Copyright

## Floating UI elements

| Element | Visible | Position |
|---|---|---|
| WhatsApp floating button | All pages | Bottom-left (RTL) or bottom-right per locale — RTL = bottom-left |
| Sticky CTA bar (mobile, product pages) | Product pages only, on mobile, after offer cards leave viewport | Bottom, full-width |
| Cookie banner | First visit | Bottom, dismissible |

## Cart drawer

- Triggered by header cart icon OR product-page "Add to cart."
- Slides in from the **start side** (in RTL, that's the **right side** of the screen — same physical side as the cart icon).
- Width: 100% on mobile, 420px on desktop.
- Overlay backdrop with backdrop-blur.
- Esc + outside-click + close (×) button all dismiss.
- Body scroll locked while open.
- Contents in order:
  1. Header: "سلتچ" + close button.
  2. Line items (image, title, bundle size, price, qty controls — `+ / -`, remove).
  3. Cross-sell strip (2 cards).
  4. Trust microcopy line.
  5. Subtotal + free shipping line.
  6. Primary CTA: `أكملي طلبچ — ادفعي عند الاستلام`.

## Checkout popup

- Triggered from cart drawer CTA.
- **Replaces** the cart drawer (no double overlay).
- Centered modal on desktop (max-width 480px), full-screen sheet on mobile.
- Closeable via × in top-end corner.
- See `11-page-specs.md` for full content.

## Upsell modal

- Triggered immediately after successful form submit (before navigating to /thank-you).
- Centered modal on desktop, full-screen sheet on mobile.
- 15-second auto-dismiss with visible countdown.
- See `11-page-specs.md`.

## Navigation rules

- All links are real anchor `<a>` (or Next `<Link>`) — no JS-only navigations.
- Active link state on header nav (brand-primary underline).
- Breadcrumbs **not used** (sitemap is shallow).

## URL structure & SEO

- `/products/{slug}` — slugs in English (Latin), human-readable.
- `/shop` — landing for ads can deep-link here.
- Canonical URLs set on every page.
- Hreflang: `ar-KW` set on all pages (single locale v1).
- Open Graph image: 1200×630, brand cover, dynamic per product.

## Z-index scale (use these tokens only)

| Token | Value | Use |
|---|---|---|
| `z-base` | 0 | Default |
| `z-sticky` | 30 | Sticky header, sticky CTA |
| `z-floating` | 40 | WhatsApp FAB |
| `z-overlay` | 50 | Backdrop |
| `z-drawer` | 60 | Cart drawer |
| `z-modal` | 70 | Checkout popup, upsell modal |
| `z-toast` | 80 | Notifications |
