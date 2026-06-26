# 10 — Design System

## Tokens (single source of truth — `frontend/src/styles/tokens.css`)

All tokens are CSS custom properties on `:root` AND mapped 1:1 in `tailwind.config.ts` under `theme.extend`.

### Color tokens (from `02-brand-identity.md`)

```css
:root {
  --color-bg: #FFFFFF;
  --color-surface: #FAFAF8;
  --color-cream: #F7F1E8;
  --color-rose: #E9C6BB;

  --color-ink-900: #1A1A1A;
  --color-ink-700: #3F3F3F;
  --color-ink-500: #737373;
  --color-ink-300: #D4D4D4;

  --color-brand: #7A3E2E;
  --color-brand-hover: #5E2F23;
  --color-accent: #D9A65E;

  --color-success: #2E7D32;
  --color-danger: #C62828;
  --color-warning: #ED6C02;
}
```

### Type tokens

```css
:root {
  --font-display: "Tajawal", "Cairo", system-ui, sans-serif;
  --font-body: "Tajawal", "Cairo", system-ui, sans-serif;
  --font-latin-display: "Cormorant Garamond", "Times New Roman", serif;
  --font-latin-ui: "Inter", system-ui, sans-serif;

  --text-display: 2.5rem;   /* 40px */
  --text-h1: 1.875rem;      /* 30px */
  --text-h2: 1.5rem;        /* 24px */
  --text-h3: 1.25rem;       /* 20px */
  --text-lg: 1.125rem;      /* 18px */
  --text-base: 1rem;        /* 16px */
  --text-sm: 0.875rem;      /* 14px */
  --text-xs: 0.75rem;       /* 12px */
}
```

### Space scale (4px base)

`--space-0: 0; --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px; --space-12: 48px; --space-16: 64px; --space-20: 80px; --space-24: 96px;`

### Radius

`--radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-xl: 20px; --radius-full: 9999px;`

### Shadow

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 4px 12px rgba(0,0,0,0.06);
--shadow-lg: 0 12px 24px rgba(0,0,0,0.08);
--shadow-pop: 0 20px 40px rgba(122, 62, 46, 0.12); /* brand-tinted */
```

### Motion

```css
--ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 320ms;
```

## RTL & LTR

- The entire UI is RTL by default: `<html lang="ar" dir="rtl">`.
- Use **logical CSS properties** (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`, etc.) — never `margin-left`/`margin-right`.
- Tailwind: enable `tailwindcss-logical` plugin so utilities like `ms-4`, `pe-2`, `start-0` work.
- Icons that have direction (arrows, chevrons) must mirror in RTL using `[dir="rtl"] .icon-flip { transform: scaleX(-1); }`.
- Numerals: use **Western Arabic numerals** (1, 2, 3) for prices and stats — not Eastern Arabic (٠١٢٣). This is what KWT customers actually use online.

## Mobile-first responsive breakpoints

Tailwind defaults are fine; use them consistently.

| Token | Min width | Target devices |
|---|---|---|
| (default) | 0 | iPhone SE (375px), Android small |
| `sm` | 640px | Larger phones, small tablets portrait |
| `md` | 768px | Tablets, large phones landscape |
| `lg` | 1024px | Small laptops, iPad pro |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

> Design ALL pages mobile-first. Desktop is an enhancement, never the base.

## Layout grid

- Container max-width: 1280px.
- Container horizontal padding: 16px mobile, 24px tablet, 40px desktop.
- Section vertical rhythm: 48px mobile, 80px desktop between sections.
- Alternating image-text sections: even sections = image start / text end; odd sections = text start / image end. The default "start" in RTL is the right side.

## Components (build all of these, in this order)

### Atoms
- `Button` — variants: `primary | secondary | ghost | danger`; sizes `sm | md | lg`; supports leading/trailing icon; loading state.
- `Input` — variants: `default | error | success`; supports prefix/suffix (e.g., `+965`).
- `Badge` — variants: `default | success | danger | warning | accent`.
- `Icon` — wrapper around lucide-react that auto-mirrors directional icons in RTL.
- `Price` — formats KWD with proper RTL handling (e.g., `29 KWD`).
- `StarRating` — read-only stars + half-star + count.
- `CountdownTimer` — reusable, prop `seconds`, `onComplete`.
- `Tag` — for ingredient call-outs, country badges.
- `Skeleton` — for loading states.

