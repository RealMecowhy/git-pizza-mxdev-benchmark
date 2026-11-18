# FD-07 — Order tracking (deployment status)

| Item | Value |
|---|---|
| Epic | EP-07 (US-121 – US-140, TC-121 – TC-140) |
| Roles | Guest (orders of the session, tracking link or lookup) |
| Screens | SCR-09 Order tracking (`DEPLOYMENT_STATUS`), SCR-10 Track order lookup (`git log --grep`) |
| Processes | PR-02 Order lifecycle, PR-05 Dispatch and delivery, PR-06 Pickup, PR-07 Cancellation and refund |
| Simulations | SIM-02, SIM-04, SIM-06, SIM-07 (live logs), SIM-09 |
| Objects | `Order`, `OrderLine`, `OrderLineModifier`, `OrderStatusChange`, `OrderLogEntry`, `PaymentAttempt`, `Courier`, `Oven`, `DeliveryZone`, `SimulationSettings` |
| Rules referenced | BR-ORD-08, BR-ORD-10, BR-ORD-20, BR-ORD-21, order-lifecycle sections 2.1, 5, 6, 7.3 |
| Priority | Must |

Related: [order-lifecycle.md](../05-processes/order-lifecycle.md) · FD-06 (payment banner actions) · FD-09 (receipt).

---

## 1. Purpose

Show the guest, live and without reloading, where their order is: a five-stage pipeline with queue position and bake progress, a terminal-style log, an ETA countdown, a simulated map with the courier for deliveries, and the order summary. Let the guest cancel ("roll back") while the order is still queued, and find an order by order number and email.

## 2. Actors and access

| Actor | Access to SCR-09 of an order |
|---|---|
| Guest | (a) with the tracking link containing the order's `trackingToken`, in any browser; (b) any order placed in the current browser session; (c) any order found with SCR-10 in the current browser session (A-23, LITE-SES-03) |

Anyone else who opens an order URL without a valid tracking token gets SCR-40 (navigation-map section 6); the page never reveals whether an order number exists. A tracking link with an unknown, altered or outdated token (for example after a demo reset) shows the invalid-link state of SCR-09 (BR-TRK-21).

## 3. Preconditions

The order exists (not removed by demo reset or housekeeping) and the viewer has access (section 2).

## 4. Behaviour

### 4.1 SCR-09 layout

1. **Header**: `DEPLOYMENT_STATUS`, order number `MX-1048`, commit hash `#a3f9c2e` (copy action), placed date and time, order type (`method: 'delivery'` / `'pickup'`), status badge with dev and plain label (e.g. `BAKING` · In the oven).
2. **Banner** for payment states and final states (BR-TRK-05, BR-TRK-14, BR-TRK-15).
3. **Pipeline stepper** (5 stages, BR-TRK-04) with the progress of the current stage.
4. **ETA panel**: `ESTIMATED_ETA` countdown and clock; delivery while on the way also `DISTANCE_REMAINING` (BR-TRK-07).
5. **Live log** `bash — track.log` (BR-TRK-08).
6. **Delivery**: simulated map and courier card (BR-TRK-09, BR-TRK-10). **Pickup**: pickup card (BR-TRK-11).
7. **Order summary** `Order Configuration` (BR-TRK-12) with `View receipt` (SCR-13).
8. **Actions**: `Rollback order` (BR-TRK-13).

Desktop: stepper across the top, log and map side by side, summary in a right column. Phone: stacked in the order above, with the ETA panel directly under the stepper.

### 4.2 Lookup (SCR-10)

1. Page title `git log --grep` (TXT-TRK-48), fields `ORDER_NUMBER` (TXT-TRK-50, placeholder "MX-1048") and `CONTACT_EMAIL` (TXT-TRK-51), button `FIND DEPLOYMENT` (TXT-TRK-52, accessible name "Find order").
2. The order number is accepted as `MX-1048`, `mx-1048` or `1048` (spaces trimmed). The email is compared case-insensitively with `Order.contactEmail`.
3. Match → the order is added to the session's accessible orders and SCR-09 opens. Only orders with `source = GUEST` can be found (guest orders and the seed orders of the demo contact); simulated orders are never shown to guests (LITE-SEC-02).
4. No match → BR-TRK-19.

