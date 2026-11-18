# FD-05 — Checkout (deploy config)

| Item | Value |
|---|---|
| Epic | EP-05 (US-081 – US-100, TC-081 – TC-100) |
| Roles | Guest |
| Screens | SCR-06 Checkout (`checkout_config.json`); opens SCR-07 (FD-06) |
| Processes | PR-01 Guest ordering journey |
| Objects | `Cart`, `CartLine`, `Coupon`, `DeliveryZone`, `StoreSettings`, `Order` (created), `OrderLine`, `OrderLineModifier`, `PaymentAttempt` (created) |
| Rules referenced | BR-PRICE-05 – BR-PRICE-13, BR-ORD-03, BR-DATA-06 – BR-DATA-08, transition T-01 |
| Priority | Must |

Related: information model 5.1 (Order), 6 (prices), 7.3 and 7.8 (delivery zones) · order-lifecycle T-01, section 7.3 (ETA) · FD-04 · FD-06.

---

## 1. Purpose

Collect everything needed to place the order — delivery or pickup, address (delivery), contact details, tip (delivery), payment method and demo test card — show the final price breakdown, and create the order with **Execute Order --force**.

## 2. Actors

| Actor | Specifics |
|---|---|
| Guest | Types address and contact details for every order |
| Simulator | Creates simulated orders through the same rules without this screen (SIM-05; `10-simulations/`) |

## 3. Preconditions

- The viewer is a guest (every visitor is, LITE-SES-01).
- The cart has at least one line. Otherwise BR-CHK-01 redirects.

## 4. Behaviour

### 4.1 Page structure

Desktop: form column (left) and summary column (right, sticky). Phone: one column in this order, with a sticky bottom bar showing the total and `Execute Order --force`.

1. Title `checkout_config.json`, intro "Configure your deployment parameters, then execute the order." (TXT-CHK-02)
2. **Method**: `const method = 'delivery' | 'pickup';` shown as two large options `DELIVERY` (`local_shipping`) and `PICKUP` (`store`).
3. **Destination** (`Environment Variables (Destination)`), delivery only: the address form (BR-CHK-04), zone check result (BR-CHK-05), map preview (BR-CHK-22). Pickup: store block (BR-CHK-07).
4. **Contact** (`CONTACT_NAME`, `CONTACT_EMAIL`, `CONTACT_PHONE`) (BR-CHK-08).
5. **Courier tip**, delivery only (BR-CHK-09).
6. **Payment** `// PAYMENT_PROTOCOL` (BR-CHK-10).
7. **Summary** `// PACKAGE_MANIFEST` and `// COMPILE_SUMMARY`: lines, the coupon line (read-only), totals, ETA (BR-CHK-11, BR-CHK-12, BR-CHK-14).
8. **Execute**: `Execute Order --force` (accessible name "Place order and pay") with the note "Payment is simulated. No money is charged." (TXT-CHK-44)

### 4.2 Executing the order

1. The user presses `Execute Order --force`. The button is disabled and shows `executing…` until step 4 or 5 ends.
2. All fields are validated; errors are shown at once for every invalid field (FD-15, BR-ERR-05). If any field is invalid, stop: the page scrolls to the first error.
3. The server checks, in this order, and stops at the first failure: cart lines all available; at least one non-drink line; ≤ 30 items; delivery: ZIP in an active zone and subtotal ≥ $15.00 (BR-PRICE-13); payment method (and test card for CARD) chosen; recalculated total equals the total displayed (BR-CHK-16).
4. On success the server performs T-01 (order-lifecycle section 4): creates the `Order` with its snapshots and amounts, `OrderLine`s, `OrderLineModifier`s, `orderNumber`, `commitHash`, `trackingToken`, one `OrderStatusChange` (none → `PAYMENT_PENDING`, actor GUEST), the T-01 log lines, and `PaymentAttempt` #1 (PROCESSING) with the chosen method and card. SCR-07 opens in the processing state (FD-06). The cart is **not** cleared.
5. On failure no order is created and the message of section 8 is shown.

