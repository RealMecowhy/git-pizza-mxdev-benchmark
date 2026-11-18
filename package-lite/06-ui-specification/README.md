# 06 — UI Specification

This folder specifies every screen of Git Pizza MxDev: what it shows, where the data comes from, how each element behaves, which states it must render, and how it changes on a phone. It is functional: it does not prescribe Mendix pages, layouts, widgets or snippets. Build the screens with whatever Mendix 11 means you prefer, as long as the result matches this specification.

Related foundation files (they win when this folder disagrees, see `00-README.md` section 6.5):

- Screen inventory and IDs: [../01-product-brief/ids-and-traceability.md](../01-product-brief/ids-and-traceability.md) section 4
- Dev metaphors: [../01-product-brief/glossary.md](../01-product-brief/glossary.md)
- Data: [../04-information-model/information-model.md](../04-information-model/information-model.md)
- Order states, transitions, timings: [../05-processes/order-lifecycle.md](../05-processes/order-lifecycle.md)
- Colors, type, spacing, breakpoints, motion: [../07-design-system/tokens.md](../07-design-system/tokens.md)
- Menu, options, coupons: [../09-demo-data/menu-catalog.md](../09-demo-data/menu-catalog.md)
- Images and the placeholder rule: [../assets/README.md](../assets/README.md)

## 1. Files

| File | Contents |
|---|---|
| `README.md` | This file: conventions, the screen file template, shared UI patterns |
| [navigation-map.md](navigation-map.md) | Sitemap, header / sidebar / bottom tabs, entry points, redirects, Mermaid flows |
| [responsive-behaviour.md](responsive-behaviour.md) | Breakpoints and what changes per breakpoint, screen by screen |
| [ui-copy.md](ui-copy.md) | Every UI text with an ID (`TXT-…`): labels, buttons, microcopy, statuses, toasts, validation and error messages, empty states, log line templates |
| `screens/SCR-xx-<name>.md` | One file per screen, modal, drawer, dialog and shell in the inventory (14 files) |

### 1.1 Screen index

| ID | Screen | File | Prototype page |
|---|---|---|---|
| SCR-01 | Home (`./main.js`) | [screens/SCR-01-home.md](screens/SCR-01-home.md) | [SCR-01-home.html](../08-prototype/customer/SCR-01-home.html) |
| SCR-02 | Menu (`./menu.ts`) | [screens/SCR-02-menu.md](screens/SCR-02-menu.md) | [SCR-02-menu.html](../08-prototype/customer/SCR-02-menu.html) |
| SCR-03 | Pizza configurator (`configure_module.ts`) | [screens/SCR-03-configurator.md](screens/SCR-03-configurator.md) | [SCR-03-pizza-configurator.html](../08-prototype/customer/SCR-03-pizza-configurator.html) |
| SCR-04 | Item info (`module.info`) | [screens/SCR-04-item-info.md](screens/SCR-04-item-info.md) | [SCR-04-item-info.html](../08-prototype/customer/SCR-04-item-info.html) |
| SCR-05 | Cart (`MANIFEST.LOCK`) | [screens/SCR-05-cart.md](screens/SCR-05-cart.md) | [SCR-05-cart.html](../08-prototype/customer/SCR-05-cart.html) |
| SCR-06 | Checkout (`checkout_config.json`) | [screens/SCR-06-checkout.md](screens/SCR-06-checkout.md) | [SCR-06-checkout.html](../08-prototype/customer/SCR-06-checkout.html) |
| SCR-07 | Payment sheet (`PAYMENT_PROTOCOL`) | [screens/SCR-07-payment-sheet.md](screens/SCR-07-payment-sheet.md) | [SCR-07-payment-sheet.html](../08-prototype/customer/SCR-07-payment-sheet.html) |
| SCR-08 | Order confirmation | [screens/SCR-08-order-confirmation.md](screens/SCR-08-order-confirmation.md) | [SCR-08-order-confirmation.html](../08-prototype/customer/SCR-08-order-confirmation.html) |
| SCR-09 | Order tracking (`DEPLOYMENT_STATUS`) | [screens/SCR-09-order-tracking.md](screens/SCR-09-order-tracking.md) | [SCR-09-order-tracking.html](../08-prototype/customer/SCR-09-order-tracking.html) |
| SCR-10 | Track order lookup (`git log --grep`) | [screens/SCR-10-track-order-lookup.md](screens/SCR-10-track-order-lookup.md) | [SCR-10-track-order-lookup.html](../08-prototype/customer/SCR-10-track-order-lookup.html) |
| SCR-13 | Order detail and receipt (`git show`) | [screens/SCR-13-order-detail-receipt.md](screens/SCR-13-order-detail-receipt.md) | [SCR-13-order-detail-and-receipt.html](../08-prototype/customer/SCR-13-order-detail-and-receipt.html) |
| SCR-16 | Customer shell and navigation | [screens/SCR-16-customer-shell.md](screens/SCR-16-customer-shell.md) | [SCR-16-customer-shell.html](../08-prototype/customer/SCR-16-customer-shell.html) |
| SCR-40 | Not found (`ERROR 404`) | [screens/SCR-40-not-found.md](screens/SCR-40-not-found.md) | [SCR-40-not-found.html](../08-prototype/customer/SCR-40-not-found.html) |
| SCR-41 | Unexpected error (`ERROR 500`) | [screens/SCR-41-unexpected-error.md](screens/SCR-41-unexpected-error.md) | [SCR-41-unexpected-error.html](../08-prototype/customer/SCR-41-unexpected-error.html) |

