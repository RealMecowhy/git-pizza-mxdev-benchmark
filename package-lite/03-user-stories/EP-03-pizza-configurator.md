# EP-03 — Pizza configurator (dependency manager)

| Epic | Functional area | Screens | MoSCoW | Story range |
|---|---|---|---|---|
| EP-03 | FD-03 Pizza configurator | SCR-03 (and SCR-05 for editing a line) | Must | US-041 – US-053 |

**Goal.** A guest configures one pizza — size, crust, sauce, cheese, extra toppings, removed ingredients — and always sees the correct price, allergens and diet flags before adding it to the cart.

Price rules: BR-PRICE-02, BR-PRICE-03. Allergens and diet: BR-DATA-10, BR-DATA-11. Availability: BR-DATA-12. Options and prices: [menu-catalog.md](../09-demo-data/menu-catalog.md) section 4.

| ID | Title | Priority |
|---|---|---|
| US-041 | Open the configurator with the default configuration | Must |
| US-042 | Choose the size (`scale_factor`) | Must |
| US-043 | Choose the crust (`core_kernel`) | Must |
| US-044 | Choose sauce and cheese (`base_layer`, `cheese_driver`) | Must |
| US-045 | Add extra toppings (inject dependencies) | Must |
| US-046 | Remove default ingredients (unlink) | Must |
| US-047 | Live allergens and diet flags | Must |
| US-048 | Live `manifest.json` preview | Must |
| US-049 | Set quantity and add to cart (`Build & Deploy`) | Must |
| US-050 | Edit a cart line in the configurator | Must |
| US-051 | Unavailable options and ingredients | Must |
| US-052 | Price breakdown | Should |
| US-053 | Phone layout with sticky price bar | Should |

---

### US-041 Open the configurator with the default configuration

> As a **guest**, I want the configurator to open with the pizza exactly as listed on the menu, so that I only change what I care about.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-03, SCR-01, SCR-02, SCR-04 | FD-03 | BR-CONF-*, BR-PRICE-01, BR-PRICE-02 | PR-01 | — |

**Acceptance criteria**

1. **When** the visitor clicks `Configure` on Inferno Payload (SCR-02, SCR-01 carousel or SCR-04), **then** SCR-03 `configure_module.ts` opens with the header `./pizzas/inferno-payload.ts`, version `v2.4`, the product photo, dev and real-world name and the description.
2. **Given** Inferno Payload just opened, **then** the selection is: size Medium 12", crust CR-01 `neapolitan_core`, sauce SA-01 `san_marzano`, cheese CH-02 `buffalo_mozzarella`, no extras, recipe items spianata calabrese (fixed), Calabrian chili oil, crushed red pepper included; fresh jalapeños are shown with `SOLD_OUT` (TXT-CONF-24) and left out, because `jalapeno` is out of stock in the seed (US-051); unit price `$18.49`.
3. **Given** any pizza opened with the default configuration, **then** the unit price equals its card price (BR-PRICE-01).
4. **Given** a direct link to the configurator of an archived or draft product, **then** SCR-40 is shown. *(negative)*

---

### US-042 Choose the size (`scale_factor`)

> As a **guest**, I want to choose Small, Medium or Large, so that the pizza fits my appetite and the price updates at once.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-03 | FD-03 | BR-CONF-*, BR-PRICE-02, BR-PRICE-03 | PR-01 | — |

**Acceptance criteria**

1. **Given** The Root Pizza, **then** the size control offers `Small 10" · 6 slices $11.99`, `Medium 12" · 8 slices $14.99`, `Large 14" · 8 slices $17.99`.
2. **Given** The Root Pizza with extra EX-01 `extra_cheese`, **when** the size changes Medium → Large → Small, **then** the unit price changes $16.99 → $20.49 → $13.49 (extra price follows the size, BR-PRICE-03).
3. **Given** The Root Pizza Medium with crust CR-04 `cheese_stuffed_v2` ($17.49), **when** Small is chosen, **then** the crust resets to CR-01, a notice explains that Cheese-Stuffed v2 is only available for Medium and Large, and the price is $11.99. *(negative)*
4. **Given** The Root Pizza Small with crust CR-05 `gluten_free_fork` ($14.99), **when** Large is chosen, **then** the crust resets to CR-01 with a notice and the price is $17.99. *(negative)*
5. **Given** Calzone Container, **then** only `Medium 12" · 1 piece $16.49` is offered and the size cannot be changed.