## 5. Business rules

| ID | Rule | Priority |
|---|---|---|
| BR-CHK-01 | Opening SCR-06 with an empty cart redirects to SCR-02 with the toast "MANIFEST.LOCK is empty. Import a module first." (TXT-CHK-49). With an unavailable line, a drinks-only cart or more than 30 items SCR-06 opens, but `Execute Order --force` is disabled with the reason under it: "Remove unavailable items from your manifest first." (TXT-CHK-48), TXT-CART-31 or TXT-CART-32 (SCR-06 E-17); the cart shows the details (BR-CART-19). | Must |
| BR-CHK-02 | The method starts with the cart's preview order type (BR-CART-22; DELIVERY for a new cart). Changing the method updates the preview type, the fee, tip, coupon state and totals at once; entered address data is kept when switching back and forth. | Must |
| BR-CHK-03 | Not used in Lite (saved addresses). The guest always types the address (BR-CHK-04). | — |
| BR-CHK-04 | **Address form** (delivery): `ADDRESS_LINE_1` (required, max 80), `ADDRESS_LINE_2` (optional, max 80, "Apt, floor, suite"), `CITY` (required, max 40, pre-filled `San Francisco`), `STATE` (required, 2 capital letters, pre-filled `CA`), `ZIP_CODE` (required, 5 digits), `DELIVERY_NOTES` (optional, max 140, "e.g. ring the call box #410"). Formats per BR-DATA-06; messages per FD-15. | Must |
| BR-CHK-05 | **Zone check.** As soon as `ZIP_CODE` holds 5 digits, the ZIP is checked against the active `DeliveryZone`s. In zone: green line `ZIP 94105 · Rincon Hill / Financial District · 2.8 mi`. The zone is decided by the ZIP only; city and state are not checked against it. | Must |
| BR-CHK-06 | **Outside the zone**: error under `ZIP_CODE`: "ZIP {zip} is outside our delivery zone. Choose pickup or another address." (TXT-CHK-16) with a button `Switch to pickup` (TXT-CHK-61). Execute is blocked while the method is DELIVERY with this ZIP ("Choose an address inside the delivery zone, or switch to pickup.", TXT-CHK-47). The list of served ZIPs is available behind the link `See delivery ZIP codes` (TXT-CHK-17; ZIP, neighborhood, distance). | Must |
| BR-CHK-07 | **Pickup** shows the store: `Git Pizza MxDev — Mission Kitchen`, `2140 Folsom Street, San Francisco, CA 94110`, `(415) 555-0142`, and "Show your commit hash at the counter." (TXT-CHK-56) No address, no tip, no delivery fee. | Must |
| BR-CHK-08 | **Contact**: `CONTACT_NAME` (required, 2–80), `CONTACT_EMAIL` (required, valid email, max 254), `CONTACT_PHONE` (required, US phone, BR-DATA-06). The fields start empty (or with the values kept in the session, BR-CHK-21), with the hint "We use your email only to let you look up this order. No emails are sent in this demo." (TXT-CHK-57) | Must |
| BR-CHK-09 | **Tip** (delivery only): four options `0%`, `10%`, `15%`, `20%`, each showing its amount per BR-PRICE-09 (e.g. `15% · $2.74`); default `15%`. Switching to pickup hides the tip and sets it to NONE; switching back restores the last delivery choice (initially 15 %). | Must |
| BR-CHK-10 | **Payment** (texts TXT-CHK-25 – TXT-CHK-30): methods `CARD` (TXT-CHK-26), `APPLE_PAY` (TXT-CHK-27), `GOOGLE_PAY` (TXT-CHK-28), all simulated (`PaymentMethod`). When `CARD` is selected, `TEST_CARD` (TXT-CHK-29) lists the five demo test cards by their `TestCard` caption (`Visa •••• 4242`, `Mastercard •••• 4444`, `Visa •••• 0002`, `Visa •••• 9995`, `Amex •••• 0005`), each with its outcome chip TXT-STAT-25 (`APPROVES`, `APPROVES`, `DECLINED`, `INSUFFICIENT_FUNDS`, `GATEWAY_TIMEOUT`), and the helper TXT-CHK-30. There is no card-number, expiry or CVC field anywhere. `CARD` with `Visa •••• 4242` is pre-selected (A-21). Apple Pay and Google Pay show the chip `APPROVES` (TXT-STAT-25). | Must |
| BR-CHK-11 | The coupon is shown read-only in the summary as "Coupon {CODE}: {state message}" (TXT-CHK-52). Its state is evaluated again (BR-PRICE-06, BR-CART-14 – BR-CART-16) for the method chosen here. Entering, removing or replacing a coupon happens only in the cart (SCR-05, link `Edit manifest`). | Must |
| BR-CHK-12 | **Summary** lists each line (quantity × name, size, modifiers in short form per TXT-CART-39, line total), then `SUBTOTAL_PAYLOAD` (TXT-CHK-36), the coupon discount `DISCOUNT ({CODE})` (TXT-CHK-37, if APPLIED), `PIPELINE_TRANSIT_FEE` (TXT-CHK-38, BR-PRICE-07; `FREE_DISPATCH` when waived by threshold or coupon; hidden for pickup), `SALES_TAX (8.625%)` (TXT-CHK-39, BR-PRICE-08), `COURIER_TIP ({p}%)` (TXT-CHK-40, delivery, BR-PRICE-09) and `EXEC_TOTAL` (TXT-CHK-41, BR-PRICE-10) in the large price style. All values update immediately on every change. Example A of the information model shows total $68.62; Example B $26.58; Example D $20.36. | Must |
| BR-CHK-13 | **Delivery minimum**: with DELIVERY and subtotal < $15.00 the summary shows "Delivery minimum is $15.00 (subtotal). Add ${X.XX} or switch to pickup." (TXT-CHK-46) and Execute is blocked (BR-PRICE-13). | Must |
| BR-CHK-14 | **ETA preview** (TXT-CHK-42): delivery — `ESTIMATED_ETA` · {mm:ss} · ~{HH:mm}; pickup — `READY_AT` · ~{HH:mm}. Calculated per order-lifecycle 7.3 as for a `PAYMENT_PENDING` order (delivery: plus `courierToStore` + `handover` + the trip for the selected zone), at the current speed factor, recalculated every 5 s (SCR-06 E-16). Without a valid in-zone ZIP the delivery ETA shows `--:--`. | Should |
| BR-CHK-15 | `Execute Order --force` performs 4.2. The server enforces every check of BR-ORD-03 even if the page is out of date. | Must |
| BR-CHK-16 | **Price drift.** If the recalculated total differs from the displayed total (prices are fixed in the Lite seed, but the server still checks it, e.g. after a demo reset while the page was open), no order is created, the summary is refreshed and the message "Prices changed since you opened checkout. Review the new total and execute again." (TXT-CHK-58) is shown. | Must |
| BR-CHK-18 | One click creates at most one order: the button is disabled from the click until the result; repeated clicks and double submits are ignored. | Must |
| BR-CHK-19 | If the guest has an order of this session in `PAYMENT_PENDING` or `PAYMENT_FAILED`, checkout shows the notice "Order {orderNumber} is waiting for payment. Resume it or cancel it before placing a new order." (TXT-CHK-59) with the link `Resume payment` (TXT-CHK-62, SCR-09 of that order). Execute is still allowed; a second order is a separate order. | Should |
| BR-CHK-20 | Not used in Lite (saving an address to a profile). | — |
| BR-CHK-21 | Entered checkout values (method, address fields, contact, tip, payment choice) are kept in the browser session when the user leaves checkout and comes back (e.g. to edit the cart), until the order is paid or the session ends. | Should |
| BR-CHK-22 | Delivery shows a small simulated map preview (`live_satellite_feed`): the map illustration `illustrations/map-sf-dark.jpg`, a store marker and, once the ZIP is in zone, a destination marker for that zone and a route line. No external map service is used. | Should |
| BR-CHK-23 | Not used in Lite (link to the login page). | — |
| BR-CHK-24 | Snapshot on T-01: contact, address (delivery), zone and distance, all amounts, tax rate, tip option, coupon (only if APPLIED; otherwise none), and every line with its modifiers are copied to the order (BR-PRICE-12, BR-DATA-03). For PICKUP, `tipOption = NONE`, `tipAmount = 0.00`, `deliveryFee = 0.00`. | Must |

