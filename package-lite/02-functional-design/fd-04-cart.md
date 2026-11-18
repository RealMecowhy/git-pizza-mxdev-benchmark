# FD-04 — Cart (manifest) and coupons

| Item | Value |
|---|---|
| Epic | EP-04 (US-061 – US-080, TC-061 – TC-080) |
| Roles | Guest |
| Screens | SCR-05 Cart (`MANIFEST.LOCK`): drawer on desktop and tablet, full page on phone; also the Terminal Debugger panel (FD-02) and the cart count (FD-01) |
| Processes | PR-01 Guest ordering journey |
| Objects | `Cart`, `CartLine`, `Coupon`, `Product`, `Option`, `Ingredient`, `StoreSettings` |
| Rules referenced | BR-PRICE-02 – BR-PRICE-08, BR-PRICE-11, BR-PRICE-13, BR-ORD-03, BR-ORD-07 |
| Priority | Must |

Related: information model section 4 (Cart, CartLine) and 6 (prices, coupons) · [menu-catalog.md](../09-demo-data/menu-catalog.md) section 8 (coupons) · FD-03 · FD-05.

---

## 1. Purpose

Hold the items the visitor intends to order, let them change quantities, edit pizzas, remove items, apply one coupon, and show the price summary before checkout. The cart enforces the per-line and per-order limits and flags items that became unavailable.

## 2. Actors

| Actor | Cart |
|---|---|
| Guest | One cart per browser session (A-11, LITE-SES-02) |

## 3. Preconditions

None. The cart is opened from the header cart button, the phone `Deploy` tab, the Terminal Debugger (`cat MANIFEST.LOCK`, TXT-MENU-44) or after the configurator's edit mode.

## 4. Behaviour

### 4.1 Cart content (SCR-05)

1. Title `MANIFEST.LOCK` with plain sub-label "Your cart", and `<n> DEPENDENCIES INSTALLED` (n = item count).
2. One block per cart line (artifact), in the order the lines were created:
   - Path `./{folder}/{moduleKey}.ts` (TXT-CART-03), `name` (`realWorldName`) and `versionTag`.
   - Size label (pizzas) or serving description (others).
   - Pizza modifier summary (TXT-CART-39): the size, then only where they differ from the product default the crust, sauce and cheese names, each extra as `+ <name>`, each removal as `− <ingredient name>`, comma separated (e.g. `Large 14", Buffalo Mozzarella, + Cherry tomatoes, − Fresh basil`). A pizza in default configuration shows only its size.
   - Allergens (full captions, compact) and dietary flag.
   - Unit price `{unitPrice}/unit` (TXT-CART-05, e.g. `$22.50/unit`), quantity stepper `instances:` (TXT-CART-04, BR-CART-08), line total.
   - Actions: `Edit` (pizzas only; opens SCR-03 in edit mode), `rm` (remove; accessible name "Remove <name> from cart").
3. Coupon field `coupon --apply` with `Apply` button and the coupon state (BR-CART-14).
4. Summary (BR-CART-17), the delivery-minimum and free-delivery hints (BR-CART-18).
5. Buttons: `PROCEED TO ./checkout.yml` (TXT-CART-33; accessible name "Go to checkout"; BR-CART-19) and `CLEAR (rm -rf)` (TXT-CART-34; accessible name "Empty cart"; BR-CART-10).
6. Desktop and tablet: drawer 480 px from the right over the current page, closed by the close button, Esc or a click on the scrim. Phone: full page with a back arrow.

### 4.2 Cart and session

The cart belongs to the guest's browser session (LITE-SES-02). It survives page reloads and new tabs of the same session and ends with the session (LITE-SES-05, BR-ERR-11). Lite has no accounts, so there is no customer cart and no merging of carts.

## 5. Business rules

