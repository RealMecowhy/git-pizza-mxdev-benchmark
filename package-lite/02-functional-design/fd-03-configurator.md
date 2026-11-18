# FD-03 — Pizza configurator (dependency manager)

| Item | Value |
|---|---|
| Epic | EP-03 (US-041 – US-060, TC-041 – TC-060) |
| Roles | Guest |
| Screens | SCR-03 Pizza configurator (`configure_module.ts`) |
| Processes | PR-01 Guest ordering journey |
| Objects | `Product`, `ProductSize`, `Option`, `RecipeItem`, `Ingredient`, `Cart`, `CartLine` |
| Rules referenced | BR-PRICE-02, BR-PRICE-03, BR-DATA-10, BR-DATA-11, BR-DATA-12 |
| Priority | Must |

Related: [menu-catalog.md](../09-demo-data/menu-catalog.md) section 2 and 4 (recipes, options, prices) · FD-02 · FD-04.

---

## 1. Purpose

Let the guest configure one pizza — size, crust, sauce, cheese, extra toppings and removal of default ingredients — while seeing the price, allergens and dietary flags change live, and a `manifest.json` preview of the result. The configured pizza is added to the cart or replaces an existing cart line.

## 2. Actors

| Actor | Can |
|---|---|
| Guest | Configure and add to the cart; edit an existing cart line |

## 3. Preconditions

- The product is a PUBLISHED pizza (category `PIZZAS`). Non-pizza products never open the configurator (BR-CONF-19).
- For edit mode: the cart line exists in the viewer's cart.

## 4. Behaviour

### 4.1 Opening

| Entry | Mode | Initial configuration |
|---|---|---|
| `Configure` on a menu card, featured card or SCR-04; card image/name of a pizza | New | Default size (`ProductSize.isDefault`, Medium; calzone Medium), default crust, sauce and cheese, all recipe items **except** removable ones that are out of stock, no extras, quantity 1 |
| `Edit` on a pizza cart line (SCR-05) | Edit | Exactly the line's size, crust, sauce, cheese, extras, removed ingredients and quantity |

### 4.2 Layout (all widths)

1. Header: product image or placeholder, `name`, `realWorldName`, `versionTag`, path `./pizzas/<moduleKey>.ts`, spice level, short description.
2. Sections in this order, each with its dev label and plain label:
   1. `scale_factor` — Size
   2. `core_kernel` — Crust
   3. `base_layer` — Sauce
   4. `cheese_driver` — Cheese
   5. `default_recipe` — Default ingredients (unlink to remove; TXT-CONF-19)
   6. `dependencies` — Extra toppings (with counter `n/<maxExtras>`; TXT-CONF-14)

   The order is the same on desktop, tablet and phone (SCR-03 R2, `responsive-behaviour.md`).
3. Summary panel (desktop: right column, sticky; phone: sticky bottom bar with unit price, quantity and CTA, expandable to the full summary): price breakdown (BR-CONF-12), allergens and dietary flags (BR-CONF-13), `manifest.json` preview (BR-CONF-14), quantity stepper (BR-CONF-15), CTA.
4. CTA label: `Build & Deploy` (TXT-CONF-29, new mode; accessible name "Add to cart") or `Commit to manifest` (TXT-CONF-30, edit mode; accessible name "Update cart line"). A secondary action `Reset to defaults` (TXT-CONF-36) restores the initial configuration of the new mode (BR-CONF-20).

### 4.3 Choosing options

1. Size, crust, sauce and cheese are single-choice groups; exactly one value is always selected.
2. Extras are multi-select toggles; each option at most once.
3. Default ingredients are toggles: on = included (default), off = unlinked (removed).
4. Every change recalculates price, allergens, dietary flags and the preview immediately (no server round trip needed for display; the server recalculates on add).

### 4.4 Adding or updating

1. The user presses the CTA.
2. The server re-validates the configuration (BR-CONF-16): product orderable, every chosen option available for the size, extras ≤ `maxExtras`, removals only of removable recipe items, quantity 1–10, cart limits (FD-04).
3. New mode: a cart line is created, or merged into an existing line with the same configuration (BR-CART-04). The app returns to the screen the configurator was opened from (SCR-02, SCR-01 or SCR-04 → SCR-02) and shows the toast `<moduleKey>@<versionTag> deployed to manifest (<size label>, <n> extra(s))`, e.g. `inferno-payload@v2.4 deployed to manifest (Large 14", 1 extra)`.
4. Edit mode: the edited line is replaced by the new configuration (BR-CONF-17); the app returns to SCR-05 with the toast "Manifest updated: {product} ({size})." (TXT-CONF-34)
5. On a validation failure nothing is added, the configurator stays open with the user's choices and shows the error (section 8).

## 5. Business rules

