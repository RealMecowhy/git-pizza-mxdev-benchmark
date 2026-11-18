# SCR-04 — Item info (`module.info`)

| Field | Value |
|---|---|
| Type | Modal (phone: bottom sheet) |
| Roles | G |
| MoSCoW | Must |
| Functional area / epic | FD-02 / EP-02 |
| Rules, processes | BR-MENU (FD-02), BR-PRICE-01, BR-DATA-12, PR-01 |
| Prototype | [SCR-04-item-info.html](../../08-prototype/customer/SCR-04-item-info.html) |
| Stitch reference | No Stitch design (card and modal style from [`desktop/menu-and-cart.jpg`](../../assets/stitch-reference/desktop/menu-and-cart.jpg) and the UI kit [`desktop/ui-kit-asset-handover.jpg`](../../assets/stitch-reference/desktop/ui-kit-asset-handover.jpg)) |
| Images | product photo or placeholder |

## 1. Purpose

Show everything about one menu item that a careful customer needs before ordering — full description, serving, calories, allergens, diet, spice (and caffeine for drinks) — and let them add a side, drink or dessert to the cart with a quantity. For pizzas it is an allergen/nutrition view with a link to the configurator.

## 2. Entry and exit

| Entry | Exit |
|---|---|
| Info icon or card click (non-pizza) on SCR-01 / SCR-02; info icon on a pizza card | `+ import` → adds and closes, toast · `Configure this module →` (pizza) → SCR-03 · close icon, `Esc`, scrim, browser back → previous screen unchanged |

## 3. Layout (desktop)

Modal 640 px: header bar (title `module.info` + product path + close), body with image left (240 px) and details right, footer bar with quantity and add button.

## 4. Elements

| ID | Element | Type | Content / data source | Behavior | Validation / rules |
|---|---|---|---|---|---|
| E-01 | Title | heading | TXT-MENU-47 `module.info` + path TXT-MENU-27 | | dialog accessible name = `Product.name` |
| E-02 | Close | icon button | a11y TXT-GEN-04 | closes | |
| E-03 | Image | product image | photo or placeholder | | alt `Product.imageAlt` |
| E-04 | Name, dish, version | h2 + text + chip | `name`, `realWorldName`, `versionTag` | | |
| E-05 | Price | text | non-pizza: price (BR-PRICE-01); pizza: "from {Small price}" — all sizes listed in E-07 | | |
| E-06 | Description | text (Geist) | `Product.description` | | |
| E-07 | Facts | label/value list, labels TXT-MENU-48 | `SERVING` = `ProductSize.servingDescription` (pizza: one row per size with price, e.g. `Small 10" · 6 slices · $14.49`); `CALORIES` = TXT-MENU-49 (pizza TXT-MENU-52); `ALLERGENS` = full allergen names (TXT-STAT-37) or "No major allergens"; `DIET` = `<Vegetarian />`/`<Vegan />` or TXT-MENU-50; `SPICE` = TXT-STAT-34 or "Not spicy"; `CAFFEINE` (drinks) from the menu catalog | | pizza values are for the default configuration; note under ALLERGENS for pizzas: "Default build. Changes in the configurator update allergens." |
| E-08 | Allergen notice | small text | TXT-MENU-34 | | always shown |
| E-09 | Quantity | stepper | 1–10, default 1 | | non-pizza only |
| E-10 | Add | primary button | TXT-MENU-29 `+ import` (no amount on the button) | non-pizza: adds `{qty}` of the REGULAR size (merge rule as SCR-02/E-08i; if the sum exceeds 10 the line is set to 10 and TXT-MENU-16 is shown); pizza: adds 1 × the default configuration (BR-MENU-09; a removable ingredient that is out of stock is left out with TXT-CONF-25). Closes with toast TXT-MENU-35 / -36 | disabled when sold out |
| E-11 | Configure link | secondary button | TXT-MENU-51 | → SCR-03 | pizza only (shown next to E-10; E-09 is hidden for pizzas) |
| E-12 | Recipe code block | code | the full default-configuration code block of the pizza (BR-MENU-06, SCR-02 E-08e) without the line limit | decorative + visually hidden plain list | pizza only |

## 5. States

| State | What is shown |
|---|---|
| Default | as above |
| Sold out | badge `404: OUT_OF_STOCK` on the image, helper TXT-MENU-33, E-09 and E-10 disabled (pizza: E-11 still opens SCR-03 in its sold-out state) |
| Loading | modal frame with skeleton |
| Became sold out while open | updates within 5 s to the sold-out state |

## 6. Tablet and phone

Tablet: image on top, details below. Phone: bottom sheet up to 90 % height, drag handle, image 160 px, sticky bottom bar with quantity and `+ import`.

## 7. Stitch reference and deviations

No Stitch design. Allergen and nutrition content comes only from the menu catalog; the modal follows the modal pattern of the UI kit (glass header, 1 px border, `radius.lg`).
