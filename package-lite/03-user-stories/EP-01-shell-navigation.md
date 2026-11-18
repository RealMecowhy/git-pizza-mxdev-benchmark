# EP-01 — Shell, navigation and branding

| Epic | Functional area | Screens | MoSCoW | Story range |
|---|---|---|---|---|
| EP-01 | FD-01 Shell, navigation and branding | SCR-16 (frame of every screen) | Must | US-001 – US-012 |

**Goal.** Every screen sits in a consistent IDE-style frame that carries the Git Pizza MxDev brand, tells the visitor that the app is a demo and lets the guest reach every part of the shop in one or two clicks on desktop, tablet and phone.

Conventions: see [README.md](README.md). Roles: G guest, SIM simulator.

| ID | Title | Priority |
|---|---|---|
| US-001 | Customer header and main navigation | Must |
| US-002 | Project Explorer sidebar (desktop) | Must |
| US-003 | Phone bottom tab bar | Must |
| US-004 | DEMO MODE banner | Must |
| US-006 | Official brand and logo only | Must |
| US-007 | Storefront footer | Must |
| US-010 | Toast notifications | Must |
| US-011 | Responsive layout switch | Must |
| US-012 | Dev labels with plain meaning | Must |

---

### US-001 Customer header and main navigation

> As a **guest**, I want a persistent header with the main navigation, search and the cart button, so that I can reach every part of the shop from any page.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-16, SCR-01, SCR-02, SCR-05, SCR-06, SCR-09 | FD-01 | BR-NAV-* | PR-01 | — |

**Acceptance criteria**

1. **Given** any customer-area screen at a width of 768 px or more, **then** the header shows, left to right: the official logo (links to SCR-01), the navigation items `./main.js`, `./menu.ts`, `./checkout.yml`, `./track.log`, the search box `grep --pizza '…'` and the cart button with an item count; there is no account button.
2. **Given** the visitor is on SCR-02, **then** `./menu.ts` is shown as active (accent color `color.primary.light` and 2 px underline) and is exposed to assistive technology as the current page; the other items are not marked active.
3. **Given** the cart contains Inferno Payload × 1 and Mate Compiler Tonic × 2, **then** the cart button shows the count `3` (sum of quantities); **when** another item is added, **then** the count updates without a page reload.
4. **Given** the cart is empty, **when** the visitor focuses or hovers `./checkout.yml`, **then** the item is disabled, shows the hint that the manifest (cart) is empty and does not navigate. *(negative)*
5. **Given** the cart is not empty, **when** the visitor clicks `./checkout.yml`, **then** SCR-06 opens.
6. **Given** the visitor types `truffle` in the header search and presses Enter, **then** SCR-02 opens with the search results for `truffle` (US-027).
7. **Given** the visitor clicks the cart button, **then** the cart opens as a drawer on desktop and tablet (SCR-05).

**Notes.** `./track.log` behavior is specified in US-135. Header height 72 px (phone 56 px, see US-003). Exact texts are owned by `06-ui-specification/`.

---

### US-002 Project Explorer sidebar (desktop)

> As a **guest on a desktop screen**, I want an IDE-style file explorer on the left, so that I can jump to categories and my active order like files in a project.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-16 | FD-01 | BR-NAV-* | PR-01 | — |

**Acceptance criteria**

1. **Given** a customer-area screen at 1200 px or wider, **then** a 256 px sidebar titled `src/pizza-mxdev/` is shown with the items `Root`, `Categories`, `Active_Deployments` and the button `New Branch`.
2. **When** the visitor expands `Categories`, **then** the four category files `pizzas.json`, `sides.yml`, `drinks.env`, `desserts.md` are listed in that order; **when** one is clicked, **then** SCR-02 opens with that category tab active.
3. **When** the visitor clicks `Root`, **then** SCR-01 opens. **When** the visitor clicks `New Branch`, **then** SCR-02 opens on `pizzas.json`.
4. **Given** a guest whose order MX-1061, placed in this browser session, is in `BAKING`, **when** `Active_Deployments` is expanded, **then** it lists `MX-1061` with the `BAKING` badge; clicking it opens SCR-09 for that order.
5. **Given** a guest who placed an order in this browser session, **then** `Active_Deployments` lists that order (latest only); **given** a guest without an order in this session, **then** `Active_Deployments` is not shown (FD-01 4.1).
6. **Given** any visitor, **then** no `Logs` or `Settings` item and no account entry are shown. *(negative)*
7. **Given** a width between 768 and 1199 px, **then** the sidebar is collapsed to an icon rail or hidden behind a menu button; **given** a phone width, **then** it is not shown (navigation via US-003).