---

### US-043 Choose the crust (`core_kernel`)

> As a **guest**, I want to choose the crust, including gluten-free and stuffed options, so that the base suits my taste or diet.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-03 | FD-03 | BR-CONF-*, BR-PRICE-02 | PR-01 | — |

**Acceptance criteria**

1. **Given** a pizza at Medium, **then** five crusts are listed with key, name, description and surcharge: CR-01 `$0.00`, CR-02 `$0.00`, CR-03 `+$1.50`, CR-04 `+$2.50`, CR-05 `+$3.00`; CR-05 is disabled with the hint `10" only`. *(negative)*
2. **Given** a pizza at Small, **then** CR-04 is disabled with the hint that it is available for Medium and Large only. *(negative)*
3. **When** CR-03 `sourdough_build` is chosen on The Root Pizza Medium, **then** the unit price is $16.49.
4. **Given** Calzone Container (`crustSelectable = false`), **then** the crust shows CR-01 Neapolitan Core as fixed (read-only) with a note that the crust cannot be changed for this module.
5. Exactly one crust is selected at any time; the selected option is highlighted (`color.primary.subtle` background and 2 px border).

---

### US-044 Choose sauce and cheese (`base_layer`, `cheese_driver`)

> As a **guest**, I want to change the sauce and the cheese, so that I can make a white pizza, a vegan pizza or a richer one.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-03 | FD-03 | BR-CONF-*, BR-PRICE-02 | PR-01 | — |

**Acceptance criteria**

1. **Given** any pizza, **then** the sauces SA-01 – SA-06 and the cheeses CH-01 – CH-04 are listed; exactly one of each is selected; the product's default is marked `default`.
2. **When** SA-04 `truffle_cream` is chosen on The Root Pizza Medium, **then** the unit price is $16.99 (+$2.00); **when** CH-02 `buffalo_mozzarella` is also chosen, **then** it is $18.99.
3. **Given** Truffle Kernel Medium (default sauce SA-04), **then** the price is $20.49 with no truffle surcharge; **when** SA-01 is chosen, **then** the price stays $20.49.
4. **Given** Inferno Payload Medium (default cheese CH-02), **when** CH-01 is chosen, **then** the price stays $18.49 (a default option never costs extra and switching away never reduces the base price). *(negative)*
5. **When** CH-03 `vegan_cashew_mozz` is chosen on The Root Pizza Medium, **then** the price is $16.49; **when** CH-04 `no_cheese` is chosen, **then** it is $14.99.

---

### US-045 Add extra toppings (inject dependencies)

> As a **guest**, I want to add extra toppings up to the allowed number, so that I can build the pizza I want.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-03 | FD-03 | BR-CONF-*, BR-PRICE-02, BR-PRICE-03 | PR-01 | — |

**Acceptance criteria**

1. **Given** a pizza at Medium, **then** the 25 extras EX-01 – EX-25 are listed with key, name, version tag and price for the chosen size: STANDARD `+$2.00`, PREMIUM `+$3.00`; a counter shows `0/5`.
2. **When** EX-11 `cherry_tomatoes` is added to Inferno Payload Large, **then** the unit price changes from $22.50 to $25.00 and the counter shows `1/5`.
3. **Given** Boolean Pepperoni Large with crust CR-04, cheese CH-02, extras EX-11 and EX-21 and oregano removed, **then** the unit price is $30.99 (the calculation of information model Example C, with the STANDARD extra Cherry tomatoes in place of Jalapeños, which are out of stock in Lite).
4. **Given** 5 extras are selected on a pizza, **then** all other extras are disabled and a message says the maximum of 5 dependencies is reached; **when** one is removed, **then** the others are enabled again. *(negative)*
5. **Given** Calzone Container, **then** the counter shows `0/3` and a fourth extra cannot be added. *(negative)*
6. **When** EX-16 `spicy_pepperoni` is added to Boolean Pepperoni (which already has pepperoni), **then** it is accepted as an extra portion at $3.00 (Medium).
7. Each extra can be selected at most once (toggle on/off).

---

### US-046 Remove default ingredients (unlink)

> As a **guest**, I want to remove ingredients I do not like, for free, so that the pizza is made the way I want.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-03 | FD-03 | BR-CONF-*, BR-PRICE-02 | PR-01 | — |

**Acceptance criteria**

