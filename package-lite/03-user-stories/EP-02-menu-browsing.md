# EP-02 — Menu browsing (module explorer)

| Epic | Functional area | Screens | MoSCoW | Story range |
|---|---|---|---|---|
| EP-02 | FD-02 Menu browsing | SCR-01, SCR-02, SCR-04 | Must | US-021 – US-034 |

**Goal.** A visitor lands on an appetizing, developer-themed home page, browses the four categories, finds items by search, reads ingredients, allergens and prices, and adds items to the cart in one click.

Menu data: [menu-catalog.md](../09-demo-data/menu-catalog.md). Card price rule: BR-PRICE-01. Orderable rule: BR-DATA-12.

| ID | Title | Priority |
|---|---|---|
| US-021 | Home hero and terminal intro | Must |
| US-022 | Featured modules carousel | Must |
| US-023 | Live demo KPIs on the home page | Must |
| US-024 | Live build status of my active order on the home page | Must |
| US-025 | Category tabs and product cards | Must |
| US-026 | Ingredients shown as a code block | Must |
| US-027 | Menu search (`grep`) | Must |
| US-028 | Quick add (`+ import`) | Must |
| US-029 | Item info for sides, drinks and desserts | Must |
| US-030 | Allergen and nutrition info for pizzas | Must |
| US-031 | Sold-out products | Must |
| US-032 | Terminal Debugger cart panel (desktop menu) | Must |
| US-033 | Dietary quick filter | Could |
| US-034 | Menu loading state | Should |

---

### US-021 Home hero and terminal intro

> As a **first-time guest**, I want a striking landing page that explains the concept in one look, so that I understand what Git Pizza MxDev is and start ordering.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-01 | FD-02 | BR-MENU-*, BR-NAV-* | PR-01 | — |

**Acceptance criteria**

1. **Given** a guest opens the app URL, **then** SCR-01 is shown without any account, with the official logo, the headline `Architect Your Perfect Crust`, a short paragraph (body font) that explains ordering real pizza in a developer's language, and a terminal window with an intro output (e.g. a package-install style text ending in a "ready" line).
2. **When** the visitor activates the primary CTA `git checkout menu`, **then** SCR-02 opens on `pizzas.json`.
3. **Given** the hero, **then** it contains no link to an account, login or demo-role page. *(negative)*
4. **Given** `prefers-reduced-motion: reduce`, **then** the terminal text appears fully at once and the cursor does not blink.
5. **Given** the hero text, **then** it contains no invented claims presented as facts (e.g. no `99.9% uptime`, `12k+ nodes`). *(negative)*

---

### US-022 Featured modules carousel

> As a **guest**, I want to see the house favorites on the home page, so that I can pick a great pizza without browsing the whole menu.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-01, SCR-03 | FD-02 | BR-MENU-*, BR-PRICE-01, BR-DATA-12 | PR-01 | — |

**Acceptance criteria**

1. **Given** the seed menu, **then** the carousel shows the six featured published products in menu order: The Root Pizza, Boolean Pepperoni, SQL Supreme, Binary BBQ, Inferno Payload, Low-Mem Garden.
2. **Given** a featured card, **then** it shows image or placeholder, dev name, real-world name, version tag, short description, card price (e.g. `$14.99 · 12"` for The Root Pizza) and the buttons `+ import` (TXT-MENU-29, quick add, US-028) and `Configure` (opens SCR-03).
3. **Given** desktop width, **then** previous/next arrows move the carousel and are keyboard operable; **given** phone width, **then** the carousel can be swiped. The carousel does not rotate automatically.
4. **Given** a featured product is sold out (none in the Lite seed: the sold-out Tiramisu Stack is not featured), **when** the home page is loaded, **then** its card shows `404: OUT_OF_STOCK` (TXT-STAT-35), `+ import` is disabled and `Configure` still opens SCR-03 in its sold-out state (US-031).
5. **Given** a product in status DRAFT or ARCHIVED, **then** it never appears in the carousel. *(negative)*

---

### US-023 Live demo KPIs on the home page

> As a **visitor watching the demo**, I want a few live numbers about today's operation on the home page, so that I can see the simulated business is running.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-01 | FD-02 | BR-MENU-*, BR-SIM-16d, LITE-SEC-02 | PR-02 | SIM-05, SIM-02 |

