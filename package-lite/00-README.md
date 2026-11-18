# Git Pizza MxDev Lite — Handover Package

![Git Pizza MxDev](assets/brand/logo-horizontal.png)

## 1. What this package is

This package specifies **Git Pizza MxDev Lite**, a demo web app for ordering pizza, themed as a developer's IDE: pizzas are *modules*, the cart is a *manifest*, placing an order is a *deploy*, and order progress is a *CI/CD pipeline*.

Lite is a **guest-only storefront**:

- Every visitor is a guest. There are no user accounts, no sign-in, no sign-up, no customer profile and no staff screens.
- The guest browses the menu, configures pizzas, fills the cart, checks out for delivery or pickup, pays with a simulated payment, and follows the order live until it is delivered or picked up.
- The kitchen, the ovens, the couriers, pickup customers and further order traffic are **simulated in the background** by the Simulator. Nobody operates them. The guest sees their effects: the pipeline of their own order, queue position, bake progress, courier on the map, ETA and the live KPIs on the home page.
- The simulation runs with a **fixed configuration** (`10-simulations/lite-configuration.md`). There is no simulation panel, no pause and no reset button. Two Mendix constants set the speed and a reset at start-up.
- The app runs with Mendix security level **Production**, with the user role `Anonymous` for guests (`04-information-model/information-model.md` sections 2 and 10).
- The app is a **Mendix 11.16.1** project and runs **locally**. There is no public URL.

The package is a **complete functional specification**. It contains no application code. You build the app as one responsive Mendix 11.16.1 web app, from this package alone. The package prescribes no tools and no way of working: any method that produces a valid Mendix 11.16.1 project is allowed, as long as the deliverables (section 8) and the automated tests (section 9) pass.

- Every requirement is meant to be testable. Your delivery is checked by **automated acceptance tests** (section 9). If something is unclear, follow the documented default and record your interpretation in `RUN/delivery-notes.md` (section 8).
- Requirements are functional. How you structure the app in Mendix (modules, domain model, logic, pages, widgets, Marketplace modules) is your decision, except the names that the tests rely on (section 9).
- Names, prices, statuses and texts in this package are binding; consistency between your app and the package is part of the acceptance.

## 2. Scope at a glance

| | In Lite |
|---|---|
| User stories | **111**: 103 Must, 6 Should, 2 Could (`03-user-stories/README.md`) |
| Screens | 14: SCR-01 – SCR-10, SCR-13, SCR-16, SCR-40, SCR-41 (`01-product-brief/ids-and-traceability.md` section 4) |
| User role | `Anonymous` (guest) only; everything else is done by the system |
| Simulations | SIM-01, SIM-02, SIM-04, SIM-05, SIM-06, SIM-07, SIM-08 (seed, scheduled and start-up reset, housekeeping), SIM-09 (speed from a constant) |
| Not in Lite | Accounts, sign-in and sign-up, profile, saved addresses, order history and re-order, the coupon `FIRST_COMMIT`, staff screens (kitchen display, operations, menu, coupon and courier management), the simulation control panel and reset dialog, pausing order intake, oven telemetry (SIM-03), the access-denied page (403) |

Some documents of the package still describe the order state machine, the courier states or rule families in full, because other rules depend on them. Steps and rules that need staff, accounts or the panel are marked **"not used in Lite"**: do not build them.

## 3. Who it is for

| Reader | Start with |
|---|---|
| Project lead / estimator | This README, `01-product-brief/product-brief.md`, `12-acceptance/` |
| Business analyst / functional consultant | `01-product-brief/`, `02-functional-design/`, `03-user-stories/`, `05-processes/` |
| Mendix developer | `04-information-model/`, `02-functional-design/`, `05-processes/order-lifecycle.md`, `10-simulations/` (first `lite-configuration.md`), `09-demo-data/` |
| UI / front-end developer | `06-ui-specification/`, `07-design-system/`, `08-prototype/`, `assets/` |
| Tester | `03-user-stories/`, `12-acceptance/`, `09-demo-data/`, `11-non-functional/` |

## 4. Reading order