### Molecules
- `ProductCard` — image, title, star rating, price, "اعرفي أكثر" CTA.
- `OfferCard` — selector row for 1/2/3 piece offers; has selected state.
- `BenefitItem` — icon + heading + 1-line description.
- `FAQItem` — accordion row.
- `TestimonialCard` — image, name, age, city, quote, stars.
- `TrustBar` — row of 4 USP icons + 1-line text.
- `CrossSellCard` — compact product mini-card with "+Add" button.
- `StickyCTA` — bottom-sticky bar (product page).
- `FormField` — wraps label + Input + helper/error text.

### Organisms
- `Header` — logo + nav + cart icon.
- `Footer` — three-column layout.
- `CartDrawer` — slide-in panel.
- `CheckoutModal` — overlay form.
- `UpsellModal` — countdown + offer.
- `HeroSection` — image + headline + sub + CTA.
- `ImageTextSection` — alternating image/text layout helper.
- `ReviewGrid` — testimonial cards + aggregate.
- `IngredientShowcase` — product page ingredients block.

### Templates
- `HomePageTemplate`
- `CollectionPageTemplate`
- `ProductPageTemplate`
- `AboutPageTemplate`
- `ContactPageTemplate`
- `ThankYouPageTemplate`
- `PolicyPageTemplate` (shipping, returns, privacy, terms)

## Component-level rules

- All components in `frontend/src/components/{atoms|molecules|organisms|templates}/<Name>/`.
- Each component has its own folder with `Component.tsx`, optional `Component.test.tsx`, optional sub-components.
- No prop drilling > 2 levels. Use context for cart, locale, analytics.
- No styled-components / emotion — Tailwind only. Use `clsx` for conditional classes.
- Server Components by default; mark `'use client'` only where interactivity demands.

## Iconography

- Lib: `lucide-react`.
- Default stroke width: 1.75.
- Default size: 20px in inline, 24px in feature contexts.
- Use these mappings:
  - COD = `Banknote`
  - Delivery truck = `Truck`
  - Guarantee = `ShieldCheck`
  - Star = `Star`
  - WhatsApp = custom SVG (lucide doesn't have brand icons) — placed in `frontend/src/components/icons/`
  - Cart = `ShoppingBag`
  - Close = `X`
  - Plus/Minus = `Plus` / `Minus`
  - Chevron = `ChevronDown` (auto-mirror in RTL)

## Imagery rules

- All images use `<Image>` from `next/image` with `sizes` set.
- Aspect ratios:
  - Hero: 4:5 on mobile, 16:9 on desktop.
  - Product card thumbnail: 1:1.
  - Product gallery image: 4:5.
  - Section image-text image: 4:5 on mobile, 4:3 on desktop.
- Image `alt` is **mandatory** and meaningful (Arabic).
- Placeholder strategy: `placeholder="blur"` with a generated tiny base64. Where no real photo exists, store a curated Unsplash export in `frontend/public/images/placeholders/` and note its source.

## Forms

- Labels always above inputs.
- Helper text below input in `text-sm text-ink-500`.
- Errors below input in `text-sm text-danger` with a small alert icon.
- Required indicator: red asterisk only if the field is truly required.
- Submit button full-width on mobile, auto-width on desktop.

## Motion

- Page transitions: none (instant). We optimize for perceived speed.
- Drawer/modal open: 200ms slide + fade with `var(--ease-out)`.
- Button hover: 150ms color transition.
- Cross-sell add-to-cart: 200ms scale-bump on the cart badge + tiny toast.
- Loading states: subtle pulse skeleton, never spinning wheels.

## A11y

- Color contrast ≥ 4.5:1 for text, ≥ 3:1 for large headings.
- Focus rings visible (use `focus-visible:ring-2 ring-brand-accent`).
- All interactive elements are keyboard reachable.
- Modal/drawer trap focus and return focus on close.
- Landmark roles on `header`, `main`, `footer`, `nav`.
- Form fields have associated `<label for>`.
- Images have meaningful `alt` (decorative ones use `alt=""`).

## Component states (must-have for each interactive)

For every interactive component, define and visually support:
1. Default
2. Hover
3. Pressed
4. Disabled
5. Loading
6. Focused (keyboard)
7. Selected (where applicable)

## Storybook?

**Skip for v1**. Build components straight into pages; add Storybook in v2 if we grow the design library.
