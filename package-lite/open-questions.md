# Open Questions and Assumption Register

This file is the single register of all assumptions (`A-xx`) in the handover package and of the open question (`OQ-xx`) that belongs to each one. An assumption is a default chosen on the owner's behalf where the source material left a gap. **Contractors build according to the default** of every assumption that applies in Lite.

Lite keeps the numbering of the full product. Assumptions about accounts, staff, the simulation panel or the intake pause are marked **not used in Lite**: they describe features that Lite does not have, and nothing is built for them.

How to read the table:

| Column | Meaning |
|---|---|
| OQ | Open question number for the owner (one per assumption) |
| Assumption | The assumption ID. Numbers come from fixed blocks per document ([ids-and-traceability.md](01-product-brief/ids-and-traceability.md) section 1.2) and have exactly one meaning |
| Default chosen | The default that applies now (short form; the full text is in the defining document), adjusted to Lite where needed |
| Defined in | The document that defines the assumption |
| In Lite | `applies`, `applies (Lite)` when the default was adjusted to Lite, or `not used in Lite` |
| Decision | `open` = the default applies and the owner has not confirmed it yet; `confirmed` = the owner accepted the default; otherwise the owner's decision |

Contractors cite assumptions by their `A-xx` ID in `RUN/delivery-notes.md`. If a contractor finds a gap that no assumption covers, they choose a sensible default and describe it in `RUN/delivery-notes.md` and `RUN/journal.md`.

## Register

