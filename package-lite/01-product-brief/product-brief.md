# Product Brief — Git Pizza MxDev Lite

![Git Pizza MxDev logo](../assets/brand/logo-horizontal.png)

## 1. Vision

**Git Pizza MxDev** is a pizza delivery and pickup web app for software developers. It looks and feels like a developer's IDE: a dark interface set in JetBrains Mono, pizzas presented as **modules** with their ingredients written as code, a cart that is a **manifest**, an order that is **deployed**, and order progress shown as a **CI/CD pipeline** with live logs.

Behind the theme the product is serious: real Neapolitan-style pizzas with real ingredients, allergens, sizes and plausible San Francisco prices; a checkout with delivery-zone checks, fees, tax, tips and coupons; and a store that is visibly busy, with a kitchen, ovens and couriers working in the background. A visitor should feel they are using a real, production-quality product that happens to speak their language.

**Lite** is the guest storefront of this product. Every visitor is a guest; the kitchen, the couriers and the other customers are simulated.

Tagline (from the Stitch designs): **"Architect Your Perfect Crust."**

## 2. Why a demo

The app is a **demonstration product**. Its purpose is to let people order a pizza and watch a complete ordering business work end to end — payment, kitchen, oven, courier, delivery or pickup — in a few minutes, from any browser, without real money, real food or real couriers.

Therefore:

- Payment, kitchen progress, courier dispatch and delivery, pickup and incoming order traffic are **simulated**, realistically, by a system actor called the **Simulator** (see section 5). Nobody operates the kitchen or the couriers.
- Demo time is **compressed**: an order goes from payment to delivery in about five minutes at normal speed, and faster with the speed factor.
- The app opens **pre-filled** with realistic demo data, including orders in every status, so the store is busy from the first second.
- There is nothing to sign in to: the app opens directly for the guest (section 7).
- The demo data returns to its initial state automatically: on the first start, every day at 04:00 store time, and at a start with the constant `Simulation.ResetOnStartup = true` (SIM-08).

The package defines **what** the app does in testable terms and leaves **how** it is built in Mendix to the contractor. The delivery is checked by automated acceptance tests (`00-README.md` section 9).

## 3. Scope

### 3.1 In scope

| Area | Included |
|---|---|
| Ordering as a guest (FD-01 – FD-07) | Shell with DEMO MODE banner; landing page with live store KPIs; menu with 4 categories and search; pizza configurator (size, crust, sauce, cheese, up to 5 extras, removal of default ingredients) with live price, allergens and dietary flags; item info for sides, drinks and desserts; cart with quantities and coupons; checkout for delivery or pickup with delivery-zone check, minimum order, fees, sales tax and tip; simulated payment with retries; order confirmation; live tracking with pipeline, queue position, bake progress, log, simulated map and ETA; guest cancellation while still queued; order lookup by order number and email |
| Receipt (FD-09, part) | Read-only order detail and receipt (SCR-13) for the guest's own orders, with print (Should) |
| Background simulation (FD-13, FD-14, `10-simulations/`) | Automatic kitchen, automatic courier dispatch and trips, pickup arrivals, order traffic from simulated customers, live logs, simulation clock with a fixed speed factor, seed, scheduled and start-up reset, housekeeping; fixed configuration in `10-simulations/lite-configuration.md` |
| Errors (FD-15) | Themed 404 and 500 pages; validation and system messages; guest session expiry; connection loss |
| Design | Full IDE/terminal theme per `07-design-system/`; responsive desktop, tablet and phone layouts |

### 3.2 Out of scope (Won't)

| Item | Note |
|---|---|
| Real payment providers, real card data entry, cash payment | Payment is simulated with demo test cards only (A-06) |
| Real maps, geocoding or routing APIs | The map is a simulated, stylized city map with an animated courier marker |
| Native mobile apps, PWA install, push notifications | One responsive web app |
| SMS, email or webhook notifications | Stitch "ATTACH LISTENER" (SMS/Webhook) is dropped |
| Chat or phone call with the courier, support tickets | Stitch "IPC CHAT", "PULL COURIER", "OPEN_SUPPORT_TICKET" are dropped |
| Dine-in orders and table service | Stitch `DINE_IN` filter is dropped |
| Scheduled (future) orders, group orders, split payment | |
| Opening hours | The store is always open (A-08) |
| Multiple stores, multiple languages, multiple currencies | One store, English, USD |
| Inventory quantities, purchasing, staff scheduling, accounting exports | Stock is a simple in-stock / sold-out flag per ingredient, fixed in the seed |
| Partial refunds, tips after delivery, ratings and reviews | |

### 3.3 Not in Lite

These parts of the full Git Pizza MxDev product are not part of Lite. Do not build them, and do not add screens, buttons, URLs or endpoints for them.

