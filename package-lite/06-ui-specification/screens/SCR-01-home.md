# SCR-01 — Home (`./main.js`)

| Field | Value |
|---|---|
| Type | Page (inside SCR-16) |
| Roles | G |
| MoSCoW | Must |
| Functional area / epic | FD-02 / EP-02 (featured modules), FD-07 / EP-07 (live build status) |
| Rules, processes | BR-PRICE-01, BR-DATA-12, BR-ORD-20, PR-01, SIM-02 BR-SIM-16d (kitchen load) |
| Prototype | [SCR-01-home.html](../../08-prototype/customer/SCR-01-home.html) |
| Stitch reference | desktop [`desktop/home.jpg`](../../assets/stitch-reference/desktop/home.jpg) · phone: no design (derive from [`mobile/menu-mobile.jpg`](../../assets/stitch-reference/mobile/menu-mobile.jpg)) |
| Images | logo mark [`assets/brand/logo-mark.svg`](../../assets/brand/logo-mark.svg); product photos `assets/products/` (all present); brand icons `assets/icons/` |

## 1. Purpose

Landing page: introduce the brand and the idea ("Architect Your Perfect Crust"), send people to the menu in one click, show the featured modules, show real demo activity, and — if the viewer has an open order — its live build status.

## 2. Entry and exit

| Entry | Exit |
|---|---|
| App URL; logo; `./main.js`; sidebar `Root`; `RETURN_TO_MAIN` | `git checkout menu` → SCR-02 · `./track.log` CTA → navigation-map 3.4 · featured card → SCR-03 (pizza `Configure`) or SCR-04 (info) · `+ import` → stays, toast · live build block → SCR-09 · shell links |

## 3. Layout (desktop)

| Region | Content |
|---|---|
| R1 Hero (centered, background `color.overlay.grid` 32 px grid with a soft orange/green radial glow as in Stitch) | status chip, logo mark 240 px, headline, paragraph, terminal window, two CTAs |
| R2 Pipeline strip | three steps with brand icons: import → deploy → track |
| R3 Featured modules | heading, sub-heading, carousel arrows, carousel |
| R4 Demo KPIs | 4 tiles |
| R5 Live build status | shown only with an open order of the session |

## 4. Elements

| ID | Element | Type | Content / data source | Behavior | Validation / rules |
|---|---|---|---|---|---|
| E-01 | Status chip | badge with dot | TXT-MENU-01 with a green dot (`StoreSettings.intakeStatus` is always OPEN in Lite) | static | |
| E-02 | Logo | image | `assets/brand/logo-mark.svg`, 240 × 240 px (tablet 128 px, phone 96 px), no glow (logo-usage.md 5, 8) | none | alt "Git Pizza MxDev logo" |
| E-03 | Headline | h1, `typography.display` | TXT-MENU-02 | | exactly one h1 on the page |
| E-04 | Paragraph | text, `typography.bodyLong` (Geist) | TXT-MENU-03 | | |
| E-05 | Terminal intro | terminal pane, 600 px wide | title TXT-MENU-04; lines TXT-MENU-05 … 08 | Line 1 is "typed" character by character (≈ 40 ms per character) on first visit in the session, lines 2–4 appear 300 ms apart, then a blinking cursor. Later visits in the same session show all lines at once. Values are live data at page load (`{n}` published products, `{s}` not orderable, intake status). | reduced motion: all lines at once, static cursor |
| E-06 | CTA `git checkout menu` | primary button with `glow.primaryLarge` | TXT-MENU-09 | → SCR-02 | |
| E-07 | CTA `./track.log` | secondary (outline) button | TXT-MENU-10 | navigation-map 3.4 | |
| E-08 | Pipeline strip | 3 tiles | icons `assets/icons/icon-pizza-module.svg`, `icon-terminal-cli.svg`, `icon-ci-cd-pipeline.svg`; captions TXT-MENU-57 | decorative; not interactive | **should** |
| E-09 | Featured heading | h2 + text | TXT-MENU-11, TXT-MENU-12 | | |
| E-10 | Carousel navigation | position counter + pixel pager + 2 icon buttons `chevron_left` / `chevron_right` (44 × 44, 1 px `color.primary.default` border, `color.primary.subtle` fill, icon `color.primary.light`; hover filled `color.primary.default` with `glow.primaryMedium`; disabled: `color.border.default` border, no fill, icon `color.text.disabled`). Counter TXT-MENU-62 above a pager of one 10 px square per card (cards in view `color.primary.default`, others `color.surface.highest`). Phone: no arrows; pager and counter centered under the carousel (these are the "position dots" of the responsive note) | a11y TXT-MENU-13; the counter is a polite live region | scroll the carousel by one card (also Left / Right arrow keys when the carousel has focus); disabled at the ends | |
| E-11 | Featured carousel | list of product cards | products with `isFeatured = true` and `status = PUBLISHED`, max 6, by category order then `sortOrder` (seed: PZ-01, PZ-02, PZ-03, PZ-04, PZ-05, PZ-10). First card large (image left, code block right, as Stitch), others small. Desktop shows 3 cards and a quarter of the next one; the edge where more cards follow fades out over 72 px (48 px on the start side once scrolled; phone 40 / 24 px), so the row reads as scrollable. | card content = SCR-02 product card (SCR-02/E-08) incl. `+ import`, `Configure`, info, sold-out state | if no featured product is published, R3 is hidden |
| E-12 | KPI tiles | **Pixel board** (owner decision 2026-11-07): 4 tiles (`color.surface.low`, 1 px `color.border.default`, `radius.md`), desktop widths 1.4 : 1 : 1 : 1. Each tile: header with a Material Symbols icon in `color.primary.default` (`rocket_launch`, `timer`, `local_fire_department`, `electric_moped`) and the label `typography.micro`; value `typography.priceLarge` `color.primary.default` (for `KITCHEN_LOAD` the part after the `/` in `color.text.muted`); an indicator under the value: `DEPLOYED_TODAY` — a grid of 40 square pixels (20 × 2), one lit pixel (`color.primary.default`) per order, the newest pixel `color.primary.light`; above 40 orders one pixel stands for ⌈n / 40⌉ orders; scale line TXT-MENU-61; the tile header also shows TXT-GEN-09 `LIVE` with the live dot (phone: the dot only). `AVG_PIPELINE_TIME` — decorative strip of the 5 stepper stages (order-lifecycle 2.1) with their labels (labels hidden on phone). `KITCHEN_LOAD` — one square per oven slot of the ONLINE ovens (seed: 6), lit `color.primary.default` while an order bakes in it, otherwise `color.surface.highest`; from 85 % the lit squares turn `color.error.default` and the chip `HEAVY` (TXT-MENU-63) follows the value. `COURIERS_ON_DUTY` — one unit icon per courier, lit `color.success.text` when on duty, otherwise `color.surface.highest`. Indicators are `aria-hidden`; each tile is a group whose accessible name is the plain label of TXT-MENU-14 with the value | TXT-MENU-14 labels; values: `DEPLOYED_TODAY` = count of orders that reached DELIVERED or PICKED_UP since 00:00 store time; `AVG_PIPELINE_TIME` = mean of (`completedAt` − `paidAt`) of those orders as `mm:ss`; `KITCHEN_LOAD` = TXT-MENU-63 `{baking}/{slots} · {p}%`, where `{baking}` = Σ `ordersBaking` and `{slots}` = Σ `capacityOrders` of the ONLINE ovens and `{p}` = the ratio as a whole percentage (SIM-02 BR-SIM-16d, information model 7.2; e.g. `3/6 · 50%`); `AVG_PIPELINE_TIME` is rounded half up to whole seconds; `COURIERS_ON_DUTY` = number of couriers not OFF_DUTY (`CU-05` is always OFF_DUTY). Seed right after a reset: `7`, `05:07`, `3/6 · 50%`, `4` | live (≤ 10 s, NFR-07; BR-MENU-17); TXT-MENU-15 `—` when there is no value (A-73) | **must** (US-023). Computed on the server: the guest receives only the four values, never the orders behind them (LITE-SEC-02) |
| E-13 | Live build status | card | heading TXT-MENU-17 for the session's open order (placed or tracked in this session, LITE-SES-03; with several, the most recently placed); mini pipeline with the 5 stages of order-lifecycle 2.1 and a progress bar; ETA TXT-MENU-18; last 3 customer-visible log lines; link TXT-MENU-19 | live (≤ 10 s, NFR-07, BR-MENU-18); click anywhere → SCR-09; final state shown for 60 s (section 5) | hidden when there is no such order |

