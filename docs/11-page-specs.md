# 11 — Page Specifications

> Each page below is described section-by-section, top-to-bottom, mobile-first. The AI coder implements **exactly** this structure unless a clear improvement is proposed and documented.

---

## Home `/`

### 1. Header
Standard global header (see `09-information-architecture.md`).

### 2. Hero
- Background: `--color-cream` with a subtle radial gradient.
- Layout: image on the **end side** (left in RTL), text on the **start side** (right in RTL). On mobile, image stacks under text.
- H1 (Display): `نضارتچ تبدا من هنا.`
- Sub (text-lg): `براند كويتي يجمع لچ أقوى منتجات الجمال من اليابان وأمريكا — يوصل لباب بيتچ، وتدفعين بس عند الاستلام.`
- Primary CTA: `شوفي المنتجات →` → `/shop`
- Trust micro-row right below CTA: 4 small icons + 1-word labels (COD، توصيل، ضمان، مكونات معتمدة).
- Hero image: sample (lifestyle Kuwaiti woman applying skincare in soft morning light). Replace later via `/public/images/hero/`.

### 3. Trust bar
Strip with `--color-rose` background, 4 columns desktop / 2x2 grid mobile:
- `🇰🇼  توصيل لكل الكويت — 24-48 ساعة`
- `💰  الدفع عند الاستلام — ادفعي لما يوصل`
- `🔬  مكونات معتمدة — من اليابان وأمريكا`
- `🔁  ضمان الرضا — رجعيه لو ما عجبچ`

### 4. Featured products
Heading: `منتجاتنا — مختارة بعناية`
3 product cards in a row on desktop, scroll-snap horizontal on mobile.
Each card: image (1:1), title (h3), star rating + count, starting-from price, CTA `اعرفي أكثر`.

### 5. Brand promise (alternating image-text)
Two stacked image-text sections:
- **Section A** (image **end** — left in RTL, text **start** — right):
  - H2: `من اليابان لباب بيتچ`
  - Body: short story about how we hand-pick formulations from trusted global sources.
  - Tag bar: 🇯🇵 🇺🇸 ✓ Dermatologically tested
- **Section B** (image **start** — right in RTL, text **end** — left): mirrored layout
  - H2: `لأنچ تستحقين أحسن`
  - Body: emotional copy about self-care, confidence, and feeling beautiful again.

### 6. The Bundle teaser
Card-section with `--color-cream` background:
- Headline: `خذي الباقة الكاملة — وفّري 18 KWD`
- Sub: 3 منتجات لروتين متكامل من الصبح للمساء
- CTA: `اطلبي الباقة الحين →`

### 7. Social proof
- Aggregate row: `★★★★☆ 4.8 · أكثر من 1,250 تقييم سعيد`
- Grid of 6 testimonial cards (mix of photo + text); each shows name + age + city + 1-3 line quote.
- Below: short video reel placeholders (3 slots).

### 8. Authority / press
Horizontal strip of muted-color logos:
- "كما ظهرنا في …" placeholder logos: BoredPanda-style, blogs, Snapchat Discover, TikTok Shop, etc.

### 9. Founder note
Small section, narrow column:
- Title: `رسالة من المؤسسة`
- Body: 4-5 sentences in first person about why this brand exists. (Sample copy in copy bank.)
- Signed: `بحب،  النضارة`

### 10. FAQ
Accordion of 6–8 common questions. (See copy bank.)

### 11. Final CTA
Full-width band with `--color-brand` background, white text:
- Headline: `جاهزة تبدين نضارتچ؟`
- CTA: `اطلبي الحين — ادفعي عند الاستلام`

### 12. Footer
Standard global footer.

---

## Collection `/shop`

### 1. Header

### 2. Page hero (slim)
- H1: `منتجاتنا`
- Sub: `كل منتج اخترناه بعناية، يحل مشكلة محددة، ويعطيچ نتيجة تشوفينها.`

### 3. Trust bar (4 USPs)

### 4. Product grid
3 product cards, large. On mobile, 1 per row; on desktop, 3 per row.

### 5. Bundle CTA
Same as home #6.

### 6. Testimonial strip (3 reviews)

### 7. FAQ (4 questions)

### 8. Footer

---

## Product page `/products/{slug}`

### 1. Header

### 2. Image gallery
- Mobile: swipeable horizontal carousel with dots indicator.
- Desktop: thumbnail rail on the start side + large image on the end side. 4 images.
- Each image aspect 4:5.
- First image preloaded.

### 3. Title block
- Optional small badge above title: `وصلت دفعة جديدة` (only if applicable).
- H1: product name (Arabic).
- Sub: tagline (1 line).
- Row: star rating + count + WhatsApp link "أسألينا" (small).

### 4. Offer selector
Three cards (see spec in `06-offers-pricing-aov.md`).
Default selection: **2 pieces**.

