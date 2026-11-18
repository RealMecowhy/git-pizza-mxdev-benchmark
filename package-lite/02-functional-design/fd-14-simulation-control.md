# FD-14 — Simulation configuration and demo reset (Lite)

| Item | Value |
|---|---|
| Epic | EP-14 (US-265, US-270 – US-273; TC-261 – TC-280) |
| Roles | Simulator; System (start-up, scheduled reset, housekeeping) |
| Screens | — (no screen in Lite; effects on SCR-01, SCR-07 – SCR-10, SCR-13) |
| Processes | PR-09 Demo seed, reset and housekeeping, PR-10 Simulated order traffic |
| Simulations | SIM-01 – SIM-09 except SIM-03, in particular SIM-05 Traffic, SIM-08 Seed, reset and housekeeping, SIM-09 Clock |
| Objects | `SimulationSettings`, `SimulationEvent`, `StoreSettings`, and for the reset every object (BR-DATA-09) |
| Rules referenced | BR-ORD-21, BR-ORD-22, BR-DATA-09, order-lifecycle section 7, LITE-CFG-01 – LITE-CFG-08 |
| Priority | Must |

Related: [lite-configuration.md](../10-simulations/lite-configuration.md) (the fixed values, the two constants and the server log lines — **binding for this file**) · [order-lifecycle.md](../05-processes/order-lifecycle.md) section 7 (durations, speed, ETA) · [10-simulations/](../10-simulations/README.md) (what each simulation does in detail) · [SIM-08](../10-simulations/sim-08-demo-reset.md) (seed, reset, housekeeping) · `09-demo-data/` (the seed) · FD-13.

In the full product FD-14 specifies the manager's simulation control panel and the reset dialog. **Lite has neither.** The simulation runs with fixed values; the speed factor and a reset at start-up come from two Mendix constants; the demo is reset only by the system. The panel rules of the full product are not part of Lite; their numbers are gaps. The rules below are the ones that still apply, some of them reworded for Lite.

---

## 1. Purpose

Keep the demo alive and repeatable without anybody operating it: the simulations always run with known values, the speed can be raised for the automated tests, and the demo data returns to the seed on the first start, every night, and whenever the app is started with a reset.

## 2. Actors

| Actor | Does |
|---|---|
| Simulator | Reads the settings at every tick (order-lifecycle 7.4) and writes `SimulationEvent`s and the server log lines of LITE-CFG-04 – LITE-CFG-06 |
| System | Reads the constants at start (LITE-CFG-01, LITE-CFG-07); performs the first-start seed, the start-up reset and the scheduled daily reset (SIM-08 section 2) and housekeeping (BR-SIM-74) |
| Guest | Sees only the effects: KPIs, queue position, ETAs, the reset notice of SIM-08 section 5 |

## 3. Preconditions

`SimulationSettings` and `StoreSettings` exist (singletons). The constants `Simulation.SpeedFactor` and `Simulation.ResetOnStartup` exist in the module `Simulation` (LITE-CFG-01).

## 4. Behaviour

### 4.1 Start of the app

1. The app reads `Simulation.SpeedFactor` and `Simulation.ResetOnStartup` and writes the `CONFIG` server log line (LITE-CFG-07).
2. If `ResetOnStartup = true`, it performs a reset (SIM-08, trigger `startup`) before it accepts requests, also on an empty database. If `ResetOnStartup = false` and the database is empty, it loads the seed (SIM-08, trigger `initial-seed`). Otherwise the data stays as it was.
3. It stores the speed factor in `SimulationSettings.speedFactor` (LITE-CFG-02) and starts the simulator tick.

### 4.2 While the app runs

- Every simulation runs with the fixed values of lite-configuration section 2. Nothing can change them at run time (LITE-CFG-03).
- Every day at 04:00 store time the system performs the scheduled reset (SIM-08, A-42).
- Every 15 minutes (real time) housekeeping runs (BR-SIM-74).

### 4.3 Simulation panel and reset dialog

Not in Lite. There is no screen, button, URL, REST or other endpoint to pause or resume the simulation, change the speed or any other parameter, spawn an order, run a scenario, show the simulation event log or reset the demo (LITE-CFG-03).

## 5. Business rules

