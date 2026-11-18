# Acceptance Checklist

This checklist is ticked while a delivery is evaluated. It complements the test cases (`test-scenarios.md`): test cases verify behavior step by step; the checklist confirms that every screen, epic, non-functional requirement and deliverable is complete. Items checked by the automated tests are ticked from their results; the others (marked *manual*) by the owner. Use one copy per delivery.

Mark each item: `[x]` met · `[ ]` not met (record a defect with severity, `README.md` section 4) · `n/a` with a reason (only for Could items or documented Should deviations).

| Field | Value |
|---|---|
| Delivery (repository, commit hash) | |
| Delivery date | |
| Evaluation dates and store-time window used | |
| Studio Pro version (from `RUN/delivery-notes.md`) | |

---

## 1. Delivery completeness

See `deliverables.md`.

- [ ] Git repository with the Mendix project for Studio Pro 11.16.1; opens without upgrade prompt; `mx check` reports 0 errors (`NFR-01.2`, `NFR-01.3`)
- [ ] One commit per finished user story with the message `US-xxx: <title>` (deliverables section 2)
- [ ] A fresh clone builds and starts locally with `RUN/start.ps1` alone (no manual step), on an empty database, and creates the full seed (`NFR-16.1`, `NFR-18.5`)
- [ ] `RUN/journal.md`: phases with timestamps, decisions, blockers, interpretations
- [ ] `RUN/self-assessment.json`: one entry per Lite user story, valid values only
- [ ] `RUN/delivery-notes.md`: every section of the template filled, including the guest session timeout (LITE-SES-04), mapping of the information model, deviations, known issues
- [ ] `RUN/operations.md`: every section filled, including the non-interactive start and stop, how the scripts set the constants, where the server log is, the base URL and the screen URL paths
- [ ] `RUN/start.ps1` and `RUN/stop.ps1` present and working in Windows PowerShell 5.1 (`deliverables.md` section 6.1)

## 2. Smoke gate

- [ ] G-1 App built and started with `RUN/start.ps1` alone; SCR-01 with logo and DEMO MODE banner, no sign-in page
- [ ] G-2 4 categories and 25 products with catalog card prices
- [ ] G-3 Server log shows `CONFIG …`, `RESET start by startup` and `RESET end …`
- [ ] G-4 E2E-01 completes to `DEPLOYED`
- [ ] G-5 `mx check` reports 0 errors

## 3. End-to-end scenarios

- [ ] E2E-01 Guest delivery order, happy path
- [ ] E2E-02 Failed payment and recovery
- [ ] E2E-06 Guest pickup order on a phone (iPhone Safari *manual* and Chrome emulation)
- [ ] E2E-07 Whole business live: guest view, KPIs and server log
- [ ] E2E-08 Demo reset by restart

---

## 4. Per screen

For every screen: the desktop and phone layouts follow `06-ui-specification/` and the breakpoints of `NFR-03`; every mandatory state of `ids-and-traceability.md` section 4 can be produced and looks as specified; dev labels have their plain meaning available; colors, type and spacing follow `07-design-system/`.

### 4.1 Guest screens

**SCR-01 Home (`./main.js`)**
- [ ] Hero "Architect Your Perfect Crust", terminal intro, `git checkout menu` CTA
- [ ] Four KPI tiles `DEPLOYED_TODAY`, `AVG_PIPELINE_TIME`, `KITCHEN_LOAD`, `COURIERS_ON_DUTY` derived from live data (TC-033)
- [ ] Featured carousel with exactly the 6 featured products (TC-021)
- [ ] State: with active order of the session (live build status, TC-028)
- [ ] Phone layout derived from the mobile menu patterns

**SCR-02 Menu (`./menu.ts`)**
- [ ] File tabs in order with plain names; 12 / 5 / 5 / 3 products; card prices per `BR-PRICE-01` (TC-022)
- [ ] Cards: product photo (all 25 present), code block, badges, dietary and spice indicators (TC-023)
- [ ] Desktop Terminal Debugger cart panel (320 px, TC-030)
- [ ] States: loading, results, no search results, item sold out (Tiramisu Stack, TC-029)

