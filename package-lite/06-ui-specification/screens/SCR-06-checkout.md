# SCR-06 — Checkout (`checkout_config.json`)

| Field | Value |
|---|---|
| Type | Page (inside SCR-16) |
| Roles | G |
| MoSCoW | Must |
| Functional area / epic | FD-05 / EP-05 (payment method choice: FD-06 / EP-06) |
| Rules, processes | BR-CHK (FD-05), BR-PRICE-05 – 10, BR-PRICE-13, BR-ORD-03, BR-DATA-06 – 08, PR-01, PR-03 |
| Prototype | [SCR-06-checkout.html](../../08-prototype/customer/SCR-06-checkout.html) |
| Stitch reference | desktop [`desktop/delivery-and-payment.jpg`](../../assets/stitch-reference/desktop/delivery-and-payment.jpg) · phone [`mobile/checkout-payment-mobile.jpg`](../../assets/stitch-reference/mobile/checkout-payment-mobile.jpg) |
| Images | `illustrations/map-sf-dark.jpg` (present) under the destination markers |

## 1. Purpose

Collect everything needed to place an order — delivery or pickup, address (with delivery-zone check) or store pickup, contact details, payment method and demo test card, tip — show the final totals and ETA, and place the order with `Execute Order --force`, which opens the simulated payment (SCR-07).

## 2. Entry and exit

| Entry | Exit |
|---|---|
| `PROCEED TO ./checkout.yml` (SCR-05); `./checkout.yml` (header); `EXECUTE ORDER` (SCR-02 Terminal Debugger) | `Execute Order --force` → SCR-07 (modal over this page) · `Edit manifest` → SCR-05 · shell navigation |

Guards: empty cart → SCR-02 with toast TXT-CHK-49.

## 3. Layout (desktop)

| Region | Content |
|---|---|
| R1 Heading | title, intro |
| R2 Left column (form, 58 %) | 1 method · 2 destination (delivery) or store card (pickup) · 3 contact · 4 payment · 5 tip (delivery) |
| R3 Right column (42 %, sticky) | map preview (delivery) · package manifest · totals · ETA · CTA · notice |

## 4. Elements

Prefill: contact and address fields empty, `CITY` "San Francisco", `STATE` "CA". Lite has no accounts, profiles or saved addresses. The method defaults to the last method chosen in this session, else DELIVERY. Payment method defaults to `CARD` with test card `VISA_4242`. Tip defaults to `FIFTEEN`. Entered values survive navigation to SCR-05 and back within the session.

| ID | Element | Type | Content / data source | Behavior | Validation / rules |
|---|---|---|---|---|---|
| E-01 | Heading | h1 + text | TXT-CHK-01, TXT-CHK-02 | | |
| E-02 | Method code line | code | TXT-CHK-03 | reflects E-03 | |
| E-03 | Method toggle | 2 radio cards with icons `local_shipping` / `store` | TXT-CHK-04, TXT-CHK-05 | switching recalculates fee, tax, tip, coupon state (delivery-only rule), ETA; shows E-05…E-08 for delivery or E-09 for pickup | required |
| E-05 | Address fields | inputs | TXT-CHK-09 … 14 | ZIP check (E-06) runs when `ZIP_CODE` has 5 digits | `ADDRESS_LINE_1` required ≤ 80; `ADDRESS_LINE_2` ≤ 80; `CITY` required ≤ 40; `STATE` required 2 capitals; `ZIP_CODE` required 5 digits; `DELIVERY_NOTES` ≤ 140 (counter shown from 100 characters) |
| E-06 | Zone check | inline result | OK: TXT-CHK-15; fail: TXT-CHK-16 with the button `Switch to pickup` (TXT-CHK-61); link TXT-CHK-17 | live against active `DeliveryZone`s; `Switch to pickup` selects PICKUP in E-03 (BR-CHK-06) | a failing ZIP blocks the CTA (TXT-CHK-47) |
| E-07 | Map preview | panel `color.surface.lowest`, header TXT-CHK-53 | `illustrations/map-sf-dark.jpg` with a store marker (logo dot, "Mission Kitchen") and, after a successful zone check, a destination marker and a straight dashed route line, distance label `{d} mi` | before a valid ZIP: TXT-CHK-54. Marker positions are fixed per ZIP (one position per zone, defined by the contractor so that a longer distance is farther from the store). | decorative; no zoom needed |
| E-08 | Tip | segmented control | TXT-CHK-31, options TXT-CHK-32, helper TXT-CHK-33 | amounts recalculate live (BR-PRICE-09) | delivery only; default 15 % |
| E-09 | Pickup store card | card | TXT-CHK-18, TXT-CHK-19 (values from `StoreSettings`), ready estimate TXT-CHK-42 second form | | pickup only |
| E-10 | Contact | inputs | TXT-CHK-20 … 23; hint TXT-CHK-57 under `CONTACT_EMAIL` | | `CONTACT_NAME` required 2–80; `CONTACT_EMAIL` required, email (TXT-VAL-05), ≤ 254; `CONTACT_PHONE` required, US 10 digits (TXT-VAL-06) — input accepts digits, spaces, `()`, `-`, `+1` and is shown formatted `(415) 555-0117` on blur |
| E-11 | Payment method | 3 radio cards | TXT-CHK-25 … 28 (icons `credit_card`, `account_balance_wallet`, `account_balance_wallet`) | | required (TXT-VAL-11) |
| E-12 | Test card | radio list | label TXT-CHK-29; five options TXT-STAT-24 each with outcome chip TXT-STAT-25 (`VISA_4242` APPROVES, `MASTERCARD_4444` APPROVES, `VISA_0002` DECLINED, `VISA_9995` INSUFFICIENT_FUNDS, `AMEX_0005` GATEWAY_TIMEOUT); helper TXT-CHK-30 | | shown only for CARD; required (TXT-VAL-12). **No card number, expiry or CVC field exists anywhere.** |
| E-13 | Package manifest | list | TXT-CHK-34; one row per cart line: `{qty}×` name, size + modifier summary (TXT-CART-39), line total; link TXT-CHK-35 | | |
| E-14 | Coupon line | helper | TXT-CHK-52 | state re-evaluated for the chosen method | coupon cannot be changed here (only via `Edit manifest`) |
| E-15 | Totals | label/value list | TXT-CHK-36 subtotal · TXT-CHK-37 discount (if > 0) · TXT-CHK-38 fee (delivery; `$3.99` or `FREE_DISPATCH`) · TXT-CHK-39 tax · TXT-CHK-40 tip (delivery) · TXT-CHK-41 total (`typography.priceLarge`, `color.primary.default`) | live with every change | BR-PRICE-05 – 10; worked examples A, B, D must reproduce exactly |
| E-16 | ETA | label | TXT-CHK-42 | recalculated every 5 s | order-lifecycle 7.3 (state PAYMENT_PENDING) |
| E-17 | CTA | primary button `bolt` icon, `glow.primaryMedium` | TXT-CHK-43; notice TXT-CHK-44 below | on press: client and server validation; errors → form error summary TXT-VAL-01 + inline errors, focus first; success → creates the order (T-01) with the current amounts and opens SCR-07 in processing state | disabled (with the reason shown under it) when: delivery below minimum TXT-CHK-46 · ZIP outside zone TXT-CHK-47 · unavailable lines TXT-CHK-48 · drinks-only TXT-CART-31 · more than 30 items TXT-CART-32. Pressing twice never creates two orders. |
| E-18 | Server-side rejections | toast | TXT-CHK-51 (items became unavailable), TXT-CHK-58 (prices changed; the summary refreshes, BR-CHK-16), TXT-CHK-60 (technical failure; nothing charged) | the page stays; the cart is unchanged | BR-ORD-03 |
| E-19 | Waiting-payment notice | notice (info) above the CTA | TXT-CHK-59 with link `Resume payment` (TXT-CHK-62) | link → SCR-09 of that order | shown while an order of this session is PAYMENT_PENDING or PAYMENT_FAILED (BR-CHK-19); informational, the CTA stays enabled |

