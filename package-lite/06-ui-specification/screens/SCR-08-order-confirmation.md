# SCR-08 — Order confirmation (`DEPLOYMENT SUCCESSFUL // 200 OK`)

| Field | Value |
|---|---|
| Type | Modal 640 px over a dimmed page with the `color.overlay.grid` background (phone: full-screen page) |
| Roles | G (own order, once after T-02) |
| MoSCoW | Must |
| Functional area / epic | FD-06 / EP-06 |
| Rules, processes | T-02, BR-ORD-07, order-lifecycle 7.3 (ETA), PR-01, PR-03 |
| Prototype | [SCR-08-order-confirmation.html](../../08-prototype/customer/SCR-08-order-confirmation.html) |
| Stitch reference | desktop [`desktop/order-deployed-modal.jpg`](../../assets/stitch-reference/desktop/order-deployed-modal.jpg) · phone: no design |
| Images | logo mark `assets/brand/logo-mark.svg` (64 px in the 88 px success tile, header; replaces the Stitch `</>` icon) |

## 1. Purpose

Confirm that the order is placed and paid, give the customer its references (order number, commit hash, payment transaction, tracking link for guests), the ETA and the first log lines, and send them to live tracking.

## 2. Entry and exit

| Entry | Exit |
|---|---|
| Automatically when the payment of the order succeeds (T-02) while SCR-07 is open | `MONITOR PIPELINE →` → SCR-09 · `EXPORT RECEIPT` → SCR-13 · close icon / `Esc` → SCR-09 |

It is shown once per order. Reloading the page or returning later shows SCR-09 instead. If the payment succeeds after the customer closed SCR-07 (not possible in normal flows), SCR-09 shows the confirmation details instead.

## 3. Layout

Centered: success icon with `glow.primaryLarge`, headline block; a 2 × 2 grid of info tiles (order + hash, ETA, oven/cluster, payment); guest tracking-link block; log block `PIPELINE_STREAMS // STDOUT` with LIVE indicator; footer buttons.

## 4. Elements

| ID | Element | Type | Content / data source | Behavior | Validation / rules |
|---|---|---|---|---|---|
| E-01 | Success icon | icon `check_circle` 64 px in `color.success.default` with `glow.success` | | appears with a 320 ms scale-in (none with reduced motion) | |
| E-02 | Headline | h1 | TXT-PAY-17 | | focus starts here; announced to screen readers |
| E-03 | Stage line | label | TXT-PAY-18 | | |
| E-04 | Body | text | TXT-PAY-19 (queue position at T-02, SIM-02 BR-SIM-16c) | | |
| E-05 | Order tile | tile | TXT-PAY-20 `ORDER MX-1052`, TXT-PAY-21 `DEPLOYMENT_HASH #a3f9c2e`, TXT-PAY-22 copy | copy → toast TXT-GEN-11 | |
| E-06 | ETA tile | tile with `schedule` icon | TXT-PAY-23 (delivery) or second form (pickup); destination TXT-PAY-32 | countdown ticks every second; recalculated every 5 s | order-lifecycle 7.3 |
| E-07 | Cluster tile | tile with `local_fire_department` icon | TXT-PAY-24 | live | A-74 |
| E-08 | Payment tile | tile with `verified_user` icon | TXT-PAY-25: method, `PAID`, `PaymentAttempt.transactionId` | | |
| E-09 | Tracking link | block | TXT-PAY-27, the full tracking URL (with `Order.trackingToken`), TXT-PAY-28, TXT-PAY-29 | copy → toast TXT-GEN-11 | always shown (every order in Lite is a guest order) |
| E-09a | Demo note (guest) | helper under E-09 | TXT-CHK-57 "We use your email only to let you look up this order. No emails are sent in this demo." | | guests only; no email or SMS is sent (US-110) |
| E-10 | Log block | terminal pane, LIVE | TXT-PAY-26; the customer-visible `OrderLogEntry` lines of this order so far (at least TXT-LOG-01 … 04) | new lines appear live | |
| E-11 | `MONITOR PIPELINE →` | primary button | TXT-PAY-30 | → SCR-09 | |
| E-12 | `EXPORT RECEIPT` | secondary button with `receipt_long` icon | TXT-PAY-31 | → SCR-13 (receipt view) | |

## 5. States

| State | What is shown |
|---|---|
| Default (delivery) | all elements |
| Pickup | E-06 shows `ESTIMATED_READY` and `PICKUP → 2140 Folsom Street` |
| Order advanced while open (e.g. BAKING) | E-03 stays `BUILD QUEUED` (it confirms the placement), E-10 shows new log lines |

## 6. Tablet and phone

Tablet: same modal. Phone: full-screen page; tiles stacked; buttons full width at the bottom (primary first).

## 7. Stitch reference and deviations

- `BUILD SUCCEEDED // STAGE: BAKING_INITIALIZED` → `BUILD QUEUED // STAGE: QUEUED` (after payment the order is QUEUED, not baking).
- `DEPLOYMENT_HASH: 0x8f2a44b1c90e77d2` (16 hex) → 7-character commit hash `#a3f9c2e` (`Order.commitHash`) plus the order number.
- `ETA: 24m 12s` → compressed demo ETA (A-04).
- `HARDWARE_CLUSTER Oven Node #02 · 450°C · Chamber load 62%` → TXT-PAY-24 (no oven before baking; °F; thermal load from the information model).
- `TX_PROTOCOL BLIK_TOKEN … blik_9921e4a_settled` → method of the order and `txn_sim_…` transaction ID.
- Log lines (signed with client private key, Oven Daemon 450°C, courier assigned at payment) → the order's real log (TXT-LOG-…).
- `OBSERVABILITY_DISPATCH` (SMS / Webhook, `ATTACH LISTENER`) → **dropped** (out of scope).
- Left decorative code panel `MODULE: CrustCompiler.rs` and `METRICS_SNAPSHOT` → dropped.
- Kept: `DEPLOYMENT SUCCESSFUL // 200 OK`, `COPY HASH`, `EXPORT RECEIPT`, `MONITOR PIPELINE TRACE ->` (as `MONITOR PIPELINE →`), `PIPELINE_STREAMS // STDOUT` with LIVE.
