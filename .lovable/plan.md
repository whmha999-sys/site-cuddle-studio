# Promo Hero — Cinematic Upgrade Plan

Right now the first slide (V-70 watch) is rich and editorial, but slides 2 and 3 (VZ-30 tablet, Teclast P50) are flat — just a title, price chip, and two buttons. On mobile, slide 1 works but feels cramped, and slides 2/3 look unfinished. Goal: make all three feel like one premium product showcase, and look gorgeous from 360px to 1920px.

## The vision

A unified "Editorial Drop" template every slide uses:

```text
DESKTOP (≥1024px)                          MOBILE (≤768px)
┌──────────────────────────────────┐       ┌──────────────────┐
│ ◆ EYEBROW · BRAND   [LIVE / NEW] │       │ ◆ EYEBROW [TAG]  │
│                                  │       │                  │
│ Big Title.                       │       │ Big Title.       │
│ italic accent.        [PRODUCT]  │       │ italic accent.   │
│ ────                             │       │ ────             │
│ Spec line · spec · spec          │       │ Spec · spec      │
│                                  │       │                  │
│ JOD 50  −33%   [00:23:44:48]     │       │  [PRODUCT IMG]   │
│ ▸ CLAIM YOURS    Explore →       │       │   (floating,     │
│                                  │       │    spotlit)      │
│ ░░ marquee · marquee · marquee ░ │       │                  │
└──────────────────────────────────┘       │ JOD 50  −33%     │
                                           │ ▸ CLAIM YOURS    │
                                           │   Explore →      │
                                           └──────────────────┘
```

Every slide gets the same signature treatment: tinted radial glow behind the product, soft floating animation, gradient italic title accent, mono eyebrow row, accent rule under the title, and a clear CTA pair.

## What changes

### 1. One promo template, three slides
Promote the existing `VkPromoSlide` design into a generic `PromoSlide` component that all three slides use. Each slide gets:

- **Status pill** — `LIVE` (V-70), `NEW DROP` (VZ-30), `BESTSELLER` (P50). Color follows slide accent.
- **Eyebrow row** — `◆ Brand · Model / TAG`
- **Gradient italic title** — accent gradient on the italic word for visual signature
- **Accent rule** — 48px glowing line under title
- **Spec line** — current `sub` text, mono caps
- **Price block** — old price (strike) + big italic gradient price + discount chip when applicable. VZ-30 and P50 get a "starting at" tag instead of a discount chip.
- **CTA pair** — primary gradient pill (shimmer on hover) + ghost outline button
- **Countdown** — only on slides flagged `promo: true` (V-70 stays the urgency slide)
- **Marquee strip** — only on slides flagged `promo: true`, sits at the bottom edge

### 2. Per-slide accent palette
Instead of every slide using the same orange, derive each slide's glow/gradient from its own accent so they feel distinct but consistent:

- V-70 — warm orange `#FF6B00` → `#ffaa55` (current)
- VZ-30 — copper-bronze `#C97B3D` → `#f0b577` against the deep navy `#0a1628`
- P50 — amber `#e86a1f` → `#ffb066` against the warm brown `#1a1208`

Keep all dark backgrounds; the accent does the talking.

### 3. Product image stage
Right now slide 1's product floats with a soft spotlight; slides 2 and 3 just have the orange arch shape from the source PNG. Apply the same stage to all:

- Soft circular radial spotlight in the slide accent
- Subtle drop shadow + accent glow filter
- 5.5s float loop
- Left-to-right fade overlay so the title side stays legible

For the tablet slides (VZ-30, P50) the PNGs already include an orange shape — we'll mute that shape with a low-opacity blend so it sits in the new stage instead of fighting it.

### 4. Mobile that actually feels designed
Current mobile is "stack it vertically and shrink fonts." Upgrade to a deliberate phone layout:

- **Order**: status pill → title → spec → product (centered, floating, ~240px tall) → price → CTAs
- **Product card**: rounded 16px tile with the radial spotlight, sits between text and price for visual rhythm — not banished to a tiny strip
- **Title**: `clamp(28px, 7.5vw, 38px)` so it breathes on 320px screens
- **Price**: `clamp(36px, 11vw, 52px)` italic gradient stays the hero number
- **CTAs**: full-width primary, ghost below it, both 44px tap targets
- **Countdown**: compact 4-cell row, smaller digits, still legible
- **Marquee**: keep but slow down to 60s and shrink to 9px

### 5. Carousel chrome polish
- **Dots**: replace current pill dots with thin progress bars that fill while a slide is active (so users feel autoplay timing).
- **Arrows**: hide on mobile (swipe only); on desktop make them subtle ghost circles that fade in on hover.
- **Swipe**: confirm touch swipe works on mobile; add it if missing.

### 6. Motion (subtle, not busy)
Reuse existing keyframes — no new heavy animations:
- Title slides in from left, image from right, with 80–140ms stagger
- Spotlight pulses very gently (8s loop, 0.95→1.05 opacity)
- LIVE dot keeps its pulse; remove pulse on non-promo slides
- Respect `prefers-reduced-motion`: disable float and pulse, keep fade-in

## Technical notes

- **Files**: `src/storefront/home.jsx` (refactor `VkPromoSlide` → generic `PromoSlide`, update `getHeroSlides` data with `accent`, `accentSoft`, `tag`, `tagKind` fields), `src/storefront/styles.css` (rewrite the two `@media (max-width: 768px)` promo blocks into one clean block; add `@media (max-width: 480px)` refinements).
- **No new deps.** All animation via existing keyframes in `home.jsx`.
- **Backwards compat**: keep `slide.promo` flag — only promo slides render countdown + marquee. Other slides render a "starting at" label in the same spot so the layout rhythm is identical.
- **Image handling**: add a `productBlend` option per slide (`normal` | `screen`) so the orange-arch tablets can blend into the dark stage cleanly without re-exporting PNGs.
- **A11y**: status pill gets `role="status"`, countdown gets `aria-label`, CTAs already buttons.
- **Perf**: marquee pauses on hover (already), pauses entirely on `prefers-reduced-motion`, image uses `loading="eager"` only for the first slide.

## Out of scope
- Changing product photography
- Adding a 4th slide
- Replacing the carousel library/logic itself
- Dark/light theming (promo stays dark by design)

After approval I'll implement, then verify at 1440px, 1024px, 768px, 414px, and 360px viewports.