| OQ | Assumption | Default chosen | Defined in | In Lite | Decision |
|---|---|---|---|---|---|
| OQ-01 | A-01 | One fictional store: Git Pizza MxDev — Mission Kitchen, 2140 Folsom Street, San Francisco, CA 94110. Delivery to 8 San Francisco ZIP codes (list in `04-information-model/information-model.md` section 7.8). | Product brief §9 | applies | open |
| OQ-02 | A-02 | Sales tax 8.625 % on subtotal minus discount; delivery fee and tip are not taxed. Prices on the menu exclude tax. | Product brief §9 | applies | open |
| OQ-03 | A-03 | Delivery fee $3.99, free from a $40.00 subtotal; minimum delivery subtotal $15.00; no minimum for pickup. | Product brief §9 | applies | open |
| OQ-04 | A-04 | Demo time is compressed (seconds instead of minutes); ETAs reflect the compressed time. | Product brief §9 | applies | open |
| OQ-05 | A-05 | Tip is offered for delivery only (0/10/15/20 % of subtotal minus discount), default 15 %. | Product brief §9 | applies | open |
| OQ-06 | A-06 | Payment methods: Card, Apple Pay, Google Pay — all simulated. Card payment uses a choice of five demo test cards with fixed outcomes; no card number field exists. No cash payment. | Product brief §9 | applies | open |
| OQ-07 | A-07 | Dine-in is out of scope. | Product brief §9 | applies | open |
| OQ-08 | A-08 | No opening hours; the store is always open. Lite has no intake pause. | Product brief §9 | applies (Lite) | open |
| OQ-09 | A-09 | Sign up (name, email, phone, password). | Product brief §9 | not used in Lite (no accounts) | — |
| OQ-10 | A-10 | Reward pixels and ranks are display only. | Product brief §9 | not used in Lite (no profile) | — |
| OQ-11 | A-11 | One shared demo dataset for all visitors; a reset by the system affects everyone. Guest carts are per browser session. | Product brief §9 | applies (Lite) | open |
| OQ-12 | A-12 | The traffic generator is always ON (one order about every 120 s at 1×, at most 8 open simulated orders). | Product brief §9 | applies (Lite: fixed, `10-simulations/lite-configuration.md`) | open |
| OQ-13 | A-13 | Kitchen staff cannot cancel orders; only managers can. | Product brief §9 | not used in Lite (no staff; the guest's cancel window is A-17) | — |
| OQ-14 | A-14 | Product photos and illustrations are supplied by the owner in `assets/`; a missing file shows a placeholder. | Product brief §9 | applies | **Resolved 2026-11-05:** all 25 product photos and the illustrations are present; only `illustrations/no-results.png` is still missing and shows the placeholder |
| OQ-15 | A-15 | Long body text (product descriptions, hero paragraph) uses the Geist font as in the Stitch screens; everything else uses JetBrains Mono. | Product brief §9 | applies | open |
| OQ-16 | A-16 | Finished simulated orders older than `retentionHours` (24 hours) are removed automatically; guest orders stay until a demo reset. | Product brief §9 | applies (Lite) | open |
| OQ-17 | A-17 | The guest's cancel window is the QUEUED state only (plus PAYMENT_FAILED); it closes when baking starts. | Product brief §9 | applies | open |
| OQ-18 | A-18 | Staff accounts cannot place orders; customer pages are browse-only for them. | FD-01 | not used in Lite (no staff) | — |
| OQ-19 | A-19 | Drinks show caffeine content; the contractor adds an optional caffeine attribute (mg) to drink products. | FD-02 | applies | open |
| OQ-20 | A-20 | The cart shows delivery fee and tax as "calculated at checkout" (cart total = subtotal − discount) and remembers the order type last chosen at checkout (default DELIVERY) only for the coupon rule "delivery only" and the delivery hints. | FD-04 | applies | open |
| OQ-21 | A-21 | Checkout pre-selects Card with test card `Visa •••• 4242`. | FD-05 | applies | open |
| OQ-22 | A-22 | The payment sheet can be closed in the failure state; the order stays `PAYMENT_FAILED` and is resumed from SCR-09. | FD-06 | applies | open |
| OQ-23 | A-23 | A guest browser session may open every order placed or looked up in that session; the tracking link works anywhere. | FD-07 | applies (information model LITE-SES-03) | open |
| OQ-24 | A-24 | Guest lookup: max 5 failed attempts per 10 minutes per session. | FD-07 | applies | open |
| OQ-25 | A-25 | Sign up has no username field; the username is generated from the email. | FD-08 | not used in Lite (no accounts) | — |
| OQ-26 | A-26 | Re-order skips lines whose exact configuration is no longer available. | FD-09 | not used in Lite (no re-order) | — |
| OQ-27 | A-27 | The manager can upload product images at runtime. | FD-12 | not used in Lite (no menu management) | — |
| OQ-28 | A-28 | Store fees, tax rate and delivery-zone activity are editable on the simulation panel. | FD-14 | not used in Lite (values fixed in the seed) | — |
| OQ-29 | A-29 | Demo reset is confirmed by typing `RESET`. | FD-14 | not used in Lite (no reset dialog; reset by the system only) | — |
| OQ-30 | A-30 | Couriers are never deleted; they are set off duty. | FD-13 | not used in Lite (no courier management; `CU-05` stays off duty) | — |
| OQ-31 | A-31 | If a reset happens shortly after midnight store time, some `T-` orders fall on the previous calendar date and are then not counted as "today" (home KPIs). This is accepted; demos and acceptance tests are run between 02:00 and 24:00 store time. | 09-demo-data README §9 | applies (`00-README.md` section 9) | open |
| OQ-32 | A-32 | The demo customer has 17 completed orders over about four months (rank Senior Crust Architect). | 09-demo-data README §9 | not used in Lite (the seed orders of Jordan Lee are guest orders without a profile) | — |
| OQ-33 | A-33 | A demo reset reloads the seed orders as well (BR-DEMO-03), so the store is never empty after a reset. | 09-demo-data README §9 | applies | open |
| OQ-34 | A-34 | The menu catalog gives no short description, version tag or image alt text for sides, drinks and desserts. `09-demo-data/` defines them (`menu-items.json`); they follow the catalog's descriptions. | 09-demo-data README §9 | applies | open |
| OQ-35 | A-41 | A failed delivery is a hold at the door plus a manager decision. | SIM-04 | not used in Lite (no failed-delivery scenario) | — |
| OQ-36 | A-42 | Scheduled demo reset every day at 04:00 store time, not configurable. | SIM-08 | applies | open |
| OQ-37 | A-50 | Evaluation period of a running instance at a public URL. | NFR | not used in Lite (the app runs locally) | — |
| OQ-38 | A-51 | A Mendix Cloud Free App is acceptable as the evaluation environment. | NFR | not used in Lite (the app runs locally) | — |
| OQ-39 | A-52 | Response times are measured on a warm environment, RTT ≤ 150 ms, with the desktop and phone profiles of `11-non-functional/requirements.md` section 5.2. | NFR (NFR-05) | applies | open |
| OQ-40 | A-53 | Sessions stay alive while any tab of the app is open; they may expire only after the browser is closed (≥ 10 minutes of inactivity). | NFR | applies (information model LITE-SES-04) | open |
| OQ-41 | A-55 | The verdict thresholds of `12-acceptance/README.md` are defaults chosen on the owner's behalf. | 12-acceptance README §5 | applies | open |
| OQ-42 | A-60 | Staff may preview the storefront but cannot order. | UI specification README | not used in Lite (no staff) | — |
| OQ-43 | A-61 | The header has no separate "Execute Order" button (the Stitch header button duplicated checkout); checkout is reached through `./checkout.yml`, the cart and the Terminal Debugger panel. | UI specification README | applies | open |
| OQ-44 | A-64 | A customer who signs in returns to the page they came from. | UI specification README | not used in Lite (no login) | — |
| OQ-45 | A-65 | The email address of an account is read-only on the profile. | UI specification README | not used in Lite (no accounts) | — |
| OQ-46 | A-66 | Sign-up password rule. | UI specification README | not used in Lite (no accounts) | — |
| OQ-47 | A-67 | An address outside the delivery zone can be saved to a profile with a warning. | UI specification README | not used in Lite (no saved addresses) | — |
| OQ-48 | A-68 | Pausing intake asks for confirmation and an optional staff-only reason. | UI specification README | not used in Lite (no intake pause) | — |
| OQ-49 | A-69 | Fail QA (remake) requires choosing a reason from a fixed list. | UI specification README | not used in Lite (no kitchen display; QA never fails) | — |
| OQ-50 | A-72 | Guest log views show customer-visible lines only. | UI specification README | applies (Lite: the kitchen log part is not used) | open |
| OQ-51 | A-73 | The home page KPIs are real demo numbers (deploys today, average pipeline time today, kitchen load, couriers on duty), not the invented Stitch figures (`99.9% uptime`, `12k+ nodes`). | UI specification README | applies (Lite: `KITCHEN_LOAD` instead of ovens online) | open |
| OQ-52 | A-74 | The order confirmation cannot name the oven yet (an oven is assigned only when baking starts, BR-ORD-11); it shows "assigned when baking starts" instead. | UI specification README | applies | open |
| OQ-53 | A-75 | `SPAWN ORDER NOW` on the simulation panel. | UI specification README | not used in Lite (no panel) | — |
| OQ-54 | A-77 | Kitchen screens show the customer as first name + last initial. | UI specification README | not used in Lite (no kitchen screens) | — |
| OQ-55 | A-78 | Re-run build uses today's menu and prices. | UI specification README | not used in Lite (no re-order) | — |
| OQ-56 | A-80 | The 30-item limit per order is enforced already in the cart. | User stories README §7 | applies | open |
| OQ-57 | A-81 | Definitions of the operations KPIs on the manager's dashboard. | User stories README §7 | not used in Lite (no operations dashboard) | — |
| OQ-58 | A-90 | Log timestamps and code comments keep `#6e6e6e` as defined in tokens.md and are treated as decorative. If the owner prefers strict AA for all visible text, `color.log.timestamp` and `color.syntax.comment` change to `#a28d79` (6.09 : 1 on `surface.lowest`); no other change is needed. | accessibility.md | applies | open |
| OQ-59 | A-91 | tokens.md marks `motion.duration.blink` and `motion.duration.pulse` as infinite. To meet WCAG 2.2.2 without a pause control, these animations run in bursts of at most 5 s. Visually the screens look the same at load and after every change. | accessibility.md | applies | open |
