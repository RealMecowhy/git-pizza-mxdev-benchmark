# EP-04 — Cart (manifest) and coupons

| Epic | Functional area | Screens | MoSCoW | Story range |
|---|---|---|---|---|
| EP-04 | FD-04 Cart and coupons | SCR-05 (and the cart summary in SCR-02, SCR-16) | Must | US-061 – US-073 |

**Goal.** The visitor reviews and adjusts the cart (`MANIFEST.LOCK`), applies one coupon with clear feedback, sees correct running totals and moves on to checkout only with an orderable cart.

Rules: BR-PRICE-04 (line total, subtotal), BR-PRICE-05 (discount), BR-PRICE-06 (coupon validation and messages), BR-PRICE-08 (tax), BR-PRICE-13 (delivery minimum), BR-ORD-03 (order prerequisites), BR-ORD-07 (cart cleared only after payment). Coupons: [menu-catalog.md](../09-demo-data/menu-catalog.md) section 8.

| ID | Title | Priority |
|---|---|---|
| US-061 | Review the cart (`MANIFEST.LOCK`) | Must |
| US-062 | Empty cart state | Must |
| US-063 | Change the quantity of a line | Must |
| US-064 | Remove a line (`rm`) | Must |
| US-065 | Clear the cart (`rm -rf`) | Must |
| US-066 | Apply a coupon | Must |
| US-067 | Coupon validation messages | Must |
| US-068 | Remove or replace the coupon | Must |
| US-069 | Totals in the cart | Must |
| US-070 | Delivery minimum and free-delivery hints | Must |
| US-071 | Unavailable lines in the cart | Must |
| US-072 | Cart persistence in the guest session | Must |
| US-073 | Proceed to checkout | Must |

Assumption A-20 (FD-04) applies: the cart shows subtotal, discount and the total before delivery fee, tax and tip; delivery fee and sales tax are "calculated at checkout". Coupon rule (5) "delivery only" and the delivery hints use the order type last chosen at checkout in this session (default DELIVERY). The final figures are shown on SCR-06.

> **Assumption A-80:** The cart enforces `StoreSettings.maxItemsPerOrder` (30 items in total) already while items are added, so that BR-ORD-03 never fails at checkout for this reason.

---

### US-061 Review the cart (`MANIFEST.LOCK`)

> As a **guest**, I want to see every item in my cart with its configuration and price, so that I can check my order before paying.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-05, SCR-16 | FD-04 | BR-CART-*, BR-PRICE-04, BR-PRICE-11 | PR-01 | — |

**Acceptance criteria**

1. **When** the visitor opens the cart (cart button, toast action `View manifest`, phone tab `Deploy`), **then** SCR-05 opens as a 480 px drawer on desktop and tablet and as a full page on phone, titled `MANIFEST.LOCK` with the item count.
2. **Given** the cart of information-model Example A (Inferno Payload Large, Binary BBQ Large, Mate Compiler Tonic × 2), **then** three lines are shown with line totals `$22.50`, `$24.00`, `$9.00` and the subtotal `$55.50`.
3. **Given** a pizza line, **then** it shows dev name, real-world name, size, the configuration differences from the default (non-default crust, sauce and cheese, `+` extras, `−` removed ingredients), unit price, quantity (`instances:`), line total and the actions `Edit` (US-050) and `rm` (US-064).
4. **Given** Inferno Payload Large with EX-11 added and crushed red pepper removed, **then** the line shows `+ Cherry tomatoes`, `− Crushed red pepper` and `− Fresh jalapeños` (out of stock, removed automatically, US-051).
5. The drawer closes with its close button, Escape and a backdrop click; the page behind keeps its state.
6. **Given** a side, drink or dessert line, **then** no `Edit` action is shown (only quantity and `rm`). *(negative)*

---

### US-062 Empty cart state

> As a **guest**, I want a helpful empty cart, so that I know what to do next.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-05 | FD-04 | BR-CART-* | PR-01 | — |

**Acceptance criteria**

1. **Given** the cart has no lines, **then** SCR-05 shows the empty state: the illustration `illustrations/empty-cart.png`, a short terminal-style message that the manifest is empty and the CTA `git checkout menu` (opens SCR-02).
2. **Given** the empty state, **then** no totals block, no coupon field and no checkout button are shown. *(negative)*

---

### US-063 Change the quantity of a line

> As a **guest**, I want to change how many of an item I order, so that I do not have to add it again.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-05 | FD-04 | BR-CART-*, BR-PRICE-04 | PR-01 | — |

**Acceptance criteria**

