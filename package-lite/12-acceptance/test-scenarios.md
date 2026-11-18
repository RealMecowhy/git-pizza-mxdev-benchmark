# Test Scenarios

End-to-end scenarios (`E2E-xx`) and acceptance test cases (`TC-xxx`) for Git Pizza MxDev. They are executed as automated acceptance tests against the app running locally (`README.md`). The contractor may use them to check the app before delivery; no own test report is delivered.

- **E2E scenarios** follow a real journey across several epics and the simulations. They are all Must.
- **Test cases** are grouped per epic. Epic `EP-n` owns `TC-(n-1)×20+1` … `TC-n×20` (`ids-and-traceability.md` section 1). Unused numbers in a range are free for later additions.
- Each test case states its **priority** (M Must, S Should, C Could, inherited from the feature it tests), what it **covers** (screens, rules, transitions `T-xx` of `order-lifecycle.md`, simulations), its **setup** (section 2.1) and numbered steps in the form *action* → **expected result**.
- The link from user stories to test cases is two-way: every `TC` and `E2E` names the stories it verifies in its **Covers** line ("Stories US-…"), and [`../03-user-stories/traceability-matrix.md`](../03-user-stories/traceability-matrix.md) section 2 lists for every story the tests that verify it (column "Verified by"). Every Must story has at least one test, except where section 1.4 explains why a story cannot be tested in Lite.
- **Evidence.** A guest sees only own orders. Everything else is checked in the server log lines of [`../10-simulations/lite-configuration.md`](../10-simulations/lite-configuration.md) section 3 (`ORDER`, `COURIER`, `SPAWN`, `CONFIG`, `RESET`; log node `Simulation`, level INFO), in the home page KPIs and with the lookup of seed orders on SCR-10. "Server log: `X -> Y`" in an expected result means the line `ORDER <orderNumber> X -> Y by <actorName>` of the order under test.

Related: [README.md](README.md) (conventions, timing tolerance, result codes, severities), [acceptance-checklist.md](acceptance-checklist.md), [../05-processes/order-lifecycle.md](../05-processes/order-lifecycle.md), [../09-demo-data/menu-catalog.md](../09-demo-data/menu-catalog.md), [../04-information-model/information-model.md](../04-information-model/information-model.md).

---

## 1. Coverage

### 1.1 Per epic

Numbers that are missing inside a range belong to features that are not part of Lite; they are not re-used.

| Epic | Test cases | Count | E2E scenarios |
|---|---|---|---|
| EP-01 Shell, navigation and branding | TC-001 – TC-009 | 7 | E2E-01, E2E-06 |
| EP-02 Menu browsing | TC-021 – TC-033 | 11 (9 M, 1 S, 1 C) | E2E-01, E2E-06, E2E-07 |
| EP-03 Pizza configurator | TC-041 – TC-049 | 8 | E2E-01 |
| EP-04 Cart and coupons | TC-061 – TC-068 | 8 | E2E-01, E2E-02 |
| EP-05 Checkout | TC-081 – TC-092 | 9 (8 M, 1 C) | E2E-01, E2E-06 |
| EP-06 Simulated payment | TC-101 – TC-110 | 9 | E2E-01, E2E-02 |
| EP-07 Order tracking | TC-121 – TC-134 | 13 | E2E-01, E2E-02, E2E-06, E2E-07 |
| EP-09 Order receipt (US-166, US-167) | TC-169 – TC-170 | 2 (1 M, 1 S) | — |
| EP-10 Kitchen run by the simulator | TC-192 – TC-195 | 3 | E2E-01, E2E-07 |
| EP-13 Automatic courier dispatch | TC-245 – TC-248 | 2 | E2E-01, E2E-07 |
| EP-14 Simulation and demo reset (fixed configuration) | TC-271 – TC-276 | 6 | E2E-07, E2E-08 |
| EP-15 Errors and system messages | TC-281 – TC-292 | 10 | E2E-08 |
| **Total** | | **88** (84 M, 2 S, 2 C) | **5** |

### 1.2 Per simulation

| Simulation | Test cases and scenarios |
|---|---|
| SIM-01 Payment gateway | TC-101 – TC-107, TC-109, TC-110, E2E-01, E2E-02 |
| SIM-02 Kitchen auto-advance | TC-033, TC-192, TC-195, TC-292, E2E-01, E2E-07 |
| SIM-04 Courier dispatch and route | TC-124, TC-245, TC-248, E2E-01, E2E-07 |
| SIM-05 Order traffic generator | TC-033, TC-134, TC-275, E2E-07 |
| SIM-06 Pickup customer arrival | TC-192, TC-193, E2E-06 |
| SIM-07 Live logs | TC-123, TC-274, E2E-01 |
| SIM-08 Demo seed, reset and housekeeping | TC-271, TC-272, TC-276, E2E-08 |
| SIM-09 Simulation clock (speed constant) | TC-276, E2E-07 |
| Lite configuration (constants, server log lines `LITE-CFG-01` – `LITE-CFG-08`) | TC-274, TC-275, TC-276, E2E-08 |

### 1.3 Per order transition (`order-lifecycle.md` section 4)

| Transition | Tested in | Transition | Tested in |
|---|---|---|---|
| T-01 Execute Order | TC-101, TC-290, E2E-01 | T-09 Guest rollback | TC-109, TC-125, TC-292 |
| T-02 Payment succeeded | TC-101, TC-102, TC-110 | T-10 Bake finished (to QA) | TC-192, TC-274 |
| T-03 Payment failed (1–2) | TC-103, TC-104 | T-11 Sealed (delivery) | TC-245, TC-274 |
| T-04 Third failure | TC-105 | T-12 Sealed (pickup) | TC-192 |
| T-05 Retry payment | TC-103, E2E-02 | T-14 Handover to courier | TC-245, TC-274 |
| T-06 Guest cancels after failure | TC-106 | T-15 Delivered | TC-245, TC-274, E2E-01 |
| T-07 Payment window expired | TC-107 | T-16 Picked up | TC-192, TC-193 |
| T-08 Start bake | TC-192, TC-195, TC-274 | | |

T-13 (QA failed) and T-17 (cancel by the store) cannot happen in Lite: `qaFailurePercent` is 0 % and nobody operates the store (`lite-configuration.md` section 2). Seed orders show their results (TC-132).

### 1.4 Stories without a test case in Lite

| Story | Reason |
|---|---|
| US-071 Unavailable lines in the cart | Stock and sold-out flags never change while the app runs (seed only, `lite-configuration.md` section 2), and sold-out items cannot be added. A cart line therefore cannot become unavailable. The rule stays (BR-DATA-12) and is checked by reading the model. |
| US-095 Item became unavailable during checkout | Same reason as US-071. The server-side check of availability is part of NFR-12.2. |

---

## 2. Setups and test data

### 2.1 Standard setups

A test case lists the setups it needs, in order. Lite has no screen that changes the simulation: the only settings are the two constants of `lite-configuration.md` section 1, set before the app starts. A test that starts with **S1** always starts from the seed.

| Setup | Steps |
|---|---|
| **S1** Fresh start | Stop the app with `RUN/stop.ps1`. Start it with `RUN/start.ps1 -SpeedFactor 10 -ResetOnStartup $true` (`-SpeedFactor 1` when the test says 1×; `deliverables.md` section 6.1) and wait until the server log shows `CONFIG SpeedFactor=<n> ResetOnStartup=true` and `RESET end …`. The seed is loaded; the simulation runs with the fixed values of `lite-configuration.md` section 2 (all automatic steps ON, traffic ON, failure rates 0 %). Browsers opened before the restart are reloaded. |
| **S2** Speed 10× | The app runs with `Simulation.SpeedFactor = 10` (set in S1; the default of the tests). Traffic cannot be switched off in Lite: up to 8 simulated orders are open at any time. |
| **S3** Settled seed | After S1, wait until the server log shows a final `ORDER` line (`-> DELIVERED`, `-> PICKED_UP` or `-> CANCELLED`) for every open seed order of `09-demo-data/orders.json` (about 90 s at 10×, about 11 minutes at 1×). From then on the kitchen and the couriers handle only the test's orders and at most 8 simulated orders. The kitchen is never empty for sure; tests that time durations therefore time only steps that do not depend on the queue (section 3.3 of `README.md`). |
| **S4** Server log | The test reads the server log of the running app (location in `RUN/operations.md`) from the start of S1 and filters the INFO lines of the log node `Simulation`. |
| **S5** Guest browser | New private window (new guest session). Desktop 1440 × 900 unless the test says phone (390 × 844). |
| **S6** Second guest | Another browser profile or private window with its own guest session, used at the same time as S5. |
| **S7** Long run | The app is started with S1 and kept running without restart for the time the test states (hours). |

#### Test time window and the daily reset

- The app resets itself every day at 04:00 store time (`America/Los_Angeles`, A-42, SIM-08). A reset during a test deletes the test's orders and carts, so no test may run across 04:00 except the optional scheduled-reset step of E2E-08. A test interrupted by the reset (server log `RESET start by scheduled`) is repeated after S1 and is not counted as failed.
- Tests run between **02:00 and 24:00 store time** (A-31). The seed orders are placed up to about 2 hours before the reset moment; before 02:00 some of them would fall on the previous store day and the KPIs `DEPLOYED_TODAY` and `AVG_PIPELINE_TIME` would differ from the values in TC-033.
- `RUN/operations.md` states how the app handles these times (A-31, A-42); the tests do not change the server clock.

### 2.2 Fictional test persons and addresses

All guest data used in tests is fictional (`NFR-13.3`). Seed orders are found on SCR-10 with their order number and the contact email of `09-demo-data/orders.json` (for example `MX-1040` and `jordan.lee@example.com`).

| Code | Data |
|---|---|
| **G1** guest, in zone 94110 (0.8 mi) | Taylor Brooks · `taylor.brooks@example.com` · `(415) 555-0123` · 3150 18th Street, Apt 2, San Francisco, CA 94110 · notes "Buzz #2, side door on Shotwell" |
| **G2** guest, in zone 94103 (1.4 mi) | Sam Rivera · `sam.rivera@example.com` · `(415) 555-0124` · 850 Brannan Street, Suite 300, San Francisco, CA 94103 |
| **G3** address outside the zone | 5200 Geary Boulevard, San Francisco, CA **94121** |
| **X1** injection strings | `<script>alert(1)</script>` · `<img src=x onerror=alert(1)>` · `"><b>bold</b>` |