### 5. Primary CTA + sticky version
- Inline CTA: `أضيفي للسلة — {price} KWD` → adds correct SKU + opens cart drawer.
- Once user scrolls past offer cards, **sticky bottom bar** appears with same CTA + qty.

### 6. Trust bar (4 USPs)

### 7. Benefits
Heading: `ليش [اسم المنتج]؟`
6 benefit items in a 2-column grid on mobile (1-column on very small), 3-column on desktop. Each = icon + headline + 1-line description.

### 8. Mechanism (image + text)
- Alternating layout (text start, image end on this section).
- H2: `كيف يشتغل؟`
- Body: mechanism paragraph (from `05-products.md`).
- Diagram or stylized image placeholder.

### 9. Ingredients
Heading: `المكونات الفعّالة`
- 3-5 ingredient cards: name + 1-line role + country flag if applicable.
- Below: certification badges (`FDA`, `Japan ISO`, `Dermatologically Tested`, `No Parabens`, etc.).

### 10. Before / after
Heading: `قبل و بعد — نتايج حقيقية`
- 2-3 before/after pairs side by side. Use placeholder set during build.
- Caption: `بعد 30 يوم استخدام منتظم` etc.

### 11. Reviews
- Aggregate header: stars + count + breakdown bars (5/4/3/2/1).
- 6-8 review cards (mix of photo + text).
- Filter chips (Optional v1): "صور"، "بشرة دهنية"، "بشرة جافة" — Skip for v1, structure later.

### 12. How to use
Numbered steps (3-4) with small icon each.

### 13. Who it's for / not for
Two columns side by side:
- **مناسب لـ** ✓ ... (3-4 bullets)
- **غير مناسب لـ** ✗ ... (1-2 bullets)

### 14. Authority bar
Strip of 4-6 trust logos: FDA / Japan / dermatology body / press / cert badges.

### 15. FAQ accordion
6 questions per product (from `05-products.md`).

### 16. Final offer reminder
Repeat offer selector + CTA at the bottom for users who scrolled all the way down.

### 17. Footer

---

## About us `/about`

### 1. Header

### 2. Hero
- H1: `قصة النضارة`
- Sub: 1-paragraph intro.
- Image: founder/lifestyle.

### 3. Why we started
Image-text alternating. Founder's story, in first person.

### 4. What we believe (manifesto)
4 short statements as cards:
- نؤمن إن الجمال يبدا من الداخل قبل الخارج.
- نختار أحسن المكونات — مو الأرخص.
- نخدمچ كأنچ صديقتنا الشخصية.
- نضمن لچ تجربة بدون مخاطر — تدفعين بس لما يوصل.

### 5. How we choose products
Numbered process: source → test → review → curate.

### 6. The team / faces (optional)
Skip for v1 or use stylized illustrations.

### 7. Trust bar

### 8. Final CTA: `شوفي منتجاتنا →`

### 9. Footer

---

## Contact `/contact`

### 1. Header

### 2. Hero
- H1: `تواصلي معنا`
- Sub: `أي سؤال؟ نجاوبچ بدقايق. ما نخليچ تنتظرين.`

### 3. Channels (3 cards)
- WhatsApp (primary, big card): button opens wa.me link.
- Email
- Phone

### 4. Working hours

### 5. Contact form (optional v1; if shipped: name, phone, message; emails to support@alnadara.shop)

### 6. FAQ teaser (3 questions)

### 7. Footer

---

## Cart drawer

(See spec in `09-information-architecture.md` and `06-offers-pricing-aov.md`.)

Detailed contents:
- **Header**: text `سلتچ ({count} منتج)` + close button.
- **Line items list** (scrollable):
  - Thumbnail (square 64px)
  - Title + bundle label ("2 قطعة")
  - Price + line total
  - Qty controls: `-` `2` `+` (clamped to >= 1)
  - Remove (trash icon)
- **Cross-sell strip** (always 2 cards, picks NOT-in-cart products):
  - Each card: thumbnail + title + 1-piece price + `+ أضيفي`
- **Trust microcopy line**:
  - `🚚 توصيل مجاني · 💰 ادفعي لما يوصل`
- **Summary block**:
  - السعر الفرعي: 29 KWD
  - الشحن: مجاني
  - الإجمالي: 29 KWD
- **Primary CTA**: `أكملي طلبچ — ادفعي عند الاستلام →`
- **Secondary link**: `أو أكملي التسوق` (closes drawer).

Empty state:
- Illustration / icon.
- Text: `سلتچ فاضية الحين — اختاري منتجاتچ`.
- CTA: `شوفي المنتجات →` (closes drawer + routes to `/shop`).

---

## Checkout popup

Triggered from cart drawer.

### Layout
- Modal on desktop (480px), full-screen sheet on mobile.
- Close button top-end.
- Body scroll locked.

