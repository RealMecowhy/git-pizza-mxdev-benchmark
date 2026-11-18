# Demo Data (Seed) — `09-demo-data/`

This folder is the **seed**: the complete data the app contains after its first start and after every demo reset (SIM-08, PR-09). It contains the menu, reference data, the order history of one returning guest (Jordan Lee) and a "live" operational day with orders in every status for delivery and pickup. Lite has no accounts: every seed order is a guest order (`source = GUEST`) or a simulated order (`source = SIMULATOR`).

The files are machine-readable (JSON and CSV with identical content) so the contractor can load them without retyping. [validate.mjs](validate.mjs) proves that every file agrees with the foundation documents and with itself.

Related: [menu-catalog.md](menu-catalog.md) (the menu, human-readable, source of truth) · [../04-information-model/information-model.md](../04-information-model/information-model.md) (objects, `BR-PRICE`, `BR-DATA`) · [../05-processes/order-lifecycle.md](../05-processes/order-lifecycle.md) (states, transitions, timings) · `10-simulations/` (simulator behavior) · [`../10-simulations/sim-08-demo-reset.md`](../10-simulations/sim-08-demo-reset.md) (PR-09 demo reset).

---

## 1. Summary

| Area | Content |
|---|---|
| Menu | 4 categories, 25 products (12 pizzas, 5 sides & dips, 5 drinks, 3 desserts), 47 sizes and prices, 51 ingredients with allergens, 52 recipe items, 40 configurator options, 3 coupons; `DS-01` Tiramisu Stack sold out and the ingredient `jalapeno` out of stock (BR-DEMO-03a) |
| Reference data | Store settings, simulation settings, 8 delivery zones, 2 ovens, 5 couriers with their live state (`CU-05` always off duty) |
| People | No accounts and no customer profiles. One returning guest, Jordan Lee (`jordan.lee@example.com`), with 19 seed orders; a pool of 28 fictional customers used by the other seed orders and by the traffic generator |
| Orders | **46 orders** `MX-1001` – `MX-1046` with 117 order lines, 187 modifiers, 50 payment attempts, 248 status changes and 478 log lines: 18 past guest orders of Jordan Lee spread over four months, 11 orders that finished earlier today, 17 open orders in every open status |
| Simulation log (reference) | 67 simulation events of one demo day, ending with a `RESET` event; a reference file that is not loaded (BR-DEMO-03) |

All names, addresses, emails and phone numbers are fictional. Emails use `example.com`, `example.net` and `example.org`; phone numbers use the reserved `(415) 555-01xx` range. Addresses are plausible street addresses in the store's eight San Francisco delivery ZIP codes.

---

## 2. Files

JSON is the primary format; each CSV contains the same records (the validator checks this). Columns and keys use the attribute names of the information model; the few seed-only fields are listed in section 5.3.

| File(s) | Information-model object | Records | Notes |
|---|---|---|---|
| `categories.json` / `.csv` | `Category` | 4 | fixed categories (`pizzas.json`, `sides.yml`, `drinks.env`, `desserts.md`) |
| `menu-items.json` / `.csv` | `Product` | 25 | texts copied verbatim from `menu-catalog.md`; derived columns for testing (section 5.3) |
| `product-sizes.json` / `.csv` | `ProductSize` | 47 | key = `productCode` + `sizeCode`; prices, calories, slices, serving text |
| `ingredients.json` / `.csv` | `Ingredient` | 51 | `allergens`, `isVegetarian`, `isVegan`, `isInStock` (`jalapeno` out of stock) |
| `recipe-items.json` / `.csv` | `RecipeItem` | 52 | default recipe of each pizza besides crust, sauce and cheese |
| `options.json` / `.csv` | `Option` | 40 | 5 crusts, 6 sauces, 4 cheeses, 25 extras with prices per size |
| `allergens.json` / `.csv` | enumeration `Allergen` | 14 | EU-14 keys, captions, short codes, plus the allergen notice text |
| `allergen-matrix.csv` | (derived) | 25 | allergens and diet of every product in its default configuration — a test oracle, not imported |
| `coupons.json` / `.csv` | `Coupon` | 3 | `HOTFIX10` is expired on purpose |
| `delivery-zones.json` / `.csv` | `DeliveryZone` | 8 | plus derived `tripSecondsAt1x` |
| `ovens.json` / `.csv` | `Oven` | 2 | `currentTempF` empty: Lite has no oven telemetry |
| `couriers.json` / `.csv` | `Courier` | 5 | master data plus live state at T (`status`, `currentOrder`, `tripProgressPercent`) |
| `store-settings.json` | `StoreSettings` | 1 | singleton |
| `simulation-settings.json` | `SimulationSettings` | 1 | singleton, durations in seconds at 1× |
| `simulated-customers.json` / `.csv` | (seed-only pool) | 28 | contact and address data for guest and simulated orders and for the traffic generator (SIM-05) |
| `orders.json` | `Order` with nested `OrderLine`, `OrderLineModifier`, `PaymentAttempt`, `OrderStatusChange`, `OrderLogEntry` | 46 | the complete order data in one file |
| `orders.csv` | `Order` | 46 | flat; children in the files below, linked by `orderNumber` |
| `order-lines.csv` | `OrderLine` | 117 | key `orderNumber` + `lineNo` |
| `order-line-modifiers.csv` | `OrderLineModifier` | 187 | key `orderNumber` + `lineNo` + `seq` |
| `payment-attempts.csv` | `PaymentAttempt` | 50 | |
| `order-status-changes.csv` | `OrderStatusChange` | 248 | `seq` gives the order of the audit trail |
| `order-log-entries.csv` | `OrderLogEntry` | 478 | `seq` gives the order of the log |
| `simulation-events.json` / `.csv` | `SimulationEvent` (reference only) | 67 | **not loaded**: examples of the event types and texts of one demo day; after the first start and after every reset the event log starts with the `RESET` event of that reset (BR-DEMO-03, SIM-08 section 3) |
| `menu-catalog.md` | — | — | the menu in readable form (source of truth for the catalog files) |
| `validate.mjs` | — | — | consistency check, section 10 |

