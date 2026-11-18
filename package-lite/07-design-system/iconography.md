# Iconography

Two icon sources only:

1. **Material Symbols Outlined** for all UI icons.
2. **Three brand icons** in `assets/icons/` for the pizza-module, terminal and pipeline motifs.

No other icon set, emoji, hand-drawn SVG or icon font may be used. Tokens: [tokens.md](tokens.md) section 8. Components that use the icons: [components.md](components.md).

---

## 1. Material Symbols Outlined

| Property | Value |
|---|---|
| Font | Material Symbols Outlined (Google, Apache License 2.0) |
| Axes | `FILL 0`, `wght 400`, `GRAD 0`, `opsz` = displayed size (20 or 24) |
| Filled variant | `FILL 1` is used only for: active bottom tab icon, checked state inside a selected radio card's leading icon, the LIVE/status dots (which are shapes, not icons). Nowhere else |
| Sizes | `icon.size.sm` 16 px (inline with `label`/`micro` text, badges), `md` 20 px (buttons, inputs, sidebar), `lg` 24 px (default; header, bottom tabs, stepper on desktop), `xl` 32 px (empty states, placeholders, feature tiles) |
| Color | Inherits the text color of its component; decorative accent icons use `color.primary.light`; status icons use the status color (components.md 4.1) |
| Alignment | Vertically centered with the text; gap `space.2` to the label |
| Loading | The font should be bundled with the app (no runtime dependency on a third-party CDN), so icons render offline and without layout shift; until the font is loaded, icon text (ligature names like `shopping_cart`) must not be visible (hide or reserve the box) |

### 1.1 Icon vocabulary

Each meaning has exactly one icon. An icon may appear in several rows only where the meanings are the same idea (for example `rocket_launch` = deploy: the Deploy tab, `Active_Deployments`, `Execute Order --force`, `PRODUCTION`). Use the names exactly as listed (they are Material Symbols ligature names).

#### Shell and navigation

| Icon | Meaning | Where |
|---|---|---|
| `shopping_cart` | Cart (manifest) | Header cart button |
| `search` | Search | Search input on phone, search icon button on tablet |
| `menu` / `menu_open` | Open / close sidebar | Tablet header |
| `close` | Close overlay, clear input | Modals, drawers, sheets, prompt inputs |
| `arrow_back` | Back | Phone page header (configurator, checkout) |
| `arrow_forward` | Go on / navigate | Trailing icon of navigation CTAs |
| `chevron_right` / `expand_more` / `expand_less` | Drill-in / expand / collapse | Lists, accordions, select |
| `folder`, `list`, `rocket_launch` | Project Explorer items Root, Categories, Active_Deployments | Customer sidebar |
| `code`, `rocket_launch`, `terminal` | Bottom tabs Source (menu), Deploy (cart), Trace (track) | Phone bottom tabs |
| `science` | Demo mode | Demo-mode banner |

#### Menu and configurator

| Icon | Meaning | Where |
|---|---|---|
| `data_object`, `description`, `local_drink`, `markdown` | File icons of `pizzas.json`, `sides.yml`, `drinks.env`, `desserts.md` | File tabs, sidebar tree |
| `add` | `+ import` (add to cart) | Menu card button (leading) |
| `tune` | Configure pizza | Menu card icon button |
| `info` | Item details, help | Menu card (non-pizza), tooltips trigger |
| `eco` | Vegetarian / vegan tag | Product tags |
| `local_fire_department` | Spice level (repeated 1–3×) and BAKING | Spice tag, status |
| `memory` | `core_kernel` (crust) group | Configurator group header |
| `layers` | `base_layer` (sauce) group | Configurator group header |
| `water_drop` | `cheese_driver` (cheese) group | Configurator group header |
| `extension` | `dependencies` (extras) group | Configurator group header |
| `link_off` | Unlink (remove default ingredient) | Configurator recipe list |
| `data_object` | `manifest.json` preview | Configurator |
| `straighten` | `scale_factor` (size) group | Configurator group header |

#### Cart, checkout, payment

| Icon | Meaning | Where |
|---|---|---|
| `add` / `remove` | Increase / decrease quantity | Quantity stepper |
| `edit` | Edit configuration / edit record | Cart line |
| `delete` | `rm` (remove line) | Cart line |
| `delete_sweep` | `CLEAR (rm -rf)` empty cart | Cart footer |
| `lock` | `MANIFEST.LOCK` title | Cart drawer header |
| `sell` | Coupon | Coupon input |
| `local_shipping` | Delivery | Order type, stepper stage 4 (delivery) |
| `store` | Pickup / store | Order type, stepper stage 4 (pickup), courier at store |
| `location_on` | Address | Address fields |
| `credit_card` | Card payment, test card | Payment options, STAGED |
| `credit_card_off` | Payment failed | Status badge, payment sheet |
| `account_balance_wallet` | Apple Pay / Google Pay (wallet) | Payment options |
| `paid` | Paid | Payment status |
| `currency_exchange` | Refunded | Payment status, refund note |
| `content_copy` / `check` | Copy / copied | Copyable values |
| `receipt_long` | Receipt | Order detail, confirmation |
| `rocket_launch` | Deploy (place order) | `Execute Order --force` leading icon |

#### Order pipeline and status