| ID | Rule | Priority |
|---|---|---|
| BR-CONF-01 | New mode starts with the initial configuration of 4.1. A removable recipe ingredient that is out of stock starts unlinked and shows the notice "{ingredient} is unavailable today and was removed from this build." (TXT-CONF-25) | Must |
| BR-CONF-02 | Edit mode starts with the cart line's configuration. If a choice of the line is no longer available (option inactive or out of stock, ingredient out of stock), it is shown selected but marked `SOLD_OUT` (TXT-CONF-24), the CTA is disabled and the message "{option} is no longer available. Choose another {group}." (TXT-CONF-43) is shown until the user replaces it. | Must |
| BR-CONF-03 | `scale_factor` lists the product's sizes in the order Small, Medium, Large, each with diameter, slice count and price (`Large 14" · 8 slices · $22.50`). The calzone shows only Medium 12" (1 piece) and the group is shown as fixed. | Must |
| BR-CONF-04 | `core_kernel` lists the active CRUST options in `sortOrder`. An option whose `availableSizes` does not include the selected size is shown disabled with "Available: {size list}" (TXT-CONF-09; e.g. CR-04 "Available: Medium, Large" while Small is selected, CR-05 "Available: Small" while Medium or Large is selected). An option whose ingredient is out of stock is shown disabled with `SOLD_OUT` (TXT-CONF-24). Inactive options are not shown. When `crustSelectable = false` (calzone) only the default crust is shown, with the note "Crust is fixed for this module: Neapolitan Core." (TXT-CONF-10) | Must |
| BR-CONF-05 | When the size changes and the selected crust is not available for the new size, the crust switches to the product's default crust and the notice "`core_kernel` reset to `neapolitan_core`: {crust} is not available in {size}." (TXT-CONF-11) is shown (e.g. "`core_kernel` reset to `neapolitan_core`: Gluten-Free Fork is not available in Large 14"."). The same applies to any selected extra whose `availableSizes` excludes the new size: it is removed with "{extra} is not available in {size} and was removed." (TXT-CONF-45) | Must |
| BR-CONF-06 | `base_layer` lists the active SAUCE options in `sortOrder`. The product's default sauce shows `default · included`; other options show their surcharge as `+$2.00`, or `included` when it is $0.00 (BR-PRICE-02). | Must |
| BR-CONF-07 | `cheese_driver` works like BR-CONF-06 for CHEESE options. | Must |
| BR-CONF-08 | `dependencies` lists the active EXTRA options in `sortOrder` with key, name, version tag and the price for the selected size (BR-PRICE-03). The counter shows `<selected>/<maxExtras>`. When the maximum is reached, all unselected extras are disabled and the message "Dependency limit reached: max {max} extras per pizza." (TXT-CONF-16) is shown; deselecting one re-enables them. | Must |
| BR-CONF-09 | An extra whose ingredient is out of stock is shown disabled with `SOLD_OUT` (TXT-CONF-24). Inactive extras are not shown. Adding an extra that is also a default ingredient is allowed and means an extra portion (menu catalog 4.4). | Must |
| BR-CONF-10 | `default_recipe` (TXT-CONF-19) lists the product's recipe items in `RecipeItem.sortOrder`. A removable item has an `Unlink` toggle (accessible name "Remove <ingredient>"); a fixed item shows a lock and "required". Unlinking and re-linking never changes the price. | Must |
| BR-CONF-11 | A removable recipe item whose ingredient is out of stock is shown unlinked, struck through, with `SOLD_OUT` (TXT-CONF-24), and cannot be re-linked. | Must |
| BR-CONF-12 | The price breakdown shows: size price; crust, sauce and cheese with their surcharge or `included`; each extra with its price for the size; `UNIT_PRICE` (BR-PRICE-02); `× quantity`; `LINE_TOTAL` (BR-PRICE-04). All amounts per BR-PRICE-11. Example C of the information model (Boolean Pepperoni Large, Cheese-Stuffed v2, Buffalo Mozzarella, Cherry tomatoes (EX-11), 'Nduja, oregano removed) shows `UNIT_PRICE $30.99`. | Must |
| BR-CONF-13 | Allergens (BR-DATA-11) are shown in the line "Allergens: {list}" (TXT-CONF-28) with their full captions (TXT-STAT-37) and update with every change (e.g. Low-Mem Garden shows "Allergens: Cereals containing gluten, Tree nuts"; choosing Cheese-Stuffed v2 adds "Milk"). Dietary flags (BR-DATA-10) update the same way (Low-Mem Garden is `<Vegan />`; with Cheese-Stuffed v2 it becomes `<Vegetarian />`). Spice level is the fixed product value and does not change. | Must |
| BR-CONF-14 | The `manifest.json` preview is read-only JSON in the code style, updated live, with exactly these keys in this order: `module` (moduleKey), `version` (versionTag), `size` (SizeCode), `core_kernel`, `base_layer`, `cheese_driver` (option keys of crust, sauce and cheese), `dependencies` (extra keys in selection order), `unlinked` (ingredient codes of removed items), `instances` (quantity), `unit_price` (number with two decimals), `allergens` (Allergen keys, alphabetical), `vegetarian`, `vegan` (booleans), as in SCR-03 E-10. Example below the table. | Must |
| BR-CONF-15 | Quantity stepper 1–10, default 1 (edit mode: the line's quantity). Minus is disabled at 1, plus at 10 with the hint "Max 10 instances per line." (TXT-MENU-16) | Must |
| BR-CONF-16 | On `Build & Deploy` the server re-checks the whole configuration and the cart limits before writing. The cart line stores product, size, crust, sauce, cheese, extras, removed ingredients and quantity; prices are not stored on the cart line but derived (BR-PRICE-02). | Must |
| BR-CONF-17 | On `Commit to manifest` (TXT-CONF-30) the edited line takes the new configuration and quantity. If the new configuration equals another existing line, the two are merged into that other line (quantities added, capped by BR-CART-05) and the edited line is removed. | Must |
| BR-CONF-18 | If the product is not orderable (BR-DATA-12) the configurator opens read-only with the banner "`404: OUT_OF_STOCK //` {product} is sold out today. You can look, but you can't deploy it." (TXT-CONF-35); all choices are visible but the CTA is disabled. In edit mode the user can only go back to the cart (where the line is flagged, BR-CART-13). | Must |
| BR-CONF-19 | Opening the configurator for a non-pizza product opens SCR-04 for that product instead. | Must |
| BR-CONF-20 | `Reset to defaults` (TXT-CONF-36) restores the initial configuration of 4.1 (new mode) without asking. In edit mode it restores the line as it was when the configurator was opened. | Should |
| BR-CONF-21 | Leaving the configurator (back, navigation) without pressing the CTA discards the changes without a prompt. In edit mode the cart line remains unchanged. | Must |
| BR-CONF-22 | Not used in Lite (view-only configurator for staff). | — |

Example of the `manifest.json` preview (BR-CONF-14) for Inferno Payload, Large, extra Hot honey drizzle (EX-14), quantity 1, in Lite, where the ingredient `jalapeno` is out of stock (seed): the recipe's jalapeños start unlinked (BR-CONF-01) and the extra EX-09 Jalapeños is shown `SOLD_OUT` (TXT-CONF-24) (BR-CONF-09).

```json
{
  "module": "inferno-payload",
  "version": "v2.4",
  "size": "LARGE",
  "core_kernel": "neapolitan_core",
  "base_layer": "san_marzano",
  "cheese_driver": "buffalo_mozzarella",
  "dependencies": ["hot_honey"],
  "unlinked": ["jalapeno"],
  "instances": 1,
  "unit_price": 25.00,
  "allergens": ["GLUTEN", "MILK"],
  "vegetarian": false,
  "vegan": false
}
```

(22.50 Large + 2.50 Hot honey drizzle for Large = 25.00; removing a recipe item is free; Buffalo Mozzarella is this pizza's default, so no surcharge.)

## 6. Data read and written

| Object | Read | Written |
|---|---|---|
| `Product` | name, realWorldName, versionTag, moduleKey, defaults, `crustSelectable`, `maxExtras`, `spiceLevel`, `isOrderable`, image | — |
| `ProductSize` | all sizes of the product | — |
| `Option` | active options with prices, `availableSizes`, derived `isAvailable` | — |
| `RecipeItem`, `Ingredient` | recipe, `isRemovable`, allergens, diet flags, `isInStock` | — |
| `Cart`, `CartLine` | edited line (edit mode); existing lines for merge | `CartLine` created, updated, merged or removed |

## 7. States touched

Reads `ProductStatus = PUBLISHED`, `Option.isActive`, `Ingredient.isInStock`. Changes no status.

## 8. Errors and edge cases

| Case | Behaviour | Message |
|---|---|---|
| Product becomes sold out or unpublished while configuring, then CTA pressed | Nothing added; configurator switches to read-only (BR-CONF-18) | Error toast: "{product} is sold out and can't be imported." (TXT-MENU-37) |
| A chosen option or extra becomes unavailable, then CTA pressed | Nothing added; the option is marked `SOLD_OUT` (TXT-CONF-24) | "{option} is no longer available. Choose another {group}." (TXT-CONF-43) |
| A removable ingredient goes out of stock while configuring | On the next add the server removes it from the configuration and adds the line | Toast addition: "{ingredient} is unavailable today and was removed from this build." (TXT-CONF-25) |
| Configuration would merge into a line that already has 10 | Merge capped (BR-CART-05) | FD-04 message |
| Cart already holds 30 items | Nothing added (BR-CART-06) | FD-04 message |
| Edit mode, cart line no longer exists (removed in another tab, cart cleared after payment) | Nothing written; user is sent to SCR-05 | "This manifest line no longer exists." (TXT-CONF-44) |
| Direct link to the configurator of an unknown, DRAFT or ARCHIVED product | SCR-40 | — |
| Quantity entered by keyboard outside 1–10 (if the stepper allows typing) | Value corrected to the nearest bound | "{FIELD} must be a whole number between {min} and {max}." (TXT-VAL-09) |
| Calzone | Size fixed Medium, crust fixed CR-01, max 3 extras | "Dependency limit reached: max {max} extras per pizza." (TXT-CONF-16) at the limit |

## 9. Notifications

- Inline notices: crust reset (BR-CONF-05), ingredient unavailable (BR-CONF-01), max extras (BR-CONF-08).
- Success toasts after add/update (4.4).
- Error toasts of section 8.
