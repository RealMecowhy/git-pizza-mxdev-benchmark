# EP-05 — Checkout (deploy config)

| Epic | Functional area | Screens | MoSCoW | Story range |
|---|---|---|---|---|
| EP-05 | FD-05 Checkout | SCR-06 `checkout_config.json` | Must | US-081 – US-097 |

**Goal.** The visitor chooses delivery or pickup, enters an address inside the delivery zone, gives contact details, chooses a tip, sees the exact total and places the order with `Execute Order --force`. Payment method selection on the same screen is specified in EP-06 (US-101).

Rules: BR-PRICE-05 – BR-PRICE-13, BR-ORD-03 (prerequisites of T-01), BR-DATA-06 – BR-DATA-08 (formats and required fields). Zones: information model section 7.8.

| ID | Title | Priority |
|---|---|---|
| US-081 | Choose delivery or pickup | Must |
| US-082 | Enter a delivery address (`.env` variables) | Must |
| US-083 | Delivery-zone check | Must |
| US-085 | Contact details | Must |
| US-086 | Courier tip | Must |
| US-087 | Order summary and total | Must |
| US-088 | Delivery fee | Must |
| US-089 | Minimum delivery order | Must |
| US-091 | Place the order (`Execute Order --force`) | Must |
| US-092 | Empty-cart redirect | Must |
| US-093 | Pickup details | Should |
| US-094 | Coupon re-check for the order type | Must |
| US-095 | Item became unavailable during checkout | Must |
| US-097 | Delivery preview map | Could |

---

### US-081 Choose delivery or pickup

> As a **guest**, I want to choose delivery or pickup, so that I get my pizza the way that suits me.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-06 | FD-05 | BR-CHK-*, BR-PRICE-07, BR-PRICE-09 | PR-01, PR-06 | — |

**Acceptance criteria**

1. **Given** SCR-06 opens, **then** the order-type switch (`const method = 'delivery' | 'pickup'`) is set to DELIVERY.
2. **Given** the Example B cart with `GITHUB_STUDENT`, **then** the DELIVERY total is `$26.58`; **when** PICKUP is chosen, **then** the address block and the tip are hidden and the total becomes `$19.85` (no delivery fee, no tip).
3. **When** the visitor switches from DELIVERY to PICKUP and back, **then** the address and tip entered before are still there. *(negative: no data loss)*

---

### US-082 Enter a delivery address (`.env` variables)

> As a **guest**, I want to enter my delivery address in clear fields, so that the courier finds me.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-06 | FD-05 | BR-CHK-*, BR-DATA-06, BR-DATA-07, BR-DATA-08 | PR-01 | — |

**Acceptance criteria**

1. **Given** DELIVERY, **then** the fields `ADDRESS_LINE_1` (required, max 80), `ADDRESS_LINE_2` (optional, max 80), `CITY` (required, prefilled `San Francisco`), `STATE` (required, prefilled `CA`), `ZIP_CODE` (required, 5 digits) and `DELIVERY_NOTES` (optional, max 140) are shown, each with its plain label.
2. **When** `Execute Order --force` is pressed with `ADDRESS_LINE_1` empty or only spaces, **then** the field shows `ADDRESS_LINE_1 is required` and no order is created. *(negative)*
3. **When** `ZIP_CODE` is `9410`, **then** the field shows that the ZIP code must be 5 digits. *(negative)*
4. **When** `STATE` is typed as `ca`, **then** it is stored as `CA`; **when** it is `C1`, **then** a format error is shown. *(negative)*
5. **Given** a value longer than the maximum, **then** the field does not accept more characters.

---

### US-083 Delivery-zone check

> As a **guest**, I want to know immediately whether the store delivers to my ZIP code, so that I do not complete a form for nothing.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-06 | FD-05 | BR-CHK-*, BR-ORD-03 | PR-01 | — |

**Acceptance criteria**

1. **When** `ZIP_CODE` `94105` is entered, **then** the zone check shows `ZONE_OK` with `Rincon Hill / Financial District · 2.8 mi`.
2. **When** `94110` is entered, **then** it shows `Mission · 0.8 mi`.
3. **When** `94121` is entered, **then** an error says that 94121 is outside the delivery zone, lists the eight served ZIP codes and offers `Switch to pickup` (TXT-CHK-61); `Execute Order --force` is blocked while DELIVERY is selected. *(negative)*
4. **Given** a zone that is not active (`isActive = false`; none in the Lite seed), **when** its ZIP code is entered, **then** it is treated as outside the zone. *(negative)*
5. **When** `Switch to pickup` is clicked, **then** the order type becomes PICKUP and the error disappears.

---

### US-085 Contact details

> As a **guest**, I want to give my name, email and phone, so that the store and courier can reach me and I can look up my order later.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-06 | FD-05 | BR-CHK-*, BR-DATA-06, BR-DATA-08, BR-ORD-03 | PR-01 | — |

**Acceptance criteria**

