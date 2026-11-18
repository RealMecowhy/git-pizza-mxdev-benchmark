# Menu Catalog — definitive demo menu

This is the single source of truth for the menu: categories, products, prices, ingredients, allergens, configurator options and coupons. The demo seed (`09-demo-data/` data files), the prototype and every test case use exactly these names, prices and codes. Price and allergen calculations follow the rules in [information-model.md](../04-information-model/information-model.md) section 6 (`BR-PRICE`) and section 8 (`BR-DATA-10`, `BR-DATA-11`, `BR-DATA-12`).

Store: **Git Pizza MxDev — Mission Kitchen**, 2140 Folsom Street, San Francisco, CA 94110 (fictional). Currency USD. Prices exclude sales tax (8.625 %).

> **Allergen notice (shown on the menu and item info):** "All items are prepared in a kitchen that handles gluten, milk, eggs, tree nuts, mustard, fish and other allergens. Cross-contact is possible. The Gluten-Free Fork crust is made without gluten ingredients but is not certified gluten-free."

---

## 1. Categories

| Order | Code | Dev label (file tab) | Plain name | Product kind | Products |
|---|---|---|---|---|---|
| 1 | `PIZZAS` | `pizzas.json` | Pizzas | PIZZA | 12 |
| 2 | `SIDES` | `sides.yml` | Sides & Dips | SIDE | 5 |
| 3 | `DRINKS` | `drinks.env` | Drinks | DRINK | 5 |
| 4 | `DESSERTS` | `desserts.md` | Desserts | DESSERT | 3 |

Stitch used other tab names (`drinks.yml`, `beverages.env`, `desserts.sh`, `crust_addons.yml`); this table replaces them. Crust add-ons are configurator options (section 4), not a category.

---

## 2. Pizzas (`pizzas.json`)

Sizes: **Small 10"** (6 slices) · **Medium 12"** (8 slices, default) · **Large 14"** (8 slices). Calzone: Medium 12" only. Every pizza's default crust is **CR-01 Neapolitan Core**. "Card price" = Medium (BR-PRICE-01).

### 2.1 Overview

| Code | Dev name | Real-world equivalent | Module key | Version | Small 10" | Medium 12" | Large 14" | Spice | Diet | Badges | Featured | Photo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PZ-01 | The Root Pizza | Margherita | `root-pizza` | `v1.0-LTS` | $11.99 | $14.99 | $17.99 | NONE | Vegetarian | CLASSIC | yes | **present** |
| PZ-02 | Boolean Pepperoni | Pepperoni with hot honey | `boolean-pepperoni` | `v1.2` | $13.49 | $16.99 | $20.49 | MILD | — | BEST_SELLER | yes | **present** |
| PZ-03 | SQL Supreme | Supreme | `sql-supreme` | `v2.0` | $14.99 | $18.49 | $22.49 | NONE | — | — | yes | **present** |
| PZ-04 | Binary BBQ | BBQ pulled pork | `binary-bbq` | `v2.0.4` | $15.99 | $19.99 | $24.00 | NONE | — | CHEF_PICK | yes | **present** |
| PZ-05 | Inferno Payload | Diavola | `inferno-payload` | `v2.4` | $14.49 | $18.49 | $22.50 | HOT | — | — | yes | **present** |
| PZ-06 | Kernel Panic Meat | Meat lovers | `kernel-panic-meat` | `v3.1` | $15.99 | $19.99 | $24.49 | NONE | — | — | no | **present** |
| PZ-07 | Truffle Kernel | Truffle & wild mushroom bianca | `truffle-kernel` | `v2.0` | $16.49 | $20.49 | $24.99 | NONE | Vegetarian | NEW | no | **present** |
| PZ-08 | Quad-Core Formaggi | Quattro formaggi | `quad-core-formaggi` | `v4.0` | $13.99 | $17.49 | $21.49 | NONE | Vegetarian | — | no | **present** |
| PZ-09 | The Clean Code | Ortolana (grilled vegetables) | `clean-code` | `v1.3` | $12.99 | $16.49 | $19.99 | NONE | Vegetarian | — | no | **present** |
| PZ-10 | Low-Mem Garden | Vegan garden pizza | `low-mem-garden` | `v3.0-RC` | $13.49 | $16.99 | $20.49 | NONE | Vegan | NEW | yes | **present** |
| PZ-11 | Hawaiian Legacy Fix | Hawaiian (ham & pineapple) | `hawaiian-legacy-fix` | `v0.9-legacy` | $13.49 | $16.99 | $20.49 | MILD | — | CLASSIC | no | **present** |
| PZ-12 | Calzone Container | Calzone | `calzone-container` | `v1.1` | — | $16.49 | — | NONE | — | — | no | **present** |

Diet values are derived from the default configuration (BR-DATA-10); they change in the configurator when the customer changes options.

### 2.2 Details

