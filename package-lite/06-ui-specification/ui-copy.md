# UI Copy — complete text catalogue

Every text shown in the Git Pizza MxDev UI, with an ID and the exact English wording. Screens reference these IDs (`TXT-…`). The app must use these texts verbatim (placeholders filled in). Texts that come from data (product names, descriptions, coupon descriptions, courier names) are not repeated here; their source is the information model or the menu catalog.

Related: [README.md](README.md) (conventions), [../01-product-brief/glossary.md](../01-product-brief/glossary.md) (meaning of every dev label), [../05-processes/order-lifecycle.md](../05-processes/order-lifecycle.md) (status labels, rollback texts, minimum log lines), [../04-information-model/information-model.md](../04-information-model/information-model.md) (coupon messages BR-PRICE-06, enumeration captions).

---

## 1. Conventions

### 1.1 ID scheme

`TXT-<AREA>-nn`. Areas: `GEN` common · `NAV` shells and navigation · `STAT` status and enumeration labels · `MENU` · `CONF` configurator · `CART` · `CHK` checkout · `PAY` payment and confirmation · `TRK` tracking and lookup · `PRF` order detail and receipt · `ERR` error pages and system messages · `VAL` validation patterns · `LOG` order log templates. IDs are stable; gaps in the numbering are intentional.

### 1.2 Columns

| Column | Meaning |
|---|---|
| Kind | `label`, `heading`, `button`, `link`, `placeholder`, `helper`, `badge`, `toast-ok` / `toast-info` / `toast-warn` / `toast-err`, `inline-err`, `banner`, `empty`, `dialog`, `a11y` (accessible name only, not visible), `log` |
| Text | The exact text. `{placeholder}` is filled at runtime. `|` separates alternatives chosen by a condition stated in Notes. |
| Plain meaning / a11y | The plain meaning to offer as sub-label, tooltip or accessible name (glossary rule), or other notes |

### 1.3 Placeholders

| Placeholder | Example | Source |
|---|---|---|
| `{orderNumber}` | `MX-1048` | `"MX-" + Order.orderNumber` |
| `{hash}` | `a3f9c2e` | `Order.commitHash` (shown after `#`) |
| `{product}` | `Inferno Payload` | `Product.name` / `OrderLine.productName` |
| `{moduleKey}` | `inferno-payload` | `Product.moduleKey` |
| `{size}` | `Large 14"` | `SizeCode` caption; non-pizzas: `ProductSize.servingDescription` |
| `{qty}`, `{n}`, `{max}` | `2` | counts |
| `{amount}`, `{total}`, `{X.XX}` | `$68.62` / `3.51` | money per BR-PRICE-11 (`{X.XX}` is the amount without `$`, used where the `$` is already in the text) |
| `{CODE}` | `GITHUB_STUDENT` | coupon code as stored (upper case) |
| `{mm:ss}`, `{HH:mm}`, `{date}` | `04:35`, `18:49`, `2026-11-05` | BR-DATA-05 |
| `{nodeHandle}` | `Marek // Moto-v3` | `Courier.nodeHandle` |
| `{oven}` | `OVEN_01` | `Oven.code`; `{ovenName}` = `Oven.displayName` (`OVEN_01::CORE`) |
| `{FIELD}` | `ADDRESS_LINE_1` | the field's visible label |
| `{method}` | `Visa •••• 4242` | for CARD the test-card caption, otherwise `Apple Pay` / `Google Pay` |

Singular/plural: where a count can be 1, use the singular form given in Notes.

---

## 2. Common (`GEN`)

| ID | Kind | Text | Plain meaning / a11y / notes |
|---|---|---|---|
| TXT-GEN-03 | button | `Cancel` | closes a dialog or form without saving |
| TXT-GEN-04 | a11y | Close | icon button `close` |
| TXT-GEN-05 | a11y | Back | icon button `arrow_back` (phone pages) |
| TXT-GEN-06 | button | `Confirm` | generic confirm (only where no specific action name exists) |
| TXT-GEN-07 | button | `Retry` | retry a failed load |
| TXT-GEN-08 | helper | `> fetching…` | caption under skeletons that load longer than 300 ms |
| TXT-GEN-09 | badge | `LIVE` | a11y "Live updates on" |
| TXT-GEN-10 | button | `Copy` | a11y "Copy {what}" (e.g. "Copy commit hash") |
| TXT-GEN-11 | toast-ok | Copied to clipboard. | |
| TXT-GEN-12 | helper | `Committing…` | button label while a save runs |
| TXT-GEN-15 | a11y | required | appended to the accessible name of required fields; visible marker `*` |
| TXT-GEN-16 | button | `Show more` \| `Show less` | expanding long lists or logs |
| TXT-GEN-18 | helper | `optional` | after the label of optional fields |
| TXT-GEN-19 | toast-err | Command failed. Try again. | any action that fails for a technical reason without a more specific message |
| TXT-GEN-20 | toast-warn | This order changed in the meantime. The page now shows its latest state. | an action is rejected because the record changed after it was displayed (in Lite: the simulator moved the order on, BR-ERR-14) |
| TXT-GEN-21 | label | `included` | price of a default option (`$0.00` for the default crust/sauce/cheese) |
| TXT-GEN-22 | label | `FREE` | zero fee |
| TXT-GEN-23 | label | {Screen plain name} — Git Pizza MxDev | browser tab title of every page, e.g. "Menu — Git Pizza MxDev", "Order tracking — Git Pizza MxDev"; the home page: "Git Pizza MxDev — Architect Your Perfect Crust" |
| TXT-GEN-24 | helper | This is taking longer than usual… | an action or load still running after 10 s |

---

## 3. Shells and navigation (`NAV`)

### 3.1 Customer shell (SCR-16)

| ID | Kind | Text | Plain meaning / a11y / notes |
|---|---|---|---|
| TXT-NAV-01 | label | Git Pizza MxDev | brand name in text, accessible names and page titles; inside the logo files it appears as the wordmark `git_pizza mxdev` (never typed as text); logo alt "Git Pizza MxDev logo" |
| TXT-NAV-02 | link | `./main.js` | Home |
| TXT-NAV-03 | link | `./menu.ts` | Menu |
| TXT-NAV-04 | link | `./checkout.yml` | Checkout |
| TXT-NAV-05 | link | `./track.log` | Track order |
| TXT-NAV-06 | helper | Your manifest is empty. Import a module first. | tooltip/description of the disabled `./checkout.yml` |
| TXT-NAV-07 | placeholder | `grep --pizza '…'` | a11y "Search the menu" |
| TXT-NAV-08 | a11y | Cart, {n} items \| Cart, 1 item \| Cart, empty | cart button; visible count bubble shows `{n}` (hidden at 0) |
| TXT-NAV-15 | heading | `Project Explorer` | desktop sidebar title |
| TXT-NAV-16 | label | `src/pizza-mxdev/` | sidebar path line |
| TXT-NAV-17 | link | `Root` | Home |
| TXT-NAV-18 | link | `Categories` | Menu categories (expands to the four file names) |
| TXT-NAV-19 | link | `Active_Deployments` | My open orders |
| TXT-NAV-22 | button | `New Branch` | Start a new order (opens the menu) |
| TXT-NAV-24 | link | `Source` | phone tab; a11y "Menu" |
| TXT-NAV-25 | link | `Deploy` | phone tab; a11y "Cart, {n} items" (count bubble as on the cart button) |
| TXT-NAV-26 | link | `Trace` | phone tab; a11y "Track order" |
| TXT-NAV-28 | banner | `DEMO MODE //` Payments, kitchen and delivery are simulated. No real orders, no real charges. | desktop and tablet |
| TXT-NAV-29 | banner | `DEMO MODE //` Simulated orders & payments | phone (≤ 767 px) |
| TXT-NAV-30 | banner | `CONNECTION_LOST //` Live updates paused. Reconnecting… | two failed refreshes in a row |
| TXT-NAV-31 | toast-ok | Connection restored. Live updates resumed. | |
| TXT-NAV-34 | link | Skip to main content | first focusable element |
| TXT-NAV-35 | label | © {year} Git Pizza MxDev — Mission Kitchen · 2140 Folsom Street, San Francisco, CA 94110 · (415) 555-0142 | footer; `{year}` = current year |
| TXT-NAV-36 | label | `./git-pizza-mxdev --version 1.0.0` | footer version line |
| TXT-NAV-37 | link | `menu.ts` | footer; plain "Menu" |
| TXT-NAV-38 | link | `track.log` | footer; plain "Track order" |
| TXT-NAV-39 | link | `allergens.md` | footer; plain "Allergen information" (opens the allergen notice in a dialog, FD-01 4.1) |