### 2.1 Format conventions

| Topic | Convention |
|---|---|
| Encoding | UTF-8 without byte-order mark; names contain non-ASCII characters (`Jalapeños`, `Hernández`, `°F`, `—`, `…`) which must survive the import unchanged |
| CSV | comma separator, header row, RFC 4180 quoting (fields with comma, quote or line break are in double quotes, quotes doubled), line end `\n` |
| Empty / null | JSON `null`; CSV empty field |
| Booleans | `true` / `false` |
| Money | USD, two decimals (`14.99`); JSON numbers, CSV text with a decimal point. Import as exact decimals, never as floating point (BR-DATA-01) |
| Sets | JSON arrays; in CSV the values joined with `|` (`GLUTEN|MILK`) |
| Enumeration values | the `UPPER_SNAKE` keys of the information model, section 9 |
| References | by business key: product `code`, option `code` (modifiers use the option `key` or ingredient `code`, as in the information model 5.3), ingredient `code`, courier `code`, oven `code`, ZIP, `orderNumber` |
| Times | relative to the demo start time T, section 3 |

---

## 3. Time anchor T

Seed timestamps are relative, so the data looks live whenever it is loaded.

- **T** is the moment the seed is loaded (first start or demo reset), taken from the server clock.
- `T-HH:MM:SS` means T minus that duration. Example: `T-00:01:50` = 1 minute 50 seconds before T. Hours may exceed 24 but the seed uses at most `T-01:52:10`.
- `D-n HH:MM:SS` means: take T's calendar date in the store time zone `America/Los_Angeles`, go back *n* days, use that local time, then convert to UTC with the time-zone rules valid on that date (daylight saving time included).
- Absolute values (coupon `validUntil`) are store-local and are loaded as they are.

Worked example with T = 2026-11-05 18:30:00 store time (PST, UTC−8), that is `2026-11-06T02:30:00Z`:

| Seed value | Store-local result | Stored UTC |
|---|---|---|
| `T-00:00:00` | 2026-11-05 18:30:00 | 2026-11-06T02:30:00Z |
| `T-00:01:50` | 2026-11-05 18:28:10 | 2026-11-06T02:28:10Z |
| `T-01:52:10` | 2026-11-05 16:37:50 | 2026-11-06T00:37:50Z |
| `D-6 23:05:36` | 2026-10-30 23:05:36 (PDT) | 2026-10-31T06:05:36Z |
| `D-118 20:14:05` | 2026-07-10 20:14:05 (PDT) | 2026-07-11T03:14:05Z |

The orders of the current day are timed with the compressed demo durations of order-lifecycle section 7 (a bake takes about 90 seconds), so the live orders were placed within the last 5 minutes before T and the finished orders of today within the last 2 hours. The past guest orders of Jordan Lee lie 6 to 118 days back, at lunch or evening times; guest orders are kept until the next reset (BR-ORD-22).

> **Assumption A-31:** If a reset happens shortly after midnight store time, some `T-` orders fall on the previous calendar date and are then not counted as "today" (home page KPIs). This is accepted; demos and acceptance tests are run between 02:00 and 24:00 store time.

---

## 4. Rules for the seed (`BR-DEMO`)