Each recipe lists the **default sauce** and **default cheese** (options, section 4), then the recipe items (ingredients, section 3). "R" = removable by the customer, "fixed" = cannot be removed (signature ingredient). Allergens are derived from the default configuration with crust CR-01 (BR-DATA-11). Calories are approximate, for the whole pizza.

#### PZ-01 The Root Pizza — Margherita

- **Short description:** San Marzano tomatoes, fior di latte and fresh basil on our 48-hour dough.
- **Description:** The essential foundation. Hand-crushed San Marzano DOP tomatoes, creamy fior di latte mozzarella and torn basil on a 48-hour fermented Neapolitan crust, finished with a ribbon of cold-pressed extra-virgin olive oil. Clean, minimal and perfectly balanced: the architecture of pure flavor.
- **Defaults:** sauce SA-01 San Marzano Tomato · cheese CH-01 Fior di Latte Mozzarella
- **Recipe items:** fresh basil (FINISH, R) · extra-virgin olive oil (FINISH, R)
- **Allergens:** GLUTEN, MILK · **Vegetarian:** yes · **Vegan:** no · **Spice:** NONE
- **Calories:** S 760 · M 1,080 · L 1,470 · **Max extras:** 5
- **Image alt:** "The Root Pizza: Margherita with San Marzano tomato, melted fior di latte and fresh basil leaves."

#### PZ-02 Boolean Pepperoni — Pepperoni with hot honey

- **Short description:** Double-layer cup-and-char pepperoni with a hot honey glaze.
- **Description:** A binary choice that always returns true. Two layers of cup-and-char pepperoni that crisp into little bowls of flavor, fior di latte and San Marzano sauce, finished with a drizzle of chili-infused wildflower hot honey and a pinch of Sicilian oregano.
- **Defaults:** SA-01 · CH-01
- **Recipe items:** cup-and-char pepperoni (TOPPING, fixed) · dried oregano (TOPPING, R) · hot honey (FINISH, R)
- **Allergens:** GLUTEN, MILK · **Vegetarian:** no · **Spice:** MILD
- **Calories:** S 900 · M 1,290 · L 1,750 · **Max extras:** 5
- **Image alt:** "Boolean Pepperoni: pepperoni pizza with crisp curled pepperoni cups and a glossy hot honey drizzle."

#### PZ-03 SQL Supreme — Supreme

- **Short description:** Fennel sausage, mushrooms, peppers, red onion and olives.
- **Description:** Complex queries for complex palates. Fennel Italian sausage, cremini mushrooms, green bell pepper, red onion and Taggiasca olives over San Marzano sauce and fior di latte, seasoned with Sicilian oregano. Every join returns something delicious.
- **Defaults:** SA-01 · CH-01
- **Recipe items:** fennel Italian sausage (R) · cremini mushrooms (R) · green bell pepper (R) · red onion (R) · Taggiasca olives (R) · dried oregano (R) — all TOPPING
- **Allergens:** GLUTEN, MILK · **Vegetarian:** no · **Spice:** NONE
- **Calories:** S 970 · M 1,380 · L 1,880 · **Max extras:** 5
- **Image alt:** "SQL Supreme: supreme pizza with sausage, mushrooms, green peppers, red onion and black olives."

#### PZ-04 Binary BBQ — BBQ pulled pork

- **Short description:** Smoked pulled pork, caramelized onions and smoked provolone on hickory BBQ sauce.
- **Description:** Low and slow meets hot and fast. Hickory-smoked pulled pork shoulder, sweet caramelized onions, sharp red onion and smoked provolone on a smoky BBQ base with fior di latte, finished with fresh basil and a blistered, leopard-spotted rim.
- **Defaults:** sauce SA-02 Smoked BBQ · cheese CH-01
- **Recipe items:** hickory-smoked pulled pork (TOPPING, fixed) · smoked provolone (TOPPING, R) · caramelized onions (TOPPING, R) · red onion (TOPPING, R) · fresh basil (FINISH, R)
- **Allergens:** GLUTEN, MILK, MUSTARD · **Vegetarian:** no · **Spice:** NONE
- **Calories:** S 1,020 · M 1,460 · L 1,990 · **Max extras:** 5
- **Image:** `assets/products/pz-04-binary-bbq.jpg` · **Alt:** "Binary BBQ: Neapolitan pizza with pulled pork, caramelized onions and fresh basil on a dark slate."

#### PZ-05 Inferno Payload — Diavola

