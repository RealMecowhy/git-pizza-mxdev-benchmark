# SCR-02 — Menu (`./menu.ts`, module explorer)

| Field | Value |
|---|---|
| Type | Page (inside SCR-16) |
| Roles | G |
| MoSCoW | Must |
| Functional area / epic | FD-02 / EP-02 |
| Rules, processes | BR-MENU (FD-02), BR-PRICE-01, BR-DATA-10 – 12, BR-CART (FD-04, add), PR-01 |
| Prototype | [SCR-02-menu.html](../../08-prototype/customer/SCR-02-menu.html) |
| Stitch reference | desktop [`desktop/menu-and-cart.jpg`](../../assets/stitch-reference/desktop/menu-and-cart.jpg) · phone [`mobile/menu-mobile.jpg`](../../assets/stitch-reference/mobile/menu-mobile.jpg) |
| Images | `assets/products/<code>-<moduleKey>.jpg` (all 25 present); `illustrations/no-results.png` (missing, optional: placeholder or no illustration) |

## 1. Purpose

Browse the 25 menu items in four categories shown as file tabs, search them, see price, ingredients-as-code, allergens, dietary and spice badges, and add an item to the cart in one click or open the configurator. On desktop a "Terminal Debugger" panel shows the live cart summary.

## 2. Entry and exit

| Entry | Exit |
|---|---|
| `./menu.ts`; `git checkout menu` (SCR-01, empty states); sidebar `Categories` / category file / `New Branch`; header search; bottom tab `Source`; footer `menu.ts` / `allergens.md`; redirect from SCR-06 with empty cart | `Configure` → SCR-03 · info / card click → SCR-04 (non-pizza) or SCR-03 (pizza card click) · `+ import` → stays · `EXECUTE ORDER` → SCR-06 · `cat MANIFEST.LOCK` / phone summary bar → SCR-05 |

URL state: the selected category and the search query are part of the URL (deep link, navigation-map section 6).

## 3. Layout (desktop)

| Region | Content |
|---|---|
| R1 File tabs (top of content, `radius.none`, active tab with 2 px top border `color.primary.light`) | `pizzas.json`, `sides.yml`, `drinks.env`, `desserts.md` |
| R2 Heading | "Build Your Instance", code sub-line, search field, optional filter chips |
| R3 Product grid | 2 columns (3 columns ≥ 1440 px) |
| R4 Allergen notice | `allergens.md` block at the end of the list |
| R5 Terminal Debugger (right, 320 px, full height below the header, sticky) | live cart summary |

## 4. Elements

