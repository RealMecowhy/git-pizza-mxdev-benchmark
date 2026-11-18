# SCR-16 — Customer shell and navigation

| Field | Value |
|---|---|
| Type | Shell (persistent frame around SCR-01 – SCR-10 and SCR-13) |
| Roles | G |
| MoSCoW | Must |
| Functional area / epic | FD-01 / EP-01 |
| Rules, processes | BR-NAV (FD-01), BR-ORD-20 (live) |
| Prototype | [SCR-16-customer-shell.html](../../08-prototype/customer/SCR-16-customer-shell.html) |
| Stitch reference | desktop header/sidebar/footer: [`desktop/menu-and-cart.jpg`](../../assets/stitch-reference/desktop/menu-and-cart.jpg), [`desktop/home.jpg`](../../assets/stitch-reference/desktop/home.jpg) · phone bottom bar: [`mobile/menu-mobile.jpg`](../../assets/stitch-reference/mobile/menu-mobile.jpg) |
| Logo | [`assets/brand/logo-horizontal.svg`](../../assets/brand/logo-horizontal.svg), phone [`assets/brand/logo-mark.svg`](../../assets/brand/logo-mark.svg); favicon `assets/brand/favicon.svg` |

## 1. Purpose

The frame every customer screen lives in: brand, navigation, cart access, the permanent DEMO MODE notice, the connection banner, toasts and the footer. Lite has no account access. Navigation rules are in [../navigation-map.md](../navigation-map.md) section 3.

## 2. Entry and exit

Present on every customer screen. It links to SCR-01, SCR-02, SCR-05, SCR-06, SCR-09/SCR-10.

## 3. Layout (desktop)

| Region | Content |
|---|---|
| R1 Banner stack | DEMO MODE (always) · CONNECTION_LOST (refresh failing) |
| R2 Header (sticky, 72 px, `color.surface.container`, bottom border `color.border.strong`) | horizontal logo · nav links · search · cart button |
| R3 Project Explorer sidebar (256 px, left, below the header) | path, items, `New Branch` at the bottom |
| R4 Main content | the screen |
| R5 Footer | store line, version, links |
| R6 Toast area | top right under the header (phone: top center under the header), above all other layers (FD-15 BR-ERR-08) |

## 4. Elements

| ID | Element | Type | Content / data source | Behavior | Validation / rules |
|---|---|---|---|---|---|
| E-01 | DEMO MODE banner | banner, 32 px, `color.surface.lowest`, text `color.warning.default` label + `color.text.secondary` | TXT-NAV-28 (phone TXT-NAV-29); no link (US-004) | Not dismissible. Visible on every screen including the error pages. | must be the first visible element of every screen |
| E-04 | CONNECTION_LOST banner | banner, `color.error.subtle` | TXT-NAV-30 | after two failed refreshes in a row; hides on the next success with toast TXT-NAV-31 | |
| E-05 | Skip link | link | TXT-NAV-34 | visible on keyboard focus only; moves focus to R4 | |
| E-06 | Logo | image | `assets/brand/logo-horizontal.svg`, 32 px high (tablet 32 px); phone `assets/brand/logo-mark.svg` 32 px. The wordmark inside the file shows the brand name (TXT-NAV-01); no live-text name next to it. Usage rules in `07-design-system/logo-usage.md`. | click → SCR-01 | link name "Git Pizza MxDev — home", image `alt=""` |
| E-07 | Nav links | links | TXT-NAV-02 … 05 | active link underlined 2 px `color.primary.light`, `aria-current="page"`. `./checkout.yml` is disabled while the cart is empty, with tooltip TXT-NAV-06. `./track.log` follows navigation-map 3.4. | |
| E-08 | Search | text input with `search` icon | placeholder TXT-NAV-07 | Enter (or 300 ms after typing stops while already on SCR-02) opens SCR-02 with the query; `Esc` clears | trimmed; up to 40 characters; empty → no action; with 1 character SCR-02 shows the hint TXT-MENU-64 and no filtering (BR-MENU-10) |
| E-09 | Cart button | icon button `shopping_cart` + count bubble | count = `Cart.itemCount`; a11y TXT-NAV-08 | opens SCR-05 drawer (phone: page). Bubble hidden at 0, shows `9+` above 9. The count updates immediately after every cart change. | |
| E-11 | Project Explorer | sidebar | TXT-NAV-15, TXT-NAV-16, items TXT-NAV-17, 18, 19, 22 | per navigation-map 3.2. `Categories` toggles a sub-list of the 4 category files with item counts (published products). Current item highlighted. | no `Logs` or `Settings` items in Lite |
| E-12 | Footer | footer | TXT-NAV-35, TXT-NAV-36, links TXT-NAV-37 … 39 | per navigation-map 3.5 | `{year}` is the current year in store time |
| E-13 | Toast area | region | toasts from all screens | README section 3.4 | |
| E-14 | Phone bottom tabs | tab bar 64 px + safe area | 3 tabs TXT-NAV-24 … 26 with icons `code`, `rocket_launch`, `terminal`; count bubble on `Deploy` | navigation-map 3.3; active tab in `color.primary.light` with `color.surface.high` background | phone only |

## 5. States

| State | What is shown |
|---|---|
| Cart empty | no count bubble; `./checkout.yml` disabled with TXT-NAV-06 |
| Cart non-empty | count bubble; `./checkout.yml` enabled |
| Connection lost | E-04 visible |
| Loading (first page load) | header and sidebar render immediately; content regions show skeletons |

## 6. Tablet and phone

See [../responsive-behaviour.md](../responsive-behaviour.md) section 2. Phone: header shows logo and cart only; the sidebar is replaced by the bottom tabs; search lives on SCR-02.

## 7. Stitch reference and deviations

- Stitch header shows a "Execute Order" button: **dropped** (A-61).
- Stitch shows "Pizza MxDev" / "Git Pizza // MxDev" / `~/pizza-os` and a grey "img" placeholder instead of the logo: the brand is **Git Pizza MxDev** with the official Pixel Slice logo only (horizontal logo; mark on phone).
- Stitch footer "© 2024 Pizza MxDev. All modules compiled successfully." and links Documentation / Source Code / Bug Report / License: replaced by TXT-NAV-35 … 40 (these links lead nowhere in a real shop).
- Stitch phone bottom tabs exist in two variants (`Home · Menu · Cart · Account` inside the desktop menu HTML, and `Source · Deploy · Trace · Env` on the phone screens). Authoritative: `Source · Deploy · Trace` with plain accessible names (glossary 1.1); the `Env` (account) tab is not part of Lite.
- Stitch phone header "Source Menu · LIVE · shopping_bag 0" is the SCR-02 phone header; the `LIVE` chip is not part of the shell.
- The DEMO MODE banner and the connection banner have no Stitch design; they are required by the product brief and FD-01.
