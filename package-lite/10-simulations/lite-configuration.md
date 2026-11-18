# Simulation configuration (Lite)

Git Pizza MxDev Lite has **no simulation control panel** and no staff. The kitchen, the couriers, pickup customers and the order traffic are run by the Simulator only, with **fixed parameters**. This file is the single source of those values and says where they live in the Mendix app. The behaviour of each simulation is in its own file (SIM-01 … SIM-09); where a simulation file mentions a switch, a range or a value "editable on" a screen, this file wins: the value is fixed.

Related: [README.md](README.md) (overview), [../09-demo-data/simulation-settings.json](../09-demo-data/simulation-settings.json) and [../09-demo-data/store-settings.json](../09-demo-data/store-settings.json) (seed values), [../05-processes/order-lifecycle.md](../05-processes/order-lifecycle.md) section 7 (durations and speed factor).

---

## 1. Constants (set per environment, read at app start)

Two values must be changeable without changing the model, because the automated acceptance tests set them. They are Mendix **constants** with exactly these names:

| Constant | Type | Default | Allowed values | Meaning |
|---|---|---|---|---|
| `Simulation.SpeedFactor` | Integer | `1` | `1`, `2`, `5`, `10` | Speed factor of the simulation clock (SIM-09). Any other value is treated as `1` and logged at WARN as `CONFIG invalid SpeedFactor=<value>, using 1`. The acceptance tests run at `10`. |
| `Simulation.ResetOnStartup` | Boolean | `false` | `true`, `false` | When `true`, the app performs the demo reset (SIM-08) once at every start, before the simulator tick starts, also on an empty database. When `false`, the app loads the seed only if the database is empty. Used by the acceptance tests to start from the seed. |

| ID | Rule |
|---|---|
| LITE-CFG-01 | The module that holds the two constants is named `Simulation`. The constants are read when the app starts; changing them takes effect after a restart. |
| LITE-CFG-02 | On start the app stores the speed factor in `SimulationSettings.speedFactor` (`X1`, `X2`, `X5`, `X10`). If it differs from the stored value, running timers keep their progress and the new factor applies to their remaining part (SIM-09 section 3). |
| LITE-CFG-03 | There is no screen, button, URL, REST or other endpoint that changes the speed, pauses the simulation, spawns orders or resets the demo. |

## 2. Fixed values

Seeded into `SimulationSettings` and `StoreSettings` from `09-demo-data/` at the first start and at every reset. No screen in Lite shows or changes them. Seconds are at speed 1× and are scaled by the speed factor (`eff(x) = max(1, ceil(x / factor))`).

| Area | Parameter | Value in Lite | Used by |
|---|---|---|---|
| Clock | `isPaused` | always `false`: Lite has no pause | SIM-09 |
| Clock | tick interval | ≤ 2 s (real time) | SIM-09 |
| Switches | `autoAdvanceKitchen`, `autoDispatch`, `autoPickup`, `trafficEnabled` | always `true` | SIM-02, SIM-04, SIM-06, SIM-05 |
| Payment | `paymentProcessing` / `paymentTimeout` | 3 s / 10 s | SIM-01 |
| Payment | `paymentFailedTimeout` / `simulatedRetryDelay` | 600 s / 15 s | SIM-01 |
| Failures | `randomPaymentFailurePercent`, `qaFailurePercent` | `0` %: payments fail only with the failing test cards; QA never fails | SIM-01, SIM-02 |
| Kitchen | `queueWait` / `bake` / `qa` | 20 s / 90 s / 30 s | SIM-02 |
| Kitchen | ovens | `OVEN_01` (850 °F) and `OVEN_02` (780 °F), both `ONLINE`, 3 slots each (`09-demo-data/ovens.json`) | SIM-02 |
| Couriers | `courierToStore` / `handover` | 30 s / 5 s | SIM-04 |
| Couriers | delivery trip | `travelBase` 60 s + `travelPerMile` 40 s × miles | SIM-04 |
| Couriers | fleet | `CU-01` … `CU-04` on duty; `CU-05` always `OFF_DUTY` | SIM-04 |
| Pickup | `pickupArrival` | 90 s | SIM-06 |
| Traffic | `trafficIntervalSeconds` / jitter | 120 s / ±20 % | SIM-05 |
| Traffic | `trafficMaxActiveOrders` | 8 open simulated orders | SIM-05 |
| Store | `intakeStatus` | always `OPEN`: Lite has no intake pause | all |
| Housekeeping | `retentionHours` | 24 h; housekeeping every 15 min (real time) | SIM-08 |
| Reset | scheduled reset | every day at 04:00 `America/Los_Angeles` (A-42) | SIM-08 |

