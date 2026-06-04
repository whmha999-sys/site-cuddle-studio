
## Goal

Add a high-impact, animated **Spatial Showcase** hero to the Teclast P50 product page, inspired by the Spatial Product Showcase component. Toggle between two meaningful states of the same tablet — **Display** and **Performance** — instead of left/right earbuds.

The existing PDP (title, price, qty, Add to Cart, Buy Now, gallery, description) stays untouched. The showcase sits above it as a cinematic intro section.

## What the user will see

- Full-width dark section at the top of the P50 PDP.
- Large tablet image floating over animated concentric rings and a colored gradient halo.
- Eyebrow label, big display headline, descriptive paragraph.
- Two animated metric bars relevant to the active state.
- A "View Specs" link that scrolls to the existing spec/description block.
- "Connected"-style status pill replaced with a real signal: battery % or screen refresh rate.
- A pill switcher with two options. Toggling animates image, gradient, glow color, text, and bars with the original's blur/spring transitions.

### Two states

**State 1 — العرض / Display**
- Eyebrow: "شاشة" / "Display"
- Title: "10.1″ 90Hz"
- Description: large IPS panel, 90Hz refresh, vivid color for streaming and reading.
- Bars: Refresh Rate 90Hz, Brightness ~400 nits.
- Accent: mint/teal (matches P50 mint color).
- Image: front-facing tablet shot (existing hero image).

**State 2 — الأداء / Performance**
- Eyebrow: "أداء" / "Performance"
- Title: "7000 mAh + LTE"
- Description: all-day battery, 4G LTE dual SIM, octa-core chipset.
- Bars: Battery 7000mAh (shown as 100%), LTE Signal.
- Accent: indigo/blue.
- Image: angled/back shot of the tablet.

## Technical approach

### Files
- **New:** `src/components/ui/spatial-product-showcase.tsx` — adapted component. Generic, data-driven, RTL-safe, uses semantic tokens where possible but keeps the dark cinematic surface as a self-contained section (acceptable for a hero showcase).
- **New:** `src/storefront/p50-showcase.jsx` — thin wrapper that feeds Teclast P50 data + translations into the component and renders it.
- **Edit:** `src/storefront/pdp.jsx` — mount `<P50Showcase />` at the top of the PDP only when the current product slug is the Teclast P50 (so we don't break other PDPs).
- **Assets:** reuse existing P50 images from `data.js` / current gallery for both states. If only one clean image exists, use the same image for both states with a different rotation/scale rather than generating new art (can upgrade later).

### Adaptations from the original
- Replace `ProductId = 'left' | 'right'` with `StateId = 'display' | 'performance'`.
- Replace hard-coded `isLeft` alignment with `dir`-aware logic: when `document.dir === 'rtl'` (or `lang === 'ar'`), mirror the alignment so the active visual sits on the correct side.
- Strip `'use client'` (Vite/React, not Next).
- Replace external ImageKit URLs with local product image URLs.
- Translate all UI strings; pull from the same `t`/`lang` pattern used elsewhere in `pdp.jsx`.
- Keep framer-motion (already installed). lucide-react already installed.
- Fix the broken/empty JSX in the pasted snippet (the original paste lost much of its markup) by rewriting sub-components cleanly: `BackgroundGradient`, `ProductVisual`, `ProductDetails`, `Switcher`, `EarbudShowcase` → `SpatialShowcase`.

### Layout
```text
┌───────────────────────────────────────────────┐
│  [breadcrumbs]                                │
│ ┌───────────────────────────────────────────┐ │
│ │  SPATIAL SHOWCASE (dark, full-bleed)      │ │
│ │  ┌─────────────┐   ┌──────────────────┐   │ │
│ │  │  visual     │   │ eyebrow          │   │ │
│ │  │  (image +   │   │ Big Title        │   │ │
│ │  │   rings)    │   │ description      │   │ │
│ │  │             │   │ [bar 1] [bar 2]  │   │ │
│ │  └─────────────┘   │ View Specs →     │   │ │
│ │           [ Display | Performance ]       │ │
│ └───────────────────────────────────────────┘ │
│                                               │
│  [existing PDP: title, price, qty, CTAs…]     │
│  [existing gallery / description / specs]     │
└───────────────────────────────────────────────┘
```

### Responsiveness
- Desktop: two columns (visual + content), switcher centered at bottom.
- Mobile: stacked — visual on top, content below, switcher sticky-feeling at bottom of section.

### RTL handling
- Use `flex-row` / `flex-row-reverse` based on `dir`.
- Mirror text-align with `text-start` / `text-end`.
- Mirror the bar fill origin (right-anchored in RTL).
- Animation `x` offsets flipped so entering content slides from the correct edge.

### Out of scope (this plan)
- Generating new product photography.
- Replacing the existing PDP buy box.
- Adding the showcase to other products (kept P50-specific for now; can be made data-driven later).

## Will it be cool?

Yes — with two caveats:
1. It only feels premium if the two states tell a real story. Display vs Performance does; recoloring the same tablet twice does not.
2. The dark cinematic surface is jarring if it sits next to a light buy box without a transition. The plan adds a soft gradient fade between the showcase and the rest of the PDP so it reads as one page, not two stitched screens.
