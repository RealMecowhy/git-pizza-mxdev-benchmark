# 08 — Clickable HTML prototype

The prototype shows every screen of the screen inventory (`01-product-brief/ids-and-traceability.md`, section 4) as clickable HTML: layout, navigation, texts, dev labels and the mandatory states. Start at [`index.html`](index.html): it links every screen and the main guest journeys.

The app has one kind of user: the **guest** (role `Anonymous`). There are no accounts, no sign-in, no profile, no saved addresses and no staff screens. Kitchen, couriers and order traffic are run by the simulation.

| Part | Folder | Screens |
|---|---|---|
| Guest screens | `customer/` | SCR-01 – SCR-10, SCR-13, SCR-16 |
| Error pages | `customer/` | SCR-40, SCR-41 |

**The prototype is a visual reference only.** It does not define behavior. When it disagrees with the specification, the specification wins (`00-README.md`, section 6.5: foundation → `02-functional-design/` → `03-user-stories/` → `06-ui-specification/` → `08-prototype/`). Exact UI texts are owned by `06-ui-specification/ui-copy.md`.

---

## How to open

1. Open `08-prototype/index.html` in a current Chrome, Edge, Firefox or Safari, then follow a link. Double-clicking the file works (`file://`); serving the package folder with any static web server works too (for example `npx serve <package folder>` and open `/08-prototype/`). Keep the folder structure: pages load images from `../../assets/` and the shared files from `customer/_shared/`.
2. An internet connection is needed for the fonts (JetBrains Mono, Geist) and the Material Symbols icons from Google Fonts. Without it the pages still work with fallback fonts and the icon names show as text.
3. To see the phone layout, make the browser window narrower than 768 px or use the browser's device emulation (reference width 390 px). Tablet layout: 768–1199 px; desktop: 1200 px and wider.

## Phone layouts: one responsive page per screen

Each screen is **one responsive HTML page** that changes layout at the breakpoints in `07-design-system/tokens.md` (section 5). There are no separate phone pages. This mirrors the target: one responsive Mendix web app, where the Stitch mobile screens are the phone layout of the same screen.

| Element | Desktop ≥ 1200 px | Tablet 768–1199 px | Phone < 768 px |
|---|---|---|---|
| Header | Horizontal logo (`logo-horizontal.svg`), nav `./main.js` `./menu.ts` `./checkout.yml` `./track.log`, `grep` search, cart | Same, search from 1024 px | Logo mark (`logo-mark.svg`), cart; nav moves to the bottom tabs |
| Project Explorer sidebar | 256 px, sticky | hidden | hidden |
| Bottom tabs `Source · Deploy · Trace` | — | — | fixed at the bottom |
| Menu "Terminal Debugger" cart panel | 320 px right panel | hidden | sticky cart bar `PACKAGE_RESOLVED … deploy >` |
| Cart (SCR-05) | 480 px drawer | 480 px drawer | full width |
| Modals SCR-04, SCR-07 | centered | centered | bottom sheet |
| Confirmation SCR-08 | centered modal | centered modal | full screen |
| Configurator / checkout CTA | inside the page | inside the page | sticky bar above the bottom tabs |
| Tracking (SCR-09) | stepper horizontal, map + order panel right | single column | single column, vertical stepper |
| Error pages (SCR-40, SCR-41) | minimal frame: DEMO MODE banner + logo, no navigation | same | stack trace collapsed to 3 lines with `Show more`, buttons full width |

## Screens

