# EP-06 — Simulated payment

| Epic | Functional area | Screens | MoSCoW | Story range |
|---|---|---|---|---|
| EP-06 | FD-06 Simulated payment | SCR-06 (payment block), SCR-07, SCR-08, SCR-09 (payment banners) | Must | US-101 – US-114 |

**Goal.** Payment looks and behaves like a real payment step — processing, success, realistic failures, retries, refunds — but no real payment data is ever entered and no external provider is called. The outcome is decided by the demo test card the visitor chooses (SIM-01).

Rules: BR-ORD-04 (outcome by test card), BR-ORD-05 (max 3 attempts), BR-ORD-06 (failed-payment timeout), BR-ORD-07 (cart cleared only on success), BR-ORD-10 (refund), BR-PRICE-12 (same total on retry), BR-PRICE-14 (refund amount). Transitions T-01 – T-07 in [order-lifecycle.md](../05-processes/order-lifecycle.md). Timings: `paymentProcessing` 3 s, `paymentTimeout` 10 s, `paymentFailedTimeout` 600 s, `simulatedRetryDelay` 15 s (at 1×).

| ID | Title | Priority |
|---|---|---|
| US-101 | Choose a payment method and demo test card | Must |
| US-102 | Payment processing sheet | Must |
| US-103 | Successful payment | Must |
| US-104 | Declined card or insufficient funds | Must |
| US-105 | Gateway timeout | Must |
| US-106 | Retry payment with another method | Must |
| US-107 | Third failure rolls the order back | Must |
| US-108 | Cancel the order before payment | Must |
| US-109 | Abandoned failed payment expires | Must |
| US-110 | Order confirmation (`DEPLOYMENT SUCCESSFUL // 200 OK`) | Must |
| US-111 | Simulated refund on cancellation | Must |
| US-112 | Random payment failure rate | Must |
| US-113 | Retry or cancel from the tracking page | Must |
| US-114 | Simulated customers pay through the same gateway | Must |

Assumption A-21 (FD-05) applies: on SCR-06 the payment method `Card` with test card `Visa •••• 4242` is preselected, so that the happy path needs no extra click. The visitor can change it before pressing `Execute Order --force`.

---

### US-101 Choose a payment method and demo test card

> As a **guest**, I want to choose how I pay — and, in this demo, which outcome I want to see — without typing any card data, so that I can try success and failure safely.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-06, SCR-07 | FD-06 | BR-PAY-*, BR-ORD-03, BR-ORD-04 | PR-03 | SIM-01 |

**Acceptance criteria**

1. **Given** SCR-06, **then** a `PAYMENT_PROTOCOL` block offers the methods `Card`, `Apple Pay`, `Google Pay`, each marked as simulated.
2. **Given** `Card`, **then** five demo test cards are offered, each with its expected outcome: `Visa •••• 4242 — approves`, `Mastercard •••• 4444 — approves`, `Visa •••• 0002 — declined`, `Visa •••• 9995 — insufficient funds`, `Amex •••• 0005 — gateway timeout`.
3. **Given** the payment block, **then** there is no field for a card number, expiry date, CVC or cardholder name anywhere in the app. *(negative)*
4. **Given** `Apple Pay` or `Google Pay`, **then** no test card is shown and the payment always succeeds unless the random failure rate applies (US-112).
5. **Given** no method could be resolved (e.g. Card without a test card), **then** `Execute Order --force` shows an error at the payment block and no order is created. *(negative)*

---

### US-102 Payment processing sheet

> As a **guest**, I want to see that my payment is being processed, so that I wait instead of pressing the button again.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-07, SCR-09 | FD-06 | BR-PAY-*, BR-ORD-04 | PR-03 | SIM-01, SIM-07, SIM-09 |

**Acceptance criteria**

1. **Given** the order was created (US-091), **then** SCR-07 opens (modal on desktop/tablet, bottom sheet on phone) in the processing state, showing the method and card label, the amount (e.g. `$68.62`), a progress indicator and the log line `[PAYMENT] Handshake with payment gateway (simulated)…`.
2. **Given** `Visa •••• 4242` at speed 1×, **then** the result arrives after 3 seconds (± 2 s simulator tick); at 5× after 1 second.
3. **Given** the processing state, **then** the sheet cannot be closed (no close button; Escape and backdrop click do nothing). *(negative)*
4. **Given** the visitor reloads the page during processing, **then** the order continues; opening the tracking link shows SCR-09 with the banner `Processing payment…`, and the result appears there within 5 seconds of being decided.

---

### US-103 Successful payment

