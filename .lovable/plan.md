# Plan: Orange footer + 8 info pages

## 1. Footer color → Teclast orange

In `src/storefront/styles.css`, change the `.footer` background from `var(--green-900)` (dark green) to a Teclast-style orange. Proposed palette:

- Background: `#e8590c` (Teclast vibrant orange)
- Body text: `#fff5ec` (warm cream, was `#c9d1cb`)
- Headings (`h5`): keep gold or switch to bright `#ffe8b3` for contrast
- Hover (`a:hover`): `#ffffff`
- About text + bottom-bar text: `rgba(255,255,255,0.85)` / `rgba(255,255,255,0.7)`
- Top divider in `.footer-bottom`: `rgba(255,255,255,0.2)`
- Stamp circle border + dashed inner ring: white / `rgba(255,255,255,0.6)` so the logo block reads on orange

No other components affected — only `.footer` rules in `styles.css`.

## 2. Eight info pages wired to footer links

The storefront uses internal route state (`route.name` in `src/storefront/StorefrontApp.jsx`), not React Router. New routes will be added the same way (no new files in `src/pages`).

New route names: `warranty`, `contact`, `service-centers`, `faq`, `about`, `dealer`, `privacy`, `terms`.

### Implementation

1. **Create `src/storefront/info-pages.jsx`** — one component per page, each rendered inside `<main className="page">` with consistent typography, a hero title, and bilingual EN/AR content. All eight exported from one file to keep things tidy.

2. **Wire routes in `StorefrontApp.jsx`** — extend the `route.name` switch in the `<main>` block to render the matching info page when the route is one of the 8 above; keep PDP and Home behavior unchanged.

3. **Update `chrome.jsx` Footer** — replace the placeholder `<a href="#">` links with `onClick` handlers calling `window.navigate('warranty')`, etc., for both EN and AR labels. Scroll to top on navigation.

### Page content (placeholder, editable later)

| Route | Title (EN / AR) | Content |
|---|---|---|
| warranty | Warranty / الضمان | 12-month manufacturer warranty, what's covered, how to claim |
| contact | Contact us / تواصل معنا | Phone, email, WhatsApp, Amman address, hours |
| service-centers | Service centers / مراكز الخدمة | List of Jordan service locations |
| faq | FAQ / الأسئلة الشائعة | 6–8 common Q&As (shipping, returns, warranty, payment) |
| about | About / من نحن | Company story, founded 2018, distributor for Vikusha + Teclast |
| dealer | Become a dealer / كن موزعاً | Short pitch + simple contact form (name/email/city/message) |
| privacy | Privacy / الخصوصية | Standard privacy notice |
| terms | Terms / الشروط | Standard terms of use |

Content is plain placeholder copy you can edit afterward — no backend wiring needed.

## Out of scope

- No CMS/admin editing of these pages (can be added later)
- No SEO meta routing (SPA still serves a single index)
- No URL changes — internal routes only, same as current `home`/`pdp` pattern