**Acceptance criteria**

1. **Given** SCR-01, **then** four KPI tiles are shown (TXT-MENU-14, BR-MENU-17): `DEPLOYED_TODAY` (orders that reached DELIVERED or PICKED_UP today), `AVG_PIPELINE_TIME` (average of `completedAt − paidAt` of those orders, rounded half up to whole seconds, `mm:ss`, `—` when there are none), `KITCHEN_LOAD` (occupied oven slots / all slots of the ONLINE ovens, e.g. `4/6 · 67%`, labelled `HEAVY` from 85 %, BR-SIM-16d) and `COURIERS_ON_DUTY` (couriers not `OFF_DUTY`: `4` in Lite, because `CU-05` is always off duty, BR-DEMO-03a).
2. **Given** the traffic generator completes another order, **then** `DEPLOYED_TODAY` increases by 1 at the latest 10 seconds later while the page is open, or on the next page load; the completion is visible in the server log as `ORDER <orderNumber> OUT_FOR_DELIVERY -> DELIVERED …` or `ORDER <orderNumber> READY_FOR_PICKUP -> PICKED_UP …` (LITE-CFG-04).
3. **Given** a demo reset (start with `Simulation.ResetOnStartup = true`), **then** the KPIs show the values derived from the seed orders.
4. All values are calculated from the app's data; no hard-coded marketing numbers are shown. *(negative)*
5. **Given** orders start and finish baking, **then** `KITCHEN_LOAD` changes at the latest 10 seconds later while the page is open.
6. **Given** the KPIs, **then** they are aggregates calculated on the server: the guest's browser receives the four values only, never the orders, contact data or addresses behind them (LITE-SEC-02). *(negative)*

Assumption A-73 (UI specification) applies: the four home KPIs above replace the decorative Stitch values (`99.9% Uptime`, `30m Compile Time`, `12k+ Nodes`, `0 Fatal Exceptions`).

---

### US-024 Live build status of my active order on the home page

> As a **guest with an order in progress**, I want to see its pipeline on the home page, so that I know its state without opening the tracking page.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-01, SCR-09 | FD-02 | BR-MENU-*, BR-TRK-*, BR-ORD-20 | PR-02 | SIM-07 |

**Acceptance criteria**

1. **Given** a guest whose order placed in this browser session is in `BAKING`, **when** SCR-01 is loaded, **then** a `Live Build Status` panel shows `MX-<number>`, the five-stage mini pipeline with stage 2 `BAKING` active, the ETA `Est. completion: ~{HH:mm}` (TXT-MENU-18), the last three customer-visible log lines and the link `MONITOR PIPELINE →` (TXT-MENU-19) to SCR-09.
2. **Given** that order moves to `QA_CHECK`, **then** the panel shows stage 3 active within 10 seconds without reload (BR-MENU-18).
3. **Given** a guest placed an order in this browser session that is still open, **then** the panel shows that order; a guest in a new browser session sees no order. *(negative)*
4. **Given** the viewer's latest open order is `PAYMENT_FAILED`, **then** the panel shows the payment-failed state with a link to SCR-09 where payment can be retried (US-113).
5. **Given** the viewer has no open order, **then** the panel is not shown (SCR-01 section 5). *(negative)*
6. **Given** the order reaches `DELIVERED` while SCR-01 is open, **then** the panel shows the final state `DEPLOYED` for 60 seconds and then disappears, unless another order is open (SCR-01 E-13).

**Notes.** With several open orders, the most recently placed one is shown.

---

### US-025 Category tabs and product cards

> As a **guest**, I want to browse the menu by category with clear, appetizing cards, so that I can compare items and prices quickly.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-02 | FD-02 | BR-MENU-*, BR-PRICE-01, BR-PRICE-11, BR-DATA-10 | PR-01 | — |

**Acceptance criteria**

