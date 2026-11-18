# FD-15 — Errors and system messages

| Item | Value |
|---|---|
| Epic | EP-15 (US-281 – US-300, TC-281 – TC-300) |
| Roles | Guest |
| Screens | SCR-40 Not found (`ERROR 404 // CRUST_NOT_FOUND`), SCR-41 Unexpected error (`ERROR 500 // SEG_FAULT`); message patterns used on every screen |
| Processes | — |
| Objects | — |
| Rules referenced | BR-DATA-06 – BR-DATA-08, BR-ORD-20, LITE-SES-04, LITE-SES-05, LITE-SEC-03 |
| Priority | Must |

Related: FD-01 (screen access matrix) · every other FD (area-specific messages) · information model section 2 (guest session) · `06-ui-specification/` (layout of the error pages and the UI text catalogue, which must use the texts of the FD files).

---

## 1. Purpose

Make every failure understandable and recoverable, in the same IDE tone as the rest of the app, without exposing technical details: themed 404 and 500 pages, one consistent way of showing validation errors, toasts and confirmations, and defined behaviour for guest session expiry, lost connections and concurrent changes.

Lite has no access-denied page (403): there are no roles to deny. A screen or record the guest may not open is reported as "not found" (SCR-40).

## 2. Actors

The guest. The error pages use a minimal frame (DEMO MODE banner and logo, no navigation shell, BR-ERR-04); the logo and the page buttons always lead away.

## 3. Preconditions

None.

## 4. Behaviour

### 4.1 Error pages

| Page | Shown when | Title and text | Actions |
|---|---|---|---|
| SCR-40 | Unknown URL, including URLs of screens that are not in Lite; unknown, inaccessible or deleted record (product, order detail, receipt) | `ERROR 404 // CRUST_NOT_FOUND` · "The page or record you asked for doesn't exist. It may have been archived, or the demo was reset." (TXT-ERR-02) | `RETURN_TO_MAIN`, `./track.log` (navigation-map 3.4) |
| SCR-41 | An unexpected error that the screen cannot handle itself | `ERROR 500 // SEG_FAULT` · "Something went wrong on our side. Your manifest and orders are safe." (TXT-ERR-04) + `INCIDENT_ID: <id>` | `RETRY_DEPLOYMENT`, `RETURN_TO_MAIN` |

Each page shows the official logo (horizontal Pixel Slice logo), the error title in a terminal window, and a short decorative "stack trace" (fixed, invented text such as `at Oven.bake (crust.ts:404)`), never real technical details. Illustrations: `illustrations/error-crust-not-found.png` (SCR-40), `illustrations/error-seg-fault.png` (SCR-41); they are decorative and the pages also work with text only.

### 4.2 Message types

| Type | Used for | Look and behaviour |
|---|---|---|
| Inline field error | Validation of one field | Under the field, `color.error.text`, icon, field marked invalid (`aria-invalid`) |
| Form summary | Forms with 2 or more errors after submit | Above the form: "Lint failed: {n} env variables need attention." (TXT-VAL-01) with links to the fields |
| Toast | Result of an action, background events | BR-ERR-08 |
| Banner | Lasting conditions (DEMO MODE, connection lost) | Full width under the header; stays while the condition lasts |
| Dialog | Confirmation of destructive or irreversible actions | BR-ERR-09 |
| Empty state | A list or area without content | BR-ERR-16 |

## 5. Business rules

