## V-70 Hero Promo — Vikusha Edition

Apply Option A (Limited Drop / urgency) but rebuilt in the Vikusha visual language taken from `vikusha-scroll.jsx`: white-on-amber palette (`#FFB800` accent, deep brown `#1a1200` ink), serif italic display + mono eyebrows, hairline rules, minimal geometry. Promotional, but quiet and premium — not loud sticker-style.

### Visual direction

```text
┌───────────────────────────────────────────────────────────┐
│ ◆ VIKUSHA V-70 · LIMITED DROP        [● LIVE]             │  ← mono eyebrow + pulsing dot
│                                                           │
│   Time.                                                   │
│   Reimagined.            ┌──────────────┐                 │
│   ─── 44px amber bar     │              │                 │
│                          │   [watch]    │                 │
│   1.43" AMOLED · NFC     │              │                 │
│   Heart rate · IP67      └──────────────┘                 │
│                                                           │
│   JOD 75  →  JOD 50      ┌─────────────────────┐          │
│   strike     bold         │ 02 : 14 : 33 : 09  │          │
│                           │ DAYS HRS MIN SEC   │          │
│                           └─────────────────────┘          │
│                                                           │
│   [ Claim Yours → ]   [ Explore Vikusha ]                 │
│                                                           │
│ ─────────────────────────────────────────────────────────  │
│ FREE SHIPPING · 1-YR WARRANTY · COD · SHIPS TODAY · ▸▸▸   │  ← mono marquee
└───────────────────────────────────────────────────────────┘
```

### Changes (V-70 slide only — other slides untouched)

1. **`src/storefront/home.jsx` — V-70 slide data**
   - Add promo fields: `promo: true`, `oldPrice: 75`, `endsAt` (48h from mount), `ribbon: 'LIMITED DROP'`
   - Keep mustard `#c49a00` background but layer a subtle amber→deeper-amber radial gradient on top for depth

2. **New component `VikushaPromoBadge`** (inline in home.jsx)
   - Mono eyebrow row: `◆ VIKUSHA V-70 · LIMITED DROP` + pulsing `●` dot in `#1a1200`
   - Style mirrors `vikusha-scroll.jsx` line 114 (mono, 10px, 0.2em letter-spacing, uppercase)

3. **Price treatment**
   - Old price `JOD 75` with strikethrough in muted brown `#1a120080`
   - New price `JOD 50` in serif italic, large, dark brown — matches the V-70 italic title style
   - Small "-33%" tag using a 1px hairline border (no fill), mono font — quiet, not a sticker

4. **Countdown timer**
   - 4 cells (DD : HH : MM : SS) with hairline borders, white-translucent background `rgba(255,255,255,0.12)`
   - Numbers in serif, labels in mono uppercase below
   - Live `setInterval(1000)` updating from `endsAt`
   - Cleans up on slide change/unmount

5. **CTAs**
   - Primary "Claim Yours →" — solid dark brown `#1a1200` bg, amber text, subtle shadow + hover-lift
   - Secondary "Explore Vikusha" — ghost (transparent + 1px hairline)

6. **Bottom marquee strip**
   - Thin band inside the slide, just above the dots indicator
   - Mono uppercase, 10px, 0.2em tracking — same type system as Vikusha section
   - Infinite horizontal scroll using existing animation pattern (CSS keyframe, ~30s loop, paused on hover)
   - Items: `FREE SHIPPING · 1-YR WARRANTY · COD AVAILABLE · SHIPS TODAY · ▸`

7. **Conditional rendering**
   - Existing hero renderer reads `slide.promo === true` → renders the new promo layout
   - Other two slides (VZ-80 PLUS, Teclast P50) keep current rendering — zero regression

### Animations (reuse existing keyframes)
- Eyebrow + pulsing dot: `pulse` (already in tailwind config)
- Countdown cells: `hero-fade-up` staggered 60ms (already defined in home.jsx line 66)
- Old price → new price: brief `scale-in` on mount
- Marquee: new keyframe `promo-marquee` (linear infinite translateX)

### Mobile (≤768px)
- Stack: eyebrow → title → price+countdown row (countdown shrinks to HH:MM:SS, drops days if <24h) → CTAs (full width)
- Marquee stays at bottom, smaller font (9px)
- Watch image scales down to fit alongside text per existing responsive rules

### Files touched
- `src/storefront/home.jsx` — V-70 slide data + promo render branch + countdown component + marquee
- `src/storefront/styles.css` — `@keyframes promo-marquee` + `.promo-marquee` class + mobile overrides

### Out of scope
- VZ-80 PLUS and Teclast P50 slides
- PDP page changes
- Backend/inventory wiring (countdown is visual only, configurable via `endsAt` constant)

Ready to build on approval.