The prototype is a visual reference only; where it differs from this folder, this folder wins.

## 2. How to read a screen file

Every screen file has the same sections:

| Section | Contents |
|---|---|
| Header table | Type, roles, MoSCoW, functional area / epic, related rules and processes, prototype page, Stitch reference |
| 1. Purpose | What the screen is for, in one or two sentences |
| 2. Entry and exit | Every way to reach the screen and every way to leave it |
| 3. Layout | Regions of the desktop layout (≥ 1200 px), top to bottom, left to right |
| 4. Elements | Table: element ID (`E-01` …), type, content and data source, behavior, validation. Referenced from other files as `SCR-09/E-05` |
| 5. States | Every state the screen must render, including the mandatory states from the inventory: loading, empty, error, success, disabled |
| 6. Tablet and phone | What differs from desktop (details in `responsive-behaviour.md`) |
| 7. Stitch reference and deviations | Which Stitch design the screen comes from, and what in it is **not** authoritative (obsolete branding, Polish text, PLN, invented content) |

Texts appear as `TXT-…` IDs followed by the exact English text in quotes where it helps reading. `ui-copy.md` is the master: if a quote in a screen file differs from `ui-copy.md`, `ui-copy.md` wins.

**About the Stitch references.** Links like `../assets/stitch-reference/desktop/home.jpg` open screenshots of the Stitch designs, copied into [`../assets/stitch-reference/`](../assets/stitch-reference/) as **layout references only** (`07-design-system/imagery.md` section 8). The Stitch designs themselves are not part of the package (`00-README.md` section 5); contractors use `08-prototype/` and this folder. The screenshots contain obsolete texts (partly in Polish), PLN prices, invented products and an obsolete brand (`PIZZA_OS`, "Pizza MxDev", logo variants). None of that is authoritative: product names, prices, statuses and texts always come from the foundation files and `ui-copy.md`.

## 3. Conventions used in all screens

### 3.1 Notation