| ID | Rule | Priority |
|---|---|---|
| BR-DEMO-01 | After the first deployment on an empty database, the app contains exactly the records of this folder (except the reference files `allergen-matrix.csv` and `simulation-events`, section 2): same codes, names, texts, prices, flags, order numbers, commit hashes, statuses and relations. No other catalog, order or reference record exists. Lite has no user accounts, customer profiles or saved addresses. | must |
| BR-DEMO-02 | The app loads the seed **by itself** (on first start with an empty database and on every demo reset). No manual import, script or database tool is needed after deployment. How the files are packaged into the app is the contractor's choice; the loaded content must equal these files. | must |
| BR-DEMO-03 | **Demo reset** (SIM-08) deletes all orders with their children, all carts and all simulation events (BR-DATA-09) and then loads the full seed again, **including the seed orders, payment attempts, status changes and logs**, with a new T = the reset moment. Simulation events are not loaded: the event log starts with the `RESET` event of this reset (SIM-08 section 3). After a reset the data is indistinguishable from a first start, except for the new T and the new tracking tokens. | must |
| BR-DEMO-03a | **Lite seed state.** Tiramisu Stack (`DS-01`) is sold out, the ingredient `jalapeno` is out of stock and courier `CU-05` is off duty. Nothing in Lite changes these values while the app runs; every reset restores them. Every guest seed order, including the 19 orders of Jordan Lee, can be found on SCR-10 with its order number and contact email (section 7). | must |
| BR-DEMO-04 | Timestamps are resolved against T as defined in section 3. | must |
| BR-DEMO-05 | Order numbers and commit hashes are loaded as given (`MX-1001` … `MX-1046`). The order-number sequence continues after the highest seed number, so the first new order after a load is `MX-1047`. | must |
| BR-DEMO-06 | Values that are not in the seed are created at load time: `Order.trackingToken` (new random, unguessable 32-character URL-safe value per order and per load), catalog `createdAt`/`updatedAt` = T, `SimulationSettings.lastResumedAt` = T, `lastResetAt` = T, `lastResetBy` = `SYSTEM (startup)`, `SYSTEM (scheduled)` or `SYSTEM (initial seed)`, set by each reset (SIM-08 section 2; empty in `simulation-settings.json`, so empty only before the first start). `Product.updatedBy` is the seed text `menu-seed`; Lite has no user who changes products. | must |
| BR-DEMO-07 | Derived values (information model "Derived" attributes, for example `Product.allergens`, `cardPrice`, `Product.isOrderable`, `Courier.deliveriesToday`, `Oven.ordersBaking`) are **calculated by the app**, not imported. The seed contains several of them only as a test oracle; the calculated values must equal them. | must |
| BR-DEMO-08 | Products with `imageAvailable = true` use the file named in `imageFile` from `assets/products/`. Since 2026-11-05 all 25 products have `imageAvailable = true`. A product with `imageAvailable = false` would show the image placeholder defined in `assets/README.md` section 2 with the caption `IMAGE_PENDING // <file name>`; when the owner adds a file later, it is loaded by the procedure of `assets/README.md` section 4 (project folder, redeploy, demo reset) without other changes. | must |
| BR-DEMO-09 | After loading, the simulation runs with the settings in `simulation-settings.json` (never paused, traffic on; the speed comes from the constant `Simulation.SpeedFactor`, the file holds the 1× default, [lite-configuration.md](../10-simulations/lite-configuration.md)). Every automatic timer of an open seed order starts at T with progress 0 (BR-ORD-21), whatever time in state its seeded timestamps show; stored progress values (`routeProgressPercent`, courier `tripProgressPercent`) continue from their seed value. With default settings all 17 open seed orders reach a final state within about 10 minutes after T (`MX-1039` last, by the payment timeout T-07). | must |
| BR-DEMO-10 | The seed is consistent with the foundation: running `node validate.mjs` in this folder reports no error. Any change to the seed files must keep it that way. | must (package maintenance) |

---

## 5. How to load the seed

### 5.1 Load order

References point only to records loaded earlier.

1. `store-settings.json`, `simulation-settings.json`
2. `delivery-zones`, `ovens`, `categories`
3. `ingredients`, then `options` (→ ingredient), then `menu-items` (→ category, default options), `product-sizes`, `recipe-items` (→ ingredient)
4. `coupons`
5. `couriers` master data (without `currentOrder`)
6. `orders.json` with all children (→ product, coupon, delivery zone, oven, courier)
7. courier live state (`status`, `statusChangedAt`, `currentOrder`, `tripProgressPercent`)

`simulation-events` is not loaded (reference file, section 2); the event log starts with the `RESET` event of the load (SIM-08).

### 5.2 Relations in the order data

| Seed field | Becomes |
|---|---|
| `orders[].couponCode` | `Order.couponCode` (snapshot text) and `Order.coupon` (association to the coupon) |
| `orders[].deliveryZone`, `oven`, `courier` | associations to `DeliveryZone` (ZIP), `Oven` (code), `Courier` (code) |
| `orders[].lines[].productCode` | `OrderLine.productCode` (snapshot) and `OrderLine.product` (association, kept for re-order and stats) |
| `orders[].lines[].modifiers[]` | `OrderLineModifier` in the given order; `key` is the option key (CRUST, SAUCE, CHEESE, ADD) or the ingredient code (REMOVE) |
| `couriers[].currentOrder` | `Courier.currentOrder` (by display number `MX-…`) |

### 5.3 Seed-only and informational fields

These fields help loading, testing or later screens; they are not attributes of the information model.

