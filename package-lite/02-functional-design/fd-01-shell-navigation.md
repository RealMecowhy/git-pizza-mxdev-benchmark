# FD-01 — Shell, navigation and branding

| Item | Value |
|---|---|
| Epic | EP-01 (US-001 – US-020, TC-001 – TC-020) |
| Roles | Guest (`Anonymous`) |
| Screens | SCR-16 Customer shell (frame around every other screen) |
| Processes | PR-01 Guest ordering journey |
| Simulations | — |
| Objects | `StoreSettings`, `Cart`, `Order` |
| Priority | Must |

Related: [README](README.md) · [glossary](../01-product-brief/glossary.md) section 1.1 · [tokens](../07-design-system/tokens.md) section 5 · information model sections 2 and 10 (guest session, access rights) · FD-15 (errors, toasts).

---

## 1. Purpose

The shell is the frame every screen sits in. It carries the brand, the navigation, the permanent DEMO MODE notice and the cart entry point. It decides which screens exist for the guest and switches between the desktop, tablet and phone layouts.

## 2. Actors and access

| Actor | Shell | What they get |
|---|---|---|
| Guest | SCR-16 | Header, sidebar, bottom tabs (3), footer, cart, DEMO MODE banner, toasts |

There is no account button, no sign-in entry point, no role switch and no staff shell in Lite.

### 2.1 Screen access matrix

"token" = an order the guest's session may open: placed or looked up in this browser session, or opened with its tracking link (LITE-SES-03). Every other URL — unknown, or of a screen that is not in Lite — shows SCR-40 (BR-NAV-16).

| Screen | Guest |
|---|---|
| SCR-01 Home, SCR-02 Menu, SCR-03 Configurator, SCR-04 Item info | yes |
| SCR-05 Cart, SCR-06 Checkout, SCR-07 Payment, SCR-08 Confirmation | yes |
| SCR-09 Order tracking | token |
| SCR-10 Track order lookup | yes |
| SCR-13 Order detail and receipt | token (read-only) |
| SCR-40, SCR-41 Error pages | yes |

## 3. Preconditions

- The app is reachable at its (local) URL. No sign-in exists; every visitor is a guest with an anonymous session (LITE-SES-01).
- `StoreSettings` and `SimulationSettings` exist (they always do; see information model section 7.5–7.6).

## 4. Behaviour

### 4.1 Customer shell (SCR-16)

1. **DEMO MODE banner** (top, above the header, 32 px). Text TXT-NAV-28 (desktop and tablet) or TXT-NAV-29 (phone). The banner is shown on every screen of the app, including the error pages. It has no link.
2. **Header**, left to right:
   - Logo: the horizontal logo `assets/brand/logo-horizontal.svg` (its wordmark shows the brand name TXT-NAV-01; phone: the mark `logo-mark.svg`); click opens SCR-01.
   - Navigation (desktop and tablet): TXT-NAV-02 `./main.js` (SCR-01), TXT-NAV-03 `./menu.ts` (SCR-02), TXT-NAV-04 `./checkout.yml` (SCR-06), TXT-NAV-05 `./track.log` (BR-NAV-06). The item of the current screen is highlighted.
   - Search box TXT-NAV-07 `grep --pizza '…'` (desktop and tablet): Enter opens SCR-02 with the search applied (FD-02, BR-MENU-10).
   - Cart button (`shopping_cart` icon) with item-count bubble; opens the cart (SCR-05).
3. **Project Explorer sidebar** (desktop only, 256 px), titled TXT-NAV-15 `Project Explorer` with the path line TXT-NAV-16 `src/pizza-mxdev/`:

   | Item | Target | Visible |
   |---|---|---|
   | `Root` | SCR-01 | always |
   | `Categories` (expands to `pizzas.json`, `sides.yml`, `drinks.env`, `desserts.md`) | SCR-02 with that tab | always |
   | `Active_Deployments` | The last order placed or looked up in this browser session (opens SCR-09) | only when such an order exists |
   | `New Branch` (button) | SCR-02, `pizzas.json` tab | always |

   On tablet the sidebar is hidden; a `menu` icon button at the left of the header opens it as an overlay drawer with the same items (`responsive-behaviour.md`, components 7.5). On phone there is no sidebar. The items `Logs` and `Settings` of the full product are not in Lite.
4. **Phone bottom tab bar** (phone only), three tabs: `Source` (SCR-02), `Deploy` (SCR-05, with item-count bubble), `Trace` (BR-NAV-06). The logo in the phone header opens SCR-01.
5. **Footer**: logo (small), the store line TXT-NAV-35 (store name, address, phone), the version line TXT-NAV-36, and the links TXT-NAV-37 `menu.ts` (SCR-02), TXT-NAV-38 `track.log` (target per BR-NAV-06) and TXT-NAV-39 `allergens.md` (opens the allergen notice text of the menu catalog in a dialog).
6. **Toast area** for notifications (FD-15, BR-ERR-08).

### 4.2 Staff shell

Not in Lite.

### 4.3 Responsive switch

The layout follows the breakpoints in `tokens.md` section 5: phone 0–767 px, tablet 768–1199 px, desktop ≥ 1200 px. The same URL shows the same screen at every width; only the layout changes. Resizing the browser window across a breakpoint switches the layout without reload and without losing entered data.

## 5. Business rules

