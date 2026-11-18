# Glossary

Git Pizza MxDev speaks the language of developers: pizzas are **modules**, the cart is a **manifest**, placing an order is a **deploy**, and the order's progress is a **pipeline**. This glossary maps every developer metaphor used in the Lite UI to its plain business meaning, and defines the domain terms used in the package.

**Rule for the UI:** the dev label is the visible label; wherever the meaning is not obvious, the plain meaning must also be available to the user (sub-label, tooltip or accessible name). Buttons that spend money or cancel something always state the plain action in their accessible name (for example the button `Execute Order --force` has the accessible name "Place order and pay"). Exact UI texts are owned by `06-ui-specification/`.

Related: [ids-and-traceability.md](ids-and-traceability.md), [../04-information-model/information-model.md](../04-information-model/information-model.md), [../05-processes/order-lifecycle.md](../05-processes/order-lifecycle.md).

---

## 1. Developer metaphors → business meaning

### 1.1 Navigation and shell

| Dev label in UI | Business meaning | Notes / where |
|---|---|---|
| `./main.js` | Home page | Header nav (SCR-01) |
| `./menu.ts` | Menu | Header nav (SCR-02) |
| `./checkout.yml` | Checkout | Header nav (SCR-06); disabled with a hint when the cart is empty |
| `./track.log` | Track order | Header nav: last order of the session (SCR-09) or lookup (SCR-10) |
| Project Explorer (`src/pizza-mxdev/`) | Desktop sidebar | SCR-16 |
| Root | Home | Sidebar item |
| Categories | Menu categories | Sidebar item, expands to the four category files |
| Active_Deployments | My last order | Sidebar item, shown when the session has placed or looked up an order |
| New Branch | Start a new order (opens the menu) | Sidebar button |
| Source · Deploy · Trace | Phone bottom tabs: Menu · Cart · Track | SCR-16 phone layout; Home via the logo |
| Terminal Debugger (`session: active_order`) | Live cart summary panel | Right panel on the desktop menu (SCR-02) |
| `grep --pizza '…'` / `grep -i --scope=menu` | Menu search | Search box (header, menu) |
| DEMO MODE banner | Notice that payment, kitchen and delivery are simulated | Always visible, all screens |

### 1.2 Menu and configurator

