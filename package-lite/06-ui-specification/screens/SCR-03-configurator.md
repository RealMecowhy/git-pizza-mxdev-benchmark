# SCR-03 — Pizza configurator (`configure_module.ts`)

| Field | Value |
|---|---|
| Type | Page (phone: full page) inside SCR-16, without the Project Explorer sidebar |
| Roles | G |
| MoSCoW | Must |
| Functional area / epic | FD-03 / EP-03 |
| Rules, processes | BR-CONF (FD-03), BR-PRICE-02, BR-PRICE-03, BR-DATA-10, BR-DATA-11, BR-DATA-12, menu catalog section 4, PR-01 |
| Prototype | [SCR-03-pizza-configurator.html](../../08-prototype/customer/SCR-03-pizza-configurator.html) |
| Stitch reference | desktop [`desktop/module-configurator.png`](../../assets/stitch-reference/desktop/module-configurator.png) (obsolete branding) · phone [`mobile/configurator-mobile.jpg`](../../assets/stitch-reference/mobile/configurator-mobile.jpg) |
| Images | product photo or placeholder (`assets/products/`) |

## 1. Purpose

Configure one pizza — size, crust, sauce, cheese, up to `maxExtras` extra toppings, removal of removable default ingredients, quantity — with live price, allergens, dietary flags and a `manifest.json` preview, then add it to the cart or update an existing cart line.

## 2. Entry and exit

| Entry | Exit |
|---|---|
| SCR-02 `Configure` or pizza card click; SCR-01 featured pizza; SCR-04 `Configure this module →`; SCR-05 `edit` on a pizza line (edit mode); deep link with product | `Build & Deploy` → after adding, the user returns to the page they came from (SCR-02 / SCR-01; SCR-02 when opened by deep link) and the toast confirms; the cart count updates. In edit mode `Commit to manifest` → back to SCR-05 (drawer open). Back arrow / browser back → previous page without changes. |

Only pizzas (`ProductKind = PIZZA`) open the configurator. A non-pizza product link opens SCR-04; an unknown, draft or archived product opens SCR-40.

## 3. Layout (desktop)

| Region | Content |
|---|---|
| R1 Breadcrumb bar | TXT-CONF-01 path `src › modules › configure_module.ts`, version chip `LIVE_RENDER: {versionTag}` |
| R2 Left column (60 %) | product header; sections `scale_factor`, `core_kernel`, `base_layer`, `cheese_driver`, `default_recipe`, `dependencies` |
| R3 Right column (40 %, sticky) | `manifest.json` preview, allergens and dietary line, price breakdown, quantity, CTA, info line |

## 4. Elements

Initial configuration (new): default size (Medium; calzone Medium), default crust/sauce/cheese of the product, no extras, no removals except removable ingredients that are sold out (removed automatically, TXT-CONF-25), quantity 1. Edit mode: the cart line's configuration and quantity.

