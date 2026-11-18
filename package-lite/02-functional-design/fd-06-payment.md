# FD-06 — Simulated payment

| Item | Value |
|---|---|
| Epic | EP-06 (US-101 – US-120, TC-101 – TC-120) |
| Roles | Guest, Simulator (SIM-01) |
| Screens | SCR-07 Payment sheet (`PAYMENT_PROTOCOL`), SCR-08 Order confirmation (`DEPLOYMENT SUCCESSFUL // 200 OK`); payment banner on SCR-09 (FD-07) |
| Processes | PR-03 Simulated payment and retry, PR-07 Cancellation and refund |
| Simulations | SIM-01 Payment gateway, SIM-09 Simulation clock |
| Objects | `Order`, `PaymentAttempt`, `OrderStatusChange`, `OrderLogEntry`, `Cart`, `SimulationSettings`, `StoreSettings` |
| Rules referenced | BR-ORD-04 – BR-ORD-07, BR-ORD-10, BR-ORD-21, BR-PRICE-12, BR-PRICE-14, transitions T-02 – T-07 |
| Priority | Must |

Related: order-lifecycle sections 4, 5 and 7 · `10-simulations/` (SIM-01 detail) · FD-05 · FD-07.

---

## 1. Purpose

Make payment feel real without any payment provider: a payment sheet shows a processing step, then success or a realistic failure decided by the demo test card; the guest can retry with another method (at most 3 attempts) or cancel. A successful payment queues the order and shows the confirmation with the commit hash. Cancelling a paid order refunds it (simulated).

## 2. Actors

| Actor | Does |
|---|---|
| Guest | Waits for processing; retries, changes method, cancels; sees confirmation |
| Simulator (SIM-01) | Decides each attempt's outcome after the processing time; issues transaction and refund IDs; retries for simulated customers |
| System timer | Cancels orders left in PAYMENT_FAILED (T-07) |

## 3. Preconditions

- An order was just created by T-01 (FD-05) and is in `PAYMENT_PENDING` with attempt #1 PROCESSING; or
- the viewer resumes an order in `PAYMENT_FAILED` from SCR-09.

## 4. Behaviour

### 4.1 Processing (SCR-07, processing state)

1. The sheet opens over the checkout (modal on desktop/tablet, bottom sheet on phone). It shows: order number `MX-1063` and commit hash `#5be21c0`; amount `$68.62`; the method (`Visa •••• 4242`, `Apple Pay` or `Google Pay`); `Attempt 1 of 3`; a progress indicator; terminal lines mirroring the customer log (`[PAYMENT] Handshake with payment gateway (simulated)…`).
2. The sheet cannot be closed while processing (no close button, Esc and scrim click do nothing). If the user leaves the page anyway (back, closing the tab), the payment continues on the server; the order can be found by its tracking link, `./track.log` (BR-NAV-06) or SCR-10.
3. After the effective `paymentProcessing` time (3 s at 1×) — for `Amex •••• 0005` after the effective `paymentTimeout` (10 s at 1×) — SIM-01 decides the outcome (BR-PAY-04).

### 4.2 Success → SCR-08

1. T-02: attempt SUCCEEDED with `transactionId`, order `QUEUED`, `paymentStatus = PAID`, cart cleared, coupon recorded on the order if applied, ETA computed.
2. SCR-07 closes and SCR-08 opens (BR-PAY-06).
3. `Monitor pipeline` (or closing SCR-08) opens SCR-09 for the order.

### 4.3 Failure (SCR-07, failure state)

1. Attempt 1 or 2 fails → T-03: order `PAYMENT_FAILED`. The sheet shows the error (BR-PAY-08), the method selector (same choices as checkout) and two buttons: `Retry payment` (primary) and `Cancel order`.
2. `Retry payment` → T-05: a new attempt (PROCESSING) with the currently selected method/card, same amount; back to 4.1 with `Attempt n of 3`.
3. `Cancel order` → confirmation (BR-PAY-10) → T-06.
4. Attempt 3 fails → T-04: order `CANCELLED` automatically; the sheet shows the rolled-back state (BR-PAY-11).
5. Closing the sheet in the failure state (close button, Esc) leaves the order in `PAYMENT_FAILED` and opens SCR-09, which shows the payment banner with the same Retry and Cancel actions (A-22).

## 5. Business rules

