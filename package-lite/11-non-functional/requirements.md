# Non-Functional Requirements

This document defines the quality requirements of Git Pizza MxDev: platform, responsiveness, browsers, performance, live updates, simulation accuracy, security of a guest-only demo, privacy, accessibility, localisation, demo stability and reset, local run and logging. Requirements are numbered `NFR-xx`; each has testable sub-requirements `NFR-xx.y`. In the tables the `#` column shows only `xx.y` (for example row `05.3` of NFR-05); elsewhere it is cited in full as `NFR-05.3`.

Related: [../01-product-brief/product-brief.md](../01-product-brief/product-brief.md) (constraints, section 8; assumptions, section 9), [../04-information-model/information-model.md](../04-information-model/information-model.md) (access matrix, section 10; data rules, section 8), [../05-processes/order-lifecycle.md](../05-processes/order-lifecycle.md) (timings, section 7; `BR-ORD-20`, `BR-ORD-21`), [../07-design-system/tokens.md](../07-design-system/tokens.md) (breakpoints, contrast, motion), [../12-acceptance/](../12-acceptance/README.md) (how each requirement is verified).

**Wording.** **must** = mandatory for acceptance, **should** = expected unless the delivery notes give a written reason, **may** = optional (see `00-README.md` section 6.2). A sub-requirement without a priority word is a must.

**Scope.** These requirements describe *qualities the evaluator can observe or measure*. They do not prescribe how the app is built in Mendix. Where a requirement mentions a technique, it is an example of a feasible approach, never an obligation.

---

## 1. Summary

| ID | Requirement | Priority | Verified by (see `12-acceptance/`) |
|---|---|---|---|
| NFR-01 | Mendix platform and version | Must | `mx check`, project inspection, `RUN/delivery-notes.md` |
| NFR-02 | Self-contained project, no external services | Must (02.5: Should) | Project inspection, network check |
| NFR-03 | One responsive web app with fixed breakpoints | Must | Checklist "Responsive", layout checks of the automated tests |
| NFR-04 | Supported browsers and devices | Must | Cross-browser smoke run |
| NFR-05 | Response times | Must | Measurement protocol, section 5.3 |
| NFR-06 | Capacity and concurrency | Must | E2E-07, TC-272 |
| NFR-07 | Live updates (auto-refresh) | Must | TC in EP-02 and EP-07, E2E-07 |
| NFR-08 | Simulation timing accuracy and independence | Must | EP-10, EP-13 and EP-14 test cases, server log timestamps |
| NFR-09 | Guest sessions | Must | TC-067, TC-291 |
| NFR-10 | Authorization: guest and server | Must | EP-07 and EP-15 test cases, network inspection |
| NFR-11 | Guest order access | Must (11.3: Should) | EP-07 test cases |
| NFR-12 | Input handling and server-side validation | Must | Injection strings, EP-15 test cases |
| NFR-13 | No real payments, no real personal data, privacy | Must (13.4, 13.7: Should) | Checklist "Privacy", network check |
| NFR-14 | Accessibility, WCAG 2.1 level AA | Must | axe scan, keyboard and screen-reader checks |
| NFR-15 | Localisation, formats and time zone | Must | Time-zone test, text review |
| NFR-16 | Demo data, seeding and reset | Must | EP-14 test cases, E2E-08 |
| NFR-17 | Demo stability and data integrity | Must (17.1: Should) | E2E-07, E2E-08, TC-272 |
| NFR-18 | Local run and security level | Must | `RUN/operations.md`, project inspection, local build and start by the automated tests |
| NFR-19 | Logging and server log lines | Must | Server log read by the automated tests |
| NFR-20 | Brand, assets and texts | Must (20.4: Should) | Checklist "Brand" |
| NFR-21 | Maintainability and configurability | Must | Project inspection, `RUN/delivery-notes.md`, `RUN/operations.md` |

---

## 2. Platform

### NFR-01 Mendix platform and version

| # | Requirement |
|---|---|
| 01.1 | The app is a **Mendix 11.16.1** project that opens in Studio Pro 11.16.1. How the project is created and edited (which tools, which way of working) is the contractor's choice. Beta or preview releases must not be used. |
| 01.2 | The exact Studio Pro version (`11.16.1.zzzzz`) is stated in `RUN/delivery-notes.md`. The project in the delivered Git repository opens in exactly that version without an upgrade prompt. |
| 01.3 | The consistency check of the model reports **0 errors**: `mx check` (the command-line tool shipped with Studio Pro 11.16.1) run on the delivered project, and the Errors pane of Studio Pro. Warnings are allowed; their number is stated in `RUN/delivery-notes.md`. |
| 01.4 | Platform features marked beta, experimental or deprecated in that version must not be used for anything the acceptance tests depend on. |
| 01.5 | The app is **one** Mendix web app. There is no native mobile app, no separate phone app and no second Mendix app (product brief section 8). |

### NFR-02 Self-contained project and external dependencies

