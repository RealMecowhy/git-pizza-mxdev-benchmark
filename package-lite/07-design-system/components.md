# Components

Every reusable UI component of Git Pizza MxDev: anatomy, variants, states, the tokens it uses and its accessibility rules. Values are token names from [tokens.md](tokens.md); raw hex values appear only where a token is missing. Screens (`SCR-xx`) are listed in [../01-product-brief/ids-and-traceability.md](../01-product-brief/ids-and-traceability.md); exact UI texts belong to `06-ui-specification/`. Examples in this file use the real catalog, prices and states ([menu-catalog.md](../09-demo-data/menu-catalog.md), [order-lifecycle.md](../05-processes/order-lifecycle.md)).

The components are functional and visual specifications. How you build them in Mendix (widgets, building blocks, custom styling) is your decision, as long as the result looks and behaves as specified here. Accessibility requirements referenced below are detailed in [accessibility.md](accessibility.md).

The Stitch UI kit (`ui-kit-asset-handover`) and the 19 Stitch screens are the visual source. Where this file differs from Stitch, section 9 lists the difference and the reason.

---

## Contents

1. [Global rules](#1-global-rules)
2. [Actions](#2-actions): button, icon button
3. [Form controls](#3-form-controls): field, prompt input, textarea, select, checkbox, radio card, segmented control, quantity stepper
4. [Status and feedback](#4-status-and-feedback): order status badge, other status chips, product tags, live indicator, banner, toast, field error, tooltip, progress bar, loading, empty state, timer
5. [Content and data display](#5-content-and-data-display): window chrome, code-block card, product image frame, menu item card, cart line, totals summary, copyable value, terminal / log panel, pipeline stepper, KPI tile, data table, simulated map, allergen and diet info
6. [Overlays](#6-overlays): modal, drawer, bottom sheet, dialog
7. [Navigation and shell](#7-navigation-and-shell): header, nav link, cart button, sidebar (Project Explorer), file tabs, phone bottom tabs, sticky action bar, footer, demo-mode banner, error page layout
8. [Component usage per screen](#8-component-usage-per-screen)
9. [Differences from Stitch](#9-differences-from-stitch)

---

## 1. Global rules

These rules apply to every component unless the component says otherwise.

### 1.1 State model

| State | When | Visual rule |
|---|---|---|
| Default | At rest | As specified per component |
| Hover | Pointer over the element (devices with hover only) | Background one surface step lighter (e.g. `surface.highest` → `surface.bright`) or the variant's hover color; transition `motion.duration.fast`, `motion.easing.standard` |
| Focus-visible | Keyboard focus | Focus ring: 2 px solid `color.border.focus`, 2 px offset, no blur. Never removed, never replaced by color change only |
| Pressed | Pointer/touch down | Variant's pressed color, or background one step darker |
| Selected / active | Current choice, current page | Specified per component; always also signalled by something other than color (weight, underline, check icon, border width or text) |
| Disabled | Not available | `opacity.disabled` (0.38) on the whole component, no hover, `cursor: not-allowed`. If the reason is not obvious, the reason is shown as help text or tooltip (exact wording in `06-ui-specification/`) |
| Loading | Waiting for the server | Specified per component; the component keeps its size (no layout jump) |
| Error | Invalid value or failed action | `color.error.default` border or marker + message in `color.error.text` |
| Read-only | Value shown but not editable | No fill, `color.border.subtle` dashed border, text `color.text.secondary` |

### 1.2 Sizes and touch

- Every interactive element has a hit area of at least `layout.touchTargetMin` (44 × 44 px) on phone and tablet widths. On desktop, compact sizes (32 px) are allowed only where this file says so.
- Spacing between adjacent touch targets is at least `space.2` (8 px).
- All dimensions are multiples of the 4 px base unit (`space.*`).

### 1.3 Typography and labels

- All UI text uses `font.family.mono` except long paragraphs (`typography.bodyLong`, Geist).
- Dev labels (`Execute Order --force`, `QUEUED`) are shown as designed; their plain meaning is available as sub-label, tooltip or accessible name ([glossary.md](../01-product-brief/glossary.md)). Components below say where the plain meaning goes.
- Prices use `BR-PRICE-11` formatting (`$14.99`, discounts `−$3.22` with the minus sign U+2212).
- Times use `HH:mm` / `HH:mm:ss` 24-hour, store time zone (`BR-DATA-05`); durations and countdowns use `mm:ss`.

### 1.4 Icons

Material Symbols Outlined (see [iconography.md](iconography.md)). Icons next to text are decorative and hidden from assistive technology; icon-only controls carry an accessible name.

### 1.5 Motion

Durations and easings come from `motion.*`. Repeating animations (terminal cursor blink, LIVE pulse, skeleton shimmer) follow the 5-second rule and the reduced-motion table in [accessibility.md](accessibility.md) section 7: they stop after 5 s and hold a static state until the next data change, and they never run when the user prefers reduced motion. Loading spinners are exempt while something is actually loading.

---

## 2. Actions

### 2.1 Button

**Purpose.** Triggers an action. The label is a command in the IDE style; the accessible name is the plain action (glossary rule).

**Anatomy.** `[leading icon] LABEL [trailing icon]` inside a container. Leading icon optional (e.g. `rocket_launch` on deploy actions); trailing icon optional (`arrow_forward` on navigation CTAs). Icon-only buttons use 2.2.

**Sizes**

| Size | Height | Horizontal padding | Icon | Label | Use |
|---|---|---|---|---|---|
| `sm` | 32 px (hit area 44 on touch widths) | `space.3` | `icon.size.sm` | `typography.label` | Dense tables, chips with actions (desktop only) |
| `md` (default) | 40 px (44 on phone) | `space.4` | `icon.size.md` | `typography.label` | Default |
| `lg` | 48 px | `space.6` | `icon.size.lg` | `typography.label` at 14 px | Main CTA of a page or modal |
| `xl` | 56 px, full width on phone | `space.6` | `icon.size.lg` | `typography.label` at 14 px | Sticky CTA bar (phone), hero CTA |

Gap between icon and label `space.2`. Radius `radius.sm`. Labels never wrap; if space is short the button grows in height to two lines only on phone, never truncates.

**Variants**

| Variant | Fill | Label / icon | Border | Hover | Pressed | Typical use (examples) |
|---|---|---|---|---|---|---|
| `primary` | `color.primary.default` | `color.primary.on` | none | `color.primary.hover` + `glow.primarySmall` | `color.primary.pressed` | `Execute Order --force`, `Build & Deploy`, `+ import`, `Monitor pipeline`. One primary per view region |
| `primary-hero` | as primary, plus `glow.primaryMedium` at rest | as primary | none | `glow.primaryLarge` | as primary | Home hero `git checkout menu`, confirmation `Monitor pipeline` |
| `secondary` | transparent | `color.primary.light` | 1 px `color.primary.light` | fill `color.primary.subtle` | fill `color.primary.border` | `New Branch`, `Print receipt` |
| `neutral` | `color.surface.highest` | `color.text.primary` | 1 px `color.border.default` | `color.surface.bright` | `color.surface.high` | `View receipt`, filter actions |
| `success` | `color.success.default` | `color.success.on` | none | fill mixed 8 % white (`opacity.hover`) | 8 % black overlay | Not used on Lite screens |
| `danger` | `color.error.default` | `color.error.on` (5.9 : 1) | none | 8 % white overlay | 8 % black overlay | Confirming button of a destructive confirmation dialog (`Clear manifest`, `Roll back order`, `Cancel order`) — `06-ui-specification/` README 3.4 |
| `danger-outline` | transparent | `color.error.text` | 1 px `color.error.default` | fill `color.error.subtle` | fill `color.error.subtle` + border 2 px | Buttons that open a destructive confirmation or are secondary on a card: `CLEAR (rm -rf)`, `Rollback order`, `Cancel order` on SCR-07 |
| `danger-strong` | `color.error.container` | `color.error.onContainer` | 1 px `color.error.default` (needed for 3 : 1 boundary, see accessibility.md 3.4) | border 2 px | 8 % black overlay | Not used on Lite screens |
| `command` | transparent | `color.success.text`, `typography.code` (no uppercase), prefix `$ ` in `color.text.muted` | none | fill `color.surface.high`, label underline | fill `color.surface.highest` | Inline commands: `$ cat recipe.conf →`, `git log --grep` link to SCR-10, `View logs` |

Rules:

- Lite screens use only `primary`, `primary-hero`, `secondary`, `neutral`, `danger`, `danger-outline` and `command`. There are no green `success` buttons (Stitch used green for the cart side-panel CTA; replaced by `primary`, see section 9).
- A destructive action is never the visually dominant button next to a safe one, except in its own confirmation dialog.
- Labels of `primary`, `secondary`, `neutral`, `success`, `danger`, `danger-outline` and `danger-strong` are rendered uppercase (`typography.label`): `Execute Order --force` displays as `EXECUTE ORDER --FORCE`. The accessible name keeps normal case.

**States**

| State | Rule |
|---|---|
| Disabled | `opacity.disabled`; reason shown (e.g. `Execute Order --force` disabled below the delivery minimum: helper text explains). A disabled button stays focusable only when it has a tooltip that explains why (then `aria-disabled="true"` instead of the disabled attribute) |
| Loading | Label replaced by `progress_activity` spinner (rotating, `motion.duration.progress` linear, infinite) + loading text in the same style (e.g. `DEPLOYING…`); width does not change; further clicks are ignored (no double submit); `aria-busy="true"` |
| Success flash (optional) | For copy and quick-add buttons only: icon changes to `check` for 1.5 s; the toast or live region announces the result |

**Accessibility.** Native button semantics; accessible name = plain action when the label is a dev label (`Execute Order --force` → "Place order and pay"); visible focus ring; `Enter` and `Space` activate.

**Used on.** All screens.

### 2.2 Icon button

**Anatomy.** Square container with one icon. Optional count bubble (see 7.3).

| Property | Value |
|---|---|
| Size | 40 × 40 px desktop, 44 × 44 px phone/tablet; icon `icon.size.md` (20) or `lg` (24) |
| Variants | `ghost` (transparent, icon `color.text.secondary`, hover `color.surface.high` + icon `color.text.primary`), `tonal` (fill `color.surface.highest`, hover `surface.bright`), `danger-ghost` (icon `color.error.text`, hover `color.error.subtle`) |
| Radius | `radius.sm` |
| Selected (toggle icon buttons) | Icon `color.primary.light`, fill `color.primary.subtle`, `aria-pressed="true"` |

**Accessibility.** An accessible name is mandatory (e.g. `delete` → "Remove line", `content_copy` → "Copy commit hash", `close` → "Close"). A tooltip with the same name appears on hover and focus (4.8).

**Examples.** Close modal (`close`), remove cart line (`delete`), edit cart line (`edit`), copy (`content_copy`), configure (`tune`), info (`info`), sidebar collapse (`menu` / `menu_open`).

## 3. Form controls

### 3.1 Field ("env variable" input)

**Purpose.** Single-line text input with the dev-style label used on checkout (SCR-06).

**Anatomy.**

```
ADDRESS_LINE_1 *   Street and number            ← label row
export ADDRESS_LINE_1 = "│2140 Folsom Street        "   ← optional terminal prefix (decorative) + input
Help text or range hint                         ← help row
⚠ ADDRESS_LINE_1 is required                    ← error row (replaces help)
```

| Part | Token / rule |
|---|---|
| Dev label | `typography.label`, `color.primary.light` (e.g. `ADDRESS_LINE_1`, `CONTACT_EMAIL`) |
| Plain label | `typography.bodySmall`, `color.text.muted`, after the dev label (e.g. "Street and number"); together they form the accessible label |
| Required marker | `*` in `color.error.text` after the dev label; the accessible label includes "required" |
| Terminal prefix (optional) | `export` in `color.syntax.keyword`, the variable name in `color.syntax.property`, `=` and quotes in `color.syntax.punctuation`; decorative, hidden from assistive technology, never inside the editable value. Shown on desktop and tablet in SCR-06; hidden on phone if it would leave less than 200 px for the input |
| Input box | Height 44 px; fill `color.surface.highest`; 1 px `color.border.default` on top/left/right and **1 px bottom edge `color.text.muted`** (gives the 3 : 1 field boundary, accessibility.md 3.4); `radius.sm`; padding `space.3`; value `typography.body`, `color.text.primary` |
| Placeholder | Optional example value only, never the label. `color.text.secondary`, italic (`color.text.muted` is not used on `surface.highest`, see accessibility.md 3.2) |
| Help row | `typography.bodySmall`, `color.text.muted`, margin-top `space.1` |
| Error row | `error` icon `icon.size.sm` + message, `typography.bodySmall`, `color.error.text` |

| State | Rule |
|---|---|
| Hover | Fill `color.surface.bright` |
| Focus | Border (all sides) 1 px `color.primary.light` + focus ring |
| Filled | Value `color.text.primary` |
| Error | Border (all sides) 1 px `color.error.default`; error row shown; `aria-invalid="true"`; message linked by `aria-describedby` |
| Disabled | `opacity.disabled` |
| Read-only | 1.1 read-only rule |
| With suffix/prefix unit | Unit text (`$`, `s`, `%`, `mi`, `°F`) inside the box in `color.text.muted`, not part of the value |

**Behavior.** Validation messages appear on leave (blur) of a touched field and for all fields on submit; on submit, focus moves to the first invalid field. Trimming and formats follow `BR-DATA-06/07`. Input modes: email → email keyboard, phone → tel, ZIP → numeric.

### 3.2 Prompt input (search, coupon, terminal command)

**Purpose.** A one-line input styled as a shell prompt: menu search `grep --pizza '…'`, coupon `$ coupon --apply`, guest lookup.

**Anatomy.** `[prompt] [input] [clear] [action]`

| Part | Token / rule |
|---|---|
| Container | Fill `color.surface.lowest`, 1 px `color.border.default`, bottom edge 1 px `color.text.muted`, `radius.sm`, height 44 px |
| Prompt | `typography.code`, `color.success.text` (`$`, `grep --pizza`, `mxdev@oven:~$`); decorative, not part of the value |
| Input | `typography.code`, `color.text.primary`; caret `color.terminal.cursor` |
| Idle cursor | When empty and not focused, a static or blinking block cursor 8 × 18 px in `color.terminal.cursor` (blink `motion.duration.blink`; static under reduced motion) |
| Clear | Icon button `close` (ghost, sm), shown when the value is not empty; accessible name "Clear search" / "Remove coupon" |
| Action | Optional `neutral` button `sm` (`RUN` for coupon; accessible name "Apply coupon") |

| Variant | Use | Specific rules |
|---|---|---|
| `search` | Header (desktop), SCR-02 (all widths) | Leading `search` icon replaces the prompt on phone; on SCR-02 results filter live 300 ms after typing stops (SCR-16 E-08); `Enter` submits; `Esc` clears; role `searchbox` |
| `coupon` | SCR-05, SCR-06 | Result line under the input: applied → `color.success.text` with `check_circle` and the coupon description; not applied → `color.warning.default` with `warning` and the `couponMessage`; invalid → `color.error.text` with `error`. Messages come from `BR-PRICE-06` |
| `lookup` | SCR-10 | Two stacked prompt inputs (order number, email) + `primary` button |

### 3.3 Textarea

As field (3.1) with min 3 rows, vertical resize only, max height 8 rows then internal scroll. Character counter bottom right `42 / 200` in `typography.micro`, `color.text.muted`; turns `color.error.text` above the limit. Used for delivery notes (`DELIVERY_NOTES`, SCR-06).

### 3.4 Select

As field (3.1) plus `expand_more` icon right (`color.text.muted`). The open list is a dropdown panel: fill `color.surface.high`, 1 px `color.border.default`, `radius.sm`, `shadow.elevation1`, `zIndex.dropdown`, max height 320 px with scroll. Option height 40 px (44 on touch), `typography.body`; hover `color.surface.highest`; selected option `color.primary.light` + `check` icon. Keyboard: arrows, `Home`/`End`, type-ahead, `Enter` select, `Esc` close. On phone the platform's native picker may be used. Optional in Lite: the `STATE` field of SCR-06 may use it.

### 3.6 Checkbox ("dependency toggle")

**Anatomy.** `[box] [label] [meta] [price]`

| Part | Token / rule |
|---|---|
| Box | 20 × 20 px, `radius.sm`, 1.5 px border `color.text.muted` (5.4 : 1 on `surface.low`), transparent fill |
| Checked | Fill `color.success.default`, `check` icon in `color.success.on`, border none |
| Label (configurator extras) | JSON-style key: `"cherry_tomatoes"` in `color.syntax.string`, then plain name `Cherry tomatoes` in `typography.bodySmall` `color.text.secondary` |
| Meta | Version tag `v3.0.0 · hot` in `typography.micro`, `color.syntax.number` |
| Price | Right-aligned `+$2.50` in `typography.body`, `color.text.primary` (price for the current size, `BR-PRICE-03`) |
| Row | Whole row is the hit area (min height 44 px), fill `color.surface.high`, hover `color.surface.highest`, `radius.sm`; checked row gets 1 px `color.success.default` border |

| State | Rule |
|---|---|
| Disabled by limit | Unchecked boxes disabled when `maxExtras` is reached; a counter above the list shows `5/5 dependencies injected` and the reason |
| Unavailable | Ingredient sold out: row disabled, name struck through, chip `UNAVAILABLE_TODAY` (4.2 neutral chip) |

**Accessibility.** Native checkbox semantics; label = key + plain name + price ("Cherry tomatoes, add for $2.50"); group label `dependencies (extra toppings), 1 of 5 used`.

### 3.7 Radio card (option card)

**Purpose.** One choice from a group of rich options: crust, sauce, cheese (SCR-03), payment method and test card (SCR-06/07), order type on phone.

**Anatomy.** `[radio] [dev key / title] [description] [price or meta]`

| Part | Token / rule |
|---|---|
| Container | Full width, min height 56 px, fill `color.surface.high`, 1 px `color.border.default`, `radius.sm`, padding `space.3` `space.4` |
| Radio | 20 px circle, 1.5 px border `color.text.muted`; selected: 2 px ring `color.primary.light` with 10 px inner dot `color.primary.light` |
| Title | Dev key `neapolitan_core` in `typography.body` weight 600 `color.text.primary`, followed by plain name (`Neapolitan Core`) |
| Description | `typography.bodySmall`, `color.text.secondary` — `Puffy, leopard-spotted rim. 48-hour ferment.` (`color.text.muted` would drop to 3.6 : 1 on the selected fill, accessibility.md 3.2) |
| Price / meta | Right-aligned `+$1.50`; default option shows `+$0.00 · default` in `color.text.secondary` |
| Selected | Fill `color.primary.subtle` over the card, border 2 px `color.primary.default`, `glow.primarySmall` |
| Disabled | `opacity.disabled` + reason in the description (`Medium and Large only`, `10" only`) |
| Unavailable | As disabled, with chip `UNAVAILABLE_TODAY` |

Group header: `typography.label` `color.primary.light` with a section icon (e.g. `memory` + `CORE_KERNEL (CRUST)`) and the current choice right-aligned as a tag `<Neapolitan_Core />`.

**Accessibility.** `radiogroup` with the plain group name ("Crust"); arrow keys move the selection; the option's accessible name contains title, plain name and price.

**Test-card variant (SCR-06/07).** Title = test card caption (`Visa •••• 4242`), description = expected outcome (`approves`, `declined`, `insufficient funds`, `gateway timeout`) in `color.text.muted`, leading `credit_card` icon. No card-number input exists anywhere (A-06).

### 3.8 Segmented control

**Purpose.** Pick one of 2–5 short, equal options: pizza size (`scale_factor`), order type (`const method = 'delivery' | 'pickup'`), tip (`0%` `10%` `15%` `20%`).

| Part | Token / rule |
|---|---|
| Track | Fill `color.surface.highest`, `radius.sm`, padding `space.1` |
| Segment | Min height 40 px (44 on touch), equal width, `typography.label`, `color.text.secondary`; optional second line (`12" · +$0.00`, count `(8)`) in `typography.micro` |
| Selected segment | Fill `color.primary.light`, text `color.primary.on` (11 : 1), weight 700 |
| Hover (unselected) | Text `color.text.primary`, fill `color.surface.bright` |
| Disabled segment | `opacity.disabled` (e.g. size not offered for the calzone) |

Sizes on SCR-03 show size, diameter and price delta to the default size, e.g. for Inferno Payload `SMALL 10" −$4.00`, `MEDIUM 12"`, `LARGE 14" +$4.01` (exact delta wording in `06-ui-specification/`). Order type shows icon + label (`local_shipping` DELIVERY, `store` PICKUP).

**Accessibility.** `radiogroup` (or `tablist` when it switches visible content) with arrow-key navigation; selected state exposed (`aria-checked` / `aria-selected`).

### 3.10 Quantity stepper (`instances:`)

**Anatomy.** `instances:  [−]  2  [+]`

| Part | Token / rule |
|---|---|
| Container | Fill `color.surface.highest`, `radius.sm`, height 40 px (44 on touch) |
| Label | `instances:` `typography.code` `color.text.muted` (hidden on very narrow cards; the accessible label stays) |
| Buttons | Icon buttons `remove` / `add`, 32 × 32 px desktop, 44 × 44 px touch, icon `color.success.text` |
| Value | `typography.body` weight 700, `color.text.primary`, min width 3 ch, centered |

Limits come from `StoreSettings.maxQuantityPerLine` (1–10). At 1 the `−` button is disabled (removing a line is the `rm` action); at 10 the `+` button is disabled with the tooltip "Max 10 per line". Each change updates totals at once.

**Accessibility.** Group with label "Quantity, Inferno Payload"; buttons named "Decrease quantity" / "Increase quantity"; value changes announced politely ("Quantity 2").

---

## 4. Status and feedback

### 4.1 Order status badge

**Purpose.** Shows an order's `OrderStatus` everywhere: tracking (SCR-09), order detail (SCR-13), toasts.

**Anatomy.** `[icon] DEV_LABEL` in a pill. Plain label shown as sub-label, tooltip or accessible name depending on context.

| Part | Token / rule |
|---|---|
| Container | Height 24 px (`sm`) or 32 px (`md`), padding 0 `space.2`, `radius.sm`, fill = the status color at 12 % alpha (`.subtle` value of the matching semantic color), 1 px border in the status color |
| Icon | `icon.size.sm` (16) in the status color |
| Label | `typography.label` in the **badge text color** of the table below |
| Current-state glow | Only on the current stepper node: the `glow.status*` of the color |

| # | Key | Dev label (badge text) | Plain label | Status color (border, icon, fill base) | Badge text color | Icon | Glow |
|---|---|---|---|---|---|---|---|
| 1 | `PAYMENT_PENDING` | `STAGED` | Awaiting payment | `color.status.staged` | `color.status.staged` | `credit_card` | — |
| 2 | `PAYMENT_FAILED` | `PAYMENT_FAILED` | Payment failed | `color.status.failed` | `color.error.text` | `credit_card_off` | `glow.statusFailed` |
| 3 | `QUEUED` | `QUEUED` | Order received | `color.status.queued` | `color.text.secondary` | `hourglass_empty` | `glow.statusQueued` |
| 4 | `BAKING` | `BAKING` | In the oven | `color.status.baking` | `color.status.baking` | `local_fire_department` | `glow.statusBaking` |
| 5 | `QA_CHECK` | `QA_CHECK` | Quality check & packing | `color.status.qa` | `color.status.qa` | `fact_check` | — |
| 6 | `READY_FOR_DISPATCH` | `DISPATCH_READY` | Waiting for courier | `color.status.dispatch` | `color.status.dispatch` | `package_2` | `glow.statusDispatch` |
| 7 | `READY_FOR_PICKUP` | `READY_TO_PULL` | Ready for pickup | `color.status.dispatch` | `color.status.dispatch` | `store` | `glow.statusDispatch` |
| 8 | `OUT_FOR_DELIVERY` | `IN_TRANSIT` | On the way | `color.status.dispatch` | `color.status.dispatch` | `moped` | `glow.statusDispatch` |
| 9 | `DELIVERED` | `DEPLOYED` | Delivered | `color.status.deployed` | `color.status.deployed` | `check_circle` | `glow.statusDeployed` |
| 10 | `PICKED_UP` | `PULLED` | Picked up | `color.status.deployed` | `color.status.deployed` | `done_all` | `glow.statusDeployed` |
| 11 | `CANCELLED` | `ROLLED_BACK` | Cancelled | `color.status.failed` | `color.error.text` | `undo` | `glow.statusFailed` |

The badge text color differs from the status color only for `failed` and `queued`, because `#ff5555` and `#a28d79` on their own 12 % fill fall below 4.5 : 1 on `surface.container` and `surface.high` (accessibility.md 3.3). Border, icon and fill keep the status color, so the badges still read as red and brown.

**Variants**

| Variant | Where | Rule |
|---|---|---|
| `badge` (default) | Tables, cards, history | Dev label only; plain label in tooltip and accessible name |
| `badge-with-plain` | Tracking header (SCR-09), order detail header (SCR-13) | Dev label badge + plain label next to it in `typography.bodySmall` `color.text.secondary` (`BAKING · In the oven`) |
| `dot` | Very dense places | 8 px dot in the status color + dev label text in the badge text color; never the dot alone |

**Accessibility.** Accessible name "Order status: In the oven (BAKING)". Color is never the only carrier: label and icon are always present.

### 4.2 Other status chips

Same anatomy as 4.1 (`.subtle` fill + 1 px border + label). Neutral chips use fill `color.surface.highest`, border `color.border.default`, text `color.text.secondary`.

| Domain | Value → chip text | Color (border/icon) / text color | Icon |
|---|---|---|---|
| `CourierStatus` | `OFF_DUTY` → `OFF_DUTY` | neutral | `bedtime` |
| | `AVAILABLE` → `IDLE` | `color.success.default` / `color.success.text` | `check_circle` |
| | `TO_STORE` → `EN_ROUTE_TO_STORE` | `color.info.default` / same | `near_me` |
| | `AT_STORE` → `WAITING_HANDOVER` | `color.warning.default` / same | `store` |
| | `DELIVERING` → `IN_TRANSIT` | `color.status.dispatch` / same | vehicle icon (`moped`, `electric_bike`, `directions_car`) |
| | `RETURNING` → `RETURNING` | `color.tertiary.default` / same | `u_turn_left` |
| Product availability | `404: OUT_OF_STOCK` (products) / `SOLD_OUT` (options, ingredients) | `color.error.default` / `color.error.text` | `block` |
| `PaymentStatus` | `UNPAID` / `PAID` / `REFUNDED` | warning / success / info | `schedule` / `paid` / `currency_exchange` |
| `PaymentAttemptStatus` | `PROCESSING` / `SUCCEEDED` / `FAILED` / `REFUNDED` | warning / success / error (`color.error.text`) / info | `progress_activity` / `check_circle` / `error` / `currency_exchange` |
| `OrderType` | `DELIVERY` / `PICKUP` | neutral | `local_shipping` / `store` |
| Version tag | `v2.4`, `v1.0-LTS` | neutral, `typography.micro`, text `color.syntax.number` | — |
| Log level | `[INFO]` `[SUCCESS]` `[WARN]` `[ERROR]` `[DEBUG]` | text only, no chip: `color.log.*` | — |

### 4.3 Product tags (badges, diet, spice)

JSX-style tags on menu cards, item info and the configurator. Fill transparent, 1 px border in the text color at 40 % alpha, `radius.sm`, height 22 px, `typography.micro`. Never wraps inside; tags wrap as a group.

| Tag | Text | Color | Source |
|---|---|---|---|
| Classic | `<Classic />` | `color.text.secondary` | `ProductBadge.CLASSIC` |
| Best seller | `<BestSeller />` | `color.primary.light` | `BEST_SELLER` |
| New | `<NewRelease />` | `color.info.default` | `NEW` |
| Chef pick | `<ChefPick />` | `color.tertiary.default` | `CHEF_PICK` |
| Vegetarian | `<Vegetarian />` | `color.success.text`, leading `eco` icon | derived `isVegetarian` (not shown when vegan) |
| Vegan | `<Vegan />` | `color.success.text`, leading `eco` icon | derived `isVegan` |
| Spice | `HOTFIX_SPICY:1` / `:2` / `:3` | `color.error.text`, leading 1–3 `local_fire_department` icons | `SpiceLevel` MILD / MEDIUM / HOT; not shown for NONE |

Accessible names use the plain meaning ("Vegetarian", "Spice level: Hot"). Tags in the configurator update live with the configuration (`BR-DATA-10`).

### 4.4 Live indicator

`[dot] LIVE` — 8 px `radius.full` dot `color.success.default` with `glow.success` and a pulse (opacity 1 → 0.4 → 1 over `motion.duration.pulse`), label `typography.label` `color.success.text`. Shown on screens that refresh automatically (SCR-09).

| State | Rule |
|---|---|
| Live | As above |
| Stale | Refresh failed for more than 10 s: dot `color.warning.default`, no pulse, label `RECONNECTING…` in `color.warning.default`; FD-15 defines the notice |
| Reduced motion | No pulse |

### 4.5 Banner

Full-width message strip inside the page (below the header) or inside a panel.

| Variant | Fill | Border | Text | Icon | Use |
|---|---|---|---|---|---|
| `info` | `color.info.subtle` | left 4 px `color.info.default` | `color.text.primary`, title in `color.info.default` | `info` | Payment processing banner on SCR-09 ("Processing payment…"), pickup instructions |
| `success` | `color.success.subtle` | left 4 px `color.success.default` | title `color.success.text` | `check_circle` | Refund issued note |
| `warning` | `color.warning.subtle` | left 4 px `color.warning.default` | title `color.warning.default` | `warning` | Below delivery minimum, outside delivery zone |
| `error` | `color.error.subtle` | left 4 px `color.error.default` | title `color.error.text` | `error` | Payment failed banner with retry/cancel, `ROLLED_BACK` banner, `ROLLBACK REJECTED`, `CONNECTION_LOST` (SCR-16 E-04) |

Anatomy: icon, title (`typography.label`), message (`typography.body`), optional actions (buttons `sm`/`md`), optional close (only for dismissible info/success). Padding `space.3` `space.4`, `radius.sm`. Error and critical banners use `role="alert"` when they appear after the page has loaded; banners present at load are plain content.

### 4.6 Toast

Short, temporary feedback after an action ("Added Inferno Payload to manifest", "Coupon applied", "Copied to clipboard.").

| Property | Value |
|---|---|
| Position | Desktop/tablet: top right under the header, `space.6` from the edge. Phone: top center under the header, full width minus `layout.marginPhone`. Above all other layers (FD-15 BR-ERR-08) |
| Container | Fill `color.surface.high`, 1 px `color.border.default`, left 4 px bar in the variant color, `radius.md`, `shadow.modal`, width 360 px (phone: full), padding `space.3` `space.4`, `zIndex.toast` |
| Content | Icon (variant color), message `typography.body` `color.text.primary` (max 2 lines), optional action (`command` button, e.g. `UNDO` on remove line) and close icon button |
| Variants | `info` (`color.info.default`, `info`), `success` (`color.success.default`, `check_circle`), `warning` (`color.warning.default`, `warning`), `error` (`color.error.default`, `error`) |
| Duration | info / success 4 s, warning 6 s, error until closed; a toast with an action (e.g. `UNDO`) at least 6 s (FD-15 BR-ERR-08); every toast has a close icon; the timer pauses while the toast is hovered or focused |
| Stack | Max 3 visible; a newer toast pushes the oldest out |
| Motion | Slide + fade in `motion.duration.slow` `motion.easing.emphasized`; reduced motion: fade only, `motion.duration.fast` |

**Accessibility.** Container is a polite live region (`role="status"`); error toasts use `role="alert"`. Toasts never contain the only path to an action; focus is not moved to a toast.

### 4.7 Field error and form summary

Field errors: see 3.1. On submit with 2 or more invalid fields (FD-15 BR-ERR-05), a form-level `error` banner appears at the top with the summary TXT-VAL-01 (`Lint failed: {n} env variables need attention.`) and links to each invalid field; focus moves to the first invalid field. Messages follow FD-15 BR-ERR-06 and `BR-DATA-08` (the dev field name is named: "ZIP_CODE must be 5 digits." TXT-VAL-07).

### 4.8 Tooltip

Fill `color.surface.highest`, 1 px `color.border.default`, `radius.sm`, padding `space.2` `space.3`, `typography.bodySmall` `color.text.primary`, max width 280 px, `zIndex.tooltip`, arrow 6 px. Shows after 400 ms hover or immediately on keyboard focus; hides on `Esc`, blur or pointer leave (with 100 ms grace so the pointer can move onto it). On touch devices, tooltips open on tap of an `info` icon button and close on the next tap. Tooltips carry plain meanings of dev labels and disabled reasons; they never contain the only copy of information needed to complete a task, and never contain interactive content.

### 4.9 Progress bar and meter

| Property | Value |
|---|---|
| Track | Height 4 px (`sm`) or 8 px (`md`), fill `color.surface.highest`, `radius.sm` |
| Fill | Context color: bake progress `color.primary.default`; route progress `color.info.default`; QA/readiness/success `color.success.default`; kitchen load (SCR-01 `KITCHEN_LOAD`, SCR-08 thermal load; SIM-02 BR-SIM-16d) `color.primary.default` below 85 %, `color.error.default` from 85 % with `HEAVY` label |
| Value text | Right or above: `72%`, `THERMAL LOAD 88% (HEAVY)`, `1.2 mi left` in `typography.label` |
| Update | Width animates between server updates over `motion.duration.progress` linear; reduced motion: jumps |
| Overrun | Bake progress stops at 100 % (SIM-02 BR-SIM-16b); Lite has no overbake state |

`role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and an accessible name ("Bake progress"). Meters (kitchen load) use `role="meter"` where supported, otherwise `progressbar`.

### 4.10 Loading: spinner, skeleton, terminal loader

| Pattern | Use | Rule |
|---|---|---|
| Spinner | Buttons, small areas | `progress_activity` icon rotating 360° per `motion.duration.progress`, linear; color of the context; reduced motion: static icon + text |
| Skeleton | Lists, cards, tables during first load (`loading` state of SCR-02) | Blocks in `color.surface.high` with the final layout's sizes; subtle shimmer (`color.surface.highest` band, 1.5 s); reduced motion: no shimmer |
| Terminal loader | Panels styled as terminals (cart side panel, log panes) | One log line `[INFO] Fetching inventory…` + block cursor |

Loading longer than 10 s shows an error state with `RETRY_DEPLOYMENT` (FD-15). Screen readers get one polite announcement "Loading" per region, not per element.

### 4.11 Empty state

Centered block inside the region: optional illustration (from `assets/illustrations/`, transparent PNG 4 : 3, max width 320 px, shown whole; `no-results.png` is still missing: there either the placeholder per `assets/README.md` or no illustration — the text must work alone, `06-ui-specification/` README 3.4), title in `typography.h3` `color.text.primary` (dev style, e.g. `// manifest is empty`), one sentence in `typography.body` `color.text.secondary`, one action (`primary` or `command` button, e.g. `git checkout menu`). Required for: empty cart (SCR-05, `illustrations/empty-cart.png`), no search results (SCR-02, `no-results.png`). Texts in `06-ui-specification/`.

### 4.12 Timer and countdown

| Variant | Format | Token | Use |
|---|---|---|---|
| ETA | `ETA 04:35 · ~18:49` | countdown in `typography.priceLarge` `color.success.text`, clock time in `typography.body` `color.text.secondary` | SCR-08, SCR-09 (`ESTIMATED_ETA`) |

Timers tick every second on screen; the underlying value is corrected by each server refresh (within 5 s, `BR-ORD-20`). Screen readers do not get per-second updates: the timer has `aria-live="off"` and an accessible name with the current value when focused; status changes are announced instead (5.8).

---

## 5. Content and data display

### 5.1 Window chrome (terminal title bar)

The IDE/terminal frame used by log panes, code blocks with a file name and the confirmation modal.

| Part | Token / rule |
|---|---|
| Bar | Height 36 px, fill `color.surface.container`, bottom 1 px `color.border.default`, padding 0 `space.3` |
| Dots | Three 10 px `radius.full` dots `color.terminal.dotRed`, `dotYellow`, `dotGreen`, gap 6 px; decorative, not interactive, hidden from assistive technology |
| Title | `typography.codeSmall`, `color.text.muted`, e.g. `bash — track.log — 80x24`, `stdout --tail` |
| Right slot | Optional: live indicator (4.4), `UTF-8` tag, icon buttons (collapse `expand_more`) |
| Body | Fill `color.surface.lowest`, padding `space.4` |
| Frame | 1 px `color.border.default`, `radius.md`, overflow hidden |

### 5.2 Code-block card

**Purpose.** Shows a product's ingredients (or a configuration) as code. Two variants.

**Common styling.** Body fill `color.surface.lowest`, left 2 px border `color.primary.border`, `radius.md`, padding `space.3` `space.4`, `typography.code` (phone `codeSmall`), syntax colors from `color.syntax.*`:

| Token | Applies to |
|---|---|
| `syntax.keyword` | `const` |
| `syntax.function` | variable name (`pizza`, `drink`) |
| `syntax.property` | keys (`crust:`) |
| `syntax.string` | string values |
| `syntax.number` | numbers |
| `syntax.boolean` | `true` / `false` |
| `syntax.punctuation` | `{ } [ ] , ; = :` |
| `syntax.comment` | comments (never essential information, accessibility.md 3.5) |

**Variant A — product code block (menu card, item info).** Generated from the product's default recipe (glossary 1.2). The content template is owned by `06-ui-specification/screens/SCR-02-menu.md` E-08e and repeated here: pizzas `const pizza = { crust, sauce, cheese, toppings }` with the default crust, sauce and cheese **option names** and the recipe items' **ingredient names** in `sortOrder`; `No Sauce (bianca)` and `No Cheese` are written as `null`. Other products: `const {kind} = { serving, kcal }` with `kind` = `side`, `drink` or `dessert`. Example (PZ-01 The Root Pizza):

```js
const pizza = {
  crust: 'Neapolitan Core',
  sauce: 'San Marzano Tomato',
  cheese: 'Fior di Latte Mozzarella',
  toppings: ['Fresh basil', 'Extra-virgin olive oil (cold-pressed)'],
};
```

```js
const drink = { serving: '12 fl oz can', kcal: 15 };
```

Layout rules (this file): one key per line, string values in `syntax.string`, `null` in `syntax.boolean`. Menu cards show at most 6 lines; a longer `toppings` array is cut with `'…'` as last element (full list in item info and configurator). Long strings never cause horizontal page scroll: the block wraps at the card edge, continuation lines indented by 2 spaces.

**Variant B — `manifest.json` live preview (configurator SCR-03).** JSON of the current configuration, updated on every change, collapsible on phone (`expand_more`). Example for Inferno Payload, Large, extra Cherry tomatoes, crushed red pepper removed (fresh jalapeños are out of stock in the Lite seed and start unlinked):

```json
{
  "module": "inferno-payload",
  "version": "v2.4",
  "size": "LARGE",
  "core_kernel": "neapolitan_core",
  "base_layer": "san_marzano",
  "cheese_driver": "buffalo_mozzarella",
  "dependencies": ["cherry_tomatoes"],
  "unlinked": ["jalapeno", "chili_flakes"],
  "instances": 1,
  "unit_price": 25.00,
  "allergens": ["GLUTEN", "MILK"],
  "vegetarian": false,
  "vegan": false
}
```

A status line under the block shows `compiled ok` (`color.success.text`) or the blocking problem (`color.error.text`, e.g. option unavailable). The changed line briefly highlights (`color.primary.subtle` background, 600 ms; none under reduced motion).


**Accessibility.** The visual code is hidden from screen readers (`aria-hidden="true"`) and replaced by an equivalent plain list in visually hidden text: "Crust: Neapolitan Core. Sauce: San Marzano Tomato. Cheese: Buffalo Mozzarella. Toppings: Spianata calabrese, Fresh jalapeños. Finish: Calabrian chili oil, Crushed red pepper." The `manifest.json` preview is complemented by the visible price, allergen and diet information, which are real text.

### 5.3 Product image frame

Container for every product photo. Aspect ratio per usage in [imagery.md](imagery.md) section 3; `radius.xl` (cards: top corners only, matching `radius.md` card), image `object-fit: cover`, centered. Background `color.surface.lowest` while loading.

| State | Rule |
|---|---|
| Image present | Photo, alt text = `Product.imageAlt` |
| Image missing (not expected in Lite: all 25 catalog photos exist) | Placeholder from `assets/README.md` section 2: same slot size, `color.surface.lowest` fill, 1 px dashed `color.border.default`, `radius.xl`, centered `icons/icon-pizza-module.svg` 32 px at 50 % opacity, caption `IMAGE_PENDING // pz-01-root-pizza.jpg` in `typography.micro` `color.text.muted`; alt text still set |
| Sold out | Photo grayscale 100 % and 60 % opacity, overlay chip `404: OUT_OF_STOCK` centered |
| Loading | Skeleton (4.10) |
| Load error | As image missing, caption `IMAGE_ERROR // <file name>` |

Overlay content on images (price, spice) sits on a gradient from transparent to `color.surface.base` at 85 % over the bottom 40 % of the image, so overlay text keeps ≥ 4.5 : 1.

### 5.4 Menu item card ("module")

**Purpose.** One product on the home carousel (SCR-01) and the menu grid (SCR-02). Content and behavior are owned by `06-ui-specification/screens/SCR-02-menu.md` E-08a … E-08j; this section defines the look.

**Anatomy (top to bottom, matching SCR-02 E-08).**

| # | Part (SCR-02 element) | Token / rule |
|---|---|---|
| 1 | Path label (E-08a) | `./pizzas/inferno-payload.ts · v2.4` in `typography.micro`, `color.text.muted` |
| 2 | Name and dish (E-08b) | Dev name `Inferno Payload` in `typography.h3` `color.primary.light`; real-world name `Diavola` in `typography.bodySmall` `color.text.muted` |
| 3 | Price (E-08c) | `$18.49 · 12"` (`BR-PRICE-01`) in `typography.body` weight 700 `color.success.text`, right-aligned in the name row |
| 4 | Image (E-08d) | Product image frame (5.3), **16 : 10** crop of the square photo, full-bleed to the card edges |
| 5 | Code block (E-08e) | Variant A (5.2) |
| 6 | Short description (E-08f) | `typography.bodyLong` (Geist) `color.text.secondary`, max 2 lines with ellipsis |
| 7 | Tags (E-08g) | Max 4 chips in the order diet, badges, spice (4.3) |
| 8 | Allergen line (E-08h) | `typography.micro` `color.text.muted` |
| 9 | Actions (E-08i) | `+ import` (`primary`, `md`, flex 1); pizzas also `tune` icon button (tonal, "Configure Inferno Payload"); all products `info` icon button ("Details for …", SCR-04) |

| Property | Value |
|---|---|
| Container | Fill `color.surface.low`, 1 px `color.border.default`, `radius.md`, padding `space.4` |
| Grid | Per `06-ui-specification/responsive-behaviour.md` section 3: desktop 2 columns (3 columns ≥ 1440 px), tablet 2, phone 1; gap `layout.gutter` |
| Card click | Whole card is clickable: pizza → SCR-03, other → SCR-04 (E-08). The name is the link (accessible name = dev name + real-world name + price); the action buttons are separate targets and do not trigger the card click |

| State | Rule |
|---|---|
| Hover | Fill `color.surface.high`, `shadow.elevation1`, `zIndex.raised`; image scales to 1.03 within the frame (`motion.duration.base`; none under reduced motion) |
| Focus | Focus ring on the name link and on each action |
| Added | `+ import` shows success flash (`check`) for 1.5 s; toast confirms (TXT-MENU-35/36); cart count updates |
| Sold out (E-08j) | Image sold-out state (5.3) with `404: OUT_OF_STOCK`; `+ import` disabled with helper text; `tune` and `info` still open their screens; card stays in place |
| Loading | Skeleton of the full card |

**Phone.** Single column; code block max 4 lines; `+ import` full width with the icon buttons beside it.

**Accessibility.** Card is an `article` with a heading (the name link); image alt from `imageAlt`.

### 5.5 Cart line ("artifact")

Used in the cart drawer/page (SCR-05), the desktop side panel (`Terminal Debugger`, compact), checkout summary (compact) and order detail (read-only).

| Part | Token / rule |
|---|---|
| Container | Fill `color.surface.high`, `radius.md`, padding `space.3`, gap `space.3` |
| Thumbnail | Product image frame 1 : 1, 56 px (compact: hidden) |
| Title | `quantity× ` + dev name `Inferno Payload` (`typography.body` weight 600 `color.primary.light`) + version chip |
| Configuration | Modifier summary TXT-CART-39 in `typography.bodySmall` `color.text.secondary`: size, non-default crust, sauce and cheese names, `+ {extra}` (in `color.success.text`), `− {removed}` (in `color.error.text`), comma separated, e.g. `Large 14", Buffalo Mozzarella, + Cherry tomatoes, − Fresh basil` |
| Price | Line total right (`typography.body` weight 700), unit price below when quantity > 1 (`$25.00 / unit`, `typography.micro` `color.text.muted`) |
| Actions | Quantity stepper (3.10); `edit` icon button for pizzas ("Edit configuration", opens SCR-03 in edit mode); `delete` icon button labelled `rm` ("Remove Inferno Payload from cart") |
| Unavailable | Line at 60 % opacity, chip `404: OUT_OF_STOCK`, message under the title (`06-ui-specification/`), checkout blocked (`BR-ORD-03`) |
| Read-only (order detail) | No actions; quantity as text |

Removing a line shows a toast with `Undo` (TXT-CART-08; at least 6 s, FD-15 BR-ERR-08).

### 5.6 Totals summary

| Row | Example | Style |
|---|---|---|
| Subtotal | `SUBTOTAL_PAYLOAD  $21.49` | label `typography.bodySmall` `color.text.secondary`, amount `typography.body` `color.text.primary`, right-aligned |
| Discount | `GITHUB_STUDENT  −$3.22` | label + amount `color.success.text` |
| Delivery fee | `PIPELINE_TRANSIT_FEE  $3.99` or `$0.00 FREE_DISPATCH` | waived: amount `$0.00` + chip `FREE_DISPATCH` (success) |
| Sales tax | `SALES_TAX (8.625%)  $1.58` | as subtotal |
| Tip | `COURIER_TIP (15%)  $2.74` | as subtotal; hidden for pickup |
| Divider | 1 px `color.border.subtle` | — |
| Total | `EXEC_TOTAL_OUTPUT  $26.58` | label `typography.label`; amount `typography.priceLarge` `color.primary.light` |

Example values are worked example B of the information model. Amounts are right-aligned in a column; every row has a plain accessible label ("Delivery fee: free"). Totals update within the same interaction when anything changes (no stale totals).

### 5.7 Copyable value

Commit hash, order number, tracking link, payment reference.

`[label] [value] [copy button]` — label `typography.label` `color.text.muted` (`DEPLOYMENT_HASH`), value `typography.code` `color.success.text` (`#a3f9c2e`), icon button `content_copy` ("Copy commit hash"). After copying: icon becomes `check` for 1.5 s and the toast "Copied to clipboard." appears (`TXT-GEN-11`); if the clipboard is blocked, the value text is selected instead. Container fill `color.surface.high`, `radius.sm`, padding `space.2` `space.3`. The value is selectable text.

### 5.8 Terminal / log panel

**Purpose.** Shows `OrderLogEntry` lines: tracking log (`bash — track.log`, customer-visible lines) and the first lines in the confirmation modal.

**Anatomy.** Window chrome (5.1) + body with lines + optional prompt line.

| Part | Token / rule |
|---|---|
| Line | `[HH:mm:ss]` in `color.log.timestamp`, space, `[TAG]` colored by level (`color.log.info`, `success`, `warn`, `error`, `debug`), space, message in `color.text.primary`; `typography.codeSmall`; hanging indent so wrapped text aligns after the tag |
| Level → tag color | INFO `color.log.info` · SUCCESS `color.log.success` · WARN `color.log.warn` · ERROR `color.log.error` · DEBUG `color.log.debug` (internal lines only; not shown in Lite) |
| Prompt line (decorative) | `mxdev@pizza:~$` in `color.success.text` + block cursor; customer tracking shows `> Streaming packets…` while the order is open and `> Process exited with code 0` (or `1` when cancelled) when final |
| Order of lines | Oldest at top, newest at bottom; auto-scrolls to the newest line unless the user has scrolled up (then a `↓ N new lines` chip appears at the bottom; clicking it scrolls down) |
| Height | Tracking: 320 px desktop and tablet. Phone: collapsible section showing the last 5 lines with `Show more` (`06-ui-specification/responsive-behaviour.md` section 2) |
| Limits | Shows the last 200 lines |
| Empty | `// waiting for events…` in `color.syntax.comment` + cursor |

**Accessibility.** The panel is a `log` region with `aria-live="off"` (lines arrive too often to announce). Status changes are announced separately by one polite live region per page ("Order MX-1048 is now In the oven"). The log is keyboard scrollable (focusable region with label "Order log"). Timestamps are decorative only because the same times are listed in the status history (SCR-13).

### 5.9 Pipeline stepper (customer, 5 stages)

**Purpose.** The order's progress on SCR-09 (and compact on SCR-01 "live build status"). Stages and labels per [order-lifecycle.md](../05-processes/order-lifecycle.md) section 2.1.

**Layouts.** Desktop/tablet: horizontal, 5 nodes connected by lines, labels under the nodes. Phone: vertical list (Stitch `Execution Graph`), node left, label and detail right, header `Stage 2/5`.

| Part | Token / rule |
|---|---|
| Node | 48 px desktop / 32 px phone square with `radius.md` (desktop) or circle `radius.full` (phone); icon `icon.size.lg` / `md` |
| Connector | 2 px line; completed segment `color.success.default`; upcoming segment `color.border.default` |
| Label | Dev label `typography.label` (`QUEUED`, `BAKING`, `QA_CHECK`, `DISPATCH` / `READY_TO_PULL`, `DEPLOYED` / `PULLED`) |
| Sub-label | Plain meaning / detail `typography.bodySmall` `color.text.muted` ("In the oven · OVEN_01", "Courier on the way") |

| Node state | Fill | Icon | Label color | Extra |
|---|---|---|---|---|
| Completed | `color.success.default` | `check` in `color.success.on` | `color.text.primary` | — |
| Current | Status color of the order (`color.status.*`) | stage icon in the matching `.on` color (`primary.on` for BAKING, `tertiary.on` for QA, `info.on` for dispatch, `color.text.inverse` for QUEUED/STAGED) | status color (badge text color rule of 4.1) | `glow.status*`; progress bar under the stepper for BAKING (bake %) and OUT_FOR_DELIVERY (route %) |
| Upcoming | `color.surface.highest` | stage icon `color.text.muted` | `color.text.muted` | — |
| Frozen (CANCELLED) | Reached nodes keep their completed look; the next node shows `close` on `color.error.container` | — | `color.error.text` | `ROLLED_BACK` error banner above (4.5) |
| Not started (PAYMENT_PENDING / PAYMENT_FAILED) | All upcoming | — | — | Payment banner above (info / error) |

Stage icons (SCR-09 E-05): 1 `inventory_2`, 2 `local_pizza`, 3 `fact_check`, 4 delivery `local_shipping` / pickup `storefront`, 5 `done_all`; a completed node shows `check`.

**Accessibility.** Ordered list; current item `aria-current="step"`; each item's accessible text "Stage 2 of 5, BAKING, In the oven, current". Status changes announced by the page's polite live region (5.8).


### 5.12 KPI tile

| Part | Token / rule |
|---|---|
| Container | Fill `color.surface.low`, 1 px `color.border.default`, `radius.md`, padding `space.4`, min width 200 px |
| Label | `typography.label` `color.text.muted` (`DEPLOYED_TODAY`) + plain label in tooltip/accessible name ("Orders completed today") |
| Value | `typography.h1` weight 700 `color.text.primary` (`7`, `05:07`, `3/6 · 50%`); on SCR-01 the pixel-board tiles use `typography.priceLarge` `color.primary.default` (SCR-01 E-12) |
| Context | `typography.bodySmall` `color.text.secondary` (`avg. pipeline time today`), optional trend icon `trending_up` |
| Icon | Optional top-right, `color.primary.light` |

Used on SCR-01 (demo KPIs; the pixel-board indicators of SCR-01 E-12) and SCR-08 (info tiles).

### 5.13 Data table

**Purpose.** Status history and payment attempts on the order detail (SCR-13).

| Part | Token / rule |
|---|---|
| Container | Fill `color.surface.low`, 1 px `color.border.default`, `radius.md` |
| Header row | Fill `color.surface.container`, height 44 px, `typography.label` `color.text.muted`; sticky (`zIndex.raised`) when the body scrolls |
| Body row | Height 52 px (dense 44 px), `typography.bodySmall` `color.text.primary`, divider 1 px `color.border.subtle`; numbers and money right-aligned |
| Primary cell | Order number `MX-1048` in `typography.code` `color.primary.light` (link to detail) + secondary line (`#a3f9c2e · 2 items`) in `color.text.muted` |
| Status cell | Order status badge (4.1) |
| Row hover | Fill `color.surface.high` (badges keep ≥ 4.5 : 1 thanks to the 4.1 text colors) |
| Selected row | Fill `color.surface.high` + 2 px left bar `color.primary.light`; `aria-selected="true"` |
| Sorting | Sortable headers show `arrow_upward` / `arrow_downward` (`icon.size.sm`); `aria-sort` set |
| Actions cell | Icon buttons or `command` buttons (`View logs`) |
| Pagination | Not required for the demo data volumes; tables scroll inside the container (max 20 rows visible on desktop) |
| Empty / no results | One row spanning all columns: `// no deployments match the filter` + `CLEAR FILTERS` command button |
| Loading | 5 skeleton rows |
| New row arrives (live) | Row inserted at its sort position with a 1 s `color.primary.subtle` highlight (none under reduced motion) |

**Tablet.** Full table; horizontal scroll inside the table container with the first column sticky.

**Phone.** Every row becomes a card (fill `color.surface.low`, 1 px `color.border.default`, `radius.md`, padding `space.3`): the primary cell as card title, the status badge top right, the other columns as `label : value` pairs (`typography.label` `color.text.muted` / `typography.bodySmall`), actions at the bottom of the card (`06-ui-specification/responsive-behaviour.md` section 2). The page itself never scrolls horizontally.

**Accessibility.** Real table semantics with header cells; the caption names the table (visually hidden if the page heading suffices); row links are the order-number cells, not whole-row click only.

### 5.14 Simulated map panel

**Purpose.** Shows the delivery on SCR-09 (live) and the delivery area on SCR-06 (static); no real map service (product brief 3.2).

| Part | Token / rule |
|---|---|
| Panel | Window-chrome-like header `GEOLOCATION` + live indicator; body fill `color.surface.lowest`, `radius.md`, aspect ratio 16 : 10 (phone 4 : 3) |
| Base image | `assets/illustrations/map-sf-dark.jpg` (1600 × 1000 JPEG, present), `object-fit: cover` centered on the store; decorative (`alt=""`), the panel carries the accessible name |
| Store marker | 32 px `radius.full`, fill `color.primary.default`, icon `storefront` in `color.primary.on`, label chip `GIT PIZZA MXDEV — MISSION KITCHEN` (`typography.micro`) on hover/focus |
| Destination marker | 32 px, fill `color.success.default`, icon `home_pin` in `color.success.on` |
| Route | 3 px line `color.info.default`; travelled part solid, remaining part dashed (6/4) |
| Courier marker | 40 px `radius.full`, fill `color.primary.light`, vehicle icon (`moped` SCOOTER, `electric_bike` E_BIKE, `directions_car` CAR) in `color.primary.on`, `glow.primaryMedium`; label chip with node handle `Marek // Moto-v3` |
| Overlay: ETA | Glass panel bottom (`color.surface.glass` + `blur.glass` + 1 px `color.border.default`): `ESTIMATED_ETA` + countdown (4.12) and `DISTANCE_REMAINING 1.2 mi` |
| Positions | Store and the 8 delivery-zone destinations have fixed relative positions on the image (defined in `10-simulations/`); the courier position = interpolation along the route by `routeProgressPercent` |
| Movement | Marker moves between updates over `motion.duration.progress` linear; reduced motion: jumps |
| States | Before OUT_FOR_DELIVERY: store + destination + route preview, no courier marker, text `Courier not on the way yet`; OUT_FOR_DELIVERY: live; DELIVERED: courier on destination, `DEPLOYED` chip; pickup orders: map replaced by a store card (address, phone) |

No zoom or pan controls (the map is an illustration).

**Accessibility.** The map is `role="img"` with an accessible name summarizing the state ("Delivery map: courier Marek is 1.2 miles away, arriving in about 4 minutes"); the ETA and distance are also visible text outside the image.

### 5.16 Allergen and diet info

Item info (SCR-04), configurator (SCR-03) and order detail show allergens as text, never as icons only:

```
ALLERGENS   Cereals containing gluten · Milk
DIET        <Vegetarian />
SPICE       HOTFIX_SPICY:3 — Hot
```

Labels `typography.label` `color.text.muted`; values `typography.body` `color.text.primary` using the `Allergen` captions; "None declared" when empty. The allergen notice from the menu catalog is shown below in `typography.bodySmall` `color.text.secondary`. In the configurator, a changed allergen set highlights briefly (as 5.2 B).

---

## 6. Overlays

All overlays: backdrop `color.overlay.scrim` with `blur.glass` (`zIndex.scrim`), panel `zIndex.modal` (drawer `zIndex.drawer`), panel fill `color.surface.low`, 1 px `color.border.default`, `shadow.modal`. Enter `motion.duration.slow` with `motion.easing.emphasized`; exit `motion.duration.base`; reduced motion: no slide or scale, opacity only in `motion.duration.fast`.

Shared behavior:

- Focus moves into the overlay on open (to the heading or the first field), stays trapped inside while open, and returns to the triggering element on close.
- `Esc`, the close button and a click on the backdrop close (cancel) the overlay, except where the screen spec forbids it (SCR-07 while processing a payment) — `06-ui-specification/` README 3.4.
- Background content is inert (not focusable, hidden from assistive technology) and does not scroll.
- Each overlay has an accessible name (its heading).

### 6.1 Modal

| Part | Token / rule |
|---|---|
| Size | Width min(`layout.modalMaxWidth` 640 px, 100 % − 2 × `layout.marginTablet`); exception per `06-ui-specification/responsive-behaviour.md`: SCR-07 560 px; max height 90 vh, body scrolls |
| Radius | `radius.lg` |
| Header | Optional window chrome (5.1) for terminal-style modals (SCR-08 `tty: deploy-runner`), otherwise title `typography.h2` + close icon button (`close`, "Close") |
| Body | Padding `space.6` (phone `space.4`) |
| Footer | Actions right-aligned (primary rightmost) on desktop; stacked full width on phone (primary on top) |
| Phone | Full-screen page (SCR-08) or bottom sheet (SCR-04, SCR-07), as stated in the screen inventory |

Used for SCR-04, SCR-07, SCR-08 editor.

### 6.2 Drawer

Right-side panel, full viewport height, width `layout.drawerWidth` (480 px) on desktop and tablet; full-screen page on phone. Header with title (e.g. `MANIFEST.LOCK` + status chip), close button, scrolling body, sticky footer with totals and actions (fill `color.surface.container`, top border `color.border.strong`). Slides in from the right. Used for SCR-05 (cart).

### 6.3 Bottom sheet (phone)

Anchored to the bottom, full width, top corners `radius.lg`, max height 90 vh, drag handle 32 × 4 px `color.border.default` centered (decorative; a visible close button is always present). Slides up. Footer actions sticky with safe-area inset. Used for SCR-04 and SCR-07 on phone, and for filter panels on phone.

### 6.4 Dialog (confirmation)

| Part | Token / rule |
|---|---|
| Size | Width max 480 px, centered (desktop, tablet); phone: bottom sheet (6.3), full width, max 90 % height |
| Content | Icon (variant color), title `typography.h3`, message `typography.body` `color.text.secondary` |
| Actions | `neutral` safe button (`Cancel` / `Keep …`) + confirming button that names the action (`danger` for destructive actions, `primary` otherwise); initial focus on the safe button |
| Role | `alertdialog` for destructive confirmations, `dialog` otherwise |

Used for the clear cart confirmation, the cancel order confirmation (SCR-07, SCR-09) and the rollback confirmation (SCR-09).

---

## 7. Navigation and shell

### 7.1 Header

| Property | Desktop (≥ 1200) | Tablet | Phone (< 768) |
|---|---|---|---|
| Height | `layout.headerHeight` 72 px | 72 px | 56 px |
| Fill / border | `color.surface.container`, bottom 1 px `color.border.strong`, `shadow.elevation1` when the page is scrolled | same | same |
| Left | Horizontal logo `logo-horizontal.svg`, 32 px high (see [logo-usage.md](logo-usage.md) 5; the wordmark is part of the file, no live-text name next to it) | `menu` icon button (opens the Project Explorer drawer) + horizontal logo 32 px high | Logo mark `logo-mark.svg` 36 px only |
| Center | Nav links (7.2) `./main.js`, `./menu.ts`, `./checkout.yml`, `./track.log` | Nav links | — (bottom tabs instead) |
| Right | Search prompt input (3.2, 280 px), cart button (7.3) | Search icon button, cart | Cart button (search lives on SCR-02) |
| Position | Sticky top under the demo-mode banner (`zIndex.stickyHeader`) | same | same |


### 7.2 Nav link

`typography.body`, `color.text.secondary`, height 44 px, padding 0 `space.3`. Hover `color.text.primary`. Active (current page): `color.primary.light` + 2 px underline `color.primary.light` (`borderWidth.strong`), `aria-current="page"`. Disabled (`./checkout.yml` with an empty cart): `opacity.disabled` with tooltip "Your manifest is empty" (wording in `06-ui-specification/`). Accessible name includes the plain meaning ("Menu (./menu.ts)").

### 7.3 Cart button

Icon button (2.2) with `shopping_cart` and count bubble: min 18 px `radius.full`, fill `color.primary.default`, text `color.primary.on`, `typography.micro` weight 700, positioned top-right; hidden at 0; `9+` above 9 (SCR-16 E-09). On change the bubble scales 1 → 1.2 → 1 (`motion.duration.base`; none under reduced motion). Accessible name "Cart, 3 items". Opens SCR-05 (drawer on desktop/tablet, page on phone).

### 7.5 Project Explorer sidebar (customer, desktop)

| Part | Token / rule |
|---|---|
| Container | Width `layout.sidebarWidth` 256 px, fill `color.surface.low`, right border 1 px `color.border.default`, full height under the header, `zIndex.sidebar` |
| Header | `Project Explorer` (`typography.label` `color.text.muted`) + `src/pizza-mxdev/` (`typography.codeSmall` `color.text.secondary`) |
| Item | Height 40 px, padding 0 `space.4`, icon `icon.size.md` + label `typography.body` weight 500 `color.text.secondary`; items: `Root` (`folder`), `Categories` (`list`, expandable to the four category files), `Active_Deployments` (`rocket_launch`); no `Logs` or `Settings` in Lite |
| Tree children | Indent `space.6`, file icons per 7.7, `typography.code` |
| Hover | Fill `color.surface.high`, text `color.text.primary` |
| Active | Fill `color.surface.high`, text and icon `color.primary.light`, 2 px left bar `color.primary.light`, `aria-current="page"` |
| Item visibility | Per `06-ui-specification/navigation-map.md` section 3.2 and SCR-16 E-11 |
| Footer | `New Branch` (`secondary` button, full width) → menu |
| Tablet | Hidden; a `menu` icon button at the left of the header opens it as an overlay drawer from the left (`responsive-behaviour.md` section 2) |
| Phone | Not shown (bottom tabs instead) |

Expandable items use `aria-expanded`; the sidebar is a `nav` landmark labelled "Project Explorer".

### 7.7 File tabs (category tabs)

| Part | Token / rule |
|---|---|
| Bar | Fill `color.surface.container`, bottom 1 px `color.border.default`, height 48 px, horizontal scroll inside the bar on narrow widths (fade 24 px at the overflowing edge) |
| Tab | Padding 0 `space.4`, icon `icon.size.sm` + file name `typography.code`; `color.text.secondary`; right border 1 px `color.border.default` |
| Icons | `pizzas.json` `data_object` · `sides.yml` `description` · `drinks.env` `local_drink` · `desserts.md` `markdown` |
| Active | Fill `color.surface.base` (merges with the content), text `color.primary.light`, 2 px top or bottom indicator `color.primary.light`, live dot `color.success.default` 6 px when the category contains a featured item (decorative) |
| Hover | Text `color.text.primary`, fill `color.surface.high` |
| Close icon | Not shown (tabs cannot be closed; Stitch `×` dropped) |

`tablist` semantics; arrow keys move between tabs; the plain category name is the accessible name ("Pizzas (pizzas.json)"). Used on SCR-02.

### 7.8 Phone bottom tabs

| Part | Token / rule |
|---|---|
| Bar | Height `layout.bottomNavHeight` 64 px + safe-area inset, fill `color.surface.container`, top 1 px `color.border.strong`, `shadow.elevationTop`, `zIndex.bottomNav`, fixed bottom; customer shell on phone only |
| Tabs | Three equal tabs: `Source` (`code`, Menu), `Deploy` (`rocket_launch`, Cart, with count bubble 7.3), `Trace` (`terminal`, Track) — glossary 1.1; no `Env` tab in Lite |
| Tab | Icon `icon.size.lg` over label `typography.label` (no uppercase transform: `Source`), `color.text.muted`; min 44 px high |
| Active | Fill block `color.surface.high` behind icon+label, icon and label `color.primary.light`, `aria-current="page"` |

Accessible names give the plain meaning ("Menu (Source)", "Cart (Deploy), 2 items", "Track order (Trace)"). Home is reached through the logo.

### 7.9 Sticky action bar (phone)

Fixed bottom bar for the page's main action, **above the bottom tabs** (`responsive-behaviour.md` section 2): height 64 px, fill `color.surface.container`, top border `color.border.strong`, `shadow.elevationTop`, padding `space.2` `layout.marginPhone`. Contains a total or status on the left and one `primary` button on the right (min width 50 %).

| Variant | Content | Screens |
|---|---|---|
| Cart summary | `[icon-pizza-module + count] PACKAGE_RESOLVED · $26.58` + `primary` `deploy >` | SCR-02 when the cart is not empty |
| Configurator CTA | Unit price + `primary` `Build & Deploy` | SCR-03 |
| Checkout CTA | `EXEC_TOTAL_OUTPUT` + `primary` `Execute Order --force` | SCR-06 |
| Cart CTA | `EXEC_TOTAL_OUTPUT` + `primary` `PROCEED TO ./checkout.yml` | SCR-05 phone page |

Exact texts per screen file in `06-ui-specification/screens/`.

The page body gets bottom padding equal to the bar height so nothing is hidden behind it.

### 7.10 Footer

Fill `color.surface.container`, top 1 px `color.border.strong`, padding `space.8` `layout.margin*`. Content slots: logo mark `logo-mark.svg` 32 px; store line TXT-NAV-35 (`© {year} Git Pizza MxDev — Mission Kitchen · 2140 Folsom Street, San Francisco, CA 94110 · (415) 555-0142`); version line TXT-NAV-36 (`./git-pizza-mxdev --version 1.0.0`) in `typography.micro` `color.text.muted`; links (`typography.code`, `color.primary.light`, underlined on hover and focus) only to pages of the app as listed in `06-ui-specification/navigation-map.md` section 3.5 (`menu.ts`, `track.log`, `allergens.md`). Stitch's external links `Documentation`, `Source Code`, `Bug Report`, `License` are dropped. Exact texts: TXT-NAV-35 … 39. Desktop one row, tablet two rows, phone stacked and centered, above the bottom tabs.

### 7.11 Demo-mode banner

| Property | Value |
|---|---|
| Position | Top of every page, above the header, sticky with it, `zIndex.demoBanner`, height `layout.demoBannerHeight` 32 px |
| Fill / border | `color.surface.lowest`, bottom 1 px `color.warning.default` |
| Content | `science` icon + `DEMO MODE` label (`typography.label` `color.warning.default`) + text (`typography.bodySmall` `color.text.secondary`; TXT-NAV-28, phone short text TXT-NAV-29, may wrap to two lines); no link (US-004) |
| Behavior | Always visible, not dismissible, on all screens including error pages |

`region` landmark labelled "Demo mode notice".

### 7.13 Error page layout (SCR-40, SCR-41)

Full page in a minimal frame: DEMO MODE banner and logo, no navigation shell (SCR-40, SCR-41). Left/top: large code `404` / `500` in `typography.display` `color.error.default` with `report` icon; dev title (`ERROR 404 // CRUST_NOT_FOUND`) `typography.h1`; plain explanation `typography.bodyLong`; actions `RETURN_TO_MAIN` (`primary`) and, for 500, `RETRY_DEPLOYMENT` (`secondary`). Right/bottom: decorative stack-trace window (5.1) with lines in `color.syntax.error` and comments; illustration from `assets/illustrations/` (`error-crust-not-found.png` for 404, `error-seg-fault.png` for 500; decorative, the page must work without it). Optional falling-code background animation is disabled under reduced motion. The stack trace is decorative (`aria-hidden`) and never shows real error details (glossary 1.8).

---

## 8. Component usage per screen

| Screen | Main components |
|---|---|
| SCR-01 Home | Header, demo banner, sidebar, hero (`primary-hero`, terminal window 5.1, logo), menu item cards (carousel), KPI tiles, pipeline stepper (compact), footer |
| SCR-02 Menu | File tabs, prompt input `search`, menu item cards, side panel "Terminal Debugger" (5.1 + cart lines compact + totals + `primary`), empty state, skeleton, sticky cart bar (phone), bottom tabs |
| SCR-03 Configurator | Product image frame, segmented control (size), radio cards (crust, sauce, cheese), checkboxes (extras), removable-ingredient list (checkbox rows with `Unlink`), tags, allergen info, code block B, totals line, sticky CTA |
| SCR-04 Item info | Modal / bottom sheet, product image frame, code block A, allergen info, quantity stepper, `primary` |
| SCR-05 Cart | Drawer / page, cart lines, quantity stepper, prompt input `coupon`, totals summary, banner (below minimum), empty state, dialog (clear) |
| SCR-06 Checkout | Segmented control (order type, tip), fields, radio cards (payment, test card), map panel (static), totals summary, banners, sticky CTA |
| SCR-07 Payment | Modal / bottom sheet, terminal loader, banner (error), radio cards (method change), buttons |
| SCR-08 Confirmation | Modal (window chrome), copyable values, KPI tiles (ETA, oven, payment), log panel (first lines), `primary-hero` |
| SCR-09 Tracking | Status badge with plain label, pipeline stepper, progress bar, log panel, map panel, totals summary, banners, `danger-outline` rollback + dialog |
| SCR-10 Lookup | Prompt inputs `lookup`, banner (not found) |
| SCR-13 Order detail | Cart lines (read-only), totals summary, data table (status history, payment attempts), copyable value, `secondary` print |
| SCR-16 Customer shell | Demo banner, header, nav links, cart button, sidebar, bottom tabs, footer, toasts, banner (connection lost) |
| SCR-40, SCR-41 | Error page layout |

---

## 9. Differences from Stitch

| Stitch element | Decision | Reason |
|---|---|---|
| Header `Execute Order` button and terminal icon button | Dropped; the header has nav links, search and cart | Not part of SCR-16; checkout is reached through `./checkout.yml` and the cart |
| Green `EXECUTE ORDER` in the menu side panel | `primary` (orange) | Tokens: primary CTA fill is `color.primary.default`; the `success` variant is not used in Lite |
| Primary buttons in `#ffc485` on most screens | `color.primary.default` fill | tokens.md section 9 |
| Green active item in the sidebar and active nav link | `color.primary.light` | tokens.md: `primary.light` = active nav item |
| File tab `×` close icons, `drinks.yml`, `crust_addons.yml` tabs | No close icons; tabs per menu catalog section 1 | Categories are fixed |
| Map with real city map, zoom `+`/`−` | Illustration `map-sf-dark.jpg` with drawn markers, no zoom | No maps API (product brief 3.2) |
| `PULL COURIER`, `IPC CHAT`, `OPEN_SUPPORT_TICKET`, `ATTACH LISTENER` (SMS/Webhook), BLIK payment, SSH keys/OAuth | Dropped | Out of scope (product brief 3.2) |
| Temperatures in °C | °F | US store (product brief 8) |
| Prices in PLN / € | USD per `BR-PRICE-11` | Product brief 8 |
| Status names `INIT_SUCCESS`, `COMPILING_CRUST`, `TESTING`, `PROD_LIVE`, `MERGED_INTO_STOMACH`… | Canonical dev labels of order-lifecycle section 2 | order-lifecycle section 10 |
| `HMR Active`, `Export JSON`, `Tokens: 24 active`, `NETWORK LOAD req/s`, `Cluster MX-US-EAST-1` | Not components; KPI content is defined in `06-ui-specification/` | Fake metrics would look like placeholder content |
| Footer links `Documentation`, `Source Code`, `Bug Report`, `License` | Dropped (7.10) | No target pages |
| UI kit "Brand identity — Wariant 3" and `PIZZA_OS` / `~/pizza-os` texts | Official Pixel Slice logo files only (logo-usage.md) | Owner decision 2026-11-05 |
| Product photos with laptop screens and UI in the background (Stitch menu cards) | Only `assets/products/` photos | imagery.md |
