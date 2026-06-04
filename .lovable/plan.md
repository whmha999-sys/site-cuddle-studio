## Problem

The whole storefront currently lives at a single URL (`/`). Internally it tracks a `route` state object (`home`, `pdp`, `checkout`, `about`, etc.), so:

- The URL bar never changes when you open a product.
- Browser Back goes to whatever page came before the site (i.e. exits the site).
- Product pages can't be shared, bookmarked, or indexed by Google.

## Goal

Give each storefront screen a real URL, handled by React Router, while keeping the existing components and the `window.navigate(...)` calls scattered across the storefront working unchanged.

## URL map

| Screen        | URL                  |
|---------------|----------------------|
| Home          | `/`                  |
| Product (PDP) | `/product/:id`       |
| Checkout      | `/checkout`          |
| Info pages    | `/p/:slug` (slugs: `about`, `contact`, `warranty`, `service-centers`, `faq`, `dealer`, `privacy`, `terms`) |
| Admin (unchanged) | `/admin/...`     |
| Auth (unchanged)  | `/auth`          |

Back button behavior comes for free from `BrowserRouter`.

## Changes

1. **`src/App.tsx`** — add storefront sub-routes that all render `<Index />` (which renders `StorefrontApp`):
   - `/` , `/product/:id`, `/checkout`, `/p/:slug`
   - Keep `/auth`, `/admin/*`, and the `*` NotFound route as-is.

2. **`src/storefront/StorefrontApp.jsx`** — replace the internal `route` state with React Router:
   - Read current screen from `useLocation` + `useParams` instead of `useState`.
   - Rewrite the `navigate(page, params)` helper to call `useNavigate()` and map the old page names to URLs:
     - `home` → `/`
     - `pdp` → `/product/{params.id}`
     - `checkout` → `/checkout`
     - any info page key → `/p/{key}`
   - Keep exposing it on `window.navigate` so all existing callers in `home.jsx`, `pdp.jsx`, `chrome.jsx`, `checkout.jsx`, `promo.jsx`, `atoms.jsx` keep working with no edits.
   - Derive `currentProduct` from the `:id` URL param.
   - Keep `window.scrollTo(0, 0)` on navigation.

3. **SEO touch-up on PDP** — set `document.title` to the product name when on `/product/:id` so each product page has its own tab title (cheap win; full meta tags can come later if wanted).

## Out of scope

- No design changes.
- No changes to the admin panel, auth, cart drawer, or checkout logic.
- No new info pages — only the existing ones get URLs.
- Deep SEO (canonical tags, JSON-LD, sitemap entries per product) — can be a follow-up.

## Risk / notes

- The `window.navigate` shim keeps every existing call site working, so this is a low-risk refactor.
- `BrowserRouter` deep links work on Lovable hosting automatically — no `_redirects` or extra config needed.
- Old in-app links (e.g. footer links calling `navigate('about')`) will now land on `/p/about` and Back will return to where the user came from.