1. `00-README.md` (this file)
2. `01-product-brief/product-brief.md` — vision, scope, the guest, constraints, assumptions
3. `01-product-brief/glossary.md` — what every dev metaphor in the UI means
4. `01-product-brief/ids-and-traceability.md` — ID schemes, epics, the screen inventory
5. `04-information-model/information-model.md` — objects, attributes, enumerations, price rules, guest sessions (section 2), access rights (section 10)
6. `05-processes/order-lifecycle.md` — order state machine and simulator timings
7. `10-simulations/lite-configuration.md` — the fixed simulation values, the two constants and the server log lines for the tests
8. `02-functional-design/` — behaviour and business rules per functional area
9. `03-user-stories/` — epics and stories with acceptance criteria
10. `06-ui-specification/` and `08-prototype/` — screens, navigation, texts, clickable prototype
11. `07-design-system/` and `assets/` — tokens, components, logo, icons, images
12. `09-demo-data/` and the rest of `10-simulations/` — seed data and simulation behaviour
13. `11-non-functional/` and `12-acceptance/` — quality requirements, test scenarios, what you deliver

## 5. Folder map

| Folder / file | Contents |
|---|---|
| `00-README.md` | This guide |
| `01-product-brief/` | `product-brief.md` (vision, scope, the guest, constraints, assumptions) · `glossary.md` (dev metaphors ↔ business meaning, domain terms) · `ids-and-traceability.md` (ID register, functional areas, epics, screen inventory, processes, simulations, traceability overview, assumption number blocks) |
| `02-functional-design/` | One file per functional area in Lite (FD-01 – FD-07, FD-09, FD-13, FD-14, FD-15): behaviour, business rules (`BR-…`), validations, messages, edge cases. FD-09, FD-13 and FD-14 keep only their Lite part |
| `03-user-stories/` | Epics and user stories `US-xxx` with Given/When/Then acceptance criteria, MoSCoW priority, links to screens and rules; `traceability-matrix.md` |
| `04-information-model/` | Conceptual object model with ER diagram, enumerations, derived values, price rules (`BR-PRICE`), data rules (`BR-DATA`), guest sessions (`LITE-SES`), access rights (`LITE-SEC`) |
| `05-processes/` | `order-lifecycle.md`: order state machine (`BR-ORD`), cancellation and refund, simulator timings (Mermaid diagrams) · `README.md`: index of the processes in Lite |
| `06-ui-specification/` | Screen-by-screen specification of the 14 screens (elements, states: empty / loading / error), navigation map, responsive behaviour, UI text catalogue (`ui-copy.md`) |
| `07-design-system/` | `tokens.md` + `tokens.json` (colors, type, spacing, radius, glows, breakpoints, z-index, motion), components, icons, imagery, logo usage, accessibility |
| `08-prototype/` | Clickable HTML prototype: `customer/` (guest screens, desktop and phone, shared `customer/_shared/proto.js` and `proto.css`, including the error pages SCR-40 and SCR-41) |
| `09-demo-data/` | `menu-catalog.md` (definitive menu, options, coupons), couriers, ovens, delivery zones, settings, seed orders in every status (Markdown + CSV/JSON) |
| `10-simulations/` | `lite-configuration.md` (fixed values, constants `Simulation.SpeedFactor` and `Simulation.ResetOnStartup`, server log lines `LITE-CFG-…`) · payment, kitchen, courier and delivery, order traffic, pickup, live logs, seed and reset, simulation clock |
| `11-non-functional/` | Performance, refresh latency, security of the demo, accessibility, browsers and devices, Mendix constraints, local operation, logging |
| `12-acceptance/` | End-to-end scenarios (`E2E-xx`), test cases (`TC-xxx`), acceptance checklist, deliverables (`RUN/`) |
| `assets/` | Pixel Slice logo files and favicons, product photos, illustrations, icons, layout references of the Stitch designs (`assets/stitch-reference/`); the one missing image (`illustrations/no-results.png`) and the placeholder rule (`assets/README.md`) |
| `open-questions.md` | Register of every assumption (`A-xx`) with its open question (`OQ-xx`) and its status in Lite |

The Stitch designs the package was derived from are not part of the package; everything you need from them has been carried over into `06`, `07`, `08` and `assets/`. Screenshots of the Stitch screens that the UI specification refers to are included in `assets/stitch-reference/` as **layout references only**: their texts, data and branding are obsolete where they differ from this package.

## 6. Conventions

### 6.1 IDs

