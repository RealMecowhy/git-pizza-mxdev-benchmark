# FD-02 — Menu browsing (module explorer)

| Item | Value |
|---|---|
| Epic | EP-02 (US-021 – US-040, TC-021 – TC-040) |
| Roles | Guest |
| Screens | SCR-01 Home, SCR-02 Menu, SCR-04 Item info |
| Processes | PR-01 Guest ordering journey |
| Objects | `Category`, `Product`, `ProductSize`, `Ingredient`, `RecipeItem`, `Option`, `Cart`, `CartLine`, `Order` (home build status, KPIs), `Oven`, `Courier` (KPIs) |
| Rules referenced | BR-PRICE-01, BR-DATA-10, BR-DATA-11, BR-DATA-12 |
| Priority | Must |

Related: [menu-catalog.md](../09-demo-data/menu-catalog.md) (all names, prices, allergens) · FD-03 (configurator) · FD-04 (adding to the cart).

---

## 1. Purpose

Let a visitor discover the menu quickly and add items to the cart: a landing page that sets the IDE theme and shows featured pizzas and the visitor's live order, a menu with four category tabs and search, cards that show ingredients as code, and an item-info modal with full allergen and nutrition information.

## 2. Actors

| Actor | Can |
|---|---|
| Guest | Browse, search, open item info, add to cart (`+ import`), open the configurator |

## 3. Preconditions

- At least one `PUBLISHED` product exists (true after any demo reset).
- None for the visitor: every visitor is a guest (LITE-SES-01).

## 4. Behaviour

### 4.1 Home (SCR-01)

1. **Hero**: headline `Architect Your Perfect Crust` (TXT-MENU-02), the official logo, a short paragraph: "Git Pizza MxDev is a Neapolitan pizza kitchen built for engineers. Pick a module, inject your toppings and deploy dinner to your door — or pull it fresh from our Mission counter." (TXT-MENU-03) and a decorative terminal window `zsh — 80x24` (TXT-MENU-04) with the lines TXT-MENU-05 … TXT-MENU-08 (SCR-01 E-05). The values are read at page load: `{n}` = published products; line 3 reads `found 0 vulnerabilities`, or `found 1 sold-out module` / `found {s} sold-out modules` when products are not orderable (TXT-MENU-07). Line 1 may be typed out with an animation. With the Lite seed (Tiramisu Stack sold out):

   ```
   ➜ ~ npm install @git-pizza/menu
   added 25 modules from 4 registries in 2s
   found 1 sold-out module
   Git Pizza MxDev — Mission Kitchen is online. Ready for deployment.
   ```
2. **CTA** `git checkout menu` (TXT-MENU-09, accessible name "Open the menu") opens SCR-02. The secondary button `./track.log` (TXT-MENU-10) opens the tracking target of BR-NAV-06.
3. **Featured modules** carousel (`Available Modules` with the sub-heading TXT-MENU-12, TXT-MENU-11): BR-MENU-16.
4. **Live build status** of the viewer's latest open order: BR-MENU-18.
5. **Demo KPIs** strip: BR-MENU-17.

### 4.2 Menu (SCR-02)

1. Heading `Build Your Instance` with the sub-line "`const menu = fetchInventory('production');`" (TXT-MENU-21)
2. **Category tabs** (file tabs): `pizzas.json`, `sides.yml`, `drinks.env`, `desserts.md`, each with the plain name as sub-label or tooltip and the number of published products. Default tab: `pizzas.json`. The selected tab may be opened directly (sidebar `Categories`, BR-NAV-09).
3. **Product grid**: cards (BR-MENU-04) in `sortOrder`. Desktop 2 columns next to the Terminal Debugger (3 columns from 1440 px), tablet 2, phone 1 (SCR-02 R3).
4. **Search** (BR-MENU-10): the box at the top of the menu (and the header box) filters across all categories.
5. **Terminal Debugger** side panel on desktop (BR-MENU-14).
6. The allergen notice (menu catalog, top) is shown at the end of the product list on every tab.
7. Optional dietary filter chips (BR-MENU-20).