**Notes.** Item labels and their plain meaning: glossary section 1.1.

---

### US-003 Phone bottom tab bar

> As a **guest on a phone**, I want a bottom tab bar, so that the main areas are reachable with my thumb.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-16 | FD-01 | BR-NAV-* | PR-01 | — |

**Acceptance criteria**

1. **Given** a customer-area screen narrower than 768 px, **then** a bottom bar (64 px plus safe-area inset) shows three tabs: `Source` (Menu), `Deploy` (Cart), `Trace` (Track), each with icon, dev label and plain label available as accessible name.
2. **When** `Source` is tapped, **then** SCR-02 opens. **When** `Deploy` is tapped, **then** SCR-05 opens as a full page. **When** `Trace` is tapped, **then** the same target as `./track.log` opens (US-135).
3. **Given** the cart holds 3 items, **then** the `Deploy` tab shows a count bubble `3`; with an empty cart no bubble is shown.
4. **Given** the phone header (56 px), **then** it shows the logo (links to SCR-01) and the cart button; the desktop navigation items are not shown.
5. Every tab has a touch target of at least 44 × 44 px; the active tab is highlighted with `color.primary.light`.
6. **Given** a modal or bottom sheet is open, **then** it covers the tab bar (z-index rules in `tokens.md` section 6).
7. **Given** a phone width, **then** there is no fourth tab (no `Env` or account tab). *(negative)*

---

### US-004 DEMO MODE banner

> As **any visitor**, I want to be told on every screen that this is a demo with simulated payment, kitchen and delivery, so that I never mistake it for a real shop.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-16, SCR-40, SCR-41 | FD-01 | BR-NAV-* | — | — |

**Acceptance criteria**

1. **Given** any screen of the app (shop and error pages), **then** a 32 px `DEMO MODE` banner is visible at the top, stating that payments, kitchen and delivery are simulated and that no real order is placed or charged.
2. **Given** the banner, **then** it contains only the demo notice: no link or control for roles or accounts. *(negative)*
3. **Given** a phone width, **then** the banner shows a shortened text (e.g. `DEMO MODE · simulated`) on one line without horizontal scrolling.
4. The banner cannot be dismissed. *(negative: there is no close button)*

---

### US-006 Official brand and logo only

> As the **owner**, I want the app to use only the Git Pizza MxDev name and official logo, so that every contractor's result carries the same, correct brand.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-16, SCR-01, SCR-08, SCR-40, SCR-41 | FD-01 | BR-NAV-* | — | — |

**Acceptance criteria**

1. **Given** any screen, **then** the brand name is written `Git Pizza MxDev` and the only logo images used are the Pixel Slice files from `assets/brand/` (`07-design-system/logo-usage.md` section 3), with the accessible name `Git Pizza MxDev`.
2. **Given** a text search of the running app's screens, **then** none of these appear: `PIZZA_OS`, `Pizza MxDev Logo`, the triangle logo, logo variants 1–5, the cybernetic/minimalist/modern/neobrutalist or animated SVG logos, the previous raster "git tree pizza" logo. *(negative)*
3. **Given** the browser tab, **then** the page title follows TXT-GEN-23: `{Screen plain name} — Git Pizza MxDev` (e.g. `Menu — Git Pizza MxDev`); the home page is `Git Pizza MxDev — Architect Your Perfect Crust` (BR-NAV-18).
4. **Given** the header at 1440 px and at 390 px, **then** it shows `brand/logo-horizontal.svg` (desktop, tablet) or `brand/logo-mark.svg` (phone) without the brand name repeated as text next to the horizontal logo, every page has the favicon `brand/favicon.svg`, and the app does not create its own logo variant.
5. The tagline `Architect Your Perfect Crust.` appears on SCR-01 (US-021).