All IDs are defined in `01-product-brief/ids-and-traceability.md`. Lite keeps the IDs of the full product: gaps in a numbering (for example SCR-11, US-005 or BR-ORD-19) are intended and are never re-used.

| ID | Meaning | Example |
|---|---|---|
| `FD-xx` | Functional area | `FD-05` Checkout |
| `EP-xx` | Epic (EP-n covers FD-n) | `EP-05` |
| `US-xxx` | User story | `US-091` |
| `BR-<AREA>-xx` | Business rule; a letter suffix marks a Lite addition to a rule | `BR-PRICE-08` sales tax, `BR-SIM-16a` |
| `LITE-CFG-xx`, `LITE-SES-xx`, `LITE-SEC-xx` | Rules that exist only in Lite: simulation configuration and test log lines, guest sessions, access rights | `LITE-CFG-04` |
| `SCR-xx` | Screen, modal, drawer, dialog | `SCR-09` Order tracking |
| `PR-xx` | Process | `PR-02` Order lifecycle |
| `SIM-xx` | Simulation | `SIM-04` Courier and route |
| `NFR-xx` | Non-functional requirement | `NFR-05` |
| `TC-xxx`, `E2E-xx` | Test case, end-to-end scenario | `TC-101`, `E2E-01` |
| `A-xx` | Assumption | `A-04` |
| `TXT-<AREA>-xx` | Visible UI text | `TXT-CART-08` |
| `PZ-`, `SD-`, `DR-`, `DS-` | Products | `PZ-05` Inferno Payload |
| `CR-`, `SA-`, `CH-`, `EX-` | Configurator options | `EX-14` Hot honey drizzle |

### 6.2 Priority (MoSCoW) and requirement wording

| Word | MoSCoW | Meaning for the contractor |
|---|---|---|
| **must** | Must | Mandatory for acceptance |
| **should** | Should | Expected; may be dropped only with a written reason in `RUN/delivery-notes.md` |
| **may** | Could | Optional; implementing it counts in your favor only if all Musts are done |
| — | Won't | Out of scope (`product-brief.md` section 3.2); do not build |

Every user story and business rule carries its priority. A rule without a priority word is a must. A rule marked "not used in Lite" is not built.

### 6.3 Assumptions and open questions

- An assumption is a default chosen on the owner's behalf, marked `A-xx`. Build according to the assumption.
- Each document that adds assumptions owns a fixed block of numbers (`ids-and-traceability.md` section 1.2), so every `A-xx` has exactly one meaning. The product brief (section 9) holds A-01 – A-17.
- Inside documents, assumptions appear as a quote block starting with **Assumption A-xx:**, or as a row of the document's assumption table.
- [`open-questions.md`](open-questions.md) is the complete register: every assumption with its open question (`OQ-xx`) and whether it applies in Lite.

### 6.4 Terms and labels

- Dev labels (`Execute Order --force`, `QUEUED`, `MANIFEST.LOCK`) are shown in the UI; their plain meaning must be available as sub-label, tooltip or accessible name (`glossary.md`).
- Status keys (`OUT_FOR_DELIVERY`) are data values; dev labels (`IN_TRANSIT`) are what users see (`order-lifecycle.md` section 2).
- Money is USD with two decimals and half-up rounding (`BR-PRICE-11`).
- "Customer" in UI texts means the visitor who orders. In Lite this is always a guest.

### 6.5 Precedence when documents disagree

**Visible text:** for any visible text (labels, buttons, messages, toasts, banners, log templates), [`06-ui-specification/ui-copy.md`](06-ui-specification/ui-copy.md) wins over every other document. Other documents refer to texts by their `TXT-…` ID; where they quote a text, the quote is for readability and must match `ui-copy.md`.

**Lite scope:** [`10-simulations/lite-configuration.md`](10-simulations/lite-configuration.md), sections 2 and 10 of [`04-information-model/information-model.md`](04-information-model/information-model.md) and every rule marked "not used in Lite" win over any remaining text that still mentions accounts, staff, a simulation panel, a pause or a value "editable" at run time.

**Behaviour and data:**

1. Foundation files: `information-model.md`, `order-lifecycle.md`, `menu-catalog.md`, `tokens.md`, `ids-and-traceability.md`, `glossary.md`
2. `02-functional-design/`
3. `10-simulations/` (simulation behaviour), `09-demo-data/` (seed content)
4. `03-user-stories/`
5. `06-ui-specification/` (layout, elements, states)
6. `08-prototype/` (visual reference only; it does not define behaviour)

