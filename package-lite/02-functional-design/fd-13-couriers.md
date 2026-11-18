# FD-13 — Automatic courier dispatch (Lite)

| Item | Value |
|---|---|
| Epic | EP-13 (US-247; TC-241 – TC-260) |
| Roles | Simulator (SIM-04) |
| Screens | — (effects on SCR-09 courier card and map, SCR-01 KPI `COURIERS_ON_DUTY`) |
| Processes | PR-05 Dispatch and delivery |
| Simulations | SIM-04 Courier dispatch and route, SIM-09 |
| Objects | `Courier`, `Order`, `OrderStatusChange`, `OrderLogEntry`, `SimulationEvent` |
| Rules referenced | BR-ORD-15, BR-ORD-16, BR-ORD-21, order-lifecycle section 8 (courier state machine), section 7.1 (trip durations), SIM-04 BR-SIM-23 – BR-SIM-27 |
| Priority | Must |

Related: [order-lifecycle.md](../05-processes/order-lifecycle.md) section 8 · information model 7.1, 7.8 · [SIM-04](../10-simulations/sim-04-courier-dispatch-and-route.md) (step-by-step behaviour) · [lite-configuration.md](../10-simulations/lite-configuration.md) (fixed values) · FD-07 (what the guest sees).

In the full product FD-13 is the manager's courier management (SCR-30 courier list, SCR-31 assign dialog, duty switch, add and edit couriers). **Lite has no manager and no courier screens: couriers are dispatched and moved only by the Simulator.** This file keeps the rules that still apply; the others are marked "not used in Lite".

---

## 1. Purpose

Deliver every delivery order automatically: assign a free courier as soon as the order is packed, move the courier to the store, hand the order over, drive it to the guest along the simulated route, and bring the courier back.

## 2. Actors

| Actor | Does |
|---|---|
| Simulator (SIM-04) | Assigns couriers (BR-ORD-16), moves them through their trips, hands over (T-14) and completes deliveries (T-15) |
| Guest | Sees the courier card, the map and the ETA of their own delivery order on SCR-09 (FD-07) |

## 3. Preconditions

The five seed couriers exist (information model 7.8). `CU-01` – `CU-04` are on duty; `CU-05` is always `OFF_DUTY` (lite-configuration section 2). `autoDispatch` is always on.

## 4. Behaviour

1. An order enters `READY_FOR_DISPATCH` (T-11), or a courier becomes `AVAILABLE` while orders wait.
2. The Simulator assigns the courier that has been `AVAILABLE` longest to the waiting order with the oldest `readyAt` (BR-ORD-16); the courier becomes `TO_STORE`.
3. After `courierToStore` the courier is `AT_STORE`; after `handover` the Simulator performs T-14 and the courier becomes `DELIVERING`.
4. The route progress rises over the trip time; at 100 % the Simulator performs T-15 (`DELIVERED`) and the courier becomes `RETURNING`, then `AVAILABLE` after the return trip (as long as the delivery trip of that order). The courier keeps the delivered order as `currentOrder` until it is `AVAILABLE` (SIM-04 4.5).

Every step writes the log lines of order-lifecycle section 4 and SIM-07, and one server log line per courier status change (LITE-CFG-05). Details: SIM-04.

## 5. Business rules

| ID | Rule | Priority |
|---|---|---|
| BR-COUR-01 – BR-COUR-09 | Not used in Lite (courier screens SCR-30 and SCR-31, duty switch, manual assignment and reassignment). | — |
| BR-COUR-10 | `autoDispatch` is always on: the Simulator assigns couriers per BR-ORD-16 (longest-available courier to the oldest waiting order) and hands over after `handover` (T-14). There is no manual assignment and no manual handover in Lite. | Must |
| BR-COUR-11 | Courier movement is always simulated: TO_STORE → AT_STORE after `courierToStore`; DELIVERING progress drives `routeProgressPercent` over the trip time `travelBase + travelPerMile × distanceMiles`; T-15 at 100 %; RETURNING for the same trip time, then AVAILABLE (order-lifecycle 7.1, section 8). Timers keep their progress per BR-ORD-21; Lite has no pause. | Must |
| BR-COUR-12, BR-COUR-13 | Not used in Lite (add and edit courier). | — |
| BR-COUR-14 | Couriers are never deleted (they are referenced by orders). | Must |
| BR-COUR-15 | `deliveriesToday` counts orders this courier brought to DELIVERED since 00:00 store time. | Must |
| BR-COUR-16 | Not used in Lite (no-courier banner on staff screens). | — |
| BR-COUR-17 | Courier phone numbers are never shown to guests (FD-07, BR-TRK-10). | Must |

## 6. Data read and written

| Object | Read | Written |
|---|---|---|
| `Courier` | all | `status`, `statusChangedAt`, `currentOrder`, `tripProgressPercent`, `deliveriesToday` |
| `Order` | READY_FOR_DISPATCH orders, current orders | `courier`, `routeProgressPercent`, status via T-14 and T-15 |
| `OrderLogEntry` | — | assignment, handover and delivery lines |
| `SimulationSettings` | durations, speed | — |
| `SimulationEvent` | — | `COURIER_ASSIGNED`, `COURIER_ARRIVED`, `DELIVERY_COMPLETED` |

## 7. States touched

`CourierStatus`: `AVAILABLE → TO_STORE → AT_STORE → DELIVERING → RETURNING → AVAILABLE`; `TO_STORE / AT_STORE → AVAILABLE` when the order is cancelled before the handover (not possible in Lite after `QUEUED`, BR-ORD-08). `OFF_DUTY` only for `CU-05`, which never changes. Order: T-14, T-15.

## 8. Errors and edge cases

| Case | Behaviour | Message |
|---|---|---|
| All four on-duty couriers are busy when an order is packed | The order waits in `READY_FOR_DISPATCH`; the guest sees stage 4 "Waiting for courier" and a longer ETA; the next courier that becomes AVAILABLE takes the oldest waiting order | — |
| App restarted with a different speed factor during a trip | The trip keeps its progress; only the remaining part is scaled (BR-ORD-21, LITE-CFG-02) | — |
| Demo reset during a trip | Couriers return to their seed state (SIM-08) | — |

## 9. Notifications

Customer-visible log lines on assignment, handover and delivery (FD-07, SIM-07). Server log line per courier status change (LITE-CFG-05). No toasts.