| Item | Note |
|---|---|
| User accounts, sign-in, sign-up, sign-out, demo logins, password handling | Every visitor is a guest (`Anonymous`, information model section 2) |
| Customer profile, ranks, reward pixels, saved addresses, order history, re-order | The guest keeps the orders of the browser session and the tracking link (LITE-SES-03) |
| Staff screens: kitchen display, order operations, staff order detail, manager cancellation, force-advance, menu, ingredient, coupon and courier management | The kitchen and the couriers are run by the Simulator only |
| Simulation control panel, reset dialog, pause and resume, changing simulation parameters at run time, spawning orders on demand | Fixed configuration and two constants (`10-simulations/lite-configuration.md`) |
| Pausing order intake (`PIPELINE_PAUSED`) | Intake is always `OPEN` |
| The coupon `FIRST_COMMIT` | It needs an account; it is not in the Lite data |
| Oven telemetry (SIM-03) | The log uses the oven's target temperature (SIM-02 BR-SIM-16a) |
| Access-denied page (403) | Unknown or removed URLs show SCR-40 |

## 4. Users, roles and personas

| Role | Mendix user role | Persona | Goals | Main screens |
|---|---|---|---|---|
| **Guest** | `Anonymous` (anonymous user, no sign-in) | **Taylor Brooks**, frontend developer, first visit after seeing the app shared in a team chat | Order a pizza quickly without registering; see where it is and how busy the store is | SCR-01 – SCR-10, SCR-13 |
| **Simulator** | none (system actor on the server) | — | Make the demo come alive: payments, kitchen progress, ovens, couriers, pickups, new orders from simulated customers | acts on data; visible in logs as `SIMULATOR` |
| **System** | none (timers, start-up and scheduled jobs) | — | Payment window timeout, seed and reset, housekeeping | acts on data; visible in logs as `SYSTEM` |

The seed orders that a guest can look up belong to the fictional contact **Jordan Lee** (`jordan.lee@example.com`), a senior backend engineer in SoMa. Persona names, the store and all addresses are fictional. Phone numbers use the fictional `555-01xx` range.

## 5. The simulations at a glance

Detailed specs: `10-simulations/`; fixed values: `10-simulations/lite-configuration.md`. State machine and timings: [order-lifecycle.md](../05-processes/order-lifecycle.md).