| File | Field | Meaning / use |
|---|---|---|
| all children of orders | `seq`, `lineNo` | order of records within the parent; store if the platform needs an explicit order, otherwise sort by time and `seq` on load |
| `orders` | `displayNumber` | `MX-` + `orderNumber` (derived, do not store) |
| `orders` | `poolCustomer` | code of the person in `simulated-customers.json` the guest/simulated order was taken from; empty for the orders of Jordan Lee, who is not in the pool; do not import |
| `orders` | `seedNote` | why this order is in the seed; do not import |
| `menu-items` | `imageFile`, `imageAvailable` | source of `Product.image` (BR-DEMO-08) |
| `menu-items` | `caffeineMg` (drinks) | caffeine per serving from the menu catalog; **may** be shown in the item info (SCR-04) |
| `menu-items` | `cardPrice`, `allergens`, `isVegetarian`, `isVegan` | derived, test oracle (BR-DEMO-07) |
| `ingredients` | `composition` | the part of the catalog name in parentheses (for example `"00" wheat flour, water, sea salt, yeast; 48 h ferment`); `Ingredient.name` is limited to 50 characters, so it is kept separately; **may** be shown in the item info |
| `ingredients`, `allergens` | `sortOrder`, `shortCode` | display order and the short codes used in the menu catalog |
| `delivery-zones` | `tripSecondsAt1x` | derived from `distanceMiles` (order-lifecycle 7.1) |
| `simulation-events` | whole file | reference only, not loaded (BR-DEMO-03); `order` refers to seed orders by display number |
| `simulated-customers` | whole file | pool of fictional people; `SC-28` lives in ZIP 94109 **outside** the delivery zone (`inDeliveryZone = false`): the traffic generator may use it for pickup orders only, testers may use it for the zone check |

---

## 6. Status of the data at T (the "live" picture)

### 6.1 Kitchen and ovens

| Kitchen stage (status) | Orders at T |
|---|---|
| `QUEUED` | `MX-1033` (remake, priority, first in the queue), `MX-1043`, `MX-1045` |
| `BAKING` | `OVEN_01`: `MX-1040`, `MX-1041` · `OVEN_02`: `MX-1038` — kitchen load 3/6 slots · 50 % |
| `QA_CHECK` | `MX-1036` (Sliced ticked), `MX-1037` |
| `READY_FOR_DISPATCH` / `READY_FOR_PICKUP` | `MX-1034` (waiting for a courier), `MX-1035` (courier CU-02 on the way to the store), `MX-1032` (pickup shelf) |

Intake is `OPEN` (always in Lite). Stock (BR-DEMO-03a): `DS-01` Tiramisu Stack is sold out and the ingredient `jalapeno` is out of stock; everything else is available. Open orders placed before T may still contain them (`MX-1031` Inferno Payload with jalapeños, `MX-1033` and `MX-1040` extra Jalapeños, `MX-1038` Tiramisu Stack): order lines are snapshots (BR-DATA-03) and these orders finish normally.

Home page KPIs right after a reset (SCR-01, from the seed): `DEPLOYED_TODAY` 7 (`MX-1019`, `MX-1020`, `MX-1022`, `MX-1024`, `MX-1026`, `MX-1028`, `MX-1029`; their mean time from payment to completion is 306.9 s), `KITCHEN_LOAD` 3/6 · 50 %, `COURIERS_ON_DUTY` 4. The values change as soon as the open seed orders progress.

### 6.2 Couriers

| Code | Name | Status (dev label) | Current order | Trip progress | Since |
|---|---|---|---|---|---|
| CU-01 | Marek Nowak | `DELIVERING` (IN_TRANSIT) | `MX-1030` to 94105 | 64 % | `T-00:01:50` |
| CU-02 | Alex Kim | `TO_STORE` (EN_ROUTE_TO_STORE) | `MX-1035` | 40 % | `T-00:00:12` |
| CU-03 | Sofia Alvarez | `DELIVERING` (IN_TRANSIT) | `MX-1031` to 94110 | 76 % | `T-00:01:10` |
| CU-04 | Jamal Carter | `RETURNING` | `MX-1029` (delivered, riding back to the store) | 45 % | `T-00:01:01` |
| CU-05 | Mei Tanaka | `OFF_DUTY` (always in Lite) | — | 0 % | `D-1 22:30:00` |

No courier is `AVAILABLE`, which is why `MX-1034` waits (BR-ORD-16). CU-04 keeps `MX-1029` as its current order until its return trip ends (SIM-04 4.5). The return trip lasts as long as the delivery trip of `MX-1029` to 94107: 136 s at 1× (`travelBase` 60 s + 40 s × 1.9 mi), 45 % of it done at T (progress continues from the seed value, BR-DEMO-09). CU-04 then becomes available and is assigned to `MX-1034` by the simulator.

### 6.3 Coverage: every status, both order types