## 5. Business rules

| ID | Rule | Priority |
|---|---|---|
| BR-TRK-01 | Access to an order's SCR-09 and SCR-13 follows section 2. A guest session sees only orders of 2 (a)–(c); simulated orders are never shown (LITE-SEC-02, LITE-SEC-05). | Must |
| BR-TRK-02 | The **tracking link** is a stable URL that contains the order's `trackingToken` (32 random URL-safe characters) and no personal data. It works in any browser, also in a new session, until the order is deleted by demo reset (or housekeeping for simulated orders). | Must |
| BR-TRK-03 | The header follows 4.1 step 1. The status badge uses the dev label, plain label and color of order-lifecycle section 2. | Must |
| BR-TRK-04 | The stepper shows the 5 stages of order-lifecycle 2.1 for the order type. Reached stages are marked done (check icon), the current stage is highlighted with its status color and glow, later stages are dim. Stage 4 of a delivery shows the sub-label "Waiting for courier" (READY_FOR_DISPATCH) or "Courier on the way" (OUT_FOR_DELIVERY). PAYMENT_PENDING and PAYMENT_FAILED show no stage reached. CANCELLED freezes the stepper at the last reached stage. | Must |
| BR-TRK-05 | **Payment banner**: PAYMENT_PENDING — "Processing payment…" with the attempt number; PAYMENT_FAILED — the failure text of BR-PAY-08 with `Retry payment` (opens SCR-07 with the method selector) and `Cancel order` (BR-PAY-10), plus "This order will be rolled back automatically at {HH:mm} if not paid." (TXT-TRK-63) (time of T-07). | Must |
| BR-TRK-06 | While BAKING, stage 2 shows "Baking in {ovenName} · {p}%" (TXT-TRK-09; e.g. `Baking in OVEN_01::CORE · 50%`), p = elapsed bake time / effective `bake` duration × 100, rounded down, maximum 100; at 100 % the second form "Coming out of the oven". While QUEUED it shows "Waiting for a free oven slot · position {n} in the queue" (TXT-TRK-08; n per SIM-02 BR-SIM-16c: all queued orders, including simulated ones, in the queue order of BR-ORD-11); bake progress per SIM-02 BR-SIM-16b. | Must |
| BR-TRK-07 | **ETA** (delivery) is shown as `ESTIMATED_ETA` · {mm:ss} · ~{HH:mm} (TXT-TRK-29) from `estimatedCompletionAt` (order-lifecycle 7.3), recalculated at least every 5 s; the countdown ticks every second. It never shows a negative value: at 00:00 it shows `ESTIMATED_ETA` · Any moment now (TXT-TRK-66). Pickup shows `READY_AT` · ~{HH:mm} (TXT-TRK-31) until ready, then the caption "Ready at the counter: 2140 Folsom Street" (TXT-TRK-13). While OUT_FOR_DELIVERY, `DISTANCE_REMAINING` · {d} mi (TXT-TRK-30) is shown (order-lifecycle 7.3). Final states show no ETA; the completion time is in the banner (TXT-TRK-21, TXT-TRK-22). | Must |
| BR-TRK-08 | The live log shows only `OrderLogEntry` lines with `isCustomerVisible = true`, oldest first, formatted `[HH:mm:ss] [TAG] message`, colored by level (`tokens.md` 1.7). New lines appear at the bottom within 5 s; the log scrolls to the newest line unless the user has scrolled up (then a `▼ new lines` button appears). | Must |
| BR-TRK-09 | **Simulated map** (delivery only): the map illustration `illustrations/map-sf-dark.jpg`, a store marker, a destination marker at the position of the order's delivery zone, and the route between them (`color.info.default`). Marker labels follow TXT-TRK-27. The courier marker appears only from OUT_FOR_DELIVERY (SIM-04): at `routeProgressPercent` along the route, moving smoothly between updates (or jumping with reduced motion), and at the destination once DELIVERED. Before OUT_FOR_DELIVERY the map shows the helper "The live map starts when the courier picks up your order." (TXT-TRK-28). A `LIVE` dot shows while OUT_FOR_DELIVERY. Zoom buttons are not required. No external map service is used. | Must |
| BR-TRK-10 | **Courier card** (delivery, once assigned): `nodeHandle` (e.g. `Marek // Moto-v3`), name, vehicle type with its vehicle icon (Lite has no courier avatars); the card reads TXT-TRK-32 (`COURIER` · {nodeHandle} · {name}, {vehicle}); status as the plain label of TXT-STAT-27: "On the way to the store" (TO_STORE), "At the store" (AT_STORE), "Delivering" (DELIVERING). No phone number, call or chat (out of scope). | Must |
| BR-TRK-11 | **Pickup card**: store name, address and phone (TXT-CHK-18, TXT-CHK-19); `READY_AT` · ~{HH:mm} (TXT-TRK-31) until ready; while READY_FOR_PICKUP the caption "Ready at the counter: 2140 Folsom Street" (TXT-TRK-13) and "Show your commit hash #{hash} at the counter." (TXT-TRK-62); after pickup the banner TXT-TRK-22 (`PULLED //` Picked up at {HH:mm}. Enjoy your build!). | Must |
| BR-TRK-12 | **Order summary**: each line with quantity, name, size, modifiers (non-default crust, sauce, cheese; `+` extras; `−` removals) and line total; subtotal, discount with coupon code, delivery fee, tax, tip, total; payment method (label of the method or test card, e.g. `Visa •••• 4242`) and payment status (`PAID`, `UNPAID`, `REFUNDED`); the delivery address (delivery) or the store address (pickup). Values come from the order snapshot. | Must |
| BR-TRK-13 | **Rollback.** `Rollback order` (accessible name "Cancel order") is enabled only in QUEUED. Click → confirmation dialog TXT-TRK-37 (Title: "Rollback order {orderNumber}?" · Body: "Your order hasn't gone into the oven yet. You'll get a full refund of {total} to {method} (simulated)." · Buttons: `Rollback order` / `Keep order`); `Rollback order` is the destructive button. Confirm → T-09. In BAKING, QA_CHECK, READY_* and OUT_FOR_DELIVERY the button is disabled and shows the BR-ORD-08 message (`ROLLBACK REJECTED — your order is already in the oven.` / `…already packed.` / `…already on its way.`). In PAYMENT_FAILED cancelling is offered by the payment banner (BR-TRK-05). In final states the button is hidden. | Must |
| BR-TRK-14 | **Cancelled orders** show the `ROLLED_BACK` banner with the order-lifecycle section 5 wording: "This order was rolled back." plus "You cancelled it." (GUEST), "The store cancelled it. Reason: <reason>" (MANAGER; only seed orders, as Lite has no manager), or "Payment was not completed." (SYSTEM); and, if refunded, "Refund of ${X.XX} issued to {method} (simulated)." (TXT-TRK-20) | Must |
| BR-TRK-15 | **Completed orders**: DELIVERED shows the banner TXT-TRK-21 (`DEPLOYED //` Delivered at {HH:mm}. Enjoy your build!); PICKED_UP shows TXT-TRK-22 (`PULLED //` Picked up at {HH:mm}. Enjoy your build!). The guest gets `View receipt` and `git checkout menu`. | Must |
| BR-TRK-16 | Status, stepper, ETA, log, map and courier changes appear within 5 seconds without a page reload (BR-ORD-20). The page keeps scroll position and open dialogs when it refreshes. | Must |
| BR-TRK-17 | Not used in Lite (display of a paused simulation; Lite has no pause). | — |
| BR-TRK-18 | SCR-10 follows 4.2. Both fields are required ("ORDER_NUMBER is required." (example of TXT-VAL-02), "CONTACT_EMAIL is required." (example of TXT-VAL-02)); a malformed order number shows "ORDER_NUMBER must look like MX-1048." (TXT-TRK-53) | Must |
| BR-TRK-19 | A lookup without match shows "No deployment found for {orderNumber} with that email." (TXT-TRK-54) — the same text whether the number does not exist or the email does not match. After 5 failed lookups within 10 minutes in one browser session, further lookups are refused for 10 minutes with "Too many attempts. Try again in 10 minutes." (TXT-TRK-65) (A-24). | Must (message) / Should (limit) |
| BR-TRK-20 | The header `./track.log` and the phone `Trace` tab follow BR-NAV-06. | Must |
| BR-TRK-21 | **Invalid-link state** of SCR-09 (tracking link with an unknown or altered token, or of an order removed by a demo reset): `ERROR 404 // DEPLOYMENT_NOT_FOUND` (TXT-TRK-44) with "This tracking link is invalid, or the order no longer exists (the demo may have been reset)." (TXT-TRK-45) and buttons `git log --grep` (TXT-TRK-46, → SCR-10) and `RETURN_TO_MAIN` (TXT-ERR-08, → SCR-01). An order URL without a tracking token for an order the viewer has no access to shows SCR-40 instead (navigation-map section 6). | Must |
| BR-TRK-22 | Not used in Lite (orders of a customer account). | — |
| BR-TRK-23 | Not used in Lite (guest orders after sign-in). | — |