| ID | Rule | Priority |
|---|---|---|
| BR-PAY-01 | Payment methods are `CARD`, `APPLE_PAY`, `GOOGLE_PAY`, all simulated; for `CARD` one of the five `TestCard` values is chosen. No real card data, no external provider, no redirect. | Must |
| BR-PAY-02 | SCR-07 opens immediately after T-01 in the processing state with the content of 4.1 step 1. | Must |
| BR-PAY-03 | The processing state cannot be dismissed by the user (4.1 step 2). | Must |
| BR-PAY-04 | The outcome follows BR-ORD-04: `VISA_4242`, `MASTERCARD_4444`, Apple Pay, Google Pay → success; `VISA_0002` → DECLINED; `VISA_9995` → INSUFFICIENT_FUNDS; `AMEX_0005` → GATEWAY_TIMEOUT after `paymentTimeout`. A success is turned into DECLINED with probability `randomPaymentFailurePercent` (default 0 %). Durations are divided by the speed factor (order-lifecycle 7.2). | Must |
| BR-PAY-05 | A successful attempt performs T-02 exactly once, even if the user has several tabs open. | Must |
| BR-PAY-06 | **SCR-08** shows (texts TXT-PAY-17 – TXT-PAY-32): the success icon and TXT-PAY-17 `DEPLOYMENT SUCCESSFUL // 200 OK`; TXT-PAY-18 `BUILD QUEUED // STAGE: QUEUED`; TXT-PAY-19 with the queue position; the order number (TXT-PAY-20); TXT-PAY-21 `DEPLOYMENT_HASH` `#<commitHash>` with TXT-PAY-22 `COPY HASH`; TXT-PAY-23 ETA (delivery) or ready time (pickup) as countdown and clock time (`ETA 05:12 · ~18:52`); TXT-PAY-24 `HARDWARE_CLUSTER` with no oven name, because the oven is assigned when baking starts (A-74); TXT-PAY-25 `TX_PROTOCOL` with method, `PAID` and the TxID; TXT-PAY-26 `PIPELINE_STREAMS // STDOUT` with the order's customer-visible log lines (live); for guests the tracking link TXT-PAY-27 with TXT-PAY-29 `COPY LINK` and the note "Save this link to follow your order. You can also find it with your order number and email." (TXT-PAY-28); the button TXT-PAY-30 `MONITOR PIPELINE →` (accessible name "Track my order"). | Must |
| BR-PAY-07 | `COPY HASH` copies `#<commitHash>` (e.g. `#a3f9c2e`), `COPY LINK` copies the full tracking URL, to the clipboard; each shows the toast "Copied to clipboard." If the clipboard is not available, the text is selected for manual copying. | Must |
| BR-PAY-08 | **Failure state** shows `ERROR 402 // PAYMENT_FAILED`, then by failure code: DECLINED — "Card declined by issuer" (example of TXT-STAT-26); INSUFFICIENT_FUNDS — "Insufficient funds" (example of TXT-STAT-26); GATEWAY_TIMEOUT — "Payment gateway timed out" (example of TXT-STAT-26) Then: "{failure text}. Attempt {n} of 3 failed. Choose a payment method and retry, or cancel the order. Your manifest is unchanged." (TXT-PAY-08) | Must |
| BR-PAY-09 | A retry may use a different method or test card. The amount is always the order total (BR-PRICE-12); the order's lines, address and totals cannot be changed during retries. `Retry payment` is available only while attempts < 3. | Must |
| BR-PAY-10 | `Cancel order` asks: dialog TXT-PAY-12 (Title: "Cancel order {orderNumber}?" · Body: "Nothing has been charged. Your manifest stays as it is." · Buttons: `Cancel order` / `Keep order`) with buttons `Cancel order` (destructive) and `Keep order`. Confirming performs T-06; the sheet closes and the user returns to the cart SCR-05 (cart unchanged, as with `Back to manifest` in BR-PAY-11) with the toast "Order {orderNumber} cancelled. Nothing was charged." (TXT-PAY-16). Cancelling from the PAYMENT_FAILED banner of SCR-09 keeps the user on SCR-09, which shows the rolled-back banner. | Must |
| BR-PAY-11 | After the third failure (T-04) the sheet shows TXT-PAY-13 `ROLLED_BACK // payment failed 3 times` and "Order {orderNumber} was rolled back. Nothing was charged. Your manifest is unchanged, so you can check out again." (TXT-PAY-14) with the button TXT-PAY-15 `Back to manifest` (opens SCR-05). | Must |
| BR-PAY-12 | Closing the sheet in the failure state follows 4.3 step 5. | Must |
| BR-PAY-13 | An order in `PAYMENT_FAILED` longer than `paymentFailedTimeout` (600 s at 1×) is cancelled by T-07. An open SCR-07 or SCR-09 for that order switches to the rolled-back state within 5 seconds with "Payment window expired. Order {orderNumber} was rolled back. Nothing was charged." (TXT-PAY-33) | Must |
| BR-PAY-14 | Not used in Lite (payment while the simulation is paused; Lite has no pause). | — |
| BR-PAY-15 | **Refund.** When a `PAID` order is cancelled (T-09 by the guest; T-17 is not used in Lite) the SUCCEEDED attempt becomes REFUNDED with `refundedAt` and `refundId`, and `paymentStatus` becomes REFUNDED at once (BR-ORD-10). The guest sees "Refund of ${X.XX} issued to {method} (simulated)." (TXT-TRK-20) on SCR-09 and SCR-13 (amount per BR-PRICE-14). Unpaid orders show no refund text. | Must |
| BR-PAY-16 | `transactionId` = `txn_sim_` + 12 lowercase hex characters; `refundId` = `rfd_sim_` + 12 lowercase hex characters; both random and unique. | Must |
| BR-PAY-17 | Every attempt is kept as a `PaymentAttempt` (number, method, test card, amount, status, failure code, transaction ID, start and finish time, refund data). The guest sees the attempts' method, status and time on SCR-13. | Must |
| BR-PAY-18 | Each attempt result writes the log lines of T-02/T-03/T-04 (order-lifecycle section 4) and a `SimulationEvent` of type `PAYMENT_RESULT` (e.g. "MX-1063 attempt 1: DECLINED (VISA_0002)"). | Must |
| BR-PAY-19 | Simulated orders (source SIMULATOR) pay with `VISA_4242` by default and pass through the same rules; when their attempt fails, the simulator retries once after `simulatedRetryDelay` with `VISA_4242` (T-05). Detail in `10-simulations/`. | Must |
| BR-PAY-20 | SCR-08 is shown once per order, right after T-02, in the browser that placed the order. Re-opening the order later shows SCR-09, not SCR-08. | Must |

