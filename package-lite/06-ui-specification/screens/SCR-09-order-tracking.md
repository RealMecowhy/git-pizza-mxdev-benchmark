# SCR-09 — Order tracking (`DEPLOYMENT_STATUS`)

| Field | Value |
|---|---|
| Type | Page (inside SCR-16) — LIVE |
| Roles | G (tracking token, or an order placed or found in this session, LITE-SES-03) |
| MoSCoW | Must |
| Functional area / epic | FD-07 / EP-07 |
| Rules, processes | BR-TRK (FD-07), BR-ORD-08, BR-ORD-10, BR-ORD-20, order-lifecycle sections 2.1, 5, 6, 7.3; PR-02, PR-05, PR-06, PR-07; SIM-04, SIM-07 |
| Prototype | [SCR-09-order-tracking.html](../../08-prototype/customer/SCR-09-order-tracking.html) |
| Stitch reference | desktop [`desktop/order-status.jpg`](../../assets/stitch-reference/desktop/order-status.jpg) · phone [`mobile/delivery-status-mobile.jpg`](../../assets/stitch-reference/mobile/delivery-status-mobile.jpg) |
| Images | `illustrations/map-sf-dark.jpg` (present) under the map markers; icon `assets/icons/icon-ci-cd-pipeline.svg` in the stepper title |

## 1. Purpose

Let the customer watch their order live: a five-stage pipeline stepper, the live log, a simulated map with the courier and the ETA (delivery) or the ready time (pickup), the order summary, and — while still allowed — cancel ("rollback") the order.

## 2. Entry and exit

| Entry | Exit |
|---|---|
| `MONITOR PIPELINE →` / close on SCR-08; `./track.log` / tab `Trace` / sidebar `Active_Deployments` (navigation-map 3.4); tracking link (URL with `trackingToken`); SCR-10 found; SCR-13 `./track.log`; SCR-01 live build block; SCR-07 close in failed state | `View receipt` → SCR-13 · `Retry payment` → SCR-07 (failed state) · `git checkout menu` → SCR-02 · `git log --grep` (invalid link) → SCR-10 · `RETURN_TO_MAIN` (invalid link) → SCR-01 |

## 3. Layout (desktop)

| Region | Content |
|---|---|
| R1 Header | title, meta line, status badge, LIVE chip |
| R2 State banner | payment / cancelled / completed banner (when applicable) |
| R3 Left column (60 %) | pipeline stepper with progress bar; live log pane |
| R4 Right column (40 %) | delivery: map + courier + ETA/distance · pickup: store card + ready time; order configuration with total, receipt link, rollback block |

## 4. Elements