1. **Given** SCR-02, **then** four file tabs are shown in this order: `pizzas.json` (Pizzas), `sides.yml` (Sides & Dips), `drinks.env` (Drinks), `desserts.md` (Desserts); `pizzas.json` is active by default and the page heading is `Build Your Instance`.
2. **Given** the seed data, **then** the tabs contain 12, 5, 5 and 3 products, in catalog order.
3. **Given** a pizza card, **then** it shows: the product photo (the placeholder `IMAGE_PENDING // <file name>` of assets README section 2 only for a product without photo), dev name, real-world name, module path (e.g. `./pizzas/root-pizza.ts`), version tag, short description, badges, spice indicator when the spice level is not NONE (e.g. `HOTFIX_SPICY: HOT` on Inferno Payload), diet badge (`<Vegetarian />` or `<Vegan />`), the card price and the buttons `Configure` and `+ import`.
4. **Given** the cards, **then** prices are: The Root Pizza `$14.99 · 12"`, Calzone Container `$16.49 · 12"`, Binary BBQ `$19.99 · 12"`, Garlic Knot Loop `$6.50`, Mate Compiler Tonic `$4.50`, Tiramisu Stack `$7.50`; non-pizza cards show the serving (e.g. `12 fl oz can`).
5. **Given** any of the 25 seed products (e.g. Binary BBQ, The Root Pizza, Mate Compiler Tonic), **then** its card shows the real product photo from `assets/products/` (`<code>-<moduleKey>.jpg`, e.g. `pz-01-root-pizza.jpg`); no seed product shows the placeholder.
6. **Given** Low-Mem Garden, **then** it shows `<Vegan />`; **given** The Root Pizza, **then** it shows `<Vegetarian />` and `<Classic />`; **given** Boolean Pepperoni, **then** it shows `<BestSeller />` and `HOTFIX_SPICY: MILD`.
7. **Given** a product in status DRAFT or ARCHIVED, **then** it does not appear on SCR-02. *(negative)*
8. **Given** tablet width, **then** cards are in 2 columns; phone width, 1 column; desktop, at least 2 columns next to the US-032 panel.

---

### US-026 Ingredients shown as a code block

> As a **developer-customer**, I want each pizza's ingredients written as a small code snippet, so that the menu speaks my language while staying readable.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-01, SCR-02 | FD-02 | BR-MENU-* | — | — |

**Acceptance criteria**

1. **Given** The Root Pizza card, **then** a code block `const pizza = { … }` shows its default configuration, generated from the data (BR-MENU-06, SCR-02 E-08e): `crust` = `Neapolitan Core`, `sauce` = `San Marzano Tomato`, `cheese` = `Fior di Latte Mozzarella`, `toppings` = the recipe ingredient names in recipe order (fresh basil, extra-virgin olive oil).
2. **Given** Quad-Core Formaggi, **then** the code block shows `sauce: null` (No Sauce (bianca)) and lists gorgonzola dolce, fontina, parmesan-style hard cheese, extra-virgin olive oil.
3. **Given** the recipe data of a product, **then** the code block is generated from it; no snippet text is hard-coded. *(negative)*
4. **Given** the code block, **then** syntax colors follow `tokens.md` section 1.6 (keywords, strings, punctuation) and the block is readable by screen readers as a plain ingredient list.

---

### US-027 Menu search (`grep`)

> As a **guest**, I want to search the whole menu by name, dish or ingredient, so that I find what I am craving fast.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-02, SCR-16 | FD-02 | BR-MENU-* | PR-01 | — |

**Acceptance criteria**

1. **Given** the search box (`grep --pizza '…'`), **when** at least 2 characters are entered, **then** published products of all categories whose dev name, real-world name, short description or default ingredient names contain the text (case-insensitive) are listed, grouped by category, with a result count.
2. **When** the visitor searches `jalap`, **then** exactly 3 results appear: Inferno Payload, Hawaiian Legacy Fix, Jalapeño Patch Dip.
3. **When** the visitor searches `MARGHERITA`, **then** The Root Pizza is found (via its real-world name).
4. **When** the visitor searches `basil`, **then** The Root Pizza, Binary BBQ, The Clean Code and Calzone Container are found.
5. **When** the visitor searches `xyz`, **then** the no-results state shows `illustrations/no-results.png` (or its placeholder), `grep: no modules match 'xyz'` with its hint (TXT-MENU-25) and a `Clear search` action that restores the category tabs. *(negative)*
6. **When** only 1 character is entered, **then** no search runs and the hint "Type at least 2 characters to search." (TXT-MENU-64) is shown. *(negative)*
7. **When** the visitor searches `tiramisu`, **then** the sold-out Tiramisu Stack appears in the results with its sold-out state (US-031); draft and archived products never appear.

---

### US-028 Quick add (`+ import`)