### 4.3 Adding from a card

1. **Pizza card** has two actions: `Configure` (`tune` icon; opens SCR-03 for that product) and `+ import` (accessible name "Add to cart with default options").
2. **Side, drink, dessert card** has `+ import` (adds quantity 1 of the REGULAR size) and an info action (opens SCR-04).
3. Clicking the card image or name opens SCR-03 for a pizza and SCR-04 for any other product.
4. After `+ import` the item is added or merged into the cart (FD-04, BR-CART-04), the cart count updates and a success toast shows: `<moduleKey>@<versionTag> imported to manifest` (e.g. `root-pizza@v1.0-LTS imported to manifest`).

### 4.4 Item info (SCR-04)

Modal on desktop and tablet, bottom sheet on phone. Opened from a non-pizza card, or from the info icon of any card (also pizzas). Content: BR-MENU-12. Closing: close button, Esc, click on the scrim, or swipe down on phone.

## 5. Business rules

| ID | Rule | Priority |
|---|---|---|
| BR-MENU-01 | Customer views (SCR-01, SCR-02, SCR-03, SCR-04, search) show only products with `status = PUBLISHED`. A direct link to a DRAFT or ARCHIVED product, or to an unknown product code, shows SCR-40. | Must |
| BR-MENU-02 | Categories are shown in `Category.sortOrder` (pizzas, sides, drinks, desserts) with `fileName` as the tab label and `displayName` as sub-label/tooltip. A category with no published products still shows its tab, with the empty message "`{fileName}` is empty right now. Try another tab." (TXT-MENU-53) | Must |
| BR-MENU-03 | Within a category, products appear in ascending `Product.sortOrder`. Sold-out products keep their position. | Must |
| BR-MENU-04 | A product card shows: image or placeholder (BR-MENU-21); dev name (`name`) and plain name (`realWorldName`) under it; `versionTag`; `shortDescription`; for pizzas the code block (BR-MENU-06), for other products the serving description; badges, dietary flags and spice level (BR-MENU-07); the card price (BR-MENU-05); the actions of 4.3. | Must |
| BR-MENU-05 | The card price follows BR-PRICE-01: pizzas show the default size price and diameter (`$14.99 · 12"`), the calzone `$16.49 · 12"`, other products `$4.50`. Format per BR-PRICE-11. | Must |
| BR-MENU-06 | A pizza card shows its default configuration as a code block (SCR-02 E-08e): `const pizza = { crust: '<default crust name>', sauce: '<default sauce name>', cheese: '<default cheese name>', toppings: [<recipe ingredient names in RecipeItem.sortOrder>] };` Option and ingredient names come from `Option.name` and `Ingredient.name`; sauce `No Sauce (bianca)` and cheese `No Cheese` are written as `null`. Cards show at most 6 lines, then `…`; SCR-04 shows the whole block. A removable recipe ingredient that is out of stock is left out, because it is not part of the default configuration (BR-MENU-09). Syntax colors per `tokens.md` 1.6. Example below the table. | Must |
| BR-MENU-07 | Badges show as `<Classic />`, `<BestSeller />`, `<NewRelease />`, `<ChefPick />`. Dietary flags: `<Vegan />` when `isVegan`, otherwise `<Vegetarian />` when `isVegetarian`, otherwise none. Spice: `HOTFIX_SPICY: MILD` / `MEDIUM` / `HOT` with 1/2/3 chili icons and accessible name "Spice level: Mild/Medium/Hot"; `NONE` shows nothing. | Must |
| BR-MENU-08 | A published product that is not orderable (BR-DATA-12) is shown dimmed with the badge `404: OUT_OF_STOCK` (accessible name "Sold out today"); `+ import` and `Configure` → add are disabled. Its card and SCR-04 can still be opened to read the details. | Must |
| BR-MENU-09 | `+ import` on a pizza adds the **default configuration**: default size, default crust, sauce and cheese, all recipe items except removable ones that are out of stock (BR-DATA-12), no extras, quantity 1. If a removable ingredient was left out for that reason, the toast adds: "{ingredient} is unavailable today and was removed from this build." (TXT-CONF-25) `+ import` on any other product adds quantity 1 of its REGULAR size. | Must |
| BR-MENU-10 | **Search** (`grep`): case-insensitive substring match of the entered text (trimmed, minimum 2 characters) against product `name`, `realWorldName`, `moduleKey`, `shortDescription` and, for pizzas, the names of their recipe ingredients and default sauce and cheese. It searches all four categories of published products. Results update while typing (after a pause of about 300 ms) or on Enter. While a search is active no category tab is selected (the tabs keep their product counts); the results of all categories are listed grouped by category with the category file name as sub-heading, under the heading "`grep: {n} modules match '{query}'`" (TXT-MENU-24; SCR-02 E-01, E-05). `Clear search` (and `Esc` in the box) restores the last tab. Fewer than 2 characters: no filtering and the hint "Type at least 2 characters to search." (TXT-MENU-64). The header search box (SCR-16) opens SCR-02 with the query. | Must |
| BR-MENU-11 | When the search matches nothing, the grid area shows the no-results state: illustration placeholder `illustrations/no-results.png`, text `grep: no modules match '<text>'`, the hint "`grep: no modules match '{query}'` · Try another dish, ingredient or module name, or clear the search." (TXT-MENU-25) and a `Clear search` button. | Must |
| BR-MENU-12 | **Item info (SCR-04)** shows: image or placeholder; `name`, `realWorldName`, `versionTag`, `moduleKey` as `./<category folder>/<moduleKey>`; full `description` (body font); serving description(s) and price(s) of every size; calories per size; allergens with full EU names (BR-MENU-13); dietary flags; spice level; for drinks the caffeine content (A-19); for pizzas the full default recipe code block. Actions: non-pizza — quantity stepper 1–10 (default 1) and `+ import` (adds the chosen quantity); pizza — `Configure` (opens SCR-03) and `+ import` (default configuration, BR-MENU-09). Sold-out: actions disabled with the badge of BR-MENU-08. | Must |
| BR-MENU-13 | Allergens are always listed with their full captions from the `Allergen` enumeration (TXT-STAT-37, e.g. "Cereals containing gluten", "Milk", "Tree nuts"), never only as icons or codes; cards use "Contains: {allergen list}" (TXT-MENU-32). A product without allergens shows "No major allergens" (TXT-MENU-32). Pizza calories on SCR-04 are shown as "{kcal min}–{kcal max} kcal (whole pizza, by size)" (TXT-MENU-52), with the note "Default build. Changes in the configurator update allergens." (TXT-MENU-59) under the allergens. The allergen notice text from the menu catalog is shown on SCR-04 and at the end of the menu list. | Must |
| BR-MENU-14 | **Terminal Debugger** (desktop SCR-02, right panel 320 px, title `Terminal Debugger` with sub-title `session: active_order`): lists the cart lines as TXT-MENU-41 (`[INFO] {n} dependencies installed.`, then one `[OK] {qty}× {product} ({size}) {lineTotal}` line per cart line, at most 8, then `… {k} more`), the total `Total Output:` (TXT-MENU-42; cart subtotal minus the discount preview), the button `EXECUTE ORDER` (TXT-MENU-43, opens SCR-06; disabled with the hint "Your manifest is empty. Import a module first." (TXT-NAV-06) when the cart is empty), the link `cat MANIFEST.LOCK` (TXT-MENU-44, opens SCR-05) and the build line TXT-MENU-56. Empty cart: the three lines of TXT-MENU-40 (`[INFO] Initializing cart module...`, `[INFO] Waiting for input...`, `// Memory address empty`) with a blinking cursor. It updates immediately after each add. Tablet and phone do not show the panel. | Must |
| BR-MENU-15 | The home hero and CTA follow 4.1 steps 1–2. | Must |
| BR-MENU-16 | **Featured carousel** on SCR-01 shows PUBLISHED products with `isFeatured = true` (at most 6), ordered by category `sortOrder` then product `sortOrder`. Each item shows the image or placeholder, name, plain name, card price, the code block and `+ import` / `Configure` like the menu card. Desktop shows 3 at a time with previous/next arrows; phone shows one with horizontal swipe. Sold-out featured products are shown as in BR-MENU-08. With no featured products the section is hidden. | Must |
| BR-MENU-17 | **Demo KPIs** on SCR-01 (4 tiles, labels TXT-MENU-14), calculated from live data, refreshed within 10 s while the page is open (NFR-07) and on every page load: `DEPLOYED_TODAY` = number of orders that reached DELIVERED or PICKED_UP today (store time zone); `AVG_PIPELINE_TIME` = average of `completedAt − paidAt` of those orders, shown `mm:ss`, or `—` (TXT-MENU-15) when there are none; `KITCHEN_LOAD` = occupied oven slots / all slots of the ONLINE ovens with the percentage, e.g. `4/6 · 67%` (Σ `ordersBaking` / Σ `capacityOrders`, SIM-02 BR-SIM-16d); `COURIERS_ON_DUTY` = couriers not in `OFF_DUTY`. The average is taken in seconds and rounded half up to whole seconds before it is shown as `mm:ss` (e.g. 306.9 s → `05:07`). The numbers include simulated orders but are aggregates calculated on the server: the guest never receives the orders behind them (LITE-SEC-02). No invented numbers (no fake uptime or "nodes active"). | Must |
| BR-MENU-18 | **Live build status** on SCR-01: if the guest has an open order (the most recent open order placed or looked up in this browser session), a panel (SCR-01 E-13) shows `Live Build Status: Order MX-1048` (TXT-MENU-17), the status badge, the 5-stage mini stepper (order-lifecycle 2.1) with a progress bar, `Est. completion: ~18:49` (delivery) or `Ready at: ~18:42` (pickup) (TXT-MENU-18), the last 3 customer-visible log lines and the link `MONITOR PIPELINE →` (TXT-MENU-19); a click anywhere on the panel opens SCR-09. With several open orders the most recently placed one is shown. It refreshes within 10 seconds of a change (NFR-07). When the order reaches a final state, the panel shows the final state for 60 seconds and then disappears. Without an open order the panel is not shown. | Must |
| BR-MENU-19 | Menu data is read fresh on every load of SCR-01, SCR-02 and SCR-04. An open SCR-02 refreshes availability (sold out) and prices at least every 30 seconds without losing the selected tab, search or scroll position. | Must (load) / Should (30 s refresh) |
| BR-MENU-20 | Optional filter chips on SCR-02: `--vegetarian`, `--vegan`, `--spicy` (TXT-MENU-46; toggles, none selected = all products). `--vegetarian` shows vegetarian and vegan products, `--vegan` only vegan products (BR-DATA-10), `--spicy` products with spice level MILD, MEDIUM or HOT. Selected chips combine with AND with each other and with the search. When nothing matches, the empty state "No module in `{fileName}` matches these filters." with `Show all` (TXT-MENU-65) is shown; `Show all` clears the chips. | May |
| BR-MENU-21 | Products with an `image` show it at 1 : 1 with `imageAlt` as alt text (all 25 seed products have a photo). Products without an image (none in the Lite seed) show the placeholder of `assets/README.md` section 2 with the caption `IMAGE_PENDING // <expected file name>` (`<code>-<moduleKey>.jpg`). | Must |
| BR-MENU-22 | Not used in Lite (browse-only mode for staff). | — |
| BR-MENU-23 | `+ import` is checked by the server at the moment of the click: if the product is no longer orderable, nothing is added, the card is refreshed into the sold-out state and an error toast shows "{product} is sold out and can't be imported." (TXT-MENU-37) | Must |