| # | Requirement |
|---|---|
| 02.1 | The app runs without any external or paid service: no payment provider, maps or geocoding API, email, SMS, push or AI service. All such behavior is simulated inside the app (product brief section 3.2). |
| 02.2 | Marketplace modules and widgets may be used. Each one is listed in `RUN/delivery-notes.md` with its exact version. They must be free of charge, compatible with the Studio Pro version of 01.1, and must not call external services at runtime. |
| 02.3 | Custom code (Java actions, JavaScript actions, custom widgets, SCSS) may be used if it is contained in the Git repository. Opening, building and running the project needs nothing beyond Studio Pro 11.16.1 or its command-line tools, Java and, if the chosen local runtime needs it, Docker (NFR-18), and no manual build step. |
| 02.4 | The app has no runtime dependency on any system of the contractor (license servers, private APIs, private package feeds, monitoring agents that must be configured for the app to start). |
| 02.5 | Fonts (JetBrains Mono, Geist) and icons (Material Symbols Outlined) **should** be served from the app itself rather than from a third-party CDN, so the app makes no third-party requests (see NFR-13.7). If they are loaded from Google Fonts, this is listed as a deviation in `RUN/delivery-notes.md`. |

---

## 3. Responsive web and browsers

### NFR-03 Responsive web app and breakpoints

The breakpoints are the design tokens in `tokens.md` section 5 and are binding:

| Range | Name | Reference widths the evaluator tests | Layout (summary; details in `06-ui-specification/`) |
|---|---|---|---|
| 0 – 767 px | Phone | **320**, **390** (main), 412 | Single column, 56 px header, bottom tab bar `Source · Deploy · Trace`, drawers and modals as full pages or bottom sheets |
| 768 – 1199 px | Tablet | **768**, **834** (main), 1024 | Header navigation, sidebar as icon rail or behind a menu button, menu grid 2 columns, cart drawer 480 px |
| ≥ 1200 px | Desktop | **1200**, **1280**, **1440** (main), 1920 | Full layout with 256 px Project Explorer sidebar, optional 320 px right panel |

| # | Requirement |
|---|---|
| 03.1 | Every screen of the inventory (`ids-and-traceability.md` section 4) is usable at every width from 320 px upwards, in the layout of its range. The layout switches exactly at the boundaries: 767 px is phone, 768 px is tablet, 1199 px is tablet, 1200 px is desktop. |
| 03.2 | No horizontal page scrolling at any width ≥ 320 px, except inside explicitly scrollable regions (tables, code blocks, log panes) (`tokens.md` section 5). |
| 03.3 | Interactive elements on phone and tablet widths have a touch target of at least 44 × 44 px (`layout.touchTargetMin`). |
| 03.4 | Phone and tablet layouts work in portrait and landscape orientation. The app never forces one orientation. |
| 03.7 | The browser's viewport meta behavior allows the user to zoom (pinch zoom is not disabled). |

### NFR-04 Supported browsers and devices

| # | Requirement |
|---|---|
| 04.1 | **Desktop:** the two latest stable major versions, at the delivery date, of Google Chrome, Microsoft Edge (Chromium), Mozilla Firefox and Apple Safari on macOS. |
| 04.2 | **Phone and tablet:** Safari on the two latest major iOS / iPadOS versions; Chrome for Android, latest stable version, Android 12 or later. |
| 04.3 | In all supported browsers every acceptance test case passes. The **main test browser** is desktop Chrome; the other browsers get a smoke run of E2E-01 (desktop) and E2E-06 (phone) (see `12-acceptance/test-scenarios.md`). |
| 04.4 | Internet Explorer and legacy (non-Chromium) Edge are not supported. An unsupported browser may show the platform's default message. |
| 04.5 | The app works with cookies limited to first-party cookies and with third-party cookies blocked (default in Safari and Firefox). |

---

## 4. Performance and capacity

### NFR-05 Response times

#### 5.1 Targets

A target is met when **at least 9 of 10 measurements** are at or below the value (90th percentile). Times run from the user action (click, tap, key press, page request) until the result described is visible and the screen accepts input.

| # | Measurement | Desktop | Phone profile |
|---|---|---|---|
| 05.1 | First load of SCR-01 Home with an empty browser cache, until logo, hero and featured modules are visible and interactive | ≤ 4.0 s | ≤ 6.0 s |
| 05.2 | Navigation between screens with a warm cache (for example SCR-01 → SCR-02, SCR-02 → SCR-03, SCR-05 → SCR-06), until the content is visible | ≤ 1.5 s | ≤ 2.5 s |
| 05.3 | Configurator SCR-03: after changing size, crust, sauce, cheese, an extra or a removal, the price, allergens, dietary flags and `manifest.json` preview show the new values | ≤ 0.5 s | ≤ 0.8 s |
| 05.4 | Add to cart, change quantity, remove a line: cart count and totals updated | ≤ 1.0 s | ≤ 1.5 s |
| 05.5 | Category tab switch and search results on SCR-02 | ≤ 1.0 s | ≤ 1.5 s |
| 05.6 | Coupon apply or remove: coupon state, message and totals updated | ≤ 1.0 s | ≤ 1.5 s |
| 05.7 | `Execute Order --force` on SCR-06 until SCR-07 shows its processing state | ≤ 1.5 s | ≤ 2.0 s |
| 05.12 | Demo reset (SIM-08): duration between the server log lines `RESET start` and `RESET end` (LITE-CFG-07) | ≤ 60 s | — |
| 05.13 | Any action that takes longer than 300 ms shows a progress indicator (spinner, skeleton or progress state) within 300 ms; the user never faces a frozen screen without feedback | always | always |

#### 5.2 Measurement conditions

> **Assumption A-52:** Response times are measured on the app running locally (NFR-18.1) after it has served at least one request in the previous 5 minutes, with traffic ON (always on in Lite) and `Simulation.SpeedFactor` 1 or 10, from a browser on the same machine or local network (round-trip time at most 150 ms). **Desktop profile:** desktop Chrome, no throttling, connection ≥ 50 Mbit/s. **Phone profile:** Chrome DevTools device emulation 390 × 844 with the network preset "Fast 4G" and CPU slowdown 4×.