| Status (dev label) | Delivery | Pickup |
|---|---|---|
| `PAYMENT_PENDING` (STAGED) | `MX-1042` (attempt 2 processing, Mastercard •••• 4444) | `MX-1046` (Google Pay processing) |
| `PAYMENT_FAILED` | `MX-1039` (guest, Visa •••• 0002 declined) | `MX-1044` (simulated customer, Visa •••• 9995 insufficient funds; retries automatically) |
| `QUEUED` | `MX-1033` (remake, priority), `MX-1045` | `MX-1043` |
| `BAKING` | `MX-1038`, `MX-1040` (Jordan Lee, guest) | `MX-1041` (bake started by `demo.kitchen`) |
| `QA_CHECK` | `MX-1036` | `MX-1037` |
| `READY_FOR_DISPATCH` (DISPATCH_READY) | `MX-1034` (no courier), `MX-1035` (courier on the way) | — (not valid for pickup) |
| `READY_FOR_PICKUP` (READY_TO_PULL) | — (not valid for delivery) | `MX-1032` |
| `OUT_FOR_DELIVERY` (IN_TRANSIT) | `MX-1030`, `MX-1031` | — |
| `DELIVERED` (DEPLOYED) | `MX-1019`, `MX-1022` (remade once), `MX-1026`, `MX-1028`, `MX-1029`, and 14 past guest orders of Jordan Lee | — |
| `PICKED_UP` (PULLED) | — | `MX-1020`, `MX-1024` (marked by `demo.kitchen`), and `MX-1004`, `MX-1011`, `MX-1015` |
| `CANCELLED` (ROLLED_BACK) | `MX-1021` (3 failed payments, T-04), `MX-1025` (manager while baking, refunded, T-17), `MX-1009` (Jordan Lee as guest while queued, refunded, T-09) | `MX-1023` (guest while queued, refunded, T-09), `MX-1027` (guest after a failed payment, T-06) |

The seed history contains every transition T-01 … T-17 except T-07 (payment timeout), which `MX-1039` performs by itself `paymentFailedTimeout` (600 s at 1×) after T unless somebody retries or cancels first. Entries by `KITCHEN` (`demo.kitchen`) and `MANAGER` (`demo.manager`), for example T-17 of `MX-1025`, exist only as history text of seed orders; nobody acts in these roles in Lite.

### 6.4 Payments and coupons

| Scenario | Orders |
|---|---|
| Card approved (Visa •••• 4242, Mastercard •••• 4444), Apple Pay, Google Pay | most orders |
| Declined, then success with another method on the retry | `MX-1026` (Visa •••• 0002 → Apple Pay) |
| Three failures → automatic rollback | `MX-1021` (DECLINED, INSUFFICIENT_FUNDS, GATEWAY_TIMEOUT after 10 s) |
| Failed, guest cancelled | `MX-1027` |
| Refunded after cancellation | `MX-1009`, `MX-1023`, `MX-1025` |
| `GITHUB_STUDENT` (15 %, max $10, min $20) | `MX-1024` (−$4.38) |
| `FREE_DISPATCH` (free delivery) | `MX-1028` (fee waived by COUPON) |
| Free delivery from $40 subtotal | e.g. `MX-1014`, `MX-1017`, `MX-1030` (fee waived by THRESHOLD) |

Today (orders with `T-` times): 20 orders paid, $841.17 in total; 2 refunded, $84.95.

### 6.5 Configured pizzas in the seed