| Dev label | Business meaning | Notes |
|---|---|---|
| Module | Menu item (product) | `Product` |
| Module key, e.g. `root-pizza` | Short technical name of the product | Used in labels like `./pizzas/root-pizza.ts` |
| Version tag, e.g. `v1.2` | Decorative "release" label of a product | No business meaning |
| `pizzas.json`, `sides.yml`, `drinks.env`, `desserts.md` | Categories: Pizzas, Sides & Dips, Drinks, Desserts | File tabs |
| Build Your Instance | Menu page heading | |
| Code block (`const pizza = { base, sauce, cheese, toppings }`) | Ingredient list of the product, shown as code | Generated from the default recipe |
| `+ import` / Import Module | Add to cart (non-configurable item, or pizza with default configuration) | |
| Configure (`tune` icon) | Open the pizza configurator | |
| Module Configurator (`configure_module.ts`) | Pizza configurator | SCR-03 |
| `scale_factor` | Size (Small 10", Medium 12", Large 14") | |
| `core_kernel` | Crust | Option group CRUST |
| `base_layer` | Sauce | Option group SAUCE |
| `cheese_driver` | Cheese | Option group CHEESE |
| Dependency / inject dependencies / Dependency Manager | Extra topping / add extra toppings | Option group EXTRA |
| Unlink (on a default ingredient) | Remove a default ingredient | Free of charge |
| `manifest.json` preview | Live summary of the pizza being configured, as JSON | Configurator |
| `Build & Deploy` / `Deploy to Cart` | Add the configured pizza to the cart | Configurator CTA |
| `<Vegetarian />`, `<Vegan />`, `<Classic />`, `<BestSeller />`, `<NewRelease />`, `<ChefPick />` | Badges | |
| `HOTFIX_SPICY` + level | Spice level (Mild, Medium, Hot) | |
| `SOLD_OUT` / `404: OUT_OF_STOCK` | Sold out (not orderable today) | In Lite: Tiramisu Stack and the ingredient jalapeño (seed) |
| `module.info` | Item details modal (ingredients, allergens, nutrition) | SCR-04 |

### 1.3 Cart, checkout and payment

| Dev label | Business meaning | Notes |
|---|---|---|
| Manifest / `MANIFEST.LOCK` | Cart | SCR-05 |
| Artifact / dependency (cart line) | Cart line | |
| `instances:` | Quantity | 1–10 per line |
| `rm` / delete line | Remove line from cart | |
| `CLEAR (rm -rf)` | Empty the cart | Asks for confirmation |
| `coupon --apply` | Coupon code field | |
| `Dependencies Subtotal` / `SUBTOTAL_PAYLOAD` | Subtotal | |
| `Pipeline Transit Fee` | Delivery fee | |
| `FREE_DISPATCH` | Free delivery (threshold reached or coupon) | Also a coupon code |
| `Student Subsidy` / discount line | Coupon discount | |
| `SALES_TAX` | Sales tax (8.625 %) | |
| `Courier tip` | Tip for the courier | Delivery only |
| `EXEC_TOTAL_OUTPUT` / `EXECUTION TOTAL` | Order total | |
| `checkout_config.json` | Checkout page | SCR-06 |
| `const method = 'delivery' / 'pickup'` | Order type: delivery or pickup | |
| Environment variables / `.env` | Delivery address and contact fields | |
| `ADDRESS_LINE_1`, `ADDRESS_LINE_2`, `CITY`, `STATE`, `ZIP_CODE`, `DELIVERY_NOTES` | Street and number, apartment/floor, city, state, ZIP code, notes for the courier | |
| `CONTACT_NAME`, `CONTACT_EMAIL`, `CONTACT_PHONE` | Contact details | The guest enters them for every order |
| `PAYMENT_PROTOCOL` | Payment method | Card, Apple Pay, Google Pay (all simulated) |
| Test card | A demo card with a known outcome (approve, decline, …) | No real card data is ever entered |
| `Execute Order --force` | Place order and pay | Creates the order |
| Deploy (verb) | Place an order | |
| Deployment | An order | |
| `DEPLOYMENT SUCCESSFUL // 200 OK` | Order placed and paid | Confirmation modal SCR-08 |
| Deployment hash / commit hash (`#a3f9c2e`) | The order's public reference shown to the guest | `Order.commitHash` |
| `MX-1048` | Order number (sequential), used in the lookup and in support | `Order.orderNumber` |
| `ERROR 402` | Payment failed | |
| `TxID txn_sim_…` | Simulated payment transaction ID | |

### 1.4 Order pipeline (statuses)

Full definitions, transitions and timings: [order-lifecycle.md](../05-processes/order-lifecycle.md).

| Dev label | Status key | Business meaning |
|---|---|---|
| Pipeline | — | The order's progress through its stages |
| `STAGED` | `PAYMENT_PENDING` | Awaiting payment |
| `PAYMENT_FAILED` | `PAYMENT_FAILED` | Payment failed; retry or cancel |
| `QUEUED` | `QUEUED` | Order received, waiting for the kitchen |
| `BAKING` | `BAKING` | In the oven |
| `QA_CHECK` | `QA_CHECK` | Quality check and packing |
| `DISPATCH_READY` | `READY_FOR_DISPATCH` | Packed, waiting for the courier |
| `READY_TO_PULL` | `READY_FOR_PICKUP` | Ready for pickup at the counter |
| `IN_TRANSIT` | `OUT_FOR_DELIVERY` | Courier on the way |
| `DEPLOYED` | `DELIVERED` | Delivered |
| `PULLED` | `PICKED_UP` | Picked up by the customer |
| `ROLLED_BACK` | `CANCELLED` | Cancelled (refunded if paid) |
| Rollback | — | Cancel an order |
| `ROLLBACK REJECTED` | — | The order can no longer be cancelled by the guest |
| `DEPLOYMENT_STATUS` / `track.log` | — | Order tracking page (SCR-09) |
| Live log / `stdout` / `bash — track.log` | — | The order's event log (`OrderLogEntry`) |
| Geolocation / live map | — | Simulated map with the courier's position |
| `ESTIMATED_ETA` | — | Estimated time until delivered / ready |
| `DISTANCE_REMAINING` | — | Remaining distance of the courier, in miles |
| `git show <hash>` | — | Order detail and receipt (SCR-13) |

### 1.5 Kitchen, couriers and simulation (seen by the guest)

The kitchen and the couriers have no screens in Lite. The guest meets these terms on the home page KPIs, on SCR-08 and SCR-09 and in the order log.

| Dev label / term | Business meaning | Where the guest sees it |
|---|---|---|
| Oven node, `OVEN_01` | Oven (`Oven`); two ovens with 3 slots each | Log line of T-08 (with the oven's target temperature), oven info on SCR-09 |
| Slot | One place in an oven; an oven bakes up to 3 orders at a time | Basis of the kitchen load |
| Queue position | Place of the guest's order among all `QUEUED` orders | SCR-08, SCR-09 (BR-SIM-16c) |
| Bake progress | Share of the bake time already done | SCR-09 stage 2 (BR-SIM-16b) |
| `DEPLOYED_TODAY` | Orders delivered or picked up today | Home KPI (SCR-01) |
| `AVG_PIPELINE_TIME` | Average time from payment to delivered or picked up, today | Home KPI (SCR-01) |
| `KITCHEN_LOAD` | Occupied oven slots / all slots of ONLINE ovens, e.g. `4/6 · 67%` | Home KPI (SCR-01, BR-SIM-16d) |
| `COURIERS_ON_DUTY` | Couriers that are not `OFF_DUTY` | Home KPI (SCR-01) |
| Courier node (`Marek // Moto-v3`) | Courier and their vehicle | Courier card on SCR-09 |
| `IDLE`, `EN_ROUTE_TO_STORE`, `WAITING_HANDOVER`, `IN_TRANSIT`, `RETURNING`, `OFF_DUTY` | Courier statuses (`CourierStatus`) | Data; the guest sees plain words on the courier card (BR-TRK-10) |
| Traffic generator | Creates simulated orders from simulated customers | Effects only: KPIs, queue position, ETA |
| Speed factor (`1×`, `2×`, `5×`, `10×`) | How fast simulated time runs; set by the constant `Simulation.SpeedFactor` | Effects only: durations and ETAs |

### 1.6 Errors

| Dev label | Business meaning |
|---|---|
| `ERROR 404 // CRUST_NOT_FOUND` | Page or record not found (SCR-40) |
| `ERROR 500 // SEG_FAULT` | Unexpected error (SCR-41) |
| `RETURN_TO_MAIN` | Go to the home page |
| `RETRY_DEPLOYMENT` | Retry the failed action / reload |
| Stack trace | Decorative technical text on error pages; never real error details |

---

## 2. Domain terms

| Term | Definition |
|---|---|
| Guest | Every visitor of the app, without an account (Mendix user role `Anonymous`). Can browse, order, pay (simulated) and track the order with a link or by order number + email. |
| Customer | In UI texts: the person who orders. In Lite this is always a guest. |
| Simulated customer | A fictional customer whose orders are created by the traffic generator (SIM-05). Their orders are never shown to guests. |
| Simulator | The system actor that performs simulated payment, kitchen progress, courier movement, pickup arrivals and order traffic. Shown in logs and history as `SIMULATOR`. |
| System | Timers and scheduled jobs: payment window timeout, seed, reset, housekeeping. Shown in history as `SYSTEM`. |
| Demo mode | The app is a demonstration: no real payment, food or courier. Shown by a permanent banner. |
| Demo reset | Restores all demo data to the initial seed (SIM-08): on first start, daily at 04:00 store time, and at a start with `Simulation.ResetOnStartup = true`. |
| Seed | The initial demo data defined in `09-demo-data/`. |
| Order type | DELIVERY (to an address in the delivery zone) or PICKUP (at the store). |
| Delivery zone | The ZIP codes the store delivers to, each with a distance in miles. |
| Intake | Whether the store accepts new orders. Always `OPEN` in Lite. |
| Configuration | The choices for one pizza: size, crust, sauce, cheese, extras, removed ingredients. |
| Default configuration | The pizza as listed on the menu: Medium size, default crust, sauce, cheese and full recipe. |
| Recipe item | A default ingredient of a pizza besides crust, sauce and cheese; removable or fixed. |
| Extra topping | An additional ingredient added for a price that depends on the pizza size. |
| Allergen | One of the 14 EU-regulated allergens. Shown per product and per configured line. |
| Dietary flags | Vegetarian and vegan, derived from all ingredients of a configuration. |
| Spice level | NONE, MILD, MEDIUM, HOT; a fixed product attribute. |
| Sold out | Not orderable today: set on a product, or caused by an out-of-stock fixed ingredient. In Lite these flags come from the seed and do not change at run time. |
| Subtotal | Sum of all line totals, before discount, fees, tax and tip. |
| Discount | Amount taken off the subtotal by an applied coupon. |
| Delivery fee | $3.99 for delivery; free from $40.00 subtotal or with a free-delivery coupon. |
| Sales tax | 8.625 % of subtotal minus discount. |
| Tip | Optional courier tip on delivery orders: 0, 10, 15 or 20 % of subtotal minus discount (default 15 %). |
| Total | Subtotal − discount + delivery fee + tax + tip. |
| Payment attempt | One simulated try to pay an order; max 3 per order. |
| Refund | Simulated full return of the paid total when a paid order is cancelled. |
| ETA | Estimated time when the order is delivered (delivery) or ready (pickup), based on compressed demo durations. |
| Kitchen load | Share of oven slots in use in the ONLINE ovens; shown as a home KPI. |
| Handover | The moment the courier takes the order from the dispatch shelf. |
| Tracking link | Unguessable link to an order's tracking page, given to the guest after ordering. |
| Speed factor | Multiplier that makes all simulated durations shorter (1×, 2×, 5×, 10×). |
| Traffic generator | Simulation that creates orders from simulated customers at a set interval. |
| Housekeeping | Automatic removal of finished simulated orders older than 24 hours. |