#### 5.3 Measurement method

The automated acceptance tests measure with the browser's performance and network data (for 05.12: the timestamps of the `RESET` server log lines). The contractor does not deliver own measurements.

### NFR-06 Capacity and concurrency

| # | Requirement |
|---|---|
| 06.2 | **Multi-browser check (must).** Three guest browsers used at the same time (two placing and tracking orders, one on SCR-01 watching the KPIs) at 10× with traffic ON for 15 minutes (E2E-07): every screen stays consistent with the server log, no errors, no lost orders. |
| 06.4 | Housekeeping (`BR-ORD-22`) keeps the number of simulated orders bounded: finished SIMULATOR orders older than `retentionHours` are removed automatically, together with their lines, attempts, history and logs. |

---

## 5. Live updates and simulation

### NFR-07 Live updates (auto-refresh)

Screens that show changing data update themselves without a manual page reload. Latency = time from the server-side change (for order changes: the `OrderStatusChange.changedAt` time) until the change is visible on the open screen.

| Screen | What must update | Max latency |
|---|---|---|
| SCR-07 Payment sheet | Outcome of the payment attempt (success → SCR-08, failure state) | 5 s (should: 3 s) |
| SCR-08 Confirmation, SCR-09 Order tracking | Queue position (BR-SIM-16c); on SCR-09 also status, stepper, bake progress, log lines, ETA, courier name, map marker, distance remaining, cancel/rollback availability | 5 s (`BR-ORD-20`) |
| SCR-01 Home (live build status), SCR-16 sidebar `Active_Deployments` | Status of the guest's latest order of the session | 10 s |
| SCR-01 Home KPIs (US-023) | `DEPLOYED_TODAY`, `AVG_PIPELINE_TIME`, `KITCHEN_LOAD`, `COURIERS_ON_DUTY` | 10 s |

| # | Requirement |
|---|---|
| 07.1 | The latencies in the table above are met in at least 9 of 10 observations. |
| 07.2 | Countdown timers (bake timer, ETA countdown `ESTIMATED_ETA · 04:35 · ~18:49` on SCR-08 and SCR-09) tick every second on the client and are re-synchronized with the server at every refresh. The difference to the server-calculated value is at most 2 s. |
| 07.3 | The map marker on SCR-09 moves smoothly to its new position at every update (`motion.duration.progress`, linear), or jumps when the user prefers reduced motion (`tokens.md` section 7). |
| 07.4 | A refresh **must not** reload the whole page, close an open modal, drawer or dialog, clear or reset text the user is typing, or reset filters, search terms, selected tabs or the selected row or order. It **should not** move the scroll position or the keyboard focus of a list or table; when rows are added or removed, the selected row and any open dialog are kept and focus returns to the selected row (or stays in the dialog). |
| 07.5 | Business rules are always checked against the current server state when the user acts. If the screen was out of date (for example the order moved on in the meantime), the action is rejected with a short message and the screen shows the current state; no error page appears (see NFR-17.3). |
| 07.6 | **Connection problems.** If two refreshes in a row fail (about 10 s; for example the device goes offline), the screen shows the non-blocking banner TXT-NAV-30 above the header (FD-15 BR-ERR-12). When the connection returns, updates resume within 10 s, the banner disappears without a page reload and the toast TXT-NAV-31 is shown. |
| 07.7 | A browser tab in the background may refresh less often or not at all. When it becomes visible again, it shows current data within 5 s. |
| 07.8 | Refreshing is efficient: an open live screen must not cause noticeable load on the device (no continuous full re-rendering; scrolling stays smooth on the phone profile of NFR-05). |

**Implementation latitude (NFR-07 and NFR-08).** Mendix 11 has no built-in server push to open pages, and its standard scheduled events are not meant for 2-second intervals. The package therefore fixes only the measurable results (latencies, tolerances), not the technique. Acceptable approaches: (a) for the **UI refresh**, client-side polling of the open page or widget (for example every 2–3 s), a push or websocket mechanism, or a Marketplace component that achieves the same; (b) for the **simulator tick**, a server-side loop or self-rescheduling task queue inside the app, a background thread started at application start, or an equivalent server-side mechanism. **Not acceptable:** a simulator that only advances when a browser polls or a user acts (this violates NFR-08.1). The contractor describes the chosen mechanisms for refresh and tick, their intervals and how they recover after a restart in `RUN/delivery-notes.md`.

### NFR-08 Simulation timing accuracy and independence