| ID | Element | Type | Content / data source | Behavior | Validation / rules |
|---|---|---|---|---|---|
| E-01 | Heading and intro | h1 + text | TXT-CONF-02, TXT-CONF-03 | | |
| E-02 | Product header | image 160 px + text | photo or placeholder; `Product.name` (h2), `realWorldName`, version chip `{versionTag}`, card price "base: {default size price}", `description` (Geist), badges, spice | | |
| E-03 | Edit banner | banner | TXT-CONF-31 | edit mode only | |
| E-04 | Size selector | segmented control / radio cards | `ProductSize` of the product (SMALL, MEDIUM, LARGE in that order), label TXT-CONF-05 | selection recalculates price, extras prices, slices, calories. If the selected crust is not available in the new size, crust resets to CR-01 and TXT-CONF-11 is shown. | exactly one; calzone shows one card (Medium) |
| E-05 | Crust selector | radio cards (name, key in code style, description, price TXT-CONF-08) | active `Option` of group CRUST in `sortOrder`; section header TXT-CONF-06 with selected tag TXT-CONF-07 | options not in `availableSizes` of the current size are disabled with TXT-CONF-09; unavailable options (ingredient sold out or inactive) show TXT-CONF-24 and are disabled | exactly one. Calzone (`crustSelectable = false`): only CR-01, disabled control, helper TXT-CONF-10 |
| E-06 | Sauce selector | radio list | group SAUCE (SA-01 … SA-06), header TXT-CONF-12 | as E-05 | exactly one; default costs `included` (BR-PRICE-02) |
| E-07 | Cheese selector | radio list | group CHEESE (CH-01 … CH-04), header TXT-CONF-13 | as E-05 | exactly one |
| E-08 | Default recipe | list | header TXT-CONF-19; `RecipeItem`s in `sortOrder`: ingredient name, role (`TOPPING` / `FINISH` as micro text "baked on" / "added after baking"), control: removable → `unlink`/`link` (TXT-CONF-20/21), fixed → TXT-CONF-22 | `unlink` strikes the ingredient through with TXT-CONF-23 and removes its allergens if no other chosen item has them; never changes the price | sold-out removable ingredient: shown struck through with TXT-CONF-24, cannot be linked again |
| E-09 | Extras | checklist grouped `STANDARD` / `PREMIUM` (TXT-CONF-17) | header TXT-CONF-14, counter TXT-CONF-15; each row: checkbox, code line TXT-CONF-18, plain name, price for the selected size `+$2.50` | checking adds the extra; at `maxExtras` all unchecked rows are disabled and TXT-CONF-16 is shown; unchecking re-enables | max `Product.maxExtras` (5; calzone 3); each extra once; unavailable extras disabled with TXT-CONF-24. Extras that are also default ingredients are allowed ("extra portion", menu catalog 4.4) |
| E-10 | `manifest.json` preview | code block | header TXT-CONF-26 with chip `compiled ok`; JSON: `{ "module": "{moduleKey}", "version": "{versionTag}", "size": "{SIZE}", "core_kernel": "{crust key}", "base_layer": "{sauce key}", "cheese_driver": "{cheese key}", "dependencies": ["{extra key}", …], "unlinked": ["{ingredient code}", …], "instances": {qty}, "unit_price": {X.XX}, "allergens": ["GLUTEN", …], "vegetarian": true, "vegan": false }` | updates on every change (no button) | decorative + visually hidden summary |
| E-11 | Allergens and diet | text + chips | TXT-CONF-28; dietary chips TXT-STAT-33 or TXT-MENU-50; spice chip (fixed product attribute, not recalculated) | live | BR-DATA-10, BR-DATA-11 |
| E-12 | Price breakdown | label/value list | TXT-CONF-27: `base_image ({size})` = size price; `core_kernel ({crust})` = surcharge or `included`; `base_layer`, `cheese_driver` likewise; `injected_deps ({n})` = Σ extras; `unit_price`; `instances:` stepper (1–10); `line_total` = unit × qty (`typography.priceLarge`) | live | BR-PRICE-02, -03, -04; worked example C of the information model must show `$30.99` |
| E-13 | Quantity | stepper | 1–10 | | README 3.4 stepper |
| E-14 | CTA | primary button with `glow.primaryMedium` | new: TXT-CONF-29 `Build & Deploy`; edit: TXT-CONF-30 `Commit to manifest` | new: adds the configured line; if an identical configuration exists (`configurationKey`), quantities are added (max 10) and toast TXT-CONF-33, else toast TXT-CONF-32. Edit: replaces the line; if the new configuration equals another existing line, both merge (quantity summed, max 10) and toast TXT-CONF-33, else TXT-CONF-34. Then exit per section 2. | disabled when the product is not orderable, or while saving. If the save finds an unavailable choice: toast TXT-CONF-37, the configurator refreshes availability and stays open |
| E-15 | Reset | text button | TXT-CONF-36 | back to the initial configuration (new mode) or to the cart line as it was when the configurator was opened (edit mode) (BR-CONF-20) | |
| E-16 | Info line | micro text | TXT-CONF-38 with `schedule` icon | | |

## 5. States

| State | What is shown |
|---|---|
| New | as section 4, CTA `Build & Deploy` |
| Editing a cart line | E-03 banner, CTA `Commit to manifest`, values from the line |
| Max extras reached | E-09 counter at max, other extras disabled with TXT-CONF-16 |
| Option unavailable | that option disabled with `SOLD_OUT`; if it was selected in edit mode, the line is shown with the option still selected and an inline error TXT-CART-09 (option form); the CTA stays disabled until another option is chosen |
| Crust reset after size change | TXT-CONF-11 toast and inline note under E-05 for 6 s |
| Product sold out | banner TXT-CONF-35; all controls usable for exploration; CTA disabled |
| Loading | skeletons for both columns |
| Live change while open | if an option, ingredient or the product becomes unavailable while the page is open, the affected control updates within 5 s (and a selected item becomes invalid as above) |

## 6. Tablet and phone

Tablet: two columns 55/45. Phone (Stitch `configurator-mobile`): top bar with back arrow and "Pizza Configurator"; product header; stable-build chip `{versionTag}`; sections stacked; `manifest.json` collapsible (collapsed); price breakdown; sticky bottom bar with `line_total` and `Build & Deploy` above the bottom tabs.

## 7. Stitch reference and deviations

- Desktop design uses the obsolete `PIZZA_OS v1.0.4` header, IDE side rail (Source / Debugger / Git / Extensions) and `root@pizza-os` — **replace by the SCR-16 shell** (no Project Explorer on this page).
- Desktop design offers only size + four extras and `ETA: 15-20ms`, `Node: pizza-node-west-1`: incomplete and invented. Authoritative: all sections in section 4 with the menu catalog options and prices.
- Phone design prices in zł / PLN, `"extra_cheese": "^3.4"`, tags `<Double_Layer />`, `<Organic />`, `<SideCar />`, `garlic_butter_dip` as extra, "Binary BBQ … aged mozzarella": invented. Authoritative: menu catalog (Binary BBQ: Smoked BBQ sauce, fior di latte, smoked provolone, …; extras EX-01 … EX-25 with USD prices by size).
- Phone design's `14" [RECOMMENDED]` default → the default size is Medium 12" (information model `ProductSize.isDefault`).
- Stitch "Deploy to Cart" (phone) and "BUILD & DEPLOY" (desktop) → one label `Build & Deploy`.