1. **Given** Inferno Payload, **then** Calabrian chili oil and crushed red pepper show an `Unlink` control (fresh jalapeños are out of stock and shown as `SOLD_OUT` (TXT-CONF-24), US-051 AC1), and spianata calabrese shows a lock with the hint `signature ingredient` and cannot be removed. *(negative)*
2. **When** Calabrian chili oil is unlinked, **then** it is shown struck through as removed, the price stays $18.49 and it can be linked again with one click.
3. **Given** SQL Supreme, **then** all six recipe items can be removed at the same time.
4. **Given** Quad-Core Formaggi, **then** gorgonzola dolce, fontina and parmesan-style hard cheese are fixed; only extra-virgin olive oil can be removed.

---

### US-047 Live allergens and diet flags

> As a **guest with dietary needs**, I want allergens and vegetarian/vegan flags to update with every change, so that I know exactly what I am ordering.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-03 | FD-03 | BR-CONF-*, BR-DATA-10, BR-DATA-11 | PR-01 | — |

**Acceptance criteria**

1. **Given** Low-Mem Garden with the default configuration, **then** the allergen line shows "Allergens: Cereals containing gluten, Tree nuts" (TXT-CONF-28, TXT-STAT-37) and the flag `<Vegan />`.
2. **When** crust CR-04 `cheese_stuffed_v2` is chosen on Low-Mem Garden Medium, **then** `Milk` is added to the allergens and the flag changes to `<Vegetarian />` (no longer vegan).
3. **When** Low-Mem Garden is set to Small with crust CR-05 `gluten_free_fork`, **then** the allergens show only `Tree nuts`, the flag stays `<Vegan />` and the price is $16.49.
4. **When** EX-16 `spicy_pepperoni` is added to The Root Pizza, **then** the vegetarian flag disappears.
5. **When** CH-04 `no_cheese` is chosen on The Root Pizza, **then** the allergen line (TXT-CONF-28) shows only `Cereals containing gluten` and the flag is `<Vegan />`.
6. **When** the sauce of Binary BBQ is changed to SA-01, **then** `Mustard` is still shown because the fixed pulled pork contains mustard. *(negative: allergens are never removed while a source remains)*
7. **Given** Hawaiian Legacy Fix, whose fresh jalapeños are out of stock and removed automatically (US-051), **then** the spice indicator stays `MILD` (spice is a fixed product attribute).
8. The allergen notice is visible on SCR-03.

---

### US-048 Live `manifest.json` preview

> As a **developer-customer**, I want to see my pizza as a live JSON manifest, so that the configuration feels like writing code and I can double-check every choice.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-03 | FD-03 | BR-CONF-*, BR-PRICE-02, BR-DATA-10, BR-DATA-11 | PR-01 | — |

**Acceptance criteria**

1. **Given** SCR-03, **then** a read-only `manifest.json` panel shows the keys of SCR-03 E-10 in this order: `module`, `version`, `size`, `core_kernel`, `base_layer`, `cheese_driver`, `dependencies`, `unlinked`, `instances`, `unit_price`, `allergens`, `vegetarian`, `vegan` (BR-CONF-14).
2. **Given** Inferno Payload Large with EX-11 and quantity 2, **then** the preview shows `"module": "inferno-payload"`, `"size": "LARGE"`, `"dependencies": ["cherry_tomatoes"]`, `"instances": 2`, `"unit_price": 25.00` (SCR-03 E-10).
3. **When** any option changes, **then** the preview updates immediately and always equals the visible selection and price. *(negative: no stale values)*
4. Syntax colors follow `tokens.md` section 1.6; on phone the preview is collapsible and collapsed by default.

---

### US-049 Set quantity and add to cart (`Build & Deploy`)

> As a **guest**, I want to add my configured pizza to the cart in the quantity I need, so that I can continue ordering.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-03, SCR-05 | FD-03 | BR-CONF-*, BR-CART-*, BR-PRICE-04 | PR-01 | — |

**Acceptance criteria**