### Contents
1. **Title**: `أكملي طلبچ — ادفعي عند الاستلام`
2. **Order summary** (collapsed on mobile by default — accordion):
   - Each line item (title + qty + line total)
   - Subtotal, shipping (free), grand total
   - Tap to expand/collapse.
3. **Social proof row**:
   - `★★★★☆ 4.8 — +3,000 طلب وصلت بأمان`
4. **Scarcity micro-line** (optional, only if real):
   - `العرض الافتتاحي — آخر [N] قطع`
5. **Form**:
   - **Name** (`اسمچ الكريم`) — input, required.
   - **Phone** (`رقم جوالچ`) — input with `+965` prefix display, inline validation.
6. **Submit CTA**: `أرسلي طلبچ — ندفع عند الاستلام`
7. **Below CTA**:
   - `بالضغط، نتواصل بيا للتأكيد. ما تدفعين الا لما يوصل.`
   - Tiny links: شروط، خصوصية.
8. **Honeypot field** (visually hidden).

### Validation behavior
- Name: required, min 2 chars, no digits.
- Phone: required, must match `^[569]\d{7}$` (8 digits starting with 5, 6, or 9).
  - Live mask as user types.
  - Show green check when valid.
  - Show inline helper "الرقم لازم يكون كويتي يبدي بـ 5 / 6 / 9 — مثال 50001234".
- Submit button stays soft-disabled until both fields valid.
- On submit:
  1. POST to `/api/orders` (see `15-api-contract.md`).
  2. Fire `InitiateCheckout` (web + CAPI) — already on cart open, here fire `AddPaymentInfo` (or `Lead` equivalent depending on pixel).
  3. On 200 → open Upsell Modal with returned `order_ref`.
  4. On error → inline retry banner: `ما قدرنا نرسل طلبچ — حاولي مرة ثانية`.

---

## Upsell modal

Triggered on order creation success.

### Layout
- Modal on desktop (480px), full-screen sheet on mobile.
- Cannot be dismissed by clicking backdrop (force decision or wait for timer).
- × button hidden (only timer OR explicit decline).

### Contents
1. **Header bar**: `فرصة وحدة — لا تروح عليچ` + countdown `00:14` (live).
2. **Product image** (1:1, large).
3. **Title**: `أضيفي [اسم المنتج] لطلبچ بسعر حصري لمرة وحدة`
4. **Price row**: ~~19 KWD~~ → **9 KWD**
5. **Primary CTA**: `✔ أضيفيه لطلبچ بـ 9 KWD`
6. **Decline link**: `لا، شكراً — أكملي طلبي`

### Behavior
- Timer counts down from 15s.
- At 0s → auto-decline → navigate to `/thank-you?order={ref}`.
- Accept → POST `/api/orders/{ref}/upsell` → confirmation toast → navigate to `/thank-you`.
- Decline → navigate to `/thank-you`.

### Tracking
- `Upsell_Impression` fires on mount.
- `Upsell_Accept` or `Upsell_Decline` on user action / timeout.

---

## Thank-you `/thank-you?order={ref}`

### 1. Header (no cart icon on this page)

### 2. Hero
- Large checkmark icon (success color).
- H1: `يعطيچ العافية يا {name}! 💚`
- Sub: `وصلنا طلبچ — راح نتواصل بيا قريب جداً للتأكيد.`

### 3. Order summary card
- Order ref number (big, copyable).
- Line items.
- Subtotal, shipping (free), grand total.
- Payment method: `الدفع عند الاستلام (COD)`.

### 4. What happens next (3 steps)
1. ✅ استلمنا طلبچ — order received
2. 📞 نتواصل بيا (خلال ساعة في وقت الدوام) للتأكيد
3. 🚚 يوصل لچ خلال 24-48 ساعة — ادفعي عند الاستلام

### 5. WhatsApp follow-up CTA
Big button: `كلميني الحين على واتساب →` (deep link to WA with prefilled "طلبي رقم {ref}").

### 6. Brand re-assurance
Short note from "the team" thanking them.

### 7. Footer

### Tracking
- Fire `Purchase` (web + CAPI) on mount, **once per session per order_ref**, with full purchase payload. Use the `order_ref` as the deduplication key.
- Snap: `PURCHASE` with `transaction_id` = `order_ref`.
- TikTok: `CompletePayment` with `event_id` unique per order/platform.
- Meta: `Purchase` with `event_id` unique per order/platform.

---

## Policy pages (`/policies/shipping`, `/returns`, `/privacy`, `/terms`)

Simple template:
- Header.
- Page hero (slim) with H1.
- Long-form content (markdown rendered).
- Footer.

Copy lives in `frontend/src/content/policies/*.md`.

---

## 404
- Header.
- Centered illustration / icon.
- Headline: `ما لقينا الصفحة اللي تدورين عليها`
- Sub: `ممكن الرابط غلط أو الصفحة انحذفت.`
- CTA: `رجعيني للرئيسية`
- Footer.
