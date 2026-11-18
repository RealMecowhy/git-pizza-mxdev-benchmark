# EP-13 — Automatic courier dispatch

| Epic | Functional area | Screens | MoSCoW | Story range |
|---|---|---|---|---|
| EP-13 | FD-13 Courier management | SCR-09 (courier card and map of the guest's order) | Must | US-247 |

**Goal.** In Lite nobody manages the fleet: the Simulator dispatches couriers `CU-01` – `CU-04`, drives them to the store, delivers and brings them back (SIM-04). `CU-05` is always `OFF_DUTY` (BR-DEMO-03a). Guests see the courier of their own delivery order on SCR-09; every courier status change is written to the server log (LITE-CFG-05).

Rules: BR-ORD-15, BR-ORD-16, BR-ORD-17, BR-COUR-10, BR-COUR-11, T-14, T-15; courier state machine in order-lifecycle section 8; timings in section 7.1 (`courierToStore` 30 s, `handover` 5 s, trip `60 + 40 × miles` s, return = trip). Seed couriers: information model section 7.8.

| ID | Title | Priority |
|---|---|---|
| US-247 | Automatic dispatch and courier trips | Must |

---

### US-247 Automatic dispatch and courier trips

> As a **guest waiting for a delivery**, I want couriers to be dispatched, drive to the store, deliver and come back on their own, so that delivery can be watched end to end without anyone operating it.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | SIM | SCR-09 | FD-13 | BR-COUR-10, BR-COUR-11, BR-ORD-15, BR-ORD-16, BR-ORD-21, LITE-CFG-05 | PR-05 | SIM-04, SIM-09 |

**Acceptance criteria**

1. **Given** two `AVAILABLE` couriers, `Alex // Node-v2` (CU-02) available since 18:20 and `Sofia // eBike-v4` (CU-03) since 18:25, **when** a delivery order is sealed, **then** Alex (available longest) is assigned and becomes `TO_STORE` (EN_ROUTE_TO_STORE); the server log shows `COURIER CU-02 AVAILABLE -> TO_STORE order=<orderNumber>` (LITE-CFG-05).
2. **Given** 1×, **then** the courier reaches the store after 30 seconds (`AT_STORE`, WAITING_HANDOVER), the simulator hands over after 5 more seconds (order `OUT_FOR_DELIVERY`, courier `DELIVERING`, IN_TRANSIT), and a delivery to 94105 (2.8 mi) takes 172 seconds with `routeProgressPercent` rising from 0 to 100.
3. **When** route progress reaches 100, **then** the order is `DELIVERED`, the courier becomes `RETURNING` for another 172 seconds and then `AVAILABLE` (IDLE); each courier change is one `COURIER` line in the server log.
4. **Given** two orders wait and one courier becomes available, **then** the order with the oldest `readyAt` gets the courier.
6. **Given** speed 2×, **then** the 94105 trip takes 86 seconds.
8. **Given** `CU-05`, **then** it stays `OFF_DUTY` and is never assigned (BR-DEMO-03a); **given** all four on-duty couriers are busy, **then** a new delivery order shows "Waiting for courier" on SCR-09 until a courier is available again. *(negative)*
9. **Given** speed 10×, **then** the 94105 trip takes 18 seconds.