| ID | Rule | Priority |
|---|---|---|
| BR-ERR-01 | SCR-40 is shown for every case of 4.1 row 1 and for direct links to DRAFT or ARCHIVED products (BR-MENU-01). Records the guest may not see are reported as "not found", not "access denied", so the app does not reveal that they exist (LITE-SEC-03). Exception: tracking links use the SCR-09 not-found state (BR-TRK-21). | Must |
| BR-ERR-02 | SCR-41 is shown for unexpected errors. It shows an `INCIDENT_ID` (e.g. `ERR-20261105-184233-7F3A`: date, time and 4 random hex characters) that is also written to the application log together with the technical details, so the owner can find it. `RETRY_DEPLOYMENT` repeats the failed navigation or reloads the previous screen. | Must (page) / Should (incident ID) |
| BR-ERR-03 | Not used in Lite (access-denied page; Lite shows SCR-40 instead, BR-NAV-16). | — |
| BR-ERR-04 | Error pages use a minimal frame: the DEMO MODE banner and the horizontal logo, without header navigation, sidebar, bottom tab bar or footer (SCR-40, SCR-41). `RETURN_TO_MAIN` opens SCR-01. No error page shows stack traces, SQL, entity names, IDs other than the incident ID, or server details. | Must |
| BR-ERR-05 | **Validation display**: on submit, all invalid fields show their inline error at the same time; with 2 or more errors the form summary is shown; focus moves to the first invalid field. While typing, a field is re-validated when it loses focus; an error disappears as soon as the field is valid. Submit buttons stay enabled so users can trigger the validation (except where an FD says otherwise). | Must |
| BR-ERR-06 | **Message templates** (field name as shown on the form, usually the dev label): required — "<FIELD> is required."; too long — "{FIELD} must be at most {n} characters." (TXT-VAL-03); too short — "<FIELD> must be at least <n> characters."; email — "{FIELD} must be a valid email address." (TXT-VAL-05); US phone — "{FIELD} must be a 10-digit US phone number." (TXT-VAL-06); ZIP — "{FIELD} must be 5 digits." (TXT-VAL-07); state — "{FIELD} must be a 2-letter state code." (TXT-VAL-08); number range — "<FIELD> must be between <min> and <max>."; money — "Enter an amount like 14.99." (TXT-VAL-10). Area-specific messages are defined in each FD and are binding. | Must |
| BR-ERR-07 | Every rule of the functional design is enforced by the server when data is saved or an action is executed, not only in the browser (LITE-SEC-01). A request that bypasses the UI gets the same rejection and message. | Must |
| BR-ERR-08 | **Toasts**: types success, info, warning, error, with icon and text (color is never the only signal). Position: top right on desktop and tablet, top center under the header on phone, above all other layers. Success and info disappear after 4 s, warnings after 6 s; errors stay until closed. At most 3 toasts are visible; newer ones push older ones out. Toasts with an action (e.g. `Undo`) stay at least 6 s. Toasts are announced to screen readers (polite; errors assertive). | Must |
| BR-ERR-09 | **Confirmation dialogs** for destructive or irreversible actions (clear cart, rollback, cancel order before payment): a title that names the object, one sentence about the consequence, a destructive primary button with a verb (`rm -rf`, `Rollback order`; exact texts in the TXT dialog entries) and a `Cancel`/`Keep …` button. Esc and the scrim click mean cancel. Focus starts on the cancel button. | Must |
| BR-ERR-10 | Not used in Lite (session expiry of a signed-in user). | — |
| BR-ERR-11 | **Guest session expiry** (LITE-SES-04, LITE-SES-05): a session does not expire while a tab of the app is open and online. When it has expired, the visitor continues in a new guest session with an empty cart; if a non-empty cart was lost, the toast "Your session expired. Your manifest was cleared." (TXT-ERR-20) is shown once on the next page. Orders are not affected; tracking links and the lookup keep working. | Must |
| BR-ERR-12 | **Connection lost on live screens** (SCR-01 build status and KPIs, SCR-09): when two automatic refreshes in a row fail (about 10 s), the last data stays visible and the banner "`CONNECTION_LOST //` Live updates paused. Reconnecting…" (TXT-NAV-30) is shown above the header (navigation-map 3.6). The screen keeps retrying every 5 s; on success the banner disappears and the toast "Connection restored. Live updates resumed." (TXT-NAV-31) is shown. | Must |
| BR-ERR-13 | **Action without connection**: an action that cannot reach the server shows the error toast "Could not reach the server. Check your connection and try again." (TXT-ERR-19) and changes nothing. Retrying is the user's choice; no action is queued and sent later. | Must |
| BR-ERR-14 | **Concurrent change**: when an action is rejected because the record changed after it was displayed — in Lite usually because the Simulator moved the order on (for example a rollback after baking started, BR-TRK-13) — the screen refreshes and shows the area-specific message or, where none is defined, "This record changed while you were editing. Reload to see the latest version." (TXT-GEN-20) | Must |
| BR-ERR-15 | **Loading**: content that takes longer than 300 ms shows a skeleton or spinner in place (never a blank screen). An action button shows a busy state while its request runs and cannot be pressed again. A request that takes longer than 15 s shows "This is taking longer than usual…" (TXT-GEN-24) and, if it fails, the normal error handling. | Must |
| BR-ERR-16 | **Empty states** have an illustration from `assets/illustrations/` (only `no-results.png` is still missing: placeholder or no illustration), one line in dev style, one plain sentence, and where useful one action. The texts are defined per area (e.g. BR-CART-20, BR-MENU-11). | Must |
| BR-ERR-17 | Every SCR-41 incident, every rejected server-side validation of a business rule, and every failed simulator tick are written to the application log with time, user (`guest` or the system actor), screen or process, and the technical error. The log is for the owner and the contractor, not shown in the UI. | Should |
| BR-ERR-18 | Inline errors are linked to their fields for assistive technology (`aria-describedby`); banners use `role="status"`, error banners `role="alert"`. | Must |
| BR-ERR-19 | Messages never blame the user and never show raw values that could contain personal data of other users (e.g. lookups say "No deployment found for {orderNumber} with that email." (TXT-TRK-54), not "email does not match"). | Must |

## 6. Data read and written

None in the app data. Writes the application log (BR-ERR-17).

## 7. States touched

None.

## 8. Errors and edge cases

| Case | Behaviour | Message |
|---|---|---|
| Link to an unknown product code (e.g. `PZ-99`) | SCR-40 | `ERROR 404 // CRUST_NOT_FOUND` |
| Guest opens an old login, profile or kitchen URL of the full product | SCR-40 (BR-NAV-16) | `ERROR 404 // CRUST_NOT_FOUND` |
| Guest changes the order ID in the URL of SCR-13 | SCR-40 (LITE-SEC-03) | `ERROR 404 // CRUST_NOT_FOUND` |
| Unexpected error during an action in a dialog | Dialog stays open with an inline error; SCR-41 only when the screen cannot continue | "Command failed. Try again." (TXT-GEN-19) |
| Error page itself fails to load data | It never depends on app data; it always renders | — |
| Guest closes all tabs with a full cart and returns after the session expired | New guest session, empty cart, toast once | TXT-ERR-20 |
| Wi-Fi drops on SCR-09 for 20 s | Banner after two failed refreshes (about 10 s), retries every 5 s, then the toast | TXT-NAV-30, TXT-NAV-31 (BR-ERR-12) |

## 9. Notifications

This area defines the notification patterns used by all others: banners, toasts, inline errors, dialogs, empty states (section 4.2). There are no notifications outside the app (no email, SMS, push or webhooks).