> As a **guest**, I want a successful payment to send my order straight to the kitchen, so that baking starts right away.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-07, SCR-08, SCR-05 | FD-06 | BR-PAY-*, BR-ORD-02, BR-ORD-07 | PR-02, PR-03 | SIM-01, SIM-07 |

**Acceptance criteria**

1. **Given** an order paid with `Visa •••• 4242`, `Mastercard •••• 4444`, Apple Pay or Google Pay (random failure 0 %), **when** processing ends, **then** the attempt is SUCCEEDED with a transaction ID `txn_sim_` + 12 hex characters, the order is `QUEUED` with `paymentStatus` PAID, `paidAt` and `queuedAt` are set, and one `OrderStatusChange` PAYMENT_PENDING → QUEUED with actor `SIMULATOR` is recorded.
2. **Then** the log contains `[PAYMENT] Payment confirmed. TxID txn_sim_…` and `[KITCHEN] Order queued at position N.`
3. **Then** the cart is emptied (lines and coupon) and the header cart count shows 0.
4. **Given** coupon `GITHUB_STUDENT` was APPLIED, **then** the order stores the coupon and `couponCode`; **given** a NOT_APPLIED coupon, **then** the order stores none.
5. **Then** SCR-07 closes and SCR-08 opens (US-110).
6. **Given** the payment succeeded, **when** the visitor goes back to SCR-06 with the browser back button, **then** the empty-cart redirect applies (US-092) and no second order can be placed from the old page. *(negative)*

---

### US-104 Declined card or insufficient funds

> As a **guest**, I want a clear reason when my payment fails, so that I can pick another way to pay.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-07 | FD-06 | BR-PAY-*, BR-ORD-04, BR-ORD-07 | PR-03 | SIM-01, SIM-07 |

**Acceptance criteria**

1. **Given** `Visa •••• 0002`, **when** processing ends after 3 seconds, **then** the order is `PAYMENT_FAILED`, the attempt is FAILED with code DECLINED, and SCR-07 shows `ERROR 402 // PAYMENT_FAILED` (TXT-PAY-07) and "Card declined by issuer. Attempt 1 of 3 failed. Choose a payment method and retry, or cancel the order. Your manifest is unchanged." (TXT-PAY-08); the order log gets `ERROR 402: Card declined by issuer. Attempt 1 of 3.` (TXT-LOG-05). *(negative)*
2. **Given** `Visa •••• 9995`, **then** the failure text is "Insufficient funds" (TXT-PAY-08 with TXT-STAT-26). *(negative)*
3. **Given** the failure state, **then** SCR-07 lets the visitor change method and test card and offers `Retry payment` and `Cancel order`; the sheet can now be closed (closing leaves the order in `PAYMENT_FAILED`, reachable on SCR-09).
4. **Given** a failed payment, **then** the cart still holds all its lines (BR-ORD-07).
5. **Then** the log contains `[PAYMENT] ERROR 402: <failure text>. Attempt 1 of 3.`

---

### US-105 Gateway timeout

> As a **demo viewer**, I want to see what happens when the payment gateway does not answer, so that the demo shows a realistic technical failure.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-07 | FD-06 | BR-PAY-*, BR-ORD-04 | PR-03 | SIM-01, SIM-09 |

**Acceptance criteria**

1. **Given** `Amex •••• 0005` at 1×, **then** SCR-07 stays in processing for 10 seconds (`paymentTimeout`) and then shows `ERROR 402 // PAYMENT_FAILED` (TXT-PAY-07) with "Payment gateway timed out. Attempt 1 of 3 failed. …" (TXT-PAY-08); the order is `PAYMENT_FAILED` with failure code GATEWAY_TIMEOUT. *(negative)*
2. **Given** speed 2×, **then** the timeout occurs after 5 seconds.

---

### US-106 Retry payment with another method

> As a **guest whose payment failed**, I want to retry with another card or wallet, so that I can still get my pizza.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-07, SCR-08 | FD-06 | BR-PAY-*, BR-ORD-05, BR-PRICE-12 | PR-03 | SIM-01, SIM-07 |

**Acceptance criteria**

1. **Given** attempt 1 failed with `Visa •••• 0002`, **when** the visitor selects `Apple Pay` and presses `Retry payment`, **then** attempt 2 is created in PROCESSING for the same amount, the order returns to `PAYMENT_PENDING`, the log shows `[PAYMENT] Retrying payment (attempt 2 of 3)…`, and after processing the order is `QUEUED` and SCR-08 opens.
2. **Given** the retry, **then** the order number, commit hash and total are unchanged. *(negative: a retry never creates a new order)*
3. **Given** the order's audit trail, **then** it shows PAYMENT_PENDING → PAYMENT_FAILED → PAYMENT_PENDING → QUEUED.

---