## 5. States

| State | What is shown |
|---|---|
| Delivery | E-03 DELIVERY, E-05 – E-08, fee and tip rows |
| Pickup | E-09 instead of address, map and tip; no fee or tip rows; coupon delivery-only rule applies |
| First checkout of the session | E-05 and E-10 empty (except `CITY`, `STATE`); hint TXT-CHK-57 |
| Validation errors | summary TXT-VAL-01 at the top of R2, inline field errors (e.g. "ADDRESS_LINE_1 is required.") |
| Outside delivery zone | E-06 error, E-07 shows no destination marker, CTA disabled TXT-CHK-47 |
| Below delivery minimum | CTA disabled TXT-CHK-46; switching to pickup enables it |
| Empty cart | redirect to SCR-02 + TXT-CHK-49 |
| Submitting | CTA spinner, form read-only until SCR-07 opens |
| Prices changed | toast TXT-CHK-58, summary refreshed, no order created (BR-CHK-16) |
| Order waiting for payment | E-19 TXT-CHK-59 with `Resume payment` (BR-CHK-19) |
| Technical failure | toast TXT-CHK-60; nothing created or charged |
| Loading | skeleton for both columns |

## 6. Tablet and phone

Tablet: one column; summary and CTA after the form. Phone (Stitch `checkout-payment-mobile`): top bar (back, "Checkout"), map preview card with the destination chip, method toggle, `.env` fields styled as `export ADDRESS_LINE_1="…"` lines (label in code style above a normal input), payment protocol list, manifest summary, totals; sticky bottom bar with `EXEC_TOTAL` and `Execute Order --force`.

## 7. Stitch reference and deviations

- Desktop design has only the address block (`ADDRESS_LINE_1`, `CITY_ID`, `ZIP_CODE`, `NOTES`) and no contact, payment, tip or totals → complete per section 4. `CITY_ID` → `CITY`, `NOTES` → `DELIVERY_NOTES`, plus `ADDRESS_LINE_2` and `STATE` (address fields of `Order`, information model 5.1).
- Desktop map `LAT: 37.7749 N`, `SIGNAL STABLE`, `Recalculating ping... 24ms`, `ESTIMATED_ETA 24:00 MIN` → simulated map E-07 and computed ETA E-16 (compressed demo time, A-04).
- Phone design: `CLUSTER: EU-CENTRAL-WARSZAWA`, `BLIK_INSTANT_PAY` with six-digit token, `DEV_CREDIT_CARD VISA / MASTERCARD / STRIPE`, PLN amounts, `PIPELINE_TRANSIT_FEE 9.00 PLN` → payment methods CARD (demo test cards), APPLE_PAY, GOOGLE_PAY (A-06); USD; fees per BR-PRICE-07. No BLIK.
- Phone design's terminal block "Handshake with payment gateway: SUCCESS … ACKNOWLEDGE & TRACK RUNTIME" belongs to SCR-07/SCR-08, not to checkout.
- Kept: `checkout_config.json`, `const method = 'delivery'`, `.env` variables naming, `PAYMENT_PROTOCOL`, `PACKAGE_MANIFEST`, `SUBTOTAL_PAYLOAD`, `PIPELINE_TRANSIT_FEE`, `EXEC_TOTAL`, `Execute Order --force` with the line "Payment is simulated…" replacing "Proceeding will commit changes to local storage…".