**SCR-03 Pizza configurator (`configure_module.ts`)**
- [ ] Size, crust, sauce, cheese, extras, removals with dev keys and plain names
- [ ] Live price, allergens, dietary flags, `manifest.json` preview (TC-042, TC-043)
- [ ] States: new, editing a cart line, max extras reached, option unavailable (Jalapeños, TC-049)
- [ ] Phone: full page with sticky add-to-cart bar

**SCR-04 Item info (`module.info`)**
- [ ] Description, serving, price, allergens, calories, allergen notice, quantity, add (TC-025)
- [ ] States: default, sold out; phone: bottom sheet

**SCR-05 Cart (`MANIFEST.LOCK`)**
- [ ] Lines with configuration summary, quantity 1–10, edit pizza, remove, clear with confirmation (TC-061, TC-062)
- [ ] Coupon field with every message of `BR-PRICE-06` that exists in Lite (TC-063 – TC-065)
- [ ] Totals breakdown; below-delivery-minimum note
- [ ] States: empty cart, with lines, coupon valid, coupon invalid; desktop drawer 480 px, phone full page

**SCR-06 Checkout (`checkout_config.json`)**
- [ ] Delivery / pickup switch; address `.env` fields; zone check; contact fields; tip (delivery only); payment method and test card; order summary; `Execute Order --force` with accessible name "Place order and pay"
- [ ] States: delivery, pickup, validation errors, outside delivery zone, empty cart redirect
- [ ] Delivery preview map (Could, TC-092)
- [ ] Demo hint for fictional details (should, `NFR-13.4`)

**SCR-07 Payment sheet (`PAYMENT_PROTOCOL`)**
- [ ] Processing state, "simulated" statement
- [ ] Failure state per failure code with method re-selection, retry, cancel; attempt n of 3
- [ ] Third failure → order rolled back message; phone: bottom sheet

**SCR-08 Order confirmation**
- [ ] `DEPLOYMENT SUCCESSFUL // 200 OK`, commit hash with copy, order number, queue position, ETA, oven, payment reference, first log lines, "Monitor pipeline"

**SCR-09 Order tracking (`DEPLOYMENT_STATUS`)**
- [ ] Stepper for delivery and pickup (5 stages) with dev and plain labels
- [ ] Every one of the 11 order statuses displayed as in `order-lifecycle.md` section 6 (own orders and seed orders found on SCR-10)
- [ ] Queue position, bake progress, live log (customer lines only), map with courier, ETA countdown, distance remaining
- [ ] Rollback allowed (QUEUED) and rejected messages; cancelled banner with reason and refund note (TC-132)
- [ ] Order summary with `View receipt` (TC-131); invalid / expired link state; updates within 5 s

**SCR-10 Track order lookup**
- [ ] Empty form, not found, found → SCR-09 (TC-127); seed orders found by number and contact email

**SCR-13 Order detail and receipt (`git show <hash>`)**
- [ ] Lines with modifiers, totals, payment, status history, refund for cancelled paid orders (TC-169)
- [ ] Read-only for guests; print layout (should, TC-170)

**SCR-16 Shell**
- [ ] Header (logo, nav, search, cart count; no account button), desktop Project Explorer (Root, Categories, `Active_Deployments` when the session has an order, New Branch), phone bottom tabs `Source · Deploy · Trace`, footer
- [ ] DEMO MODE banner without role switch; toasts
- [ ] States: cart empty / non-empty, with order of the session

### 4.2 System pages

**SCR-40 Not found (`ERROR 404 // CRUST_NOT_FOUND`)**
- [ ] Themed page, logo, `RETURN_TO_MAIN`; shown for unknown URLs, unknown order links and paths of pages that do not exist in Lite

**SCR-41 Unexpected error (`ERROR 500 // SEG_FAULT`)**
- [ ] Themed page with `RETRY_DEPLOYMENT` and `RETURN_TO_MAIN`; no real technical details; reachable as stated in `RUN/operations.md` (TC-283)

---

## 5. Per epic