## 4. Statuses and enumeration labels (`STAT`)

### 4.1 Order status (from `order-lifecycle.md` section 2 — binding)

| ID | Status key | Badge (dev label) | Plain label |
|---|---|---|---|
| TXT-STAT-01 | `PAYMENT_PENDING` | `STAGED` | Awaiting payment |
| TXT-STAT-02 | `PAYMENT_FAILED` | `PAYMENT_FAILED` | Payment failed |
| TXT-STAT-03 | `QUEUED` | `QUEUED` | Order received |
| TXT-STAT-04 | `BAKING` | `BAKING` | In the oven |
| TXT-STAT-05 | `QA_CHECK` | `QA_CHECK` | Quality check & packing |
| TXT-STAT-06 | `READY_FOR_DISPATCH` | `DISPATCH_READY` | Waiting for courier |
| TXT-STAT-07 | `READY_FOR_PICKUP` | `READY_TO_PULL` | Ready for pickup |
| TXT-STAT-08 | `OUT_FOR_DELIVERY` | `IN_TRANSIT` | On the way |
| TXT-STAT-09 | `DELIVERED` | `DEPLOYED` | Delivered |
| TXT-STAT-10 | `PICKED_UP` | `PULLED` | Picked up |
| TXT-STAT-11 | `CANCELLED` | `ROLLED_BACK` | Cancelled |

### 4.2 Other enumerations

