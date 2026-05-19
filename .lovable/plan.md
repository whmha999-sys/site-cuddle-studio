## Remove the Hero carousel section entirely

The "Time. Reimagined." block is part of the rotating hero banner at the top of the home page. Remove the whole hero — both the storefront render and the dashboard controls for it.

### Changes

1. **`src/storefront/home.jsx`**
   - Remove the `{showHero && <Hero .../>}` render (line 1105) and the `showHero`/`visibility?.hero` line (1099).
   - Delete the now-unused `Hero`, `HeroSlide`, `getHeroSlides`, hero-anim keyframe injection, and the hero `INTERVAL` constant.

2. **`src/pages/admin/Promos.tsx`**
   - Remove the "Show Hero section" toggle row (lines 59–65) from `SectionsVisibilitySection`.
   - Remove the entire `HeroButtonsSection` component and its `<HeroButtonsSection />` render (line 223), plus the `HERO_SLIDES_META` constant and `HeroSetting` type.

No database changes. The home page will now start with the promo banners strip directly under the header.