### 2.3 Calculated price examples

All amounts follow `BR-PRICE-01` – `BR-PRICE-15` with the catalog prices of `menu-catalog.md`. Worked examples A – D are in `information-model.md` section 6.1. Additional examples used below:

| Code | Cart and options | Subtotal | Discount | Delivery fee | Tax 8.625 % | Tip | **Total** |
|---|---|---|---|---|---|---|---|
| **A** | Example A: Inferno Payload L, Binary BBQ L, Mate Compiler Tonic × 2; delivery; tip 15 % | 55.50 | 0.00 | 0.00 (threshold) | 4.79 | 8.33 | **68.62** |
| **A20** | Example A with tip 20 % | 55.50 | 0.00 | 0.00 | 4.79 | 11.10 | **71.39** |
| **A0** | Example A with tip 0 % | 55.50 | 0.00 | 0.00 | 4.79 | 0.00 | **60.29** |
| **B** | Example B: The Root Pizza M, Garlic Knot Loop; `GITHUB_STUDENT`; delivery; tip 15 % | 21.49 | −3.22 | 3.99 | 1.58 | 2.74 | **26.58** |
| **D** | Example D: guest, Quad-Core Formaggi S, Cold Brew Commit; no coupon; pickup | 18.74 | 0.00 | 0.00 | 1.62 | 0.00 | **20.36** |
| **P1** | Inferno Payload L + extra Cherry tomatoes (EX-11, STANDARD, 2.50) = 25.00 (fresh jalapeños are unavailable in the Lite seed and are left out without price change); Mate Compiler Tonic 4.50; `GITHUB_STUDENT` (15 % of 29.50 = 4.425 → 4.43); delivery; tip 15 % (25.07 × 15 % = 3.7605 → 3.76); tax 25.07 × 8.625 % = 2.1622875 → 2.16 | 29.50 | −4.43 | 3.99 | 2.16 | 3.76 | **34.98** |
| **P2** | SQL Supreme M; `FREE_DISPATCH`; delivery; tip 15 % (18.49 × 15 % = 2.7735 → 2.77); tax 18.49 × 8.625 % = 1.5947625 → 1.59 | 18.49 | 0.00 | 0.00 (coupon) | 1.59 | 2.77 | **22.85** |
| **P2-pickup** | P2 switched to pickup: coupon NOT_APPLIED "FREE_DISPATCH is valid for delivery orders only" | 18.49 | 0.00 | 0.00 | 1.59 | 0.00 | **20.08** |
| **P3** | Boolean Pepperoni M; `GITHUB_STUDENT` → NOT_APPLIED "Add $3.01 more to use GITHUB_STUDENT" | 16.99 | 0.00 | — | — | — | — |
| **P4** | Binary BBQ L × 4; `GITHUB_STUDENT` (15 % of 96.00 = 14.40, capped at 10.00); delivery; tip 15 % (86.00 × 15 % = 12.90); tax 86.00 × 8.625 % = 7.4175 → 7.42 | 96.00 | −10.00 | 0.00 (threshold) | 7.42 | 12.90 | **106.32** |
| **P6** | The Root Pizza M with cheese CH-03 Vegan Cashew Mozzarella (+1.50) — unit price | 16.49 | | | | | allergens GLUTEN, TREE_NUTS; vegetarian yes; vegan yes |
| **P7** | Low-Mem Garden M with crust CR-04 Cheese-Stuffed v2 (+2.50) — unit price | 19.49 | | | | | allergens GLUTEN, MILK, TREE_NUTS; vegetarian yes; vegan **no** |
| **P8** | The Root Pizza S with crust CR-05 Gluten-Free Fork (+3.00) — unit price | 14.99 | | | | | allergens MILK only; after switching to Large: crust resets to CR-01, price 17.99, allergens GLUTEN, MILK |
| **C** | Example C: Boolean Pepperoni L, CR-04, CH-02, extras Cherry tomatoes (EX-11, STANDARD; replaces the unavailable Jalapeños at the same price) + 'Nduja, oregano removed — unit price | 30.99 | | | | | |
| **P10** | The Root Pizza S 11.99 + Cola Cache 2.75; delivery blocked (14.74 < 15.00, `BR-PRICE-13`); as pickup: tax 14.74 × 8.625 % = 1.271325 → 1.27 | 14.74 | 0.00 | — | 1.27 | 0.00 | **16.01** (pickup) |
| **P11** | Low-Mem Garden M 16.99 + Lemon Lint Soda 3.25; pickup; tax 20.24 × 8.625 % = 1.7457 → 1.75 | 20.24 | 0.00 | 0.00 | 1.75 | 0.00 | **21.99** |

### 2.4 Effective durations

From `order-lifecycle.md` section 7 (`ceil(base / factor)`, minimum 1 s).

| Duration | 1× | 2× | 5× | 10× |
|---|---|---|---|---|
| `paymentProcessing` | 3 | 2 | 1 | 1 |
| `paymentTimeout` (AMEX •••• 0005) | 10 | 5 | 2 | 1 |
| `paymentFailedTimeout` | 600 | 300 | 120 | 60 |
| `queueWait` | 20 | 10 | 4 | 2 |
| `bake` | 90 | 45 | 18 | 9 |
| `qa` | 30 | 15 | 6 | 3 |
| `courierToStore` | 30 | 15 | 6 | 3 |
| `handover` | 5 | 3 | 1 | 1 |
| Trip 94110 (0.8 mi, 92 s) / 94103 (1.4 mi, 116 s) / 94105 (2.8 mi, 172 s) | 92 / 116 / 172 | 46 / 58 / 86 | 19 / 24 / 35 | 10 / 12 / 18 |
| `pickupArrival` | 90 | 45 | 18 | 9 |
| Traffic interval 120 s (± 20 %) | 120 | 60 | 24 | 12 |
| Courier return trip = delivery trip | 92 / 116 / 172 | 46 / 58 / 86 | 19 / 24 / 35 | 10 / 12 / 18 |

---

## 3. End-to-end scenarios

### E2E-01 Guest delivery order, happy path — M

**Journey:** product brief section 6, journey 1. **Covers:** Stories US-012, US-032, US-034, US-049, US-051, US-069, US-070, US-073, US-091, US-124, US-128, US-137; EP-01 – EP-07, SCR-01 – SCR-09, T-01, T-02, T-08, T-10, T-11, T-14, T-15, SIM-01, SIM-02, SIM-04, SIM-07. **Setup:** S1 at 1× (realistic speed), S4, S5 (desktop). **Data:** P1, G1, `VISA_4242`.

1. Open the app URL. → SCR-01 with the official logo, hero "Architect Your Perfect Crust", DEMO MODE banner, featured modules; no sign-in requested.
2. Choose `git checkout menu` (or `./menu.ts`). → SCR-02 `pizzas.json` tab active; Inferno Payload card shows `$18.49 · 12"`, `HOT` spice indicator and its photo.
3. Configure Inferno Payload: size Large, add extra Cherry tomatoes. → The recipe item fresh jalapeños and extra EX-09 are shown as `SOLD_OUT` (TXT-CONF-24); SCR-03 shows unit price **$25.00**, allergens GLUTEN, MILK, the extra in the `manifest.json` preview.
4. Add to cart; then on `drinks.env` add Mate Compiler Tonic. → Cart count 2; the desktop Terminal Debugger panel shows both lines and subtotal **$29.50**.
5. Open the cart (SCR-05), apply `GITHUB_STUDENT`. → State APPLIED, description "Student discount: 15% off, up to $10.", discount **−$4.43**.
6. Go to checkout (SCR-06). Choose delivery, enter G1 contact and address, keep tip 15 %, choose Card → `Visa •••• 4242`. → ZIP 94110 accepted; summary: subtotal $29.50, discount −$4.43, delivery fee $3.99, sales tax $2.16, tip $3.76, total **$34.98**.
7. Press `Execute Order --force`. → SCR-07 opens in processing state within 1.5 s (`NFR-05.7`).
8. Wait. → After about 3 s SCR-08 `DEPLOYMENT SUCCESSFUL // 200 OK` shows order number `MX-` + number, commit hash `#` + 7 hex characters with a copy action, ETA, payment reference `txn_sim_` + 12 hex characters. The cart is now empty.
9. Choose "Monitor pipeline". → SCR-09: stepper at stage 1 `QUEUED` with the queue position; log shows the T-01 and T-02 lines (`[INIT] Order MX-… staged. Commit #… signed.`, `[PAYMENT] Payment confirmed. TxID txn_sim_…`, `[KITCHEN] Order queued at position N.`); server log: `PAYMENT_PENDING -> QUEUED by sim/payment-gateway`.
10. Keep SCR-09 open without reloading. → Stage 2 `BAKING` with oven name and bake progress, then stage 3 `QA_CHECK`, then stage 4 `DISPATCH` "Waiting for courier" and then "Courier on the way" with the courier's node handle; each change appears within 5 s; new log lines appear for each step.
11. Watch the map while `IN_TRANSIT`. → Courier marker moves along the route; ETA countdown `ETA mm:ss · ~HH:mm` and distance remaining (starting at `0.8 mi`) decrease.
12. Wait for delivery. → Stage 5 `DEPLOYED` complete; log line `[DEPLOY] Delivered. Enjoy your build!`; server log: one `ORDER` line per transition up to `OUT_FOR_DELIVERY -> DELIVERED by sim/courier`; the whole order completed within about 10 minutes of payment (queue load from traffic may add time).
13. Copy the tracking URL, open it in a new private window. → Same order and state, in a new guest session.

### E2E-02 Failed payment and recovery — M

**Journey:** product brief section 6, journey 2. **Covers:** Stories US-113; EP-04, EP-05, EP-06, EP-07, T-01, T-03, T-05, T-02, SIM-01. **Setup:** S1, S2, S4, S5. **Data:** Example B, G2, `VISA_0002`, then Apple Pay.

