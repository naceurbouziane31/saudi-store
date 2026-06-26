# 08 — CRO Playbook (12/10 Conversion Engineering)

> Every UI decision = a conversion decision. This playbook is the why behind the spec.

## Core CRO principles for COD DTC in KWT

1. **Trust before price** — Kuwait COD market is burned by dropship scams. We earn trust first, mention price second.
2. **One decision per screen** — never more than one primary CTA visible at a time.
3. **Friction is silent** — every extra field, every confusing tap, every laggy animation = orders lost.
4. **Mobile-first, mobile-only mindset** — design for the worst-case (older iPhone, 4G, daylight glare).
5. **Continue the ad's story** — landing page hero must echo the creative the user just watched.
6. **COD reassurance = the single biggest lever** — mention "ما تدفعين الا لما يوصل" *at least 4 times* per page.
7. **Real urgency only** — fake urgency destroys credibility faster than no urgency.

## The 7 trust signals (every page, always visible)

A page that doesn't show at least **4 of 7** at any scroll position is not done.

| # | Signal | Where it lives |
|---|---|---|
| 1 | COD badge | Trust bar, cart drawer, checkout popup, sticky CTA region |
| 2 | Free delivery line | Trust bar, cart, footer |
| 3 | Customer count ("+3000 امرأة") | Hero, testimonials, footer |
| 4 | Star rating + review count | Product card, product page hero, sticky CTA, footer |
| 5 | WhatsApp customer service button | Floating, all pages |
| 6 | Certifications / ingredient origin badges | Product page, about page |
| 7 | Return / satisfaction guarantee | Trust bar, product page, footer |

## Page-level CRO mandates

### Home
- Hero must answer in 1 second: **what is this brand + what's it for + why care now**.
- Above the fold: brand name, sub-tagline, hero image, primary CTA, trust bar.
- "Featured products" strip: 3 cards, each opening to product page.
- Brand-promise section: 4 USPs as iconographic row.
- Social proof section: 6-8 reviews (mixed text + photo), star aggregate.
- Mini "as seen on" / authority logos (TikTok, Snapchat, Instagram + any press).
- Founder note / about teaser (humanizes the brand).
- FAQ accordion (compress objections).
- Bottom CTA back to collection.

### Product page (THE conversion battlefield)

Structure top-to-bottom:

1. **Image gallery** (4 images, swipeable on mobile)
2. **Title + sub-tagline + star rating + review count**
3. **Offer selector** (3 cards, 2-pack default)
4. **Sticky bottom CTA** appears the moment offer cards leave viewport
5. **Trust bar** (4 USP icons)
6. **Benefits bullets** with icons
7. **"Why it works" — mechanism explanation with diagrams**
8. **Ingredients block** with origin call-outs
9. **Before / after** (real photos when available, sample for now)
10. **Reviews section** with photo testimonials + star breakdown
11. **How to use** (numbered steps with icon)
12. **Who it's for / not for** (two-column compare)
13. **Authority bar** (FDA / Japan / dermatologist / etc.)
14. **FAQ accordion**
15. **Bundle bar** (final offer reminder + CTA)
16. **Footer**

### Collection page
- Hero with brand promise.
- 3 product cards (large, opens product page).
- Trust bar.
- Bundle CTA: "خذي الباقة الكاملة — وفّري 18 KWD."
- Testimonials strip.
- Footer.

### Cart drawer (slides in from start side in RTL = right→left, opposite of LTR)
- Line items with thumbnails.
- Cross-sell strip (2 cards) BEFORE totals.
- Subtotal, free shipping line.
- Trust microcopy: "ما تدفعين الا لما يوصل."
- Primary CTA: `أكملي طلبچ — ادفعي عند الاستلام`.

### Checkout popup (overlay over the page where the cart CTA was clicked)
- Order summary at top (small, collapsed by default on mobile).
- Social proof line: "+3,000 طلب وصلت بأمان."
- Real-time scarcity line (if applicable): "آخر [N] قطع من العرض."
- Name field (single line).
- Phone field with **inline Kuwait validation**.
- Submit CTA.
- Below CTA: "بالضغط على إرسال، نتواصل بيا للتأكيد. ما تدفعين الا لما يوصل."

### Upsell modal
- 15-second countdown (timer is real, not psychological theater).
- Single product + flat 9 KWD offer.
- Big YES, small no.
- After action → thank-you page.