- **Short description:** Spicy spianata calabrese, fresh jalapeños and buffalo mozzarella with Calabrian chili oil.
- **Description:** Deploy with caution: this payload runs hot. Spicy spianata calabrese salami, fresh jalapeño coins and creamy buffalo mozzarella over San Marzano sauce, finished with Calabrian chili oil and crushed red pepper.
- **Defaults:** SA-01 · cheese CH-02 Buffalo Mozzarella (default, so no surcharge)
- **Recipe items:** spianata calabrese (TOPPING, fixed) · fresh jalapeños (TOPPING, R) · Calabrian chili oil (FINISH, R) · crushed red pepper (FINISH, R)
- **Allergens:** GLUTEN, MILK · **Vegetarian:** no · **Spice:** HOT
- **Calories:** S 920 · M 1,310 · L 1,780 · **Max extras:** 5
- **Image:** `assets/products/pz-05-inferno-payload.jpg` · **Alt:** "Inferno Payload: spicy pizza with salami, jalapeño slices, buffalo mozzarella and chili flakes."

#### PZ-06 Kernel Panic Meat — Meat lovers

- **Short description:** Pepperoni, fennel sausage, smoked bacon and Italian ham.
- **Description:** Four protein threads, zero deadlocks. Cup-and-char pepperoni, fennel Italian sausage, applewood-smoked bacon and prosciutto cotto layered over San Marzano sauce and fior di latte, with a dusting of oregano. Built for serious appetites.
- **Defaults:** SA-01 · CH-01
- **Recipe items:** pepperoni (R) · fennel Italian sausage (R) · applewood-smoked bacon (R) · prosciutto cotto (R) · dried oregano (R) — all TOPPING
- **Allergens:** GLUTEN, MILK · **Vegetarian:** no · **Spice:** NONE
- **Calories:** S 1,110 · M 1,590 · L 2,160 · **Max extras:** 5
- **Image alt:** "Kernel Panic Meat: meat lovers pizza loaded with pepperoni, sausage, bacon and ham."

#### PZ-07 Truffle Kernel — Truffle & wild mushroom bianca

- **Short description:** Black truffle cream, porcini and cremini mushrooms, cool stracciatella.
- **Description:** A white pizza for the winter release. Black truffle cream instead of tomato, roasted porcini and cremini mushrooms and fior di latte, finished after the bake with spoonfuls of cool, milky stracciatella and a few drops of black truffle oil.
- **Defaults:** sauce SA-04 Black Truffle Cream (default, so no surcharge) · cheese CH-01
- **Recipe items:** porcini mushrooms (TOPPING, fixed) · cremini mushrooms (TOPPING, R) · stracciatella (FINISH, R) · black truffle oil (FINISH, R)
- **Allergens:** GLUTEN, MILK · **Vegetarian:** yes · **Vegan:** no · **Spice:** NONE
- **Calories:** S 950 · M 1,350 · L 1,840 · **Max extras:** 5
- **Image alt:** "Truffle Kernel: white pizza with roasted mushrooms and dollops of stracciatella."

#### PZ-08 Quad-Core Formaggi — Quattro formaggi

- **Short description:** Four cheeses, no sauce: mozzarella, gorgonzola, fontina and aged hard cheese.
- **Description:** Four cores running in parallel. A bianca base of fior di latte, creamy gorgonzola dolce, nutty fontina and a vegetarian parmesan-style hard cheese, baked until bubbling and finished with extra-virgin olive oil. Rich, savory and perfectly multithreaded.
- **Defaults:** sauce SA-06 No Sauce (bianca) · cheese CH-01
- **Recipe items:** gorgonzola dolce (TOPPING, fixed) · fontina (TOPPING, fixed) · parmesan-style hard cheese (TOPPING, fixed) · extra-virgin olive oil (FINISH, R)
- **Allergens:** GLUTEN, MILK · **Vegetarian:** yes (all cheeses made with microbial rennet) · **Spice:** NONE
- **Calories:** S 990 · M 1,420 · L 1,930 · **Max extras:** 5
- **Image alt:** "Quad-Core Formaggi: golden four-cheese pizza with melted pools of gorgonzola."

#### PZ-09 The Clean Code — Ortolana

- **Short description:** Grilled zucchini, roasted eggplant, peppers and cherry tomatoes.
- **Description:** Readable, maintainable and full of vegetables. Grilled zucchini, roasted eggplant, roasted red peppers, sweet cherry tomatoes and red onion over San Marzano sauce and fior di latte, finished with fresh basil. No technical debt, just flavor.
- **Defaults:** SA-01 · CH-01
- **Recipe items:** grilled zucchini (R) · roasted eggplant (R) · roasted red peppers (R) · cherry tomatoes (R) · red onion (R) — TOPPING · fresh basil (FINISH, R)
- **Allergens:** GLUTEN, MILK · **Vegetarian:** yes · **Vegan:** no · **Spice:** NONE
- **Calories:** S 780 · M 1,120 · L 1,520 · **Max extras:** 5
- **Image alt:** "The Clean Code: vegetable pizza with grilled zucchini, eggplant, red peppers and cherry tomatoes."

#### PZ-10 Low-Mem Garden — Vegan garden pizza

