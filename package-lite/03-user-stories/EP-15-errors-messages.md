# EP-15 — Errors and system messages

| Epic | Functional area | Screens | MoSCoW | Story range |
|---|---|---|---|---|
| EP-15 | FD-15 Errors and system messages | SCR-40 `ERROR 404 // CRUST_NOT_FOUND`, SCR-41 `ERROR 500 // SEG_FAULT` (plus messages on every screen) | Must | US-281 – US-289 |

**Goal.** Whatever goes wrong — a wrong link, an unexpected error, a lost connection, an invalid entry or an order that changed just before the user's action — the user gets a themed, friendly, accurate message and a way forward, and never sees technical internals.

Rules: BR-ERR-* (FD-15), BR-DATA-07, BR-DATA-08, BR-ORD-01. Texts: `06-ui-specification/`.

| ID | Title | Priority |
|---|---|---|
| US-281 | Page not found (404) | Must |
| US-282 | Unexpected error (500) | Must |
| US-284 | Field validation messages | Must |
| US-285 | Conflicting change by someone else | Must |
| US-286 | Session expiry | Must |
| US-287 | Connection lost or refresh failure | Must |
| US-288 | Busy states and double-submit protection | Must |
| US-289 | No technical details exposed | Must |

---

### US-281 Page not found (404)

> As **any visitor**, I want a clear, on-brand page when something does not exist, so that I can get back on track.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-40 | FD-15 | BR-ERR-* | — | — |

**Acceptance criteria**

1. **Given** an unknown URL inside the app (including addresses of pages the app does not have, such as account or staff pages), a link to an archived or draft product, or an order URL without a tracking token for an unknown order or an order the viewer has no access to, **then** SCR-40 shows `ERROR 404 // CRUST_NOT_FOUND`, the official logo, a plain explanation, a decorative stack-trace block (fixed text, see US-289) and `RETURN_TO_MAIN`.
2. **When** `RETURN_TO_MAIN` is clicked, **then** SCR-01 opens.
3. **Given** the illustration `illustrations/error-crust-not-found.png` cannot be loaded, **then** the page still works with text only; no self-made artwork replaces it. *(negative: no self-made artwork)*
4. The DEMO MODE banner is shown on SCR-40.
5. **Given** a tracking link with an invalid or outdated token, **then** SCR-09 shows its invalid-link state instead of SCR-40 (US-134).

---

### US-282 Unexpected error (500)

> As **any user**, I want a calm message and a retry when something breaks, so that I am not stuck.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-41 | FD-15 | BR-ERR-* | — | — |

**Acceptance criteria**

1. **Given** an unhandled error during a page load or action, **then** SCR-41 shows `ERROR 500 // SEG_FAULT`, a plain explanation, the reference code `INCIDENT_ID: ERR-…` (TXT-ERR-24, BR-ERR-02) that also appears in the server log, `RETRY_DEPLOYMENT` (repeats the failed page load) and `RETURN_TO_MAIN`.
2. **Given** the acceptance test, **then** the contractor documents in `RUN/delivery-notes.md` how an unexpected error can be triggered to show SCR-41.
3. **Given** an error during an order transition, **then** the order is left in its previous consistent state (no half-done transition). *(negative)*

---

### US-284 Field validation messages

> As **any user filling in a form**, I want each error next to the field that caused it, so that I can fix it quickly.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-06 | FD-15 | BR-ERR-*, BR-DATA-07, BR-DATA-08 | — | — |

**Acceptance criteria**

1. **Given** a required field left empty or containing only spaces, **then** the message names the field (e.g. `ADDRESS_LINE_1 is required`) and is shown directly under it in `color.error.text`.
2. **Given** a form with several errors (e.g. checkout), **then** a short error summary lists them, each linked to its field, and focus moves to the first error.
3. **Given** an error message, **then** it is announced to screen readers and programmatically linked to the field.
4. **When** the user corrects the field, **then** its message disappears without submitting again.
5. **Given** an invalid form, **then** nothing is saved and no state changes. *(negative)*

---

### US-285 Conflicting change by someone else