| ID | File | Dev label | Stitch reference used | Notes |
|---|---|---|---|---|
| SCR-01 | `customer/SCR-01-home.html` | `./main.js` | `desktop/home` | Hero with the logo mark, typing terminal, featured carousel (6 featured pizzas from the catalog), KPIs `DEPLOYED_TODAY`, `AVG_PIPELINE_TIME`, `KITCHEN_LOAD` (format `busy/slots · %`, e.g. `3/6 · 50%` right after a reset), `COURIERS_ON_DUTY`, live build status of the guest's active order |
| SCR-02 | `customer/SCR-02-menu.html` | `./menu.ts` | `desktop/menu-and-cart`, `mobile/menu-mobile` | File tabs `pizzas.json` `sides.yml` `drinks.env` `desserts.md`, search, code-block cards, `+ import`, configure, `module.info`, Terminal Debugger panel, allergen notice; Tiramisu Stack sold out (seed) |
| SCR-03 | `customer/SCR-03-pizza-configurator.html?p=PZ-05` | `configure_module.ts` | `desktop/module-configurator` (branding fixed), `mobile/configurator-mobile` | Size, crust, sauce, cheese, removable default ingredients (`unlink`), extras with size prices and max count, live price, allergens, diet flags, `manifest.json` preview, edit mode for a cart line; jalapeños out of stock (seed) |
| SCR-04 | `customer/SCR-04-item-info.html?p=SD-01` | `module.info` | none | Details, serving, calories, caffeine, allergens, quantity, add to cart |
| SCR-05 | `customer/SCR-05-cart.html` | `MANIFEST.LOCK` | `desktop/cart-manifest-modal` | Lines with modifiers, quantity, edit, `rm`, coupon with every guest coupon message, free-delivery and minimum notes, `CLEAR (rm -rf)`, empty state |
| SCR-06 | `customer/SCR-06-checkout.html` | `checkout_config.json` | `desktop/delivery-and-payment`, `mobile/checkout-payment-mobile` | Delivery / pickup, `.env` address fields typed for this order, live delivery-zone check, contact, payment method and the five demo test cards, tip, summary, `Execute Order --force` |
| SCR-07 | `customer/SCR-07-payment-sheet.html` | `PAYMENT_PROTOCOL` | payment block of `mobile/checkout-payment-mobile` | Processing, outcome by test card, failure with method re-selection, retry (max 3), cancel, third failure rolls the order back |
| SCR-08 | `customer/SCR-08-order-confirmation.html` | `DEPLOYMENT SUCCESSFUL // 200 OK` | `desktop/order-deployed-modal` | Commit hash with copy, order number, queue position, ETA countdown, `HARDWARE_CLUSTER` without oven name (A-74), payment reference, first log lines, tracking link, `MONITOR PIPELINE →` |
| SCR-09 | `customer/SCR-09-order-tracking.html` | `DEPLOYMENT_STATUS` | `desktop/order-status`, `mobile/delivery-status-mobile` | Five-stage stepper (delivery / pickup), queue position, bake progress, live log, simulated map with courier, ETA, distance, order summary, `Rollback order` with rejection messages, cancelled and payment banners |
| SCR-10 | `customer/SCR-10-track-order-lookup.html` | `git log --grep` | none | Order number + email lookup, not-found message |
| SCR-13 | `customer/SCR-13-order-detail-and-receipt.html` | `git show <hash>` | none | Lines with every modifier, totals, payment, status history (time + status), print; reached from SCR-08 and SCR-09 |
| SCR-16 | `customer/SCR-16-customer-shell.html` | — | header/sidebar of `desktop/menu-and-cart`, bottom bar of `mobile/menu-mobile` | Reference page for the shell; the shell itself is on every guest page |
| SCR-40 | `customer/SCR-40-not-found.html` | `ERROR 404 // CRUST_NOT_FOUND` | `desktop/system-error` (branding replaced) | Logo, error code, explanation, decorative stack trace with the requested path (`?what=<path>`), resolution, `RETURN_TO_MAIN`, `./track.log`, status strip |
| SCR-41 | `customer/SCR-41-unexpected-error.html` | `ERROR 500 // SEG_FAULT` | `desktop/system-error` (branding replaced) | Same layout; `RETRY_DEPLOYMENT` (reloads the page), `RETURN_TO_MAIN` |

Shared files: `customer/_shared/proto.css` (design tokens as CSS variables, components, error-page layout) and `customer/_shared/proto.js` (catalog data copied from `09-demo-data/menu-catalog.md`, the price rules BR-PRICE-01 … 11, the seed orders, prototype state, the shell, toasts and the prototype controls).

## Prototype controls and states

Every page has a dashed, light **◧ Prototype** button at the bottom left. It is **not part of the app**. It opens a panel with:

- **Screen states** — the mandatory states of that screen from the screen inventory (for example SCR-09: every `OrderStatus`, rollback allowed / rejected, cancelled by the guest, invalid link). A state preset may create demo data (a sample cart, a paid guest order of this session) so the state can be shown.
- **Cart** — empty, worked example A (`$55.50`), example B with `GITHUB_STUDENT`, below the $15.00 delivery minimum.
- **Stock** — a note only: stock is fixed by the demo seed (Tiramisu Stack sold out, jalapeños out of stock) and nobody changes it while the app runs.
- **Simulation speed** — 1× / 2× / 5× / 10×, like the constant `Simulation.SpeedFactor` (`10-simulations/lite-configuration.md`).
- **Reset prototype data** (prototype only; the app itself resets on startup and daily at 04:00).

Pages also accept `?state=<state>` in the URL (the index uses this).

## Journeys to click through

