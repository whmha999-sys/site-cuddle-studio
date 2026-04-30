## Goal

Add a private admin area inside the existing project, accessible only to you and the manager, that lets you:

1. **Sales Dashboard** — see orders, revenue, units sold per product. Triggers n8n on new orders.
2. **Catalog Editor** — add / remove / edit products, prices, specs, colors, and product photos.
3. **Promo Manager** — upload / replace / reorder the promo banners shown on the storefront.

The storefront keeps working exactly as it does now, but reads its data from the database instead of `data.js`.

## Architecture (Option A — same project)

```text
Public storefront            Admin (login required, admin role only)
┌────────────────┐          ┌────────────────────────────────────┐
│  /             │          │  /admin            (Sales)         │
│  /product/:id  │  ──────▶ │  /admin/editor     (Catalog)       │
│  /checkout     │          │  /admin/promos     (Promo banners) │
└────────────────┘          └────────────────────────────────────┘
        │                                  │
        └────────► same Lovable Cloud DB ◀─┘
                          │
                          ▼
                   n8n webhook (orders)
```

## Step 1 — Enable Lovable Cloud

Turn on Lovable Cloud (Supabase under the hood). Gives us auth, database, storage, and edge functions.

## Step 2 — Database schema

Create these tables (with RLS):

- **`profiles`** — basic user info, auto-created on signup.
- **`user_roles`** — `(user_id, role)` where role is `admin` or `user`. Stored separately for security (never on profiles).
- **`products`** — id, brand, category, name, tagline, price, specs (jsonb), colors (text[]), hero (bool), active (bool), sort_order.
- **`product_images`** — product_id, color, url, sort_order. (One product → many images per color.)
- **`promos`** — id, image_url, title, link_url, active, sort_order, created_at.
- **`orders`** — id, customer info, items (jsonb), subtotal, tax, shipping, discount, total, payment_method, status, created_at.

**Storage buckets:**
- `product-images` (public read) — for product photos uploaded from the editor.
- `promos` (public read) — for promo banner uploads.

**Security definer function** `has_role(user_id, role)` to check admin status without RLS recursion.

**RLS rules in plain English:**
- Anyone can READ active products, product_images, promos.
- Only admins can INSERT/UPDATE/DELETE products, product_images, promos.
- Only admins can READ orders. Anyone can INSERT an order (checkout).
- Profiles + user_roles: users see their own; admins see all.

## Step 3 — Migrate `data.js` into the database

A one-time seed: I'll write a migration that inserts everything currently in `src/storefront/data.js` (CATALOG + PRODUCT_IMAGES) into `products` and `product_images`. After that, `data.js` is no longer the source of truth — the database is.

The storefront switches to fetching from the DB (with React Query, cached). The current `CATALOG` constant gets replaced by a `useProducts()` hook that returns the same shape, so existing components (`Home`, `PDP`, `PromoReel`, etc.) need almost no changes.

## Step 4 — Auth

- Add a `/auth` page (email + password). No public signup form — accounts are created by you in the Lovable Cloud Users panel.
- Create your account + the manager's account, then assign them both the `admin` role via a small SQL insert (I'll provide the exact step).
- Add a `useAuth()` hook + `<RequireAdmin>` route guard. Non-admins hitting `/admin/*` get redirected to `/auth`.
- Enable leaked-password protection (HIBP).

## Step 5 — Admin shell

New layout at `/admin/*`:
- Left sidebar: Sales · Catalog · Promos · Sign out
- Top bar: store name, logged-in user
- Same visual language as the storefront (reuses existing CSS + components) so the Catalog editor literally looks like the storefront with edit controls overlaid.

## Step 6 — Sales Dashboard (`/admin`)

- KPI cards: Today's revenue · Orders today · Units sold today · Total revenue (30d)
- Chart: revenue last 30 days (recharts)
- Table: top-selling products (units + revenue)
- Table: recent orders (clickable → order detail drawer with customer + items + status dropdown)
- Filter by date range

## Step 7 — Catalog Editor (`/admin/editor`)

- Grid of all products (same card style as storefront, with an "Edit" overlay).
- "Add product" button → form with all fields (brand, category, name, tagline, price, specs key/value pairs, colors, active toggle, hero toggle).
- Click a product → edit drawer:
  - Edit any field
  - Manage photos per color: drag-drop upload to `product-images` bucket, reorder, delete
  - Delete product (soft delete via `active=false` to preserve order history)

## Step 8 — Promo Manager (`/admin/promos`)

- Grid of current promo banners with thumbnail, title, active toggle, drag handle for reordering.
- "Upload new promo" button → file picker → uploads to `promos` bucket, creates a `promos` row.
- The storefront's promo section reads from `promos` table where `active = true`, ordered by `sort_order`.

## Step 9 — Connect orders to n8n

When a customer places an order on the storefront:
1. Insert row into `orders` table.
2. Edge function `notify-n8n` fires a POST to your n8n webhook URL with the order payload.
3. n8n handles whatever you want from there (WhatsApp confirmation, Google Sheets, courier dispatch, email, etc.).

The n8n webhook URL is stored as a secret (`N8N_ORDERS_WEBHOOK_URL`) — I'll request it after you confirm the plan.

## Files that will change / be created

**New:**
- `supabase/migrations/<timestamp>_admin_schema.sql` — tables, RLS, storage buckets, seed data
- `src/hooks/useAuth.tsx`, `src/hooks/useProducts.ts`, `src/hooks/usePromos.ts`, `src/hooks/useOrders.ts`
- `src/components/RequireAdmin.tsx`
- `src/pages/Auth.tsx`
- `src/pages/admin/AdminLayout.tsx`
- `src/pages/admin/Sales.tsx`
- `src/pages/admin/Editor.tsx`
- `src/pages/admin/Promos.tsx`
- `supabase/functions/notify-n8n/index.ts`

**Edited:**
- `src/App.tsx` — add `/auth`, `/admin`, `/admin/editor`, `/admin/promos` routes
- `src/storefront/StorefrontApp.jsx` — replace `CATALOG` import with `useProducts()` hook
- `src/storefront/promo.jsx` — read banners from `usePromos()` instead of hardcoded scenes (we keep the cinematic reel as a fallback when no promos uploaded)
- `src/storefront/checkout.jsx` — on submit, insert into `orders` + invoke `notify-n8n`
- `src/storefront/data.js` — keep `I18N` and `COLOR_SWATCH` only; remove `CATALOG` and `PRODUCT_IMAGES` (moved to DB)

## What I'll need from you

1. Approve this plan.
2. After Cloud is enabled, give me the **email addresses** for your account + the manager's account so I can pre-create them and assign admin role.
3. The **n8n webhook URL** for orders (you can get this from any "Webhook" trigger node in n8n). I'll add it as a secret when we get to Step 9.

## Suggested build order

To keep things shippable at every step, I'll build in this order:

1. Cloud + schema + seed `data.js` into DB (storefront unchanged, just reading from DB)
2. Auth + admin role + `/auth` page + admin shell
3. Catalog editor (highest daily value)
4. Promo manager
5. Orders table + storefront checkout writes to DB
6. Sales dashboard (charts + tables)
7. n8n webhook integration

Each step leaves the site fully working. Want me to proceed with **Step 1 + 2 + 3** (Cloud + schema + seed) first once you approve?