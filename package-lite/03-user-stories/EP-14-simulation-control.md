# EP-14 — Simulation and demo reset (fixed configuration)

| Epic | Functional area | Screens | MoSCoW | Story range |
|---|---|---|---|---|
| EP-14 | FD-14 Simulation control and demo reset | — (no simulation screen in Lite) | Must | US-265 – US-273 |

**Goal.** In Lite the simulated world runs by itself with fixed parameters: simulated customers order and collect their pickups, every step is logged, old simulated orders are cleaned up, and the demo data is reset at a start with `Simulation.ResetOnStartup = true` and every day at 04:00 store time. There is no panel, no pause and no manual reset.

Fixed values: [lite-configuration.md](../10-simulations/lite-configuration.md) (constants `Simulation.SpeedFactor` and `Simulation.ResetOnStartup`, fixed parameters, server log lines), information model section 7.6 (`SimulationSettings`), order-lifecycle section 7 (durations, speed factor, ETA, tick), BR-ORD-21, BR-ORD-22, BR-DATA-09. Detailed simulation behavior: `10-simulations/`.

| ID | Title | Priority |
|---|---|---|
| US-265 | Order traffic generator | Must |
| US-270 | Reset the demo | Must |
| US-271 | Live log lines for every step | Must |
| US-272 | Simulated pickup arrival | Must |
| US-273 | Housekeeping of old simulated orders | Must |

---

### US-265 Order traffic generator

> As a **guest watching the demo**, I want simulated customers to keep ordering, so that the kitchen, the couriers and the home page KPIs are always busy.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | SIM | — | FD-14 | BR-SIM-*, BR-ORD-03, LITE-CFG-06, LITE-SEC-05 | PR-10 | SIM-05, SIM-01 |

**Acceptance criteria**

