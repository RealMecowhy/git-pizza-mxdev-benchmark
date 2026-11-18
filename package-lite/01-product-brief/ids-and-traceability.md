# IDs and Traceability — Master Register

This file is the single source of truth for identifiers in the Git Pizza MxDev Lite handover package. Every document uses the IDs defined here.

Lite keeps the IDs of the full Git Pizza MxDev product. IDs of features that are not in Lite are not used and never re-used, so the numbering has gaps (for example SCR-11, US-005, FD-08, BR-ORD-19). Rules that exist only in Lite have their own families (`LITE-CFG`, `LITE-SES`, `LITE-SEC`); a Lite addition to an existing rule keeps the rule's ID with a letter suffix (`BR-SIM-16a`).

Related foundation files:

- Terms and dev metaphors: [glossary.md](glossary.md)
- Objects, attributes, enumerations, price rules, guest sessions, access rights: [../04-information-model/information-model.md](../04-information-model/information-model.md)
- Order states and transitions: [../05-processes/order-lifecycle.md](../05-processes/order-lifecycle.md)
- Fixed simulation configuration: [../10-simulations/lite-configuration.md](../10-simulations/lite-configuration.md)
- Menu, options and coupons: [../09-demo-data/menu-catalog.md](../09-demo-data/menu-catalog.md)
- Design tokens: [../07-design-system/tokens.md](../07-design-system/tokens.md)

---

## 1. ID schemes