1. **Given** the Example A cart, **when** the quantity of Mate Compiler Tonic is increased from 2 to 3, **then** its line total becomes `$13.50` and the subtotal `$60.00` without reload.
2. **Given** a line with quantity 1, **then** the minus control is disabled (removal is done with `rm`). *(negative)*
3. **Given** a line with quantity 10, **then** the plus control is disabled with the hint that the maximum per line is 10. *(negative)*
4. **Given** the cart holds 30 items in total, **then** every plus control and every add action (US-028, US-049, US-029) is blocked with the message that a manifest can hold at most 30 items. *(negative)*
5. **Given** a coupon whose minimum is no longer met after a decrease, **then** the coupon state and message update immediately (US-067).

---

### US-064 Remove a line (`rm`)

> As a **guest**, I want to remove an item, so that I only pay for what I want.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-05 | FD-04 | BR-CART-*, BR-PRICE-04 | PR-01 | — |

**Acceptance criteria**

1. **When** the visitor clicks `rm` (accessible name "Remove <product>") on Binary BBQ in the Example A cart, **then** the line disappears immediately, the subtotal becomes `$31.50` and a toast confirms the removal.
2. **When** the last line is removed, **then** the empty state (US-062) is shown and an applied coupon is removed as well.

---

### US-065 Clear the cart (`rm -rf`)

> As a **guest**, I want to empty the cart in one action, so that I can start over.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-05 | FD-04 | BR-CART-* | PR-01 | — |

**Acceptance criteria**

1. **When** the visitor clicks `CLEAR (rm -rf)` (accessible name "Empty cart"), **then** a confirmation asks to remove all items and states the item count.
2. **When** confirmed, **then** all lines and the coupon are removed and the empty state is shown.
3. **When** cancelled, **then** the cart is unchanged. *(negative)*

---

### US-066 Apply a coupon

> As a **guest**, I want to enter a coupon code, so that I get the discount I am entitled to.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-05, SCR-06 | FD-04 | BR-CART-*, BR-PRICE-05, BR-PRICE-06, BR-PRICE-11 | PR-01 | — |

**Acceptance criteria**

1. **Given** a cart with The Root Pizza Medium and Garlic Knot Loop (subtotal `$21.49`), **when** `GITHUB_STUDENT` is entered in `coupon --apply` and applied, **then** the coupon state is APPLIED, the description `Student discount: 15% off, up to $10.` is shown and a discount line shows `−$3.22`.
2. **When** the code is typed as `github_student`, **then** it is accepted and displayed as `GITHUB_STUDENT` (case-insensitive).
3. **Given** a cart of 4 × Binary BBQ Large (subtotal `$96.00`), **when** `GITHUB_STUDENT` is applied, **then** the discount is `−$10.00` (15 % = $14.40, capped at $10.00).
4. **Given** a cart with subtotal `$21.49`, **when** `FREE_DISPATCH` is applied, **then** the state is APPLIED, the description `Free delivery on this order.` is shown, the discount is `$0.00` and the delivery fee is waived at checkout (US-088).

---

### US-067 Coupon validation messages

> As a **guest**, I want a precise reason when a coupon does not work, so that I know whether I can fix it.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-05, SCR-06 | FD-04 | BR-CART-*, BR-PRICE-06 | PR-01 | — |

**Acceptance criteria**

1. **When** `PIZZA50` is applied, **then** the message `Coupon not found: PIZZA50` is shown under the field and no coupon is attached (state INVALID). *(negative)*
2. **When** `HOTFIX10` is applied, **then** the message `Coupon HOTFIX10 has expired` is shown and no coupon is attached. *(negative)*
6. **Given** a cart with only The Root Pizza Medium (`$14.99`), **when** `GITHUB_STUDENT` is applied, **then** the message is `Add $5.01 more to use GITHUB_STUDENT`. *(negative)*
7. **Given** a NOT_APPLIED coupon, **then** it never blocks checkout; the placed order stores no coupon (BR-PRICE-06).
8. The checks run in the order of BR-PRICE-06; only the first failing message is shown.

---

### US-068 Remove or replace the coupon

> As a **guest**, I want to remove a coupon or try another, so that I can use the best one.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-05, SCR-06 | FD-04 | BR-CART-*, BR-PRICE-06 | PR-01 | — |

**Acceptance criteria**

1. **Given** `GITHUB_STUDENT` is applied, **when** the visitor removes it, **then** the discount line disappears and the totals are recalculated.
2. **Given** `GITHUB_STUDENT` is applied, **when** `FREE_DISPATCH` is applied, **then** it replaces `GITHUB_STUDENT` (one coupon per cart) and the discount line `−$3.22` disappears.
3. **Given** `FREE_DISPATCH` is applied, **when** `PIZZA50` is entered, **then** the error is shown and `FREE_DISPATCH` stays applied. *(negative: an invalid code never removes a valid coupon)*

