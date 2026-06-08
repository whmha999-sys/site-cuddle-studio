
## Dashboard improvements

### 1. Inline price + photo editing (no IDs / no code)
On the **Catalog** page (`src/pages/admin/Editor.tsx`), make each product card directly editable:
- Click the price → inline number input → save on blur/Enter → updates `products.price` → storefront refreshes (already uses the same `catalog` query, so it changes automatically on the main screen).
- Click the photo (or a small "Replace" button overlay) → file picker → uploads to storage and replaces the first image for the current color → main screen updates automatically.
- No need to open the drawer or touch the slug/ID.

### 2. Brand + Type columns in Recent Orders
In `src/pages/admin/Sales.tsx`, the Recent Orders table currently shows just an "Items" count. Add two new columns:
- **Brand** — derived per order from its items by looking up each item's product (`brand` field) and showing the unique brand(s), e.g. "Vikusha", "Teclast", or "Vikusha, Teclast".
- **Type** — same lookup using `category` (tablet / watch / accessory).

This requires fetching the product list once (already available via `useAllProducts`) and joining in memory by `item.id`.

### 3. Alive status with action button
Replace the static "pending" badge with:
- A green **"Mark as processed"** button when status is `pending`.
- Clicking it updates `orders.status` to `processed` in the DB and refreshes the list.
- Once processed, that row moves out of Recent Orders and into the new Processed section (see #4). Display a small green "Processed" badge there.

### 4. New "Processed orders" section
Add a second table directly below Recent Orders titled **Processed orders**, with the same columns. It lists orders where `status = 'processed'`, most recent first. Recent Orders becomes the queue of `pending` orders only.

### 5. Payment column: COD vs Pick from store
- Update the checkout flow (`src/storefront/checkout.jsx`) so the customer picks one of two payment methods: **Cash on Delivery** or **Pick up from store**. Stored as `payment_method = 'cod'` or `'pickup'`.
- In Sales dashboard, render the payment column as a clear label/badge: "Cash on Delivery" or "Pick from store" instead of the truncated "Cod".

### Technical notes
- All status updates use `supabase.from('orders').update({ status }).eq('id', …)`. Existing admin RLS policy on `orders` already allows admins to update.
- Adding the inline product edits reuses the existing `products` UPDATE path and storage bucket — no schema change needed.
- No DB migration required for any of these items; `orders.status` and `orders.payment_method` are already free-text columns.
- Brand/type lookup is purely client-side; no schema change.

### Out of scope
- No changes to authentication or user roles (already handled).
- No changes to product creation flow — the drawer editor stays as is for full edits.
