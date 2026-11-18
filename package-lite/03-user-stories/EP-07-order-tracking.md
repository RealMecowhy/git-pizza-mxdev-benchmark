# EP-07 — Order tracking (deployment status)

| Epic | Functional area | Screens | MoSCoW | Story range |
|---|---|---|---|---|
| EP-07 | FD-07 Order tracking | SCR-09 `DEPLOYMENT_STATUS`, SCR-10 `git log --grep` | Must | US-121 – US-137 |

**Goal.** Guests follow their order live as a CI/CD pipeline — stages, log, ETA and a simulated courier map — and can cancel it while it is still queued.

Rules: BR-ORD-08 (customer cancel window), BR-ORD-10 (refund), BR-ORD-20 (5-second refresh), order-lifecycle sections 2.1 (stepper), 5 (cancel wording), 6 (screens per state), 7.3 (ETA). Simulations: SIM-04 (courier and route), SIM-07 (live logs).

| ID | Title | Priority |
|---|---|---|
| US-121 | Open the tracking page | Must |
| US-122 | Pipeline stepper | Must |
| US-123 | Live order log (`bash — track.log`) | Must |
| US-124 | Automatic refresh | Must |
| US-125 | ETA countdown | Must |
| US-126 | Simulated map with the courier | Must |
| US-127 | Courier and oven information | Must |
| US-128 | Order summary and receipt link | Must |
| US-129 | Roll back (cancel) a queued order | Must |
| US-130 | Rollback rejected after baking starts | Must |
| US-131 | Cancelled order display | Must |
| US-132 | Pickup tracking | Must |
| US-133 | Look up an order by number and email | Must |
| US-134 | Invalid tracking link | Must |
| US-135 | `./track.log` navigation target | Must |
| US-136 | Lookup abuse protection | Should |
| US-137 | Completed order view | Must |

---

### US-121 Open the tracking page

> As a **guest**, I want to open the tracking page of my order from wherever I am, so that I can follow it at any time.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09, SCR-08, SCR-01, SCR-10 | FD-07 | BR-TRK-*, BR-DATA-05, LITE-SES-03 | PR-02 | — |

**Acceptance criteria**

1. **Given** a placed order, **then** SCR-09 can be opened from SCR-08 (`Monitor pipeline`), the home build-status panel (US-024), the lookup (SCR-10) and the personal tracking link.
2. **Given** a guest opens the tracking link in another browser (a new guest session), **then** SCR-09 shows the order (customer-visible data only, LITE-SES-03).
3. **Given** SCR-09, **then** the header shows `DEPLOYMENT_STATUS`, the order number `MX-<n>`, the commit hash, the order type, the placed time (`YYYY-MM-DD HH:mm`) and the status badge with its plain label (e.g. `BAKING · In the oven`).
4. **Given** a guest opens the order page URL of an order that was not placed or found in this session, without its tracking token, **then** SCR-40 is shown (the existence of the order is not revealed). *(negative)*

---

### US-122 Pipeline stepper

> As a **guest**, I want to see my order as five pipeline stages, so that I understand at a glance how far it is.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09 | FD-07 | BR-TRK-*, BR-ORD-20, BR-SIM-16b | PR-02, PR-05, PR-06 | SIM-02 |

**Acceptance criteria**

1. **Given** a delivery order, **then** the stepper shows `QUEUED`, `BAKING`, `QA_CHECK`, `DISPATCH`, `DEPLOYED`; **given** a pickup order, **then** `QUEUED`, `BAKING`, `QA_CHECK`, `READY_TO_PULL`, `PULLED`.
2. **Given** a delivery order in `READY_FOR_DISPATCH`, **then** stage 4 is current with the sub-label `Waiting for courier`; **given** `OUT_FOR_DELIVERY`, **then** `Courier on the way`.
3. **Given** the current stage, **then** it is highlighted in its status color with glow; completed stages show a check and the time they were reached (`HH:mm`); later stages are muted.
4. **Given** an order 45 seconds into a 90-second bake at 1×, **then** the `BAKING` stage shows progress `50%`.
5. **Given** `PAYMENT_PENDING` or `PAYMENT_FAILED`, **then** no stage is reached and the payment banner of US-113 is shown. *(negative)*

---

### US-123 Live order log (`bash — track.log`)

> As a **developer-customer**, I want to watch my order's log like a build log, so that the wait is entertaining and transparent.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09 | FD-07 | BR-TRK-*, BR-ORD-02, BR-ORD-20, BR-SIM-16a | PR-02 | SIM-07 |