---

### US-069 Totals in the cart

> As a **guest**, I want to see the running totals in the cart, so that I know roughly what I will pay.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-05 | FD-04 | BR-CART-*, BR-PRICE-04, BR-PRICE-05, BR-PRICE-08, BR-PRICE-11 | PR-01 | — |

**Acceptance criteria**

1. **Given** the Example B cart with `GITHUB_STUDENT` applied, **then** the totals show `Dependencies Subtotal $21.49`, `Coupon Subsidy (GITHUB_STUDENT) −$3.22`, `Pipeline Transit Fee` and `SALES_TAX` as "calculated at checkout", and `EXEC_TOTAL_OUTPUT $18.27` "before delivery fee, tax and tip" (A-20, TXT-CART-24 – TXT-CART-28).
2. **Given** the Example A cart without coupon, **then** the totals show subtotal `$55.50` and `EXEC_TOTAL_OUTPUT $55.50`; tax `$4.79` appears only on SCR-06.
3. All amounts use the format `$1,024.00`; discounts show as `−$3.22` (BR-PRICE-11).
4. **When** any line, quantity or coupon changes, **then** all totals update immediately. *(negative: no stale totals)*

---

### US-070 Delivery minimum and free-delivery hints

> As a **guest**, I want to know whether my cart reaches the delivery minimum and free delivery, so that I can adjust it before checkout.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-05 | FD-04 | BR-CART-*, BR-PRICE-07, BR-PRICE-13 | PR-01 | — |

**Acceptance criteria**

1. **Given** a cart with only The Root Pizza Medium (`$14.99`), **then** the note "Delivery minimum is $15.00. Add $0.01 more, or choose pickup at checkout." (TXT-CART-30) is shown; the checkout button stays enabled. *(negative: the minimum does not block pickup)*
2. **Given** a cart subtotal of `$21.49`, **then** the hint says "Add $18.51 more for `FREE_DISPATCH` (free delivery from $40.00)." (TXT-CART-29, first form).
3. **Given** a subtotal of `$40.00` or more (measured before discount), **then** the hint says "`FREE_DISPATCH` unlocked: delivery is free for this order." (TXT-CART-29, second form).

---

### US-071 Unavailable lines in the cart

> As a **guest**, I want to be told when an item in my cart has become unavailable, so that I can fix my order before paying.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-05, SCR-06 | FD-04 | BR-CART-*, BR-DATA-12, BR-ORD-03 | PR-01 | — |

**Acceptance criteria**

1. **Given** a cart line whose product is no longer orderable (sold out, or no longer published), **when** the visitor opens the cart, **then** the line is marked `404: OUT_OF_STOCK` with the text that it is no longer available today, and offers `rm`.
2. **Given** a pizza line whose selected option or ingredient is no longer available (e.g. cheese CH-02 when `buffalo_mozzarella` is out of stock), **then** the line is marked unavailable and offers `Edit` (to pick another cheese) and `rm`.
3. **Given** any unavailable line, **then** the checkout button is disabled with the message "Remove unavailable items from your manifest first." (TXT-CHK-48). *(negative)*

**Notes.** In Lite availability and prices come from the seed and do not change while the app runs (BR-DEMO-03a), and sold-out items cannot be added (US-028, US-049), so these states do not arise in a normal session. The cart still checks availability on the server whenever it is shown and when the order is placed (BR-ORD-03, US-095).

---

### US-072 Cart persistence in the guest session

> As a **guest**, I want my cart to survive page reloads and navigation in my browser session, so that I never lose items while I order.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-05 | FD-04 | BR-CART-*, LITE-SES-02 | PR-01 | — |

**Acceptance criteria**

1. **Given** a guest with 2 items, **when** the page is reloaded or the guest navigates through the app, **then** the cart still holds the 2 items (same browser session).
2. **Given** a guest in a second browser, **then** that browser has its own, empty cart. *(negative: guest carts are per browser session)*

**Notes.** Lite has no accounts, so there is no customer cart and no cart merge (information model section 2, LITE-SES-02). A cart lost when the session expires: US-286.

---

### US-073 Proceed to checkout

> As a **guest**, I want to go from the cart to checkout, so that I can place my order.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-05, SCR-06 | FD-04 | BR-CART-*, BR-ORD-03 | PR-01 | — |

**Acceptance criteria**

1. **Given** an orderable cart, **when** the visitor clicks `./checkout.yml` (accessible name "Go to checkout"), **then** SCR-06 opens with the cart summary.
2. **Given** a cart with only 4 × Mate Compiler Tonic, **then** the checkout button is disabled with the message that the order must contain at least one item that is not a drink. *(negative)*