1. Build the cart of Example B (The Root Pizza M, Garlic Knot Loop, `GITHUB_STUDENT`). Checkout as delivery with G2, tip 15 %, Card → `Visa •••• 0002`. → Total **$26.58**.
2. `Execute Order --force`. → SCR-07 processing, then the failure state: "Card declined by issuer", attempt 1 of 3, actions "Retry payment" and "Cancel order", method re-selection available. Order status `PAYMENT_FAILED`.
3. Check the server log and open `./track.log` (the latest order of the session) in a second tab. → Server log: `PAYMENT_PENDING -> PAYMENT_FAILED by sim/payment-gateway`; SCR-09 shows no stage reached, the banner `PAYMENT_FAILED //` Card declined by issuer. Retry the payment or cancel the order. (TXT-TRK-15) with "Retry payment" and "Cancel order", and the log line `[PAYMENT] ERROR 402: Card declined by issuer. Attempt 1 of 3.`
4. Back on SCR-07, change the method to Apple Pay and press "Retry payment". → Processing, then SCR-08 confirmation. The charged amount is still **$26.58**.
5. Check the server log, SCR-09 and the receipt (SCR-13). → Server log for the order, in this order and once each: `NEW -> PAYMENT_PENDING by guest`, `PAYMENT_PENDING -> PAYMENT_FAILED`, `PAYMENT_FAILED -> PAYMENT_PENDING by guest`, `PAYMENT_PENDING -> QUEUED by sim/payment-gateway`; SCR-09 log shows both `[PAYMENT]` results; SCR-13 shows Apple Pay, $26.58 and a `txn_sim_` ID. The guest cart is empty only now.
6. Follow the order on SCR-09 until `DEPLOYED`. → Completes normally.

### E2E-06 Guest pickup order on a phone — M

**Covers:** Stories US-053; EP-01 (phone layout), EP-02, EP-03, EP-05, EP-06, EP-07, NFR-03, NFR-04. **Setup:** S1, S2. **Device:** a real iPhone with Safari (and Chrome DevTools at 390 × 844 for the Chrome run). **Data:** P11, Google Pay.

1. Open the app on the phone. → Phone layout: 56 px header with logo and cart (no account button); bottom tabs `Source · Deploy · Trace`; DEMO MODE banner; no horizontal scrolling.
2. Tab `Source`, open Low-Mem Garden, keep the defaults, add to cart; add Lemon Lint Soda from `drinks.env`. → Configurator as a full page; `<Vegan />` badge; cart count 2.
3. Tab `Deploy` (cart as a full page), go to checkout, choose pickup, enter G1 contact data, Google Pay. → Total **$21.99**; all fields and buttons reachable with the on-screen keyboard open; touch targets ≥ 44 px.
4. Execute Order. → Payment as a bottom sheet, then the confirmation.
5. Tab `Trace`. → Tracking page in phone layout; stepper reaches `READY_TO_PULL` and then `PULLED`.
6. Rotate the phone to landscape on the tracking page. → Layout adapts; nothing is cut off.

### E2E-07 Whole business live: guest view, KPIs and server log — M

**Covers:** Stories US-023, US-114, US-265; NFR-06.2, NFR-07, NFR-17.3 – 17.5, EP-02, EP-07, EP-10, EP-13, EP-14, SIM-02, SIM-04, SIM-05, SIM-09. **Setup:** S1, S2, S4; three guest browsers: (A) S5, (B) S6, (C) a third guest session on SCR-01. Run for 15 minutes.

1. Place three orders in A (one delivery to 94105, one delivery to 94110, one pickup) and one delivery order in B. → Each shows SCR-08 with order number and queue position; the server log shows `PAYMENT_PENDING -> QUEUED` for each within 5 s of Execute Order.
2. Keep the SCR-09 pages of all four orders open and compare them with the server log during the whole run. → Each page shows the state of the last `ORDER` line of its order within 5 s; the queue position, bake progress, courier card and ETA change without reload.
3. Watch the traffic in the server log. → `SPAWN` lines arrive 9.6 – 14.4 s apart (plus up to 2 s tick latency) while fewer than 8 simulated orders are open; the number of open simulated orders (seed simulated orders and `SPAWN` orders without a final `ORDER` line) never exceeds 8; every `SPAWN` order gets its payment result from `sim/payment-gateway` (US-114).
4. Check the capacity invariants from the server log. → At no moment more than 6 orders are in `BAKING` (2 ovens × 3 slots); no courier gets a second order before its `RETURNING -> AVAILABLE` line; `CU-05` never appears in a `COURIER` line; each order has exactly one line per transition (NFR-17.3).
5. Watch browser C (SCR-01). → Without reload, within 10 s of the matching server log lines: `DEPLOYED_TODAY` grows by one for every `-> DELIVERED` or `-> PICKED_UP` line; `KITCHEN_LOAD` equals the number of orders in `BAKING` / 6; `COURIERS_ON_DUTY` stays 4. The KPIs are the only data about simulated orders the guest receives.
6. At the end, check every screen and the log. → No error page, no platform error popup, no frozen timer, no ERROR line in the server log; all four test orders reached `DEPLOYED` or `PULLED`.

### E2E-08 Demo reset by restart — M

**Covers:** Stories US-270 (see also TC-271); NFR-16, NFR-17, EP-14, EP-15, SIM-08, BR-DATA-09, LITE-CFG-07. **Setup:** S1, S2, S4, S5, S6.

1. Use the app as guests: in S5 place a delivery order with G1 and keep its tracking page open; in S6 leave a non-empty cart (The Root Pizza M, Cola Cache). Note the order number and the tracking link.
2. Restart the app with `Simulation.ResetOnStartup = true` (no other change). → Server log, in this order: `CONFIG SpeedFactor=10 ResetOnStartup=true`, `RESET start by startup`, `RESET end orders=<n> duration=<s>s` with s ≤ 60; no ERROR line.
3. Check both browsers within 10 s after the app answers again (reload allowed if the browser lost the connection). → The tracking page shows the invalid-link state (`ERROR 404 // DEPLOYMENT_NOT_FOUND`); the S6 cart is empty; where the session survived the restart, the reset toasts TXT-ERR-21 and TXT-ERR-22 are shown once; no error page or platform popup anywhere.
4. Verify the seed as a guest. → SCR-02: 12 / 5 / 5 / 3 products with catalog prices, Tiramisu Stack sold out, extra Jalapeños unavailable; `GITHUB_STUDENT` and `FREE_DISPATCH` apply, `HOTFIX10` is expired; SCR-10 finds `MX-1040` and `MX-1009` with `jordan.lee@example.com` and `MX-1023` with `tom.becker@example.com`; the order of step 1 is not found with `taylor.brooks@example.com`; SCR-01 KPI `COURIERS_ON_DUTY` 4.
5. Place a new order. → Its number is higher than every order number in the server log since the reset and at least `MX-1047` (BR-DEMO-05); no seed number is re-used.
6. Restart again with `ResetOnStartup = true`. → Same result as steps 2 and 4 (SIM-08 C8).
7. *(Optional, long run S7.)* Keep the app running across 04:00 store time with a guest on SCR-09 of an open order. → Server log `RESET start by scheduled` at 04:00 (± 1 minute) and `RESET end …` within 60 s; the open page shows the toast TXT-ERR-21 ("Demo data was reset by the system at 04:00.") and the invalid-link state within 10 s, without an error page (NFR-16.4).

---

## 4. Test cases per epic

### EP-01 Shell, navigation and branding

#### TC-001 Customer header and desktop sidebar — M
**Covers:** Stories US-001, US-002, US-007, US-012, US-135; SCR-16, BR-NAV. **Setup:** S1, S5.
1. Open SCR-01 at 1440 px. → Header with official logo, nav `./main.js`, `./menu.ts`, `./checkout.yml`, `./track.log`, search, cart button with count, and no account button; Project Explorer sidebar (`src/pizza-mxdev/`) with Root, Categories (expanding to the four category files), New Branch, without `Logs` and `Settings`; footer.
2. Click each nav item. → Opens SCR-01, SCR-02, SCR-06 (or the empty-cart hint), SCR-10 (guest without order) respectively; the active item is highlighted.
3. Hover or focus each dev label. → Plain meaning available (tooltip, sub-label or accessible name), for example `./checkout.yml` = Checkout.

#### TC-002 Phone layout of the shell — M
**Covers:** Stories US-003, US-011; SCR-16 phone, NFR-03. **Setup:** S5 at 390 × 844.
1. Open SCR-01. → Header 56 px with logo and cart, no account button; no sidebar; bottom tab bar with exactly three tabs `Source · Deploy · Trace` (Menu, Cart, Track) at the bottom with safe-area spacing.
2. Tap each tab. → Opens menu, cart (full page), and tracking (latest order of the session) or the lookup SCR-10; tapping the logo opens Home.

#### TC-003 Exact breakpoints — M
**Covers:** Stories US-011; NFR-03.1, `tokens.md` section 5. **Setup:** S5, responsive mode.
1. Set the width to 767 px, then 768 px. → 767: phone layout (bottom tabs); 768: tablet layout (header nav, sidebar as icon rail or menu button).
2. Set 1199 px, then 1200 px. → 1199: tablet layout; 1200: desktop layout with 256 px sidebar.
3. Repeat on SCR-02, SCR-06 and SCR-09 of an own order. → Same switch points on every screen.

#### TC-004 DEMO MODE banner — M
**Covers:** Stories US-004; SCR-16, NFR-13.2, product brief section 7. **Setup:** S5.
1. Visit SCR-01, SCR-02, SCR-06, SCR-09, SCR-10, SCR-13 and SCR-40 (unknown URL). → The DEMO MODE banner is visible on each, stating that payment, kitchen and delivery are simulated and that no real order is placed or charged.
2. Inspect the banner at 1440 px and at 390 px. → No close button and no role switch or sign-in link; at 390 px the shortened text fits on one line without horizontal scrolling.

#### TC-006 Official brand only — M
**Covers:** Stories US-006; NFR-20.1, product brief section 8. **Setup:** S5.
1. Inspect SCR-01, SCR-08, SCR-09, SCR-13, SCR-40, SCR-41 (opened as in TC-283) and the browser tab. → Only the Pixel Slice logo files (horizontal logo in the headers, mark on SCR-01 and SCR-08, slice favicon in the tab; `07-design-system/logo-usage.md` section 5); the brand name is not repeated as text next to the horizontal logo; in text the name is written "Git Pizza MxDev".
2. Search the visible text and page titles of all screens visited during the test run for `PIZZA_OS`, "Pizza MxDev Logo". → Not found. No triangle logo, Stitch logo variant or the previous raster "git tree pizza" logo appears.
3. Check the page title of five screens. → Each is unique and contains "Git Pizza MxDev".