> **Assumption A-21:** Checkout pre-selects Card with the test card `Visa •••• 4242` so that the happy path needs no extra clicks. The other cards demonstrate failures on purpose.

## 6. Data read and written

| Object | Read | Written |
|---|---|---|
| `Cart`, `CartLine`, `Coupon` | everything needed for the summary | preview order type (BR-CHK-02); coupon changes |
| `DeliveryZone` | active zones, distance | — |
| `StoreSettings` | fees, tax, limits | — |
| `SimulationSettings` | durations and speed factor for the ETA preview | — |
| `Order` | open unpaid orders of the guest session (BR-CHK-19) | created by T-01 |
| `OrderLine`, `OrderLineModifier` | — | created (snapshot) |
| `PaymentAttempt` | — | #1 created (PROCESSING) |
| `OrderStatusChange`, `OrderLogEntry` | — | created by T-01 |

## 7. States touched

Creates an order in `PAYMENT_PENDING` (T-01).

## 8. Errors and edge cases

| Case | Behaviour | Message |
|---|---|---|
| Required field empty | Inline error, Execute stops at step 2 | "ADDRESS_LINE_1 is required." (example of TXT-VAL-02) (pattern: "<FIELD> is required.") |
| ZIP `941` | Inline error | "ZIP_CODE must be 5 digits." (example of TXT-VAL-07) |
| ZIP `94121` (outside) | BR-CHK-06 | "ZIP 94121 is outside our delivery zone. Choose pickup or another address." (example of TXT-CHK-16) |
| Phone `555-0117` (7 digits) | Inline error | "CONTACT_PHONE must be a 10-digit US phone number." (example of TXT-VAL-06) |
| Email `jordan@` | Inline error | "CONTACT_EMAIL must be a valid email address." (example of TXT-VAL-05) |
| Delivery with subtotal $12.00 | Execute blocked | "Delivery minimum is $15.00 (subtotal). Add $3.00 or switch to pickup." (example of TXT-CHK-46) |
| Pickup with subtotal $4.50 (drink + nothing else) | Blocked by the drinks-only rule | "Add at least one pizza, side or dessert. Drinks-only orders can't be deployed." (TXT-CART-31) |
| An item sold out after the page loaded | No order; link to the cart | "Some modules became unavailable: {list}. Review your manifest." (TXT-CHK-51) |
| Price changed after the page loaded | BR-CHK-16 | "Prices changed since you opened checkout. Review the new total and execute again." (TXT-CHK-58) |
| Coupon became NOT_APPLIED (e.g. pickup with FREE_DISPATCH) | Order is still allowed; no coupon stored | coupon message under the field |
| Cart emptied in another tab | Execute → redirect to SCR-02 | "Your manifest is empty." |
| Server error during T-01 | No order or a fully created one, never half (transactional); SCR-41 not shown — inline error, the user may retry | "Could not execute the order. Nothing was charged. Please try again." (TXT-CHK-60) |

## 9. Notifications

- Inline zone check result, delivery minimum, coupon state, unpaid-order notice.
- On success: SCR-07 opens (FD-06). No email or SMS is sent.