| ID | Rule | Priority |
|---|---|---|
| BR-CART-01 | The cart belongs to the guest's browser session (LITE-SES-02) and is lost when the session ends (LITE-SES-05). It is kept until it is emptied, cleared by a successful payment (BR-ORD-07), lost with the session or deleted by a demo reset. | Must |
| BR-CART-02 | Not used in Lite (merge of carts on sign-in). | — |
| BR-CART-03 | Not used in Lite (customer cart after sign-out). | — |
| BR-CART-04 | **One line per configuration.** Adding an item whose `configurationKey` (product + size + crust + sauce + cheese + sorted extras + sorted removals) equals an existing line increases that line's quantity instead of creating a new line. Non-pizza items merge by product. | Must |
| BR-CART-05 | **Quantity per line** is 1 – 10 (`StoreSettings.maxQuantityPerLine`). An add or merge that would exceed 10 sets the line to 10 and shows "Only {k} more could be added — max 10 of the same item per line." (TXT-CART-43) (k = the quantity actually added; when k = 0: "Max 10 instances per line." (TXT-MENU-16)). | Must |
| BR-CART-06 | **Items per cart** (sum of quantities) is at most 30 (`maxItemsPerOrder`). An add or quantity increase that would exceed 30 is rejected completely and shows "Max 30 items per order. Nothing was added." (TXT-CART-44) | Must |
| BR-CART-07 | Line display follows 4.1 step 2. Unit price and line total are always calculated from the **current** catalog prices (BR-PRICE-02, BR-PRICE-04); prices are fixed only when the order is placed (BR-PRICE-12). | Must |
| BR-CART-08 | The quantity stepper changes the line quantity by 1. Minus is disabled at 1 (removing uses `rm`); plus is disabled at 10 or when the cart has 30 items, with the hint "Max 10 per line" or "Max 30 items per order". Totals update immediately. | Must |
| BR-CART-09 | `rm` removes the line at once (no confirmation) and shows the toast "Removed {product} from MANIFEST.LOCK." (TXT-CART-08) with an `Undo` action that restores the line with its quantity for 6 seconds. | Must (remove) / Should (undo) |
| BR-CART-10 | `CLEAR (rm -rf)` asks for confirmation: dialog TXT-CART-35 (Title: "rm -rf MANIFEST.LOCK?" · Body: "This removes all {n} items and the coupon from your cart." · Buttons: `rm -rf` / `Cancel`) with buttons `rm -rf` (destructive) and `Cancel`. Confirming deletes all lines and the coupon and shows the empty state. | Must |
| BR-CART-11 | `Edit` opens SCR-03 in edit mode for that line (FD-03, BR-CONF-02, BR-CONF-17). | Must |
| BR-CART-12 | When a catalog price changes, every cart containing the product shows the new price the next time the cart or checkout is displayed or refreshed. No message is needed; checkout handles a change between display and order (BR-CHK-16). | Must |
| BR-CART-13 | **Unavailable lines.** A line with `CartLine.isAvailable = false` stays in the cart, is visibly flagged and shows the reason: "Sold out today." (product sold out or a fixed ingredient out of stock), "This module was withdrawn from the menu." (TXT-CART-09) (ARCHIVED or DRAFT), "<option or ingredient name> is no longer available." (chosen option or extra unavailable). Its prices stay in the summary (BR-PRICE-04 sums all lines). Actions: `rm` always; `Edit` for pizzas whose product is still orderable. Checkout is blocked while such a line exists (BR-CART-19). | Must |
| BR-CART-14 | **Apply coupon.** The entered code is trimmed and upper-cased. Empty → "Enter a coupon code." Otherwise the coupon is validated by BR-PRICE-06 against the cart and the preview order type (BR-CART-22), and the state is shown under the field: `APPLIED` — green `VALIDATED (−$X.XX)` (or `VALIDATED (FREE_DISPATCH)` for free delivery) plus the coupon `description`; `NOT_APPLIED` — warning with the BR-PRICE-06 message, the code stays attached with a remove `×`; `INVALID` — error with the BR-PRICE-06 message, the code is not attached and stays in the input for correction. | Must |
| BR-CART-15 | One coupon per cart. Applying another valid code replaces the current one. The `×` next to an attached coupon removes it. | Must |
| BR-CART-16 | The coupon state is recalculated whenever the cart changes (lines, quantities, preview order type) and at checkout. A coupon can move between `APPLIED` and `NOT_APPLIED` (e.g. the subtotal falls below `minSubtotal`: message "Add $X.XX more to use GITHUB_STUDENT"); the message updates immediately. | Must |
| BR-CART-17 | **Summary** in the cart (A-20): `Dependencies Subtotal` (TXT-CART-24, BR-PRICE-04); `Coupon Subsidy (<CODE>)` (TXT-CART-25) with `−$X.XX` when APPLIED with a discount; `Pipeline Transit Fee` and `SALES_TAX` with the note "calculated at checkout" (TXT-CART-26, TXT-CART-27); `EXEC_TOTAL_OUTPUT` = subtotal − discount, labelled "before delivery fee, tax and tip" (TXT-CART-28). Example B items with `GITHUB_STUDENT` in the cart show subtotal $21.49, coupon −$3.22, total $18.27. The full breakdown (fee, tax, tip, total) is on SCR-06. | Must |
| BR-CART-18 | For the preview type DELIVERY: when the subtotal is below $15.00 the cart shows "Delivery minimum is $15.00. Add ${X.XX} more, or choose pickup at checkout." (TXT-CART-30) (not blocking in the cart); when the subtotal is ≥ $15.00 and < $40.00 it shows "Add ${X.XX} more for `FREE_DISPATCH` (free delivery from $40.00)." (TXT-CART-29) | Must |
| BR-CART-19 | `PROCEED TO ./checkout.yml` (TXT-CART-33) is enabled only when: the cart has ≥ 1 line; no line is unavailable; at least one line is not a drink (BR-ORD-03); the item count is ≤ 30. When disabled, the first failing reason is shown under the button: "Your manifest is empty." / "Remove unavailable items from your manifest first." (TXT-CHK-48) / "Add at least one pizza, side or dessert. Drinks-only orders can't be deployed." (TXT-CART-31) | Must |
| BR-CART-20 | **Empty state**: illustration `illustrations/empty-cart.png`, heading, text and button of TXT-CART-37 (`git checkout menu` opens SCR-02). The coupon field and summary are hidden. | Must |
| BR-CART-21 | Drinks can be in the cart alone; only checkout requires a non-drink line (BR-CART-19). | Must |
| BR-CART-22 | **Preview order type.** The cart remembers the order type last chosen at checkout in this cart (A-20); a new cart starts with DELIVERY. It is not shown as such; it decides only coupon check (5) "delivery only" (BR-PRICE-06) and whether the delivery-minimum and free-delivery hints (BR-CART-18) are shown. | Must |
| BR-CART-23 | The cart is emptied (lines and coupon) only when a payment succeeds (T-02, BR-ORD-07). Failed or cancelled payments leave it unchanged. | Must |
| BR-CART-24 | Not used in Lite (one cart on several devices of an account). | — |
| BR-CART-25 | The coupon code input accepts up to 30 characters; codes are matched case-insensitively (BR-PRICE-06). A coupon is looked up by its exact code only; the app never lists available coupons to customers. | Must |

