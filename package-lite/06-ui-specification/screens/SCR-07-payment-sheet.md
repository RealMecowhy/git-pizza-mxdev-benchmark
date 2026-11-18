# SCR-07 — Payment sheet (`PAYMENT_PROTOCOL`, simulated)

| Field | Value |
|---|---|
| Type | Modal 560 px (phone: bottom sheet) |
| Roles | G (own order only) |
| MoSCoW | Must |
| Functional area / epic | FD-06 / EP-06 |
| Rules, processes | BR-PAY (FD-06), BR-ORD-04, BR-ORD-05, BR-ORD-06, BR-ORD-07, BR-PRICE-12, T-01 – T-07, PR-03, SIM-01 |
| Prototype | [SCR-07-payment-sheet.html](../../08-prototype/customer/SCR-07-payment-sheet.html) |
| Stitch reference | No Stitch design (payment block of [`mobile/checkout-payment-mobile.jpg`](../../assets/stitch-reference/mobile/checkout-payment-mobile.jpg) and its `stdout / deploy` terminal as visual reference) |

## 1. Purpose

Show the simulated payment of a just-created order: processing, then success (hand-off to SCR-08) or a realistic failure. After a failure, let the customer choose another method or test card and retry (max 3 attempts in total) or cancel. After the third failure, explain that the order was rolled back.

## 2. Entry and exit

| Entry | Exit |
|---|---|
| `Execute Order --force` on SCR-06 (attempt 1, T-01); `Retry payment` on the PAYMENT_FAILED banner of SCR-09 (opens directly in the failed state) | success → SCR-08 replaces the sheet (T-02) · `Cancel order` + confirm → SCR-05 with toast TXT-PAY-16 (T-06) · failed state close icon → SCR-09 of the order (stays PAYMENT_FAILED) · third failure `Back to manifest` → SCR-05 (T-04) |

## 3. Layout

Header (title, sub-title, close icon — hidden while processing), body (state content), footer (buttons per state).

## 4. Elements

| ID | Element | Type | Content / data source | Behavior | Validation / rules |
|---|---|---|---|---|---|
| E-01 | Title | heading | TXT-PAY-01 | | accessible name "Payment" |
| E-02 | Sub-title | text | TXT-PAY-02 (`Order.orderNumber`, `Order.total`, method of the current attempt) | | total equals the order total on every attempt (BR-PRICE-12) |
| E-03 | Processing block | spinner + terminal lines | TXT-PAY-03, TXT-PAY-04, the request lines TXT-PAY-35 appearing one after another, log lines TXT-LOG-01, TXT-LOG-02 (and TXT-LOG-08 on retries) appearing as they are written; TXT-PAY-05 after 3 s; TXT-PAY-06; on success the line TXT-PAY-36 `200 OK · TxID {transactionId}` for about 1 s before SCR-08 opens (SIM-01) | waits for the attempt result (SIM-01: `paymentProcessing` 3 s; `AMEX_0005` waits `paymentTimeout` 10 s; both divided by the speed factor) and switches state within 2 s of the result | sheet cannot be closed (`Esc`, scrim and back are ignored) |
| E-04 | Failure block | error panel `color.error.subtle`, icon `error` | TXT-PAY-07, TXT-PAY-08 with the failure text of the attempt (TXT-STAT-26), TXT-PAY-09 | | |
| E-05 | Method re-selection | same controls as SCR-06/E-11 and E-12 | preselected: the method/card of the failed attempt | changing them does not change the total | required as on SCR-06 |
| E-06 | `Retry payment` | primary button | TXT-PAY-10 | creates the next attempt (T-05) with the selected method/card → E-03 | only while attempts < 3; disabled while saving |
| E-07 | `Cancel order` | secondary danger button | TXT-PAY-11 | confirmation TXT-PAY-12 → T-06 → closes, SCR-05, toast TXT-PAY-16 | |
| E-08 | Close (failed state) | icon button | TXT-GEN-04 | closes; navigates to SCR-09 of the order, which shows the PAYMENT_FAILED banner (TXT-TRK-15) with the same retry/cancel actions | the order is auto-cancelled after `paymentFailedTimeout` (T-07) |
| E-09 | Rolled-back block | error panel | TXT-PAY-13, TXT-PAY-14 | | after T-04 |
| E-10 | `Back to manifest` | primary button | TXT-PAY-15 | closes, opens SCR-05 (cart unchanged, BR-ORD-07) | |

## 5. States

| State | What is shown |
|---|---|
| Processing | E-01 – E-03; no buttons |
| Payment failed — DECLINED (`VISA_0002`) | E-04 "Card declined by issuer. Attempt 1 of 3 failed. …", E-05 – E-08 |
| Payment failed — INSUFFICIENT_FUNDS (`VISA_9995`) | same with "Insufficient funds." |
| Payment failed — GATEWAY_TIMEOUT (`AMEX_0005`) | processing lasts `paymentTimeout`, then "Payment gateway timed out." |
| Third failure → rolled back | E-09, E-10 |
| Success | E-03 shows TXT-PAY-36 `200 OK · TxID {transactionId}` for about 1 s, then the sheet closes and SCR-08 opens (SIM-01) |
| Payment window expired (T-07, BR-PAY-13) | E-09 with "Payment window expired. Order {orderNumber} was rolled back. Nothing was charged." (TXT-PAY-33), button `Back to manifest` |

## 6. Tablet and phone

Tablet: same modal. Phone: bottom sheet, full width, buttons stacked full width; the method list scrolls inside the sheet.

## 7. Stitch reference and deviations

No dedicated Stitch screen. The phone checkout design's terminal lines ("Handshake with payment gateway: SUCCESS", "Baking container initiated at 350°C", "Dispatching courier process PID…") are not used verbatim: log wording is TXT-LOG-01 … 10, temperatures are °F and a courier is not dispatched at payment time. `BLIK` is out of scope.
