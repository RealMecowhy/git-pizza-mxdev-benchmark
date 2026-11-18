# SCR-05 — Cart (`MANIFEST.LOCK`)

| Field | Value |
|---|---|
| Type | Drawer from the right, 480 px (phone: full page, tab `Deploy`) |
| Roles | G |
| MoSCoW | Must |
| Functional area / epic | FD-04 / EP-04 |
| Rules, processes | BR-CART (FD-04), BR-PRICE-04, BR-PRICE-05, BR-PRICE-06, BR-PRICE-07, BR-PRICE-13, BR-ORD-03, BR-ORD-07, PR-01 |
| Prototype | [SCR-05-cart.html](../../08-prototype/customer/SCR-05-cart.html) |
| Stitch reference | desktop [`desktop/cart-manifest-modal.jpg`](../../assets/stitch-reference/desktop/cart-manifest-modal.jpg) · phone: no design |
| Images | product thumbnails 56 px (photo or placeholder); `illustrations/empty-cart.png` (present) |

## 1. Purpose

Review and change the cart: quantities, edit a pizza, remove lines, clear the cart, apply or remove one coupon, see the subtotal and discount and the hints for free delivery and the delivery minimum, then proceed to checkout.

## 2. Entry and exit

| Entry | Exit |
|---|---|
| Cart button (SCR-16); phone tab `Deploy`; `cat MANIFEST.LOCK` (SCR-02); phone summary bar; `Edit manifest` (SCR-06); `Back to manifest` (SCR-07); after `Commit to manifest` (SCR-03 edit) | `PROCEED TO ./checkout.yml` → SCR-06 · `edit` → SCR-03 (edit mode) · `git checkout menu` (empty) → SCR-02 · close / `Esc` / scrim / browser back → screen below |


## 3. Layout

| Region | Content |
|---|---|
| R1 Header | `inventory_2` icon, TXT-CART-01, `LOCKED` chip (TXT-CART-41), item count TXT-CART-02, close |
| R2 Status line | TXT-CART-40 (decorative) |
| R3 Lines | scrollable list |
| R4 Coupon | `$ coupon --apply` field |
| R5 Totals and hints | subtotal, discount, fee/tax notes, total, hint messages |
| R6 Actions | primary `PROCEED TO ./checkout.yml`, secondary `CLEAR (rm -rf)` |

## 4. Elements

| ID | Element | Type | Content / data source | Behavior | Validation / rules |
|---|---|---|---|---|---|
| E-01 | Count | label | TXT-CART-02 from `Cart.itemCount` | live | |
| E-02 | Cart line | list item | thumbnail; `Product.name` (h3) + path TXT-CART-03 + `versionTag`; pizza modifier summary TXT-CART-39; dietary chips; unit price TXT-CART-05; line total (`typography.h3`, `color.primary.light`) | | lines in the order they were added |
| E-03 | Quantity | stepper with label TXT-CART-04 | `CartLine.quantity` | changes save immediately; totals update | 1–10; `−` at 1 disabled (use `rm` to remove) |
| E-04 | Edit | text button `edit` (TXT-CART-06) | | → SCR-03 in edit mode for this line | pizzas only |
| E-05 | Remove | icon button `delete` with text `rm` (TXT-CART-07) | | removes the line at once, toast TXT-CART-08 | no confirmation |
| E-06 | Unavailable line | inline error on the line, `color.error.text`, line dimmed | TXT-CART-09 | shown when `CartLine.isAvailable = false`; live | blocks checkout (E-15 disabled) until removed or edited |
| E-07 | Coupon field | input + `APPLY` button | label TXT-CART-10, placeholder `CODE`, button TXT-CART-11 | APPLY runs BR-PRICE-06 (code matched case-insensitively, shown upper case). Result: APPLIED → E-08; NOT_APPLIED → the coupon stays attached, E-08 shows the code with state `NOT_APPLIED` and the reason; INVALID → the code is not attached, inline error under the field. Enter in the field = APPLY. Applying a second code replaces the first (toast TXT-CART-22). | empty → TXT-CART-21; max 30 characters |
| E-08 | Applied coupon | chip row | code, state badge TXT-STAT-40 (`VALIDATED (−$3.22)` = TXT-CART-12 / `NOT_APPLIED`), helper TXT-CART-13 (applied) or the BR-PRICE-06 message TXT-CART-19 / TXT-CART-20 (not applied; steps (3) and (4) of BR-PRICE-06 never apply in Lite), `rm coupon` (TXT-CART-14) | state re-evaluated after every cart change (e.g. a quantity drop below the minimum turns `VALIDATED` into `NOT_APPLIED` with TXT-CART-20) | remove → toast TXT-CART-23 |
| E-09 | Subtotal | label/value | TXT-CART-24, `Cart.subtotal` | live | |
| E-10 | Discount | label/value | TXT-CART-25, `−{discountPreview}` | only when APPLIED with a discount > 0 (FREE_DELIVERY coupons show no discount line; E-12 says the fee is waived) | BR-PRICE-05 |
| E-11 | Fee and tax notes | label/value (muted) | TXT-CART-26, TXT-CART-27 | | A-20 |
| E-12 | Free-delivery hint | helper with progress bar | TXT-CART-29: progress = subtotal / `freeDeliveryThreshold` | live | hidden when the cart is empty |
| E-13 | Delivery minimum hint | helper (warning) | TXT-CART-30 | shown while subtotal < `minDeliverySubtotal` | informational; does not block (pickup has no minimum) |
| E-14 | Total | label/value `typography.priceLarge` | TXT-CART-28 = subtotal − discount | | |
| E-15 | Proceed | primary button | TXT-CART-33 | → SCR-06 (drawer closes) | disabled with a visible reason when: any line unavailable (TXT-CHK-48), drinks-only (TXT-CART-31), total quantity > 30 (TXT-CART-32) |
| E-16 | Clear | danger text button | TXT-CART-34 | confirmation dialog TXT-CART-35; confirm empties lines and coupon, toast TXT-CART-36 | |
| E-17 | Empty state | empty state | illustration `illustrations/empty-cart.png` (optional) + TXT-CART-37 | button → SCR-02 | |

