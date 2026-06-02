## Changes to `src/storefront/checkout.jsx`

1. **Remove the State (الولاية) and ZIP (الرمز البريدي) fields** from the Shipping step — delete the grid row containing both `Select` (state) and `Input` (zip).
2. **Remove all placeholders** from remaining shipping inputs (first name, last name, email, phone, address, city) so they appear fully empty — no "John", "Doe", "n@example.com", "Main Street 123", "New York", etc.
3. Drop `state` and `zip` from the shipping state object and from the order payload sent to Supabase (map to empty string for `customer_zip` since the column is nullable).

No other logic, styling, or fields change.