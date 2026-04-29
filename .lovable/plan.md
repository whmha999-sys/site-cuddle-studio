# Fix mobile layout for the storefront

## Problem (visible in the screenshots)
On phone-width viewports, multiple sections still use desktop-only grids and fixed inline widths, which forces text into ultra-narrow columns:
- "We don't just sell devices..." stacks one word per line because the `WhyChooseUs` section is locked to a 2-column grid (`1fr 1px 1fr`).
- The footer and the perks strip stay multi-column even on phones.
- The "Meet the Teclast P50 / Vikusha V-70" hero scrollytelling scenes use absolute positioning sized for desktop, leaving the watch/tablet image floating off-canvas.
- The hero carousel keeps a fixed 300px tall 2-column layout, squeezing eyebrow + title + CTAs into ~150px wide.
- The header search input is forced to `width: 320px` and the nav row wraps awkwardly.

The single existing `@media (max-width: 700px)` block in `styles.css` only patches the header/hero/footer/page padding, so everything else inherits desktop layout.

## Approach
Add a real mobile breakpoint pass — keep the desktop look intact, but at `≤ 768px` collapse to single-column, allow text to flow, and shrink padding/typography. Most fixes go into `styles.css` plus a small set of inline-style overrides via new CSS classes on the worst offenders.

## Changes

### 1. `src/storefront/styles.css` — expand the mobile media block
Replace the current `@media (max-width: 700px)` block with a richer one at `≤ 768px`:
- `.header-inner` → single column, smaller padding, hide divider chips.
- `.nav-search` → full width, remove the inline 320px hard-coded width via a `.nav-search-wrap` class (added in chrome.jsx).
- `.hero` → already collapses; also reduce `.hero-title` font-size to ~28px, allow `height: auto`.
- `.grid` → 1 column at ≤480px, keep 2 columns 481–768px (already exists).
- `.pdp-title` → 32px on mobile.
- `.pdp-perks`, `.specs-grid`, `.checkout-layout`, `.footer-inner` → single column.
- New `.mobile-stack` utility: `display:block !important` to override grid columns inline.

### 2. `src/storefront/home.jsx`
Add a `mobile-stack` className to the inline-grid sections so the CSS media query can flatten them on phones:
- `WhyChooseUs` section (line ~181): give it `className="wcu-grid"`, move its 3-column grid into CSS so the mobile rule can switch to a single column and remove the 1px divider.
- `BrandStory` section (line ~337): give it `className="brand-story-grid"`, single column on mobile, hide the vertical dividers.
- `HeroSlide` (line ~377): add `className="hero-slide-inner"`; on mobile, switch to single column with the product image shown smaller below text, reduce left padding from 52px → 20px.
- `Hero` wrapper (line ~523): on mobile let `height` grow (`min-height: 360px`, `height: auto`).
- The bottom 3-perks strip (line ~727): give it `className="home-perks"`, single column on mobile.

### 3. `src/storefront/chrome.jsx`
- Replace the inline `width: 320` on `.nav-search` (line 46) with the existing `nav-search` class so mobile CSS controls width.
- Wrap nav + search in a flex container that wraps cleanly on small screens.
- Footer columns already use `.footer-inner` (CSS) — covered by step 1.

### 4. `src/storefront/pdp.jsx` (marketing strip + gallery)
- `.pdp` grid already collapses at 900px — leave that.
- Marketing strip images use `maxWidth: 900` which is fine; just make sure their containing section has horizontal padding on mobile so they don't bleed past the page (already fine since `.page` adds 20px padding ≤700px).
- Reduce `marginTop: 72` → `clamp(40px, 8vw, 72px)` between strip blocks so they breathe on phones.

### 5. Scroll scenes (`tablet-scroll.jsx`, `vikusha-scroll.jsx`, `teclast-scroll.jsx`)
These contain absolutely-positioned hero text + product images sized for desktop (visible in screenshots 3 and 4 — tablet floats off-screen, "Meet the Teclast P50" wraps awkwardly).
- Wrap each scene in a container with a CSS class (e.g. `.scroll-scene`).
- At `≤ 768px`: switch from absolute positioning to a vertical stack (text above, image below at `width: 90%`), reduce display-font-size to ~36px, and remove the rotated/offset transforms.
- Keep desktop behavior identical.

## Technical notes
- Single breakpoint at 768px is enough — the existing 800/900/1100px breakpoints handle tablet sizes already.
- All changes are CSS-driven where possible; inline styles only get a new `className` so we avoid touching JSX layout logic.
- No new dependencies, no design-token changes.

## Verification
After changes I'll open the preview at viewport 390×844 (iPhone) using the browser tool and screenshot:
- Home (hero, grid, WhyChooseUs, BrandStory, scroll scenes, footer)
- A PDP (e.g. V-70) to confirm the marketing strip + gallery stack cleanly.

If anything still wraps badly I'll iterate before reporting done.