Order lines with non-default choices, useful for the receipt and the tracking page: `MX-1003` (extra Jalapeños), `MX-1006` (Thin Client crust, extra arugula), `MX-1008` (Cheese-Stuffed v2, 'Nduja), `MX-1016` and `MX-1045` (jalapeños removed from Hawaiian Legacy Fix), `MX-1018` (Hot honey drizzle), `MX-1022` (Cheese-Stuffed v2 on Truffle Kernel), `MX-1026` (Stracciatella added, crushed red pepper removed), `MX-1029` (Thin Client, mushrooms), `MX-1033` (extra Jalapeños — the remake reason), `MX-1035` (Stracciatella), `MX-1038` (Hot honey drizzle), `MX-1040` (extra Jalapeños).

---

## 7. All seed orders

`When placed` uses the time notation of section 3. Totals include tax, delivery fee and tip. A guest finds a `GUEST` order on SCR-10 with the order number and the contact email: `jordan.lee@example.com` for the orders of Jordan Lee (`MX-1001` – `MX-1018`, `MX-1040`), the email of the pool person (`simulated-customers.json`) for the others.

| Order | Source | Type | Status (dev label) | When placed | Contact | Items | Total | Seed purpose |
|---|---|---|---|---|---|---|---|---|
| MX-1001 | GUEST | DELIVERY | `DELIVERED` (DEPLOYED) | D-118 20:14:05 | Jordan Lee | The Root Pizza, Boolean Pepperoni | $43.53 | Oldest guest order of Jordan Lee (no coupon) |
| MX-1002 | GUEST | DELIVERY | `DELIVERED` (DEPLOYED) | D-111 12:31:40 | Jordan Lee | The Clean Code, Lemon Lint Soda | $27.40 |  |
| MX-1003 | GUEST | DELIVERY | `DELIVERED` (DEPLOYED) | D-104 21:47:12 | Jordan Lee | Inferno Payload Large (configured), 2× Mate Compiler Tonic | $46.02 |  |
| MX-1004 | GUEST | PICKUP | `PICKED_UP` (PULLED) | D-97 19:05:33 | Jordan Lee | The Root Pizza Large, Garlic Knot Loop | $26.60 |  |
| MX-1005 | GUEST | DELIVERY | `DELIVERED` (DEPLOYED) | D-90 22:38:20 | Jordan Lee | Kernel Panic Meat, Hot Wings Webhook, 2× Cola Cache | $52.15 |  |
| MX-1006 | GUEST | DELIVERY | `DELIVERED` (DEPLOYED) | D-83 12:20:08 | Jordan Lee | The Root Pizza (configured), Sparkling Stream Water | $28.64 |  |
| MX-1007 | GUEST | DELIVERY | `DELIVERED` (DEPLOYED) | D-76 20:56:44 | Jordan Lee | Truffle Kernel, Tiramisu Stack | $38.59 |  |
| MX-1008 | GUEST | DELIVERY | `DELIVERED` (DEPLOYED) | D-69 23:12:02 | Jordan Lee | Boolean Pepperoni Large (configured), Cold Brew Commit | $42.61 |  |
| MX-1009 | GUEST | DELIVERY | `CANCELLED` (ROLLED_BACK) | D-62 19:40:15 | Jordan Lee | SQL Supreme Large, Garlic Knot Loop | $39.83 | Rolled back by the customer while queued (wrong address); re-placed to the office address |
| MX-1010 | GUEST | DELIVERY | `DELIVERED` (DEPLOYED) | D-62 19:48:31 | Jordan Lee | SQL Supreme Large, Garlic Knot Loop | $39.83 | Re-placed after the rollback, delivered to the office |
| MX-1011 | GUEST | PICKUP | `PICKED_UP` (PULLED) | D-55 12:45:10 | Jordan Lee | Quad-Core Formaggi Small, Cold Brew Commit | $20.36 | Same basket as worked example D (without coupon): total 20.36 |
| MX-1012 | GUEST | DELIVERY | `DELIVERED` (DEPLOYED) | D-48 21:15:27 | Jordan Lee | The Root Pizza, Binary BBQ Large, 2× Mate Compiler Tonic, Lava Exception Cake | $68.29 |  |
| MX-1013 | GUEST | DELIVERY | `DELIVERED` (DEPLOYED) | D-41 20:02:51 | Jordan Lee | Low-Mem Garden, Caesar Cipher Salad | $36.06 |  |
| MX-1014 | GUEST | DELIVERY | `DELIVERED` (DEPLOYED) | D-34 22:50:09 | Jordan Lee | Inferno Payload Large, Binary BBQ Large, 2× Mate Compiler Tonic | $68.62 | Same basket as worked example A: total 68.62 |
| MX-1015 | GUEST | PICKUP | `PICKED_UP` (PULLED) | D-27 19:30:40 | Jordan Lee | The Root Pizza, Cannoli Callback | $23.83 |  |
| MX-1016 | GUEST | DELIVERY | `DELIVERED` (DEPLOYED) | D-20 21:41:18 | Jordan Lee | Hawaiian Legacy Fix (configured), The Root Pizza, 2× Jalapeño Patch Dip, Cola Cache | $50.63 |  |
| MX-1017 | GUEST | DELIVERY | `DELIVERED` (DEPLOYED) | D-13 12:10:55 | Jordan Lee | 2× The Root Pizza Large, Kernel Panic Meat Large, Low-Mem Garden Large, 2× Garlic Knot Loop, 4× Sparkling Stream Water | $136.03 | Team lunch at the office |
| MX-1018 | GUEST | DELIVERY | `DELIVERED` (DEPLOYED) | D-6 23:05:36 | Jordan Lee | Boolean Pepperoni (configured), Garlic Driver Dip, Cold Brew Commit | $35.20 |  |
| MX-1019 | GUEST | DELIVERY | `DELIVERED` (DEPLOYED) | T-01:52:10 | Marcus Johnson | Boolean Pepperoni Large, Garlic Knot Loop, 2× Cola Cache | $44.15 |  |
| MX-1020 | SIMULATOR | PICKUP | `PICKED_UP` (PULLED) | T-01:41:30 | Maya Thompson | The Root Pizza, Lemon Lint Soda | $19.81 |  |
| MX-1021 | GUEST | DELIVERY | `CANCELLED` (ROLLED_BACK) | T-01:30:05 | Daniel Okafor | Kernel Panic Meat Large, Hot Wings Webhook, Cola Cache | $50.48 | Three failed payments, rolled back by the system (T-04) |
| MX-1022 | SIMULATOR | DELIVERY | `DELIVERED` (DEPLOYED) | T-01:18:40 | Sarah Goldberg | Truffle Kernel (configured), The Clean Code, 2× Sparkling Stream Water | $58.37 | Remade once after a failed QA check (T-13) |
| MX-1023 | GUEST | PICKUP | `CANCELLED` (ROLLED_BACK) | T-01:05:20 | Tom Becker | Binary BBQ, Cold Brew Commit | $26.87 | Guest rolled back while queued (T-09), refunded |
| MX-1024 | GUEST | PICKUP | `PICKED_UP` (PULLED) | T-00:52:45 | Aisha Patel | Low-Mem Garden, Caesar Cipher Salad, Lemon Lint Soda | $26.95 | GITHUB_STUDENT applied; picked up, confirmed by demo.kitchen |
| MX-1025 | GUEST | DELIVERY | `CANCELLED` (ROLLED_BACK) | T-00:41:10 | Kevin Nguyen | SQL Supreme Large, Boolean Pepperoni, Tiramisu Stack | $58.08 | Cancelled by the manager while baking (T-17), refunded |
| MX-1026 | GUEST | DELIVERY | `DELIVERED` (DEPLOYED) | T-00:33:30 | Grace Liu | Inferno Payload (configured), Garlic Driver Dip, Mate Compiler Tonic | $37.97 | First payment declined, paid with Apple Pay on the retry |
| MX-1027 | GUEST | PICKUP | `CANCELLED` (ROLLED_BACK) | T-00:24:50 | Samuel Park | Quad-Core Formaggi Large, Cannoli Callback | $30.89 | Payment failed, guest cancelled before paying (T-06) |
| MX-1028 | SIMULATOR | DELIVERY | `DELIVERED` (DEPLOYED) | T-00:16:20 | Ryan O'Connor | Hawaiian Legacy Fix, Garlic Knot Loop | $29.04 | FREE_DISPATCH coupon waives the delivery fee |
| MX-1029 | SIMULATOR | DELIVERY | `DELIVERED` (DEPLOYED) | T-00:06:21 | Hannah Schmidt | The Root Pizza Large (configured), Binary BBQ, Lava Exception Cake | $59.01 | Just delivered; courier CU-04 is returning to the store |
| MX-1030 | GUEST | DELIVERY | `OUT_FOR_DELIVERY` (IN_TRANSIT) | T-00:04:57 | Ethan Walsh | 2× Boolean Pepperoni Large, SQL Supreme Large, 2× Garlic Knot Loop, 4× Sparkling Stream Water | $113.53 | Out for delivery, route 64 % |
| MX-1031 | SIMULATOR | DELIVERY | `OUT_FOR_DELIVERY` (IN_TRANSIT) | T-00:04:11 | Luis Hernández | Inferno Payload, Cola Cache | $29.18 | Out for delivery, route 76 % |
| MX-1032 | GUEST | PICKUP | `READY_FOR_PICKUP` (READY_TO_PULL) | T-00:03:50 | Isabella Moreno | The Root Pizza, Truffle Kernel Small, 2× Lemon Lint Soda | $41.26 | Waiting on the pickup shelf |
| MX-1033 | SIMULATOR | DELIVERY | `QUEUED` (QUEUED) | T-00:03:06 | Jacob Weiss | SQL Supreme (configured), 2× Cola Cache | $36.12 | Remake: priority at the top of BUILD_QUEUE |
| MX-1034 | SIMULATOR | DELIVERY | `READY_FOR_DISPATCH` (DISPATCH_READY) | T-00:02:58 | Noah Fischer | Kernel Panic Meat, Hot Wings Webhook, Jalapeño Patch Dip | $45.33 | No courier available: WAITING_FOR_COURIER |
| MX-1035 | GUEST | DELIVERY | `READY_FOR_DISPATCH` (DISPATCH_READY) | T-00:02:43 | Chloe Dubois | The Clean Code Large (configured), Caesar Cipher Salad | $44.10 | Courier CU-02 on the way to the store (COURIER ARRIVING) |
| MX-1036 | SIMULATOR | DELIVERY | `QA_CHECK` (QA_CHECK) | T-00:02:15 | Olivia Martinez | Binary BBQ Large, Garlic Knot Loop, Cold Brew Commit | $47.57 | QA in progress: sliced, extras not yet added |
| MX-1037 | GUEST | PICKUP | `QA_CHECK` (QA_CHECK) | T-00:02:05 | Ben Whitfield | Calzone Container, Cola Cache | $20.90 | QA just started |
| MX-1038 | GUEST | DELIVERY | `BAKING` (BAKING) | T-00:01:50 | Emily Chen | Quad-Core Formaggi (configured), Tiramisu Stack, Lemon Lint Soda | $41.38 |  |
| MX-1039 | GUEST | DELIVERY | `PAYMENT_FAILED` (PAYMENT_FAILED) | T-00:01:38 | Rachel Adler | The Root Pizza, Mate Compiler Tonic | $28.08 | Guest has not retried yet; auto-cancel after paymentFailedTimeout |
| MX-1040 | GUEST | DELIVERY | `BAKING` (BAKING) | T-00:01:26 | Jordan Lee | Inferno Payload Large (configured), Boolean Pepperoni, 2× Mate Compiler Tonic | $63.04 | Jordan Lee's active guest order (find it on SCR-10 with jordan.lee@example.com) |
| MX-1041 | SIMULATOR | PICKUP | `BAKING` (BAKING) | T-00:01:00 | Priyanka Rao | Low-Mem Garden Large, Sparkling Stream Water | $25.46 | Bake started manually by demo.kitchen |
| MX-1042 | GUEST | DELIVERY | `PAYMENT_PENDING` (STAGED) | T-00:00:31 | Lena Hoffmann | SQL Supreme Large, Garlic Knot Loop, 2× Cola Cache | $46.62 | Second attempt processing |
| MX-1043 | GUEST | PICKUP | `QUEUED` (QUEUED) | T-00:00:17 | Sophie Laurent | The Root Pizza Small, Garlic Knot Loop | $20.08 |  |
| MX-1044 | SIMULATOR | PICKUP | `PAYMENT_FAILED` (PAYMENT_FAILED) | T-00:00:09 | Omar Haddad | Boolean Pepperoni Small, Garlic Driver Dip | $16.28 | Simulated customer retries with VISA_4242 after simulatedRetryDelay |
| MX-1045 | SIMULATOR | DELIVERY | `QUEUED` (QUEUED) | T-00:00:06 | Anthony Russo | Hawaiian Legacy Fix Large (configured), Cannoli Callback | $37.92 |  |
| MX-1046 | SIMULATOR | PICKUP | `PAYMENT_PENDING` (STAGED) | T-00:00:01 | Victor Chang | Truffle Kernel, Cold Brew Commit | $27.42 | Payment processing |

---

## 8. Demo reset

The demo reset restores this seed completely (BR-DEMO-03). Test after a reset:

| # | Check | Expected |
|---|---|---|
| 1 | Orders | the 46 seed orders `MX-1001` – `MX-1046` (28 of today); any order created before the reset is gone |
| 2 | Next new order | gets number `MX-1047` |
| 3 | Seed lookup (SCR-10) | `MX-1001` with `jordan.lee@example.com` and `MX-1043` with `sophie.laurent@example.com` are found; a guest order placed before the reset is not found |
| 4 | Menu | 25 published products, prices as in `menu-catalog.md`, only `DS-01` sold out, only `jalapeno` out of stock, every option active |
| 5 | Coupons | the 3 coupons exactly as seeded |
| 6 | Couriers and ovens | as in section 6.2 and `ovens.json` (`CU-05` off duty) |
| 7 | Settings | store and simulation settings as in the two settings files (intake `OPEN`, traffic on; speed from the constant `Simulation.SpeedFactor`) |
| 9 | Tracking links | links to orders from before the reset show the invalid-link state of SCR-09 (BR-TRK-21, TXT-TRK-44 – TXT-TRK-46), because tracking tokens are new |
| 10 | Simulation events | the event log starts with the `RESET` event of this reset; no event from before it remains and none from `simulation-events.json` is loaded |

---

## 9. Assumptions in this folder

> **Assumption A-31:** Resets shortly after midnight shift some of today's orders to the previous day (section 3).

> **Assumption A-33:** A demo reset reloads the seed orders as well (BR-DEMO-03), so the kitchen, the couriers and the home page KPIs are busy right after a reset.

> **Assumption A-34:** The menu catalog gives no short description, version tag or image alt text for sides, drinks and desserts. This folder defines them (`menu-items.json`); they follow the catalog's descriptions.

The traffic generator is on after a reset, as in the information model (`trafficEnabled = true`); this is assumption A-12 of the product brief.

---

## 10. Validation

Run in this folder (Node.js 18 or later, no installation):

```
node validate.mjs
```

The script reads `menu-catalog.md`, `../04-information-model/information-model.md` and `../05-processes/order-lifecycle.md` directly and checks:

| Area | Checks |
|---|---|
| Catalog vs `menu-catalog.md` | every product, price per size, name, key, version, text, alt text, allergens, diet, spice, badges, calories, defaults; every ingredient (allergens, V/VG, where it is used); every option (key, name, surcharge, extra prices, sizes, ingredient); coupons |
| Catalog rules | derived allergens and diet of the default configurations (BR-DATA-10/11), one default size, card price (BR-PRICE-01), text lengths, image files; seed stock state (BR-DEMO-03a) and orderable products (BR-DATA-12); `updatedBy` = `menu-seed` |
| Reference data | zones, ovens, couriers (`CU-05` off duty) and store settings vs information model 7.5 / 7.8; failure rates 0 %; simulation durations vs order-lifecycle 7.1 |
| Guests only | no account files; order source, actors and cancellations only by guests, the simulator, the system or (seed history) kitchen and manager; no customer link; the guest orders of Jordan Lee; every guest order has a contact email for SCR-10; pool contacts; no account-only coupon |
| Prices | every unit price, modifier price, line total, discount, delivery fee and waiver, tax, tip and total recalculated with `BR-PRICE-02` … `10` (integer cents, half-up rounding); coupon conditions; minimum delivery subtotal; `BR-ORD-03` |
| Lifecycle | every status change is an allowed transition (parsed from order-lifecycle section 4) by an allowed actor, with guards (attempt numbers, order type, remake limit, reasons); timestamp fields match the audit trail; payment attempts match the test cards (BR-ORD-04); refunds (BR-ORD-10); QA checklist, oven and courier references; log lines for every transition; oven temperature in the log = `targetTempF` (BR-SIM-16a) |
| Global | unique numbers, hashes and transaction ids; order numbers ascend with time; oven capacity never exceeded; no courier carries two orders at once; courier live state matches the orders; every status covered for delivery and pickup; every kitchen stage (`QUEUED`, `BAKING`, `QA_CHECK`, ready) has an order; open simulated orders at the traffic cap (SIM-05 C1); `CU-04` returning with `MX-1029`; ovens without `currentTempF`; the reference event log ends with a `RESET` event |
| Files | every CSV equals its JSON |

Result for this version: **all 10,876 checks passed** (46 orders, 117 order lines, 248 status changes, 478 log lines, 25 products, 51 ingredients, 40 options).
