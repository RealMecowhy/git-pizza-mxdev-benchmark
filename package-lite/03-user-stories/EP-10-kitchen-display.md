# EP-10 — Kitchen run by the simulator

| Epic | Functional area | Screens | MoSCoW | Story range |
|---|---|---|---|---|
| EP-10 | SIM-02 Kitchen auto-advance | SCR-09, SCR-08, SCR-01 (what the guest sees) | Must | US-194 |

**Goal.** In Lite nobody operates the kitchen and there is no kitchen screen: the Simulator moves every order through the oven queue, the ovens and the quality check by itself (SIM-02). The guest sees the effect on their own order (queue position, oven, bake progress, ETA) and on the home page (kitchen load).

Rules: BR-ORD-01, BR-ORD-11 – BR-ORD-16, BR-ORD-20, BR-ORD-21; transitions T-08 and T-10 – T-13 in [order-lifecycle.md](../05-processes/order-lifecycle.md); oven behavior section 9; guest view of the kitchen: [SIM-02](../10-simulations/sim-02-kitchen-auto-advance.md) section 3.6 (BR-SIM-16a – BR-SIM-16d). Simulations: SIM-02 (kitchen auto-advance), SIM-07 (logs), SIM-09 (clock).

| ID | Title | Priority |
|---|---|---|
| US-194 | Automatic kitchen run by the simulator | Must |

---

### US-194 Automatic kitchen run by the simulator

> As a **guest waiting for my order**, I want the kitchen to run by itself and to show me where my order is, so that the demo always moves and I know how long I wait.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | SIM, G | SCR-09, SCR-08, SCR-01 | SIM-02 | BR-ORD-11, BR-ORD-21, BR-SIM-16a, BR-SIM-16b, BR-SIM-16c, BR-SIM-16d, LITE-CFG-04, LITE-SEC-02 | PR-04 | SIM-02, SIM-09 |

**Acceptance criteria**

1. **Given** 1× and free oven slots, **then** a newly queued order that is first in queue order starts baking 20 seconds after `queuedAt`, is pulled 90 seconds later, and is sealed 30 seconds after that with all three checks ticked; each transition is recorded with actor `SIMULATOR` (`sim/kitchen-auto`) and written to the server log, e.g. `ORDER MX-1063 QUEUED -> BAKING by sim/kitchen-auto` (LITE-CFG-04).
4. **Given** `qaFailurePercent` = 0 (fixed in Lite), **then** the simulator never fails QA: no order goes back from `QA_CHECK` to `QUEUED` (T-13). *(negative)*
5. **Given** a guest's order is `QUEUED` behind other orders (guest or simulated), **then** SCR-08 and SCR-09 show its queue position (TXT-PAY-19, TXT-TRK-08), recalculated at least every 5 seconds and going down as the orders ahead start baking (BR-SIM-16c).
6. **Given** the order is `BAKING` at 1×, **then** SCR-09 shows the oven (e.g. `OVEN_01::CORE`) and a bake progress that rises from 0 to 100 % over 90 seconds and then reads `Coming out of the oven` (BR-SIM-16b); the T-08 log line names the oven and its target temperature (`850°F` for OVEN_01, `780°F` for OVEN_02, BR-SIM-16a).
7. **Given** orders enter and leave the ovens, **then** the home page KPI `KITCHEN_LOAD` shows the occupied slots of the ONLINE ovens (e.g. `4/6 · 67%`, BR-SIM-16d) at the latest 10 seconds later (US-023).
8. **Given** speed 10×, **then** an order goes from `QUEUED` to `READY_FOR_DISPATCH` or `READY_FOR_PICKUP` in 14 – 20 seconds.
9. **Given** the queue position, the oven and the kitchen load, **then** the guest sees numbers and the own order only: no other order's number, contents or contact data (LITE-SEC-02). *(negative)*

---