An epic is **done** when all its Must test cases pass, its Should test cases pass or are covered by a documented deviation, and the items below hold.

| Epic | Test cases | Key acceptance points | Done |
|---|---|---|---|
| EP-01 Shell, navigation, branding | TC-001 – TC-009 (7) | Exact breakpoints; three phone tabs; DEMO MODE everywhere; official logo only; no account or sign-in elements | [ ] |
| EP-02 Menu browsing | TC-021 – TC-033 (11) | Names and prices equal the catalog; allergens and notice; sold-out Tiramisu Stack; Terminal Debugger panel; KPIs from live data | [ ] |
| EP-03 Pizza configurator | TC-041 – TC-049 (8) | Example C = $30.99; allergen and vegan recalculation; crust/size rules; max extras; Jalapeños unavailable | [ ] |
| EP-04 Cart and coupons | TC-061 – TC-068 (8) | Merge rule; every coupon message of `BR-PRICE-06` that exists in Lite; cap; cart per guest session | [ ] |
| EP-05 Checkout | TC-081 – TC-092 (9) | Examples A, B, D, P1, P2, P10 totals exact; zone and minimum checks | [ ] |
| EP-06 Simulated payment | TC-101 – TC-110 (9) | Five test cards and two wallets behave per `BR-ORD-04`; no random failures; max 3 attempts; refunds | [ ] |
| EP-07 Order tracking | TC-121 – TC-134 (13) | All 11 statuses; live log without internal lines; map, ETA, distance; rollback rules; summary, cancelled and completed views; token access only; simulated orders never shown | [ ] |
| EP-09 Order receipt | TC-169 – TC-170 (2) | Receipt complete and read-only; refund on cancelled paid orders; print layout (should) | [ ] |
| EP-10 Kitchen (simulated) | TC-192 – TC-195 (3) | Kitchen timing from the server log; bake progress; queue position | [ ] |
| EP-13 Couriers (simulated) | TC-245 – TC-248 (2) | Trip and return cycle; longest-available dispatch; `CU-05` never on duty; no phone numbers | [ ] |
| EP-14 Simulation, server log and reset | TC-271 – TC-276 (6) | Reset at start complete and repeatable; housekeeping keeps guest orders; runs without browsers; server log lines exact; traffic realistic and bounded; constants | [ ] |
| EP-15 Errors and messages | TC-281 – TC-292 (10) | Themed 404/500; field-named validation; offline notice; injection-safe; no raw platform errors; session expiry; rollback race | [ ] |

## 6. Simulations

- [ ] SIM-01 Payment gateway: outcomes by test card; timeout after `paymentTimeout`; failure rate 0 %
- [ ] SIM-02 Kitchen auto-advance: on time per server log; respects queue order and oven capacity (6 slots); queue position and kitchen load visible to the guest
- [ ] SIM-04 Courier dispatch and route: assignment, travel to store, handover, route on the map, delivery, return; four couriers on duty
- [ ] SIM-05 Traffic: realistic orders, interval, maximum 8 open simulated orders; never shown to guests; `SPAWN` lines
- [ ] SIM-06 Pickup arrival: on time
- [ ] SIM-07 Live logs: minimum lines per transition; only customer-visible lines for the guest
- [ ] SIM-08 Seed and reset: automatic seed on empty database; reset at start with `ResetOnStartup` within 60 s; identical result twice; scheduled reset at 04:00 (*manual*, long run); housekeeping
- [ ] SIM-09 Clock: speed factor from the constant (1×, 10× tested); no pause or speed control in the app
- [ ] Lite configuration: `CONFIG`, `RESET`, `ORDER`, `COURIER`, `SPAWN` lines exactly as in `lite-configuration.md` section 3; no contact data or tokens in the log

---

## 7. Non-functional requirements

See `11-non-functional/requirements.md`. Each line refers to the sub-requirements it checks.