| ID | Element | Type | Content / data source | Behavior | Validation / rules |
|---|---|---|---|---|---|
| E-01 | Title | h1 | TXT-TRK-01 | | |
| E-02 | Meta line | text | TXT-TRK-02 with copy button for the hash | | |
| E-03 | Status badge | badge | dev label + plain label of `Order.status` (TXT-STAT-01 … 11) | live | |
| E-04 | LIVE chip | badge | TXT-TRK-03 | | hidden in final states |
| E-05 | Stepper | 5 nodes connected by lines, icons `inventory_2` (QUEUED), `local_pizza` (BAKING), `fact_check` (QA_CHECK), `local_shipping` / `storefront` (stage 4), `done_all` (stage 5) | title TXT-TRK-04; labels TXT-TRK-05 per order type; sub-labels TXT-TRK-06; state badges TXT-TRK-07. Completed nodes: fill `color.status.*` of their state + `check`; current node: outline + `glow.status*`; pending: `color.surface.highest`. | live. Stage mapping per order-lifecycle 2.1: QUEUED→1, BAKING→2, QA_CHECK→3, READY_FOR_DISPATCH/OUT_FOR_DELIVERY/READY_FOR_PICKUP→4, DELIVERED/PICKED_UP→5. A remake (T-13) moves the current node back to stage 1. | PAYMENT_PENDING/FAILED: no node reached. CANCELLED: frozen at the last reached stage, nodes after it greyed |
| E-06 | Stage progress | progress bar + caption | caption per state: TXT-TRK-08 (QUEUED, queue position per SIM-02 BR-SIM-16c, recalculated at least every 5 s), TXT-TRK-09 (BAKING, % = elapsed bake time / effective bake time, capped at 100 %, then the second form "Coming out of the oven"; SIM-02 BR-SIM-16b), TXT-TRK-10 (QA_CHECK, % = elapsed / qa), TXT-TRK-11 (READY_FOR_DISPATCH), TXT-TRK-12 (OUT_FOR_DELIVERY, % = `routeProgressPercent`), TXT-TRK-13 (READY_FOR_PICKUP) | bar animates between refreshes (`motion.duration.progress`) | hidden in final and payment states |
| E-07 | State banner | banner | PAYMENT_PENDING TXT-TRK-14 · PAYMENT_FAILED TXT-TRK-15 with buttons `Retry payment` (→ SCR-07 failed state) and `Cancel order` (confirm TXT-PAY-12, T-06; the page stays on SCR-09) and the line TXT-TRK-63 with the end of the payment window; after T-07 TXT-PAY-33 · CANCELLED TXT-TRK-16 composed of TXT-TRK-17/19 + TXT-TRK-20 if refunded (TXT-TRK-18 only for the seed order cancelled by the store; no new order is cancelled by the store in Lite) · DELIVERED TXT-TRK-21 · PICKED_UP TXT-TRK-22 | live | wording exactly as order-lifecycle section 5 |
| E-08 | Live log | terminal pane, 360 px high, internal scroll | title TXT-TRK-23; customer-visible `OrderLogEntry` lines of this order, oldest first, `[HH:mm:ss] [TAG] message`; prompt line TXT-TRK-24 with blinking cursor; empty TXT-TRK-25 | new lines appear within 5 s; auto-scroll only when at the bottom (README 3.3) | lines with `isCustomerVisible = false` never appear (A-72) |
| E-09 | Map (delivery) | panel with header TXT-TRK-26 + LIVE badge | background `illustrations/map-sf-dark.jpg`; markers (labels TXT-TRK-27): store (fixed position, label "Mission Kitchen"), destination (position per ZIP, label `{line1}`), courier marker (vehicle icon in a `color.primary.light` rounded square with `{nodeHandle}` label); route line `color.info.default` dashed from store to destination; travelled part solid | the courier marker is shown only from OUT_FOR_DELIVERY (BR-TRK-09, SIM-04): position = store→destination interpolated by `routeProgressPercent`, at the destination once DELIVERED; before OUT_FOR_DELIVERY no courier marker and the helper TXT-TRK-28. Movement between updates is animated linearly (reduced motion: jump). Zoom `+`/`−` buttons **may** be offered. | decorative map; no real map service |
| E-10 | ETA and distance | big value + label | TXT-TRK-29 (`typography.priceLarge`, `color.success.text`) and TXT-TRK-30 (OUT_FOR_DELIVERY) | countdown every second; recalculated every 5 s (order-lifecycle 7.3) | hidden in final states (show completion time in E-07 instead) |
| E-11 | Courier card | card | TXT-TRK-32 with the vehicle icon (TXT-STAT-28; no photo or portrait), courier status in plain words (TXT-STAT-27 plain) | appears when a courier is assigned | access rule: only name, node handle and vehicle of the own order's courier |
| E-12 | Pickup store card | card | TXT-CHK-18, TXT-CHK-19, TXT-TRK-31 (until ready); READY_FOR_PICKUP: TXT-TRK-13 and TXT-TRK-62 (BR-TRK-11) | | pickup orders instead of E-09 – E-11 |
| E-13 | Order configuration | card | TXT-TRK-33; lines TXT-TRK-57 with modifier chips (`+ Cherry tomatoes`, `− Fresh basil`, non-default crust/sauce/cheese), line totals; totals (subtotal, discount, fee, tax, tip) collapsed under `Show more`; `DEPLOYMENT_COST` TXT-TRK-34 = `Order.total`; payment method label (e.g. `Visa •••• 4242`) and payment status; delivery address (`line1`, `line2`, ZIP, city) or, for pickup, the store address (BR-TRK-12) | | snapshot values (BR-PRICE-12) |
| E-14 | Receipt link | link | TXT-TRK-35 | → SCR-13 | |
| E-15 | Rollback block | section with `warning` icon, title TXT-TRK-58 | QUEUED: button TXT-TRK-36 (danger) → confirm TXT-TRK-37 → T-09, toast TXT-TRK-38, page shows CANCELLED. BAKING/QA_CHECK: button disabled + TXT-TRK-39; READY_*: TXT-TRK-40; OUT_FOR_DELIVERY: TXT-TRK-41. | if the order moved on between opening and confirming the dialog, the cancel is rejected and the matching rejection text is shown as an error toast | BR-ORD-08. Hidden in PAYMENT_PENDING (no action), PAYMENT_FAILED (cancel is in E-07) and final states |
| E-16 | Guest link note | helper + copy | TXT-TRK-42, TXT-TRK-43 | | guests only |
| E-17 | Final actions | button | `git checkout menu` TXT-MENU-09 | | final states only |