Example of the code block (BR-MENU-06) for PZ-01 The Root Pizza:

```js
const pizza = {
  crust: 'Neapolitan Core',
  sauce: 'San Marzano Tomato',
  cheese: 'Fior di Latte Mozzarella',
  toppings: ['Fresh basil', 'Extra-virgin olive oil (cold-pressed)']
};
```

> **Assumption A-19:** Drinks show their caffeine content on SCR-04 (menu catalog section 6, e.g. "Caffeine: 150 mg"). The information model has no attribute for it; the contractor adds an optional integer product attribute (caffeine in mg, drinks only) and fills it from the menu catalog.

## 6. Data read and written

| Object | Read | Written |
|---|---|---|
| `Category` | all attributes | — |
| `Product` | all customer-visible attributes, derived `allergens`, `isVegetarian`, `isVegan`, `isOrderable`, `cardPrice` | — |
| `ProductSize` | `sizeCode`, `diameterInches`, `servingDescription`, `price`, `calories`, `slices`, `isDefault` | — |
| `RecipeItem`, `Ingredient`, `Option` | recipe, names, allergens, diet flags, stock | — |
| `Cart`, `CartLine` | lines for the Terminal Debugger | new or merged `CartLine` on `+ import` (FD-04) |
| `Order`, `OrderLogEntry` | the guest's latest open order (BR-MENU-18); today's completed orders of every source, as aggregates only (BR-MENU-17) | — |
| `Oven`, `Courier` | `status`, `ordersBaking`, `capacityOrders` of the ovens; courier statuses (BR-MENU-17) | — |

