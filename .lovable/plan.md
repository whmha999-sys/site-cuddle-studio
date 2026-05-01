
## Lifestyle Banner Section

Add a cinematic, full-width lifestyle banner section to the homepage featuring the Vikusha watch "on the wrist" photo. It will have a premium, Apple-style feel with a tagline and a CTA button.

### What you'll get

- A full-bleed section with the lifestyle wrist photo as background
- Dark overlay for readability
- Tagline text (e.g. "Designed for every moment") with the Vikusha branding
- A "Shop V-70" CTA button linking to the watch product page
- Placed after the VikushaScroll section for natural flow
- Responsive: looks great on mobile and desktop
- Visibility toggle added to the admin Promos page (same pattern as Hero/Promo Banners)

### Technical details

1. **Copy the wrist photo** to `public/uploads/` for use on the site
2. **Add a `LifestyleBanner` component** in `src/storefront/home.jsx` — full-width section with:
   - Background image (object-fit cover)
   - Semi-transparent dark gradient overlay
   - Centered text block with brand name, tagline, and CTA
3. **Insert the section** in the Home component after `<VikushaScroll />` 
4. **Add visibility control**: Add `lifestyle_banner` key to the `section_visibility` table via migration, add a toggle in admin Promos page, and conditionally render based on `useSectionVisibility`