> **Assumption A-20:** The cart shows no delivery fee, sales tax or tip; they are "calculated at checkout", and the cart total is subtotal − discount. The cart remembers the order type (DELIVERY or PICKUP) last chosen at checkout (default DELIVERY) and uses it only for the coupon rule "delivery only" and for the delivery-minimum and free-delivery hints, so that these match checkout. The information model's `Cart` has no such attribute; the contractor adds it.

## 6. Data read and written

| Object | Read | Written |
|---|---|---|
| `Cart` | session, coupon, derived `itemCount`, `subtotal`, `couponState`, `couponMessage`, `discountPreview` | coupon attach/replace/remove; preview order type; `updatedAt`; created on first add |
| `CartLine` | configuration, derived prices, `isAvailable`, `configurationKey` | quantity; created/merged (FD-02, FD-03); deleted (`rm`, clear) |
| `Coupon` | by exact code: all validation attributes | — |
| `Product`, `ProductSize`, `Option`, `Ingredient` | prices and availability | — |
| `StoreSettings` | `deliveryFee`, `freeDeliveryThreshold`, `minDeliverySubtotal`, `taxRatePercent`, `maxQuantityPerLine`, `maxItemsPerOrder` | — |

## 7. States touched

`CouponState`: `NONE`, `APPLIED`, `NOT_APPLIED`, `INVALID` (BR-PRICE-06). No order state.

## 8. Errors and edge cases

| Case | Behaviour | Message |
|---|---|---|
| `GITHUB_STUDENT` with subtotal $21.49 | APPLIED, discount −$3.22 | `VALIDATED (−$3.22)` · "Student discount: 15% off, up to $10." |
| `GITHUB_STUDENT` with subtotal $16.49 | NOT_APPLIED | "Add $3.51 more to use GITHUB_STUDENT" |
| `GITHUB_STUDENT` with subtotal $90.00 | APPLIED, discount capped | `VALIDATED (−$10.00)` |
| An unknown code, e.g. `NOPE42` | INVALID, not attached | "Coupon not found: NOPE42" |
| `FREE_DISPATCH` with preview PICKUP | NOT_APPLIED | "FREE_DISPATCH is valid for delivery orders only" |
| `HOTFIX10` | INVALID, not attached | "Coupon HOTFIX10 has expired" |
| `NOPE42` | INVALID, not attached | "Coupon not found: NOPE42" |
| `github_student` typed in lower case | Treated as `GITHUB_STUDENT` | as above |
| Quantity increase beyond 30 items | Rejected (BR-CART-06) | "Max 30 items per order. Nothing was added." (TXT-CART-44) |
| Pizza with a removable jalapeño (out of stock in the Lite seed) | Line is available; the jalapeños are listed as removed (BR-MENU-09, BR-CONF-01) | — |
| Cart opened while the order of this cart is PAYMENT_PENDING | Cart shown normally; a notice links to the order: "Order MX-1063 is waiting for payment." (example of TXT-CART-45) | as quoted |
| Guest session expires | Guest cart lost (FD-15, BR-ERR-11) | "Your session expired. Your manifest was cleared." (TXT-ERR-20) |

## 9. Notifications

- Toasts: line removed (with Undo), merge/cap notices (BR-CART-05), limit rejection (BR-CART-06).
- Inline: coupon state, delivery-minimum and free-delivery hints, unavailable-line reasons, checkout-blocked reason.