> **Assumption A-23:** A guest browser session may open every order placed or successfully looked up in that session without the link. The tracking link itself works in any browser and without a session.

> **Assumption A-24:** Guest lookup is limited to 5 failed attempts per 10 minutes per browser session, to discourage guessing order numbers.

## 6. Data read and written

| Object | Read | Written |
|---|---|---|
| `Order` | header, type, status, timestamps, snapshot amounts and address, `routeProgressPercent`, derived ETAs, oven, courier, cancel fields | T-09 (rollback) via BR-TRK-13; T-05/T-06 via the payment banner (FD-06) |
| `OrderLine`, `OrderLineModifier` | summary | — |
| `OrderLogEntry` | customer-visible lines | T-09 lines |
| `OrderStatusChange` | time and status only | T-09 record |
| `PaymentAttempt` | method, status, refund | refund on T-09 (BR-ORD-10) |
| `Courier` | `nodeHandle`, name, vehicle, status of the order's courier | courier release on cancellation is not possible here (the guest cancels only in QUEUED) |
| `Oven` | `displayName` of the order's oven | — |
| `DeliveryZone` | map position, distance | — |
| `SimulationSettings` | durations, speed | — |

## 7. States touched

Shows every `OrderStatus` (order-lifecycle section 6). Writes `QUEUED → CANCELLED` (T-09), and through FD-06 `PAYMENT_FAILED → PAYMENT_PENDING` (T-05) and `PAYMENT_FAILED → CANCELLED` (T-06).