| Prefix | Meaning | Format | Example | Defined in | Range rules |
|---|---|---|---|---|---|
| `FD-xx` | Functional area (one per file in `02-functional-design/`) | two digits | `FD-05` | this file, section 2 | FD-01 … FD-15; in Lite FD-01 – FD-07, FD-09, FD-13 – FD-15 |
| `EP-xx` | Epic. Epic `EP-n` covers functional area `FD-n` (1:1) | two digits | `EP-05` | this file, section 3 | EP-01 … EP-15; in Lite the epics of section 3 |
| `US-xxx` | User story | three digits | `US-091` | `03-user-stories/` | Epic `EP-n` owns US numbers `(n-1)×20+1` … `n×20` (see section 3) |
| `BR-<AREA>-xx` | Business rule | area code + two digits | `BR-PRICE-04` | the document that owns the area (section 1.1) | sequential per area |
| `BR-<AREA>-xxa` | Lite addition to a rule: a new rule that belongs next to rule `xx` | rule ID + lower-case letter | `BR-SIM-16a` – `BR-SIM-16d` | the document of the area | letters in order a, b, c … |
| `LITE-CFG-xx` | Lite rule: fixed simulation configuration, constants, server log lines for the tests | two digits | `LITE-CFG-04` | `10-simulations/lite-configuration.md` | LITE-CFG-01 – 08 |
| `LITE-SES-xx` | Lite rule: guest session, cart and order access of the session | two digits | `LITE-SES-03` | information model section 2 | LITE-SES-01 – 05 |
| `LITE-SEC-xx` | Lite rule: access rights of the guest (`Anonymous`) and the system | two digits | `LITE-SEC-02` | information model section 10 | LITE-SEC-01 – 05 |
| `SCR-xx` | Screen, modal, drawer or dialog | two digits | `SCR-09` | this file, section 4 | customer 01–19, system 40–49; in Lite the 14 screens of section 4 |
| `PR-xx` | Business process (index in `05-processes/README.md`) | two digits | `PR-02` | this file, section 5 | PR-01 … PR-12; in Lite the processes of section 5 |
| `SIM-xx` | Simulation (spec in `10-simulations/`) | two digits | `SIM-04` | this file, section 6 | SIM-01 … SIM-09; SIM-03 is not in Lite |
| `T-xx` | Transition of the order state machine | two digits | `T-09` | `05-processes/order-lifecycle.md` section 4 | T-01 – T-17 |
| `NFR-xx` | Non-functional requirement | two digits | `NFR-11` | `11-non-functional/` | sequential |
| `TC-xxx` | Acceptance test case | three digits | `TC-084` | `12-acceptance/` | same ranges as US: epic `EP-n` owns `(n-1)×20+1` … `n×20` |
| `E2E-xx` | End-to-end test scenario (spans several epics) | two digits | `E2E-01` | `12-acceptance/` | sequential |
| `A-xx` | Assumption (a default chosen on the owner's behalf) | two digits | `A-07` | the document of its block (section 1.2); complete register in `open-questions.md` | fixed block per document (section 1.2); each number has exactly one meaning |
| `OQ-xx` | Open question for the owner | two digits | `OQ-03` | `open-questions.md` | sequential; one per assumption |
| `AC-xx` | Accessibility check | two digits | `AC-04` | `07-design-system/accessibility.md` section 12 | AC-01 … AC-12 |
| `TXT-<AREA>-xx` | Visible UI text | area + two digits | `TXT-CART-08` | `06-ui-specification/ui-copy.md` | sequential per area |
| `OBJ` names | Information-model object | `PascalCase` | `OrderLine` | information model | see section 7 |
| `ENUM` names | Enumeration | `PascalCase`, values `UPPER_SNAKE` | `OrderStatus.QA_CHECK` | information model | see section 7 |
| Product IDs | Menu item | `PZ-nn`, `SD-nn`, `DR-nn`, `DS-nn` | `PZ-05` | menu catalog | pizzas, sides, drinks, desserts |
| Option IDs | Configurator option | `CR-nn`, `SA-nn`, `CH-nn`, `EX-nn` | `EX-14` | menu catalog | crust, sauce, cheese, extra |
| Ingredient codes | Ingredient | `snake_case` | `fior_di_latte` | menu catalog | unique |
| Courier codes | Courier | `CU-nn` | `CU-01` | `09-demo-data/` | sequential |
| Oven codes | Oven | `OVEN_nn` | `OVEN_01` | `09-demo-data/` | sequential |
| Order numbers | Order | `MX-` + integer from 1001 | `MX-1048` | information model 5.1 | seed orders use the lowest numbers |
| Coupon codes | Coupon | `UPPER_SNAKE` or letters+digits | `GITHUB_STUDENT` | menu catalog | unique, case-insensitive |
| Token names | Design token | dot path | `color.primary.default` | tokens | see tokens.md |

### 1.1 Business-rule area codes

| Area code | Area | Owning document | In Lite |
|---|---|---|---|
| `BR-NAV` | Shell, navigation, branding | `02-functional-design/` (FD-01) | yes; rules for accounts, staff and intake pause not used |
| `BR-MENU` | Menu browsing | FD-02 | yes |
| `BR-CONF` | Pizza configurator | FD-03 | yes |
| `BR-CART` | Cart (manifest) and coupons | FD-04 | yes; customer cart and merge on sign-in not used |
| `BR-CHK` | Checkout | FD-05 | yes; saved addresses, sign-in and intake pause not used |
| `BR-PAY` | Simulated payment | FD-06 | yes |
| `BR-TRK` | Order tracking | FD-07 | yes; customer-account rules not used |
| `BR-ACC` | Accounts, login, demo access | FD-08 | **not in Lite** |
| `BR-PRF` | Customer profile and history | FD-09 | only the receipt rules BR-PRF-09 – BR-PRF-11 |
| `BR-KDS` | Kitchen display | FD-10 | **not in Lite** |
| `BR-OPS` | Order operations (manager) | FD-11 | **not in Lite** |
| `BR-CAT` | Menu (catalog) management | FD-12 | **not in Lite** |
| `BR-COUR` | Courier management | FD-13 | only the automatic-dispatch rules BR-COUR-10, 11, 14, 15, 17 |
| `BR-SIM` | Simulations and demo reset | `10-simulations/` (BR-SIM-01 – 54, with Lite additions such as BR-SIM-16a – 16d), FD-14 (BR-SIM-60 – 75) | yes; panel rules not used |
| `BR-ERR` | Errors and system messages | FD-15 | yes; access-denied and sign-in rules not used |
| `BR-PRICE` | Price, fee, tax, discount and rounding rules | **information model, section 6** (foundation) | yes; coupon steps that need an account do not apply |
| `BR-ORD` | Order state machine rules | **order-lifecycle.md** (foundation) | yes; staff actions not used |
| `BR-DATA` | General data rules (validation, snapshots, uniqueness) | **information model, section 8** (foundation) | yes |
| `BR-DEMO` | Demo data content rules | `09-demo-data/` | yes |
| `LITE-CFG`, `LITE-SES`, `LITE-SEC` | Lite-only rules | section 1 | yes |

Functional-design authors must not redefine a `BR-PRICE`, `BR-ORD` or `BR-DATA` rule. They reference it. A rule marked "not used in Lite" is not built and is not tested.

### 1.2 Assumption ID blocks

Every document that adds assumptions uses its own fixed block, so numbers never collide. Gaps inside a block are allowed. The complete register, with one open question per assumption and its status in Lite, is [`../open-questions.md`](../open-questions.md).

| Block | Owning document(s) | Used |
|---|---|---|
| A-01 – A-17 | `01-product-brief/product-brief.md` section 9 | A-01 – A-17 |
| A-18 – A-30 | `02-functional-design/` (README section 5) | A-18 – A-30 |
| A-31 – A-39 | `09-demo-data/README.md` section 9 | A-31 – A-34 |
| A-40 – A-49 | `10-simulations/` (README section 6) | A-41, A-42 |
| A-50 – A-54 | `11-non-functional/requirements.md` section 12 | A-50 – A-53 |
| A-55 – A-59 | `12-acceptance/README.md` | A-55 |
| A-60 – A-79 | `06-ui-specification/README.md` | A-60, A-61, A-64 – A-69, A-72 – A-75, A-77, A-78 |
| A-80 – A-89 | `03-user-stories/README.md` section 7 | A-80, A-81 |
| A-90 – A-99 | `07-design-system/accessibility.md` | A-90, A-91 |

A document that needs a default already defined elsewhere references that ID instead of defining a new one.

### 1.3 Wording conventions used with IDs

- A requirement uses **must** (mandatory), **should** (expected unless there is a documented reason) or **may** (optional). These map to MoSCoW **M**, **S**, **C**. **W** (Won't) items are listed as out of scope.
- A reference to another item is written as the bare ID, for example "see `BR-PRICE-04`". Do not repeat the rule text; link to it.
- "Not used in Lite" marks a rule, a transition, a step or an assumption that stays in the text because other rules refer to it, but is not built in Lite.

---

## 2. Functional areas

| ID | Functional area | Actors in Lite | Screens | File |
|---|---|---|---|---|
| FD-01 | Shell, navigation and branding | Guest | SCR-16 | `02-functional-design/fd-01-shell-navigation.md` |
| FD-02 | Menu browsing (module explorer), home page | Guest | SCR-01, SCR-02, SCR-04 | `fd-02-menu.md` |
| FD-03 | Pizza configurator (dependency manager) | Guest | SCR-03 | `fd-03-configurator.md` |
| FD-04 | Cart (manifest) and coupons | Guest | SCR-05 | `fd-04-cart.md` |
| FD-05 | Checkout (deploy config) | Guest | SCR-06 | `fd-05-checkout.md` |
| FD-06 | Simulated payment | Guest, Simulator | SCR-07, SCR-08 | `fd-06-payment.md` |
| FD-07 | Order tracking (deployment status) | Guest | SCR-09, SCR-10 | `fd-07-tracking.md` |
| FD-09 | Order detail and receipt (Lite part of "Customer profile and order history") | Guest | SCR-13 | `fd-09-profile.md` |
| FD-13 | Automatic courier dispatch (Lite part of "Courier management") | Simulator | — (effects on SCR-09, SCR-01) | `fd-13-couriers.md` |
| FD-14 | Simulation configuration and demo reset (Lite part of "Simulation control") | Simulator, System | — | `fd-14-simulation-control.md` |
| FD-15 | Errors and system messages | Guest | SCR-40, SCR-41 | `fd-15-errors.md` |

FD-08 (accounts and demo access), FD-10 (kitchen display), FD-11 (order operations) and FD-12 (menu management) are not in Lite.

---

## 3. Epics

| Epic | Name | Short scope in Lite | Stories in Lite | MoSCoW | US range | TC range |
|---|---|---|---|---|---|---|
| EP-01 | Shell, navigation and branding | Header, Project Explorer sidebar, phone bottom tabs (3), footer, demo-mode banner, logo use, toasts, responsive layout switch | 9 (9 M) | Must | US-001 – US-020 | TC-001 – TC-020 |
| EP-02 | Menu browsing | Landing page with featured modules and live KPIs, category tabs, product cards with code-style ingredient block, dietary and spice badges, search ("grep"), item info modal with allergens, sold-out display | 14 (12 M, 1 S, 1 C) | Must | US-021 – US-040 | TC-021 – TC-040 |
| EP-03 | Pizza configurator | Size, crust, sauce, cheese, extra toppings (max per product), removal of default ingredients, live price and allergen recalculation, live `manifest.json` preview, add to cart | 13 (11 M, 2 S) | Must | US-041 – US-060 | TC-041 – TC-060 |
| EP-04 | Cart and coupons | Add/merge lines, change quantity, remove line, clear cart, coupon apply/remove with validation messages, totals breakdown, empty state, persistence per guest session | 13 (13 M) | Must | US-061 – US-080 | TC-061 – TC-080 |
| EP-05 | Checkout | Delivery vs pickup, address entry, delivery-zone check, contact details, tip, minimum order, "Execute Order" | 14 (12 M, 1 S, 1 C) | Must | US-081 – US-100 | TC-081 – TC-100 |
| EP-06 | Simulated payment | Payment method choice, demo test cards with defined outcomes, processing, success → confirmation, failure → retry (max 3) or cancel, refund on cancellation | 14 (14 M) | Must | US-101 – US-120 | TC-101 – TC-120 |
| EP-07 | Order tracking | Pipeline stepper, queue position, bake progress, live log, simulated map with courier, ETA, auto refresh, lookup by order number + email, guest cancel ("rollback") while allowed | 17 (16 M, 1 S) | Must | US-121 – US-140 | TC-121 – TC-140 |
| EP-09 | Customer profile and history | Lite: order detail and receipt for the guest, print | 2: US-166 (M), US-167 (S) | Must | US-161 – US-180 | TC-161 – TC-180 |
| EP-10 | Kitchen display | Lite: the Simulator runs the kitchen (SIM-02) | 1: US-194 (M) | Must | US-181 – US-200 | TC-181 – TC-200 |
| EP-13 | Courier management | Lite: automatic dispatch and courier trips (SIM-04) | 1: US-247 (M) | Must | US-241 – US-260 | TC-241 – TC-260 |
| EP-14 | Simulation control and demo reset | Lite: traffic generator, reset without a screen, live log lines, pickup arrival, housekeeping | 5: US-265, US-270 – US-273 (M) | Must | US-261 – US-280 | TC-261 – TC-280 |
| EP-15 | Errors and system messages | 404 and 500 pages, validation messages, concurrent changes, guest session expiry, offline/refresh failure notice, busy states | 8 (8 M) | Must | US-281 – US-300 | TC-281 – TC-300 |

**Total: 111 stories — 103 Must, 6 Should, 2 Could.** Story lists per epic are in `03-user-stories/README.md`. Epics EP-08 (accounts), EP-11 (order operations) and EP-12 (menu management) are not in Lite. The test cases that exist in Lite are listed in `12-acceptance/test-scenarios.md`; the TC range of an epic is a number block, not a promise that every number is used.

---

## 4. Screen inventory

One responsive web app. Every screen below exists on desktop and phone unless the "Devices" column says otherwise. The Stitch mobile screens are the phone layout of the same screen, not a separate app. Lite has 14 screens. Any other URL, including the URLs of screens that are not in Lite, shows SCR-40.

Column notes:

- **Roles**: G = Guest (the only user role, `Anonymous`). "token" = an order the guest's session may open (LITE-SES-03).
- **Type**: Page, Modal (centered overlay), Drawer (side panel; full screen on phone), Dialog (small confirmation), Shell (persistent frame).
- **Stitch reference**: screenshot of the Stitch design, path relative to `assets/stitch-reference/` (layout reference only; texts, data and branding in it are obsolete where they differ from this package). "(obsolete branding)" means keep the layout idea but replace `PIZZA_OS` with the Git Pizza MxDev brand and logo. "No Stitch design" means the screen is specified in `06-ui-specification/` and prototyped in `08-prototype/`.
- **Prototype folder**: where the clickable HTML prototype lives (`08-prototype/customer/`, including the error pages).
- **Mandatory states**: states the UI spec must define and the build must show.

### 4.1 Guest area (SCR-01 – SCR-19) — prototype folder `08-prototype/customer/`

| ID | Name (dev label) | Type | Roles | Purpose | Stitch reference (desktop / phone) | Mandatory states | MoSCoW |
|---|---|---|---|---|---|---|---|
| SCR-01 | Home (`./main.js`) | Page | G | Landing: hero "Architect Your Perfect Crust", terminal intro, "git checkout menu" CTA, featured modules carousel, live demo KPIs (`DEPLOYED_TODAY`, `AVG_PIPELINE_TIME`, `KITCHEN_LOAD`, `COURIERS_ON_DUTY`), live build status of the guest's latest open order (if any) | `desktop/home.jpg` / no phone design (derive from `mobile/menu-mobile.jpg` patterns) | default; with active order | Must |
| SCR-02 | Menu (`./menu.ts`, module explorer) | Page | G | Browse categories as file tabs (`pizzas.json`, `sides.yml`, `drinks.env`, `desserts.md`), product cards, search, quick add; desktop shows "Terminal Debugger" cart summary panel | `desktop/menu-and-cart.jpg` / `mobile/menu-mobile.jpg` | loading; results; no search results; item sold out | Must |
| SCR-03 | Pizza configurator (`configure_module.ts`) | Page (phone: full page) | G | Configure one pizza: size, crust, sauce, cheese, extras, removals; live price, allergens, dietary flags, `manifest.json` preview; add to cart or update existing cart line | `desktop/module-configurator.png` (obsolete branding) / `mobile/configurator-mobile.jpg` | new; editing a cart line; max extras reached; option unavailable; product sold out | Must |
| SCR-04 | Item info (`module.info`) | Modal (phone: bottom sheet) | G | Details of a non-pizza item (side, drink, dessert) and allergen/nutrition info for any item; quantity and add to cart | No Stitch design | default; sold out | Must |
| SCR-05 | Cart (`MANIFEST.LOCK`) | Drawer (phone: full page) | G | Review lines, change quantity, edit pizza (back to SCR-03), remove, clear, apply/remove coupon, totals, go to checkout | `desktop/cart-manifest-modal.jpg` / no phone design | **empty cart**; with lines; coupon valid; coupon invalid (each error message); below delivery minimum note | Must |
| SCR-06 | Checkout (`checkout_config.json`) | Page | G | Delivery or pickup, address (`.env` variables), delivery-zone check, contact details, payment method and demo test card (`PAYMENT_PROTOCOL`), tip, order summary, "Execute Order --force" | `desktop/delivery-and-payment.jpg` / `mobile/checkout-payment-mobile.jpg` | delivery; pickup; validation errors; outside delivery zone; empty cart redirect | Must |
| SCR-07 | Payment sheet (`PAYMENT_PROTOCOL`, simulated) | Modal (phone: bottom sheet) | G | Opens after "Execute Order": shows simulated processing for the method and test card chosen on SCR-06; on failure lets the guest pick another method/test card and retry (max 3 attempts) or cancel | No Stitch design (payment block of `mobile/checkout-payment-mobile.jpg` as visual reference) | processing; **payment failed** (declined / insufficient funds / gateway timeout) with method re-selection; third failure → order rolled back | Must |
| SCR-08 | Order confirmation (`DEPLOYMENT SUCCESSFUL // 200 OK`) | Modal | G | Success after payment: commit hash with copy, order number, queue position, ETA, oven note, payment reference, first log lines, tracking link, "Monitor pipeline" → SCR-09 | `desktop/order-deployed-modal.jpg` / no phone design | default | Must |
| SCR-09 | Order tracking (`DEPLOYMENT_STATUS`) | Page | G (token or tracking link) | Pipeline stepper, queue position, bake progress, live log, simulated map with courier (delivery), ETA, order summary, cancel ("Rollback") while allowed | `desktop/order-status.jpg` / `mobile/delivery-status-mobile.jpg` | every order status of `OrderStatus` (see order-lifecycle section 6); rollback allowed; rollback rejected; invalid/expired link | Must |
| SCR-10 | Track order lookup (`git log --grep`) | Page | G | Find an order by order number + email (guests without the link, seed orders) | No Stitch design | empty form; not found; found → SCR-09 | Must |
| SCR-13 | Order detail and receipt (`git show <hash>`) | Page | G (token, read-only) | Full read-only detail of one order: lines with modifiers, totals, payment, status history; printable receipt. Opened with "View receipt" from SCR-09 | No Stitch design | completed; cancelled (with refund note) | Must (print: Should) |
| SCR-16 | Customer shell and navigation | Shell | G | Header (logo, nav `./main.js`, `./menu.ts`, `./checkout.yml`, `./track.log`, search, cart button with count), desktop "Project Explorer" sidebar, phone bottom tab bar (3 tabs), footer, demo-mode banner, toasts | header/sidebar/footer in `desktop/menu-and-cart.jpg`, `desktop/home.jpg` / bottom bar in `mobile/menu-mobile.jpg` | cart empty/non-empty; with and without an order of the session | Must |

SCR-11, SCR-12, SCR-14, SCR-15 and SCR-17 – SCR-19 are not in Lite.

### 4.2 Staff area (SCR-20 – SCR-39)

Not in Lite. There is no login page and no staff screen.

### 4.3 System pages (SCR-40 – SCR-49) — prototype folder `08-prototype/customer/`

| ID | Name (dev label) | Type | Roles | Purpose | Stitch reference | Mandatory states | MoSCoW |
|---|---|---|---|---|---|---|---|
| SCR-40 | Not found (`ERROR 404 // CRUST_NOT_FOUND`) | Page | G | Unknown URL (including URLs of screens that are not in Lite), unknown order link, archived product link; "RETURN_TO_MAIN" | `desktop/system-error.png` (obsolete branding) | default | Must |
| SCR-41 | Unexpected error (`ERROR 500 // SEG_FAULT`) | Page | G | Unhandled error; "RETRY_DEPLOYMENT" and "RETURN_TO_MAIN" | `desktop/system-error.png` (layout reused, obsolete branding) | default | Must |

SCR-42 (access denied) and SCR-43 – SCR-49 are not in Lite. The error pages are built on the guest prototype runtime (`customer/_shared/proto.js`, `proto.css`).

### 4.4 Stitch references that are not screens

| Reference (in `assets/stitch-reference/`) | Use |
|---|---|
| `desktop/ui-kit-asset-handover.jpg` | Design-system reference for `07-design-system/` (components, tokens). Not a screen of the app. |
| `desktop/ssh-auth.png`, `desktop/developer-profile.png` | Style references only: the terminal form of SCR-10 and the read-only detail of SCR-13. Their login and profile content is not used in Lite. |

Every other logo or brand file of the Stitch designs is **obsolete and never used**; the only logo is the Pixel Slice logo family in `assets/brand/` (`07-design-system/logo-usage.md`, obsolete material in its section 10).

---

## 5. Processes

Only PR-02 and PR-07 have a document of their own (`order-lifecycle.md`). Every other process is specified, with its diagram, in the document that owns its rules; [`05-processes/README.md`](../05-processes/README.md) is the index with links and an overview diagram.

| ID | Process | Owning document(s) | Main screens |
|---|---|---|---|
| PR-01 | Guest ordering journey (browse → configure → cart → checkout → pay → track) | product brief section 6; `02-functional-design/README.md` section 2; FD-02 – FD-07 | SCR-01 → SCR-09 |
| PR-02 | Order lifecycle (state machine) | `05-processes/order-lifecycle.md` (foundation) | all order screens |
| PR-03 | Simulated payment and retry | FD-06 + SIM-01 | SCR-06, SCR-07, SCR-08 |
| PR-04 | Kitchen flow (queue → oven → QA → ready), automatic only | SIM-02 | SCR-08, SCR-09 (effects) |
| PR-05 | Dispatch and delivery (automatic courier assignment, route, return) | SIM-04 + FD-13 | SCR-09 |
| PR-06 | Pickup | SIM-06 (with FD-07) | SCR-09 |
| PR-07 | Cancellation and refund | `05-processes/order-lifecycle.md` section 5 (foundation) | SCR-07, SCR-09 |
| PR-09 | Demo seed, reset and housekeeping | SIM-08 + FD-14 | — (no screen) |
| PR-10 | Simulated order traffic | SIM-05 | SCR-01 (KPIs, effects) |

PR-08 (menu change), PR-11 (sign-in and role routing) and PR-12 (intake pause) are not in Lite.

## 6. Simulations

| ID | Simulation | Drives | Lite configuration (see `10-simulations/lite-configuration.md` and order-lifecycle section 7) |
|---|---|---|---|
| SIM-01 | Payment gateway | PAYMENT_PENDING → QUEUED / PAYMENT_FAILED, refunds | outcome by chosen test card; random failure rate 0 % |
| SIM-02 | Kitchen auto-advance | QUEUED → BAKING → QA_CHECK → READY_*; oven temperature in the log, bake progress, queue position, kitchen load (BR-SIM-16a – 16d) | always ON; QA failure rate 0 % |
| SIM-04 | Courier dispatch and route | courier assignment, travel to store, handover, route progress, delivery, return | always ON; CU-01 – CU-04 on duty, CU-05 off duty |
| SIM-05 | Order traffic generator | new orders from simulated customers | always ON (A-12) |
| SIM-06 | Pickup customer arrival | READY_FOR_PICKUP → PICKED_UP | always ON |
| SIM-07 | Live logs | `OrderLogEntry` lines shown to the guest | always on |
| SIM-08 | Demo seed, reset and housekeeping | restores demo data; removes old simulated orders | on first start, at a start with `ResetOnStartup = true`, daily at 04:00 store time (A-42); housekeeping every 15 min |
| SIM-09 | Simulation clock (speed factor) | scales all simulated durations | constant `SpeedFactor` (1, 2, 5, 10); never paused |

SIM-03 (oven telemetry) is not in Lite.

## 7. Information-model object names (OBJ)

Defined in the information model. Listed here so every author uses the same names.

| Object | One-line meaning |
|---|---|
| `Category` | Menu category (file tab) |
| `Product` | Menu item (module) |
| `ProductSize` | Price point of a product for one size |
| `Ingredient` | Ingredient with allergens and availability |
| `RecipeItem` | Default ingredient of a pizza recipe |
| `Option` | Configurator option (crust, sauce, cheese, extra topping) |
| `Cart` | Current basket (manifest) of a guest session |
| `CartLine` | One configured item in the cart |
| `Coupon` | Discount code |
| `Order` | Placed order (deployment) |
| `OrderLine` | Snapshot of one ordered item |
| `OrderLineModifier` | Snapshot of one configuration choice on an order line |
| `PaymentAttempt` | One simulated payment attempt |
| `OrderStatusChange` | Audit record of one status transition |
| `OrderLogEntry` | One line of the order's live log |
| `Courier` | Delivery courier (courier node) |
| `Oven` | Kitchen oven (oven node) |
| `DeliveryZone` | ZIP code served for delivery |
| `StoreSettings` | Singleton: store data, fees, tax, intake status |
| `SimulationSettings` | Singleton: simulation switches, rates and durations (fixed in Lite) |
| `SimulationEvent` | One line of the simulation event log (data only, no screen in Lite) |

`UserAccount`, `CustomerProfile` and `Address` are not in Lite.

Enumerations: `ProductKind`, `ProductStatus`, `ProductBadge`, `SizeCode`, `SpiceLevel`, `Allergen`, `OptionGroup`, `PriceClass`, `RecipeRole`, `CouponState`, `DiscountType`, `OrderType`, `OrderSource`, `OrderStatus`, `PaymentStatus`, `PaymentMethod`, `TestCard`, `PaymentAttemptStatus`, `PaymentFailureCode`, `FeeWaiver`, `TipOption`, `ModifierType`, `ActorType`, `LogLevel`, `CourierStatus`, `VehicleType`, `OvenStatus`, `IntakeStatus`, `SpeedFactor`, `SimulationEventType`.

---

## 8. Traceability overview per epic

One row per epic in Lite. The story-level matrix, including the tests that verify each story (column "Verified by"), is [`../03-user-stories/traceability-matrix.md`](../03-user-stories/traceability-matrix.md).

| Epic | Functional area | User stories | Screens | Business rules | Objects | Processes | Simulations | Test cases |
|---|---|---|---|---|---|---|---|---|
| EP-01 | FD-01 | US-001 – 004, 006, 007, 010 – 012 | SCR-16 | BR-NAV-* | Cart, Order, StoreSettings | PR-01 | — | TC-001 – 020 |
| EP-02 | FD-02 | US-021 – 034 | SCR-01, SCR-02, SCR-04 | BR-MENU-*, BR-PRICE-01, BR-SIM-16d | Category, Product, ProductSize, Ingredient, RecipeItem, Order, Oven, Courier (KPIs) | PR-01 | SIM-02, SIM-04, SIM-05 (KPIs) | TC-021 – 040 |
| EP-03 | FD-03 | US-041 – 053 | SCR-03 | BR-CONF-*, BR-PRICE-01 – 03 | Product, Option, RecipeItem, CartLine | PR-01 | — | TC-041 – 060 |
| EP-04 | FD-04 | US-061 – 073 | SCR-05 | BR-CART-*, BR-PRICE-04 – 06, LITE-SES-02 | Cart, CartLine, Coupon | PR-01 | — | TC-061 – 080 |
| EP-05 | FD-05 | US-081 – 083, 085 – 089, 091 – 095, 097 | SCR-06 | BR-CHK-*, BR-PRICE-05 – 10 | Order, DeliveryZone, StoreSettings | PR-01 | — | TC-081 – 100 |
| EP-06 | FD-06 | US-101 – 114 | SCR-07, SCR-08 | BR-PAY-*, BR-ORD-* | PaymentAttempt, Order | PR-03, PR-07 | SIM-01 | TC-101 – 120 |
| EP-07 | FD-07 | US-121 – 137 | SCR-09, SCR-10 | BR-TRK-*, BR-ORD-*, BR-SIM-16b, BR-SIM-16c, LITE-SES-03 | Order, OrderLogEntry, Courier, Oven | PR-02, PR-05, PR-06, PR-07 | SIM-02, SIM-04, SIM-06, SIM-07 | TC-121 – 140 |
| EP-09 | FD-09 | US-166, US-167 | SCR-13 | BR-PRF-09 – 11 | Order, OrderLine, OrderLineModifier, PaymentAttempt, OrderStatusChange | PR-02, PR-07 | — | TC-161 – 180 |
| EP-10 | — (SIM-02) | US-194 | SCR-08, SCR-09 (effects) | BR-SIM-16 – 19, BR-SIM-16a – 16d, BR-ORD-11, BR-ORD-12 | Order, Oven, OrderLogEntry | PR-04 | SIM-02 | TC-181 – 200 |
| EP-13 | FD-13 | US-247 | SCR-09 (effects) | BR-COUR-10, 11, BR-ORD-15, BR-ORD-16, BR-SIM-23 – 27 | Courier, Order | PR-05 | SIM-04 | TC-241 – 260 |
| EP-14 | FD-14 | US-265, US-270 – 273 | — (effects on SCR-01, SCR-09, SCR-10) | BR-SIM-* (FD-14 section 5), LITE-CFG-* | SimulationSettings, SimulationEvent, StoreSettings | PR-06, PR-09, PR-10 | SIM-05 – SIM-09 | TC-261 – 280 |
| EP-15 | FD-15 | US-281, 282, 284 – 289 | SCR-40, SCR-41 | BR-ERR-*, LITE-SES-05 | — | — | — | TC-281 – 300 |