| # | Requirement |
|---|---|
| 08.1 | The simulations (SIM-01 – SIM-09) run on the server and do **not** depend on any browser being open. An order placed by a guest who then closes every browser still completes on time: reopening the tracking link after the expected completion time shows the final state with a complete status history. |
| 08.2 | The simulator evaluates all timers at least every 2 seconds (`order-lifecycle.md` section 7.4). An automatic transition happens no earlier than its effective duration and no later than 3 s after it (BR-SIM-05). Measured with the timestamps of the `ORDER` lines in the server log (LITE-CFG-04, second precision), the time in a state lies between *duration − 1 s* and *duration + 3 s*. |
| 08.3 | The speed factor is the constant `Simulation.SpeedFactor` (`1`, `2`, `5` or `10`; `lite-configuration.md` section 1), read when the app starts. It applies as defined in `order-lifecycle.md` section 7.2 and `BR-ORD-21` (`ceil(base / factor)`, minimum 1 s) to every duration and to the traffic interval. A changed value takes effect after a restart; timers that were running keep the progress already made and the new factor applies to their remaining part (LITE-CFG-02). There is no pause and no change of speed while the app runs (LITE-CFG-03). |
| 08.5 | After a restart of the app (deployment, environment restart or wake-up from sleep), the simulation resumes automatically within 60 s with its persisted settings, without manual action. Orders that were due during the downtime are advanced by the normal rules, at most one transition per order per tick (`order-lifecycle.md` section 7.4). |
| 08.6 | Simulated orders follow exactly the same transitions, guards, price rules and logging as orders placed by people (`order-lifecycle.md` section 7.4). |
| 08.7 | If the app runs on more than one instance, exactly one simulator acts on each timer: no transition happens twice and no order is spawned twice. |

---

## 6. Security of a guest-only demo

The app has no accounts: every visitor is a guest, an anonymous user with the user role `Anonymous`, and everything else is done by the server (information model sections 2 and 10). Security guarantees that **a guest sees and does only what the access matrix allows**, that the data of one visitor is not exposed to another, that simulated orders stay on the server, and that no real money or real personal data is involved.

### NFR-09 Guest sessions

| # | Requirement |
|---|---|
| 09.1 | The app generates only relative links or links with the scheme of the current request, so it works on the local runtime (`http://localhost:<port>`, NFR-18.1) and unchanged behind HTTPS. |
| 09.8 | **Guest sessions.** A visitor gets an anonymous session with the user role `Anonymous` on the first visit, without any login page, sign-up or cookie banner (LITE-SES-01). The cart belongs to that browser session (A-11, LITE-SES-02) and survives page reloads and new tabs of the same browser session. |
| 09.9 | **Session lifetime.** A session does not expire while any tab of the app is open and online, even if the visitor does nothing (for example SCR-09 left open for 8 hours keeps refreshing). After all tabs are closed, a session may expire after an inactivity period chosen by the contractor (at least 10 minutes), stated in `RUN/delivery-notes.md` (LITE-SES-04). |
| 09.10 | **After expiry.** The visitor continues in a new guest session with an empty cart; if a non-empty cart was lost, a toast says so (US-286, LITE-SES-05). There is no "session expired" page. The orders of the old session remain reachable with the tracking link or the lookup (SCR-10). |

> **Assumption A-53:** "Session lifetime" is defined as in 09.9: sessions are kept alive while the app is open, and may expire only after the browser is closed. This avoids time limits for users during a demo (WCAG 2.2.1).

### NFR-10 Authorization: guest and server

| # | Requirement |
|---|---|
| 10.1 | The access matrix in `information-model.md` section 10 (guest = user role `Anonymous`, system = server logic without a user) is enforced **on the server** for every object and every action (LITE-SEC-01). Hiding or disabling a button in the UI is never the only protection. |
| 10.2 | Lite has no screen that a guest may not open: there are no account screens, no screens for running the store and no access-denied page. A path that is not a screen of the Lite inventory (for example an unknown path or a path of a page that does not exist in Lite) shows SCR-40 `ERROR 404 // CRUST_NOT_FOUND` and no data. The only other user role is the administrator role that the platform needs for its built-in admin user; it has no app pages and no navigation (NFR-18.4). |
| 10.3 | The data sent to a browser is limited to what a guest may read. In the browser's network panel, the evaluator finds no `OrderLogEntry` with `isCustomerVisible = false`, no order the guest holds no token for (no other guest's order, no simulated order), no contact data of other people, no courier phone numbers, no `SimulationSettings` or `SimulationEvent`, for the home page KPIs only the four aggregate values, and for the queue position and ETA of the guest's own order only these values, computed on the server (LITE-SEC-02). |
| 10.4 | A guest can read and change only the cart of their session and the orders they hold a token for (LITE-SES-03). Changing an identifier (order number, commit hash, object id) in a URL or a request never exposes another order (LITE-SEC-03). |
| 10.6 | Every state-changing action is validated on the server against the current state, role and guards (`BR-ORD-01`). A forged or outdated request cannot produce a transition that is not allowed. |
| 10.7 | Prices, discounts, fees, tax, tip and totals are calculated on the server (`BR-PRICE`). Amounts sent by the client are never trusted. |
| 10.9 | Simulated orders (SIM-05) are never shown to a guest; their `trackingToken` never reaches a browser (LITE-SEC-05). |
| 10.10 | Guests cannot change the catalog, stock, prices, options, coupons, zones, couriers, ovens, store or simulation settings: no page, action or request of the app does it (information model section 10). |

### NFR-11 Guest order access

| # | Requirement |
|---|---|
| 11.1 | The guest tracking link identifies the order by its `trackingToken` (32 random, URL-safe characters, not guessable). The order number or commit hash alone never grants access, so order numbers cannot be enumerated. |
| 11.2 | The lookup (SCR-10) requires the order number **and** the contact email of the order (email compared case-insensitively after trimming). A wrong number and a wrong email give the same "not found" result, so the lookup does not reveal whether an order number exists. |
| 11.3 | The lookup **should** be throttled as defined in FD-07 `BR-TRK-19` (limits there, message TXT-TRK-65). |
| 11.4 | The tracking link works in any browser and on any device, also in a new guest session, until the order is deleted by a demo reset. |
| 11.5 | With a valid link, a guest sees only what the access matrix allows for "token": the order, its customer-visible log lines, status times, and the name, node handle and vehicle of the courier and the display name of the oven. |
| 11.6 | Tracking tokens, contact emails and phone numbers are not written to the application log (NFR-19.3). |