> As a **guest**, I want to add an item with its default configuration in one click, so that ordering a favorite is fast.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-01, SCR-02, SCR-05 | FD-02 | BR-MENU-*, BR-CART-*, BR-PRICE-02, BR-DATA-12 | PR-01 | — |

**Acceptance criteria**

1. **When** a guest clicks `+ import` on The Root Pizza, **then** one cart line "The Root Pizza, Medium 12", default crust, sauce and cheese, full recipe" with unit price $14.99 is added and a toast confirms it (US-010).
2. **When** the guest clicks `+ import` on The Root Pizza again, **then** the existing line's quantity becomes 2 (same configuration is merged, US-049); no second line is created.
3. **When** the guest clicks `+ import` on Cola Cache, **then** a line "Cola Cache, Regular, $2.75" is added.
4. **Given** fresh jalapeños (`jalapeno`, removable) are out of stock (seed, BR-DEMO-03a), **when** `+ import` is clicked on Inferno Payload, **then** the line is added without fresh jalapeños, the price stays $18.49 and the toast says that fresh jalapeños are unavailable today and were left out.
5. **Given** a sold-out product (Tiramisu Stack), **then** `+ import` is disabled. *(negative)*
7. **Given** a line of that configuration already has quantity 10, **when** `+ import` is clicked, **then** the quantity stays 10 and a message says the maximum per line is 10. *(negative)*

---

### US-029 Item info for sides, drinks and desserts

> As a **guest**, I want to open the details of a side, drink or dessert, so that I can read its description, serving, allergens and calories before adding it.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-04, SCR-02 | FD-02 | BR-MENU-*, BR-CART-*, BR-PRICE-04 | PR-01 | — |

**Acceptance criteria**

1. **When** the visitor clicks the Hot Wings Webhook card (or its info icon), **then** SCR-04 `module.info` opens (modal on desktop/tablet, bottom sheet on phone) showing: image or placeholder, `Hot Wings Webhook`, `Chicken wings, Calabrian chili glaze`, module key, the full description, serving `8 wings + blue cheese dip + celery`, price `$11.95`, `760 kcal`, spice `MEDIUM`, allergens `Milk`, `Eggs`, `Celery` (full EU-14 captions) and the allergen notice.
2. **Given** Mate Compiler Tonic, **then** SCR-04 additionally shows caffeine `150 mg` and the `<Vegan />` flag.
3. **When** the visitor sets quantity 2 and clicks `+ import` (TXT-MENU-29), **then** the line is added with quantity 2 (line total `$9.00` for 2 × Mate Compiler Tonic) and the modal closes with the toast TXT-MENU-35.
4. Quantity can be set from 1 to 10; the minus control is disabled at 1 and the plus control at 10. *(negative)*
5. **Given** the item is sold out (Tiramisu Stack), **then** SCR-04 shows `404: OUT_OF_STOCK` and the add button is disabled. *(negative)*
6. The modal closes with the close button, the Escape key and a click on the backdrop; focus returns to the card.

---

### US-030 Allergen and nutrition info for pizzas

> As a **guest with a food allergy**, I want to see a pizza's allergens, diet flags and calories before configuring it, so that I can choose safely.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-04, SCR-02, SCR-03 | FD-02 | BR-MENU-*, BR-DATA-10, BR-DATA-11 | PR-01 | — |

**Acceptance criteria**

1. **When** the visitor clicks the info icon on Binary BBQ, **then** SCR-04 shows the full description, the default recipe as a code block (BR-MENU-06), allergens `Cereals containing gluten`, `Milk`, `Mustard` (TXT-STAT-37), the diet state `Not vegetarian` (TXT-MENU-50), calories `1,020–1,990 kcal (whole pizza, by size)` (TXT-MENU-52) and the allergen notice.
2. **Given** the pizza variant of SCR-04, **then** it offers `Configure this module →` (TXT-MENU-51, opens SCR-03) and `+ import` (default configuration, BR-MENU-09), and shows the note "Default build. Changes in the configurator update allergens." (TXT-MENU-59)
3. **Given** Low-Mem Garden, **then** SCR-04 shows allergens `Cereals containing gluten`, `Tree nuts` (TXT-STAT-37) and `<Vegan />`.
4. **Given** any product, **then** the allergen notice from `menu-catalog.md` (including the Gluten-Free Fork disclaimer) is shown. *(negative: no "allergen-free" claims)*