## 7. States touched

Reads `ProductStatus` (only `PUBLISHED`), the open set of `OrderStatus` (BR-MENU-18) and the final states `DELIVERED`, `PICKED_UP` (BR-MENU-17). Changes no state.

## 8. Errors and edge cases

| Case | Behaviour | Message |
|---|---|---|
| Menu data still loading | Skeleton cards (same grid, no text) for up to 10 s; then the error state below | — |
| Menu data cannot be loaded | The grid area shows an inline error with `RETRY_DEPLOYMENT` (reloads the data) | "Could not reach the server. Check your connection and try again." (TXT-ERR-19) |
| Product sold out between page load and `+ import` | BR-MENU-23 | "{product} is sold out and can't be imported." (TXT-MENU-37) |
| Adding would exceed 10 of the same line or 30 items in the cart | Handled by FD-04 (BR-CART-05, BR-CART-06) | Messages of FD-04 |
| Search text with only spaces or 1 character | No filtering; full menu stays | — |
| Search text with special characters (`'`, `%`, `*`) | Treated literally as text, never as a pattern | — |
| Tiramisu Stack (sold out in the Lite seed) | Card dimmed with `404: OUT_OF_STOCK`; `+ import` disabled (BR-MENU-08) | — |
| Inferno Payload or Hawaiian Legacy Fix `+ import` (jalapeño out of stock in the Lite seed) | Added without jalapeños (removable recipe item, BR-MENU-09) | "{ingredient} is unavailable today and was removed from this build." (TXT-CONF-25) |
| Demo reset while a visitor is on SCR-02 | Menu reloads on the next refresh (≤ 30 s, should) or next load | — |

## 9. Notifications

- Success toast after `+ import` (4.3 step 4), with the optional "{ingredient} is unavailable today and was removed from this build." (TXT-CONF-25) sentence (BR-MENU-09).
- Error toast "{product} is sold out and can't be imported." (TXT-MENU-37) (BR-MENU-23).
- Live build status panel on SCR-01 (BR-MENU-18).