### NFR-12 Input handling and server-side validation

| # | Requirement |
|---|---|
| 12.1 | Every text a guest can enter (contact names, addresses, delivery notes, search terms, coupon codes, lookup inputs) is displayed as plain text everywhere, including the order log and the server log. HTML or script in input is shown literally and never executed. Test strings: `<script>alert(1)</script>`, `<img src=x onerror=alert(1)>`, `"><b>bold</b>`. |
| 12.2 | All validation rules (required fields, lengths, formats `BR-DATA-06`, `BR-DATA-07`, ranges, quantities 1–10, max 30 items per order, coupon rules, availability of products and options `BR-DATA-12`) are enforced on the server. Bypassing the UI must not store invalid data. |
| 12.3 | Search and filter inputs accept any characters, including `'`, `"`, `%`, `_`, `*`, `\` and emoji, without errors; they are treated as literal text. |
| 12.5 | Texts at their maximum length (for example a 140-character delivery note or a 100-character contact name) are displayed without breaking the layout: they wrap, or they are shortened with the full text available (tooltip, detail view or accessible name). |

### NFR-13 No real payments, no real personal data, privacy

| # | Requirement |
|---|---|
| 13.1 | **No real payments.** No screen has a field for a card number, expiry date, CVV, bank account or similar. No payment provider script or SDK is loaded; no request goes to a payment provider. Payment uses only the simulated methods and demo test cards (A-06, `TestCard`). |
| 13.2 | The DEMO MODE banner is visible on every screen, including the error pages (`glossary.md` section 1.1). The payment sheet SCR-07 states that the payment is simulated. |
| 13.3 | All seed data is fictional: people, the store, addresses, emails (`@example.com`), phone numbers (`555-01xx`). No real person's data is part of the app. |
| 13.4 | Checkout (SCR-06, contact fields) **should** show a short hint that this is a demo and fictional details should be used (wording in `06-ui-specification/`; default "Demo app — please use fictional contact details."). |
| 13.5 | The app sends no emails, text messages or push notifications. |
| 13.6 | The app uses no analytics, advertising, tracking pixels, session recording or third-party cookies. Only cookies strictly needed for the app to work are set, so no cookie consent banner is needed and none is shown. |
| 13.7 | The app **should** make no runtime request to a third-party domain (any domain other than the app's own domain and the hosting platform's own domains). Exceptions are listed in `RUN/delivery-notes.md` with their purpose. |
| 13.8 | All data entered by visitors (orders with their contact data and addresses, carts) is deleted by the demo reset (`BR-DATA-09`). Guest orders are otherwise kept until the next reset (A-16). |

---

## 7. Accessibility

### NFR-14 Accessibility (WCAG 2.1 level AA)

The app conforms to **WCAG 2.1 level AA** on every screen and state of the inventory, in the dark theme defined by the tokens. The dev theme must not reduce accessibility: every dev label also has its plain meaning (`glossary.md`, "Rule for the UI").

| # | Requirement | WCAG |
|---|---|---|
| 14.1 | **Automated scan.** An axe-core based scan (for example the axe DevTools browser extension, current version) of the screen states listed in `12-acceptance/acceptance-checklist.md` section "Accessibility" reports **0 violations of impact "critical" or "serious"**. Remaining "moderate" and "minor" findings are recorded; they do not fail 14.1. | all |
| 14.2 | **Keyboard.** Every function can be used with the keyboard alone, in a logical order, without keyboard traps. Modals, drawers and bottom sheets keep focus inside while open, close with `Esc` (except SCR-07 while processing), and return focus to the control that opened them. | 2.1.1, 2.1.2, 2.4.3 |
| 14.3 | **Visible focus.** Every interactive element shows the focus ring `color.border.focus` (2 px solid, 2 px offset) when focused by keyboard. | 2.4.7 |
| 14.4 | **Skip link.** Each page offers a "Skip to main content" link as the first focusable element. | 2.4.1 |
| 14.5 | **Names and labels.** Every control has an accessible name containing its plain meaning; dev labels keep their meaning available (for example `Execute Order --force` has the accessible name "Place order and pay"; `ZIP_CODE` is announced as "ZIP code"). Icon-only buttons have names. Form fields have visible labels. | 1.3.1, 2.5.3, 3.3.2, 4.1.2 |
| 14.6 | **Input purpose.** Contact and address fields identify their purpose to the browser (autocomplete for name, email, phone, street address, postal code). | 1.3.5 |
| 14.7 | **Errors.** Validation errors are shown as text next to the field, name the field (`BR-DATA-08`), are linked to it programmatically, and on submit the focus moves to the first field in error (or to an error summary). | 3.3.1, 3.3.3 |
| 14.8 | **Images.** Product images have the alt text `Product.imageAlt`; the image placeholder keeps that alt text (`assets/README.md` section 2). Decorative graphics (background grid, falling code, terminal chrome dots) are hidden from assistive technology. The simulated map has a text alternative with the same information (for example "Courier Marek // Moto-v3, 1.2 mi away, ETA 04:35"). | 1.1.1 |
| 14.9 | **Contrast.** Text has a contrast ratio of at least 4.5 : 1 (3 : 1 for text ≥ 24 px, or ≥ 18.66 px bold); focus indicators, input borders and other essential UI components at least 3 : 1. The token pairs in `tokens.md` section 1 meet this; colors outside the tokens must also meet it. `color.text.disabled` is used only for disabled controls and code comments (`tokens.md` section 1.2). | 1.4.3, 1.4.11 |
| 14.10 | **Color is not the only carrier.** Status badges, stepper nodes, KPI tiles and validation states always include text or an icon with a name (`tokens.md` section 1.5). | 1.4.1 |
| 14.11 | **Reflow and zoom.** Content works at 320 CSS px width without two-dimensional scrolling (except the regions in NFR-03.2), at 200 % browser zoom without loss of content or function, and with increased text spacing. | 1.4.4, 1.4.10, 1.4.12 |
| 14.12 | **Status messages.** Order status changes on SCR-09, toasts, coupon results and the payment outcome are announced to screen readers through a polite live region. Ticking timers are **not** announced every second. | 4.1.3 |
| 14.13 | **Motion.** With `prefers-reduced-motion: reduce` the app behaves as in `tokens.md` section 7. Nothing flashes more than three times per second. | 2.3.1 |
| 14.14 | **Blinking and pulsing.** Decorative blinking or pulsing that starts automatically (terminal cursor, LIVE dot, falling code on error pages) stops after at most 5 seconds and remains in its static state, or the user can pause it. | 2.2.2 |
| 14.15 | **Page language and titles.** The page language is English (`en`). Every screen has a unique, descriptive page title that contains "Git Pizza MxDev" (for example "Checkout · Git Pizza MxDev"). | 3.1.1, 2.4.2 |
| 14.16 | **Tables.** Data tables (the receipt on SCR-13, totals tables) have header cells associated with their data. | 1.3.1 |
| 14.17 | **Time limits.** No time limit applies to the user except the business rule `BR-ORD-06` (payment window, 600 s at 1×); it is treated as essential, and the cart is kept when it expires (`BR-ORD-07`), so the user loses no data. | 2.2.1 |
| 14.18 | **Screen reader spot check.** E2E-01 can be completed with NVDA and Chrome on Windows, or with VoiceOver and Safari on macOS or iOS. | 4.1.2 |

Assumption A-91 (`07-design-system/accessibility.md` section 7.2) applies: the terminal cursor blink and the LIVE pulse, defined as infinite animations in `tokens.md` section 7, stop after at most 5 seconds (14.14) to meet WCAG 2.2.2. The static state keeps the visual meaning (cursor visible, LIVE dot visible).

---

## 8. Localisation

### NFR-15 Localisation, formats and time zone

| # | Requirement |
|---|---|
| 15.1 | The UI language is **English (United States)** only. Every visible text is English, including texts produced by the platform or by Marketplace components (validation messages, loading indicators, paging labels, date pickers, error dialogs). No other language appears anywhere (no default texts in Dutch or any other language). |
| 15.2 | Money is USD with the format of `BR-PRICE-11` (`$1,024.00`, discounts `−$3.22`). No other currency symbol or code appears. |
| 15.3 | Dates `YYYY-MM-DD`, times `HH:mm` 24-hour, log times `HH:mm:ss` (`BR-DATA-05`). Numbers use `.` as decimal separator and `,` as thousands separator. |
| 15.4 | All times are shown in the store time zone **`America/Los_Angeles`**, regardless of the time zone of the browser, device or server. Test: a browser set to `Europe/Warsaw` shows the same times as a browser set to `America/Los_Angeles`. Timestamps are stored in UTC (`BR-DATA-05`). |
| 15.5 | "Today" (home page KPIs `DEPLOYED_TODAY` and `AVG_PIPELINE_TIME`, couriers' `deliveriesToday`) is the calendar day in `America/Los_Angeles`, from 00:00 to 24:00 store time. Daylight-saving changes do not create duplicated or missing hours in timestamps or durations. |
| 15.6 | Units are US units: inches for pizza sizes, miles for distances (one decimal), °F for oven temperatures, fl oz for drinks and dips. |
| 15.7 | Phone numbers are shown as `(415) 555-0117`; ZIP codes are 5 digits; state codes are 2 capital letters (`BR-DATA-06`). |

---

## 9. Demo operation

### NFR-16 Demo data, seeding and reset

| # | Requirement |
|---|---|
| 16.1 | **Automatic seed.** When the app starts on an **empty database** (fresh deployment), it creates the complete seed of `09-demo-data/` automatically, without a manual import, script or click. The first visitor sees the full demo. |
| 16.2 | **Reset.** The demo reset (SIM-08) runs at every start with `Simulation.ResetOnStartup = true` and every day at 04:00 store time (A-42); there is no reset button, screen, URL or endpoint (LITE-CFG-03). It follows `BR-DATA-09`, writes the server log lines `RESET start by <trigger>` and `RESET end orders=<n> duration=<s>s` (LITE-CFG-07) and finishes within 60 s (NFR-05.12). Its result is identical to the automatic seed of 16.1. Two resets in a row give the same result. |
| 16.3 | **Seed contents after reset or first start** (minimum checks; full content in `09-demo-data/` and `menu-catalog.md`): 4 categories; 25 products (12 pizzas, 5 sides, 5 drinks, 3 desserts) all PUBLISHED with the catalog prices, of which Tiramisu Stack is sold out; 51 ingredients, all in stock except `jalapeno`; 40 options (5 crusts, 6 sauces, 4 cheeses, 25 extras); the coupons of `menu-catalog.md` section 8 (`GITHUB_STUDENT`, `FREE_DISPATCH`, the expired `HOTFIX10`); 8 delivery zones; 2 ovens ONLINE; 5 couriers with CU-05 Mei Tanaka OFF_DUTY; store and simulation settings at their defaults (`information-model.md` sections 7.5 and 7.6, `lite-configuration.md` section 2); intake OPEN; seed orders covering every `OrderStatus` value as defined in `09-demo-data/`, including the guest orders of Jordan Lee (`jordan.lee@example.com`) that can be found on SCR-10. |
| 16.4 | **Reset during use.** A scheduled reset at 04:00 affects every visitor (A-11). Screens open in a browser recover within 10 s without an error page: a tracking page of an order that no longer exists shows the invalid-link state (SIM-08 section 5); a guest whose cart was deleted sees an empty cart and the reset toast. |
| 16.5 | During the reset, other users cannot place orders or change data in a way that leaves mixed old and new data. Actions attempted during the reset either complete before it or are rejected with a message after it. |
| 16.6 | No guest action can make the demo permanently unusable: guests cannot change catalog, settings, couriers, ovens, zones or coupons (NFR-10.10), and every reset restores the seed. |

Assumption A-42 (SIM-08) applies: besides the reset at a start with `ResetOnStartup = true`, a scheduled reset runs every day at 04:00 store time and the seed is loaded on first start of an empty database. Housekeeping (`BR-ORD-22`, SIM-08 section 7) keeps the data volume bounded between resets. Because of the 04:00 reset and the store-day KPIs, the acceptance tests run between 02:00 and 24:00 store time (A-31, `12-acceptance/test-scenarios.md` section 2.1).

### NFR-17 Demo stability and data integrity

| # | Requirement |
|---|---|
| 17.1 | **Unattended operation (should).** The app runs locally for at least 25 hours with traffic ON at 1× without manual intervention, including one scheduled reset at 04:00. During that time the simulator keeps working, screens stay within NFR-05 targets, and the database does not grow beyond what housekeeping allows. |
| 17.2 | **Error isolation.** An error while the simulator processes one order or one courier is logged (NFR-19) and does not stop the simulation for other orders, couriers or ovens. |
| 17.3 | **Concurrent actions.** When a person and the simulator, or two people, act on the same order at the same moment, exactly one transition happens ("whichever comes first wins", `order-lifecycle.md` section 1), exactly one `OrderStatusChange` is written, and the other actor gets a short message and the current state, never an error page or a duplicate log line. |
| 17.4 | Order numbers and commit hashes stay unique when several orders are placed at the same moment. Order numbers ascend; gaps are allowed. |
| 17.5 | **Invariants** hold at all times: an oven never has more BAKING orders than `capacityOrders`; a courier carries at most one order; an order has at most 3 payment attempts; final states never change (`BR-ORD-17`); every order has a status history starting with its creation. |
| 17.6 | **No raw error dialogs.** No acceptance test produces the platform's generic error popup or a technical error message. Unexpected errors show SCR-41 or a themed message as specified in FD-15; real technical details (stack traces, entity names, SQL) are never shown to users (`glossary.md` section 1.8). |
| 17.7 | Validation failures and rejected actions never lose the user's input (for example a checkout with a wrong ZIP keeps all other fields filled). |

---

## 10. Local run and operations

### NFR-18 Local run and security level

| # | Requirement |
|---|---|
| 18.1 | **Local run.** The app runs locally with Mendix 11.16.1 on a base URL such as `http://localhost:8080`. There is no public deployment, cloud environment or public URL. The automated tests build, start and stop it without a person, through two scripts in Windows PowerShell 5.1 (`12-acceptance/deliverables.md` section 6.1): `RUN/start.ps1` with the parameters `-SpeedFactor` and `-ResetOnStartup` builds the project if needed, starts the app, returns when the app accepts HTTP requests (exit code 0, base URL printed) or fails with a non-zero exit code; `RUN/stop.ps1` stops the app and every process and container it started. Every command in `RUN/operations.md` is non-interactive; nothing needs the Studio Pro user interface. Which local runtime runs the app (for example the Mendix runtime in a container, or the portable runtime started from the command line) is the contractor's choice, documented in `RUN/operations.md`. |
| 18.4 | **Security level.** The app runs with Mendix security level **Production**. The only user role for visitors is `Anonymous` (anonymous users enabled, information model section 10); the platform's administrator role exists only for the built-in admin user and has no app pages. The app offers no sign-in: no page, link or navigation of the app leads to a login (the platform's default login page may exist for the built-in admin user, but nothing in the app points to it), and there is no sign-up, no demo-user switcher and no other user account. No debug, test or admin pages are reachable except those in the screen inventory. |
| 18.5 | **Reproducible build.** From a fresh clone of the delivered Git repository, `RUN/start.ps1` alone (with the prerequisites listed in `RUN/operations.md`) builds and starts a working app with the full seed (NFR-16.1). No paid license, cloud environment, external service or manual database step is needed. |
| 18.6 | The constants `Simulation.SpeedFactor` and `Simulation.ResetOnStartup` (`lite-configuration.md` section 1) are set per run by the parameters of `RUN/start.ps1`, through configuration the script controls (for example a runtime configuration file it writes, or environment variables), never by editing the model and never through the Studio Pro user interface. Their defaults and how the script sets them are documented in `RUN/operations.md`. No other value must be set to run the app. |
| 18.7 | The server clock is correct (synchronized); all business timestamps come from the server clock (`BR-ORD-02`), never from the browser. |

