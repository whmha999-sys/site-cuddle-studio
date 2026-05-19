## Goal

Show prices in the visitor's local currency when they're in Syria (SYP) or Iraq (IQD). Everyone else keeps the default (JOD). Add a country/currency switcher in the top-right of the navigation bar so users can override the auto-detected country at any time.

## How it will work

**1. Currency configuration**

Add a single config file `src/storefront/currencies.js` with three currencies and exchange rates from the base currency (JOD):

```
JOD → base, symbol "JOD",  rate 1
SYP → symbol "ل.س",        rate 1 JOD ≈ 18,000 SYP   (editable)
IQD → symbol "د.ع",        rate 1 JOD ≈ 1,850 IQD    (editable)
```

You'll be able to update these rates in one place whenever the market changes. (Later we can move them to the dashboard if you want — for now a single file keeps it simple.)

**2. Auto-detect by IP**

On first page load, call a free geolocation API (`https://ipapi.co/json/`) once and cache the result in `localStorage`. If the returned country is `SY` → default to SYP, `IQ` → default to IQD, anything else → JOD.

**3. Manual switcher (top-right)**

Add a small currency/country selector to the right side of the top nav (next to the language button). Shows the current flag + currency code (e.g. 🇸🇾 SYP). Clicking opens a dropdown with three options:

- 🇯🇴 Jordan — JOD
- 🇸🇾 Syria — SYP
- 🇮🇶 Iraq — IQD

Selection is saved in `localStorage` and overrides auto-detection on future visits.

**4. Price formatting everywhere**

Create a `useCurrency()` hook and a `formatPrice(jodAmount)` helper that:
- Multiplies the base JOD price by the active rate
- Rounds appropriately (SYP/IQD have no decimals; large round numbers)
- Formats with the right symbol and locale (Arabic numerals stay Western digits to match the rest of the site)

Replace hardcoded `JOD` price rendering in:
- `home.jsx` (product cards)
- `pdp.jsx` (product detail price + qty totals)
- `cart.jsx` / `checkout.jsx` (line items, subtotal, shipping, total)
- Any promo/marketing copy that shows a price

**5. Checkout records local currency**

Add two columns to `public.orders`:
- `currency` (text, default `'JOD'`)
- `exchange_rate` (numeric, default `1`) — the rate used at the moment of purchase, so historical orders stay accurate even if rates change later

The existing `subtotal`, `tax`, `shipping`, `discount`, `total` are stored in the **local currency** the customer saw. The admin dashboard order view will show `total currency` (e.g. "270,000 SYP") alongside a small "(≈ 15 JOD)" reference.

## Files to add / change

- **Add** `src/storefront/currencies.js` — rates + currency definitions
- **Add** `src/storefront/currency-context.jsx` — React context, auto-detect, localStorage persistence, `useCurrency()` hook + `formatPrice()`
- **Add** `src/storefront/currency-switcher.jsx` — the top-right dropdown component
- **Edit** `src/storefront/StorefrontApp.jsx` — wrap app in `<CurrencyProvider>`
- **Edit** `src/storefront/chrome.jsx` — mount `<CurrencySwitcher />` in the top nav
- **Edit** `src/storefront/home.jsx`, `pdp.jsx`, `cart.jsx`, `checkout.jsx` — use `formatPrice()` instead of hardcoded `JOD`
- **Edit** order insert in `checkout.jsx` — write `currency` + `exchange_rate`
- **Edit** `src/pages/admin/Orders.tsx` (or equivalent) — display order currency
- **Migration** — add `currency` and `exchange_rate` columns to `orders`

## Notes / trade-offs

- **Rates are manual** — you'll edit `currencies.js` when SYP/IQD move. Live FX APIs for these currencies are unreliable; manual is more predictable.
- **No backend FX call** — country detection is a direct browser call to `ipapi.co` (free tier, ~1,000 req/day per IP; cached per visitor). If you ever exceed it, we can switch to a server-side edge function.
- **VPN users** will get whatever country their VPN reports — the manual switcher is their override.
- **Payment processing** is unchanged — orders are still recorded in your DB; this is a display + bookkeeping change, not a real payment-gateway integration.
