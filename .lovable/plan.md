# Add "Pay with Mada" (4 interest-free installments) to checkout

## What I understood
Mada is a "buy now, pay later" company in Jordan. The customer picks "Pay with Mada" at checkout, gets sent to Mada's own payment page, pays there in 4 installments, then comes back to our site. Mada then tells us the order is paid. Cash on Delivery stays as the other option.

## What you need to give me (from the Mada Merchant Portal)
1. **Merchant API Key**: the secret key from "API Tokens" > "Generate New Key" (in test mode the code is 666666). I will ask for it through a secure form. Never paste it in chat.
2. **Public Key**: from the "Other Keys" table on the same page. This one is safe to put in the site and shows the small "4 payments of X JOD" badge.
3. **Webhook Secret**: Mada uses it to sign "order paid" messages. I will give you the web address to paste into the Mada portal.
4. Confirm whether we **start in test mode (sandbox)** first. I recommend testing first, then switching to live keys.

## What the customer will see
- **Product page**: a Mada badge under the price, like "or 4 payments of 25.000 JOD". Clicking it opens Mada's info popup. It shows in Arabic or English to match the site.
- **Cart / checkout**: the badge above the checkout button, plus a new payment choice styled like your screenshots (Mada logo, "ادفع مع مدى / Pay with Mada", "ادفع على 4 دفعات، وبدون فوائد", and the "Don't have a Mada account?" note).
- When they choose Mada and press the order button, they go to Mada's page. Afterwards they come back to a success page or a "payment failed, try again" page.

## What you will see in the dashboard
- Orders show the payment method (Mada or Cash on Delivery) and a payment status: Pending, Paid, or Expired.
- An order counts as **Paid** only when Mada confirms it, as Mada's guide requires.

## Technical details
- DB: add `payment_status`, `mada_order_id`, `mada_reference`, `paid_at` to `orders`; `place_order` accepts `payment_method='mada'` and sets status `awaiting_payment`.
- Edge function `mada-create-order`: loads the order server-side, builds the payload (amounts with 3 decimals; items, buyer, shipping address, `reference_id` = order id), sends `X-Merchant-Api-Key` and the success/fail/cancel/edit callback URLs, then returns `redirect_url`. Mada only takes JOD, so we always send the base JOD price.
- Edge function `mada-webhook`: checks the signature with `MADA_WEBHOOK_SECRET`, skips repeated `deliveryId`s, and on `SUCCESS` marks the order paid. `EXPIRED` sets it to expired. `SETTLED` is ignored.
- Edge function `mada-verify`: the success page calls the Inquiry API (`GET /engine/merchant/orders/{id}/inquiry`) as a backup in case the webhook is late.
- Secrets: `MADA_MERCHANT_API_KEY`, `MADA_WEBHOOK_SECRET`, `MADA_ENV` (sandbox/live). The public key goes in the code.
- Widget: load the Mada CDN script on demand and use `MadaWidget.init` / `update` on the product page and cart. The `lang` setting follows the site language.
- Logos: the uploaded Mada logos are added as assets. New routes `/payment/success` and `/payment/failed`.
- Admin Sales: payment status badge and filter.