### 7.1 Platform and local run
- [ ] Studio Pro 11.16.1, stated exactly; `mx check` 0 errors; no beta features relied on (NFR-01)
- [ ] No external paid services; Marketplace modules listed and free; no runtime calls to contractor systems (NFR-02)
- [ ] Builds, starts and stops locally with `RUN/start.ps1` and `RUN/stop.ps1`; constants set per run by the script parameters (NFR-18.1, 18.5, 18.6)
- [ ] Security level Production; only the user role `Anonymous` for visitors; no sign-in page, no demo-user switcher, no stray pages (NFR-18.4, 21.4) — *manual* model inspection

### 7.2 Responsive and browsers
- [ ] Every screen at 320, 390, 768, 834, 1200, 1440 px; exact switch points; no horizontal page scroll (NFR-03.1, 03.2)
- [ ] Touch targets ≥ 44 px; portrait and landscape; pinch zoom allowed (NFR-03.3, 03.4, 03.7)
- [ ] E2E-01 and E2E-06 smoke runs pass in Chrome, Edge, Firefox, Safari macOS, Safari iOS, Chrome Android (NFR-04)

### 7.3 Performance and capacity
- [ ] NFR-05.1 – 05.7 measured (10 runs each, desktop and phone profile); record p90 values below
- [ ] Reset duration from the `RESET` lines ≤ 60 s (NFR-05.12)
- [ ] Progress feedback for every action > 300 ms (NFR-05.13)
- [ ] E2E-07 three-browser run without errors (NFR-06.2); housekeeping keeps the data bounded (NFR-06.4)

| Target | Desktop p90 | Phone p90 | Met |
|---|---|---|---|
| 05.1 First load | | | [ ] |
| 05.2 Navigation | | | [ ] |
| 05.3 Configurator update | | | [ ] |
| 05.4 Cart change | | | [ ] |
| 05.5 Category / search | | | [ ] |
| 05.6 Coupon | | | [ ] |
| 05.7 Execute Order | | | [ ] |
| 05.12 Demo reset (from the server log) | | — | [ ] |

### 7.4 Live updates and simulation
- [ ] Latencies of the NFR-07 table met on SCR-07, SCR-08, SCR-09 (5 s), SCR-01 and the sidebar (10 s)
- [ ] Countdowns tick every second, drift ≤ 2 s (NFR-07.2)
- [ ] Refresh keeps dialogs, input, filters, scroll and focus (NFR-07.4)
- [ ] Offline notice and recovery (NFR-07.6, TC-286)
- [ ] Simulation independent of browsers (NFR-08.1, TC-273); timer accuracy (NFR-08.2); speed factor from the constant (NFR-08.3, TC-276); resumes after restart (NFR-08.5, TC-276)

### 7.5 Security and privacy
- [ ] Guest sessions without sign-in; cart per session; sessions survive idle open tabs; expiry gives a new guest session (NFR-09.8 – 09.10, TC-067, TC-291)
- [ ] Access matrix on the server; unknown and non-Lite paths give SCR-40; network responses contain only the guest's own data and the four KPI values (NFR-10.1 – 10.4, TC-129, TC-134)
- [ ] Simulated orders never shown; guests cannot change catalog or settings; server-side guards and prices (NFR-10.6, 10.7, 10.9, 10.10)
- [ ] Tracking token and lookup rules (NFR-11.1, 11.2, TC-127, TC-128); lookup throttling (should, NFR-11.3)
- [ ] Injection strings literal everywhere (NFR-12.1, TC-287); server-side validation (NFR-12.2); special characters in search (NFR-12.3)
- [ ] No card fields or payment scripts; DEMO MODE everywhere; fictional seed; no emails/SMS; no analytics or consent banner (NFR-13.1 – 13.6)
- [ ] No third-party requests in the network panel on SCR-01, SCR-06, SCR-09 (should, NFR-13.7; exceptions listed in `RUN/delivery-notes.md`)