| ID | Rule | Priority |
|---|---|---|
| BR-SIM-60 | Not used in Lite (pause and resume). `isPaused` is always `false`. | — |
| BR-SIM-61 | **Speed factor** 1×, 2×, 5×, 10× (`X1` … `X10`) comes from the constant `Simulation.SpeedFactor` and applies from the start of the app (LITE-CFG-01, LITE-CFG-02). It divides every duration of order-lifecycle 7.1 and the traffic interval, per order-lifecycle 7.2. When the app starts with a different factor than before, every running timer keeps the progress it has already made and only the remaining part is scaled (BR-ORD-21). ETAs shown everywhere use the current factor. | Must |
| BR-SIM-62 | **Automatic processing**: `autoAdvanceKitchen`, `autoDispatch` and `autoPickup` are always on (lite-configuration section 2). SIM-02 performs T-08, T-10, T-11/T-12; SIM-04 assigns couriers and hands over (BR-COUR-10); SIM-06 performs T-16. | Must |
| BR-SIM-63 | **Traffic generator** (SIM-05): always on; behaviour, spawn conditions and order composition as in SIM-05 (BR-SIM-28 – BR-SIM-31), with the fixed interval and cap of lite-configuration section 2. Each spawned order writes the `SimulationEvent` `ORDER_SPAWNED` and the server log line `SPAWN` (LITE-CFG-06). | Must |
| BR-SIM-65 | **Failure rates**: `randomPaymentFailurePercent` and `qaFailurePercent` are `0` %. Payments fail only with the failing test cards (`VISA_0002`, `VISA_9995`, `AMEX_0005`; BR-ORD-04); QA never fails, so T-13 does not happen in Lite. | Must |
| BR-SIM-69 | Not used in Lite (display of the paused state; there is no pause). | — |
| BR-SIM-71 | **Reset effects** (SIM-08 sections 3 and 4): BR-DATA-09 is executed as one operation. Afterwards `SimulationSettings` and `StoreSettings` hold the values of lite-configuration section 2 (running, speed from the constant, all switches on, traffic on (A-12), failure rates 0 %, intake `OPEN`), `lastResumedAt` = `lastResetAt` = now, `lastResetBy` per SIM-08 section 2, and the event log starts with one `RESET` event (the seed's `simulation-events.json` is a reference file and is not loaded). The server log shows `RESET start` and `RESET end` (LITE-CFG-07). | Must |
| BR-SIM-73 | **Effect on visitors** (SIM-08 section 5): guest carts are empty; tracking links of deleted orders show the invalid-link state of SCR-09 (BR-TRK-21, TXT-TRK-44 – TXT-TRK-46); visitors whose cart or tracked order disappeared see the reset notice of SIM-08 section 5 once. Open screens update within their normal refresh interval. | Must |
| BR-SIM-74 | **Housekeeping** (SYS) runs exactly as defined in SIM-08 section 7 (binding): every 15 minutes of real time, independent of the speed factor; it removes finished `SIMULATOR` orders and `SimulationEvent`s older than `retentionHours` (24 h), and writes one `HOUSEKEEPING` event only when at least one record was removed. | Must |
| BR-SIM-75 | Starting the app with other constant values never changes an order's status by itself; it only changes what the simulator does from its next tick. | Must |

## 6. Data read and written

| Object | Read | Written |
|---|---|---|
| `SimulationSettings` | all | `speedFactor` (at start), `lastResumedAt`, `lastResetAt`, `lastResetBy`; restored by reset |
| `SimulationEvent` | — | `ORDER_SPAWNED`, `RESET`, `HOUSEKEEPING` (the simulator writes the other types) |
| `StoreSettings` | all | restored by reset |
| All objects | — | deleted and restored by reset (BR-DATA-09) |
| `Order` (+ lines, attempts, history, logs) | — | created by traffic (T-01), deleted by reset and housekeeping |

## 7. States touched

`SpeedFactor` (at start). Orders: created in `PAYMENT_PENDING` by traffic (T-01); deleted by reset and housekeeping. Indirectly every simulator-driven transition depends on the fixed settings.

## 8. Errors and edge cases

| Case | Behaviour | Message |
|---|---|---|
| `Simulation.SpeedFactor` set to 3 | Treated as 1, logged at WARN (lite-configuration section 1) | — |
| App restarted at 10× while an order is 60 s into a 90 s bake at 1× | Progress 2/3 is kept; the remaining third takes `(1 − 2/3) × ceil(90/10)` = 3 s (BR-ORD-21) | — |
| App started with `ResetOnStartup = true` | Reset runs before the first request is accepted; `RESET start by startup` and `RESET end …` in the server log | — |
| First start on an empty database with `ResetOnStartup = true` | The same reset with trigger `startup` (`RESET end orders=0 …`, `lastResetBy` = `SYSTEM (startup)`); `initial-seed` is used only with `ResetOnStartup = false` | — |
| Scheduled reset (04:00) while a guest is on SCR-09 | Runs (A-42); the page shows the invalid-link state of SCR-09 on the next refresh (BR-TRK-21) | TXT-TRK-44 – TXT-TRK-46 |
| Reset while a guest's payment is processing | The sheet closes with the reset notice; the order no longer exists; the cart is empty (SIM-08 section 5) | SIM-08 section 5 |
| Scheduled reset falls due while another reset runs | Skipped (BR-SIM-41) | — |

## 9. Notifications

Reset notice for visitors (SIM-08 section 5). Server log lines `CONFIG`, `SPAWN`, `RESET` (LITE-CFG-06, LITE-CFG-07). `SimulationEvent` records are kept as data; Lite has no screen for them.