1. **Given** the fixed traffic settings (always ON, interval 120 s at 1× with ±20 % jitter, at most 8 open simulated orders; lite-configuration.md section 2), **then** a new simulated order is created about every 120 seconds while fewer than 8 simulated orders are open, and the server log shows one `SPAWN <orderNumber> <DELIVERY|PICKUP> <zip|COUNTER> items=<n>` line for it (LITE-CFG-06).
2. **Given** a simulated order, **then** it has source `SIMULATOR`, a fictional customer from `09-demo-data/simulated-customers.csv` (name, email, phone and, for delivery, that person's address; SIM-05 4.6), 1–4 lines of orderable products with valid configurations, DELIVERY to a ZIP of an active zone or PICKUP, and the same price rules as real orders; an `ORDER_SPAWNED` event is logged (e.g. `Spawned MX-1063 (DELIVERY, 94107, 2 items)`).
3. **Given** 8 simulated orders are open, **then** no new one is created until one finishes (no `SPAWN` line). *(negative)*
5. **Given** a sold-out product or unavailable option (in Lite: Tiramisu Stack, extra EX-09 and the fresh jalapeños of a recipe), **then** it is never used in a simulated order. *(negative)*
8. **Given** speed 10×, **then** the interval is about 12 seconds.
9. **Given** a simulated order, **then** no guest can find or open it (not on SCR-10, not in the home build-status panel); it counts only in the KPIs and in queue positions (LITE-SEC-02, LITE-SEC-05). *(negative)*

**Notes.** The mix of products, order types, payment methods and test cards is defined in `10-simulations/`.

---

### US-270 Reset the demo

> As the **owner**, I want the demo data to be restored to the initial state automatically, so that every test run and every demo day starts from the same, complete dataset.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | SIM | SCR-10, SCR-09 | FD-14 | BR-SIM-*, BR-DATA-09, LITE-CFG-07 | PR-09 | SIM-08 |

**Acceptance criteria**

2. **Given** the app starts with `Simulation.ResetOnStartup = false` and a database that already holds data, **then** no reset runs: orders placed before the restart can still be found on SCR-10. *(negative)*
3. **Given** the app starts with `Simulation.ResetOnStartup = true`, **then** the reset runs before the app accepts requests and all data is restored per BR-DATA-09: seed orders (in every status), 12/5/5/3 products with Tiramisu Stack sold out and `jalapeno` out of stock (BR-DEMO-03a), coupons as in the catalog, couriers CU-01 – CU-05 (CU-05 OFF_DUTY), ovens ONLINE, all zones active, intake OPEN, the simulation running at the speed of `Simulation.SpeedFactor` with traffic ON. The same reset runs at the first start with an empty database and every day at 04:00 `America/Los_Angeles` (A-42).
4. **Then** the server log shows `RESET start by <startup|scheduled|initial-seed>` and `RESET end orders=<n> duration=<s>s` with s ≤ 60 (LITE-CFG-07), and a `RESET` simulation event is recorded with `lastResetAt` and `lastResetBy`.
5. **Given** a guest had a cart or tracked an order before the reset, **then** the cart is empty and the old tracking link shows the invalid-link state of SCR-09 (US-134 AC2). *(negative)*
6. **Given** a guest has a screen open during a scheduled reset, **then** within 5 seconds a toast says that the demo data was reset by the system and the screen shows the reset data.
7. **Given** new orders after the reset, **then** their numbers continue after the highest seed order number.
8. **Given** any screen, URL or endpoint of the app, **then** none of them starts a reset (BR-SIM-41). *(negative)*

---

### US-271 Live log lines for every step

> As a **guest**, I want every step of my order to be written to its log in terminal style, so that the pipeline is transparent.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | SIM | SCR-09 | FD-14 | BR-SIM-*, BR-ORD-02, LITE-CFG-04, LITE-CFG-05, LITE-CFG-08 | PR-02 | SIM-07 |

**Acceptance criteria**

1. **Given** any transition T-01 – T-16, **then** at least the log lines of order-lifecycle section 4 are written with time, level, tag and message, filled with the real values (order number, commit hash, oven code and target temperature (BR-SIM-16a), timer, courier handle, distance, attempt number, reason).
2. **Given** an internal (not customer-visible) line of order-lifecycle section 4 or a `DEBUG` line, **then** it is stored with `isCustomerVisible = false` and never shown on SCR-09. *(negative)*
3. **Given** an order enters OVEN_01 at 1×, **then** the line reads `[OVEN] Entered OVEN_01 at 850°F. Bake timer 01:30.` (the oven's target temperature, BR-SIM-16a, and the effective bake time).
4. **Given** any status change of an order (also of a simulated order) or of a courier, **then** the server log has exactly one INFO line on the log node `Simulation`: `ORDER <orderNumber> <FROM> -> <TO> by <actorName>` or `COURIER <code> <FROM> -> <TO>` (LITE-CFG-04, LITE-CFG-05).
5. **Given** these server log lines, **then** they contain no contact data, address or tracking token (LITE-CFG-08). *(negative)*

---

### US-272 Simulated pickup arrival

> As a **guest who ordered pickup**, I want a simulated customer arrival to complete pickup orders, so that pickup orders finish without anyone operating the store.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | SIM | SCR-09 | FD-14 | BR-SIM-*, BR-ORD-21, LITE-CFG-04 | PR-06 | SIM-06 |

**Acceptance criteria**

1. **Given** 1× (automatic pickup is always on in Lite), **when** a pickup order has been `READY_FOR_PICKUP` for 90 seconds, **then** it becomes `PICKED_UP` with actor `SIMULATOR` (`sim/pickup`), SCR-09 shows `Picked up at HH:mm` (US-132), the server log shows `ORDER <orderNumber> READY_FOR_PICKUP -> PICKED_UP by sim/pickup` (LITE-CFG-04) and a `PICKUP_COMPLETED` event is recorded.
2. **Given** speed 10×, **then** the pickup happens 9 seconds after `READY_FOR_PICKUP`.
3. **Given** a pickup order, **then** the guest cannot mark it picked up; only the simulator does (SIM-06). *(negative)*

---

### US-273 Housekeeping of old simulated orders

> As the **owner**, I want old simulated orders to be removed automatically, so that a demo instance running for weeks stays fast and readable.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | SIM | — | FD-14 | BR-SIM-*, BR-ORD-22 | PR-09 | SIM-08 |

**Acceptance criteria**

1. **Given** simulated orders that reached a final state more than `retentionHours` (default 24) hours ago, **then** within 15 minutes they are deleted together with their lines, modifiers, payment attempts, status history and log, and a `HOUSEKEEPING` simulation event states how many orders and events were removed (SIM-08 section 7).
2. **Given** guest orders of any age, **then** they are never removed by housekeeping (only the demo reset removes them). *(negative)*
3. **Given** simulated orders that are still open, **then** they are never removed. *(negative)*
4. **Given** a housekeeping run that finds nothing to remove, **then** no `HOUSEKEEPING` event is written. *(negative)*

---