---

### US-031 Sold-out products

> As a **guest**, I want to see which items are sold out today, so that I do not try to order something the kitchen cannot make.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-01, SCR-02, SCR-03, SCR-04 | FD-02 | BR-MENU-*, BR-DATA-12 | PR-01 | — |

**Acceptance criteria**

1. **Given** Tiramisu Stack is sold out (seed, BR-DEMO-03a), **when** a guest loads SCR-02, **then** its card stays in its place on `desserts.md`, shows `SOLD_OUT` / `404: OUT_OF_STOCK`, the image is dimmed and `+ import` is disabled.
2. **Given** an ingredient that is fixed on a pizza is out of stock (e.g. `pulled_pork` on Binary BBQ; not in the Lite seed), **when** SCR-02 is loaded, **then** that pizza is shown as sold out and cannot be configured or added.
3. **Given** ingredient `jalapeno` (removable on Inferno Payload and Hawaiian Legacy Fix) is out of stock (seed), **then** both pizzas stay orderable (US-028 AC4, US-051).
5. **Given** a sold-out product, **when** its configurator URL is opened directly, **then** SCR-03 shows the sold-out state with the add button disabled. *(negative)*

**Notes.** In Lite availability is a seed value and does not change while the app runs (BR-DEMO-03a): Tiramisu Stack is sold out and `jalapeno` is out of stock, nothing else. AC2 and AC5 describe the rule for any other sold-out state. Lines already in carts: US-071.

---

### US-032 Terminal Debugger cart panel (desktop menu)

> As a **guest on desktop**, I want a live cart summary next to the menu, so that I see what I have added without opening the cart.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-02, SCR-05, SCR-06 | FD-02 | BR-MENU-*, BR-CART-*, BR-PRICE-04, BR-PRICE-06 | PR-01 | — |

**Acceptance criteria**

1. **Given** SCR-02 at 1200 px or wider, **then** a 320 px right panel titled `Terminal Debugger` (`session: active_order`) lists each cart line (quantity, name, size, line total; TXT-MENU-41), the item count and the total `Total Output:` (TXT-MENU-42).
2. **When** an item is added from the menu, **then** the panel updates immediately.
3. **Given** an empty cart, **then** the panel shows the empty-cart lines TXT-MENU-40 with a blinking cursor (static with reduced motion) and `EXECUTE ORDER` is disabled with the hint TXT-NAV-06.
4. **Given** a non-empty cart, **then** `cat MANIFEST.LOCK` (TXT-MENU-44) opens SCR-05 and `EXECUTE ORDER` (TXT-MENU-43) opens SCR-06.
5. **Given** a width below 1200 px, **then** the panel is not shown. *(negative)*

---

### US-033 Dietary quick filter

> As a **vegetarian or vegan guest**, I want to filter the menu by diet, so that I only see items I can eat.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Could | G | SCR-02 | FD-02 | BR-MENU-*, BR-DATA-10 | — | — |

**Acceptance criteria**

1. **Given** the filter chips `--vegetarian`, `--vegan`, `--spicy` on SCR-02 (TXT-MENU-46, BR-MENU-20), **when** `--vegetarian` is selected on `pizzas.json`, **then** exactly The Root Pizza, Truffle Kernel, Quad-Core Formaggi, The Clean Code and Low-Mem Garden are shown.
2. **When** `--vegan` is selected on `pizzas.json`, **then** only Low-Mem Garden is shown; on `drinks.env` all 5 drinks are shown.
3. **When** a filter leaves a category empty (e.g. `--vegan` on `desserts.md`), **then** the empty state TXT-MENU-65 ("No module in `desserts.md` matches these filters.") with `Show all` is shown. *(negative)*
4. The filter combines with the search (US-027).

---

### US-034 Menu loading state

> As a **guest on a slow connection**, I want to see that the menu is loading, so that I do not think the page is broken.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Should | G | SCR-02 | FD-02 | BR-MENU-*, BR-ERR-* | — | — |

**Acceptance criteria**

1. **Given** the product list is still loading, **then** SCR-02 shows skeleton cards in the card layout (no empty page, no layout jump when data arrives).
2. **Given** loading fails, **then** the error notice of US-287 is shown with a retry action. *(negative)*