1. **Given** a guest, **then** `CONTACT_NAME` (required, max 80), `CONTACT_EMAIL` (required) and `CONTACT_PHONE` (required) are empty and required for both DELIVERY and PICKUP.
3. **When** the phone is entered as `415 555 0199` or `+1 (415) 555-0199`, **then** it is accepted and shown as `(415) 555-0199`.
4. **When** the phone is `555-01` or the email is `taylor@`, **then** a format error is shown at the field and no order is created. *(negative)*
5. The guest is told that the email is used, together with the order number, to look up the order (SCR-10).

---

### US-086 Courier tip

> As a **guest ordering delivery**, I want to add a tip for the courier, so that I can reward good service.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-06 | FD-05 | BR-CHK-*, BR-PRICE-09, BR-PRICE-10 | PR-01 | — |

**Acceptance criteria**

1. **Given** DELIVERY, **then** a tip control offers `0%`, `10%`, `15%`, `20%` with the amount of each, and `15%` is preselected.
2. **Given** the Example A cart (subtotal $55.50, no discount), **then** the tip amounts are `$0.00`, `$5.55`, `$8.33`, `$11.10` and the totals `$60.29`, `$65.84`, `$68.62`, `$71.39`.
3. **Given** a discount, **then** the tip is calculated on subtotal minus discount (Example B: 15 % of $18.27 = `$2.74`).
4. **Given** PICKUP, **then** no tip control is shown and the tip is `$0.00`. *(negative)*

---

### US-087 Order summary and total

> As a **guest**, I want to see a complete breakdown of what I will pay before I place the order, so that there are no surprises.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-06 | FD-05 | BR-CHK-*, BR-PRICE-04, BR-PRICE-05, BR-PRICE-07, BR-PRICE-08, BR-PRICE-09, BR-PRICE-10, BR-PRICE-11, BR-DATA-01 | PR-01 | — |

**Acceptance criteria**

1. **Given** SCR-06, **then** a summary lists the cart lines (name, size, quantity, line total) and the amounts `SUBTOTAL_PAYLOAD` (TXT-CHK-36), `DISCOUNT ({CODE})` (TXT-CHK-37), `PIPELINE_TRANSIT_FEE` (TXT-CHK-38), `SALES_TAX (8.625%)` (TXT-CHK-39), `COURIER_TIP ({p}%)` (TXT-CHK-40) and `EXEC_TOTAL` (TXT-CHK-41) (BR-CHK-12).
2. **Given** information-model Example A (delivery, 15 % tip), **then** the summary shows subtotal `$55.50`, fee `$0.00`, tax `$4.79`, tip `$8.33`, total `$68.62`.
3. **Given** Example B (delivery, `GITHUB_STUDENT`, 15 % tip), **then** it shows `$21.49`, `−$3.22`, `$3.99`, `$1.58`, `$2.74`, total `$26.58`.
4. **Given** Example D (guest, pickup, Quad-Core Formaggi Small + Cold Brew Commit, no coupon), **then** the summary shows `$18.74`, discount none, fee `$0.00`, tax `$1.62`, tip `$0.00`, total `$20.36`.
5. **When** the order type, address, tip or coupon changes, **then** the summary updates immediately.
6. **Given** every worked example of information model section 6.1, **then** each amount matches to the cent; rounding happens only where BR-PRICE says "round" (half-up). *(negative: no floating-point deviations such as `$68.61`)*

---

### US-088 Delivery fee

> As a **guest**, I want to see when delivery is free and why, so that I can decide whether to add more or use a coupon.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-06 | FD-05 | BR-CHK-*, BR-PRICE-07 | PR-01 | — |

**Acceptance criteria**

1. **Given** DELIVERY and subtotal `$21.49`, **then** `Pipeline Transit Fee` is `$3.99`.
2. **Given** DELIVERY and subtotal `$55.50`, **then** the fee is `$0.00` with the note that delivery is free from $40.00.
3. **Given** DELIVERY, Binary BBQ Large + Inferno Payload Medium (subtotal `$42.49`) and `GITHUB_STUDENT` (discount `−$6.37`), **then** the fee is `$0.00`, because the threshold is measured before the discount.
4. **Given** DELIVERY, subtotal `$21.49` and `FREE_DISPATCH` applied, **then** the fee is `$0.00` with the note `FREE_DISPATCH`.
5. **Given** PICKUP, **then** the fee is `$0.00` or not shown. *(negative: never $3.99 for pickup)*

---

### US-089 Minimum delivery order

> As the **store**, I want delivery orders to reach a minimum subtotal, so that small orders are picked up instead.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-06 | FD-05 | BR-CHK-*, BR-PRICE-13, BR-ORD-03 | PR-01 | — |

**Acceptance criteria**

1. **Given** a cart with only The Root Pizza Medium (`$14.99`) and DELIVERY, **then** a message says delivery needs a subtotal of at least $15.00 (`$0.01` more) or pickup, and `Execute Order --force` is blocked. *(negative)*
2. **When** PICKUP is chosen for the same cart, **then** the order can be placed with total `$16.28` (tax $1.29).
3. **Given** the Example B cart (`$21.49`) with discount `−$3.22`, **then** delivery is allowed (minimum measured before discount).

