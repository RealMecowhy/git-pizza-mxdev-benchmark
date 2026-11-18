# FD-09 — Order detail and receipt (Lite)

| Item | Value |
|---|---|
| Epic | EP-09 (US-166, US-167; TC-161 – TC-180) |
| Roles | Guest (orders the session holds a token for, read-only) |
| Screens | SCR-13 Order detail and receipt (`git show <hash>`) |
| Processes | PR-02 Order lifecycle, PR-07 Cancellation and refund |
| Objects | `Order`, `OrderLine`, `OrderLineModifier`, `PaymentAttempt`, `OrderStatusChange` |
| Rules referenced | BR-DATA-03, BR-PRICE-11, BR-PRICE-14, BR-ORD-10, LITE-SES-03 |
| Priority | Must (print: Should) |

Related: FD-07 (tracking, `View receipt`) · information model sections 2 and 10 · order-lifecycle section 5 (cancel wording).

In the full product FD-09 is the customer profile with stats, ranks, reward pixels, order history, re-order, saved addresses and profile editing (SCR-12, SCR-14, SCR-15). **Lite has no accounts, so only the order detail and receipt are part of Lite.** Rules BR-PRF-01 – BR-PRF-08 and BR-PRF-12 – BR-PRF-21 are not used in Lite (section 5).

---

## 1. Purpose

Give the guest a complete, read-only receipt of an order: what was ordered with every configuration choice, how the total was calculated, how it was paid (or refunded), and how the order went through the pipeline; and let the guest print it.

## 2. Actors

| Actor | Can |
|---|---|
| Guest | Open SCR-13 of an order the session holds a token for (LITE-SES-03): placed or looked up in this browser session, or opened with its tracking link. Read and print it. |

## 3. Preconditions

The guest has access to the order (LITE-SES-03). Without access, or for an unknown or deleted order, SCR-40 is shown (BR-ERR-01, LITE-SEC-03).

## 4. Behaviour

### 4.1 Order detail and receipt (SCR-13)

1. The guest presses `View receipt` on SCR-09 (TXT-TRK-35), or `EXPORT RECEIPT` on SCR-08 (TXT-PAY-31).
2. SCR-13 shows the content of BR-PRF-09 with the headings of TXT-PRF-31 – TXT-PRF-33.
3. Actions: `Print receipt` (TXT-PRF-36, BR-PRF-10) and `./track.log` (TXT-PRF-38) back to SCR-09 of the order while it is open.

There is no `Re-run build` (re-order) in Lite.

## 5. Business rules

| ID | Rule | Priority |
|---|---|---|
| BR-PRF-01 – BR-PRF-08 | Not used in Lite (profile page, stats, rank, active orders and history of a customer account). | — |
| BR-PRF-09 | **SCR-13** shows (from the order snapshot): order number, commit hash, placed date and time, type, final or current status with plain label; contact; delivery address and notes (delivery) or store (pickup); every line with quantity, name, plain name, size, all modifiers (crust, sauce, cheese, `+` extras with price, `−` removals; TXT-PRF-57), allergens and line total; subtotal, discount with coupon code, delivery fee (with reason when waived), tax with rate, tip with percentage, total; payment: method (card label), status, `TxID`, paid time (TXT-PRF-34), refund amount, ID and time when refunded (TXT-PRF-35); status history (time and status only, BR-PRF-11); cancel reason for cancelled orders (customer wording of order-lifecycle section 5). Values are those at order time, also when the menu changed afterwards (BR-DATA-03). | Must |
| BR-PRF-10 | `Print receipt` opens the browser print with a print layout: the black logo `assets/brand/logo-mono-black.png`, store name, address and phone, order data of BR-PRF-09 without the status history, and the line "Receipt — demo order. No real payment was taken." (TXT-PRF-37) Navigation, banners and buttons are hidden. Printed output uses dark text on a white background. | Should |
| BR-PRF-11 | The guest sees the status history as time and status only (no actor names, no internal reasons except the customer-facing cancel wording). | Must |
| BR-PRF-12 – BR-PRF-21 | Not used in Lite (re-order, saved addresses, address editor, profile editing, demo customer account). | — |

## 6. Data read and written

| Object | Read | Written |
|---|---|---|
| `Order`, `OrderLine`, `OrderLineModifier`, `PaymentAttempt`, `OrderStatusChange` | orders the session holds a token for | — |
| `StoreSettings` | store name, address, phone (pickup block, printed receipt) | — |

## 7. States touched

Reads all `OrderStatus` values. Changes none.

## 8. Errors and edge cases

| Case | Behaviour | Message |
|---|---|---|
| Guest opens SCR-13 of an order without a token (changed URL, another guest's or a simulated order) | SCR-40 (LITE-SEC-03) | `ERROR 404 // CRUST_NOT_FOUND` |
| Order deleted by a demo reset while SCR-13 is open | SCR-40 on the next navigation or refresh | `ERROR 404 // CRUST_NOT_FOUND` |
| Product renamed or archived after the order | SCR-13 shows the snapshot values of the order | — |
| Open order (not final yet) | SCR-13 shows the current status; the status history grows on the next load | — |
| Seed order found with the lookup (contact Jordan Lee) | SCR-13 opens like for any order of the session | — |

## 9. Notifications

None. No email receipts are sent.
