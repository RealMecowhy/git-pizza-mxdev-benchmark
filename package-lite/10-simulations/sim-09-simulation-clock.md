# SIM-09 — Simulation clock: tick and speed factor

| | |
|---|---|
| Drives | The timing of every automatic step of SIM-01, SIM-02, SIM-04, SIM-05, SIM-06 |
| Rules referenced | BR-ORD-21; lifecycle sections 7.1 (durations), 7.2 (speed factor), 7.3 (ETA), 7.4 (tick) |
| Objects | `SimulationSettings` (`isPaused` always false, `lastResumedAt`, `speedFactor`, durations); constant `Simulation.SpeedFactor` ([lite-configuration.md](lite-configuration.md)) |
| Screens | All live guest screens (timers, ETAs, progress) |
| Default | Speed from the constant `SpeedFactor` (default 1×; 10× in the acceptance tests), always running |

---

## 1. Purpose

One clock governs the whole demo. The constant `Simulation.SpeedFactor` makes everything run 2, 5 or 10 times faster (the acceptance tests use 10×) without breaking any order. Lite has no pause.

## 2. Parameters

| Parameter | Values | Default | Who changes it |
|---|---|---|---|
| `speedFactor` | `X1`, `X2`, `X5`, `X10` (shown `1×`, `2×`, `5×`, `10×`) | `X1` | constant `Simulation.SpeedFactor` (1, 2, 5, 10), read at app start (LITE-CFG-02) |
| `isPaused` | false | false | nobody: always false in Lite |
| `lastResumedAt` | DateTime | reset moment | set on reset |
| Tick interval | ≤ 2 s (lifecycle 7.4) | 2 s | fixed |

## 3. Timer semantics

`eff(d) = max(1, ceil(d / factor))` seconds for every duration of lifecycle 7.1 and for the traffic interval (lifecycle 7.2).

All automatic timers follow **one elapsed-preserving model** (BR-ORD-21):

| Item | Rule |
|---|---|
| Timers | payment answer, `paymentFailedTimeout`, `simulatedRetryDelay`, `queueWait`, `bake`, `qa`, `courierToStore`, `handover`, delivery and return trips, `pickupArrival`, traffic spawn |
| Progress | Each timer has a progress `p` (0 – 1). It starts at 0 when the state or phase is entered. While running, `p(now) = p_anchor + (now − anchorAt) / eff(d)`; due when `p ≥ 1`; remaining = `(1 − p) × eff(d)`. Courier `tripProgressPercent` and `routeProgressPercent` are `100 × p` of the trip timer. |
| Re-anchoring | `p_anchor` and `anchorAt` are stored again when the app starts with a different speed factor, so the progress already made is kept. |
| Speed change | Only at app start (LITE-CFG-02). `p` is kept; the new `eff(d)` applies to the remaining part only. Nothing jumps backwards; a higher speed never fires a step early. |

> Examples (1× unless stated): an order 30 s into a 90 s bake (`p = 1/3`) switched to 2× needs `(2/3) × 45 = 30 s` more. An order 60 s into the bake switched to 5× needs `(1/3) × 18 = 6 s` more. A courier at 30 % of a 172 s trip switched to 10× continues from 30 % and needs `0.7 × 18 = 12.6 s` more.

## 4. Speed factor in Lite

| ID | Rule |
|---|---|
| BR-SIM-44 | Not used in Lite: there is no pause (`isPaused` is always false). |
| BR-SIM-45 | Not used in Lite: there is no resume. |
| BR-SIM-46 | **Speed change**: the speed factor comes from the constant `Simulation.SpeedFactor` and changes only with an app restart (LITE-CFG-02). Timers keep their progress; the new value applies to their remaining part (section 3). The server log records the factor at start (LITE-CFG-07). |
| BR-SIM-47 | Not used in Lite: durations are fixed ([lite-configuration.md](lite-configuration.md) section 2). |
| BR-SIM-48 | The simulator tick runs on the server at least every 2 s whether or not anyone is online. Each order makes at most one transition per tick (lifecycle 7.4). An automatic step happens no earlier than its due time and normally within 3 s after it. |

## 5. What the user sees

Countdowns and progress on guest screens (SCR-09 ETA and bake progress, SCR-07 payment progress, the courier marker) run at real time; their values reflect the effective durations. The DEMO MODE banner (TXT-NAV-28 / TXT-NAV-29) does not change with the speed. No screen shows or changes the speed.

## 7. Edge cases

| Case | Expected behaviour |
|---|---|
| Restart from 10× to 1× while orders are mid-bake | The remaining part is scaled up, progress is kept (e.g. 5 s left of 9 s, `p = 4/9` → 50 s left of 90 s). |
| Restart from 1× to 10× with many orders | No step fires early; every remaining part shrinks tenfold. Steps that fall due in the same tick are processed one transition per order per tick; ovens and couriers still respect capacity. |
| Server restart | Progress kept growing with real time during the downtime; on start the tick resumes and steps that fell due during the downtime fire on the next ticks, one transition per order per tick (NFR-08.5). |

## 8. Acceptance checks

| # | Check |
|---|---|
| C1 | At 10×, the delivery order of SIM-04 C1 (94105) completes from payment to `DELIVERED` in 36–60 s. |
| C2 | At 1×, the same order completes in 4.5–6.5 min. |
| C3 | The server log shows `CONFIG SpeedFactor=10 ResetOnStartup=true` at start when the app runs with these constants (LITE-CFG-07). |
| C4 | No screen offers pause, resume, speed or any other simulation control. |