### US-107 Third failure rolls the order back

> As the **store**, I want an order to be rolled back after three failed payments, so that unpaid orders do not pile up.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-07, SCR-09 | FD-06 | BR-PAY-*, BR-ORD-05, BR-ORD-07 | PR-03, PR-07 | SIM-01, SIM-07 |

**Acceptance criteria**

1. **Given** attempts 1 and 2 failed, **when** attempt 3 with `Visa •••• 9995` fails, **then** the order is `CANCELLED` with `cancelledBy` SYSTEM and reason `Payment failed 3 times`; the log shows `[ROLLBACK] Order rolled back: payment failed 3 times.` *(negative)*
2. **Then** SCR-07 shows the `Order rolled back` state with an action back to the cart; `Retry payment` is no longer offered. *(negative)*
3. **Then** the cart is unchanged; no refund is shown (nothing was paid).
4. **When** the visitor checks out again, **then** a new order with a new order number is created.

---

### US-108 Cancel the order before payment

> As a **guest whose payment failed**, I want to cancel the order, so that I can change my cart or stop.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-07, SCR-09, SCR-05 | FD-06 | BR-PAY-*, BR-ORD-07, BR-ORD-08 | PR-03, PR-07 | SIM-07 |

**Acceptance criteria**

1. **Given** an order in `PAYMENT_FAILED`, **when** `Cancel order` is pressed and confirmed, **then** the order is `CANCELLED` with `cancelledBy` GUEST and reason `Cancelled by customer before payment`; the log shows `[ROLLBACK] Order rolled back by customer before payment.`
2. **Then** SCR-07 closes, the cart SCR-05 is shown with the cart unchanged and the info toast "Order {orderNumber} cancelled. Nothing was charged." (TXT-PAY-16) (BR-PAY-10).
3. **Given** the order is `PAYMENT_PENDING` (processing), **then** no cancel action is offered to the guest. *(negative)*

---

### US-109 Abandoned failed payment expires

> As the **store**, I want a failed payment that nobody retries to expire, so that the order list stays clean.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | SIM | SCR-09 | FD-06 | BR-PAY-*, BR-ORD-06, BR-ORD-21 | PR-03, PR-07 | SIM-01, SIM-09 |

**Acceptance criteria**

1. **Given** an order in `PAYMENT_FAILED` at 1×, **when** 600 seconds pass without retry or cancel, **then** it becomes `CANCELLED` with `cancelledBy` SYSTEM and reason `Payment not completed in time`; the log shows `[ROLLBACK] Payment window expired. Order rolled back.`
2. **Given** speed 10×, **then** it expires after 60 seconds.
4. **Then** SCR-09 shows the rolled-back banner with `Payment was not completed.`

---

### US-110 Order confirmation (`DEPLOYMENT SUCCESSFUL // 200 OK`)

> As a **guest**, I want a satisfying confirmation with my order reference and ETA, so that I know the order is in and how to follow it.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-08, SCR-09 | FD-06 | BR-PAY-*, BR-TRK-*, BR-ORD-11 | PR-01, PR-02 | SIM-07 |

**Acceptance criteria**

1. **Given** a successful payment, **then** SCR-08 shows the title `DEPLOYMENT SUCCESSFUL // 200 OK`, the commit hash (e.g. `#a3f9c2e`) with a copy button, the order number `MX-<n>`, the ETA as countdown and clock time, the line `HARDWARE_CLUSTER` · Oven assigned when baking starts · ovens online · thermal load (TXT-PAY-24, A-74), the payment reference (`txn_sim_…`) with the method label, and the first log lines of the order.
2. **When** the copy button is pressed, **then** the hash is copied to the clipboard and a toast confirms it.
3. **Given** a delivery to 94105 that has just been queued at 1×, with a free oven slot and no courier assigned yet, **then** the ETA countdown shows `05:47` (± 2 s) (`queueWait` 20 + `bake` 90 + `qa` 30 + `courierToStore` 30 + `handover` 5 + trip 172 s).
4. **Given** any queued order, **then** SCR-08 names no oven (it is assigned only when baking starts, BR-ORD-11) and shows the live oven summary, e.g. `2/2 ovens online · thermal load 67%` (A-74; thermal load = kitchen load of BR-SIM-16d). *(negative)*
5. **Given** a guest, **then** SCR-08 shows the personal tracking link with a copy button and says the order can also be found with the order number and email (SCR-10).
6. **When** `Monitor pipeline` or the close button is pressed, **then** SCR-09 for this order opens; reloading SCR-09 does not show SCR-08 again.
7. SCR-08 shows the note "We use your email only to let you look up this order. No emails are sent in this demo." (TXT-CHK-57, SCR-08 E-09a); no email or SMS is sent. *(negative)*