| ID | Element | Type | Content / data source | Behavior | Validation / rules |
|---|---|---|---|---|---|
| E-01 | Category tabs | tab list | `Category.fileName` with count of published products, sorted by `sortOrder` (TXT-MENU-22): `pizzas.json (12)`, `sides.yml (5)`, `drinks.env (5)`, `desserts.md (3)`; icons `javascript`, `description`, `settings`, `markdown` | click selects; default `pizzas.json`; arrow keys move between tabs. While a search is active, no tab is selected. | |
| E-02 | Heading | h1 | TXT-MENU-20 | | |
| E-03 | Code sub-line | code text | TXT-MENU-21 | decorative | |
| E-04 | Search | text input, icon `search`, shortcut hint `⌘F` / `Ctrl F` (desktop) | placeholder TXT-MENU-23; prefilled from the header search | filters as the user types (300 ms debounce) across **all** categories; matches (case-insensitive, substring) `Product.name`, `realWorldName`, `moduleKey`, `shortDescription` and the names of default ingredients and default crust/sauce/cheese options; `Esc` or `Clear search` clears | 2–40 characters; with 1 character no filtering and the hint TXT-MENU-64 (BR-MENU-10) |
| E-05 | Search result heading | text | TXT-MENU-24 | shown only while searching; results grouped by category with the category file name as a sub-heading | |
| E-06 | Filter chips | toggle chips | TXT-MENU-46 `--vegetarian`, `--vegan`, `--spicy` | combine with AND; filter the current tab or the search results; vegetarian also shows vegan items | **may** |
| E-07 | Product grid | list | published products of the selected category (or search result), by `sortOrder`. Sold-out products stay in the list at their position. | | archived and draft products never appear |
| E-08 | Product card | card (`color.surface.low`, 1 px border, `radius.md`, hover `color.surface.high` + `shadow.elevation1`) | see E-08a … E-08j | card click: pizza → SCR-03; other → SCR-04 | |
| E-08a | Path label | micro text | TXT-MENU-27 e.g. `./pizzas/inferno-payload.ts · v2.4` | | |
| E-08b | Name and dish | h3 + text | `Product.name` (`color.primary.light`) and `realWorldName` (`color.text.muted`), e.g. "Inferno Payload" / "Diavola" | | |
| E-08c | Price | text `color.success.text` | TXT-MENU-28 (BR-PRICE-01): `$18.49 · 12"` / `$4.50` | | |
| E-08d | Image | product image 1 : 1 (card: 16 : 10 crop of the square image, `object-fit: cover`) | `Product.image` (e.g. `pz-01-root-pizza.jpg`); placeholder `IMAGE_PENDING // <file name>` only for a product without photo | | alt = `Product.imageAlt` |
| E-08e | Code block | code | pizzas: `const pizza = { crust: '…', sauce: '…', cheese: '…', toppings: ['…', '…'] };` with the default crust/sauce/cheese option names and the recipe items' ingredient names in `sortOrder`; sauce `No Sauce (bianca)` and cheese `No Cheese` are written as `null`. Other items: `const {kind} = { serving: '…', kcal: … };` (`kind` = side, drink, dessert) | decorative + visually hidden plain list (README 3.4) | max 6 visible lines, then `…` |
| E-08f | Short description | text `typography.bodyLong` (Geist), 2 lines max | `Product.shortDescription` | | |
| E-08g | Badges | chips | dietary TXT-STAT-33 (from derived `isVegetarian`/`isVegan`), product badges TXT-STAT-32, spice TXT-STAT-34 | | max 4 chips, order: dietary, badges, spice |
| E-08h | Allergen line | micro text | TXT-MENU-32 from `Product.allergens` | | |
| E-08i | Actions | buttons | `+ import` (primary, TXT-MENU-29); pizzas also `Configure` (icon `tune`, TXT-MENU-30); info icon (TXT-MENU-31) | `+ import` adds 1 × the default configuration (pizza: default size Medium, default crust/sauce/cheese, no extras, no removals; other: REGULAR) to the cart. If a line with the same configuration exists, its quantity +1 (toast TXT-MENU-36), else a new line (toast TXT-MENU-35). Cart count in the shell and the Terminal Debugger update immediately. At quantity 10: toast TXT-MENU-16, nothing added. | disabled when not orderable (E-08j); a removable recipe ingredient that is sold out is left out of the default configuration automatically (BR-DATA-12) |
| E-08j | Sold-out state | overlay | badge TXT-STAT-35 `404: OUT_OF_STOCK` on the image (image grayscale 60 %), helper TXT-MENU-33 | `+ import` disabled; `Configure` still opens SCR-03 in its sold-out state; info still opens | applies when `Product.isOrderable = false` (manual sold out, fixed ingredient or default option unavailable); live (≤ 5 s) |
| E-09 | No-results state | empty state | illustration `illustrations/no-results.png` (optional) + TXT-MENU-25 + button TXT-MENU-26 | `Clear search` clears E-04 and returns to the last tab | |
| E-10 | Allergen notice | text block with heading `allergens.md` | TXT-MENU-34 | the same text that the footer link `allergens.md` opens in a dialog (FD-01 4.1 step 5) | always shown at the end of every tab and of search results |
| E-11 | Terminal Debugger | side panel | title TXT-MENU-38, sub-title TXT-MENU-39, LIVE-style sensor icon `sensors` | live view of the cart | desktop ≥ 1200 px only |
| E-11a | Panel log | terminal lines | empty cart: TXT-MENU-40 with blinking cursor; with lines: TXT-MENU-41 (one `[OK]` line per cart line, max 8, then `… {k} more`) | updates immediately after cart changes | |
| E-11b | Total | label + value | TXT-MENU-42; value = cart subtotal − discount preview, `color.success.text` | | |
| E-11c | `EXECUTE ORDER` | button (fill `color.success.default`, text `color.success.on`, icon `terminal`) | TXT-MENU-43 | → SCR-06 | disabled with TXT-NAV-06 when the cart is empty |
| E-11d | `cat MANIFEST.LOCK` | link | TXT-MENU-44 | opens SCR-05 | |
| E-11e | Build line | micro text | TXT-MENU-56 | decorative | |
| E-12 | Phone summary bar | sticky bar | icon `layers` + TXT-MENU-55 | → SCR-05 | phone only, visible when the cart is not empty |

## 5. States

| State | What is shown |
|---|---|
| Loading | tabs render; grid shows 4 skeleton cards; caption TXT-MENU-45 after 300 ms |
| Results | grid with cards |
| No search results | E-09 |
| Category without published products (possible after menu changes) | TXT-MENU-53 "`{fileName}` is empty right now. Try another tab." |
| Item sold out | E-08j on that card |
| Add failed (became sold out after page load) | toast TXT-MENU-37; card switches to E-08j |

## 6. Tablet and phone

Tablet: sidebar hidden, opened as an overlay drawer by the `menu` button in the header (`responsive-behaviour.md`); no Terminal Debugger; 2-column grid; tabs scroll horizontally. Phone (Stitch `menu-mobile`): header line TXT-MENU-54, search field, file tabs as a horizontally scrolling row, one card per row (image on top, JSON-style code block, `+ import` and `Configure` side by side at the bottom), sticky summary bar E-12 above the bottom tabs.

## 7. Stitch reference and deviations

- Stitch desktop card names `Margherita.ts`, `OverclockedPepperoni.jsx`, `SystemAdminVeg.go`, `KernelPanicMeat.py`, prices `$14.00`, `$18.50`, `$16.25`, `$21.00`, and button labels `npm install pizza`, `git push origin cart`, `go run order`, `python3 order.py` are invented. Authoritative: product names, prices and the single button label `+ import` from the menu catalog and `ui-copy.md`. (The language-specific code styles are dropped in favor of one consistent code block.)
- Stitch tabs `pizzas.json`, `drinks.yml`, `desserts.md` (desktop) and `pizzas.json`, `crust_addons.yml`, `beverages.env`, `desserts.sh` (phone) → the four tabs of the menu catalog section 1. Crust add-ons are configurator options, not a category (`runtime_drivers.yml` / "Garlic Dip driver", "Stuffed Crust hook" on the phone design are dropped from the menu).
- Stitch phone prices in PLN / € and `SCU: 8.5K`, `0g TRANS_FAT`, `ZERO_DEP` chips → USD prices; spice uses TXT-STAT-34; invented chips dropped.
- Stitch desktop card photos partly contain screenshots of the app itself: use only images from `assets/products/` or the placeholder.
- Stitch `Total Output: $0.00` / `EXECUTE ORDER` panel kept as Terminal Debugger (E-11) with live values.
