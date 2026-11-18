# SCR-13 — Order detail and receipt (`git show <hash>`)

| Field | Value |
|---|---|
| Type | Page (inside SCR-16) with a print layout |
| Roles | G via the order's tracking token or an order of the session, LITE-SES-03 ("View receipt" on SCR-09, "EXPORT RECEIPT" on SCR-08) |
| MoSCoW | Must |
| Functional area / epic | FD-09 / EP-09 |
| Rules, processes | BR-PRF (FD-09), BR-DATA-03 (snapshots), BR-PRICE-10 – 12, BR-PRICE-14, BR-ORD-10, information model section 10 (guests see time + status of history only) |
| Prototype | [SCR-13-order-detail-and-receipt.html](../../08-prototype/customer/SCR-13-order-detail-and-receipt.html) |
| Stitch reference | No Stitch design (history card style of [`desktop/developer-profile.png`](../../assets/stitch-reference/desktop/developer-profile.png)) |

## 1. Purpose

Read-only, complete record of one order — lines with every modifier, totals, payment and refund, destination, status history — usable as a printable receipt.

## 2. Entry and exit

| Entry | Exit |
|---|---|
| SCR-09 `View receipt`; SCR-08 `EXPORT RECEIPT` | `./track.log` → SCR-09 (open orders) · `Print receipt` → browser print · back |

An order the session holds no token for (LITE-SES-03) → SCR-40.

## 3. Layout (desktop)

| Region | Content |
|---|---|
| R1 Header | title `git show #{hash}`, sub-title, status badge, actions |
| R2 Left column | order lines; totals |
| R3 Right column | payment; destination or pickup; status history |

## 4. Elements

| ID | Element | Type | Content / data source | Behavior | Validation / rules |
|---|---|---|---|---|---|
| E-01 | Title | h1 | TXT-PRF-31 | | |
| E-02 | Sub-title | text | TXT-PRF-32 | | |
| E-03 | Status badge | badge | current status (dev + plain) | live while open | |
| E-04 | Order lines | list | per `OrderLine` (snapshot): `{qty}× {productName}` + `realWorldName`, `sizeLabel`, unit price, line total; modifier lines per `OrderLineModifier` TXT-PRF-57 (crust, sauce, cheese always listed; `+` extras with price; `−` removals); allergens line (TXT-STAT-37 names) | | values never change after placement (BR-DATA-03) |
| E-05 | Totals | label/value | subtotal, discount (`DISCOUNT ({couponCode})`), delivery fee (or `FREE_DISPATCH` with "threshold" / "coupon"), sales tax with `taxRatePercent`, tip with %, total | | labels as TXT-CHK-36 … 41 |
| E-06 | Payment | list | TXT-PRF-33 heading; one line per `PaymentAttempt` in order: TXT-PRF-34 (successful and failed attempts); refund line TXT-PRF-35 when refunded; `PaymentStatus` badge TXT-STAT-21 | | |
| E-07 | Destination / pickup | text | delivery: contact name, phone, address lines, delivery notes, zone `{zip} · {neighborhood} · {distance} mi`; pickup: store card text TXT-CHK-19 | | snapshot |
| E-08 | Status history | list | `OrderStatusChange` rows: `HH:mm:ss` + dev label + plain label (guests see time and status only, no actor or internal reason) | | |
| E-09 | Cancel note | banner | for CANCELLED: TXT-TRK-16 composition (who, reason, refund) | | |
| E-12 | `./track.log` | link | TXT-PRF-38 | → SCR-09 | open orders only |
| E-13 | `Print receipt` | secondary button | TXT-PRF-36 | opens the browser print dialog with the receipt layout: logo (`assets/brand/logo-mono-black.png`, 40 px high), store name, address and phone (`StoreSettings`), order number, hash, date, lines with modifiers, totals, payment and refund lines, footer TXT-PRF-37; no navigation, banners or buttons | print layout black on white |

## 5. States

| State | What is shown |
|---|---|
| Completed (DELIVERED / PICKED_UP) | all sections |
| Cancelled with refund | E-09 "You cancelled it. Refund of $X.XX issued to …" (the seed order cancelled by the store shows "The store cancelled it. Reason: …"); payment shows `REFUNDED` and the refund line |
| Cancelled without payment (T-04/T-06/T-07) | E-09 "Payment was not completed." / "You cancelled it."; attempts listed as FAILED |
| Open order | status badge live; E-12 visible |
| Loading | skeleton |

## 6. Tablet and phone

One column.

## 7. Stitch reference and deviations

No Stitch design. Content follows the information model snapshots; the look reuses the commit-card style of the profile design.