- **Short description:** Yellow tomato, cashew mozzarella, artichokes, olives and arugula. 100 % plant-based.
- **Description:** Small footprint, full performance. Sweet yellow datterini tomato sauce and melty cashew mozzarella topped with marinated artichoke hearts, Taggiasca olives and cherry tomatoes, finished with dollops of lemony cashew ricotta, wild arugula and extra-virgin olive oil. Entirely plant-based.
- **Defaults:** sauce SA-05 Yellow Tomato · cheese CH-03 Vegan Cashew Mozzarella (default, so no surcharge)
- **Recipe items:** artichoke hearts (TOPPING, R) · Taggiasca olives (TOPPING, R) · cherry tomatoes (TOPPING, R) · cashew ricotta (FINISH, R) · wild arugula (FINISH, R) · extra-virgin olive oil (FINISH, R)
- **Allergens:** GLUTEN, TREE_NUTS · **Vegetarian:** yes · **Vegan:** yes (with crusts CR-01, CR-02, CR-03, CR-05; CR-04 Cheese-Stuffed v2 makes it non-vegan) · **Spice:** NONE
- **Calories:** S 740 · M 1,060 · L 1,440 · **Max extras:** 5
- **Image alt:** "Low-Mem Garden: vegan pizza with yellow tomato, artichokes, olives and fresh arugula."

#### PZ-11 Hawaiian Legacy Fix — Hawaiian

- **Short description:** Italian ham, roasted pineapple and a jalapeño patch.
- **Description:** Legacy code that still ships, now with a hotfix. Prosciutto cotto and caramelized roasted pineapple over San Marzano sauce and fior di latte, patched with a few fresh jalapeño slices for a sweet-and-heat balance.
- **Defaults:** SA-01 · CH-01
- **Recipe items:** prosciutto cotto (TOPPING, fixed) · roasted pineapple (TOPPING, fixed) · fresh jalapeños (TOPPING, R)
- **Allergens:** GLUTEN, MILK · **Vegetarian:** no · **Spice:** MILD (spice level is a fixed product attribute; it is not recalculated when jalapeños are removed or added)
- **Calories:** S 850 · M 1,210 · L 1,650 · **Max extras:** 5
- **Image alt:** "Hawaiian Legacy Fix: ham and pineapple pizza with a few green jalapeño slices."

#### PZ-12 Calzone Container — Calzone

- **Short description:** Folded and sealed: ricotta, mozzarella, Italian ham and mushrooms.
- **Description:** Everything packaged in one portable container. Our Neapolitan dough folded around whole-milk ricotta, fior di latte, prosciutto cotto, cremini mushrooms and fresh basil, baked until golden and served with San Marzano sauce baked inside.
- **Defaults:** SA-01 · CH-01 · crust fixed to CR-01 (`crustSelectable = false`)
- **Recipe items:** whole-milk ricotta (TOPPING, fixed) · prosciutto cotto (TOPPING, R) · cremini mushrooms (TOPPING, R) · fresh basil (TOPPING, R)
- **Sizes:** Medium 12" only ($16.49), 1 piece (not sliced)
- **Allergens:** GLUTEN, MILK · **Vegetarian:** no · **Spice:** NONE
- **Calories:** M 1,240 · **Max extras:** 3
- **Image alt:** "Calzone Container: golden folded calzone, cut open to show ricotta, ham and mushrooms."

---

## 3. Ingredients

Allergen codes: GLU gluten, MLK milk, EGG eggs, FSH fish, TNT tree nuts, MUS mustard, CEL celery, SOY soybeans (full EU-14 list in the information model). V = vegetarian, VG = vegan.