| Icon | Meaning |
|---|---|
| `hourglass_empty` | QUEUED, waiting (`WAITING_FOR_COURIER`) |
| `local_fire_department` | BAKING |
| `fact_check` | QA_CHECK |
| `package_2` | DISPATCH_READY |
| `store` | READY_TO_PULL |
| `moped` | IN_TRANSIT (scooter courier), courier |
| `electric_bike` / `directions_car` | E-bike / car courier |
| `check_circle` | DEPLOYED, success |
| `done_all` | PULLED |
| `undo` | ROLLED_BACK |
| `check` | Completed stepper node, checkbox |
| `progress_activity` | Loading / processing (rotating) |
| `schedule` | Elapsed time, ETA |
| `near_me` | Courier on the way to the store |
| `u_turn_left` | Courier returning |
| `bedtime` | Courier off duty |
| `home_pin` | Delivery destination (map) |
| `storefront` | Store (map marker) |
| `map` | Map fallback when the map image cannot be loaded |

#### Home page KPIs

| Icon | Meaning |
|---|---|
| `timer` | KPI `AVG_PIPELINE_TIME` |
| `local_fire_department` | KPI `KITCHEN_LOAD` (same idea as BAKING) |
| `electric_moped` | KPI `COURIERS_ON_DUTY` |
| `trending_up` | KPI trend (optional) |

#### Feedback

| Icon | Meaning |
|---|---|
| `info` | Information |
| `check_circle` | Success |
| `warning` | Warning |
| `error` | Error, invalid field |
| `report` | Error page |
| `block` | Sold out, not allowed |
| `image` | Non-product image placeholder |

### 1.2 Stitch icons not carried over

Stitch also used `chat`, `call`, `support_agent`, `notifications`, `bug_report`, `fingerprint`, `satellite_alt`, `sync_saved_locally`, `cyclone`, `oven_gen`, `hub`, `integration_instructions`, `javascript`, `folder_zip`, `variable_insert`, `settings_ethernet`, `settings_input_component`, `database`, `monitor_heart`, `verified_user`, `radio_button_checked`/`_unchecked` (as icons), `bolt`, `keyboard_return`, `commit`, `play_arrow`, `cleaning_services`, `coffee`, `icecream`, `cloud_upload`. They belonged to dropped features (chat, support, notifications, SSH) or decorative flourishes. Do not use them unless `06-ui-specification/` assigns one a meaning that is not already covered by section 1.1.

### 1.3 Accessibility

- Icons next to visible text are decorative (`aria-hidden="true"`).
- Icon-only buttons have an accessible name and a tooltip (components.md 2.2).
- Status icons never appear without their label (components.md 4.1).
- Icons used as indicators of state (e.g. `check` on a completed step) are backed by text for screen readers ("completed").

---

## 2. Brand icons (`assets/icons/`)

| File | Artwork | Meaning | Use |
|---|---|---|---|
| `icon-pizza-module.svg` / `.png` | Orange pizza slice with three red pepperoni dots, 48 × 48 viewBox | A menu item as a "module" | Image placeholder center icon (assets README), module counts (`PACKAGE_RESOLVED` bar, cart drawer header), loading indicator next to `Fetching inventory…` |
| `icon-terminal-cli.svg` / `.png` | Green terminal window with `>_` prompt | Terminal, live log | Log panel title (optional, instead of `terminal`), empty log |
| `icon-ci-cd-pipeline.svg` / `.png` | Four nodes (orange, green, green, cyan) connected by grey edges | The order pipeline | Tracking page heading, "How it works" steps on home |

Rules:

- **SVG first.** Use the SVG; the PNG (96 × 96, 2× of 48) is the fallback where SVG is not possible.
- **Sizes:** 24, 32 or 48 px only. Below 24 px the details disappear; use a Material Symbol instead (`local_pizza`, `terminal`, `account_tree`).
- **Colors are fixed.** The artwork is multicolor and must not be recolored, outlined or filled differently. It is designed for dark surfaces (`surface.lowest` … `surface.highest`) only.
- **Not interactive on their own.** When a brand icon sits in a button, the button has a text label or an accessible name.
- **Decorative** (`alt=""`) when next to text; otherwise `alt` = meaning ("Pizza module", "Terminal", "Pipeline").
- Their colors are artwork colors (they include `#ef4444` and `#9ca3af`, which are not tokens); this is allowed for these three files only.
- **Not the logo.** `icon-pizza-module` is a UI icon, not the Pixel Slice logo; never use it in place of the logo, and never use the logo mark as an icon (logo-usage.md). The browser-tab icon is the logo's pixel mark `assets/brand/favicon.svg`, not a brand icon.
- New brand icons are not created by contractors. If more are needed, the owner delivers them into `assets/icons/`.

---

## 3. Checks

| Check | Pass criterion |
|---|---|
| I-1 | Every icon in the app is either a Material Symbols Outlined glyph or one of the three brand icons |
| I-2 | The meanings in section 1.1 are used consistently (e.g. `delete` always removes, `undo` always means rolled back / undo) |
| I-3 | No ligature text (e.g. the word `shopping_cart`) is ever visible, also on slow connections |
| I-4 | Every icon-only button has an accessible name (accessibility.md AC-01) |