Cart persistence: the cart lives as long as the guest session (information model LITE-SES-02). When the session has expired, the visitor continues with an empty cart and, if a non-empty cart was lost, toast TXT-ERR-20 (LITE-SES-05, US-286). A demo reset clears all carts (toasts TXT-ERR-21 and TXT-ERR-22 on the next refresh, SIM-08).

## 5. States

| State | What is shown |
|---|---|
| Empty cart | E-17 only (no totals, no coupon field) |
| With lines | E-02 … E-16 |
| Coupon valid | E-08 `VALIDATED`, E-10 discount line |
| Coupon invalid — not found | inline TXT-CART-15, code not attached |
| Coupon invalid — expired (`HOTFIX10`) | inline TXT-CART-16, code not attached |
| Coupon not applied — delivery only (`FREE_DISPATCH`, last chosen type PICKUP) | E-08 + TXT-CART-19 |
| Coupon not applied — minimum (`GITHUB_STUDENT` below $20.00) | E-08 + TXT-CART-20 with the missing amount |
| Below delivery minimum | E-13 |
| Order of this cart waiting for payment | notice TXT-CART-45 above E-15 with a link to SCR-09 of that order (PAYMENT_PENDING or PAYMENT_FAILED) |
| Free delivery reached | E-12 second text |
| Line unavailable | E-06 on the line, E-15 disabled |
| Drinks only / more than 30 items | E-15 disabled with the reason |
| Loading | skeleton lines |
| Saving a change | the changed control shows a spinner; other lines stay usable |

## 6. Tablet and phone

Tablet: same drawer. Phone: full page with top bar (back arrow, `MANIFEST.LOCK`, count), lines, coupon, totals, and a sticky bottom bar with `EXEC_TOTAL_OUTPUT` and `PROCEED TO ./checkout.yml` above the bottom tabs; `CLEAR (rm -rf)` at the end of the list.

## 7. Stitch reference and deviations

- The Stitch modal shows a catalog list on the left and the manifest on the right; authoritative is a drawer with the manifest only (the menu stays visible behind it on desktop).
- Line names `Rust_Kernel_Pepperoni.tar.gz`, `Mate_Compiler_Tonic.bin`, `Garlic_Driver_v0.9.so`, PLN prices, Polish modifier text ("podwójny ser"), chips `<FastRuntime />`, `<HotSauce />`, `<ZeroCal />` are invented → names and prices from the menu catalog, modifiers per TXT-CART-39, dietary chips only.
- `VALIDATED (-15.00 PLN)` and ">> Academic discount active: verified academic token for user@edu.pl" → TXT-CART-12 and the coupon description (`Student discount: 15% off, up to $10.`).
- `Pipeline Transit Fee (Courier): 0.00 PLN (FREE_DISPATCH)` in the cart → "calculated at checkout" (A-20); the free-delivery hint covers the same idea.
- `EXECUTE PIPELINE --deploy` (goes to checkout) → `PROCEED TO ./checkout.yml`; `Execute Order --force` remains reserved for placing the order on SCR-06.
- Kept from Stitch: `MANIFEST.LOCK`, `LOCKED` chip, `instances:` stepper, `unlink`/`delete` idea (as `rm`), `$ coupon --apply`, `Dependencies Subtotal`, `EXEC_TOTAL_OUTPUT`, `CLEAR (rm -rf)`, status line `integrity: sha256-verified`.