| Notation | Meaning |
|---|---|
| `Order.status` | An attribute from the information model |
| `{orderNumber}` | Placeholder in a text, filled at runtime (see `ui-copy.md` section 1) |
| **must / should / may** | MoSCoW Must / Should / Could (`00-README.md` 5.2). A line without a word is a must. |
| G, SIM | Guest (the only user role, Mendix `Anonymous`); Simulator (system actor) |
| "Desktop" / "tablet" / "phone" | Breakpoints from `tokens.md` section 5: ≥ 1200 px / 768–1199 px / 0–767 px |

### 3.2 Values and formats

- Money: `$1,024.00`, discounts `−$3.22` (BR-PRICE-11). Never PLN, € or any other currency.
- Dates `YYYY-MM-DD`, times `HH:mm` 24-hour, log times `HH:mm:ss`, store time zone `America/Los_Angeles` (BR-DATA-05).
- Countdowns `mm:ss` (e.g. `04:35`); clock time with a tilde for estimates (`~18:49`).
- Order number `MX-1048`; commit hash `#a3f9c2e`; temperatures in °F (`842°F`); distances in miles with one decimal (`2.8 mi`).
- Order status: the **dev label** is the visible badge (`IN_TRANSIT`), the **plain label** (`On the way`) is shown next to it to customers and is the badge's accessible name (`order-lifecycle.md` section 2). Status keys (`OUT_FOR_DELIVERY`) never appear in the UI.
- Every dev label whose meaning is not obvious has its plain meaning as a sub-label, tooltip or accessible name (glossary rule). The plain meaning to use is listed in `ui-copy.md`.

### 3.3 Live data

- Screens marked **LIVE** (SCR-01 build-status block and KPI tiles, SCR-05, SCR-08, SCR-09) show changes made by the simulator **within 5 seconds without a manual reload** (BR-ORD-20). Polling is acceptable.
- Counters and countdowns (`T+01:14`, `ETA 04:35`, bake timers) tick every second on the client between data refreshes; on each refresh they resynchronize with the server values.
- A live screen shows the `LIVE` indicator (`TXT-GEN-09`): a green pulsing dot with the text `LIVE`. When a refresh fails twice in a row, the shell shows the connection banner (`TXT-NAV-30`) until a refresh succeeds again, then a toast (`TXT-NAV-31`).
- Live updates must not reset what the user is doing: typed input, open dialogs, scroll position of lists and the selected row stay as they are. Log panes auto-scroll to the newest line only while the user is at the bottom of the pane.

### 3.4 Shared UI patterns

These patterns are used by many screens. Their look comes from `07-design-system/`; their behavior is defined here once.