## 5. States

The screen must render every `OrderStatus` (order-lifecycle section 6):

| State | Stepper | Banner (E-07) | Right column | Rollback (E-15) |
|---|---|---|---|---|
| PAYMENT_PENDING | no stage | TXT-TRK-14 | map without courier / pickup card | hidden |
| PAYMENT_FAILED | no stage | TXT-TRK-15 + Retry / Cancel | as above | hidden (cancel in banner) |
| QUEUED | 1 running | — | map: store + destination; ETA | enabled |
| BAKING | 2 running, bake % | — | ETA | disabled "already in the oven" |
| QA_CHECK | 3 running | — | ETA | disabled "already in the oven" |
| READY_FOR_DISPATCH | 4 running "Waiting for courier" | — | courier card once assigned; marker at/moving to the store | disabled "already packed" |
| READY_FOR_PICKUP | 4 running `READY_TO_PULL` | — | store card, ready time | disabled "already packed" |
| OUT_FOR_DELIVERY | 4 running "Courier on the way" | — | live map, ETA, distance | disabled "already on its way" |
| DELIVERED | 5 done | TXT-TRK-21 | map with marker at destination, no ETA | hidden; E-17 |
| PICKED_UP | 5 done | TXT-TRK-22 | store card | hidden; E-17 |
| CANCELLED | frozen | TXT-TRK-16 (+ reason, refund) | no ETA | hidden; E-17 |

Further states:

| State | What is shown |
|---|---|
| Rollback allowed | QUEUED as above |
| Rollback rejected | button disabled with the BR-ORD-08 text; or toast with that text after a lost race |
| Invalid or expired link | the whole content is replaced by TXT-TRK-44, TXT-TRK-45 and the buttons TXT-TRK-46 (→ SCR-10) and `RETURN_TO_MAIN` TXT-ERR-08 (→ SCR-01) (shell stays; BR-TRK-21) |
| Loading | skeletons for stepper, log and right column |
| Connection lost | shell banner; last known data stays visible |

## 6. Tablet and phone

Tablet: stepper full width horizontal, then map, log, order configuration. Phone (Stitch `delivery-status-mobile`): status line with `{orderNumber}` + copy and the status badge; map card with an overlay courier card (`{nodeHandle}`) and TXT-TRK-61; vertical stepper titled TXT-TRK-59 with one row per stage (label, state badge, sub-label); log collapsible TXT-TRK-60 (collapsed to the last 5 lines); order configuration; TXT-TRK-58 block with `ROLLBACK` button or `ROLLBACK REJECTED` notice.

## 7. Stitch reference and deviations

- Desktop stepper has 4 stages `Queued · Baking · Testing · Deployed` with flavor sub-labels `INIT_SUCCESS`, `COMPILING_CRUST`, `QA_PENDING`, `PROD_LIVE` → the five canonical stages with plain sub-labels (order-lifecycle 2.1 and 10: `DEPLOYED` means delivered).
- `UUID: 4f8e-92b1-…`, `TIMESTAMP 2024-10-24`, order `MX-554`, `OVEN-04`, `module.pepperoni_ext.v2 $24.99`, `<ThinCrust />`, `DEPLOYMENT_COST $28.42`, distances in KM, temperatures in °C, "Driver: v_driver_01", map of Warsaw/"Marszalkowska Ave", `Speed: 42 km/h` → real order data, miles, °F, courier node handles (`Marek // Moto-v3`), stylized San Francisco map.
- `OPEN_SUPPORT_TICKET`, `PULL COURIER`, `IPC CHAT` → **dropped** (out of scope).
- Phone `ROLLBACK / ABORT` + `ROLLBACK REJECTED — Order in physical flight (DISPATCH stage)` → `Rollback order` with the exact BR-ORD-08 texts.
- Phone `TLS 1.3 SECURED`, `NODE // WRO-04 → CLIENT` chips → dropped.
- Kept: `DEPLOYMENT_STATUS`, `LIVE PIPELINE MONITORING`, `Pipeline Workflow`, `bash — track.log — 80x24`, `Geolocation` + LIVE, `ESTIMATED_ETA`, `DISTANCE_REMAINING`, `Order Configuration`, `DEPLOYMENT_COST`, phone `Execution Graph · Stage 4/5`, `stdout --tail`, `UNSAFE OPERATIONS`.