| Code | Name | Allergens | V | VG | Used in |
|---|---|---|---|---|---|
| `dough_neapolitan` | Neapolitan dough ("00" wheat flour, water, sea salt, yeast; 48 h ferment) | GLU | ✓ | ✓ | CR-01 |
| `dough_thin` | Thin-crust dough (wheat flour, olive oil, salt, yeast) | GLU | ✓ | ✓ | CR-02 |
| `dough_sourdough` | Sourdough (wheat and rye flour, natural starter; 72 h) | GLU | ✓ | ✓ | CR-03 |
| `dough_stuffed` | Neapolitan dough with a mozzarella-filled rim | GLU, MLK | ✓ | — | CR-04 |
| `dough_gluten_free` | Gluten-free base (rice flour, tapioca, potato starch, psyllium, olive oil) | — | ✓ | ✓ | CR-05 |
| `tomato_san_marzano` | San Marzano DOP tomato sauce | — | ✓ | ✓ | SA-01 |
| `bbq_sauce_smoked` | Smoked hickory BBQ sauce (tomato, molasses, cider vinegar, mustard, spices) | MUS | ✓ | ✓ | SA-02 |
| `garlic_cream` | Garlic cream (cream, roasted garlic, black pepper) | MLK | ✓ | — | SA-03 |
| `truffle_cream` | Black truffle cream (cream, black summer truffle, parmesan-style cheese) | MLK | ✓ | — | SA-04 |
| `tomato_yellow` | Yellow datterini tomato purée | — | ✓ | ✓ | SA-05 |
| `fior_di_latte` | Fior di latte mozzarella | MLK | ✓ | — | CH-01, EX-01 |
| `buffalo_mozzarella` | Buffalo mozzarella (Mozzarella di Bufala Campana DOP) | MLK | ✓ | — | CH-02 |
| `cashew_mozzarella` | Cashew mozzarella (cashews, coconut oil, tapioca) | TNT | ✓ | ✓ | CH-03 |
| `smoked_provolone` | Smoked provolone | MLK | ✓ | — | PZ-04 |
| `gorgonzola` | Gorgonzola dolce (microbial rennet) | MLK | ✓ | — | PZ-08 |
| `fontina` | Fontina (microbial rennet) | MLK | ✓ | — | PZ-08 |
| `parmesan_style` | Parmesan-style hard cheese (microbial rennet) | MLK | ✓ | — | PZ-08 |
| `ricotta` | Whole-milk ricotta | MLK | ✓ | — | PZ-12 |
| `stracciatella` | Stracciatella | MLK | ✓ | — | PZ-07, EX-24 |
| `cashew_ricotta` | Cashew ricotta (cashews, lemon, olive oil) | TNT | ✓ | ✓ | PZ-10 |
| `pepperoni` | Cup-and-char pepperoni (pork and beef) | — | — | — | PZ-02, PZ-06, EX-16 |
| `spianata_calabrese` | Spianata calabrese (spicy Calabrian pork salami) | — | — | — | PZ-05, EX-20 |
| `nduja` | 'Nduja (spreadable spicy pork salami) | — | — | — | EX-21 |
| `italian_sausage` | Fennel Italian sausage (pork) | — | — | — | PZ-03, PZ-06, EX-17 |
| `smoked_bacon` | Applewood-smoked bacon | — | — | — | PZ-06, EX-18 |
| `prosciutto_cotto` | Prosciutto cotto (Italian cooked ham) | — | — | — | PZ-06, PZ-11, PZ-12, EX-19 |
| `pulled_pork` | Hickory-smoked pulled pork (dry rub with mustard) | MUS | — | — | PZ-04, EX-22 |
| `grilled_chicken` | Grilled chicken breast | — | — | — | EX-23 |
| `basil` | Fresh basil | — | ✓ | ✓ | PZ-01, PZ-04, PZ-09, PZ-12, EX-02 |
| `oregano` | Dried Sicilian oregano | — | ✓ | ✓ | PZ-02, PZ-03, PZ-06 |
| `cremini` | Cremini mushrooms | — | ✓ | ✓ | PZ-03, PZ-07, PZ-12, EX-03 |
| `porcini` | Roasted porcini mushrooms | — | ✓ | ✓ | PZ-07, EX-25 |
| `red_onion` | Red onion | — | ✓ | ✓ | PZ-03, PZ-04, PZ-09, EX-04 |
| `caramelized_onion` | Caramelized onions | — | ✓ | ✓ | PZ-04, EX-05 |
| `green_pepper` | Green bell pepper | — | ✓ | ✓ | PZ-03, EX-06 |
| `roasted_red_pepper` | Roasted red peppers | — | ✓ | ✓ | PZ-09, EX-07 |
| `black_olives` | Taggiasca olives | — | ✓ | ✓ | PZ-03, PZ-10, EX-08 |
| `jalapeno` | Fresh jalapeños | — | ✓ | ✓ | PZ-05, PZ-11, EX-09 |
| `pineapple` | Roasted pineapple | — | ✓ | ✓ | PZ-11, EX-10 |
| `cherry_tomatoes` | Cherry tomatoes | — | ✓ | ✓ | PZ-09, PZ-10, EX-11 |
| `zucchini` | Grilled zucchini | — | ✓ | ✓ | PZ-09 |
| `eggplant` | Roasted eggplant | — | ✓ | ✓ | PZ-09 |
| `artichoke` | Marinated artichoke hearts | — | ✓ | ✓ | PZ-10 |
| `arugula` | Wild arugula | — | ✓ | ✓ | PZ-10, EX-12 |
| `roasted_garlic` | Roasted garlic cloves | — | ✓ | ✓ | EX-13 |
| `evoo` | Extra-virgin olive oil (cold-pressed) | — | ✓ | ✓ | PZ-01, PZ-08, PZ-10 |
| `hot_honey` | Hot honey (wildflower honey, chili) | — | ✓ | — | PZ-02, EX-14 |
| `chili_oil` | Calabrian chili oil | — | ✓ | ✓ | PZ-05 |
| `chili_flakes` | Crushed red pepper | — | ✓ | ✓ | PZ-05 |
| `truffle_oil` | Black truffle oil | — | ✓ | ✓ | PZ-07 |
| `garlic_butter` | Garlic butter (butter, garlic, parsley) | MLK | ✓ | — | EX-15 |

