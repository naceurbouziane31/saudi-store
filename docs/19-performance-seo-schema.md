# 19 — Performance, SEO & Schema.org

## Performance budgets (enforced)

| Metric | Mobile budget | Desktop budget |
|---|---|---|
| LCP | < 2.5s | < 1.8s |
| INP | < 200ms | < 100ms |
| CLS | < 0.05 | < 0.05 |
| TBT | < 200ms | < 100ms |
| First JS bundle (above-the-fold) | < 180 KB gz | < 220 KB gz |
| First CSS | < 35 KB gz | < 35 KB gz |
| Total page weight (cold) | < 1.2 MB | < 1.6 MB |
| Lighthouse Performance | ≥ 85 | ≥ 95 |

CI must run Lighthouse on every PR (Lighthouse CI GitHub Action, mobile preset, throttled 4G).

## Frontend perf checklist

- `next/image` everywhere with explicit `sizes`. Hero LCP image: `priority` + `fetchPriority="high"`.
- `next/font` for all custom fonts; preload bold weights used above-the-fold; `display: swap`.
- Defer all non-critical JS. Pixel scripts: `strategy="lazyOnload"` (see `17-tracking-pixels-capi.md`).
- Code split: framer-motion only imported in modal/drawer files.
- Avoid client components above the fold unless interactive.
- No client-side fetches before user interaction on home/landing pages.
- Use `react-server-only` where applicable to enforce server boundary.
- ISR with 60s revalidate on product / collection pages so fresh stock & price.
- Tailwind purge enabled; no unused CSS.
- Self-host fonts (no Google Fonts network).
- Disable source maps in prod build (smaller bundles, but ship sourcemaps to error tracker if used).

## Image strategy

- Format: AVIF first, WebP fallback. `next/image` handles.
- Hero image: 4:5 mobile, 16:9 desktop, max 1600w.
- Product gallery: 4:5, max 1200w.
- Cards: 1:1, 600w.
- Always provide a blur placeholder (`plaiceholder` at build).

## CDN / caching

- EasyPanel + Cloudflare in front of `alnadara.shop` (recommended setup, configure on user's account).
- Cloudflare cache rules:
  - `/_next/static/*` → cache everything, 1 year.
  - `/images/*` → cache everything, 30 days.
  - HTML pages: respect server `Cache-Control`.
- API (`api.alnadara.shop`): bypass cache entirely.

## SEO basics

- One canonical URL per page (`<link rel="canonical">`).
- `lang="ar"` and `dir="rtl"` on `<html>`.
- `<title>` ≤ 60 chars per page; specific per page.
- `<meta name="description">` ≤ 155 chars per page; benefit-led.
- Open Graph + Twitter cards on every page (title, description, image 1200×630, type).
- `hreflang="ar-KW"` on `<html>` (single locale).
- `robots.txt` allows everything except `/thank-you` and `/api/*`.
- `sitemap.xml` generated automatically (Next.js `app/sitemap.ts`) — includes all public pages.
- `<meta name="robots" content="noindex, nofollow">` on `/thank-you`.

## Page-specific SEO

| Page | Title | Description |
|---|---|---|
| `/` | النضارة — منتجات جمال وعناية ذاتية من اليابان وأمريكا، توصيل لكل الكويت | اكتشفي مجموعة النضارة من منتجات العناية المختارة بعناية — كولاجين أمريكي، شامبو ياباني، ماسك ليلي. ادفعي عند الاستلام. |
| `/shop` | منتجات النضارة — كولاجين، شامبو ساكورا، ماسك ليلي | تسوّقي أحدث منتجات النضارة — مكونات معتمدة، توصيل سريع لكل الكويت، الدفع عند الاستلام. |
| `/products/...` | {product_title} — {one-line benefit} \| النضارة | {short product benefit paragraph; 130-150 chars} |
| `/about` | قصة النضارة — البراند الكويتي للجمال | تعرّفي على النضارة — براند كويتي يجمع لچ أفضل منتجات الجمال من اليابان وأمريكا. |
| `/contact` | تواصلي معنا — النضارة | تواصلي مع فريق النضارة عبر واتساب أو البريد. نخدمچ بدقايق. |

## Structured data (JSON-LD)

### Home (Organization + WebSite)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Al Nadara",
      "alternateName": "النضارة",
      "url": "https://alnadara.shop",
      "logo": "https://alnadara.shop/images/og/logo-512.png",
      "sameAs": [
        "https://www.instagram.com/alnadara_shop",
        "https://www.tiktok.com/@alnadara_shop",
        "https://www.snapchat.com/add/alnadara_shop"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+96550001234",
        "contactType": "customer support",
        "availableLanguage": ["Arabic", "English"],
        "areaServed": "KW"
      }
    },
    {
      "@type": "WebSite",
      "url": "https://alnadara.shop",
      "name": "النضارة",
      "inLanguage": "ar-KW",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://alnadara.shop/shop?q={query}",
        "query-input": "required name=query"
      }
    }
  ]
}
```

### Collection (`/shop`) — `ItemList`

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"url":"https://alnadara.shop/products/nature-bounty-collagen-gummies","name":"علكات كولاجين نتشرز باونتي"},
    {"@type":"ListItem","position":2,"url":"https://alnadara.shop/products/sakura-japanese-shampoo","name":"شامبو ساكورا الياباني"},
    {"@type":"ListItem","position":3,"url":"https://alnadara.shop/products/overnight-collagen-mask","name":"ماسك الكولاجين الليلي"}
  ]
}
```

### Product page — `Product` + `Offer` + `AggregateRating`

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "علكات كولاجين نتشرز باونتي",
  "description": "علكات كولاجين أمريكية لنضارة البشرة وقوة الشعر والأظافر.",
  "image": [
    "https://alnadara.shop/images/products/nature-bounty-collagen-gummies/1.jpg",
    "https://alnadara.shop/images/products/nature-bounty-collagen-gummies/2.jpg"
  ],
  "brand": {"@type":"Brand", "name":"النضارة"},
  "sku": "GUM-1",
  "offers": [
    {"@type":"Offer","sku":"GUM-1","price":"19.000","priceCurrency":"KWD","availability":"https://schema.org/InStock","url":"https://alnadara.shop/products/nature-bounty-collagen-gummies"},
    {"@type":"Offer","sku":"GUM-2","price":"29.000","priceCurrency":"KWD","availability":"https://schema.org/InStock"},
    {"@type":"Offer","sku":"GUM-3","price":"39.000","priceCurrency":"KWD","availability":"https://schema.org/InStock"}
  ],
  "aggregateRating": {
    "@type":"AggregateRating",
    "ratingValue":"4.8",
    "reviewCount":"1250"
  }
}
```

(Use real review counts once we have them; placeholder values during build are acceptable but document that they're placeholders.)

### FAQ pages — `FAQPage`

Each `FAQ` accordion section can be marked up with `FAQPage` schema to potentially get rich results.

## robots.txt

```
User-agent: *
Allow: /
Disallow: /thank-you
Disallow: /api/

Sitemap: https://alnadara.shop/sitemap.xml
```

## sitemap.xml

Generated server-side; includes:
- `/`
- `/shop`
- `/products/{slug}` (×3)
- `/about`
- `/contact`
- `/policies/shipping`, `/returns`, `/privacy`, `/terms`

`lastmod` set from CMS / database updated_at.
