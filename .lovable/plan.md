## Problem
The COD form lives in `src/storefront/checkout.jsx` (the `Checkout` component), but it was never wired into the app. The cart drawer in `src/storefront/StorefrontApp.jsx` only shows the line items and a green "Continue shopping" button — so the form never appears anywhere. That's why you can't see it.

## Fix
Replace the cart drawer's "Continue shopping" button with the actual checkout flow, so the COD form opens right where the button is today.

### Behavior
1. When the cart drawer opens and the cart has items, show a **"Proceed to Checkout"** button (orange, primary) instead of the green "Continue shopping" one.
2. Clicking it swaps the modal content to the full `Checkout` component (the COD form: country, governorate, area, address, landmark, primary/alt mobile, email, delivery window, notes, COD confirmation checkbox, totals, Place Order button).
3. A small "← Back to cart" link at the top of the form returns to the line-items view.
4. On successful order placement, the existing `SuccessModal` from `checkout.jsx` is shown, the cart is cleared, and the drawer closes.
5. If the cart is empty, keep a single "Continue shopping" button that just closes the drawer (no checkout to do).
6. The modal widens to ~720px when the form is showing so it has room to breathe; stays ~420px for the cart view.

### Files to change
- `src/storefront/StorefrontApp.jsx` — import `Checkout` and `SuccessModal` from `./checkout.jsx`, add a `view` state (`'cart' | 'checkout' | 'success'`) for the drawer, render `Checkout` when `view === 'checkout'`, wire `onComplete` to clear cart + show success, replace the bottom button.
- No changes to `checkout.jsx` (the form is already complete) or to styles.

No DB, no new dependencies.