---

### US-091 Place the order (`Execute Order --force`)

> As a **guest**, I want to place the order with one button once everything is valid, so that the kitchen starts as soon as my payment is through.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-06, SCR-07 | FD-05 | BR-CHK-*, BR-ORD-01, BR-ORD-02, BR-ORD-03, BR-PRICE-12, BR-DATA-03 | PR-01, PR-02, PR-03 | SIM-01, SIM-07 |

**Acceptance criteria**

1. **Given** SCR-06, **then** the primary button reads `Execute Order --force`, shows the total and has the accessible name "Place order and pay".
2. **Given** a valid delivery checkout (Example A, card `Visa •••• 4242`), **when** the button is pressed, **then** exactly one order is created in `PAYMENT_PENDING` with a new order number `MX-<n>`, a 7-character commit hash, a tracking token, `source` GUEST, snapshots of lines, modifiers, contact, address and amounts (total `$68.62`), payment attempt #1 in PROCESSING with the chosen method, the first two log lines of T-01, and SCR-07 opens in the processing state.
3. **Given** the order is created, **then** the cart is not yet cleared (it is cleared only when payment succeeds, BR-ORD-07).
4. **When** the button is pressed with any invalid or missing field, **then** every error is shown at its field and in a short error summary, focus moves to the first error and no order is created. *(negative)*
5. **When** the button is pressed twice quickly, **then** only one order is created (US-288). *(negative)*

---

### US-092 Empty-cart redirect

> As a **guest**, I want to be sent back to the menu if I open checkout with an empty cart, so that I never see a broken checkout.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-06, SCR-02 | FD-05 | BR-CHK-* | PR-01 | — |

**Acceptance criteria**

1. **Given** an empty cart, **when** SCR-06 is opened (link, URL, browser back button after a paid order), **then** SCR-02 is shown with an info toast that the manifest is empty. *(negative)*

---

### US-093 Pickup details

> As a **guest ordering pickup**, I want to see where and roughly when I can collect my order, so that I can plan my walk to the store.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Should | G | SCR-06 | FD-05 | BR-CHK-* | PR-06 | SIM-09 |

**Acceptance criteria**

1. **Given** PICKUP, **then** SCR-06 shows `Git Pizza MxDev — Mission Kitchen`, `2140 Folsom Street, San Francisco, CA 94110`, `(415) 555-0142` and an estimated ready time `~HH:mm` (now + `queueWait` + `bake` + `qa` at the current speed factor; at 1× about 2 minutes 20 seconds).
2. **Given** PICKUP, **then** contact details are still required (US-085). *(negative)*

---

### US-094 Coupon re-check for the order type

> As a **guest**, I want the coupon to be checked again when I choose delivery or pickup, so that I see the real discount before paying.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-06 | FD-05 | BR-CHK-*, BR-PRICE-06 | PR-01 | — |

**Acceptance criteria**

1. **Given** `FREE_DISPATCH` applied in the cart, **when** PICKUP is chosen, **then** the coupon shows `FREE_DISPATCH is valid for delivery orders only` (NOT_APPLIED) and the order can still be placed without it. *(negative)*
2. **When** DELIVERY is chosen again, **then** `FREE_DISPATCH` is APPLIED again and the fee is `$0.00`.
3. **Given** SCR-06, **then** the coupon is shown read-only as "Coupon {CODE}: {state message}" (TXT-CHK-52); it can be entered, removed or replaced only in the cart (SCR-05, via `Edit manifest`; US-066 – US-068) (BR-CHK-11).

---

### US-095 Item became unavailable during checkout

> As a **guest**, I want to be told if something in my order sold out while I was checking out, so that I am not charged for food the kitchen cannot make.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-06, SCR-05 | FD-05 | BR-CHK-*, BR-ORD-03, BR-DATA-12 | PR-01 | — |

**Acceptance criteria**

1. **Given** SCR-06 is open and a product in the cart is no longer orderable when the visitor presses `Execute Order --force`, **then** no order is created and a message names the product (e.g. `Lava Exception Cake`) as no longer available, with a link to the cart. *(negative)*

**Notes.** In Lite availability does not change while the app runs (BR-DEMO-03a), so this state does not arise in a normal session; the server still checks availability when the order is placed (BR-ORD-03).

---

### US-097 Delivery preview map

> As a **guest**, I want a small map preview of the route from the store to my ZIP code, so that I feel the delivery is real.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Could | G | SCR-06 | FD-05 | BR-CHK-* | PR-05 | SIM-04 |

**Acceptance criteria**

1. **Given** a ZIP code inside the zone, **then** SCR-06 shows the simulated map (`illustrations/map-sf-dark.jpg`) with the store marker, a destination marker for the zone and the distance (e.g. `2.8 mi`).
2. **Given** a ZIP outside the zone, **then** no destination marker is drawn. *(negative)*