**Notes.** Logo usage rules: `07-design-system/logo-usage.md`. Images from outside `assets/` are not allowed.

---

### US-007 Storefront footer

> As a **guest**, I want a footer with the store's details and the allergen notice, so that I know who I am ordering from.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-16 | FD-01 | BR-NAV-* | — | — |

**Acceptance criteria**

1. **Given** a customer-area page scrolled to the bottom, **then** the footer shows the store line TXT-NAV-35 (`© {year} Git Pizza MxDev — Mission Kitchen · 2140 Folsom Street, San Francisco, CA 94110 · (415) 555-0142`), the version line TXT-NAV-36 (`./git-pizza-mxdev --version 1.0.0`) and the links `menu.ts`, `track.log` and `allergens.md` (TXT-NAV-37 – TXT-NAV-39; FD-01 4.1 step 5).
2. **When** `allergens.md` (TXT-NAV-39) is clicked, **then** a dialog shows the allergen notice text from `menu-catalog.md` (top of the file; TXT-MENU-34); `track.log` opens the target of BR-NAV-06.
3. **Given** the footer, **then** it contains no dead links. *(negative: Stitch links such as "Documentation", "Source Code", "Bug Report", "License" are not shown unless they lead to real content)*

---

### US-010 Toast notifications

> As **any user**, I want short confirmations and error notices that do not block my work, so that I know my action worked or why it did not.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-16 | FD-01 | BR-NAV-*, BR-ERR-* | — | — |

**Acceptance criteria**

1. **When** a guest adds Inferno Payload (Large 14") to the cart, **then** a success toast names the item (e.g. `Inferno Payload added to manifest`) and offers `View manifest`.
2. Success and info toasts disappear after 4 seconds, warning toasts after 6 seconds; error toasts stay until closed (BR-ERR-08).
3. Toasts appear top-right on desktop and tablet and at the top on phone, above all other layers (`zIndex.toast`), and stack at most 3; a fourth replaces the oldest.
4. Toasts are announced to screen readers (polite live region; errors assertive) and can be closed with the keyboard.
5. Toast text never contains technical error details (stack traces, IDs of internal objects). *(negative)*

---

### US-011 Responsive layout switch

> As **any user**, I want the app to work at phone, tablet and desktop widths, so that I can use it on any device.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | all screens | FD-01 | BR-NAV-* | — | — |

**Acceptance criteria**

1. **Given** the breakpoints phone 0–767 px, tablet 768–1199 px and desktop ≥ 1200 px (`tokens.md` section 5), **when** the window is resized across a boundary, **then** the layout switches without reload and without losing entered data.
2. **Given** any screen at 320 px width or more, **then** there is no horizontal page scrolling, except inside regions meant to scroll (tables, code blocks). *(negative)*
3. **Given** a phone width, **then** drawers (SCR-05) become full pages, modals SCR-04 and SCR-07 become bottom sheets, and interactive elements have touch targets of at least 44 × 44 px.
4. **Given** the reference width 390 px, **then** every screen SCR-01 – SCR-10 and SCR-13 can be completed end to end (browse, configure, cart, checkout, pay, track, receipt).
5. **Given** text zoom 200 %, **then** no content or function is lost.

---

### US-012 Dev labels with plain meaning

> As a **visitor who is not a developer**, I want every developer label to also tell me its plain meaning, so that I can use the shop without knowing git or CI/CD.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | all screens | FD-01 | BR-NAV-* | — | — |

**Acceptance criteria**

1. **Given** any dev label listed in `glossary.md` section 1, **then** its plain meaning is available on the same screen as sub-label, tooltip or accessible name (e.g. `MANIFEST.LOCK` → "Cart", `scale_factor` → "Size").
2. **Given** a button that spends money or cancels something, **then** its accessible name states the plain action: `Execute Order --force` → "Place order and pay", `Rollback order` → "Cancel order", `CLEAR (rm -rf)` → "Empty cart".
3. **Given** an order status badge (e.g. `IN_TRANSIT`), **then** the plain label from `order-lifecycle.md` section 2 ("On the way") is shown next to it or available as tooltip and accessible name.
4. **Given** status colors, **then** every badge also shows its label text; color is never the only carrier of meaning. *(negative)*

---