**Acceptance criteria**

1. **Given** SCR-09, **then** a terminal pane `bash — track.log` shows the order's customer-visible log lines as `[HH:mm:ss] [TAG] message`, oldest first, colored by level (`tokens.md` section 1.7).
2. **Given** an order that went from payment to `BAKING`, **then** the pane contains at least the T-01, T-02 and T-08 lines of order-lifecycle section 4 (e.g. `[OVEN] Entered OVEN_01 at 850°F. Bake timer 01:30.`, with the oven's target temperature, BR-SIM-16a).
3. **When** a new line is written, **then** it appears within 5 seconds and the pane scrolls to it, unless the reader has scrolled up.
4. **Given** the seed order MX-1025 (cancelled by the store), found on SCR-10, **then** the guest sees `[ROLLBACK] Order cancelled by the store. Refund issued.` but no line with `isCustomerVisible = false` (e.g. the internal `[OPS]` line of that cancellation) and no `DEBUG` line. *(negative)*

---

### US-124 Automatic refresh

> As a **guest**, I want the tracking page to update by itself, so that I never have to reload.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09 | FD-07 | BR-TRK-*, BR-ORD-20 | PR-02 | SIM-02, SIM-04 |

**Acceptance criteria**

1. **Given** SCR-09 is open, **when** the order changes status, **then** the badge, stepper, ETA, log and map show the change within 5 seconds without a manual reload.
2. **Given** SCR-09 stays open for a whole order (about 5 minutes at 1×), **then** every stage is shown in turn without user action.
3. **Given** refreshing fails, **then** US-287 applies (connection notice; automatic retry). *(negative)*

---

### US-125 ETA countdown

> As a **hungry customer**, I want a countdown to delivery or pickup, so that I know when to expect my pizza.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09 | FD-07 | BR-TRK-* | PR-02, PR-05 | SIM-04, SIM-09 |

**Acceptance criteria**

1. **Given** an open delivery order, **then** `ESTIMATED_ETA` shows a countdown `mm:ss` and the clock time (TXT-TRK-29, e.g. `ESTIMATED_ETA · 04:35 · ~18:49`), calculated per order-lifecycle section 7.3; the countdown ticks every second and is recalculated at least every 5 seconds and on each status change.
2. **Given** a delivery to 94105 in `OUT_FOR_DELIVERY` at 1× with `routeProgressPercent` 50, **then** the countdown shows `01:26` (± 2 s) and `DISTANCE_REMAINING` `1.4 mi` (TXT-TRK-30).
3. **Given** a pickup order, **then** the ETA reads `READY_AT · ~HH:mm` (TXT-TRK-31).
5. **Given** a final state, **then** no ETA is shown; DELIVERED shows the banner `DEPLOYED //` Delivered at {HH:mm}. Enjoy your build! (TXT-TRK-21).

---

### US-126 Simulated map with the courier

> As a **guest**, I want to see the courier moving towards me on a map, so that delivery feels real and I can judge the remaining time.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09 | FD-07 | BR-TRK-*, BR-ORD-20 | PR-05 | SIM-04 |

**Acceptance criteria**

1. **Given** a delivery order, **then** SCR-09 shows a stylized map (`illustrations/map-sf-dark.jpg`) with the store marker, the destination marker labelled with the first address line (TXT-TRK-27) and a route line.
2. **Given** `OUT_FOR_DELIVERY`, **then** a courier marker sits on the route at `routeProgressPercent` and moves smoothly between updates (1000 ms; with reduced motion it jumps); position updates appear within 5 seconds.
3. **Given** `READY_FOR_DISPATCH` with the courier `TO_STORE`, **then** the map shows the helper "The live map starts when the courier picks up your order." (TXT-TRK-28) and no courier marker (BR-TRK-09); the courier card shows the status `On the way to the store` (TXT-STAT-27).
4. **Given** `DELIVERED`, **then** the courier marker is at the destination.
5. **Given** a pickup order, **then** no route and no courier marker are shown. *(negative)*
6. No external map service is called. *(negative)*

---

### US-127 Courier and oven information

> As a **guest**, I want to know which oven bakes my pizza and which courier brings it, so that the process feels personal.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09 | FD-07 | BR-TRK-* | PR-04, PR-05 | SIM-04 |

**Acceptance criteria**

1. **Given** `BAKING`, **then** SCR-09 shows the oven display name (e.g. `OVEN_01::CORE`).
2. **Given** a courier is assigned, **then** SCR-09 shows the courier's node handle and vehicle (e.g. `Marek // Moto-v3 · SCOOTER`).
3. **Given** a courier is shown, **then** no phone number, call, chat or "pull courier" action is offered. *(negative: out of scope)*

---

### US-128 Order summary and receipt link

> As a **guest**, I want to see what I ordered and what I paid on the tracking page, so that I can check it at a glance.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09, SCR-13 | FD-07 | BR-TRK-*, BR-PRICE-11, BR-DATA-03 | PR-02 | — |

**Acceptance criteria**

1. **Given** SCR-09, **then** an order summary shows the lines (name, size, configuration differences, quantity, line total), subtotal, discount with coupon code, delivery fee, tax, tip, total, payment method label and the delivery address (or the store address for pickup) (BR-TRK-12, SCR-09 E-13).
3. **When** `View receipt` is clicked, **then** SCR-13 opens for this order (guests via their tracking link, US-166 AC5).

---

### US-129 Roll back (cancel) a queued order

> As a **guest**, I want to cancel my order while the kitchen has not started it, so that I can change my mind and get my money back.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09 | FD-07 | BR-TRK-*, BR-ORD-08, BR-ORD-10 | PR-07 | SIM-01, SIM-07 |

**Acceptance criteria**

1. **Given** an order in `QUEUED`, **then** SCR-09 shows an enabled `Rollback order` button (accessible name "Cancel order").
2. **When** it is pressed, **then** a confirmation states the order number and the refund (e.g. `$26.58 will be refunded to Visa •••• 4242 (simulated).`).
3. **When** confirmed, **then** the order becomes `CANCELLED` with `cancelledBy` GUEST and reason `Cancelled by customer`, the refund is made (US-111), the log shows `[ROLLBACK] Order rolled back by customer. Refund issued.` and the page shows the rolled-back banner (US-131).
4. **Given** the simulator started baking while the confirmation was open, **when** the guest confirms, **then** the cancellation is rejected with `ROLLBACK REJECTED — your order is already in the oven.` and the order keeps baking. *(negative)*
5. **When** the confirmation is dismissed, **then** nothing changes. *(negative)*

---

### US-130 Rollback rejected after baking starts

> As the **store**, I want guests not to be able to cancel food that is already being made, so that we do not waste it.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09 | FD-07 | BR-TRK-*, BR-ORD-08 | PR-07 | — |

**Acceptance criteria**

1. **Given** `BAKING` or `QA_CHECK`, **then** `Rollback order` is disabled with `ROLLBACK REJECTED — your order is already in the oven.` *(negative)*
2. **Given** `READY_FOR_DISPATCH` or `READY_FOR_PICKUP`, **then** the message is `ROLLBACK REJECTED — your order is already packed.` *(negative)*
3. **Given** `OUT_FOR_DELIVERY`, **then** the message is `ROLLBACK REJECTED — your order is already on its way.` *(negative)*
4. **Given** `PAYMENT_PENDING` or a final state, **then** no rollback button is shown.

---

### US-131 Cancelled order display

> As a **guest**, I want to understand why my order was cancelled and whether I was refunded, so that I know what happened to my money.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09 | FD-07 | BR-TRK-*, BR-ORD-10, BR-ORD-17 | PR-07 | — |

**Acceptance criteria**

1. **Given** a `CANCELLED` order, **then** the stepper is frozen at the last stage reached and a `ROLLED_BACK` banner says `This order was rolled back.`
2. **Given** the guest cancelled it, **then** the banner adds `You cancelled it.`; **given** the store cancelled it (seed order MX-1025, found on SCR-10 with `kevin.nguyen@example.net`), **then** it adds `The store cancelled it. Reason: Customer called the store: wrong delivery address, will order again`; **given** the system cancelled it (payment), **then** it adds `Payment was not completed.`
3. **Given** the order was paid, **then** the banner shows the refund line of US-111; **given** it was not paid, **then** no refund line is shown. *(negative)*
4. **Given** a cancelled order, **then** no action changes its state any more (BR-ORD-17). *(negative)*

---

### US-132 Pickup tracking

> As a **guest who chose pickup**, I want to know exactly when to come to the store, so that my pizza is hot when I arrive.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09 | FD-07 | BR-TRK-* | PR-06 | SIM-06 |

**Acceptance criteria**

1. **Given** a pickup order before `READY_FOR_PICKUP`, **then** SCR-09 shows the store name, address and `READY_AT · ~HH:mm` (TXT-TRK-31).
2. **Given** `READY_FOR_PICKUP`, **then** stage 4 `READY_TO_PULL` is current and the page shows "Ready at the counter: 2140 Folsom Street" (TXT-TRK-13) and "Show your commit hash #{hash} at the counter." (TXT-TRK-62).
3. **Given** the simulated customer collects the order (US-272), **then** within 5 seconds stage 5 `PULLED` is complete with the banner `PULLED //` Picked up at {HH:mm}. Enjoy your build! (TXT-TRK-22).

---

### US-133 Look up an order by number and email

> As a **guest who lost the tracking link**, I want to find my order with its number and my email, so that I can still track it.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-10, SCR-09 | FD-07 | BR-TRK-* | PR-02 | — |

**Acceptance criteria**

1. **Given** SCR-10 `git log --grep`, **then** it asks for the order number and the email used at checkout.
2. **Given** a guest order `MX-1061` placed with `taylor.brooks@example.com`, **when** `MX-1061`, `mx-1061` or `1061` is entered with `Taylor.Brooks@Example.com `, **then** SCR-09 of that order opens (case-insensitive, trimmed).
3. **When** the number exists but the email does not match, or the number does not exist, **then** the same message says no order matches this order number and email; it does not reveal which field is wrong. *(negative)*
4. **When** either field is empty, **then** a required-field message is shown and no lookup runs. *(negative)*

---

### US-134 Invalid tracking link

> As a **guest with a broken or outdated link**, I want a clear message and a way forward, so that I am not left on an empty page.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09, SCR-10 | FD-07 | BR-TRK-*, BR-ERR-* | — | SIM-08 |

**Acceptance criteria**

1. **When** a tracking link with an unknown or altered token is opened, **then** SCR-09 shows the invalid-link state: `ERROR 404 // DEPLOYMENT_NOT_FOUND` (TXT-TRK-44), TXT-TRK-45 and the buttons `git log --grep` (TXT-TRK-46, → SCR-10) and `RETURN_TO_MAIN` (→ SCR-01); no order data is shown (BR-TRK-21). *(negative)*
2. **Given** an order was removed by a demo reset, **when** its old tracking link is opened, **then** the same invalid-link state is shown. *(negative)*

---

### US-135 `./track.log` navigation target

> As a **guest**, I want the "track" navigation item to take me straight to the most relevant order, so that I need no extra clicks.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-16, SCR-09, SCR-10 | FD-07 | BR-TRK-*, BR-NAV-* | PR-02 | — |

**Acceptance criteria**

1. **Given** a guest who placed, looked up or opened with its tracking link an order in this browser session, **when** `./track.log` (or phone tab `Trace`) is clicked, **then** SCR-09 of the most recent of these orders opens, in any status, even if it is final (BR-NAV-06).
3. **Given** a guest without an order in this session, **then** SCR-10 opens.

---

### US-136 Lookup abuse protection

> As the **store**, I want repeated failed lookups to be slowed down, so that nobody can guess other people's orders.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Should | G | SCR-10 | FD-07 | BR-TRK-* | — | — |

**Acceptance criteria**

1. **Given** 5 unsuccessful lookups within 10 minutes in one browser session, **when** a sixth is attempted, **then** it is refused for 10 minutes with "Too many attempts. Try again in 10 minutes." (TXT-TRK-65, BR-TRK-19). *(negative)*
2. **Given** the 10 minutes have passed, **then** lookups work again.

---

### US-137 Completed order view

> As a **guest whose pizza arrived**, I want the tracking page to confirm completion and offer the receipt, so that the journey ends cleanly.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09, SCR-13 | FD-07 | BR-TRK-*, BR-ORD-17 | PR-05, PR-06 | SIM-04, SIM-06 |

**Acceptance criteria**

1. **Given** `DELIVERED`, **then** all five stages are complete, a `DEPLOYED` banner shows `Delivered at HH:mm`, the log ends with `[DEPLOY] Delivered. Enjoy your build!` and the page offers `View receipt`.
2. **Given** `PICKED_UP`, **then** the banner shows `PULLED` and `Picked up at HH:mm`.
3. **Given** a completed order, **then** no re-order action is offered. *(negative)*
4. **Given** a final order, **then** no rollback, retry or other state-changing action is offered. *(negative)*
