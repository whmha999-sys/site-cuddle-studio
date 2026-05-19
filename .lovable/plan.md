## Goal
Make Cash on Delivery the only payment method available at checkout. Remove Card and CliQ options for now.

## Changes

**`src/storefront/checkout.jsx`**
- Remove the Card and CliQ options from the `payment_opts` array — keep only `cod`.
- Remove the card details form block (`pay === 'card'` section with card holder, number, expiry, CVC).
- Hardcode `pay` state to `'cod'` (no need for selectable radio UI). Replace the "Payment" section with a simple read-only label: "Cash on Delivery" with the cash icon, so the user still sees what payment method applies to their order.
- Keep the `payment_method: 'cod'` value sent to the database so existing order records stay consistent.

## Notes
- No database/schema changes needed — the `orders.payment_method` column stays as-is and simply only ever receives `'cod'`.
- Easy to re-enable other methods later by restoring the options array.