> **Assumption A-22:** The payment sheet can be closed in the failure state. The order stays in `PAYMENT_FAILED` and the customer can retry or cancel from SCR-09 until the payment window (`paymentFailedTimeout`) expires.

## 6. Data read and written

| Object | Read | Written |
|---|---|---|
| `Order` | number, hash, token, total, type, status | status (T-02 – T-07), `paymentStatus`, `paidAt`, `queuedAt`, coupon, `cancelReason`, `cancelledBy`, `cancelledAt` |
| `PaymentAttempt` | all | created (T-05), status, failure code, transaction ID, timestamps, refund fields |
| `Cart` | — | cleared on T-02 |
| `OrderStatusChange`, `OrderLogEntry`, `SimulationEvent` | — | created per transition/result |
| `SimulationSettings` | `speedFactor`, `paymentProcessing`, `paymentTimeout`, `paymentFailedTimeout`, `randomPaymentFailurePercent` | — |
| `StoreSettings` | `maxPaymentAttempts` (3) | — |

## 7. States touched

`PAYMENT_PENDING` → `QUEUED` (T-02), → `PAYMENT_FAILED` (T-03), → `CANCELLED` (T-04); `PAYMENT_FAILED` → `PAYMENT_PENDING` (T-05), → `CANCELLED` (T-06, T-07). `PaymentStatus`: `UNPAID` → `PAID` → `REFUNDED`. `PaymentAttemptStatus`: `PROCESSING` → `SUCCEEDED` / `FAILED`; `SUCCEEDED` → `REFUNDED`.

## 8. Errors and edge cases

| Case | Behaviour | Message |
|---|---|---|
| `Visa •••• 0002`, attempt 1 | T-03, failure state | DECLINED text of BR-PAY-08, "Card declined by issuer. Attempt 1 of 3 failed. Choose a payment method and retry, or cancel the order. Your manifest is unchanged." (example of TXT-PAY-08) |
| Switch to Apple Pay, retry | T-05 then T-02 → SCR-08 | — |
| `Amex •••• 0005` | Processing lasts `paymentTimeout`, then failure | GATEWAY_TIMEOUT text |
| Three failures in a row | T-04 | BR-PAY-11 text |
| User closes the tab during processing | Order resolves on the server; on success the cart is cleared | — |
| Guest has two tabs with SCR-07 of the same order | Both show the same result; only one T-02 (BR-PAY-05) | — |
| Retry pressed twice quickly | One new attempt only | — |
| Retry pressed after the order was auto-cancelled (T-07) | Rejected; sheet switches to the rolled-back state | "Payment window expired. Order {orderNumber} was rolled back. Nothing was charged." (TXT-PAY-33) |
| Demo reset while the guest is on SCR-07 | Sheet closes with the reset notice; the order no longer exists; the cart is empty (SIM-08 section 5) | SIM-08 section 5 |

## 9. Notifications

- SCR-07 states (processing, failure, rolled back) and SCR-08 confirmation.
- Toasts: "Copied to clipboard.", "Order {orderNumber} cancelled. Nothing was charged." (TXT-PAY-16)
- Customer log lines of T-02 – T-07 on SCR-08 and SCR-09.
- No email receipt is sent (product brief 3.2); the receipt is SCR-13.