#### TC-007 Header and sidebar states: empty cart, cart, own order — M
**Covers:** Stories US-001, US-002, US-007, US-073; SCR-16. **Setup:** S1, S2, S5.
1. As a new guest with an empty cart. → Cart count hidden or 0; `./checkout.yml` disabled with a hint that the cart is empty; no account button, no sign-in or sign-up link in header, sidebar, banner or footer; `Active_Deployments` is not shown in the sidebar.
2. Add one item. → Count 1; checkout enabled.
3. Place the order and return to SCR-01. → The sidebar shows `Active_Deployments` with this order and its status badge; clicking it opens its SCR-09.
4. Scroll to the footer. → Store line TXT-NAV-35, version line TXT-NAV-36 and the links `menu.ts`, `track.log`, `allergens.md` (TXT-NAV-37 – 39; `allergens.md` opens the allergen notice in a dialog); no link to kitchen, management or demo access pages and no dead links.

#### TC-009 No horizontal scroll, touch targets — M
**Covers:** Stories US-011; NFR-03.2, NFR-03.3. **Setup:** S5 at 320 px and 390 px.
1. Visit SCR-01, SCR-02, SCR-03, SCR-05, SCR-06, SCR-09 (own order), SCR-10, SCR-13. → No horizontal page scroll (only inside tables, code blocks or log panes).
2. Measure buttons, tabs, chips and checkboxes with the element inspector. → Each touch target ≥ 44 × 44 px.

### EP-02 Menu browsing

#### TC-021 Home page content — M
**Covers:** Stories US-021, US-022, US-023; SCR-01. **Setup:** S1, S5.
1. Open SCR-01. → Hero "Architect Your Perfect Crust", terminal intro, `git checkout menu` CTA, demo KPIs, featured modules carousel.
2. Inspect the carousel. → Exactly the 6 featured products: The Root Pizza, Boolean Pepperoni, SQL Supreme, Binary BBQ, Inferno Payload, Low-Mem Garden, with card prices $14.99, $16.99, $18.49, $19.99, $18.49, $16.99.

#### TC-022 Categories and card prices — M
**Covers:** Stories US-025; SCR-02, BR-MENU, BR-PRICE-01. **Setup:** S1, S5.
1. Open SCR-02. → File tabs `pizzas.json`, `sides.yml`, `drinks.env`, `desserts.md` in this order, with plain names Pizzas, Sides & Dips, Drinks, Desserts.
2. Count the products per tab. → 12, 5, 5, 3.
3. Check cards. → The Root Pizza `$14.99 · 12"`; Calzone Container `$16.49 · 12"`; Garlic Knot Loop `$6.50`; Mate Compiler Tonic `$4.50`; Lava Exception Cake `$7.25`. Every name and price equals `menu-catalog.md`.

#### TC-023 Product card content — M
**Covers:** Stories US-025, US-026, US-028; SCR-02, `assets/README.md` section 2. **Setup:** S5.
1. Inspect the Binary BBQ card. → Photo `pz-04-binary-bbq.jpg`; dev name, real-world name "BBQ pulled pork", short description, code-style ingredient block, `<ChefPick />` badge, Configure and `+ import` actions.
2. Inspect The Root Pizza card. → Product photo `pz-01-root-pizza.jpg` with the alt text from the catalog (no placeholder); badges `<Classic />`, `<Vegetarian />`.
3. Inspect Inferno Payload and Low-Mem Garden. → Spice level `HOT` shown on Inferno Payload; `<Vegan />` on Low-Mem Garden.

#### TC-024 Search — M
**Covers:** Stories US-027; SCR-02, BR-MENU. **Setup:** S5.
1. Search `inferno`. → Inferno Payload is found within 1 s.
2. Search `xyz123`. → No-results state with a way to clear the search (illustration placeholder allowed).
3. Search `'%_` and an emoji. → No error; no-results state (`NFR-12.3`).

#### TC-025 Item info and allergens — M
**Covers:** Stories US-029, US-030; SCR-04, BR-MENU. **Setup:** S5.
1. Open Caesar Cipher Salad (SD-02). → SCR-04 (phone: bottom sheet) with description, serving "1 bowl", price $8.95, allergens GLUTEN, MILK, EGGS, FISH, MUSTARD, calories 430, and the allergen notice of `menu-catalog.md`.
2. Set quantity 2 and add to cart. → Cart line Caesar Cipher Salad × 2 = $17.90.
3. Open item info of Cold Brew Commit. → Allergens: none; caffeine 200 mg; `<Vegan />`.

#### TC-028 Live build status on Home — M
**Covers:** Stories US-024; SCR-01 "with active order", NFR-07. **Setup:** S1, S5.
1. Place an order as guest and return to SCR-01. → A live build status panel shows the order and its current stage.
2. Wait without reloading. → The stage updates within 10 s of each change; after delivery the panel shows the final state `DEPLOYED` for 60 s and then disappears (SCR-01 section 5, E-13).
3. Open SCR-01 in a second guest session (S6). → No live build status panel: the order of the first session is not shown.

#### TC-029 Sold-out product in the seed — M
**Covers:** Stories US-031; SCR-02, SCR-04, BR-DATA-12, `lite-configuration.md` section 2. **Setup:** S1, S5.
1. Open SCR-02 on `desserts.md`. → Tiramisu Stack keeps its place, shows `SOLD_OUT` / `404: OUT_OF_STOCK`, its image is dimmed and `+ import` is disabled.
2. Open the item info (SCR-04) of Tiramisu Stack, also by its direct URL if it has one. → Sold-out state; quantity and add are disabled.
3. Open Inferno Payload and Hawaiian Legacy Fix. → Both are orderable (their removable ingredient `jalapeno` is out of stock, US-051); no other product is sold out.

#### TC-030 Terminal Debugger cart panel — M
**Covers:** Stories US-032; SCR-02, SCR-05, SCR-06. **Setup:** S5 at 1440 px.
1. Open SCR-02 with an empty cart. → A 320 px right panel `Terminal Debugger` (`session: active_order`) shows the empty-cart lines TXT-MENU-40; `EXECUTE ORDER` is disabled with the hint TXT-NAV-06.
2. Add The Root Pizza M and Cola Cache × 2. → Without reload the panel shows `[INFO] 3 dependencies installed.`, one `[OK]` line per cart line (quantity, name, size, line total; TXT-MENU-41) and `Total Output:` $20.49 (TXT-MENU-42).
3. Press `cat MANIFEST.LOCK` (TXT-MENU-44), then on SCR-02 `EXECUTE ORDER` (TXT-MENU-43). → SCR-05, then SCR-06 opens.
4. Set the width to 1199 px. → The panel is not shown.

#### TC-031 Dietary quick filter — C
**Covers:** Stories US-033; SCR-02, BR-DATA-10. **Setup:** S5.
1. On `pizzas.json` select `--vegetarian` (TXT-MENU-46). → Exactly The Root Pizza, Truffle Kernel, Quad-Core Formaggi, The Clean Code and Low-Mem Garden.
2. Select `--vegan` instead. → Only Low-Mem Garden; on `drinks.env` all 5 drinks.
3. `--vegan` on `desserts.md`. → Empty state TXT-MENU-65 with `Show all`.
4. Search `garden` with `--vegan` active. → Low-Mem Garden only (filter and search combine).

#### TC-032 Menu loading state — S
**Covers:** Stories US-034; SCR-02 "loading", US-287. **Setup:** S5, browser network throttling "Slow 3G".
1. Open SCR-02 with a cold cache. → Skeleton cards in the card layout while the products load; no empty page and no layout jump when the data arrives.
2. Set the browser offline and switch the category tab or reload the product list. → The connection notice of US-287 with a retry action; going online and retrying shows the products.