## 8. Errors and edge cases

| Case | Behaviour | Message |
|---|---|---|
| Rollback confirmed, but the order started baking in the meantime | T-09 rejected; dialog closes; button disabled; status refreshes | `ROLLBACK REJECTED — your order is already in the oven.` |
| Guest opens the order URL of an order without its tracking token (changed identifier) | SCR-40 (LITE-SEC-03; the order's existence is not revealed) | TXT-ERR-01, TXT-ERR-02 |
| Tracking link after a demo reset | Invalid-link state (BR-TRK-21) | TXT-TRK-44, TXT-TRK-45 |
| Many simulated orders queued before the guest's order | Queue position above 1; the ETA is longer only while all oven slots are busy; the order starts baking when a slot is free (BR-ORD-11) | "Waiting for a free oven slot · position {n} in the queue" (TXT-TRK-08) |
| No courier available | Stage 4 "Waiting for courier"; ETA keeps the `courierToStore` estimate | — |
| Two automatic refreshes in a row fail | Last data stays; connection banner above the header (FD-15, BR-ERR-12) | "`CONNECTION_LOST //` Live updates paused. Reconnecting…" (TXT-NAV-30) |
| Lookup with `MX-1048 ` and `JORDAN.LEE@EXAMPLE.COM` | Match (trim, case-insensitive) | — |
| Lookup of a simulated order (contact email of a simulated customer) | No match: simulated orders are never shown to guests (LITE-SEC-02) | "No deployment found for {orderNumber} with that email." (TXT-TRK-54) |
| Lookup of a seed order, e.g. `MX-1001` with `jordan.lee@example.com` | Match; SCR-09 opens | — |

## 9. Notifications

- Live log lines (SIM-07) and status banners on SCR-09.
- Toast "Order {orderNumber} rolled back. Refund issued." (TXT-TRK-38) after T-09.
- No push, email or SMS notifications.