| ID | Simulation | What the guest sees | Lite configuration |
|---|---|---|---|
| SIM-01 | Payment gateway | "Processing payment…", then success or a realistic failure (declined, insufficient funds, timeout) decided by the chosen demo test card | 3 s per attempt; no random failures |
| SIM-02 | Kitchen auto-advance | Own order moves QUEUED → BAKING → QA_CHECK → ready, with queue position and bake progress | always on; QA never fails |
| SIM-04 | Courier dispatch and route | Courier assigned, arrives at the store, takes the order, marker moves along the route on the map, delivery | always on; couriers CU-01 – CU-04 on duty |
| SIM-05 | Order traffic | Simulated customers order about every 2 minutes; the guest sees it in the KPIs, the queue position and the ETA | always on, max 8 open simulated orders |
| SIM-06 | Pickup arrival | Simulated pickup customers collect pickup orders (also the guest's) | always on |
| SIM-07 | Live logs | Terminal-style log lines for every step of the guest's own order | always on |
| SIM-08 | Seed, reset and housekeeping | The demo starts from the seed; old simulated orders disappear | first start, daily at 04:00, start with `ResetOnStartup = true` |
| SIM-09 | Simulation clock | All durations scaled by the speed factor | constant `SpeedFactor` 1, 2, 5 or 10; never paused |

## 6. Main journeys

1. **Guest order (delivery).** Home → Menu → configure Inferno Payload (Large, extra Cherry tomatoes; jalapeños are out of stock today) → add Mate Compiler Tonic → Cart → apply `GITHUB_STUDENT` → Checkout (delivery to a San Francisco address in the zone, contact details, card `Visa •••• 4242`, tip 15 %) → Execute Order → payment succeeds → confirmation with commit hash and queue position → tracking until `DEPLOYED`.
2. **Failed payment.** Same, with `Visa •••• 0002` → `PAYMENT_FAILED` → switch to Apple Pay → retry → success.
3. **Pickup.** Cart with a pizza and a dessert (Tiramisu Stack is sold out today) → Checkout with pickup → pay → tracking until `READY_TO_PULL` and `PULLED` → View receipt → Print receipt.
4. **Rollback.** Place an order → while it is `QUEUED`, roll it back on the tracking page → `ROLLED_BACK` with the simulated refund.
5. **Find an order.** `./track.log` without an order of the session → lookup with a seed order number and `jordan.lee@example.com` → tracking page of that order.
6. **Watch the store.** Home page KPIs (`DEPLOYED_TODAY`, `AVG_PIPELINE_TIME`, `KITCHEN_LOAD`, `COURIERS_ON_DUTY`) change while simulated orders are made and delivered.

## 7. Entry points

The app is open to everyone; there is no invitation, login page or role switch.

| Entry | How it is reached | Lands on | What it shows |
|---|---|---|---|
| App URL | Opening the app (locally) | SCR-01 Home | Full ordering, payment and tracking as a guest |
| Tracking link | The link shown on SCR-08 (`trackingToken`) | SCR-09 Order tracking | That order, in any browser (NFR-11) |
| Order lookup | `./track.log` without an order of the session, or the footer link | SCR-10 Track order lookup | Any guest order (also a seed order) found by order number + contact email |

The guest session, its cart and the orders it may open are defined in information model section 2 (LITE-SES-01 – LITE-SES-05).

## 8. Constraints

| Constraint | Value |
|---|---|
| Platform | **Mendix 11.16.1**: the delivered project opens in Studio Pro 11.16.1 (NFR-01). How the project is created and edited is the contractor's choice. Marketplace modules may be used; they must be listed with versions in `RUN/delivery-notes.md`. |
| Running | Locally, on the contractor's and the tester's machine. No public URL and no cloud deployment are required. How to build and start the app is in `RUN/operations.md`. |
| Security | Mendix security level **Production**. One user role for visitors: `Anonymous` (anonymous users enabled). No sign-in page, no sign-up, no other user accounts besides the administrator the platform needs. Access rights: information model section 10. |
| App type | One **responsive web app**. No native app, no separate mobile app. The Stitch mobile screens are the phone layout of the same screens. |
| Breakpoints | Phone 0–767 px (design reference 390 px), tablet 768–1199 px (reference 834 px), desktop ≥ 1200 px (reference 1280–1440 px). Exact tokens in `07-design-system/tokens.md`. |
| Language | English only (UI, demo data and messages). |
| Currency and formats | USD, `$1,024.00`; US phone numbers and ZIP codes; dates `YYYY-MM-DD`, 24-hour time; store time zone `America/Los_Angeles`. |
| Brand | Name **Git Pizza MxDev**; logo: only the Pixel Slice logo files in `assets/brand/` (a pixel-art pizza slice, wordmark `git_pizza mxdev`; rules in `07-design-system/logo-usage.md`). The brand names and logos `PIZZA_OS`, "Pizza MxDev Logo", the triangle logo, logo variants 1–5 from Stitch and the previous raster "git tree pizza" logo are obsolete and must not appear. |
| Look and feel | Dark theme only, design tokens from `07-design-system/`, JetBrains Mono, Material Symbols Outlined icons. |
| Images | Only images from `assets/`. All product photos and illustrations are supplied except `illustrations/no-results.png`, which uses the defined placeholder; contractors do not create or source their own product photos or logos. |
| External services | None required. The app must run without any paid or external API (payments, maps, email, SMS). |
| Live updates | Status changes visible within 5 seconds without reloading (BR-ORD-20). |
| Data | Pre-filled demo data per `09-demo-data/`; reset restores it. |
| Simulation | Fixed configuration and the constants `Simulation.SpeedFactor` and `Simulation.ResetOnStartup` (`10-simulations/lite-configuration.md`). |
| Requirements depth | Functional. The information model is conceptual; the contractor designs the Mendix domain model, pages, logic and security. |

## 9. Assumptions

Defaults chosen on the owner's behalf (block A-01 – A-17). Later documents add their own assumptions in fixed number blocks (`ids-and-traceability.md` section 1.2). Every assumption, with its open question and its status in Lite, is listed in the register [`../open-questions.md`](../open-questions.md).

| ID | Assumption |
|---|---|
| A-01 | One fictional store: Git Pizza MxDev — Mission Kitchen, 2140 Folsom Street, San Francisco, CA 94110. Delivery to 8 San Francisco ZIP codes (list in `04-information-model/information-model.md` section 7.8). |
| A-02 | Sales tax 8.625 % on subtotal minus discount; delivery fee and tip are not taxed. Prices on the menu exclude tax. |
| A-03 | Delivery fee $3.99, free from a $40.00 subtotal; minimum delivery subtotal $15.00; no minimum for pickup. |
| A-04 | Demo time is compressed (seconds instead of minutes); ETAs reflect the compressed time. |
| A-05 | Tip is offered for delivery only (0/10/15/20 % of subtotal minus discount), default 15 %. |
| A-06 | Payment methods: Card, Apple Pay, Google Pay — all simulated. Card payment uses a choice of five demo test cards with fixed outcomes; no card number field exists. No cash payment. |
| A-07 | Dine-in is out of scope. |
| A-08 | No opening hours; the store is always open. Lite has no intake pause. |
| A-09 | Not used in Lite (sign-up). |
| A-10 | Not used in Lite (reward pixels and ranks). |
| A-11 | One shared demo dataset for all visitors; a reset by the system affects everyone. Guest carts are per browser session. |
| A-12 | The traffic generator is always ON (one order about every 120 s at 1×, at most 8 open simulated orders). |
| A-13 | Not used in Lite (cancellation by staff). The guest may cancel only per A-17. |
| A-14 | Product photos and illustrations are supplied by the owner in `assets/`. **Resolved 2026-11-05:** all 25 product photos and the illustrations are present; only `illustrations/no-results.png` is still missing and shows the placeholder. |
| A-15 | Long body text (product descriptions, hero paragraph) uses the Geist font as in the Stitch screens; everything else uses JetBrains Mono. |
| A-16 | Finished simulated orders older than `retentionHours` (24 hours) are removed automatically; guest orders stay until a demo reset. |
| A-17 | The guest's cancel window is the QUEUED state only (plus PAYMENT_FAILED); it closes when baking starts. |