#### TC-033 Home page KPIs from live data — M
**Covers:** Stories US-023; SCR-01 KPI tiles, BR-MENU-17, BR-SIM-16d, LITE-SEC-02, NFR-07, NFR-15.5. **Setup:** S1 at 1× (`Simulation.SpeedFactor = 1`), S4, S5. Run inside the test time window (section 2.1).
1. Open SCR-01 within 5 s after `RESET end`. → Four tiles `DEPLOYED_TODAY`, `AVG_PIPELINE_TIME`, `KITCHEN_LOAD`, `COURIERS_ON_DUTY` with their plain labels. Values derived from the seed: `DEPLOYED_TODAY` 7 plus one for every `-> DELIVERED` / `-> PICKED_UP` line written since the reset; `KITCHEN_LOAD` = number of orders in `BAKING` / 6 as `n/6 · p%` (TXT-MENU-63; seed: `3/6 · 50%`); `COURIERS_ON_DUTY` 4; `AVG_PIPELINE_TIME` `05:07` (seed orders only) in `mm:ss`.
2. Keep SCR-01 open for 3 minutes without reloading and compare with the server log. → Each value follows the log within 10 s: `DEPLOYED_TODAY` grows by one per completed order of any source; `KITCHEN_LOAD` follows the `-> BAKING` and `BAKING -> QA_CHECK` lines; `AVG_PIPELINE_TIME` changes when an order completes (mean of completion time − payment time of today's completed orders, ± 2 s).
3. Inspect the network responses of SCR-01. → The KPIs arrive as the four values only: no order, order number, contact data, courier or oven record of other sessions (LITE-SEC-02).
4. Search the page for fixed marketing numbers (`99.9% Uptime`, `12k+ Nodes`). → None (US-023 AC4).

### EP-03 Pizza configurator

#### TC-041 Sizes and default configuration — M
**Covers:** Stories US-041, US-042, US-044; SCR-03, BR-PRICE-02. **Setup:** S5.
1. Configure Inferno Payload. → Defaults: Medium 12", crust `neapolitan_core` Neapolitan Core, sauce `san_marzano`, cheese `buffalo_mozzarella` without surcharge, recipe items spianata calabrese (fixed), Calabrian chili oil, crushed red pepper; fresh jalapeños shown as `SOLD_OUT` (TXT-CONF-24) and not included; price $18.49.
2. Switch to Small, then Large. → $14.49, then $22.50.
3. Configure Calzone Container. → Only Medium 12" available ($16.49); crust fixed to Neapolitan Core.

#### TC-042 Configured price and manifest preview — M
**Covers:** Stories US-044, US-048, US-052; SCR-03, BR-PRICE-02, BR-PRICE-03, Example C. **Setup:** S5.
1. Configure Boolean Pepperoni: Large, crust Cheese-Stuffed v2, cheese Buffalo Mozzarella, extras Cherry tomatoes and 'Nduja, remove oregano. → Unit price **$30.99**, updated after each change within 0.5 s.
2. Inspect the `manifest.json` preview. → Contains size, crust, sauce, cheese, the two extras and the removal of oregano, consistent with the selections.

#### TC-043 Allergen and dietary recalculation — M
**Covers:** Stories US-047; BR-DATA-10, BR-DATA-11, P6, P7. **Setup:** S5.
1. The Root Pizza M, change cheese to Vegan Cashew Mozzarella. → $16.49; allergens GLUTEN, TREE_NUTS (MILK gone); vegetarian and vegan flags shown.
2. Low-Mem Garden M, change crust to Cheese-Stuffed v2. → $19.49; allergens GLUTEN, MILK, TREE_NUTS; vegan flag removed, vegetarian kept.

#### TC-044 Crust availability by size — M
**Covers:** Stories US-042, US-043; SCR-03 "option unavailable", `menu-catalog.md` section 4.1, P8. **Setup:** S5.
1. The Root Pizza, Small, crust Gluten-Free Fork. → $14.99; allergens MILK only.
2. Switch to Large. → Crust resets to Neapolitan Core with a notice explaining why; price $17.99; allergens GLUTEN, MILK.
3. Choose Small. → Cheese-Stuffed v2 is shown as not available for this size.

#### TC-045 Maximum extras — M
**Covers:** Stories US-045; SCR-03 "max extras reached", BR-CONF. **Setup:** S5.
1. Calzone Container: add 3 extras. → Further extras disabled with a "max 3" message.
2. SQL Supreme: add 5 extras. → Sixth disabled ("max 5").
3. Add Pepperoni as extra on Boolean Pepperoni. → Allowed (extra portion).

#### TC-046 Removing ingredients — M
**Covers:** Stories US-046; SCR-03, BR-PRICE-02. **Setup:** S5.
1. The Root Pizza M: unlink fresh basil. → Price stays $14.99; manifest shows the removal.
2. Binary BBQ: try to remove hickory-smoked pulled pork. → Not removable (fixed).

#### TC-048 Edit a cart line — M
**Covers:** Stories US-050; SCR-03 "editing a cart line", SCR-05. **Setup:** S5.
1. Add The Root Pizza M to the cart; in the cart choose edit on that line. → SCR-03 opens with the line's configuration.
2. Change to Large and save. → The same cart line is updated to Large $17.99; no second line is created.

#### TC-049 Unavailable option and ingredient in the seed — M
**Covers:** Stories US-051; SCR-03 "option unavailable", BR-DATA-12, `lite-configuration.md` section 2. **Setup:** S1, S5.
1. Open Inferno Payload. → Extra EX-09 Jalapeños is disabled with `SOLD_OUT` (TXT-CONF-24); the recipe item fresh jalapeños is shown as `SOLD_OUT` (TXT-CONF-24) and is removed from the configuration automatically; price $18.49; the pizza can be added to the cart.
2. Add it, open the cart line in the configurator again. → Fresh jalapeños are still excluded; saving works.
3. Open Hawaiian Legacy Fix and The Root Pizza. → Hawaiian Legacy Fix orderable without jalapeños; EX-09 is disabled on both.
4. Search `jalap`. → Inferno Payload, Hawaiian Legacy Fix and Jalapeño Patch Dip are found; the dip can be added.

### EP-04 Cart and coupons

#### TC-061 Adding and merging lines — M
**Covers:** Stories US-049, US-061; SCR-05, CartLine.configurationKey. **Setup:** S5.
1. Add The Root Pizza M with default configuration twice. → One line with quantity 2, line total $29.98.
2. Add The Root Pizza M without basil. → A second, separate line.

#### TC-062 Quantity, remove, clear — M
**Covers:** Stories US-061, US-063, US-064, US-065; SCR-05, BR-CART. **Setup:** S5.
1. Increase a line to 10. → Increase disabled at 10.
2. Decrease to 1. → Decrease stops at 1 (removal is a separate action).
3. Remove the line (`rm`). → Line gone; totals updated within 1 s.
4. With two lines, press `CLEAR (rm -rf)`. → Confirmation asked; after confirming the cart is empty.

#### TC-063 Coupon applied, cap — M
**Covers:** Stories US-066, US-068, US-069; BR-PRICE-05, BR-PRICE-06, Example B, P4. **Setup:** S5.
1. Example B cart, apply `github_student` (lower case). → Applied (case-insensitive); discount −$3.22; description shown.
2. Cart of 4 × Binary BBQ L. → Discount capped at −$10.00.
3. Apply `FREE_DISPATCH` on the same cart. → It replaces `GITHUB_STUDENT` (one coupon per cart).

#### TC-064 Coupon errors — M
**Covers:** Stories US-067; BR-PRICE-06 checks 1, 2, 6, P3. **Setup:** S5.
1. Apply `PIZZA2026`. → "Coupon not found: PIZZA2026"; code not attached.
2. Apply `HOTFIX10`. → "Coupon HOTFIX10 has expired"; not attached.
3. Cart Boolean Pepperoni M, apply `GITHUB_STUDENT`. → NOT_APPLIED "Add $3.01 more to use GITHUB_STUDENT"; no discount; checkout still possible.
4. Add Cola Cache ($2.75 → subtotal $19.74). → Message changes to "Add $0.26 more to use GITHUB_STUDENT". Add a second Cola Cache → APPLIED.

#### TC-065 Coupon conditions — M
**Covers:** Stories US-094; BR-PRICE-06 checks 1 and 5, P2, Example D. **Setup:** S5.
1. P2 cart with `FREE_DISPATCH`, delivery. → Applied; delivery fee $0.00; total $22.85.
2. Switch to pickup on SCR-06. → NOT_APPLIED "FREE_DISPATCH is valid for delivery orders only"; total $20.08; the order can still be placed.
3. Switch back to delivery. → APPLIED again; fee $0.00.
4. Example D cart, pickup, apply `NOPE42`. → "Coupon not found: NOPE42" (unknown code); total $20.36.

#### TC-066 Empty cart — M
**Covers:** Stories US-062; SCR-05 "empty cart". **Setup:** S5.
1. Open the cart with no items. → Empty state with the illustration `empty-cart.png` and a way to the menu; checkout not possible.

#### TC-067 Cart persistence per guest session — M
**Covers:** Stories US-072; Cart (information model 4.1), LITE-SES-01, LITE-SES-02, NFR-09.8. **Setup:** S5, S6.
1. In S5 add two items, reload the page and navigate through the app. → Cart unchanged.
2. Open the app in a new tab of the same browser session. → The same cart with the same two items.
3. Open the app in S6. → S6 has its own, empty cart; adding Cola Cache in S6 does not change the S5 cart.

#### TC-068 Maximum items per order — M
**Covers:** Stories US-063; BR-ORD-03 (`maxItemsPerOrder` 30). **Setup:** S5.
1. Build a cart of 3 lines × 10 = 30 items. → Checkout allowed.
2. Add one more item. → A message states the maximum of 30 items per order; checkout blocked until reduced.

### EP-05 Checkout

#### TC-081 Delivery checkout, totals and tip — M
**Covers:** Stories US-081, US-082, US-086, US-087, US-088; SCR-06, BR-PRICE-07 – BR-PRICE-10, Example A. **Setup:** S5. **Data:** G1.
1. Example A cart, delivery, G1. → Subtotal $55.50, delivery fee $0.00 (free from $40.00), sales tax $4.79, tip 15 % $8.33, total **$68.62**.
2. Change tip to 20 %, then 0 %. → Totals $71.39, then $60.29.
3. Check the tip options. → 0, 10, 15, 20 %; default 15 %.

#### TC-082 Pickup checkout — M
**Covers:** Stories US-081, US-093; SCR-06 "pickup", P10. **Setup:** S5.
1. P10 cart, choose pickup. → No address fields, no delivery fee, no tip; tax $1.27; total **$16.01**; store address shown.

#### TC-083 Delivery zone check — M
**Covers:** Stories US-082, US-083; SCR-06 "outside delivery zone", DeliveryZone. **Setup:** S5.
1. Delivery with G3 (ZIP 94121). → A message that the address is outside the delivery zone; the order cannot be placed for delivery; pickup is offered.
2. Change the ZIP to 94117. → Accepted.

#### TC-084 Minimum delivery subtotal — M
**Covers:** Stories US-070, US-089; BR-PRICE-13, SCR-05 "below delivery minimum". **Setup:** S5.
1. P10 cart ($14.74), delivery. → Message that delivery needs a subtotal of at least $15.00; Execute Order blocked; the cart shows the below-minimum note.
2. Add a Cola Cache ($17.49). → Delivery allowed.

#### TC-085 Guest contact validation — M
**Covers:** Stories US-085; SCR-06 "validation errors", BR-DATA-06 – 08, NFR-14.7. **Setup:** S5.
1. Leave `CONTACT_NAME` empty, enter email `taylor@` and phone `123`, press Execute Order. → No order is created; each field shows a message that names it; focus moves to the first error.
2. Enter G1 data with phone `415.555.0123`. → Accepted and later displayed as `(415) 555-0123`.
3. Enter X1 strings in `DELIVERY_NOTES` and place the order. → On SCR-09 and SCR-13 the text is shown literally, nothing executes (`NFR-12.1`).

#### TC-087 Drinks-only cart — M
**Covers:** Stories — (non-functional); BR-ORD-03. **Setup:** S5.
1. Cart with 2 × Cola Cache only, pickup. → Order cannot be placed; a message asks to add at least one item that is not a drink.

#### TC-089 Empty-cart redirect — M
**Covers:** Stories US-092; SCR-06 "empty cart redirect". **Setup:** S5.
1. Open the checkout URL with an empty cart. → Redirected to the menu or cart with a hint.

#### TC-090 Free delivery threshold — M
**Covers:** Stories US-070, US-088; BR-PRICE-07. **Setup:** S5.
1. Delivery cart The Root Pizza M × 2, Lava Exception Cake, Sparkling Stream Water (subtotal **$40.18**). → Delivery fee $0.00.
2. Remove Sparkling Stream Water ($37.23). → Delivery fee $3.99.
3. Add it again and apply `GITHUB_STUDENT` to the $40.18 cart. → Discount −$6.03; fee stays $0.00 (threshold measured before discount).

#### TC-092 Delivery preview map — C
**Covers:** Stories US-097; SCR-06, `illustrations/map-sf-dark.jpg`. **Setup:** S5.
1. On SCR-06 choose delivery and enter ZIP 94105. → The simulated map with the store marker, a destination marker for the zone and the distance `2.8 mi`.
2. Change the ZIP to 94121 (outside the zone). → No destination marker.

### EP-06 Simulated payment

#### TC-101 Successful card payment and confirmation — M
**Covers:** Stories US-091, US-101, US-102, US-103, US-110; SCR-06, SCR-07, SCR-08, T-01, T-02, SIM-01. **Setup:** S1, S2, S4, S5.
1. Example B cart, delivery G2, `Visa •••• 4242`, Execute Order. → SCR-07 processing, states that payment is simulated; no card number fields anywhere (`NFR-13.1`).
2. Wait. → SCR-08 with order number `MX-…` (> 1000), commit hash of 7 lowercase hex characters (copy works), ETA, `HARDWARE_CLUSTER` with "Oven assigned when baking starts" and no oven name (TXT-PAY-24, A-74), payment reference `txn_sim_` + 12 hex characters, first log lines, "Monitor pipeline".
3. Check the server log and the receipt (SCR-13 from SCR-09 `View receipt`). → Server log: one `PAYMENT_PENDING -> QUEUED by sim/payment-gateway` line 1 – 3 s after Execute Order and no `PAYMENT_FAILED` line; SCR-13 shows the payment SUCCEEDED with $26.58, `Visa •••• 4242`, the `txn_sim_` ID and the paid time.

#### TC-102 Other successful methods — M
**Covers:** Stories US-101, US-103; BR-ORD-04. **Setup:** S2, S5.
1. Pay one order each with `Mastercard •••• 4444`, Apple Pay and Google Pay. → All succeed; the method is shown on SCR-08 and on the receipt SCR-13.

#### TC-103 Declined card and retry — M
**Covers:** Stories US-104, US-106, US-113; SCR-07 "payment failed", T-03, T-05. **Setup:** S2, S5.
1. Pay with `Visa •••• 0002`. → Failure state "Card declined by issuer", attempt 1 of 3; status `PAYMENT_FAILED`; cart unchanged.
2. Switch to `Visa •••• 4242`, Retry payment. → Success; two attempts recorded; same amount.

#### TC-104 Insufficient funds and gateway timeout — M
**Covers:** Stories US-104, US-105; BR-ORD-04, `paymentTimeout`. **Setup:** S1, S5 (speed 1×).
1. Pay with `Visa •••• 9995`. → Failure "Insufficient funds".
2. Retry with `Amex •••• 0005`. → Processing lasts about 10 s, then failure "Payment gateway timed out", attempt 2 of 3.

#### TC-105 Third failure rolls the order back — M
**Covers:** Stories US-107; T-04, BR-ORD-05, BR-ORD-07. **Setup:** S2, S5.
1. Pay with `Visa •••• 0002`; retry twice with failing cards. → After the third failure the order is `ROLLED_BACK`; SCR-07 says the order was rolled back; log `[ROLLBACK] Order rolled back: payment failed 3 times.`
2. Open the cart. → All lines and the coupon are still there; a new checkout creates a new order number.

#### TC-106 Cancel after a failure — M
**Covers:** Stories US-108, US-113; T-06. **Setup:** S2, S5.
1. Fail a payment, then press Cancel order on SCR-07. → Order `ROLLED_BACK` with reason "Cancelled by customer before payment"; no refund (unpaid); cart kept.

#### TC-107 Payment window expiry — M
**Covers:** Stories US-109; T-07, BR-ORD-06. **Setup:** S1, S2, S4, S5 (`paymentFailedTimeout` 600 s = 60 s at 10×).
1. Fail a payment with `Visa •••• 0002`, open the order on SCR-09 and do nothing. → 60 – 63 s after the failure the order is `ROLLED_BACK`; SCR-09 shows "This order was rolled back." and "Payment was not completed."; log `[ROLLBACK] Payment window expired. Order rolled back.`; server log `PAYMENT_FAILED -> CANCELLED by sys/timer`.
2. Open the cart. → The cart still holds the lines (BR-ORD-07).

#### TC-109 Refund on cancellation — M
**Covers:** Stories US-111; BR-ORD-10, BR-PRICE-14, T-09. **Setup:** S1 at 1× (`queueWait` 20 s leaves time to roll back), S4, S5.
1. Pay Example B with Google Pay; on SCR-09 roll the order back while `QUEUED`. → Refund note "Refund of $26.58 issued to Google Pay (simulated)."; server log `QUEUED -> CANCELLED by guest`.
2. Open the receipt SCR-13. → Refund of the full $26.58 with refund ID `rfd_sim_` + 12 hex characters and refund time.
3. Fail a payment on another order and cancel it on SCR-07. → No refund note and no refund on SCR-13 (unpaid order).

#### TC-110 No random payment failures — M
**Covers:** Stories US-112; SIM-01 C5, BR-ORD-04, `randomPaymentFailurePercent` 0 % (`lite-configuration.md` section 2). **Setup:** S1, S2, S4, S5.
1. Place 12 orders in a row (P11 carts, pickup): 3 each with `Visa •••• 4242`, `Mastercard •••• 4444`, Apple Pay and Google Pay. → All 12 succeed at the first attempt: each has exactly one `PAYMENT_PENDING -> QUEUED` and no `PAYMENT_FAILED` line in the server log.
2. Pay one more order with `Visa •••• 0002`, retry with `Visa •••• 9995`. → Both attempts fail with their own code (DECLINED, INSUFFICIENT_FUNDS) whatever the random rate (US-112 AC3).

### EP-07 Order tracking

#### TC-121 Delivery pipeline stepper — M
**Covers:** Stories US-121, US-122; SCR-09, `order-lifecycle.md` sections 2.1 and 6. **Setup:** S2, S5.
1. Place a delivery order and watch SCR-09. → Stages `QUEUED`, `BAKING`, `QA_CHECK`, `DISPATCH` ("Waiting for courier", then "Courier on the way"), `DEPLOYED`, each badge with its dev label and plain label and the status color.
2. Check the payment states with a declined card on another order. → `STAGED` / `PAYMENT_FAILED` show the stepper with no stage reached and a payment banner.

#### TC-122 Pickup pipeline stepper — M
**Covers:** Stories US-122, US-132; SCR-09, section 2.1. **Setup:** S2, S5.
1. Place a pickup order. → Stages 4 and 5 are `READY_TO_PULL` (with the store address) and `PULLED`; no map.

#### TC-123 Customer live log — M
**Covers:** Stories US-123, US-271; SIM-07, OrderLogEntry.isCustomerVisible. **Setup:** S2, S5.
1. Follow a delivery order to `DEPLOYED`. → The log shows at least the customer lines of `order-lifecycle.md` section 4 for every transition, with `HH:mm:ss` times and tags such as `[KITCHEN]`, `[OVEN]`, `[QA]`, `[ROUTER]`, `[COURIER]`, `[DEPLOY]`.
2. Reload SCR-09 and search its page source and network responses. → No log line that is not customer-visible (QA ticks, `[OPS]`, `DEBUG`; SIM-07 C2), only lines of this order.

#### TC-124 Map, courier, ETA and distance — M
**Covers:** Stories US-124, US-125, US-126, US-127; SCR-09, SIM-04, section 7.3. **Setup:** S1, S5 (1×). **Data:** G2 (94103, 1.4 mi).
1. Follow the order to `IN_TRANSIT`. → Simulated map with store marker, destination marker, route and courier marker; courier node handle and vehicle; ETA `ETA mm:ss · ~HH:mm`; distance remaining starting at `1.4 mi`.
2. Observe for 30 s. → Marker advances, ETA counts down every second, distance decreases (one decimal); values re-sync at each refresh (difference ≤ 2 s).

#### TC-125 Guest rollback while queued — M
**Covers:** Stories US-129; T-09, BR-ORD-08, SCR-09 "rollback allowed". **Setup:** S1 at 1×, S4, S5.
1. Place an order; on SCR-09 press Rollback order. → Confirmation states the order number and the refund.
2. Dismiss the confirmation. → Nothing changes.
3. Press Rollback order again and confirm while the order is `QUEUED`. → `ROLLED_BACK` banner, "This order was rolled back." "You cancelled it." and the refund note; log `[ROLLBACK] Order rolled back by customer. Refund issued.`; server log `QUEUED -> CANCELLED by guest` and no later `ORDER` line for this order.

#### TC-126 Rollback rejected — M
**Covers:** Stories US-130; BR-ORD-08, SCR-09 "rollback rejected". **Setup:** S1, S2, S4, S5.
1. Place a delivery order and watch SCR-09 while the server log shows it in `BAKING`. → Rollback is disabled with `ROLLBACK REJECTED — your order is already in the oven.`
2. While it is `READY_FOR_DISPATCH`. → Message `ROLLBACK REJECTED — your order is already packed.`
3. While it is `OUT_FOR_DELIVERY` (`IN_TRANSIT`). → `ROLLBACK REJECTED — your order is already on its way.`
4. While `PAYMENT_PENDING` (next order) and after `DEPLOYED`. → No rollback button.

#### TC-127 Order lookup — M
**Covers:** Stories US-133, US-135, US-136; SCR-10, NFR-11.2. **Setup:** S5. **Data:** an order placed with G1.
1. On SCR-10 enter the order number and `TAYLOR.BROOKS@example.com `. → Found (case-insensitive, trimmed) → SCR-09.
2. Enter the number with `sam.rivera@example.com`. → "Not found".
3. Enter a non-existing number with the right email. → The same "not found" result.

#### TC-128 Invalid tracking link — M
**Covers:** Stories US-134; SCR-09 "invalid/expired link", NFR-11.1. **Setup:** S5.
1. Open the tracking link with one character of the token changed. → SCR-09 invalid-link state: `ERROR 404 // DEPLOYMENT_NOT_FOUND` (TXT-TRK-44), TXT-TRK-45, buttons `git log --grep` (TXT-TRK-46) and `RETURN_TO_MAIN`; no order data.
2. Try the tracking URL format with an order number or commit hash instead of the token. → The same invalid-link state; no order data.

#### TC-129 Tracking link in another browser, data isolation — M
**Covers:** Stories US-121; NFR-10.3, NFR-11.4, NFR-11.5. **Setup:** S5 (two browsers).
1. Open a guest order's tracking link in a second browser. → Order visible without login.
2. With the network panel open, reload SCR-09 and search the responses. → No log lines that are not customer-visible, no courier phone number, no data of other orders.

#### TC-131 Order summary and receipt link — M
**Covers:** Stories US-128; SCR-09, SCR-13, BR-PRICE-11, BR-PRICE-12. **Setup:** S1, S2, S5. **Data:** P1, G1.
1. Place the P1 order and open SCR-09. → The order summary shows the lines (name, size, `+ Cherry tomatoes`, quantity, line total), subtotal $29.50, discount −$4.43 with `GITHUB_STUDENT`, delivery fee $3.99, tax $2.16, tip $3.76, total $34.98, `Visa •••• 4242` and the G1 delivery address.
2. Press `View receipt`. → SCR-13 of this order opens (read-only).
3. Place the P11 pickup order and open SCR-09. → The summary shows the store address instead of a delivery address.

#### TC-132 Cancelled order display — M
**Covers:** Stories US-131; SCR-09 "cancelled", BR-ORD-10, BR-ORD-17, seed orders. **Setup:** S1, S5.
1. Look up `MX-1023` with `tom.becker@example.com`. → Stepper frozen at the last stage reached; banner `ROLLED_BACK` "This order was rolled back." "You cancelled it." and the refund line.
2. Look up `MX-1025` with `kevin.nguyen@example.net`. → Banner adds "The store cancelled it. Reason: Customer called the store: wrong delivery address, will order again" and the refund line.
3. Look up `MX-1021` with `daniel.okafor@example.com`. → Banner adds "Payment was not completed."; no refund line (unpaid).
4. On all three. → No rollback, retry, cancel or other state-changing action is offered.

#### TC-133 Completed order view — M
**Covers:** Stories US-137; SCR-09 "delivered" / "picked up". **Setup:** S1, S2, S5.
1. Follow a delivery order to `DELIVERED`. → All five stages complete; banner `DEPLOYED` with `Delivered at HH:mm`; log ends with `[DEPLOY] Delivered. Enjoy your build!`; `View receipt` offered.
2. Follow a pickup order to `PICKED_UP`. → Banner `PULLED` with `Picked up at HH:mm`.
3. On both. → No rollback, retry, re-order or other state-changing action is offered.

#### TC-134 Order access by identifier; simulated orders stay hidden — M
**Covers:** Stories US-133, US-134; NFR-10.3, NFR-10.4, NFR-10.9, NFR-11.1, LITE-SES-03, LITE-SEC-02, LITE-SEC-03, LITE-SEC-05, SIM-05 C8. **Setup:** S1, S2, S4, S5, S6. **Data:** an order placed in S5 with G1.
1. In S6, open the SCR-09 and SCR-13 URL formats of `RUN/operations.md` with the S5 order's number, commit hash or any internal id instead of its tracking token, and change the id in any request of SCR-09 or SCR-13 of an own S6 order to the S5 order's id. → An order-id URL (SCR-09 without token, SCR-13) shows SCR-40; the tracking-link format with a value other than the token shows the invalid-link state of SCR-09 (BR-TRK-21); a changed request returns no data; no data of the S5 order in the page or in network responses.
2. In S6, take three order numbers from `SPAWN` lines of the server log and try them on SCR-10 with any email and in the URL formats of step 1. → "Not found" or SCR-40 each time; no simulated order is ever shown.
3. In S6, browse SCR-01, SCR-08 and SCR-09 of an own order with the network panel open. → No response contains another order, a tracking token other than the session's own, contact data of other people or a `SimulationSettings` / `SimulationEvent` record.
4. In S6, open the S5 order's tracking link. → The order is shown (the token grants access, LITE-SES-03); from then on it is one of the S6 session's orders.

### EP-09 Order receipt

#### TC-169 Receipt of a guest order — M
**Covers:** Stories US-166; SCR-13, BR-PRICE-11, BR-ORD-10, BR-DATA-03. **Setup:** S1, S2, S5. **Data:** P1, G1; seed order `MX-1023`.
1. Follow the P1 order to `DELIVERED`, press `View receipt` on SCR-09. → SCR-13 read-only: commit hash, order number, placed date and time, order type, status badge; the line with size, crust, sauce and cheese (default marked), extra Cherry tomatoes with price, removed ingredients as configured, quantity, unit price $25.00, line total and allergens; subtotal, discount with `GITHUB_STUDENT`, delivery fee $3.99, `SALES_TAX (8.625%)`, tip with percentage, total $34.98; payment method and card label, transaction ID and paid time; the delivery address; status history with time and status only; no re-order or other action that changes data.
2. Look up `MX-1023` with `tom.becker@example.com` and open its receipt. → Cancellation reason in customer wording and the refund (amount, refund ID, time).
3. Open the SCR-13 URL of the P1 order in S6 without its tracking link. → SCR-40, no order data.

#### TC-170 Print the receipt — S
**Covers:** Stories US-167; SCR-13 print layout. **Setup:** S5 with the receipt of TC-169.
1. Press `Print receipt`. → The browser print dialog opens; the print preview hides navigation, banners and buttons and shows store name, address and phone, order number, commit hash, date, lines, totals and payment.
2. Read the print preview. → It states that it is a demo receipt of a simulated payment and not a tax invoice.

### EP-10 Kitchen run by the simulator

#### TC-192 Kitchen auto-advance timing — M
**Covers:** Stories US-194; SIM-02, SIM-06, NFR-08.2. **Setup:** S1, S2, S3, S4, S5.
1. Place a pickup order and wait until it is `PULLED`. → Server log: `QUEUED -> BAKING`, `BAKING -> QA_CHECK`, `QA_CHECK -> READY_FOR_PICKUP` by `sim/kitchen-auto` and `READY_FOR_PICKUP -> PICKED_UP` by `sim/pickup`, one line each.
2. Compute the time in each state from the log timestamps. → `BAKING` 8–12 s (bake 9 s); `QA_CHECK` 2–6 s (qa 3 s); `READY_FOR_PICKUP` 8–12 s (pickupArrival 9 s); `QUEUED` at least 2 s.
3. Watch SCR-09 during `BAKING` and `QA_CHECK`. → Bake progress rises from 0 to 100 % and then "Coming out of the oven"; the T-08 log line names the oven and its target temperature (850°F or 780°F); no overbake state appears.

#### TC-193 Pickup arrival — M
**Covers:** Stories US-272; SIM-06. **Setup:** S1, S5 (1×).
1. Place a pickup order and wait for `READY_TO_PULL`. → After about 90 s (89–93 s by the server log timestamps) it becomes `PULLED` by `sim/pickup`, without any action of the guest.

#### TC-195 Queue position — M
**Covers:** Stories US-103, US-122; SIM-02 BR-SIM-16c, C5, SCR-08, SCR-09. **Setup:** S1 at 1× (`queueWait` 20 s), S4, S5, S6.
1. Place a pickup order in S5 and, within 10 s, another one in S6. → SCR-08 of each order shows its queue position = 1 + the number of orders that are `QUEUED` before it at that moment (from the server log: orders with a `-> QUEUED` line and no later line, including simulated orders); the S6 order's position is at least 2.
2. Keep SCR-09 of the S6 order open. → When the server log shows `QUEUED -> BAKING` (or `QUEUED -> CANCELLED`) for an order before it, the position goes down by 1 within 5 s; when its own `QUEUED -> BAKING` line appears, stage 2 `BAKING` replaces the position.
3. Compare the ETA of both orders on SCR-09 at the moment of payment. → The order with the higher position has the later or equal ETA.

### EP-13 Automatic courier dispatch

#### TC-245 Delivery trip and return — M
**Covers:** Stories US-247; SIM-04, T-11, T-14, T-15, `order-lifecycle.md` section 8, LITE-CFG-05. **Setup:** S1, S2, S3, S4, S5. **Data:** G1 (94110, trip 10 s at 10×).
1. Follow the order on SCR-09 and its courier in the server log. → `QA_CHECK -> READY_FOR_DISPATCH by sim/kitchen-auto`; then `COURIER CU-0n AVAILABLE -> TO_STORE order=MX-…` (SCR-09: courier name and vehicle) → about 3 s later `TO_STORE -> AT_STORE` → about 1 s later `READY_FOR_DISPATCH -> OUT_FOR_DELIVERY by sim/dispatch` with `AT_STORE -> DELIVERING` → route progress 0 → 100 % on SCR-09 and `OUT_FOR_DELIVERY -> DELIVERED by sim/courier` 9–13 s after handover → `DELIVERING -> RETURNING` → about 10 s later `RETURNING -> AVAILABLE`.

#### TC-248 Courier fleet — M
**Covers:** Stories US-247; SIM-04 C4, C8, C9, LITE-CFG-05, `lite-configuration.md` section 2 (`CU-05` always `OFF_DUTY`). **Setup:** S1, S2, S3, S4, S5, S6.
1. Place five delivery orders to 94105 within 20 s (S5 and S6). → Every courier that gets an order has a `COURIER … -> TO_STORE order=MX-…` line; no courier gets a second order before its `RETURNING -> AVAILABLE` line; `CU-05` never appears in a `COURIER` line.
2. Watch SCR-09 of each order while it is `READY_FOR_DISPATCH`. → "Waiting for courier" is shown only while the server log shows no courier `AVAILABLE`; when two orders wait, the one with the older `-> READY_FOR_DISPATCH` line gets the next courier.
3. Inspect SCR-09 and its network responses. → Courier name, node handle and vehicle only; no courier phone number.

### EP-14 Simulation and demo reset (fixed configuration)

#### TC-271 Reset at start restores and deletes — M
**Covers:** Stories US-270; BR-DATA-09, NFR-16.2, NFR-16.3, SIM-08 C1, C2, C4, C8, LITE-CFG-07. **Setup:** S1, S2, S4, S5; then as guest place 3 orders (G1 delivery, P11 pickup, one left in `PAYMENT_FAILED` with `VISA_0002`) and leave a non-empty cart.
1. Restart the app with `Simulation.ResetOnStartup = true`. → Server log `RESET start by startup` and `RESET end orders=<n> duration=<s>s` with s ≤ 60; the 3 orders are not found on SCR-10 with their emails and their tracking links show the invalid-link state; the cart is empty.
2. Check the seed as a guest. → The counts and states of `NFR-16.3` that a guest can see hold (12 / 5 / 5 / 3 products with catalog prices, Tiramisu Stack sold out, Jalapeños unavailable, coupons as in TC-063 – TC-065); seed orders `MX-1001` and `MX-1040` (`jordan.lee@example.com`), `MX-1039` (`rachel.adler@example.com`) are found with their seed status or a later one.
3. Place a new order. → Its number continues after the seed numbering (`MX-1047` or higher, after any `SPAWN` numbers); no seed number is re-used.
4. Restart with `ResetOnStartup = true` again and repeat steps 1 – 2. → Same result; the `RESET end` line of the second reset counts the orders that existed before it.

#### TC-272 Housekeeping keeps guest and open orders — M
**Covers:** Stories US-273; BR-ORD-22, BR-SIM-43, NFR-06.4, SIM-08 section 7. **Setup:** S1, S2, S4, S5.
1. Place a guest pickup order and let it reach `PULLED`. Keep the app running for 35 minutes (at least two housekeeping runs). → The order is still found on SCR-10 and its tracking link works; simulated orders that were open (`SPAWN` without a final `ORDER` line) keep getting `ORDER` lines until they finish; no ERROR line in the server log.
2. *(Not observable by a guest.)* The removal of finished simulated orders older than 24 hours (US-273 AC1) cannot be seen on guest screens, and the daily reset at 04:00 removes every order before it is 24 hours old. It is checked by reading the model: a scheduled housekeeping every 15 minutes with `retentionHours` 24 that deletes only finished `SIMULATOR` orders (BR-SIM-43).

#### TC-273 Simulation runs without browsers — M
**Covers:** Stories US-194, US-265; NFR-08.1. **Setup:** S1 at 1×, S4, S5.
1. Place a delivery order to G1, copy the tracking link, close every browser.
2. After 12 minutes open the tracking link. → `DEPLOYED`; the SCR-09 log lines and the server log `ORDER` lines of the order have times between closing and reopening the browser; `SPAWN` lines continued during that time.

#### TC-274 Server log lines — M
**Covers:** Stories US-271; LITE-CFG-04 – LITE-CFG-08, NFR-19.2, NFR-19.3, NFR-19.5, SIM-07. **Setup:** S1, S2, S4, S5. **Data:** P1, G1.
1. Read the log from the start. → `CONFIG SpeedFactor=10 ResetOnStartup=true` once, then `RESET start by startup` and `RESET end orders=<n> duration=<s>s`, all on the log node `Simulation` at INFO.
2. Place the P1 order and follow it to `DELIVERED`. → For this order exactly one INFO line per status change, in order: `NEW -> PAYMENT_PENDING by guest`, `PAYMENT_PENDING -> QUEUED by sim/payment-gateway`, `QUEUED -> BAKING by sim/kitchen-auto`, `BAKING -> QA_CHECK by sim/kitchen-auto`, `QA_CHECK -> READY_FOR_DISPATCH by sim/kitchen-auto`, `READY_FOR_DISPATCH -> OUT_FOR_DELIVERY by sim/dispatch`, `OUT_FOR_DELIVERY -> DELIVERED by sim/courier`; each within 3 s of the matching change on SCR-09. Its courier has `COURIER` lines with ` order=` + the order number.
3. Observe the log for 5 minutes. → Every INFO line of the node `Simulation` has one of the formats `ORDER`, `COURIER`, `SPAWN`, `CONFIG`, `RESET` (`lite-configuration.md` section 3); no INFO line per tick; no duplicate line for one transition.
4. Search the whole log for the G1 data and the order's tracking token. → No `Taylor`, `taylor.brooks`, `555-0123`, `18th Street` and no token appears; order numbers, courier codes and ZIP codes do.

#### TC-275 Traffic generator — M
**Covers:** Stories US-265, US-114; SIM-05 C1, C2, C3, C5, C9, LITE-CFG-06. **Setup:** S1, S2, S4, S5.
1. Read the log from `RESET end` on. → No `SPAWN` line while 8 simulated orders are open (the seed is at the cap); the first `SPAWN` follows the first final `ORDER` line of a seed simulated order within 2 s plus one tick.
2. Watch 20 minutes. → Gaps between `SPAWN` lines while fewer than 8 simulated orders are open are 9.6 – 14.4 s (plus up to 2 s); open simulated orders never exceed 8; each `SPAWN` line reads `SPAWN MX-… DELIVERY <zip>` with a ZIP of an active zone or `SPAWN MX-… PICKUP COUNTER`, and `items=<n>` with n ≥ 1, without contact data.
3. Follow five spawned orders in the log. → Each goes through the same transitions as guest orders, starting with a payment result by `sim/payment-gateway` (US-114).
4. As guest, check SCR-02, SCR-03 and the cart during the run. → Spawned orders are never shown to the guest (TC-134); Tiramisu Stack stays sold out (no spawned order changes stock).

#### TC-276 Constants: speed factor and reset on start — M
**Covers:** Stories —; SIM-09, LITE-CFG-01 – LITE-CFG-03, LITE-CFG-07, NFR-08.3, NFR-08.5, NFR-18.6. **Setup:** S4, S5.
1. Start with `SpeedFactor = 1`, `ResetOnStartup = true`; place a pickup order. → `CONFIG SpeedFactor=1 ResetOnStartup=true`; `QUEUED -> BAKING` to `BAKING -> QA_CHECK` 89 – 93 s.
2. Restart with `SpeedFactor = 10`, `ResetOnStartup = false`; place a pickup order. → `CONFIG SpeedFactor=10 ResetOnStartup=false`, no `RESET` line; the order of step 1 is still found on SCR-10 and finishes without manual action (NFR-08.5); the new order bakes 8 – 12 s.
3. Restart with `SpeedFactor = 3`. → The app treats it as `1` and writes a WARN line; `CONFIG SpeedFactor=1 …`.
4. Search all guest screens and their menus. → No control for speed, pause, spawning orders or reset (LITE-CFG-03).

### EP-15 Errors and system messages

#### TC-281 Not found — M
**Covers:** Stories US-281; SCR-40. **Setup:** S5.
1. Open an unknown path on the app domain (for example `/p/does-not-exist`). → `ERROR 404 // CRUST_NOT_FOUND` page in the theme with the official logo and DEMO MODE banner.
2. Press `RETURN_TO_MAIN`. → SCR-01.

#### TC-283 Unexpected error page — M
**Covers:** Stories US-282; SCR-41, NFR-17.6. **Setup:** S5; `RUN/operations.md` (how SCR-41 can be reached).
1. Open SCR-41 as described in `RUN/operations.md` (its URL, or the way to trigger it). → `ERROR 500 // SEG_FAULT` page with `INCIDENT_ID: ERR-…` (TXT-ERR-24), `RETRY_DEPLOYMENT` and `RETURN_TO_MAIN`; decorative stack trace only, no real technical details; DEMO MODE banner. The server log has an ERROR entry with the same incident ID (BR-ERR-02).
2. Press `RETURN_TO_MAIN`. → SCR-01.

#### TC-284 Validation messages — M
**Covers:** Stories US-284; BR-DATA-08, NFR-14.7, NFR-17.7. **Setup:** S5.
1. Submit the checkout with an invalid ZIP `9411` and all other fields valid. → One message on `ZIP_CODE` naming the field; every other field keeps its value.

#### TC-285 Toasts — M
**Covers:** Stories US-010; SCR-16 toasts, NFR-14.12. **Setup:** S5.
1. Add a product to the cart; apply a coupon. → A toast confirms each action, disappears by itself, does not cover the cart button or the primary CTA, and is announced by a screen reader.

#### TC-286 Connection lost — M
**Covers:** Stories US-287; NFR-07.6. **Setup:** S5 with an order on SCR-09.
1. Set the browser offline for 20 s. → After at most 15 s a non-blocking notice appears; the page stays usable for reading.
2. Go online. → Within 10 s the notice disappears and the status is current, without reload.

#### TC-287 Injection strings displayed literally — M
**Covers:** Stories US-289; NFR-12.1. **Setup:** S1, S4, S5. **Data:** X1.
1. Enter X1 strings as contact name and delivery notes, place the order, and enter them as menu search term and on SCR-10. → Every screen that shows them (SCR-02, SCR-09, SCR-10, SCR-13) displays the literal text; no dialog opens, no bold text appears; the server log contains none of the strings (no contact data, NFR-19.3).

#### TC-288 No raw platform errors — M
**Covers:** Stories US-289; NFR-17.6, NFR-15.1. **Setup:** whole evaluation.
1. During the execution of all test cases, watch for platform error popups, untranslated system texts or technical messages. → None appear.

#### TC-290 Busy states and double-submit protection — M
**Covers:** Stories US-288; TXT-GEN-12, SIM-01 BR-SIM-12, NFR-17. **Setup:** S1, S5.
1. On SCR-06 double-click `Execute Order --force` quickly. → Exactly one order is created (one SCR-08, one new order number with its `ORDER` lines in the server log); the button shows a busy state while the request runs.
2. In the SCR-07 failure state double-click `Retry payment`. → Exactly one new payment attempt: one `PAYMENT_FAILED -> PAYMENT_PENDING by guest` line in the server log and one new `[PAYMENT]` result on SCR-09.

#### TC-291 Guest session expiry — M
**Covers:** Stories US-286; LITE-SES-04, LITE-SES-05, NFR-09.9, NFR-09.10. **Setup:** S1, S2, S5; the inactivity period from `RUN/delivery-notes.md`.
1. Place one order, then add one item to the cart and keep SCR-09 of the order open without any input for the inactivity period plus 5 minutes. → The session stays alive: the page keeps refreshing, the cart still holds the item and no notice appears.
2. Add two items again, close every tab of the app but keep the browser profile (cookies kept), wait the inactivity period plus 2 minutes, then open SCR-01. → A new guest session: the cart is empty and the toast TXT-ERR-20 "Your session expired. Your manifest was cleared." is shown; no error page, no sign-in page.
3. Open the tracking link of the order of step 1, then look it up on SCR-10. → The order is shown both times.

#### TC-292 Rollback confirmed after baking started — M
**Covers:** Stories US-285, US-129; BR-ORD-01, NFR-07.5, NFR-17.3, T-08, T-09. **Setup:** S1 at 1×, S4, S5.
1. Place an order; on SCR-09 press Rollback order while it is `QUEUED` and keep the confirmation open until the server log shows `QUEUED -> BAKING by sim/kitchen-auto` for it.
2. Confirm the rollback. → Rejected with `ROLLBACK REJECTED — your order is already in the oven.`; the page shows `BAKING`; no `-> CANCELLED` line and no refund; exactly one `ORDER` line per transition; no error page.