> As a **guest**, I want to be told when my order changed just before my action (by the simulator or in another browser tab), so that nothing is done twice.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09, SCR-07 | FD-15 | BR-ERR-*, BR-ORD-01 | PR-02 | SIM-02, SIM-01 |

**Acceptance criteria**

1. **Given** an order in `PAYMENT_FAILED` is open in two browser tabs, **when** `Retry payment` is pressed in both, **then** only one payment attempt is created; the second tab shows a toast that a payment is already being processed (BR-SIM-12) and refreshes. *(negative)*
2. **Given** the same `QUEUED` order is open in two browser tabs, **when** the guest confirms `Rollback order` in both at the same moment, **then** it is cancelled and refunded once; the second tab gets a toast that the order is already `ROLLED_BACK`. *(negative)*
3. **Given** a guest confirms a rollback just after the simulator started baking, **then** US-129 AC4 applies.

---

### US-286 Session expiry

> As a **guest**, I want to be told when my session expired and my cart was lost, so that I know why the cart is empty and how to find my order again.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-16, SCR-05 | FD-15 | BR-ERR-*, LITE-SES-04, LITE-SES-05 | — | — |

**Acceptance criteria**

3. **Given** a guest's session expired after all tabs of the app were closed, **when** the guest returns, **then** they continue in a new guest session with an empty cart; if a non-empty cart was lost, a toast says so; their orders stay reachable with the tracking link or the lookup (LITE-SES-05). *(negative)*

**Notes.** A session does not expire while a tab of the app is open and online; the inactivity timeout after that (at least 10 minutes) is chosen by the contractor and stated in `RUN/delivery-notes.md` (LITE-SES-04).

---

### US-287 Connection lost or refresh failure

> As **any user of a live screen**, I want to know when updates stopped arriving, so that I do not trust stale data.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-09, SCR-02 | FD-15 | BR-ERR-*, BR-ORD-20 | — | — |

**Acceptance criteria**

1. **Given** a live screen, **when** automatic refresh fails twice in a row (about 10 seconds), **then** the banner "`CONNECTION_LOST //` Live updates paused. Reconnecting…" (TXT-NAV-30) appears above the header (navigation-map 3.6, BR-ERR-12). *(negative)*
2. **Given** the banner, **then** the app keeps retrying at least every 5 seconds; **when** the connection is back, **then** the banner disappears, the toast "Connection restored. Live updates resumed." (TXT-NAV-31) is shown and the screen shows current data within 5 seconds.
3. **Given** the user presses an action while offline, **then** an error toast says the action could not be sent; the action is not silently lost and not executed twice when the connection returns. *(negative)*

---

### US-288 Busy states and double-submit protection

> As **any user**, I want buttons to show that they are working and to ignore a second click, so that I never create two orders or two refunds.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-06, SCR-07, SCR-09 | FD-15 | BR-ERR-* | PR-01, PR-07 | — |

**Acceptance criteria**

1. **Given** an action that creates or changes data (`Execute Order --force`, `Retry payment`, `Rollback order` confirm, `Cancel order` confirm), **when** it is pressed, **then** the button shows a busy state and is disabled until the result is known.
2. **When** `Execute Order --force` is double-clicked, **then** exactly one order exists afterwards. *(negative)*
3. **When** the `Rollback order` confirmation on SCR-09 is double-clicked, **then** exactly one cancellation and at most one refund exist. *(negative)*
4. **Given** a wait longer than 1 second for data, **then** a loading indicator is shown.

---

### US-289 No technical details exposed

> As the **owner**, I want error texts to stay in the theme and free of internals, so that the app looks professional and does not leak implementation details.

| Priority | Roles | Screens | Area | Rules | Processes | Simulations |
|---|---|---|---|---|---|---|
| Must | G | SCR-40, SCR-41, SCR-16 | FD-15 | BR-ERR-* | — | — |

**Acceptance criteria**

1. **Given** any error page, toast or message, **then** it contains no real stack trace, entity, module, microflow or page names, SQL, server paths or framework error text. *(negative)*
2. **Given** the decorative stack trace on SCR-40 and SCR-41, **then** it is fixed themed text from `06-ui-specification/` and identical on every occurrence.
3. **Given** the platform's default error dialogs, **then** they are replaced by the themed pages and toasts of this epic. *(negative)*