| ID | Rule | Priority |
|---|---|---|
| BR-NAV-01 | The only logo is the Pixel Slice logo family in `assets/brand/` (`07-design-system/logo-usage.md`): horizontal logo in the header (mark only on phone) and on SCR-40 and SCR-41; mark on SCR-01 hero, SCR-08 and in the footer; favicon on every page. Its accessible name is "Git Pizza MxDev". | Must |
| BR-NAV-02 | The brand name is written exactly `Git Pizza MxDev`. The texts `PIZZA_OS`, `Pizza MxDev` without "Git", `Pizza MxDev Logo`, any Stitch logo variant and the triangle logo appear nowhere in the app (UI, page titles, footer, error pages, data). | Must |
| BR-NAV-03 | The DEMO MODE banner (4.1 step 1) is visible on every screen and cannot be dismissed. It has no role switch and no link. | Must |
| BR-NAV-04 | The header shows the four navigation items of 4.1 step 2 on desktop and tablet. The item for the current screen is visibly active (color and underline) and has `aria-current="page"`. | Must |
| BR-NAV-05 | `./checkout.yml` (header) is disabled while the cart is empty; hover or focus shows "Your manifest is empty. Import a module first." (TXT-NAV-06) When the cart has lines it opens SCR-06. | Must |
| BR-NAV-06 | `./track.log` (header), `Trace` (phone tab) and `Active_Deployments` (sidebar) open the most recent order placed, looked up or opened with its tracking link in this browser session (any status): its SCR-09. Without such an order, `./track.log` and `Trace` open SCR-10. | Must |
| BR-NAV-07 | The cart count bubble shows `Cart.itemCount` (sum of quantities). It is hidden when the count is 0, shows `9+` above 9, and updates immediately after every cart change made in the same browser tab. Other open tabs update on their next navigation or refresh. | Must |
| BR-NAV-08 | Not used in Lite (account button). | — |
| BR-NAV-09 | Sidebar items and their visibility follow the table in 4.1 step 3. | Must |
| BR-NAV-10 | On phone (≤ 767 px) the shell shows the bottom tab bar of 4.1 step 4 (three tabs) instead of the header navigation and sidebar. The active tab is highlighted. Tap targets are at least 44 × 44 px. | Must |
| BR-NAV-11 | Submitting the header search box opens SCR-02 with the entered text as the search (FD-02). An empty search box does nothing. | Must |
| BR-NAV-12 | Not used in Lite (intake-paused banner; intake is always `OPEN`). | — |
| BR-NAV-13 | Not used in Lite (staff header chips). | — |
| BR-NAV-14 | Not used in Lite (intake chip). | — |
| BR-NAV-15 | Not used in Lite (browse-only mode for staff). | — |
| BR-NAV-16 | Only the screens of section 2.1 exist. A URL of any other screen, including screens of the full product that are not in Lite (login, sign-up, profile, address and staff screens), and any unknown URL show SCR-40 (FD-15, BR-ERR-01). An order URL the session has no token for shows SCR-40 as well (LITE-SEC-03); a tracking link with an invalid or outdated token shows the invalid-link state of SCR-09 (BR-TRK-21). Navigation items for screens that are not in Lite are not shown. | Must |
| BR-NAV-17 | Layout follows 4.3. No horizontal page scrolling at any width ≥ 320 px, except inside explicitly scrollable regions (tables, code blocks). | Must |
| BR-NAV-18 | The browser tab title follows TXT-GEN-23 (`{Screen plain name} — Git Pizza MxDev`, e.g. `Menu — Git Pizza MxDev`, `Order MX-1048 — Git Pizza MxDev`); the home page uses `Git Pizza MxDev — Architect Your Perfect Crust`. | Should |
| BR-NAV-19 | The footer (4.1 step 5) is shown on all screens of the shell. The error pages use a minimal frame without footer (BR-ERR-04). | Must |
| BR-NAV-20 | Every dev label used as navigation or action text has its plain meaning available as tooltip or accessible name (glossary). Examples: `./menu.ts` → "Menu", `Deploy` tab → "Cart", `Trace` tab → "Track order". | Must |
| BR-NAV-21 | Not used in Lite (landing page after sign-in). The logo always opens SCR-01. | — |

## 6. Data read and written

| Object | Read | Written |
|---|---|---|
| `StoreSettings` | `storeName`, `addressLine`, `phone` | — |
| `Cart` | `itemCount` | — |
| `Order` | last order of the guest session (BR-NAV-06) | — |

## 7. States touched

Reads the order status of the session's last order for `Active_Deployments` (order-lifecycle section 2). Changes no state.

## 8. Errors and edge cases

| Case | Behaviour | Message |
|---|---|---|
| Guest opens a URL of a screen that is not in Lite (for example an old login, profile or kitchen link) | SCR-40 (BR-NAV-16) | `ERROR 404 // CRUST_NOT_FOUND` |
| Cart emptied in another tab | `./checkout.yml` state updates on next navigation in this tab; opening SCR-06 with an empty cart redirects (BR-CHK-01) | "Your manifest is empty." |
| The session's last order is deleted by a demo reset | `Active_Deployments` disappears on the next refresh; `./track.log` opens SCR-10 | — |
| Logo image fails to load | The logo link keeps its accessible name "Git Pizza MxDev — home" and shows the brand name as text in place of the image (there is no separate live-text name next to the logo, SCR-16 E-06); no broken-image icon is shown | — |
| Width below 320 px | Not supported; layout may scroll horizontally | — |

## 9. Notifications

In-app only (no email, SMS or push; product brief section 3.2):

- DEMO MODE banner (permanent).
- Toasts are positioned and timed by FD-15 (BR-ERR-08).