### NFR-19 Logging and server log lines

| # | Requirement |
|---|---|
| 19.1 | The application writes a server log (the log of the Mendix runtime) that the automated acceptance tests read while the app runs locally. `RUN/operations.md` says where it is (console output or log file). |
| 19.2 | At level INFO the log contains at least: app start with the constants (`CONFIG SpeedFactor=<n> ResetOnStartup=<true|false>`, LITE-CFG-07); every demo reset, including the seed load on an empty database (`RESET start by <trigger>`, `RESET end orders=<n> duration=<s>s`, LITE-CFG-07); every order status change (`ORDER`, LITE-CFG-04); every courier status change (`COURIER`, LITE-CFG-05); every order created by the traffic generator (`SPAWN`, LITE-CFG-06). The formats are exactly those of `lite-configuration.md` section 3; the lines are written on the log node `Simulation`. |
| 19.3 | The log never contains tracking tokens, contact data (name, email, phone, address) of guests or simulated customers, or complete request bodies (LITE-CFG-08). Order numbers, courier codes and ZIP codes are allowed. |
| 19.4 | Every unexpected error is logged at level ERROR with timestamp, the action or simulator step, the order number if any, and the technical details (stack trace). The user sees only the themed message (NFR-17.6). |
| 19.5 | **Exactly one INFO line per order transition** on the log node `Simulation` (`ORDER`, LITE-CFG-04), also for transitions made by the guest; no INFO line per tick; everything else the simulator logs is at DEBUG or TRACE (LITE-CFG-08). The acceptance tests count these lines. |
| 19.6 | The business audit trail stays in the data (`OrderStatusChange`, `OrderLogEntry`, `SimulationEvent`); the guest sees its customer-visible part on SCR-09 and SCR-13; the server log does not replace it. |