After a demo reset every ingredient is in stock except **`jalapeno`** (`isInStock = false`, `README.md` BR-DEMO-03a). The extra `EX-09` Jalapeños is therefore unavailable, and Inferno Payload (`PZ-05`) and Hawaiian Legacy Fix (`PZ-11`), where jalapeños are a removable recipe item, stay orderable without them (BR-DATA-12). Nothing in Lite changes the stock while the app runs; every reset restores this state.

---

## 4. Configurator options

Rules: one crust, one sauce, one cheese per pizza (required); extras 0 to `maxExtras` (5; calzone 3), each extra at most once; any recipe item marked R may be removed for free; the default crust/sauce/cheese of a pizza costs 0.00 (BR-PRICE-02). The UI shows the dev key (`neapolitan_core`) with the plain name.

### 4.1 Crust — `core_kernel`

| Code | Key | Name | Description | Surcharge | Sizes | Ingredient |
|---|---|---|---|---|---|---|
| CR-01 | `neapolitan_core` | Neapolitan Core | Puffy, leopard-spotted rim. 48-hour ferment. | $0.00 | S M L | `dough_neapolitan` |
| CR-02 | `thin_client` | Thin Client | Thin, crisp and light. Low memory footprint. | $0.00 | S M L | `dough_thin` |
| CR-03 | `sourdough_build` | Sourdough Build | 72-hour wheat and rye sourdough. Tangy and airy. | $1.50 | S M L | `dough_sourdough` |
| CR-04 | `cheese_stuffed_v2` | Cheese-Stuffed v2 | Mozzarella-filled rim. | $2.50 | M L | `dough_stuffed` |
| CR-05 | `gluten_free_fork` | Gluten-Free Fork | Rice-flour base, made without gluten ingredients. 10" only. | $3.00 | S | `dough_gluten_free` |

When the customer switches to a size an already chosen crust does not support, the crust resets to CR-01 and a notice explains why (wording in `06-ui-specification/`).

### 4.2 Sauce — `base_layer`

| Code | Key | Name | Surcharge (if not default) | Ingredient |
|---|---|---|---|---|
| SA-01 | `san_marzano` | San Marzano Tomato | $0.00 | `tomato_san_marzano` |
| SA-02 | `smoked_bbq` | Smoked BBQ | $0.00 | `bbq_sauce_smoked` |
| SA-03 | `garlic_cream` | Garlic Cream | $0.00 | `garlic_cream` |
| SA-04 | `truffle_cream` | Black Truffle Cream | $2.00 | `truffle_cream` |
| SA-05 | `yellow_tomato` | Yellow Tomato | $0.00 | `tomato_yellow` |
| SA-06 | `no_sauce` | No Sauce (bianca) | $0.00 | — |

### 4.3 Cheese — `cheese_driver`

| Code | Key | Name | Surcharge (if not default) | Ingredient |
|---|---|---|---|---|
| CH-01 | `fior_di_latte` | Fior di Latte Mozzarella | $0.00 | `fior_di_latte` |
| CH-02 | `buffalo_mozzarella` | Buffalo Mozzarella | $2.00 | `buffalo_mozzarella` |
| CH-03 | `vegan_cashew_mozz` | Vegan Cashew Mozzarella | $1.50 | `cashew_mozzarella` |
| CH-04 | `no_cheese` | No Cheese | $0.00 | — |

### 4.4 Extra toppings — `dependencies`

STANDARD: Small $1.50 · Medium $2.00 · Large $2.50. PREMIUM: Small $2.50 · Medium $3.00 · Large $3.50. All extras are available for all sizes. Version tags are decorative.