| ID | Enumeration | Value → visible label (plain meaning) |
|---|---|---|
| TXT-STAT-20 | OrderType | `DELIVERY` → `DELIVERY` (Delivery) · `PICKUP` → `PICKUP` (Pickup) |
| TXT-STAT-21 | PaymentStatus | `UNPAID` → `UNPAID` (Not paid) · `PAID` → `PAID` (Paid) · `REFUNDED` → `REFUNDED` (Refunded) |
| TXT-STAT-22 | PaymentAttemptStatus | `PROCESSING` · `SUCCEEDED` · `FAILED` · `REFUNDED` (shown as is; plain: Processing, Succeeded, Failed, Refunded) |
| TXT-STAT-23 | PaymentMethod | `CARD` → Card · `APPLE_PAY` → Apple Pay · `GOOGLE_PAY` → Google Pay |
| TXT-STAT-24 | TestCard | `VISA_4242` → Visa •••• 4242 · `MASTERCARD_4444` → Mastercard •••• 4444 · `VISA_0002` → Visa •••• 0002 · `VISA_9995` → Visa •••• 9995 · `AMEX_0005` → Amex •••• 0005 |
| TXT-STAT-25 | Test-card outcome chip | `APPROVES` (Payment succeeds) · `DECLINED` (Card declined by issuer) · `INSUFFICIENT_FUNDS` (Insufficient funds) · `GATEWAY_TIMEOUT` (Payment gateway timed out) |
| TXT-STAT-26 | PaymentFailureCode text | `DECLINED` → Card declined by issuer (for `APPLE_PAY` / `GOOGLE_PAY`: Payment declined by the wallet provider) · `INSUFFICIENT_FUNDS` → Insufficient funds · `GATEWAY_TIMEOUT` → Payment gateway timed out · `VOIDED` → Voided — order cancelled |
| TXT-STAT-27 | CourierStatus | `OFF_DUTY` → `OFF_DUTY` (Off duty) · `AVAILABLE` → `IDLE` (Available) · `TO_STORE` → `EN_ROUTE_TO_STORE` (On the way to the store) · `AT_STORE` → `WAITING_HANDOVER` (At the store) · `DELIVERING` → `IN_TRANSIT` (Delivering) · `RETURNING` → `RETURNING` (Returning to the store) |
| TXT-STAT-28 | VehicleType | `E_BIKE` → e-bike · `SCOOTER` → scooter · `CAR` → car (icons `pedal_bike`, `two_wheeler`, `directions_car`) |
| TXT-STAT-30 | OvenStatus | `ONLINE` (Accepting pizzas) · `OFFLINE` (Not accepting new pizzas) |
| TXT-STAT-32 | ProductBadge | `CLASSIC` → `<Classic />` · `BEST_SELLER` → `<BestSeller />` · `NEW` → `<NewRelease />` · `CHEF_PICK` → `<ChefPick />` (plain: Classic, Best seller, New, Chef's pick) |
| TXT-STAT-33 | Dietary badges | `<Vegetarian />` (Vegetarian) · `<Vegan />` (Vegan; replaces `<Vegetarian />` when vegan) |
| TXT-STAT-34 | SpiceLevel badge | `NONE` → no badge · `MILD` → `HOTFIX_SPICY::MILD` · `MEDIUM` → `HOTFIX_SPICY::MEDIUM` · `HOT` → `HOTFIX_SPICY::HOT` (plain "Spice level: Mild/Medium/Hot", with 1/2/3 `local_fire_department` icons) |
| TXT-STAT-35 | Sold-out badge | `404: OUT_OF_STOCK` (Sold out today) — products; `SOLD_OUT` (Unavailable today) — options, ingredients |
| TXT-STAT-37 | Allergen names | `Allergen.caption` of the demo data: GLUTEN → Cereals containing gluten · CRUSTACEANS → Crustaceans · EGGS → Eggs · FISH → Fish · PEANUTS → Peanuts · SOYBEANS → Soybeans · MILK → Milk · TREE_NUTS → Tree nuts · CELERY → Celery · MUSTARD → Mustard · SESAME → Sesame · SULPHITES → Sulphur dioxide and sulphites · LUPIN → Lupin · MOLLUSCS → Molluscs |
| TXT-STAT-38 | OrderSource | `GUEST` → `GUEST` (Guest) · `SIMULATOR` → `SIM` (Simulated customer) |
| TXT-STAT-39 | ActorType (history) | `GUEST`, `SIMULATOR`, `SYSTEM` (`KITCHEN` and `MANAGER` appear only in the status history of seed orders); not shown to guests (SCR-13 E-08) |
| TXT-STAT-40 | Coupon state | `APPLIED` → `VALIDATED` · `NOT_APPLIED` → `NOT_APPLIED` · `INVALID` → `REJECTED` |

---

## 5. Home and menu (`MENU`)

| ID | Kind | Text | Plain meaning / a11y / notes |
|---|---|---|---|
| TXT-MENU-01 | badge | `PIPELINE_OPEN //` Kitchen online | home hero status chip (intake is always OPEN in Lite) |
| TXT-MENU-02 | heading | Architect Your Perfect Crust | home hero, `typography.display`; "Perfect Crust" in `color.primary.light` |
| TXT-MENU-03 | text | Git Pizza MxDev is a Neapolitan pizza kitchen built for engineers. Pick a module, inject your toppings and deploy dinner to your door — or pull it fresh from our Mission counter. | home hero paragraph (Geist) |
| TXT-MENU-04 | label | `zsh — 80x24` | home terminal title |
| TXT-MENU-05 | log | `➜ ~ npm install @git-pizza/menu` | terminal line 1 (typed animation) |
| TXT-MENU-06 | log | added {n} modules from 4 registries in 2s | line 2; `{n}` = number of PUBLISHED products |
| TXT-MENU-07 | log | found 0 vulnerabilities \| found 1 sold-out module \| found {s} sold-out modules | line 3; second form when exactly 1 product is not orderable, third form when `{s}` ≥ 2 |
| TXT-MENU-08 | log | Git Pizza MxDev — Mission Kitchen is online. Ready for deployment. | line 4 |
| TXT-MENU-09 | button | `git checkout menu` | a11y "Open the menu" |
| TXT-MENU-10 | button | `./track.log` | home secondary CTA; a11y "Track an order" |
| TXT-MENU-11 | heading | Available Modules | home featured section |
| TXT-MENU-12 | text | Hand-picked builds from the Mission Kitchen, ready to import. | sub-heading |
| TXT-MENU-13 | a11y | Previous modules \| Next modules | carousel arrows |
| TXT-MENU-62 | label | `{first}–{last} / {total}` · phone `{first} / {total}` | featured carousel position, two digits, e.g. `01–03 / 06`; a11y "Modules {first} to {last} of {total}" |
| TXT-MENU-14 | label | `DEPLOYED_TODAY` · `AVG_PIPELINE_TIME` · `KITCHEN_LOAD` · `COURIERS_ON_DUTY` | home KPI labels (SCR-01 E-12); plain "Orders completed today", "Average time from payment to delivery or pickup today", "Kitchen load: busy oven slots", "Couriers on duty" |
| TXT-MENU-15 | label | `—` | KPI with no data yet (e.g. no completed order today) |
| TXT-MENU-63 | label | `{baking}/{slots} · {p}%` \| `{baking}/{slots} · {p}%` + chip `HEAVY` | `KITCHEN_LOAD` value (SCR-01 E-12; SIM-02 BR-SIM-16d), e.g. `3/6 · 50%` (seed right after a reset); second form from 85 %; a11y "Kitchen load: {baking} of {slots} oven slots busy, {p} percent" (second form adds ", heavy") |
| TXT-MENU-61 | label | `1 px = 1 order` · `1 px = {n} orders` | scale line under the `DEPLOYED_TODAY` pixel grid (SCR-01 E-12); `{n}` = ⌈orders / 40⌉ |
| TXT-MENU-17 | heading | Live Build Status: Order {orderNumber} | home active-order block |
| TXT-MENU-18 | label | `Est. completion: ~{HH:mm}` \| `Ready at: ~{HH:mm}` | delivery / pickup |
| TXT-MENU-19 | link | `MONITOR PIPELINE →` | a11y "Track this order" |
| TXT-MENU-20 | heading | Build Your Instance | menu page heading |
| TXT-MENU-21 | label | `const menu = fetchInventory('production');` | menu sub-line |
| TXT-MENU-22 | label | `{fileName}` `({n})` | category tab, e.g. `pizzas.json (12)`; a11y "{displayName}, {n} items" |
| TXT-MENU-23 | placeholder | `grep -i --scope=menu '…'` | menu search; a11y "Search the menu by name or ingredient" |
| TXT-MENU-24 | heading | `grep: {n} modules match '{query}'` | search results; singular "1 module matches" |
| TXT-MENU-25 | empty | `grep: no modules match '{query}'` · Try another dish, ingredient or module name, or clear the search. | no results; button TXT-MENU-26 |
| TXT-MENU-64 | helper | Type at least 2 characters to search. | search box with 1 character (BR-MENU-10); no filtering |
| TXT-MENU-65 | empty | No module in `{fileName}` matches these filters. · Button: `Show all` | filter chips leave the tab or the search results empty (BR-MENU-20); `Show all` clears the chips |
| TXT-MENU-26 | button | `Clear search` | |
| TXT-MENU-27 | label | `./{category folder}/{moduleKey}.ts · {versionTag}` | card micro label, e.g. `./pizzas/root-pizza.ts · v1.0-LTS`; folders: `pizzas`, `sides`, `drinks`, `desserts` |
| TXT-MENU-28 | label | {price} · {size label} | card price per BR-PRICE-01: pizzas `$14.99 · 12"`; others `$4.50` (no size) |
| TXT-MENU-29 | button | `+ import` | a11y "Add {product} to cart" (pizzas: "Add {product}, Medium 12", to cart") |
| TXT-MENU-30 | button | `Configure` | icon `tune`; a11y "Customize {product}" |
| TXT-MENU-31 | a11y | Details and allergens for {product} | icon `info` |
| TXT-MENU-32 | label | Contains: {allergen list} \| No major allergens | card allergen line (names from TXT-STAT-37, comma separated) |
| TXT-MENU-33 | helper | Sold out today. | under the sold-out badge on cards |
| TXT-MENU-34 | text | All items are prepared in a kitchen that handles gluten, milk, eggs, tree nuts, mustard, fish and other allergens. Cross-contact is possible. The Gluten-Free Fork crust is made without gluten ingredients but is not certified gluten-free. | allergen notice (menu catalog, binding); heading `allergens.md` |
| TXT-MENU-35 | toast-ok | Imported {product} ({size}) into MANIFEST.LOCK. \| Imported {product} into MANIFEST.LOCK. | added; first form for pizzas |
| TXT-MENU-36 | toast-info | {product} is already in MANIFEST.LOCK — instances: {qty}. | add merged into an existing line |
| TXT-MENU-16 | toast-warn | Max 10 instances per line. | quantity limit; also tooltip of a disabled `+` |
| TXT-MENU-37 | toast-err | {product} is sold out and can't be imported. | sold out between page load and click |
| TXT-MENU-38 | heading | `Terminal Debugger` | desktop cart panel |
| TXT-MENU-39 | label | `session: active_order` | panel sub-title |
| TXT-MENU-40 | log | `[INFO] Initializing cart module...` · `[INFO] Waiting for input...` · `// Memory address empty` | panel with empty cart (three lines) |
| TXT-MENU-41 | log | `[INFO] {n} dependencies installed.` · `[OK] {qty}× {product} ({size}) {lineTotal}` (one per line) | panel with items; singular "1 dependency installed." |
| TXT-MENU-42 | label | `Total Output:` | panel subtotal label (value = cart subtotal minus discount) |
| TXT-MENU-43 | button | `EXECUTE ORDER` | a11y "Go to checkout"; disabled with TXT-NAV-06 when empty |
| TXT-MENU-44 | link | `cat MANIFEST.LOCK` | a11y "Open cart" |
| TXT-MENU-45 | label | `> fetchInventory('production')…` | menu loading caption |
| TXT-MENU-46 | button | `--vegetarian` · `--vegan` · `--spicy` | optional filter chips (may, BR-MENU-20); a11y "Show only vegetarian / vegan / spicy items"; `--spicy` = spice level MILD, MEDIUM or HOT |
| TXT-MENU-47 | heading | `module.info` | item info modal title prefix |
| TXT-MENU-48 | label | `SERVING` · `CALORIES` · `ALLERGENS` · `DIET` · `SPICE` · `CAFFEINE` | item info field labels (`CAFFEINE` drinks only, from the menu catalog) |
| TXT-MENU-49 | label | {kcal} kcal | |
| TXT-MENU-50 | label | Not vegetarian | DIET value when neither vegetarian nor vegan |
| TXT-MENU-51 | link | `Configure this module →` | item info for pizzas → SCR-03 |
| TXT-MENU-52 | label | {kcal min}–{kcal max} kcal (whole pizza, by size) | pizza calories range in item info |
| TXT-MENU-58 | label | from {price} | pizza price in item info |
| TXT-MENU-59 | helper | Default build. Changes in the configurator update allergens. | under pizza allergens in item info |
| TXT-MENU-60 | label | Not spicy · No major allergens | item info values for SPICE NONE / no allergens |
| TXT-MENU-53 | empty | `{fileName}` is empty right now. Try another tab. | category without published products |
| TXT-MENU-54 | label | `$ grep -i --scope=menu` · `PKG_COUNT: {n}` | phone menu header line; `{n}` = published products |
| TXT-MENU-55 | label | `PACKAGE_RESOLVED ({n} deps)` · {subtotal} · `deploy >` | phone summary bar; a11y "Open cart, {n} items, {subtotal}" |
| TXT-MENU-56 | label | `build: mission-kitchen · {n} modules in production` | Terminal Debugger footer line |
| TXT-MENU-57 | text | `1 · import` Pick a module and inject your toppings. · `2 · deploy` Execute the order. Payment is simulated. · `3 · track` Watch the pipeline: oven, QA, courier. | home pipeline strip captions |

---

## 6. Configurator (`CONF`)

| ID | Kind | Text | Plain meaning / a11y / notes |
|---|---|---|---|
| TXT-CONF-01 | label | `configure_module.ts` | file tab / breadcrumb `src › modules › configure_module.ts` |
| TXT-CONF-02 | heading | Module Configurator | |
| TXT-CONF-03 | text | Inject dependencies and define runtime parameters for your pizza build. | intro |
| TXT-CONF-04 | heading | `scale_factor` | Size |
| TXT-CONF-05 | label | {Small \| Medium \| Large} · {d}" · {slices} slices · {price} | size option, e.g. `Large · 14" · 8 slices · $22.50`; calzone `Medium · 12" · 1 piece · $16.49` |
| TXT-CONF-06 | heading | `core_kernel` | Crust |
| TXT-CONF-07 | label | `<{Name_With_Underscores} />` | selected-crust tag in the section header, e.g. `<Neapolitan_Core />` |
| TXT-CONF-08 | label | +{amount} \| `included` | option price: surcharge or TXT-GEN-21 for the product default / 0.00 |
| TXT-CONF-09 | helper | Available: {size list} | under a crust that does not support all sizes, e.g. "Available: Medium, Large" / "Available: Small" |
| TXT-CONF-10 | helper | Crust is fixed for this module: Neapolitan Core. | calzone (`crustSelectable = false`) |
| TXT-CONF-11 | toast-info | `core_kernel` reset to `neapolitan_core`: {crust} is not available in {size}. | size change forced the crust back to CR-01 (menu catalog 4.1); also shown inline for 6 s under the crust section |
| TXT-CONF-12 | heading | `base_layer` | Sauce |
| TXT-CONF-13 | heading | `cheese_driver` | Cheese |
| TXT-CONF-14 | heading | `dependencies` | Extra toppings |
| TXT-CONF-15 | label | `npm_inject --dependencies` · {n}/{max} injected | extras counter |
| TXT-CONF-16 | helper | Dependency limit reached: max {max} extras per pizza. | shown when the counter reaches max; unchecked extras disabled with this description |
| TXT-CONF-17 | label | `STANDARD` · `PREMIUM` | extras group headings; plain "Standard extras {S}/{M}/{L}" e.g. "$1.50 / $2.00 / $2.50 by size" |
| TXT-CONF-18 | label | `"{key}": "{versionTag}"` | extra row code line, e.g. `"cherry_tomatoes": "v1.2.4"`; plain name shown beside it |
| TXT-CONF-19 | heading | `default_recipe` | Default ingredients |
| TXT-CONF-20 | button | `unlink` | a11y "Remove {ingredient}" |
| TXT-CONF-21 | button | `link` | a11y "Add {ingredient} back" |
| TXT-CONF-22 | badge | `fixed` | tooltip "Signature ingredient — can't be removed." |
| TXT-CONF-23 | label | `// removed` | after a removed ingredient (struck through) |
| TXT-CONF-24 | badge | `SOLD_OUT` | option or removable ingredient out of stock; tooltip "Unavailable today" |
| TXT-CONF-25 | toast-info | {ingredient} is unavailable today and was removed from this build. | auto-removal (BR-DATA-12), also inline in the recipe list |
| TXT-CONF-26 | heading | `manifest.json` | live preview; status chip `compiled ok` |
| TXT-CONF-27 | label | `base_image ({size})` · `core_kernel ({crust})` · `base_layer ({sauce})` · `cheese_driver ({cheese})` · `injected_deps ({n})` · `unit_price` · `instances:` · `line_total` | price breakdown labels |
| TXT-CONF-28 | label | Allergens: {list} | live allergen line (TXT-STAT-37 names) |
| TXT-CONF-29 | button | `Build & Deploy` | a11y "Add to cart, {line total}" |
| TXT-CONF-30 | button | `Commit to manifest` | edit mode; a11y "Update cart item, {line total}" |
| TXT-CONF-31 | banner | Editing a manifest line. Committing replaces it in your cart. | edit mode banner |
| TXT-CONF-32 | toast-ok | Built {product} ({size}) and deployed to MANIFEST.LOCK. | added |
| TXT-CONF-33 | toast-info | Same build already in MANIFEST.LOCK — instances: {qty}. | merged with an identical line |
| TXT-CONF-34 | toast-ok | Manifest updated: {product} ({size}). | edit saved |
| TXT-CONF-35 | banner | `404: OUT_OF_STOCK //` {product} is sold out today. You can look, but you can't deploy it. | product not orderable |
| TXT-CONF-36 | button | `Reset to defaults` | a11y "Reset configuration to the menu default" |
| TXT-CONF-37 | toast-err | This build is no longer available: {reason}. | add failed because something became unavailable; `{reason}` e.g. "Cremini mushrooms are sold out" |
| TXT-CONF-39 | label | `LIVE_RENDER: {versionTag}` | breadcrumb chip |
| TXT-CONF-40 | label | base: {default size price} | product header price line |
| TXT-CONF-41 | label | baked on \| added after baking | RecipeRole TOPPING / FINISH in the default recipe list |
| TXT-CONF-42 | heading | Pizza Configurator | phone top bar title |
| TXT-CONF-38 | label | `pipeline: bake & delivery` · ETA ~{m} min after payment | info line; `{m}` = round((queueWait + bake + qa + courierToStore + handover + average trip) / 60 / speed factor), minimum 1 |
| TXT-CONF-43 | toast-warn | {option} is no longer available. Choose another {group}. | a chosen crust, sauce, cheese or extra became unavailable while configuring or when editing a cart line (BR-CONF) |
| TXT-CONF-44 | toast-err | This manifest line no longer exists. | committing an edit of a cart line that was removed meanwhile; nothing is written and the user is sent to SCR-05 (FD-03 section 8) |
| TXT-CONF-45 | toast-info | {extra} is not available in {size} and was removed. | a selected extra whose `availableSizes` excludes the new size (BR-CONF-05); also inline for 6 s under the extras section |

---

## 7. Cart (`CART`)

| ID | Kind | Text | Plain meaning / a11y / notes |
|---|---|---|---|
| TXT-CART-01 | heading | `MANIFEST.LOCK` | Cart; a11y "Cart" |
| TXT-CART-02 | label | {n} DEPENDENCIES INSTALLED \| 1 DEPENDENCY INSTALLED | item count = Σ quantity |
| TXT-CART-03 | label | `./{folder}/{moduleKey}.ts` | line path |
| TXT-CART-04 | label | `instances:` | quantity label; stepper a11y "Quantity of {product}", "Increase quantity", "Decrease quantity" |
| TXT-CART-05 | label | {unitPrice}/unit | |
| TXT-CART-06 | button | `edit` | pizzas only; a11y "Edit {product}" |
| TXT-CART-07 | button | `rm` | a11y "Remove {product} from cart" |
| TXT-CART-08 | toast-info | Removed {product} from MANIFEST.LOCK. · Button: `Undo` | `Undo` restores the line with its quantity for 6 s (BR-CART-09; the undo is Should) |
| TXT-CART-09 | inline-err | Sold out today. \| This module was withdrawn from the menu. \| {option or ingredient} is no longer available. Edit or remove this line. | reason of an unavailable line (`isAvailable = false`), by cause as in BR-CART-13: product sold out or fixed ingredient out of stock · product ARCHIVED or DRAFT · chosen option or extra unavailable |
| TXT-CART-10 | label | `$ coupon --apply` | coupon field label; placeholder `CODE`; a11y "Coupon code" |
| TXT-CART-11 | button | `APPLY` | a11y "Apply coupon" |
| TXT-CART-12 | badge | `VALIDATED` ({discount}) | applied; e.g. `VALIDATED (−$3.22)`; FREE_DELIVERY: `VALIDATED (FREE_DISPATCH)` |
| TXT-CART-13 | helper | `>>` {Coupon.description} | under an applied coupon |
| TXT-CART-14 | button | `rm coupon` | a11y "Remove coupon {CODE}" |
| TXT-CART-15 | inline-err | Coupon not found: {CODE} | BR-PRICE-06 (1), state INVALID |
| TXT-CART-16 | inline-err | Coupon {CODE} has expired | BR-PRICE-06 (2), state INVALID |
| TXT-CART-19 | inline-err | {CODE} is valid for delivery orders only | (5), NOT_APPLIED |
| TXT-CART-20 | inline-err | Add ${X.XX} more to use {CODE} | (6), NOT_APPLIED |
| TXT-CART-21 | inline-err | Enter a coupon code. | APPLY with an empty field |
| TXT-CART-22 | toast-info | Coupon {OLD} replaced by {NEW}. | applying a second code |
| TXT-CART-23 | toast-info | Coupon {CODE} removed. | |
| TXT-CART-24 | label | `Dependencies Subtotal` | Subtotal |
| TXT-CART-25 | label | `Coupon Subsidy ({CODE})` | Discount |
| TXT-CART-26 | label | `Pipeline Transit Fee` · calculated at checkout | Delivery fee |
| TXT-CART-27 | label | `SALES_TAX` · calculated at checkout | |
| TXT-CART-28 | label | `EXEC_TOTAL_OUTPUT` · before delivery fee, tax and tip | cart total = subtotal − discount |
| TXT-CART-29 | helper | Add ${X.XX} more for `FREE_DISPATCH` (free delivery from $40.00). \| `FREE_DISPATCH` unlocked: delivery is free for this order. | free-delivery progress (threshold from `StoreSettings`) |
| TXT-CART-30 | helper | Delivery minimum is $15.00. Add ${X.XX} more, or choose pickup at checkout. | subtotal < `minDeliverySubtotal` |
| TXT-CART-31 | inline-err | Add at least one pizza, side or dessert. Drinks-only orders can't be deployed. | BR-ORD-03 |
| TXT-CART-32 | inline-err | Max 30 items per order. Remove {n} to continue. | `maxItemsPerOrder` |
| TXT-CART-33 | button | `PROCEED TO ./checkout.yml` | a11y "Go to checkout" |
| TXT-CART-34 | button | `CLEAR (rm -rf)` | a11y "Empty the cart" |
| TXT-CART-35 | dialog | Title: "rm -rf MANIFEST.LOCK?" · Body: "This removes all {n} items and the coupon from your cart." · Buttons: `rm -rf` / `Cancel` | `rm -rf` a11y "Empty the cart" |
| TXT-CART-36 | toast-info | MANIFEST.LOCK cleared. | |
| TXT-CART-37 | empty | Heading: "MANIFEST.LOCK is empty" · Text: "// No dependencies installed. Import a module from the menu to start a build." · Button: `git checkout menu` | |
| TXT-CART-39 | label | {modifier summary} | line sub-text for pizzas: `{size}` · non-default crust, sauce, cheese names · `+ {extra}` · `− {removed}`, comma separated, e.g. `Large 14", Buffalo Mozzarella, + Cherry tomatoes, − Fresh basil` |
| TXT-CART-40 | label | `integrity: sha256-verified` · `pipeline: staged` | decorative status line under the header |
| TXT-CART-41 | badge | `LOCKED` | decorative chip next to the cart title |
| TXT-CART-43 | toast-warn | Only {k} more could be added — max 10 of the same item per line. | add or merge capped at 10 per line (BR-CART-05); when nothing could be added TXT-MENU-16 is shown instead |
| TXT-CART-44 | toast-err | Max 30 items per order. Nothing was added. | add or quantity increase rejected because the cart would exceed 30 items (BR-CART-06); also the tooltip of the disabled `+` stepper at 30 items |
| TXT-CART-45 | helper | Order {orderNumber} is waiting for payment. | cart notice while an order of this cart is PAYMENT_PENDING or PAYMENT_FAILED; links to SCR-09 |

---

## 8. Checkout (`CHK`)

| ID | Kind | Text | Plain meaning / a11y / notes |
|---|---|---|---|
| TXT-CHK-01 | heading | `checkout_config.json` | Checkout |
| TXT-CHK-02 | text | Configure your deployment parameters, then execute the order. | intro |
| TXT-CHK-03 | label | `const method = 'delivery';` \| `const method = 'pickup';` | live code line above the toggle |
| TXT-CHK-04 | button | `DELIVERY` · To your door · {fee or FREE} | toggle option; a11y "Delivery" |
| TXT-CHK-05 | button | `PICKUP` · Collect at 2140 Folsom Street · no fee | toggle option; a11y "Pickup" |
| TXT-CHK-06 | heading | `.env // destination` | Delivery address |
| TXT-CHK-09 | label | `ADDRESS_LINE_1` · Street and number | placeholder "500 Howard Street" |
| TXT-CHK-10 | label | `ADDRESS_LINE_2` · Apartment, floor, suite | optional; placeholder "Floor 4, Suite 410" |
| TXT-CHK-11 | label | `CITY` | placeholder "San Francisco" (prefilled) |
| TXT-CHK-12 | label | `STATE` | placeholder "CA" (prefilled) |
| TXT-CHK-13 | label | `ZIP_CODE` | placeholder "94105" |
| TXT-CHK-14 | label | `DELIVERY_NOTES` · Notes for the courier | optional; placeholder "Ring the call box #410, leave with security desk." |
| TXT-CHK-15 | helper | ZIP {zip} · {neighborhood} · {distance} mi · in delivery zone | zone OK (`color.success.text`, icon `check_circle`) |
| TXT-CHK-16 | inline-err | ZIP {zip} is outside our delivery zone. Choose pickup or another address. | zone fail |
| TXT-CHK-17 | link | See delivery ZIP codes | opens a popover listing active zones: `{zip} {neighborhood} · {distance} mi` |
| TXT-CHK-18 | heading | `PICKUP::COUNTER` | pickup store card title |
| TXT-CHK-19 | text | Git Pizza MxDev — Mission Kitchen · 2140 Folsom Street, San Francisco, CA 94110 · (415) 555-0142 · Pickup at the counter. | store card body (values from `StoreSettings`) |
| TXT-CHK-20 | heading | `.env // contact` | Contact details |
| TXT-CHK-21 | label | `CONTACT_NAME` · Full name | placeholder "Taylor Brooks" |
| TXT-CHK-22 | label | `CONTACT_EMAIL` · For your receipt and order lookup | placeholder "taylor@example.com" |
| TXT-CHK-23 | label | `CONTACT_PHONE` · For the courier | placeholder "(415) 555-0123" |
| TXT-CHK-25 | heading | `// PAYMENT_PROTOCOL` | Payment method |
| TXT-CHK-26 | button | `CARD` · Demo test card | a11y "Pay by card (demo test card)" |
| TXT-CHK-27 | button | `APPLE_PAY` · Simulated | a11y "Pay with Apple Pay (simulated)" |
| TXT-CHK-28 | button | `GOOGLE_PAY` · Simulated | a11y "Pay with Google Pay (simulated)" |
| TXT-CHK-29 | label | `TEST_CARD` | test card selector label |
| TXT-CHK-30 | helper | Demo mode: no real card data is ever entered. Each test card has a fixed outcome. | under the test-card selector |
| TXT-CHK-31 | heading | `COURIER_TIP` | Tip (delivery only) |
| TXT-CHK-32 | button | `0%` · `10% · {amount}` · `15% · {amount}` · `20% · {amount}` | tip options; a11y "Tip {p} percent, {amount}" |
| TXT-CHK-33 | helper | The whole tip goes to your courier (simulated). | |
| TXT-CHK-34 | heading | `// PACKAGE_MANIFEST` · {n} ARTIFACTS | order summary; singular "1 ARTIFACT" |
| TXT-CHK-35 | link | `Edit manifest` | opens SCR-05 |
| TXT-CHK-36 | label | `SUBTOTAL_PAYLOAD` | Subtotal |
| TXT-CHK-37 | label | `DISCOUNT ({CODE})` | Discount |
| TXT-CHK-38 | label | `PIPELINE_TRANSIT_FEE` | Delivery fee; value `$3.99` or `FREE_DISPATCH` (threshold or coupon); pickup row hidden |
| TXT-CHK-39 | label | `SALES_TAX ({rate}%)` | e.g. `SALES_TAX (8.625%)` |
| TXT-CHK-40 | label | `COURIER_TIP ({p}%)` | delivery only |
| TXT-CHK-41 | label | `EXEC_TOTAL` | Order total |
| TXT-CHK-42 | label | `ESTIMATED_ETA` · {mm:ss} · ~{HH:mm} \| `READY_AT` · ~{HH:mm} | delivery / pickup estimate before ordering (order-lifecycle 7.3 from PAYMENT_PENDING) |
| TXT-CHK-43 | button | `Execute Order --force` | a11y "Place order and pay {total}" |
| TXT-CHK-44 | helper | Payment is simulated. No money is charged. | under the CTA |
| TXT-CHK-46 | helper | Delivery minimum is $15.00 (subtotal). Add ${X.XX} or switch to pickup. | CTA disabled: below minimum |
| TXT-CHK-47 | helper | Choose an address inside the delivery zone, or switch to pickup. | CTA disabled: zone fail |
| TXT-CHK-48 | helper | Remove unavailable items from your manifest first. | CTA disabled: unavailable lines |
| TXT-CHK-49 | toast-info | MANIFEST.LOCK is empty. Import a module first. | redirect from checkout with an empty cart |
| TXT-CHK-51 | toast-err | Some modules became unavailable: {list}. Review your manifest. | T-01 blocked on submit |
| TXT-CHK-52 | helper | Coupon {CODE}: {state message} | coupon line in the summary; message from TXT-CART-15…20 or the coupon description when applied |
| TXT-CHK-53 | label | `live_satellite_feed` · `DESTINATION_LOCK` | delivery map header; plain "Map preview of the delivery address" |
| TXT-CHK-54 | helper | Enter a ZIP code to lock the destination. | map before a valid ZIP |
| TXT-CHK-55 | heading | Checkout | phone top-bar title |
| TXT-CHK-56 | helper | Show your commit hash at the counter. | pickup panel on SCR-06 |
| TXT-CHK-57 | helper | We use your email only to let you look up this order. No emails are sent in this demo. | under CONTACT_EMAIL (guest) |
| TXT-CHK-58 | toast-warn | Prices changed since you opened checkout. Review the new total and execute again. | BR-CHK-16 |
| TXT-CHK-59 | helper | Order {orderNumber} is waiting for payment. Resume it or cancel it before placing a new order. | informational notice on SCR-06 while an order of this session is PAYMENT_PENDING or PAYMENT_FAILED (BR-CHK-19); with link TXT-CHK-62; `Execute Order --force` stays enabled |
| TXT-CHK-60 | toast-err | Could not execute the order. Nothing was charged. Please try again. | technical failure of T-01 |
| TXT-CHK-61 | button | `Switch to pickup` | under the zone error TXT-CHK-16; sets the order type to PICKUP (BR-CHK-06) |
| TXT-CHK-62 | link | `Resume payment` | in the TXT-CHK-59 notice; opens SCR-09 of that order |

---

## 9. Payment and confirmation (`PAY`)

| ID | Kind | Text | Plain meaning / a11y / notes |
|---|---|---|---|
| TXT-PAY-01 | heading | `PAYMENT_PROTOCOL // handshake` | payment sheet title; a11y "Payment" |
| TXT-PAY-02 | label | Order {orderNumber} · {total} · {method} | sheet sub-title |
| TXT-PAY-03 | label | Processing payment… | processing state headline |
| TXT-PAY-04 | label | Attempt {n} of 3 | |
| TXT-PAY-05 | label | Waiting for gateway response… {mm:ss} | elapsed time; shown after 3 s (relevant for `AMEX_0005`) |
| TXT-PAY-06 | helper | Please keep this window open. | processing |
| TXT-PAY-07 | heading | `ERROR 402 // PAYMENT_FAILED` | failed state |
| TXT-PAY-08 | text | {failure text}. Attempt {n} of 3 failed. Choose a payment method and retry, or cancel the order. Your manifest is unchanged. | failure text from TXT-STAT-26 |
| TXT-PAY-09 | label | {r} attempts left \| 1 attempt left | |
| TXT-PAY-10 | button | `Retry payment` | a11y "Retry payment, {total}" |
| TXT-PAY-11 | button | `Cancel order` | |
| TXT-PAY-12 | dialog | Title: "Cancel order {orderNumber}?" · Body: "Nothing has been charged. Your manifest stays as it is." · Buttons: `Cancel order` / `Keep order` | |
| TXT-PAY-13 | heading | `ROLLED_BACK // payment failed 3 times` | third failure |
| TXT-PAY-14 | text | Order {orderNumber} was rolled back. Nothing was charged. Your manifest is unchanged, so you can check out again. | |
| TXT-PAY-15 | button | `Back to manifest` | opens SCR-05 |
| TXT-PAY-16 | toast-info | Order {orderNumber} cancelled. Nothing was charged. | after T-06 |
| TXT-PAY-17 | heading | `DEPLOYMENT SUCCESSFUL // 200 OK` | confirmation modal; a11y "Order placed and paid" |
| TXT-PAY-18 | label | `BUILD QUEUED // STAGE: QUEUED` | |
| TXT-PAY-19 | text | The kitchen accepted your order. Position {n} in the build queue. | `{n}` = queue position at T-02 (SIM-02 BR-SIM-16c) |
| TXT-PAY-20 | label | `ORDER` · {orderNumber} | |
| TXT-PAY-21 | label | `DEPLOYMENT_HASH` · #{hash} | |
| TXT-PAY-22 | button | `COPY HASH` | a11y "Copy commit hash" |
| TXT-PAY-23 | label | `ESTIMATED_DELIVERY` · ETA {mm:ss} · ~{HH:mm} \| `ESTIMATED_READY` · ~{HH:mm} | delivery / pickup |
| TXT-PAY-24 | label | `HARDWARE_CLUSTER` · Oven assigned when baking starts · {online}/{total} ovens online · thermal load {p}% | Assumption A-74; thermal load = kitchen load of SIM-02 BR-SIM-16d |
| TXT-PAY-25 | label | `TX_PROTOCOL` · {method} · `PAID` · TxID {transactionId} | |
| TXT-PAY-26 | heading | `PIPELINE_STREAMS // STDOUT` | first log lines |
| TXT-PAY-27 | label | `TRACKING_LINK` | SCR-08 (every order in Lite is a guest order) |
| TXT-PAY-28 | helper | Save this link to follow your order. You can also find it with your order number and email. | guest |
| TXT-PAY-29 | button | `COPY LINK` | a11y "Copy tracking link" |
| TXT-PAY-30 | button | `MONITOR PIPELINE →` | a11y "Track order" |
| TXT-PAY-31 | button | `EXPORT RECEIPT` | a11y "View receipt" |
| TXT-PAY-32 | label | `{destination}` | `DELIVERY → {line1}, {zip}` or `PICKUP → 2140 Folsom Street` |
| TXT-PAY-33 | text | Payment window expired. Order {orderNumber} was rolled back. Nothing was charged. | SCR-07 / SCR-09 after T-07 (BR-PAY-13) |
| TXT-PAY-35 | log | `> POST /v1/charges (simulated)` · `> method: {method}` · `> amount: {total} USD` · `> awaiting gateway response…` | SCR-07 processing state, lines appear one after another |
| TXT-PAY-36 | label | `200 OK · TxID {transactionId}` | SCR-07 success line, about 1 s before SCR-08 opens |
| TXT-PAY-37 | toast-info | A payment attempt is already processing. | second retry request while an attempt is processing (SIM-01 BR-SIM-12) |

---

## 10. Tracking and lookup (`TRK`)

| ID | Kind | Text | Plain meaning / a11y / notes |
|---|---|---|---|
| TXT-TRK-01 | heading | `DEPLOYMENT_STATUS` | Order tracking |
| TXT-TRK-02 | label | ORDER {orderNumber} \| COMMIT #{hash} \| PLACED {date} {HH:mm} | meta line; hash has a copy button (TXT-GEN-10) |
| TXT-TRK-03 | badge | `LIVE PIPELINE MONITORING` | with LIVE dot; hidden in final states |
| TXT-TRK-04 | heading | `Pipeline Workflow` · Stage {n}/5 | stepper title; `{n}` = current stage (0 before QUEUED) |
| TXT-TRK-05 | label | Stage labels: `QUEUED`, `BAKING`, `QA_CHECK`, `DISPATCH` (delivery) \| `READY_TO_PULL` (pickup), `DEPLOYED` (delivery) \| `PULLED` (pickup) | order-lifecycle 2.1 |
| TXT-TRK-06 | label | Sub-labels: Order received · In the oven · Quality check & packing · Waiting for courier \| Courier on the way (delivery) \| Ready for pickup (pickup) · Delivered \| Picked up | |
| TXT-TRK-07 | badge | `DONE` · `RUNNING` · `PENDING` | stage state; a11y "completed", "in progress", "not started" |
| TXT-TRK-08 | label | Waiting for a free oven slot · position {n} in the queue | progress caption QUEUED; `{n}` per SIM-02 BR-SIM-16c |
| TXT-TRK-09 | label | Baking in {ovenName} · {p}% \| Coming out of the oven | progress caption BAKING; `{p}` = min(100, elapsed / bake) (SIM-02 BR-SIM-16b); second form once `{p}` reaches 100 |
| TXT-TRK-10 | label | Slicing, adding dips and sealing the box | QA_CHECK |
| TXT-TRK-11 | label | Packed. Assigning a courier… \| Packed. {nodeHandle} is on the way to the store. \| Packed. {nodeHandle} is picking up your order. | READY_FOR_DISPATCH by courier status (none / TO_STORE / AT_STORE) |
| TXT-TRK-12 | label | {nodeHandle} is {d} mi away | OUT_FOR_DELIVERY |
| TXT-TRK-13 | label | Ready at the counter: 2140 Folsom Street | READY_FOR_PICKUP |
| TXT-TRK-14 | banner | `STAGED //` Processing payment… | PAYMENT_PENDING |
| TXT-TRK-15 | banner | `PAYMENT_FAILED //` {failure text}. Retry the payment or cancel the order. | PAYMENT_FAILED; buttons TXT-PAY-10, TXT-PAY-11 |
| TXT-TRK-16 | banner | `ROLLED_BACK //` This order was rolled back. {who} {refund} | CANCELLED; `{who}` and `{refund}` below |
| TXT-TRK-17 | text | You cancelled it. | `cancelledBy` GUEST |
| TXT-TRK-18 | text | The store cancelled it. Reason: {reason} | `cancelledBy` MANAGER: only the seed order MX-1025; no order placed in Lite gets it |
| TXT-TRK-19 | text | Payment was not completed. | `cancelledBy` SYSTEM |
| TXT-TRK-20 | text | Refund of ${X.XX} issued to {method} (simulated). | only when refunded |
| TXT-TRK-21 | banner | `DEPLOYED //` Delivered at {HH:mm}. Enjoy your build! | DELIVERED |
| TXT-TRK-22 | banner | `PULLED //` Picked up at {HH:mm}. Enjoy your build! | PICKED_UP |
| TXT-TRK-23 | heading | `bash — track.log — 80x24` | log pane title |
| TXT-TRK-24 | label | `mxdev@git-pizza:~$` | prompt line at the bottom of the log (blinking cursor) |
| TXT-TRK-25 | empty | Waiting for the first log line… | |
| TXT-TRK-26 | heading | `Geolocation` | map panel; a11y "Simulated delivery map" |
| TXT-TRK-27 | label | Mission Kitchen · {line1} · {nodeHandle} | marker labels: store, destination, courier |
| TXT-TRK-28 | helper | The live map starts when the courier picks up your order. | delivery before OUT_FOR_DELIVERY |
| TXT-TRK-29 | label | `ESTIMATED_ETA` · {mm:ss} · ~{HH:mm} | delivery |
| TXT-TRK-30 | label | `DISTANCE_REMAINING` · {d} mi | OUT_FOR_DELIVERY |
| TXT-TRK-31 | label | `READY_AT` · ~{HH:mm} | pickup |
| TXT-TRK-32 | label | `COURIER` · {nodeHandle} · {name}, {vehicle} | courier card |
| TXT-TRK-33 | heading | `Order Configuration` | order summary |
| TXT-TRK-34 | label | `DEPLOYMENT_COST` | order total |
| TXT-TRK-35 | link | `View receipt` | opens SCR-13 |
| TXT-TRK-36 | button | `Rollback order` | a11y "Cancel order" |
| TXT-TRK-37 | dialog | Title: "Rollback order {orderNumber}?" · Body: "Your order hasn't gone into the oven yet. You'll get a full refund of {total} to {method} (simulated)." · Buttons: `Rollback order` / `Keep order` | QUEUED (T-09) |
| TXT-TRK-38 | toast-ok | Order {orderNumber} rolled back. Refund issued. | |
| TXT-TRK-39 | helper | ROLLBACK REJECTED — your order is already in the oven. | BAKING, QA_CHECK (BR-ORD-08) |
| TXT-TRK-40 | helper | ROLLBACK REJECTED — your order is already packed. | READY_FOR_DISPATCH, READY_FOR_PICKUP |
| TXT-TRK-41 | helper | ROLLBACK REJECTED — your order is already on its way. | OUT_FOR_DELIVERY |
| TXT-TRK-42 | helper | Bookmark this page: it's your tracking link. | guest |
| TXT-TRK-43 | button | `COPY LINK` | a11y "Copy tracking link" |
| TXT-TRK-44 | heading | `ERROR 404 // DEPLOYMENT_NOT_FOUND` | invalid / expired tracking link |
| TXT-TRK-45 | text | This tracking link is invalid, or the order no longer exists (the demo may have been reset). | |
| TXT-TRK-46 | button | `git log --grep` | a11y "Find my order" → SCR-10 |
| TXT-TRK-48 | heading | `git log --grep` | lookup page title; a11y "Find your order" |
| TXT-TRK-49 | text | Find your order with its number and the email you used at checkout. | |
| TXT-TRK-50 | label | `ORDER_NUMBER` | placeholder "MX-1048" |
| TXT-TRK-51 | label | `CONTACT_EMAIL` | placeholder "you@example.com" |
| TXT-TRK-52 | button | `FIND DEPLOYMENT` | a11y "Find order" |
| TXT-TRK-53 | inline-err | ORDER_NUMBER must look like MX-1048. | |
| TXT-TRK-54 | inline-err | No deployment found for {orderNumber} with that email. | not found (does not say which value is wrong) |
| TXT-TRK-57 | label | {qty}× {product} | order summary line; with size for pizzas: `1× Inferno Payload · Large 14"` |
| TXT-TRK-58 | heading | `UNSAFE OPERATIONS` | rollback block title; a11y "Cancel order" section |
| TXT-TRK-59 | heading | Execution Graph · Stage {n}/5 | phone stepper title |
| TXT-TRK-60 | heading | `stdout --tail` | phone log section title |
| TXT-TRK-61 | label | ESTIMATED ARRIVAL · {mm:ss} MIN | phone map overlay (delivery) |
| TXT-TRK-62 | helper | Show your commit hash #{hash} at the counter. | READY_FOR_PICKUP on SCR-09 |
| TXT-TRK-63 | helper | This order will be rolled back automatically at {HH:mm} if not paid. | PAYMENT_FAILED on SCR-09; time = end of the payment window |
| TXT-TRK-65 | inline-err | Too many attempts. Try again in 10 minutes. | guest lookup throttle (BR-TRK-19) |
| TXT-TRK-66 | label | `ESTIMATED_ETA` · Any moment now | delivery countdown at 00:00 (never negative, BR-TRK-07) |

---

## 12. Order detail and receipt (`PRF`)

| ID | Kind | Text | Plain meaning / a11y / notes |
|---|---|---|---|
| TXT-PRF-31 | heading | `git show #{hash}` | order detail title |
| TXT-PRF-32 | label | Order {orderNumber} · placed {date} {HH:mm} · {type} | sub-title |
| TXT-PRF-33 | heading | `Order lines` · `Totals` · `Payment` · `Destination` \| `Pickup` · `Status history` | section headings |
| TXT-PRF-34 | label | {method} · {attempt status} · TxID {transactionId} | payment line; failed attempts as "{method} · FAILED · {failure text}" |
| TXT-PRF-35 | label | Refunded {amount} on {date} {HH:mm} · {refundId} | |
| TXT-PRF-36 | button | `Print receipt` | opens the browser print view of the receipt layout |
| TXT-PRF-37 | label | Receipt — demo order. No real payment was taken. Not a tax invoice. | printed receipt footer |
| TXT-PRF-38 | link | `./track.log` | a11y "Track this order" (active orders) |
| TXT-PRF-57 | label | `CRUST` {name} · `SAUCE` {name} · `CHEESE` {name} · `+` {extra} {price} · `−` {removed} | modifier lines on order detail and receipt (OrderLineModifier) |

---

## 18. Error pages and system messages (`ERR`)

| ID | Kind | Text | Plain meaning / a11y / notes |
|---|---|---|---|
| TXT-ERR-01 | heading | `ERROR 404 // CRUST_NOT_FOUND` | Page not found |
| TXT-ERR-02 | text | The page or record you asked for doesn't exist. It may have been archived, or the demo was reset. | |
| TXT-ERR-03 | heading | `ERROR 500 // SEG_FAULT` | Unexpected error |
| TXT-ERR-04 | text | Something went wrong on our side. Your manifest and orders are safe. | |
| TXT-ERR-08 | button | `RETURN_TO_MAIN` | a11y "Go to the home page" |
| TXT-ERR-09 | button | `RETRY_DEPLOYMENT` | a11y "Try again" |
| TXT-ERR-12 | heading | `stack_trace.log` | decorative stack trace panel title |
| TXT-ERR-13 | log | 404: `[FATAL] Uncaught ReferenceError: 'crust' is not defined in scope.` · `at Kitchen.assemble("{path}") // kitchen.ts:102:14` · `at Oven.bake({ temp: 850, unit: 'F' }) // oven.ts:45:22` · `at Router.resolve("{path}") // router.ts:12:3` · `at GitPizza.boot() // main.js:1:1` | `{path}` = requested path, max 60 characters |
| TXT-ERR-14 | log | 500: `[FATAL] Segmentation fault in OvenCluster.dispatch()` · `at Pipeline.run() // pipeline.ts:88:7` · `at Kitchen.handle() // kitchen.ts:211:9` · `at GitPizza.boot() // main.js:1:1` | never real error details |
| TXT-ERR-16 | label | `// SUGGESTED RESOLUTION:` Re-synchronize with the main branch. | under the trace |
| TXT-ERR-17 | label | `LATENCY` · `STATUS` · `UPTIME` | status strip; values: page load ms, `404`/`SEG_FAULT`, app uptime `HH:mm:ss` |
| TXT-ERR-19 | toast-err | Could not reach the server. Check your connection and try again. | a page or list could not be loaded; with button TXT-GEN-07 `Retry` |
| TXT-ERR-20 | toast-info | Your session expired. Your manifest was cleared. | guest session ended and a non-empty cart was lost (BR-ERR-11; information model LITE-SES-05; US-286) |
| TXT-ERR-21 | toast-info | Demo data was reset by the system at {HH:mm}. | every open live screen after a demo reset (SIM-08 section 5) |
| TXT-ERR-22 | toast-info | The demo was reset. Your cart and session data were cleared. | shown once to visitors whose cart or tracked order disappeared in a reset; also closes an open payment sheet (SIM-08 section 5) |
| TXT-ERR-23 | toast-err | Demo data is being reset. Try again in a few seconds. | placing an order, paying or retrying during a reset (SIM-08 section 4) |
| TXT-ERR-24 | label | `INCIDENT_ID: {id}` | SCR-41 under the explanation; `{id}` e.g. `ERR-20261105-184233-7F3A` (date, time, 4 random hex characters), the same ID is written to the application log (BR-ERR-02) |

## 19. Validation patterns (`VAL`)

Field names in messages are the visible dev labels (BR-DATA-08).

| ID | Text | When |
|---|---|---|
| TXT-VAL-01 | Lint failed: {n} env variables need attention. \| Lint failed: 1 env variable needs attention. | form error summary |
| TXT-VAL-02 | {FIELD} is required. | empty required field (after trimming, BR-DATA-07) |
| TXT-VAL-03 | {FIELD} must be at most {n} characters. | length |
| TXT-VAL-04 | {FIELD} must be at least {n} characters. | length |
| TXT-VAL-05 | {FIELD} must be a valid email address. | BR-DATA-06 |
| TXT-VAL-06 | {FIELD} must be a 10-digit US phone number. | BR-DATA-06 |
| TXT-VAL-07 | {FIELD} must be 5 digits. | ZIP |
| TXT-VAL-08 | {FIELD} must be a 2-letter state code. | STATE |
| TXT-VAL-09 | {FIELD} must be a whole number between {min} and {max}. | integers |
| TXT-VAL-10 | Enter an amount like 14.99. | money input with wrong format |
| TXT-VAL-11 | Choose a payment method. | |
| TXT-VAL-12 | Choose a test card. | |
| TXT-VAL-13 | Choose {what}. | other required single choice |

---

## 20. Order log line templates (`LOG`)

Format in the UI: `[HH:mm:ss] [TAG] message`. The tag is stored in `OrderLogEntry.tag` (without brackets), the level in `level`. Color by level (`tokens.md` 1.7). Lines marked *internal* have `isCustomerVisible = false`: they are stored, but no screen shows them (A-72). Minimum lines per transition come from `order-lifecycle.md` section 4; the wording below is binding.

| ID | Transition / event | Level | Tag | Message template | Visible to |
|---|---|---|---|---|---|
| TXT-LOG-01 | T-01 | INFO | `INIT` | Order {orderNumber} staged. Commit #{hash} signed. | all |
| TXT-LOG-02 | T-01 | INFO | `PAYMENT` | Handshake with payment gateway (simulated)… | all |
| TXT-LOG-03 | T-02 | SUCCESS | `PAYMENT` | Payment confirmed. TxID {transactionId} | all |
| TXT-LOG-04 | T-02 | INFO | `KITCHEN` | Order queued at position {n}. | all |
| TXT-LOG-05 | T-03 | ERROR | `PAYMENT` | ERROR 402: {failure text}. Attempt {n} of 3. | all |
| TXT-LOG-06 | T-04 | ERROR | `PAYMENT` | ERROR 402: {failure text}. Attempt 3 of 3. | all |
| TXT-LOG-07 | T-04 | ERROR | `ROLLBACK` | Order rolled back: payment failed 3 times. | all |
| TXT-LOG-08 | T-05 | INFO | `PAYMENT` | Retrying payment (attempt {n} of 3)… | all |
| TXT-LOG-09 | T-06 | ERROR | `ROLLBACK` | Order rolled back by customer before payment. | all |
| TXT-LOG-10 | T-07 | ERROR | `ROLLBACK` | Payment window expired. Order rolled back. | all |
| TXT-LOG-11 | T-08 | INFO | `KITCHEN` | Dough stretched, toppings injected. | all |
| TXT-LOG-12 | T-08 | INFO | `OVEN` | Entered {oven} at {temp}°F. Bake timer {mm:ss}. | all |
| TXT-LOG-13 | T-09 | ERROR | `ROLLBACK` | Order rolled back by customer. Refund issued. | all |
| TXT-LOG-14 | T-10 | INFO | `OVEN` | Pulled from {oven} after {mm:ss}. | all |
| TXT-LOG-15 | T-10 | INFO | `QA` | Quality check started. | all |
| TXT-LOG-16 | T-11 | SUCCESS | `QA` | Passed: {slice summary}, dips added, box sealed. | all |
| TXT-LOG-17 | T-11 | INFO | `ROUTER` | Waiting for courier… | all |
| TXT-LOG-18 | T-12 | SUCCESS | `QA` | Passed: box sealed. | all |
| TXT-LOG-19 | T-12 | SUCCESS | `DEPLOY` | Ready for pickup at the counter. | all |
| TXT-LOG-20 | T-13 | WARN | `QA` | Check failed: {reason}. Rebuilding your order. | all |
| TXT-LOG-21 | T-14 | INFO | `ROUTER` | Handed over to {nodeHandle}. | all |
| TXT-LOG-22 | T-14 | INFO | `COURIER` | On the way. Distance {d} mi. | all |
| TXT-LOG-23 | T-15 | SUCCESS | `DEPLOY` | Delivered. Enjoy your build! | all |
| TXT-LOG-24 | T-16 | SUCCESS | `DEPLOY` | Picked up. Enjoy your build! | all |
| TXT-LOG-25 | T-17 paid (seed history only) | ERROR | `ROLLBACK` | Order cancelled by the store. Refund issued. | all |
| TXT-LOG-26 | T-17 unpaid (seed history only) | ERROR | `ROLLBACK` | Order cancelled by the store. | all |
| TXT-LOG-27 | T-17 (seed history only) | WARN | `OPS` | Cancelled by {actorName}: {reason} | internal |
| TXT-LOG-28 | courier assigned | INFO | `ROUTER` | Courier {nodeHandle} assigned. Arriving at the store in ~{mm:ss}. | all |
| TXT-LOG-30 | courier AT_STORE | INFO | `ROUTER` | {nodeHandle} is at the store. | all |
| TXT-LOG-34 | QA check ticked | DEBUG | `QA` | {check name} ✓ by sim/kitchen-auto. | internal |
| TXT-LOG-35 | route progress 50 % | INFO | `COURIER` | Halfway there. {d} mi to go. | all |
| TXT-LOG-36 | route progress 90 % | INFO | `COURIER` | Approaching your address. | all |

`{slice summary}`: one pizza → "{n} slices" (6 Small, 8 Medium/Large); several pizzas → "{k} pizzas sliced"; calzone only → "calzone left whole"; no pizza → "no slicing needed". `{failure text}` from TXT-STAT-26. `{temp}` = oven temperature at entry.