---

## 11. Brand, assets and maintainability

### NFR-20 Brand, assets and texts

| # | Requirement |
|---|---|
| 20.1 | The only logo is the Pixel Slice logo family in `assets/brand/` (`07-design-system/logo-usage.md`). The names and artwork `PIZZA_OS`, "Pizza MxDev Logo", the triangle logo, logo variants 1–5, the previous raster "git tree pizza" logo and any other obsolete brand material from Stitch appear **nowhere**: not in the UI, page titles, alt texts, favicon, error pages or seed data (`product-brief.md` section 8). |
| 20.2 | The app uses only images from `assets/`. Every delivered file is shown; the one missing image (`illustrations/no-results.png`) and products without photo use the placeholder of `assets/README.md` section 2 (`IMAGE_PENDING // <file name>`), never stock photos, generated images or images from other sources. |
| 20.3 | A missing image delivered later by the owner can be added without changing logic: by placing the file with its listed name in the project, by the procedure described in `RUN/operations.md` (a rebuild and a restart with `ResetOnStartup = true` are acceptable, a change of the app's logic is not). |
| 20.4 | The browser tab **should** show the favicon `brand/favicon.svg` (fallback `brand/favicon-32.png`), and the home-screen icon `brand/apple-touch-icon.png` / manifest icons `brand/icon-192.png`, `icon-512.png`, not the platform's default icon. |
| 20.5 | UI texts, labels, dev labels, status labels and messages match the package (`glossary.md`, `order-lifecycle.md` section 2, `06-ui-specification/` text catalogue). Names, prices and codes of products, options and coupons match `menu-catalog.md` exactly. |
| 20.6 | The fonts JetBrains Mono and Geist are actually loaded and used as in `tokens.md` section 2 (not replaced by a fallback font). |

### NFR-21 Maintainability and configurability

| # | Requirement |
|---|---|
| 21.1 | Every business value that the information model holds as data (prices, surcharges, extra prices, fees, thresholds, tax rate, limits, coupons, zones, ovens, couriers, simulation durations, rates and switches) is read from the data seeded from `09-demo-data/`, never hard-coded in logic or texts. The two constants of `lite-configuration.md` section 1 are the only values read from the configuration. |
| 21.2 | `RUN/delivery-notes.md` contains a complete mapping of every object and enumeration of `information-model.md` to the contractor's names (entity, attribute, enumeration), including where a package object was split, merged or not implemented (`information-model.md`, introduction). |
| 21.3 | The project is readable for another Mendix team: consistent naming, no unused leftovers of templates or starter apps visible to users, and documentation of non-obvious parts (simulator, reset, live refresh, server log lines) in `RUN/delivery-notes.md` and `RUN/operations.md`. |
| 21.4 | Starter-app or template screens, sample data and default navigation items that are not part of the screen inventory are not reachable in the delivered app. |

---

## 12. Assumptions introduced in this document

| ID | Assumption | Requirement |
|---|---|---|
| A-52 | Response times are measured on the locally running app, RTT ≤ 150 ms, with the desktop and phone profiles of section 5.2 | NFR-05 |
| A-53 | Sessions stay alive while any tab of the app is open; they may expire only after the browser is closed (≥ 10 minutes of inactivity) | NFR-09.9 |

This document also relies on A-91 (decorative animations stop after 5 s, NFR-14.14) and A-42 (scheduled daily reset, NFR-16). All assumptions are listed, with their open question, in [`../open-questions.md`](../open-questions.md).
