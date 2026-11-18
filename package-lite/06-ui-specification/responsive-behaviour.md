# Responsive Behaviour

Git Pizza MxDev is **one responsive web app**. The Stitch mobile screens are the phone layout of the same screens, not a separate app. This file defines what changes per breakpoint, globally and per screen. Token values are in [../07-design-system/tokens.md](../07-design-system/tokens.md) sections 3 and 5.

## 1. Breakpoints (from `tokens.md`)

| Token | Range | Reference width | Test widths |
|---|---|---|---|
| `breakpoint.phone` | 0 – 767 px | 390 px | 360, 390, 430 |
| `breakpoint.tablet` | 768 – 1199 px | 834 px | 768, 834, 1024 |
| `breakpoint.desktop` | ≥ 1200 px | 1280 – 1440 px | 1280, 1440 |
| `breakpoint.wide` | ≥ 1440 px | — | 1920 (content max width 1280 px, centered) |

Rules for all widths ≥ 320 px:

- No horizontal page scrolling, except inside explicitly scrollable regions: tables (SCR-13 status history and payment attempts), code blocks and log panes (long lines wrap in log panes; code blocks may scroll horizontally).
- Touch targets ≥ 44 × 44 px below 1200 px (`layout.touchTargetMin`).
- Text zoom to 200 % keeps all content and functions available.
- Orientation is not locked; landscape phone uses the phone layout unless the width is ≥ 768 px.
- The layout switches by viewport width only, never by device detection.

## 2. Global changes per breakpoint

| Aspect | Desktop ≥ 1200 | Tablet 768 – 1199 | Phone ≤ 767 |
|---|---|---|---|
| Page margins | 64 px | 32 px | 16 px |
| DEMO MODE banner | full text TXT-NAV-28, 32 px | full text | short text TXT-NAV-29, may wrap to 2 lines |
| Header height | 72 px | 72 px | 56 px |
| Customer header content | horizontal logo, 4 nav links, search input, cart | horizontal logo, 4 nav links, search icon, cart | logo mark, cart |
| Customer sidebar (Project Explorer) | visible, 256 px | hidden; reachable via a `menu` icon at the left of the header that opens it as an overlay drawer | not shown; replaced by bottom tabs |
| Customer bottom tabs | — | — | 3 tabs (`Source`, `Deploy`, `Trace`), visible on all customer screens except modals/sheets |
| Footer | one row | two rows | stacked, centered |
| Modal (SCR-04, SCR-08) | centered, max 640 px wide | centered, max 640 px | full-screen page with a top bar (title + close/back) — SCR-04, SCR-07 and dialogs: bottom sheet |
| Drawer (SCR-05 cart) | from the right, 480 px | from the right, 480 px | full page (`Deploy` tab) |
| Dialog (confirmations) | centered, max 480 px | centered | bottom sheet, full width, max 90 % height |
| Toasts | top right under the header, 360 px wide | top right under the header | top center under the header, full width minus 32 px (BR-ERR-08) |
| Primary CTA on long forms (SCR-03, SCR-06) | inside the right summary column (sticky) | at the end of the summary column | sticky bottom bar (64 px, `shadow.elevationTop`) with total + CTA, above the bottom tabs |
| Tables | full table | full table, horizontal scroll inside the table container, first column sticky | each row becomes a card (label : value pairs), actions at the bottom of the card |
| Terminal / log panes | fixed height with internal scroll (see screens) | same | collapsible section, collapsed to the last 5 lines with `Show more` |
| Typography | `tokens.md` desktop sizes | desktop sizes | phone sizes from `tokens.md` section 2 |

## 3. Per screen

| Screen | Desktop ≥ 1200 | Tablet 768 – 1199 | Phone ≤ 767 (Stitch phone reference) |
|---|---|---|---|
| SCR-01 Home | sidebar; hero centered; terminal 600 px; featured carousel shows 1 large card + 2 small cards (as Stitch); KPI row 4 columns; live build block full width | no sidebar; carousel 2 cards; KPI 2 × 2 | hero text left-aligned; terminal full width; CTAs stacked full width; carousel 1 card with swipe and dots; KPI 2 × 2; live build block stacked (no Stitch phone design; follow `menu-mobile` patterns) |
| SCR-02 Menu | sidebar + content + Terminal Debugger panel 320 px; grid 2 columns (3 columns ≥ 1440 px) | no Terminal Debugger panel; grid 2 columns; category tabs scroll horizontally | single column of cards (`mobile/menu-mobile.jpg`); search field at the top with category file tabs below (horizontal scroll); sticky summary bar above the bottom tabs when the cart is not empty: `PACKAGE_RESOLVED ({n} deps)` · subtotal · `deploy >` → SCR-05 |
| SCR-03 Configurator | two columns: options (60 %) and sticky summary with `manifest.json`, price, CTA (40 %) | two columns 55/45 | one column (`mobile/configurator-mobile.jpg`): back arrow + title bar, product header, sections in order size → crust → sauce → cheese → default recipe → extras (SCR-03 R2) → `manifest.json` (collapsible, collapsed by default) → price breakdown; sticky bottom bar with line total and `Build & Deploy` |
| SCR-04 Item info | modal 640 px, image left 240 px, details right | modal, image on top | bottom sheet up to 90 % height, image 160 px on top, sticky add bar |
| SCR-05 Cart | drawer 480 px from the right over the page | drawer 480 px | full page; coupon field and totals below the lines; sticky bar with `EXEC_TOTAL_OUTPUT` + `PROCEED TO ./checkout.yml` |
| SCR-06 Checkout | sidebar + two columns: form (method, destination, contact, payment, tip) and summary column (manifest, totals, ETA, CTA, map preview) | one form column, summary below; map below destination | one column (`mobile/checkout-payment-mobile.jpg`): map preview card, method toggle, `.env` fields, payment, manifest summary, totals; sticky bottom bar with `EXEC_TOTAL` + `Execute Order --force` |
| SCR-07 Payment sheet | centered modal 560 px | same | bottom sheet, full width |
| SCR-08 Confirmation | modal 640 px over a dimmed page with grid background | same | full-screen page; buttons stacked full width at the bottom |
| SCR-09 Tracking | sidebar; header row; left column 60 %: stepper, log; right column 40 %: map + ETA, order configuration, rollback | stepper full width (horizontal), then map, then log, then order configuration | (`mobile/delivery-status-mobile.jpg`) status chip line, map card with courier card and ETA overlay, vertical stepper "Execution Graph · Stage n/5", log collapsible (`stdout --tail`), order configuration, rollback block at the end |
| SCR-10 Lookup | centered card 480 px | same | full width form |
| SCR-13 Order detail | sidebar; two columns: lines + totals, payment + destination + history | one column | one column |
| SCR-16 Customer shell | see section 2 | see section 2 | see section 2 |
| SCR-40, SCR-41 | centered content max 960 px: logo, error title, stack trace panel, buttons, status strip | same | stack trace panel collapsed to 3 lines; buttons stacked full width |

## 4. Behavior that must not change between breakpoints

- Every function available on desktop is also available on phone and tablet (only its place changes). Exception: none.
- Texts are the same at all widths except the short DEMO MODE banner (TXT-NAV-29).
- Live refresh, validations, totals and states are identical at all widths.
- The cart content is the same whether shown as drawer (desktop/tablet) or page (phone); resizing the window keeps the cart, form input and the selected tab.