Assumption A-74 (UI specification) applies: the screen inventory lists "assigned oven" on SCR-08, but an oven is assigned only when baking starts (BR-ORD-11). SCR-08 therefore shows "Oven assigned when baking starts" and the live oven summary instead of an oven name.

---

### US-111 Simulated refund on cancellation

> As a **guest whose paid order was cancelled**, I want to see that my money was refunded, so that I trust the shop.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09, SCR-13 | FD-06 | BR-PAY-*, BR-ORD-10, BR-PRICE-14 | PR-07 | SIM-01 |

**Acceptance criteria**

1. **Given** a PAID order of `$26.58` paid with `Visa •••• 4242` is cancelled (by the guest in QUEUED, US-129), **then** the SUCCEEDED attempt becomes REFUNDED with `refundedAt` and a refund ID `rfd_sim_` + 12 hex characters, and the order's `paymentStatus` becomes REFUNDED.
2. **Then** SCR-09 shows `Refund of $26.58 issued to Visa •••• 4242 (simulated).`, and SCR-13 shows the refund ID and time (US-166 AC2).
3. **Given** an unpaid order (`PAYMENT_PENDING` or `PAYMENT_FAILED`) is cancelled, **then** no refund is created or shown. *(negative)*
4. The refund is always the full total; there is no partial refund. *(negative)*

---

### US-112 Random payment failure rate

> As the **simulator**, I want the outcome of a payment to depend only on the chosen test card, so that every run of the demo and of the acceptance tests gives the same result.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | SIM | SCR-07 | FD-06 | BR-PAY-*, BR-ORD-04, BR-SIM-* | PR-03 | SIM-01 |

**Acceptance criteria**

1. **Given** `randomPaymentFailurePercent` = 0 (fixed in Lite, [lite-configuration.md](../10-simulations/lite-configuration.md) section 2), **then** every attempt with `Visa •••• 4242`, `Mastercard •••• 4444`, Apple Pay or Google Pay succeeds.
3. **Given** any rate, **then** the failing test cards (`0002`, `9995`, `0005`) always fail with their own code. *(negative)*
4. No screen, setting or endpoint changes the rate while the app runs (LITE-CFG-03). *(negative)*

---

### US-113 Retry or cancel from the tracking page

> As a **guest who closed the payment sheet**, I want to finish or cancel a failed payment from the tracking page, so that I am never stuck.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09, SCR-07 | FD-06 | BR-PAY-*, BR-TRK-*, BR-ORD-05, BR-ORD-08 | PR-03 | SIM-01 |

**Acceptance criteria**

1. **Given** an order in `PAYMENT_FAILED` after attempt 1, **when** SCR-09 is opened, **then** the pipeline shows no stage reached and the banner `PAYMENT_FAILED //` {failure text}. Retry the payment or cancel the order. (TXT-TRK-15) with `Retry payment` and `Cancel order`.
2. **When** `Retry payment` is pressed, **then** SCR-07 opens in the failure state so that method and test card can be changed (US-106).
3. **When** `Cancel order` is pressed and confirmed, **then** the order is cancelled as in US-108 AC1, and the visitor stays on SCR-09, which shows the rolled-back banner (TXT-TRK-16, BR-PAY-10).
4. **Given** an order in `PAYMENT_PENDING`, **then** the banner reads `Processing payment…` and offers no action. *(negative)*

---

### US-114 Simulated customers pay through the same gateway

> As a **guest watching the demo**, I want simulated orders to go through the same payment simulation as mine, so that the kitchen queue, the couriers and the home page KPIs show realistic activity.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | SIM | — | FD-06 | BR-PAY-*, BR-ORD-04, LITE-CFG-04, LITE-CFG-06 | PR-03, PR-10 | SIM-01, SIM-05 |

**Acceptance criteria**

1. **Given** the traffic generator creates an order (US-265), **then** it starts in `PAYMENT_PENDING` with attempt 1 and is decided by the same rules as guest payments; the server log shows its `SPAWN <orderNumber> …` line and then `ORDER <orderNumber> PAYMENT_PENDING -> QUEUED by sim/payment-gateway` (LITE-CFG-04, LITE-CFG-06).
2. **Given** the random failure rate is 0 % in Lite, **then** the first attempt of every simulated order succeeds: the server log has no `ORDER <orderNumber> PAYMENT_PENDING -> PAYMENT_FAILED` line for an order with a `SPAWN` line. *(negative)*

**Notes.** The mix of methods used by simulated customers is defined in `10-simulations/`. The retry of a failed simulated payment (SIM-01) is part of the engine but cannot be triggered in Lite.