| Code | Key | Name | Class | Ingredient | Version tag |
|---|---|---|---|---|---|
| EX-01 | `extra_cheese` | Extra mozzarella | STANDARD | `fior_di_latte` | `v1.2.0 · core` |
| EX-02 | `fresh_basil` | Fresh basil | STANDARD | `basil` | `v0.8.0 · beta` |
| EX-03 | `mushrooms` | Cremini mushrooms | STANDARD | `cremini` | `v1.4.2` |
| EX-04 | `red_onion` | Red onion | STANDARD | `red_onion` | `v1.0.3` |
| EX-05 | `caramelized_onion` | Caramelized onions | STANDARD | `caramelized_onion` | `v2.1.0` |
| EX-06 | `green_pepper` | Green bell pepper | STANDARD | `green_pepper` | `v1.0.0` |
| EX-07 | `roasted_red_pepper` | Roasted red peppers | STANDARD | `roasted_red_pepper` | `v1.3.1` |
| EX-08 | `olives` | Taggiasca olives | STANDARD | `black_olives` | `v1.1.0` |
| EX-09 | `jalapenos` | Jalapeños | STANDARD | `jalapeno` | `v3.0.0 · hot` |
| EX-10 | `pineapple` | Roasted pineapple | STANDARD | `pineapple` | `v0.9.9 · legacy` |
| EX-11 | `cherry_tomatoes` | Cherry tomatoes | STANDARD | `cherry_tomatoes` | `v1.2.4` |
| EX-12 | `arugula` | Wild arugula | STANDARD | `arugula` | `v1.0.1` |
| EX-13 | `roasted_garlic` | Roasted garlic | STANDARD | `roasted_garlic` | `v1.1.2` |
| EX-14 | `hot_honey` | Hot honey drizzle | STANDARD | `hot_honey` | `v2.0.0` |
| EX-15 | `garlic_butter` | Garlic butter crust brush | STANDARD | `garlic_butter` | `v1.1.2 · shell` |
| EX-16 | `spicy_pepperoni` | Pepperoni | PREMIUM | `pepperoni` | `v2.4.1 · addon` |
| EX-17 | `italian_sausage` | Fennel Italian sausage | PREMIUM | `italian_sausage` | `v2.0.0` |
| EX-18 | `smoked_bacon` | Applewood-smoked bacon | PREMIUM | `smoked_bacon` | `v1.5.0` |
| EX-19 | `prosciutto_cotto` | Italian ham (prosciutto cotto) | PREMIUM | `prosciutto_cotto` | `v1.0.0` |
| EX-20 | `spianata` | Spianata calabrese | PREMIUM | `spianata_calabrese` | `v2.4.0 · hot` |
| EX-21 | `nduja` | 'Nduja | PREMIUM | `nduja` | `v1.0.0 · hot` |
| EX-22 | `pulled_pork` | Smoked pulled pork | PREMIUM | `pulled_pork` | `v2.0.4` |
| EX-23 | `grilled_chicken` | Grilled chicken | PREMIUM | `grilled_chicken` | `v1.0.0` |
| EX-24 | `stracciatella` | Stracciatella | PREMIUM | `stracciatella` | `v1.1.0` |
| EX-25 | `porcini` | Porcini mushrooms | PREMIUM | `porcini` | `v1.0.2` |

Adding an extra that is already a default ingredient (for example Pepperoni on Boolean Pepperoni) is allowed and means "extra portion".

---

## 5. Sides & Dips (`sides.yml`)

All sides have one size (REGULAR). They are not configurable; they open the item info modal (SCR-04).

| Code | Dev name | Real-world equivalent | Module key | Serving | Price | Allergens | Diet | Spice | kcal | Photo |
|---|---|---|---|---|---|---|---|---|---|---|
| SD-01 | Garlic Knot Loop | Garlic knots with marinara | `garlic-knot-loop` | 6 pieces + 2 fl oz marinara | $6.50 | GLUTEN, MILK | Vegetarian | NONE | 520 | **present** |
| SD-02 | Caesar Cipher Salad | Caesar salad | `caesar-cipher-salad` | 1 bowl | $8.95 | GLUTEN, MILK, EGGS, FISH, MUSTARD | — | NONE | 430 | **present** |
| SD-03 | Hot Wings Webhook | Chicken wings, Calabrian chili glaze | `hot-wings-webhook` | 8 wings + blue cheese dip + celery | $11.95 | MILK, EGGS, CELERY | — | MEDIUM | 760 | **present** |
| SD-04 | Garlic Driver Dip | Roasted garlic & herb dip | `garlic-driver-dip` | 2 fl oz | $1.50 | MILK, EGGS | Vegetarian | NONE | 210 | **present** |
| SD-05 | Jalapeño Patch Dip | Creamy jalapeño ranch dip | `jalapeno-patch-dip` | 2 fl oz | $1.50 | MILK, EGGS | Vegetarian | MILD | 190 | **present** |

Descriptions:

- **SD-01 Garlic Knot Loop** — "Six hand-tied knots of our pizza dough, baked golden, tossed in garlic butter, parsley and parmesan-style cheese, with San Marzano marinara for dipping. An infinite loop you will not want to break."
- **SD-02 Caesar Cipher Salad** — "Crisp romaine hearts, shaved parmesan-style cheese and sourdough croutons in a classic anchovy Caesar dressing. Decrypts to: delicious."
- **SD-03 Hot Wings Webhook** — "Eight crispy oven-roasted chicken wings glazed with Calabrian chili and honey, served with blue cheese dip and celery sticks. Fires on every bite."
- **SD-04 Garlic Driver Dip** — "Roasted garlic and herb emulsion. The essential driver for crusts and knots."
- **SD-05 Jalapeño Patch Dip** — "Cool buttermilk ranch with fresh jalapeño and cilantro. A gentle heat patch for any slice."

## 6. Drinks (`drinks.env`)

