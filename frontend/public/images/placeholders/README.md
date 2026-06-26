# Placeholder images

This folder holds curated sample imagery used during the build phase. Replace
each file with a real product / lifestyle shot before launch.

| Slot | Filename | Suggested source |
|---|---|---|
| Home hero | `hero.jpg` | Unsplash query `kuwaiti woman skincare morning` |
| Product gummies (×4) | `gummies-{1..4}.jpg` | `nature bounty collagen bottle`, `gummies close up`, `lifestyle hand`, `lab shot` |
| Product shampoo (×4) | `shampoo-{1..4}.jpg` | `japanese sakura shampoo`, `foam in hand`, `hair after wash`, `sakura blossoms` |
| Product mask (×4) | `mask-{1..4}.jpg` | `overnight collagen mask jar`, `texture swatch`, `applied on face night`, `ingredient still life` |
| Testimonial avatars | `t-{1..8}.jpg` | Kuwaiti women lifestyle / vanity |
| Before/after | `ba-{1..3}-before.jpg`, `ba-{1..3}-after.jpg` | Skin / hair routine, real customers |

## How to swap

1. Drop the new file in this folder with the same filename.
2. Re-run `pnpm build`.
3. If the aspect ratio differs from what `next/image` expects, update the
   `sizes` prop in the consumer component.

Do **not** commit large originals — export to ≤ 1600px wide JPEG/WebP at
quality 80.
