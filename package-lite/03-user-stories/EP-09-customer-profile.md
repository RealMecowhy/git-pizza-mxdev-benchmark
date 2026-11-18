# EP-09 — Order receipt

| Epic | Functional area | Screens | MoSCoW | Story range |
|---|---|---|---|---|
| EP-09 | FD-09 Customer profile and order history | SCR-13 `git show <hash>` | Must (print: Should) | US-166 – US-167 |

**Goal.** A guest opens the receipt of an order they hold (placed or found in this browser session, or opened with its tracking link) and can print it. Lite has no accounts, profile, order history or saved addresses: only the receipt stories of this epic are part of Lite.

Rules: BR-PRF-09 – BR-PRF-11 (FD-09). Access to orders: information model section 2 (LITE-SES-03).

| ID | Title | Priority |
|---|---|---|
| US-166 | Order detail and receipt (`git show <hash>`) | Must |
| US-167 | Print the receipt | Should |

---

### US-166 Order detail and receipt (`git show <hash>`)

> As a **guest**, I want to open the full detail of my order, so that I can see exactly what I ordered and paid.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-13 | FD-09 | BR-PRF-09, BR-PRF-11, BR-PRICE-11, BR-DATA-03, BR-ORD-10, LITE-SES-03 | PR-02, PR-07 | — |

**Acceptance criteria**

1. **Given** a completed delivery order (e.g. seed order MX-1014, found on SCR-10 with `jordan.lee@example.com`), **then** SCR-13 shows: commit hash, order number, placed date and time, order type, status badge; every line with size, crust, sauce and cheese (default marked), added extras with prices, removed ingredients, quantity, unit price, line total and allergens; subtotal, discount with coupon code, delivery fee or the waiver reason (`free from $40.00` or `FREE_DISPATCH`), `SALES_TAX (8.625%)`, tip with percentage, total; payment method and card label, transaction ID and paid time; the delivery address; and the status history (time and status only).
2. **Given** a cancelled paid order (e.g. seed order MX-1023), **then** SCR-13 also shows the cancellation reason in customer wording and the refund (amount, refund ID, time).
3. **Given** the order snapshot differs from the current menu data (price, name, product status), **then** SCR-13 shows the values as they were at order time (BR-DATA-03). *(negative)*
4. **Given** a guest opens SCR-13 of an order that was not placed or found in this session, without its tracking token, **then** SCR-40 is shown (LITE-SES-03). *(negative)*
5. **Given** a guest with the tracking link, **when** `View receipt` is clicked on SCR-09, **then** SCR-13 opens read-only, without any re-order action.

---

### US-167 Print the receipt

> As a **guest who needs a receipt for expenses**, I want to print it, so that I can hand it in.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Should | G | SCR-13 | FD-09 | BR-PRF-10 | — | — |

**Acceptance criteria**

1. **When** `Print receipt` is clicked on SCR-13, **then** the browser print dialog opens with a receipt layout that hides navigation, banners and buttons and shows the store name, address and phone, order number, commit hash, date, lines, totals and payment.
2. **Given** the printed receipt, **then** it states that it is a demo receipt of a simulated payment and not a tax invoice. *(negative)*

---