## 5. States

| State | What is shown |
|---|---|
| Default (guest, no open order) | R1 – R4; R5 hidden |
| With active order | R5 visible with the current stage highlighted; when the order reaches a final state, R5 shows the final badge for 60 s and then disappears |
| Loading | hero renders immediately; carousel and KPI tiles show skeletons |
| Featured item sold out | card shows the sold-out state of SCR-02 (dimmed image, `404: OUT_OF_STOCK`, disabled `+ import`) |
| KPI error | a tile whose value cannot be loaded shows `—`; the page does not fail |

## 6. Tablet and phone

Tablet: sidebar hidden, opened as an overlay drawer by the `menu` button in the header (`responsive-behaviour.md`); carousel shows 2 cards; KPI 2 × 2. Phone: hero left-aligned, logo mark 96 px, terminal full width (font `typography.codeSmall`), CTAs full width stacked; carousel 1 card per view with swipe and position dots; pipeline strip stacked; KPI 2 × 2; R5 stacked.

## 7. Stitch reference and deviations

- Stitch hero chip "Production Environment Ready" → TXT-MENU-01 (`PIPELINE_OPEN`; Lite has no intake pause).
- Stitch paragraph "Pizza MxDev is the first high-performance pizza engine…" → TXT-MENU-03 (brand name fixed).
- Stitch terminal `npm install … added 42 packages … Pizza MxDev v4.2.0 installed` → TXT-MENU-05 … 08 with live counts.
- Stitch secondary CTA `read --docs` led nowhere → `./track.log`.
- Stitch featured cards show invented content (`<Essential />` badge, base 'Sourdough' for The Root Pizza, `#HotHoney #Spicy` hashtags, "Import Module" button, card photos with screenshots inside). Authoritative: card content from SCR-02/E-08 and the menu catalog (The Root Pizza has crust Neapolitan Core, badge `<Classic />`).
- Stitch KPIs `99.9% Uptime Delivery`, `<30m Compile Time`, `12k+ Nodes Active`, `0 Fatal Exceptions` are invented → real demo KPIs (A-73): `DEPLOYED_TODAY`, `AVG_PIPELINE_TIME`, `KITCHEN_LOAD`, `COURIERS_ON_DUTY`.
- Stitch "Live Build Status: Order #MX-9921" with stages Init · Compile · Bake (75%) · Deploy and °C temperatures → five canonical stages (order-lifecycle 2.1), °F, shown only for an open order of the session.