### Thank-you page
- Big confirmation: "وصلنا طلبچ يا [name]"
- Order summary with line items + grand total
- Expected delivery window
- "نتواصل بيا قريب" line
- WhatsApp link to follow up directly
- Cross-link back to home / shop more

## Form CRO

### The 2-field rule
Name + Phone. That's it. Address and apartment details are collected **by phone** during the confirmation call by COD Network — this is the Kuwait/GCC convention and it raises conversion 30-50% vs. asking for full address upfront.

### Validation rules
- **Phone**: Kuwait mobile = 8 digits, must start with **5, 6, or 9**. Validate live as user types. Show green check on valid; show inline help (not error) until valid.
- **Name**: minimum 2 characters, no numbers. Trim.
- **Honeypot field** for bots (hidden field; if filled, silently drop the submission).
- **Submit button**: disabled until both fields valid. NOT greyed-out invisible — soft-disabled with a hint "أكملي البيانات حتى نقدر نأكد طلبچ."

### Phone field UX
- Inputmode `tel`, type `tel`.
- Auto-strip spaces and `+`.
- Optional country prefix display (read-only `+965` to the right of the input in RTL).
- After 8 digits → instant validation result.

## Scarcity & urgency (acceptable forms)

| Mechanism | When to use | Rule |
|---|---|---|
| Low stock badge ("متبقي [N]") | When real inventory < threshold (≤ 20) | Always real |
| Cohort scarcity ("آخر دفعة من اليابان") | Always, on shampoo & mask | Truthful framing |
| Upsell timer (15s) | Post-form upsell modal only | Real countdown |
| "العرض الافتتاحي" framing | All offers, until we have repeat scaling | Phase out once we have 30-day history |

## Social proof (must-haves)

- **Aggregate**: "★★★★☆ 4.8 · +1,250 تقييم"
- **Customer count**: "+3,000 طلب وصلت بأمان"
- **Photo testimonials**: 4–8 cards with woman's photo (placeholder ok for now), name + age + city ("نورة، 28، الفروانية"), 1–3 line review.
- **Video testimonials**: 2–3 short UGC-style video slots (placeholder MP4 for now).
- **Country flag of origin**: "🇯🇵 من اليابان"، "🇺🇸 من أمريكا".
- **Studies/numbers**: cite actual study with source link in tiny print at bottom.

## Reducing friction (specific tactics)

- One-tap to add to cart.
- Cart drawer slides in from the start side (right in RTL).
- No login required, no email required, no account creation.
- No "agree to terms" checkbox (link in footer is enough legally).
- No popup before any interaction (no email capture popups EVER).
- Page transitions snappy (`transition-all 200ms ease-out`).
- Images lazy-loaded but with stable aspect-ratio so no layout shift.
- Fonts preloaded; FOUT eliminated.
- Skeleton states for cart drawer & product images.

## Reducing buyer's remorse (post-order)

- Thank-you page reassures: "نتواصل بيا قريب جداً" + "ما تدفعين الا لما يوصل."
- Auto-send WhatsApp message via COD Network or our own webhook within 5 min.
- Show estimated delivery window prominently.
- Link to "what to expect" mini-guide.

## Performance is CRO

- LCP < 2.5s on mobile 4G. Every 100ms of delay = ~1% conversion drop.
- TBT < 200ms. JS bundle for above-the-fold = lean.
- No autoplay video on mobile data.
- Use `next/image` with proper sizes everywhere.
- Tracking pixels deferred (see `17-tracking-pixels-capi.md`).

## Anti-CRO patterns (banned)

- ❌ Modal popups on entry / on exit-intent.
- ❌ Newsletter signup popup.
- ❌ Auto-playing video with sound.
- ❌ Sticky chat widgets that cover the CTA.
- ❌ Interstitial "spin the wheel" / gamified discounts.
- ❌ Cookie consent banner that blocks scroll (use a small bottom bar).
- ❌ Carousels on product page (use stacked images or swipeable gallery).

## Test priorities post-launch (in order)

1. Default offer card (2-pack vs 3-pack)
2. Hero copy (PAS vs identity vs question)
3. Trust bar copy & icon set
4. Upsell product priority
5. Checkout popup order summary (collapsed vs expanded by default)
6. Cross-sell wording in cart
7. Product page section order (e.g., reviews above benefits vs below)

Each test: minimum 7-day window, minimum 200 conversions per arm, single variable at a time.