### 7.6 Accessibility (WCAG 2.1 AA)
- [ ] axe scan: 0 critical / serious on these states (NFR-14.1): SCR-01 default · SCR-02 results · SCR-02 item sold out · SCR-03 new · SCR-03 option unavailable · SCR-04 default · SCR-05 with lines · SCR-06 delivery with validation errors · SCR-07 payment failed · SCR-08 · SCR-09 QUEUED, BAKING and OUT_FOR_DELIVERY · SCR-09 CANCELLED · SCR-10 not found · SCR-13 completed · SCR-40 · SCR-41
- [ ] Keyboard-only run of E2E-01; focus ring visible; modals trap and return focus; skip link (NFR-14.2 – 14.4)
- [ ] Accessible names carry the plain meaning of dev labels; input purposes set; errors linked to fields (NFR-14.5 – 14.7)
- [ ] Alt texts, map text alternative (NFR-14.8); contrast of non-token colors (NFR-14.9); no color-only status (NFR-14.10)
- [ ] 320 px reflow, 200 % zoom, text spacing (NFR-14.11)
- [ ] Live-region announcements without per-second timer noise (NFR-14.12)
- [ ] Reduced motion; blinking and pulsing stop within 5 s (NFR-14.13, 14.14)
- [ ] `lang="en"`, unique page titles with "Git Pizza MxDev" (NFR-14.15); table headers (NFR-14.16)
- [ ] Screen-reader run of E2E-01 with NVDA or VoiceOver (NFR-14.18) — *manual*

### 7.7 Localisation
- [ ] English only, including platform and widget texts (NFR-15.1)
- [ ] `$1,024.00` and `−$3.22`; `YYYY-MM-DD`, `HH:mm`, log `HH:mm:ss` (NFR-15.2, 15.3)
- [ ] Times identical with browser time zone `Europe/Warsaw` and `America/Los_Angeles` (NFR-15.4)
- [ ] "Today" per store day for the KPIs (NFR-15.5); US units and formats (NFR-15.6, 15.7)

### 7.8 Demo data, stability, logging, maintainability
- [ ] Seed contents after a reset at start and on a fresh database (NFR-16.1 – 16.3, TC-271)
- [ ] Reset during use: open screens recover without errors (NFR-16.4, 16.5, E2E-08)
- [ ] 25-hour run at 1× across 04:00 without manual action (should, NFR-17.1, setup S7) — *manual*, long run
- [ ] Concurrent actions give one transition (NFR-17.3, TC-292); invariants hold (NFR-17.5, E2E-07); no raw platform errors (NFR-17.6, TC-288); input kept on validation errors (NFR-17.7)
- [ ] Server log lines exact, one INFO line per transition, no contact data or tokens (NFR-19.2, 19.3, 19.5, TC-274)
- [ ] Business values read from data; complete name mapping in `RUN/delivery-notes.md` (NFR-21.1, 21.2) — *manual*

### 7.9 Brand and design system
- [ ] Only the official Pixel Slice logo files; no `PIZZA_OS`, the previous "git tree pizza" raster logo or other obsolete logos anywhere (NFR-20.1)
- [ ] Only package images; every delivered image shown; `IMAGE_PENDING // <file name>` placeholder with alt text only for `no-results.png` and products without photo (NFR-20.2)
- [ ] Adding a missing product photo works as described in `RUN/operations.md` (NFR-20.3) — *manual*
- [ ] Favicon `brand/favicon.svg` / `favicon-32.png` and apple-touch icon are used (should, NFR-20.4)
- [ ] Texts, labels, names, prices and codes equal the package (NFR-20.5)
- [ ] JetBrains Mono for UI, Geist for long paragraphs; Material Symbols Outlined icons (NFR-20.6, `tokens.md` sections 2 and 8)
- [ ] Dark theme only; surface, text, brand and status colors per `tokens.md` section 1; radius, borders and glows per section 4

---

## 8. Evaluation summary

| Item | Value |
|---|---|
| E2E scenarios passed / 5 | |
| Must test cases passed / 84 | |
| Should test cases passed / 2 (N/A with deviation: n) | |
| Could test cases passed / 2 | |
| NFR Must sub-requirements met / total | |
| Open defects: Blocker / Major / Minor / Cosmetic | |
| Deviations in `RUN/delivery-notes.md` (count per type) | |
| Stories marked `done` in `RUN/self-assessment.json` whose tests failed | |
| **Verdict** (`README.md` section 5.2) | ACCEPTED / ACCEPTED WITH REMARKS / REJECTED |