| Code | Dev name | Real-world equivalent | Module key | Serving | Price | Allergens | Diet | Caffeine | kcal | Photo |
|---|---|---|---|---|---|---|---|---|---|---|
| DR-01 | Mate Compiler Tonic | Sparkling yerba mate | `mate-compiler-tonic` | 12 fl oz can | $4.50 | — | Vegan | 150 mg | 15 | **present** |
| DR-02 | Cold Brew Commit | Cold brew coffee | `cold-brew-commit` | 12 fl oz bottle | $4.75 | — | Vegan | 200 mg | 10 | **present** |
| DR-03 | Cola Cache | Classic cola | `cola-cache` | 12 fl oz can | $2.75 | — | Vegan | 34 mg | 140 | **present** |
| DR-04 | Lemon Lint Soda | Italian sparkling lemon soda | `lemon-lint-soda` | 11.2 fl oz bottle | $3.25 | — | Vegan | 0 mg | 150 | **present** |
| DR-05 | Sparkling Stream Water | Sparkling mineral water | `sparkling-stream-water` | 16.9 fl oz bottle | $2.95 | — | Vegan | 0 mg | 0 | **present** |

Descriptions:

- **DR-01 Mate Compiler Tonic** — "Cold-brewed yerba mate with green tea and a squeeze of lime, lightly sparkling and sugar-free. Clean energy for long compile times." Image: `assets/products/dr-01-mate-compiler-tonic.jpg`.
- **DR-02 Cold Brew Commit** — "Single-origin Colombian coffee steeped cold for 18 hours. Smooth, chocolatey, unsweetened. Commit to the night shift."
- **DR-03 Cola Cache** — "Ice-cold classic cola with cane sugar. Always a cache hit."
- **DR-04 Lemon Lint Soda** — "Sparkling Sicilian lemon soda, bright and not too sweet. Removes every warning from your palate."
- **DR-05 Sparkling Stream Water** — "Naturally carbonated Italian mineral water. Zero dependencies."

## 7. Desserts (`desserts.md`)

| Code | Dev name | Real-world equivalent | Module key | Serving | Price | Allergens | Diet | kcal | Photo |
|---|---|---|---|---|---|---|---|---|---|
| DS-01 | Tiramisu Stack | Tiramisu | `tiramisu-stack` | 1 cup | $7.50 | GLUTEN, EGGS, MILK | Vegetarian | 450 | **present** |
| DS-02 | Cannoli Callback | Sicilian cannoli | `cannoli-callback` | 2 pieces | $6.95 | GLUTEN, MILK, EGGS, TREE_NUTS | Vegetarian | 520 | **present** |
| DS-03 | Lava Exception Cake | Molten chocolate lava cake | `lava-exception-cake` | 1 cake | $7.25 | GLUTEN, EGGS, MILK, SOYBEANS | Vegetarian | 480 | **present** |

Descriptions:

- **DS-01 Tiramisu Stack** — "Espresso-soaked ladyfingers layered with whipped mascarpone and finished with dark cocoa. Every layer pushed in the right order."
- **DS-02 Cannoli Callback** — "Two crisp Sicilian shells piped to order with sweet ricotta and chocolate chips, dipped in crushed pistachios. Called back the moment you finish."
- **DS-03 Lava Exception Cake** — "A warm dark-chocolate cake with a molten center that throws on the first spoonful. Handle with vanilla ice cream (not included)."

`DS-01` Tiramisu Stack is **sold out** in the seed (`isSoldOut = true`, `README.md` BR-DEMO-03a): it stays on the menu, shows the sold-out state and cannot be added to the cart. All other products are available.

---

## 8. Coupons

| Code | Description (shown when applied) | Type | Value | Max discount | Min subtotal | Valid until | Active | Delivery only |
|---|---|---|---|---|---|---|---|---|
| `GITHUB_STUDENT` | Student discount: 15% off, up to $10. | PERCENT | 15 | $10.00 | $20.00 | 2027-06-30 23:59 | yes | no |
| `FREE_DISPATCH` | Free delivery on this order. | FREE_DELIVERY | — | — | $15.00 | — | yes | yes |
| `HOTFIX10` | 10% off (October hotfix sale). | PERCENT | 10 | — | $0.00 | **2026-10-31 23:59 (expired)** | yes | no |

Test intent: `GITHUB_STUDENT` succeeds and shows the cap and the minimum; `FREE_DISPATCH` shows the delivery-only rule; `HOTFIX10` shows the expired message. Lite has no accounts, so it has no account-only or first-order coupon; any other code is unknown.

---

## 9. Product photos

All 25 products have a photo (delivered by the owner on 2026-11-05; column Photo = **present** in every table above). Naming rule: `assets/products/<code in lower case>-<module key>.jpg`, 1024 × 1024 JPEG, e.g. `pz-01-root-pizza.jpg`; the same name is in `menu-items.json` / `.csv` (`imageFile`, `imageAvailable: true`). A product without a photo (`imageAvailable = false`) would show the product image placeholder (`assets/README.md` section 2, `07-design-system/imagery.md`) until a photo is uploaded. The full list is in [../assets/README.md](../assets/README.md) section 1.2.
