# 02 — Brand Identity

## Brand name

- Arabic (primary): **النضارة**
- English (secondary, wordmark only): **Al Nadara**
- Meaning: "Al Nadara" = freshness / radiance / glow — directly evokes skin glow, hair shine, vitality. This is the brand promise in a single word.

## Brand essence (one sentence)

> النضارة هي نضارة بشرتچ، شعرچ، وثقتچ — مدعومة بمكونات يابانية وأمريكية معتمدة، يوصلوچ لباب بيتچ، وتدفعين بس عند الاستلام.
> *(Al Nadara is the glow of your skin, your hair, and your confidence — backed by certified Japanese and American ingredients, delivered to your door, paid only on receipt.)*

## Brand pillars

1. **Authority** — Globally trusted ingredient sources (Nature's Bounty USA, Japanese sakura formulations), dermatologist language, lab-backed claims.
2. **Beauty rooted in care** — We don't sell products, we sell visible self-care rituals: morning, evening, weekly.
3. **No-risk** — COD, free delivery thresholds, satisfaction language, "تدفعين بس لما توصل / pay only on arrival."
4. **For her, by people who understand her** — Kuwaiti dialect, women-first imagery, locally relevant cultural cues (rituals, gatherings, weddings, summer heat, hijab-friendly hair care).
5. **Premium without intimidation** — Feels luxe but speaks human. Not clinical-cold, not Instagram-influencer-cringe.

## Logo

### Concept
- **Mark** = a circle containing the letter **ن** (the first letter of النضارة) in the brand's primary color. The mark is balanced, simple, embossable on packaging.
- **Wordmark** = stacked, left-of-mark in LTR English contexts, right-of-mark in RTL Arabic contexts:
  - Top line: **النضارة** (large, primary Arabic display font)
  - Bottom line: **Al Nadara** (smaller, refined Latin serif/sans)

### Layout rules
- Mark always sits **inside a perfect circle** with the brand primary color as fill, white ن inside.
- Min size: mark ≥ 32px in headers; never smaller than 24px on mobile.
- Clear space around logo = 1× the diameter of the circle mark.
- Never tilt, recolor outside the palette, or add gradients to the logo.

### Header rendering (per spec)

On every page, the header right side (RTL) shows:

```
[ ن ]  النضارة
       Al Nadara
```

Where `[ ن ]` is the circle mark and the two-line wordmark sits next to it. On a mobile screen ≤640px, the English line can collapse and only show the Arabic.

## Color palette

A warm, modern, slightly clinical-but-feminine palette that signals premium beauty without going generic-pink.

### Primary

| Token | Hex | Use |
|---|---|---|
| `--brand-primary` | `#7A3E2E` | Logo circle, primary CTAs, headers, brand seals. A deep warm terracotta / cocoa — evokes oud, dates, luxury Arabian palettes, while being warm against skin tones. |
| `--brand-primary-hover` | `#5E2F23` | Hover/pressed state for primary buttons |

### Accent

| Token | Hex | Use |
|---|---|---|
| `--brand-accent` | `#D9A65E` | Gold for "Bestseller" / "Most Popular" badges, ratings stars, decorative dividers |
| `--brand-cream` | `#F7F1E8` | Section backgrounds (warm), card backgrounds for hero |
| `--brand-rose` | `#E9C6BB` | Soft secondary surface for "trust" panels, badges |

### Neutrals

| Token | Hex | Use |
|---|---|---|
| `--ink-900` | `#1A1A1A` | Body text |
| `--ink-700` | `#3F3F3F` | Headings |
| `--ink-500` | `#737373` | Muted/secondary text |
| `--ink-300` | `#D4D4D4` | Borders, dividers |
| `--bg` | `#FFFFFF` | Default page background |
| `--surface` | `#FAFAF8` | Subtle surface for cards |

### Semantic

| Token | Hex | Use |
|---|---|---|
| `--success` | `#2E7D32` | Stock indicators, success badges |
| `--danger` | `#C62828` | Low-stock urgency, errors |
| `--warning` | `#ED6C02` | Scarcity countdowns |

> Defined as CSS variables in `frontend/src/app/globals.css` AND as Tailwind theme tokens in `tailwind.config.ts` so both can be used interchangeably.

## Typography

### Arabic (primary)
- **Display / headings**: **`Tajawal`** (700, 800) — modern, clean, premium Arabic geometric sans. Excellent rendering on web.
- **Body**: **`Tajawal`** (400, 500) — keeps brand visually unified.

Fallback: `"Tajawal", "Cairo", "Helvetica Neue", system-ui, sans-serif`

### Latin (wordmark + numerals)
- **Display (wordmark only)**: **`Cormorant Garamond`** (600 italic) — refined, slightly editorial, signals "premium beauty brand."
- **UI Latin (prices, numerals, English buttons)**: **`Inter`** (500, 600).

### Type scale (mobile-first; desktop scales ~1.15×)

| Token | Size (mobile) | Line-height | Use |
|---|---|---|---|
| `--text-display` | 40px | 1.15 | Hero headline |
| `--text-h1` | 30px | 1.2 | Section H1 |
| `--text-h2` | 24px | 1.25 | Section H2 |
| `--text-h3` | 20px | 1.3 | Card titles |
| `--text-lg` | 18px | 1.5 | Lead paragraph |
| `--text-base` | 16px | 1.6 | Body |
| `--text-sm` | 14px | 1.5 | Captions, badges |
| `--text-xs` | 12px | 1.4 | Footer fine print |

> Load fonts via `next/font` with `display: 'swap'` and `subsets: ['arabic', 'latin']`. Preload the bold weights used above the fold.

## Iconography
- Use **`lucide-react`** for all icons. Stroke weight 1.5–2.
- Color: inherit text color by default; only use brand-primary for active states.
- No emojis in production UI.

## Imagery direction
- **Subjects**: Kuwaiti / Khaleeji women, ages 22–45, natural makeup, hijab-friendly framings (mix of with/without hijab), home settings (bedroom vanity, bathroom mirror, gathering), warm natural light.
- **Mood**: Aspirational but believable. NOT studio-perfect influencer content. Think "she could be your cousin who has great skin."
- **Product photography**: Top-down on a cream/marble surface with rose petals or wooden accents. Side-by-side product + ingredient (e.g., shampoo bottle + sakura blossoms).
- **No stock-photo cliches**: no white-background "perfect skin western model," no overly retouched hands.
- **Placeholder images during dev**: use Unsplash queries (`unsplash:beauty-routine`, `unsplash:hair-care-asian`, `unsplash:collagen-skincare`) and store them in `frontend/public/images/placeholders/`. README must explain how to swap them.

## Voice & tone (one-line summary; full guide in `07-copywriting-and-dialect.md`)

- **Warm but authoritative**. We're not a friend — we're the older sister who happens to be a beauty pharmacist.
- **Kuwaiti dialect** (not MSA, not Egyptian, not Levantine). Examples: `بشرتچ` (not `بشرتك`), `وايد` (not `كثير`), `زين` (not `جيد`), `چم` (not `كم`).
- **Specific, not generic**. "نتايج بأول 14 يوم" beats "نتايج سريعة."
- **Proof inline**. Every claim is followed by a ingredient name, a stat, or a source.

## Brand do / don't

| Do | Don't |
|---|---|
| Use Arabic-first everything | Mix MSA + Kuwaiti randomly |
| Call out specific ingredients by name | Make vague "natural" claims |
| Show real women's hands, hair, skin | Use airbrushed western model photography |
| Use the terracotta + cream palette | Add unrelated colors (no pink, no neon) |
| Quote numbers ("بنسبة 87%") | Use empty superlatives ("الأفضل في العالم") |
| Show COD + delivery icons everywhere | Hide payment/shipping until checkout |
