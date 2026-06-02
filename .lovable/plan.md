## Goal
Replace the existing `src/storefront/checkout.jsx` `Checkout` component with the new card-based, multi-step design from your pasted component, stripped down to **Cash on Delivery only**.

## What will change
- **File:** `src/storefront/checkout.jsx`
  - Replace the `Checkout` component with the new layout (header with "Back to Cart", SSL badge, progress steps, card-based sections, sticky order summary).
  - Keep `CartDrawer` and `SuccessModal` exports untouched.
- **shadcn components used** (already in `src/components/ui/`): `button`, `card`, `badge`, `input`, `label`, `checkbox`, `select`. No new installs needed.
- **Icons:** lucide-react (already installed).

## What will be removed
- Card payment, Wallet, Bank transfer, mobile pay, "Same as shipping" — **only Cash on Delivery** kept as the single payment option.
- Skeleton loading state from the source (your data isn't async-loaded the same way).

## What will be preserved from current checkout
- Reading the real `cart` prop (no sample data).
- Real product lookup via `window.CATALOG` + `Silhouette` for item images (your products don't have URL images).
- Currency formatting via `<Price>` and `useCurrency()` — no hard-coded `$`.
- Supabase order insert into `orders` table + `notify-n8n` edge function call.
- `onComplete` callback that triggers the existing `SuccessModal`.
- Empty-cart fallback.
- Arabic/English labels (`lang` prop).

## What will be simplified (per your choice "drop in as-is")
The new design uses a simpler US-style address (first/last/email/phone/address/city/state/zip/country). I will:
- Replace the JO/SY/IQ governorate dropdown with the new design's **Country + State Select + free-text City + ZIP** layout.
- Drop the alt-phone, landmark, delivery-window selector, and driver notes fields.
- 3-step flow: **1) Shipping → 2) Payment (COD only, auto-selected) → 3) Review (terms checkbox + place order)**.

If you'd rather keep the JO/SY/IQ governorate logic and the extra fields inside the new visual shell, say so and I'll adjust before building.

## Tax / shipping / totals
The source computes 8% tax + tiered shipping. I will keep your existing formula instead: **10% tax, free shipping over 100, otherwise 3**, plus coupon codes `SL10` / `WELCOME` — so totals stay consistent with the rest of the site.

## Out of scope
- No DB changes.
- No changes to `CartDrawer`, `SuccessModal`, cart logic, or routing.
- No new dependencies.