**Quality requirements and tests:** `11-non-functional/` adds measurable qualities and `12-acceptance/` checks the documents above; neither redefines behaviour, data or texts. The expected results of the test cases and scenarios must agree with documents 1–3 of the list above (and with `ui-copy.md` for visible text). If an expected result or a requirement contradicts them, follow the higher document and record the contradiction in `RUN/delivery-notes.md`.

Report every contradiction you find in `RUN/delivery-notes.md`, with the interpretation you chose.

## 7. Using the app in one paragraph

Open the app: you are a guest and can order immediately. There is no login page. Your own orders open from the confirmation, from the tracking link, or with the lookup by order number and email (SCR-10); the seed orders of the demo contact Jordan Lee (`jordan.lee@example.com`) can be found the same way. Details in `product-brief.md` section 7.

## 8. What the contractor delivers

Full requirements and formats are in `12-acceptance/deliverables.md`. The delivery consists of:

| Deliverable | Content |
|---|---|
| Git repository | The Mendix project (Studio Pro 11.16.1) in a Git repository. Commit after every user story with the message `US-xxx: <title>` (title as in `03-user-stories/`). |
| `RUN/journal.md` | Work phases with timestamps, decisions, blockers and interpretations, in the order they happened |
| `RUN/self-assessment.json` | Every Lite user story: `done`, `partial` or `no`, and where it is in the app |
| `RUN/delivery-notes.md` | Studio Pro version, Marketplace modules with versions, mapping of package object names to your entities, deviations, contradictions found, known issues, guest session timeout (LITE-SES-04), duration of the work |
| `RUN/operations.md` | Operations note with the sections of `12-acceptance/deliverables.md` section 6: build and start locally with non-interactive commands, the constants `Simulation.SpeedFactor` and `Simulation.ResetOnStartup`, the server log, the base URL and the screen URL paths, reset and test window, images, limits |
| `RUN/start.ps1`, `RUN/stop.ps1` | Windows PowerShell 5.1 scripts that the automated tests call to build and start the app with given constants and to stop it again (`deliverables.md` section 6.1) |

There is no public URL, no list of demo users and no effort report.

## 9. Automated acceptance tests

The delivery is checked by automated tests that build and start your app locally and use it as a guest. They rely on:

| What | Where it is defined |
|---|---|
| Start and stop without a person: `RUN/start.ps1` (for example `RUN/start.ps1 -SpeedFactor 10 -ResetOnStartup $true`) and `RUN/stop.ps1` | `12-acceptance/deliverables.md` section 6.1 |
| Constants `Simulation.SpeedFactor` (tests run at `10`) and `Simulation.ResetOnStartup` (tests start from the seed with `true`) | `10-simulations/lite-configuration.md` section 1 |
| Guest screens, texts and states | `06-ui-specification/`, `ui-copy.md` |
| Server log lines `ORDER`, `COURIER`, `SPAWN`, `CONFIG`, `RESET` at level INFO on the log node `Simulation` | `10-simulations/lite-configuration.md` section 3 (LITE-CFG-04 – LITE-CFG-08) |
| Seed orders found with the lookup on SCR-10 | `09-demo-data/`, SIM-08 |
| Test cases and scenarios | `12-acceptance/test-scenarios.md` |

Simulated orders are never shown to guests; the tests see them only through the server log and the home page KPIs. The tests run between 02:00 and 24:00 store time (`America/Los_Angeles`, A-31): before 02:00 some seed orders would fall on the previous store day and the KPIs would differ from the expected values. No test runs across the scheduled reset at 04:00 (A-42); a test interrupted by it (server log `RESET start by scheduled`) is repeated after a fresh start and is not counted as failed (`12-acceptance/test-scenarios.md` section 2.1).

## 10. Version

| Version | Date | Change |
|---|---|---|
| Lite 1.0 | 2026-11-07 | Lite package generated from Git Pizza MxDev 0.9: guest-only scope (111 stories), fixed simulation configuration, Production security with the role `Anonymous`, local run on Mendix 11.15.0, deliverables in `RUN/` |
| Lite 1.2 | 2026-11-07 | Platform version changed to Mendix 11.16.1 (Studio Pro 11.16.1) |