| Pattern | Behavior |
|---|---|
| **Primary button** | Fill `color.primary.default`, text `color.primary.on`, `typography.label`. One primary button per region. Shows a spinner and stays disabled while its action runs, so a double click never triggers an action twice. |
| **Danger button** | Fill `color.error.default`. Always asks for confirmation. |
| **Disabled control** | `opacity.disabled`, `cursor: not-allowed`, and a visible reason (helper text under the control or a tooltip that is also its accessible description) wherever the reason is not obvious. |
| **Confirmation dialog** | Small centered dialog (phone: bottom sheet) with title, one-sentence body, a confirming button that names the action and a `Cancel` / `Keep …` button. `Esc`, the scrim and the close icon cancel. Focus starts on the safe button. Used for: clear cart, cancel order (payment sheet, SCR-09 payment banner), rollback. |
| **Toast** | Short message at the top right under the header (phone: top center under the header), above all other layers (`zIndex.toast`). Success and info toasts close after 4 s, warnings after 6 s; error toasts stay until closed; toasts with an action (e.g. `Undo`) stay at least 6 s; all have a close icon. At most 3 visible; a newer toast pushes the oldest out. Toasts are announced to screen readers (polite; errors assertive). Rule: FD-15 BR-ERR-08. |
| **Inline field error** | Text `color.error.text` under the field, field border `color.error.default`, message names the field (BR-DATA-08). Validation runs when the user leaves a field and again on submit; on submit the first invalid field gets focus. |
| **Form error summary** | On submit with errors, a box at the top of the form: "Lint failed: {n} env variables need attention." (`TXT-VAL-01`) listing each error as a link that focuses the field. |
| **Status badge** | `.subtle` background + status color text + 1 px border in the status color + dev label; accessible name = plain label. Colors from `tokens.md` 1.5. |
| **Terminal pane** | Surface `color.surface.lowest`, window-chrome dots, title in `typography.codeSmall`, lines `[HH:mm:ss] [TAG] message` colored by level (`tokens.md` 1.7). Read-only, selectable text. |
| **Code block** | Product recipe or `manifest.json` rendered as code with syntax colors (`tokens.md` 1.6). It is generated from data, never typed in. It is decorative for sighted users; the same information is available as plain text to assistive technology (e.g. a visually hidden list "Crust: Neapolitan Core, Sauce: …"). |
| **Product image** | 1 : 1, `radius.xl`. Image from `assets/products/<code>-<moduleKey>.jpg` (all 25 present); for a product without photo the placeholder from `assets/README.md` section 2 (`IMAGE_PENDING // <file name>`). Alt text from `Product.imageAlt`. |
| **Illustration placeholder** | Empty-state and error illustrations from `assets/illustrations/` are decoration (transparent PNG, shown whole). All are present except `no-results.png` (SCR-02): there show the placeholder block with Material Symbol `image` and `IMAGE_PENDING // <file name>`, or leave the illustration out; the empty-state text must work alone. |
| **Skeleton loading** | While a region loads for the first time, show grey blocks in the shape of its content with the caption `TXT-GEN-08` "> fetching…" for regions that take longer than 300 ms. Never show "0" or empty-state text before data has loaded. |
| **Stepper (quantity)** | `−` value `+`, value 1–10, `−` disabled at 1, `+` disabled at 10 with tooltip `TXT-MENU-16`. Touch targets ≥ 44 × 44 px on phone and tablet. |
| **Copy button** | Copies the value to the clipboard, shows toast `TXT-GEN-11` "Copied to clipboard."; if the clipboard is blocked, selects the text instead. |

### 3.5 Accessibility minimum (details in `11-non-functional/`)

- Every interactive element is reachable and operable by keyboard, in a logical order, with a visible focus ring (`color.border.focus`).
- Modals, drawers and dialogs trap focus, close with `Esc` (except the payment sheet while processing) and return focus to the control that opened them.
- Icon-only buttons have accessible names (listed in `ui-copy.md`).
- Status is never shown by color alone.
- Text can be zoomed to 200 % without loss of content; touch targets ≥ 44 × 44 px below 1200 px.
- `prefers-reduced-motion` is honored (`tokens.md` section 7).

### 3.7 Assumptions added by this folder

The UI specification adds the assumptions below (block A-60 – A-79 of the register, [ids-and-traceability.md](../01-product-brief/ids-and-traceability.md) section 1.2; numbers without a row here are not part of Lite). It also relies on A-20 (cart shows fee and tax as "calculated at checkout"; remembered order type). Every assumption is listed with its open question in [../open-questions.md](../open-questions.md).

| ID | Assumption | Where |
|---|---|---|
| A-61 | The header has no separate "Execute Order" button (the Stitch header button duplicated checkout); checkout is reached through `./checkout.yml`, the cart and the Terminal Debugger panel | SCR-16 |
| A-72 | Log views show only lines with `isCustomerVisible = true`; internal lines are stored but no Lite screen shows them | SCR-08, SCR-09 |
| A-73 | The home page KPIs are real demo numbers (deploys today, average pipeline time today, kitchen load, couriers on duty), not the invented Stitch figures (`99.9% uptime`, `12k+ nodes`) | SCR-01 |
| A-74 | The order confirmation cannot name the oven yet (an oven is assigned only when baking starts, BR-ORD-11); it shows "assigned when baking starts" and the live oven summary instead | SCR-08 |
