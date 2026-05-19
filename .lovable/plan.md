## Goal
Make the checkout's delivery form a proper Cash-on-Delivery form so the courier has everything needed to reach the customer and collect payment. The form already exists — we'll strengthen it with the missing COD-critical fields, validation, and clearer copy.

## What's there today
`src/storefront/checkout.jsx` already collects: first name, last name, address, city, zip, mobile, email. Payment method is locked to COD.

## What's missing for a real COD order
The driver needs more than a street name to deliver and collect cash. We'll add:

1. **Country** — dropdown: Jordan / Syria / Iraq (auto-selected from the currency the customer is using, but editable).
2. **Governorate / City** — dropdown that switches based on country:
   - Jordan: Amman, Zarqa, Irbid, Aqaba, Madaba, Salt, Karak, Mafraq, Jerash, Ajloun, Tafilah, Ma'an
   - Syria: Damascus, Aleppo, Homs, Latakia, Hama, Tartus, Daraa, Deir ez-Zor, Raqqa, Hasakah, Sweida, Quneitra, Idlib
   - Iraq: Baghdad, Basra, Erbil, Mosul, Najaf, Karbala, Kirkuk, Sulaymaniyah, Duhok, Anbar, Babil, Diyala
   (Replaces the current free-text "City" field so addresses are consistent.)
3. **Area / Neighborhood** — free text (e.g. "Abdoun", "Mezzeh").
4. **Street address & building** — full street, building number, floor, apartment (replaces the single "address" field with one larger textarea labeled clearly).
5. **Nearest landmark** — short text, very useful for drivers in all three countries.
6. **Primary mobile** — already there. Add format hint per country.
7. **Alternate mobile** — optional, for when the primary doesn't answer (common COD pain point).
8. **Email** — already there, keep optional for order confirmation.
9. **Preferred delivery time** — radio: Anytime / Morning (9–12) / Afternoon (12–5) / Evening (5–9).
10. **Order notes for the driver** — optional textarea (gate code, "call before arriving", etc.).
11. **COD confirmation checkbox** — "I confirm I will pay the total amount in cash on delivery" (must be checked to enable the place-order button). Shows the total in the customer's local currency right next to it.

## Validation
- Use simple inline validation (no new library) — required fields show a red message under the input on blur/submit.
- Mobile: must be at least 8 digits, only digits/spaces/+/-.
- Email: standard email pattern, but optional.
- Length caps on every text input (name 60, area 80, street 200, landmark 120, notes 500) to keep the DB clean.
- The submit button stays disabled until: all required fields valid + COD checkbox checked.

## Persistence
The `orders` table already stores `customer_address`, `customer_city`, `customer_zip`. We'll:
- Put the **full structured address** (country + governorate + area + street + landmark + alt phone + delivery window + notes) into `customer_address` as a single readable multi-line string so the admin Orders view shows everything without a schema change.
- Use the governorate as `customer_city`.
- Leave `customer_zip` empty/optional (not meaningful in Syria/Iraq).
- No DB migration needed.

## Returning-customer toggle
The existing "Returning customer" auto-fill toggle stays, but the saved sample customer object is updated to include the new fields so it pre-fills cleanly.

## Files to change
- `src/storefront/checkout.jsx` — expand the delivery form, add validation state, add COD confirmation checkbox, update the order payload string-builder for `customer_address`.
- `src/storefront/styles.css` — small additions for inline error text and the delivery-time radio group (reuse existing `.field`, `.form-grid`, `.payment-opt` styles where possible).

No database changes. No new dependencies.