## 3. Evidence for the automated tests

The guest sees the effects of the simulations, not the simulations themselves. Simulated orders (SIM-05) are never shown to guests. The tests therefore read three sources:

| Source | What it proves |
|---|---|
| Guest screens | Own order: stage, timestamps of the log lines on SCR-09 (`[HH:mm:ss]`, SIM-07), bake progress, queue position (SCR-08, SCR-09), ETA, courier card and map (SIM-04), pickup (SIM-06). Home page KPIs (SCR-01, US-023) change as simulated orders finish. |
| Server log | One INFO line per event below, written on the log node `Simulation`. |
| Seed lookup | Seed orders can be found on SCR-10 by order number and contact email (SIM-08). |

### 3.1 Server log lines (log node `Simulation`, level INFO)

| ID | Rule |
|---|---|
| LITE-CFG-04 | For every order status change, exactly one INFO line on the log node `Simulation`: `ORDER <orderNumber> <FROM> -> <TO> by <actorName>`, e.g. `ORDER MX-1063 PAYMENT_PENDING -> QUEUED by sim/payment-gateway`. `<actorName>` is the actor name of the status change (README section 4; `guest` for a guest). For the creation of an order (T-01) `<FROM>` is `NEW`, e.g. `ORDER MX-1063 NEW -> PAYMENT_PENDING by sim/traffic`. |
| LITE-CFG-05 | For every courier status change, exactly one INFO line: `COURIER <code> <FROM> -> <TO>` plus ` order=<orderNumber>` whenever the courier has an order (`currentOrder`) after the change, that is in `TO_STORE`, `AT_STORE`, `DELIVERING` and `RETURNING` (the courier keeps the delivered order until it is `AVAILABLE` again, SIM-04 4.5). One line per transition, e.g. `COURIER CU-01 AVAILABLE -> TO_STORE order=MX-1063`, `COURIER CU-01 TO_STORE -> AT_STORE order=MX-1063`, `COURIER CU-01 AT_STORE -> DELIVERING order=MX-1063`, `COURIER CU-01 DELIVERING -> RETURNING order=MX-1063`, `COURIER CU-01 RETURNING -> AVAILABLE` (no ` order=`). |
| LITE-CFG-06 | For every order created by the traffic generator, one INFO line: `SPAWN <orderNumber> <DELIVERY|PICKUP> <zip|COUNTER> items=<n>`, e.g. `SPAWN MX-1063 DELIVERY 94107 items=4`. |
| LITE-CFG-07 | At start, one INFO line with the constants: `CONFIG SpeedFactor=<n> ResetOnStartup=<true|false>`, where `<n>` is the speed factor the app actually uses (`1` after an invalid value and its WARN line, section 1). Each reset writes `RESET start by <trigger>` and `RESET end orders=<n> duration=<s>s`, where `<n>` is the number of orders deleted by this reset (`0` for `initial-seed`) and `<s>` the duration in whole seconds. Trigger: `startup` at every start with `ResetOnStartup = true`, also on an empty database; `scheduled` for the daily reset at 04:00; `initial-seed` only at a start with `ResetOnStartup = false` on an empty database (SIM-08 section 2). |
| LITE-CFG-08 | These lines contain no contact data, addresses or tracking tokens (NFR-19.3). Everything else the simulator logs is at DEBUG or lower (NFR-19.5). |

## 4. What is not in Lite

The simulation control panel (SCR-32), the reset dialog (SCR-33), oven telemetry (SIM-03), manual kitchen, courier and pickup actions, the failed-delivery scenario, the scenarios of the panel (`sim spawn`, `--rush`, `--card`, fleet commands), pause and resume, and every change of a parameter at run time. Rules of the main package that describe them are removed or marked "not used in Lite" in the simulation files.