1. **Given** Inferno Payload Large with EX-11 and quantity 2, **then** the button `Build & Deploy` (accessible name "Add to cart") shows `$50.00`.
2. **When** it is pressed, **then** a cart line with that configuration and quantity 2 is created, a toast confirms it and the visitor returns to the page the configurator was opened from.
3. **Given** the cart already holds the identical configuration with quantity 1, **when** the same configuration is added with quantity 2, **then** the existing line becomes quantity 3 (same configuration key) instead of a new line.
4. **Given** the cart holds Inferno Payload Large with crushed red pepper removed, **when** Inferno Payload Large with all available ingredients is added, **then** a second, separate line is created (different configuration).
5. **Given** merging would exceed 10, **then** the line is set to 10 and a message says the maximum per line is 10. *(negative)*
6. Quantity is selectable from 1 to 10. *(negative: 0 and 11 are not possible)*

---

### US-050 Edit a cart line in the configurator

> As a **guest**, I want to change a pizza that is already in my cart, so that I do not have to delete and rebuild it.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-05, SCR-03 | FD-03 | BR-CONF-*, BR-CART-*, BR-PRICE-02 | PR-01 | — |

**Acceptance criteria**

1. **When** the visitor clicks `Edit` on a pizza line in SCR-05, **then** SCR-03 opens with that line's size, crust, sauce, cheese, extras, removals and quantity preselected and the button reads `Commit to manifest` (TXT-CONF-30).
2. **When** the size is changed to Small and `Commit to manifest` is pressed, **then** the same line is updated (no new line) and the cart totals are recalculated.
3. **Given** the edited configuration equals another line already in the cart, **when** saved, **then** the two lines are merged (quantities added, maximum 10).
4. **When** the visitor leaves the configurator without committing (back arrow or browser back, SCR-03 section 2), **then** the cart line is unchanged (BR-CONF-21). *(negative)*

---

### US-051 Unavailable options and ingredients

> As a **guest**, I want unavailable options to be visibly disabled, so that I never configure something the kitchen cannot make today.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-03 | FD-03 | BR-CONF-*, BR-DATA-12 | PR-01 | — |

**Acceptance criteria**

1. **Given** ingredient `jalapeno` is out of stock (seed, BR-DEMO-03a), **when** Inferno Payload is opened, **then** extra EX-09 is disabled with `SOLD_OUT` (TXT-CONF-24), the recipe item fresh jalapeños is shown as `SOLD_OUT` (TXT-CONF-24) and is removed from the configuration automatically; the pizza can still be added.
2. **Given** ingredient `buffalo_mozzarella` is out of stock, **when** The Root Pizza is opened, **then** cheese CH-02 is disabled; **given** Inferno Payload (default cheese CH-02), **then** the product is sold out and cannot be configured. *(negative)*
3. **Given** an option that is not active (`isActive = false`; none in the Lite seed), **then** it is not selectable for any pizza.
4. **Given** ingredient `porcini` (fixed on Truffle Kernel) is out of stock, **then** Truffle Kernel shows the sold-out state and EX-25 is disabled for all pizzas.

**Notes.** In Lite only `jalapeno` is out of stock and every option is active (BR-DEMO-03a); availability does not change while the app runs. AC2 – AC4 describe the rule for other states.

---

### US-052 Price breakdown

> As a **price-conscious customer**, I want to see how the unit price is made up, so that I understand every surcharge.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Should | G | SCR-03 | FD-03 | BR-CONF-*, BR-PRICE-02, BR-PRICE-03, BR-PRICE-11 | — | — |

**Acceptance criteria**

1. **Given** the configuration of US-045 AC3, **then** a breakdown lists `Boolean Pepperoni Large 14" $20.49`, `Cheese-Stuffed v2 +$2.50`, `Buffalo Mozzarella +$2.00`, `Cherry tomatoes +$2.50`, `'Nduja +$3.50`, `Oregano removed $0.00`, unit price `$30.99`, then `× quantity` and the line total.
2. Default options and removals show `$0.00`; lines with `$0.00` surcharge for non-default choices (e.g. CR-02) are shown as well.

---

### US-053 Phone layout with sticky price bar

> As a **guest on a phone**, I want the price and the add button always in reach while I scroll through the options, so that I can finish quickly.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Should | G | SCR-03 | FD-03 | BR-CONF-* | — | — |

**Acceptance criteria**

1. **Given** SCR-03 below 768 px, **then** the option groups are stacked in the order size, crust, sauce, cheese, default recipe, extras (SCR-03 R2), and a sticky bottom bar shows the unit price × quantity and `Build & Deploy`.
2. **When** any option changes, **then** the sticky bar price updates immediately.
3. The sticky bar never covers form content permanently: the last option group can be scrolled above it. *(negative)*