| Journey | Start | Path |
|---|---|---|
| Guest order, delivery | `index.html` → "Guest order" | Home → `git checkout menu` → configure Inferno Payload (Large, + 'Nduja; jalapeños are out of stock) → `Build & Deploy` → cart → apply `GITHUB_STUDENT` → `PROCEED TO ./checkout.yml` → delivery address in 94105, contact, `Visa •••• 4242`, tip 15 % → `Execute Order --force` → payment → confirmation (queue position) → `MONITOR PIPELINE →` → tracking runs through `QUEUED … DEPLOYED` in about 6 minutes at 1× |
| Failed payment | "Failed payment and retry" | Pre-filled checkout → choose `Visa •••• 0002` → `ERROR 402` → choose Apple Pay → `Retry payment` → confirmation |
| Guest pickup | "Guest pickup" | Checkout with `PICKUP` → payment → confirmation → tracking until `PULLED` |
| Lookup | `./track.log` or "Find an order" | Order number + email (an order of this session, or the seed order `MX-1018` with `jordan.lee@example.com`) → tracking → `View receipt` |
| Error pages | "Error pages" | `ERROR 404 // CRUST_NOT_FOUND` → `RETURN_TO_MAIN` or `./track.log`; SCR-41 → `RETRY_DEPLOYMENT` |

The price calculation in the prototype reproduces the worked examples A–D of `04-information-model/information-model.md` section 6.1 to the cent ($68.62, $26.58, $30.99, $20.36).

## Known simplifications

| # | Simplification | What the real app must do |
|---|---|---|
| 1 | All data lives in the browser's local storage (key `gitpizza-proto-lite-v1`). Nothing is shared between browsers. | One shared database. |
| 2 | The order simulation is computed in the page from elapsed time (durations of `order-lifecycle.md` 7.1, speed selector 1× / 2× / 5× / 10×). The courier is always `Marek // Moto-v3`, the oven always `OVEN_01::CORE`; the queue position is 2 at payment and 1 after half of `queueWait`; there is no competing traffic and no QA failure. | SIM-01, SIM-02, SIM-04 … SIM-09 as specified in `10-simulations/`, with real oven and courier assignment (BR-ORD-11, BR-ORD-16), queue position BR-SIM-16c and bake progress BR-SIM-16b. |
| 3 | Payment processing always takes 3 s (10 s for `AMEX_0005`) and ignores the speed factor. | BR-ORD-04, order-lifecycle 7.2. |
| 4 | The map uses the base image `illustrations/map-sf-dark.jpg`; marker positions are approximate and the courier moves along a straight line. | Stylized map with store, destination, route and moving courier marker. |
| 5 | All 25 product photos and the empty-state and error illustrations are shown. Only `illustrations/no-results.png` (SCR-02 no search results) is missing and shows the `IMAGE_PENDING // <file>` placeholder from `assets/README.md` section 2. | Show the placeholder (or leave the illustration out) until the image exists. |
| 6 | The seed orders (MX-1001 … MX-1018 and the active MX-1040, contact Jordan Lee) are copied from `09-demo-data/orders.json` as guest orders; they are not in the guest session and are found on SCR-10 only. Orders placed in the prototype start at MX-1047, like the first order after a reset. Totals are recalculated by the prototype and may differ by a cent where the prototype simplifies a rule. | The binding seed is `09-demo-data/`. |
| 7 | Home KPIs are static: the values of the seed right after a reset (`DEPLOYED_TODAY` 7, `AVG_PIPELINE_TIME` 05:07, `KITCHEN_LOAD` 3/6 · 50%, `COURIERS_ON_DUTY` 4; one of the five courier icons stays unlit because CU-05 is off duty). | Live values computed on the server from the demo data (US-023, BR-SIM-16d). |
| 8 | Some validation details not fixed by the foundation are illustrative (phone digits, address fields). | Rules and messages in `02-functional-design/` and `06-ui-specification/ui-copy.md`. |
| 9 | Receipts recalculate line prices from the catalog (which does not change in the prototype). | Receipts always show the price snapshot (BR-PRICE-12, BR-DATA-03). |
| 10 | Live refresh is a 1-second timer on the page. | Any Mendix-feasible mechanism meeting the 5-second rule (BR-ORD-20). |
| 11 | Tablet layout hides the sidebar completely; there is no `menu` button that opens it as a drawer. | Tablet: sidebar hidden and opened as an overlay drawer by the `menu` button in the header (`06-ui-specification/responsive-behaviour.md`, FD-01 4.1 step 3). |
| 12 | Session expiry and offline / refresh failure notices are not shown. SCR-40 is opened for an unknown receipt or product link; SCR-41 only from the index. | LITE-SES rules (`04-information-model/information-model.md` section 2), FD-15. |
| 13 | "Print receipt" uses the browser print dialog with a simple print style. | Printable receipt as specified for SCR-13. |
