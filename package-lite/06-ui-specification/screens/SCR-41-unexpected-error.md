# SCR-41 — Unexpected error (`ERROR 500 // SEG_FAULT`)

| Field | Value |
|---|---|
| Type | Page (minimal frame like SCR-40) |
| Roles | G |
| MoSCoW | Must |
| Functional area / epic | FD-15 / EP-15 |
| Rules, processes | BR-ERR (FD-15) |
| Prototype | [SCR-41-unexpected-error.html](../../08-prototype/customer/SCR-41-unexpected-error.html) |
| Stitch reference | [`desktop/system-error.png`](../../assets/stitch-reference/desktop/system-error.png) (layout reused, obsolete branding) |
| Images | horizontal logo `assets/brand/logo-horizontal.svg` (48 px high); `illustrations/error-seg-fault.png` (present, decorative) |

## 1. Purpose

Handle any unhandled technical error gracefully: reassure the visitor, offer a retry and a way home, never show technical details.

## 2. Entry and exit

| Entry | Exit |
|---|---|
| Any unhandled error during page load or an action | `RETRY_DEPLOYMENT` → reloads the page / repeats the navigation that failed · `RETURN_TO_MAIN` → SCR-01 |

## 3. Layout

Same as SCR-40.

## 4. Elements

| ID | Element | Type | Content / data source | Behavior | Validation / rules |
|---|---|---|---|---|---|
| E-01 | Logo | image | horizontal logo, 48 px high | | |
| E-02 | Title | h1 | TXT-ERR-03 | | page title "Error — Git Pizza MxDev" |
| E-03 | Explanation | text | TXT-ERR-04 | | |
| E-04 | Stack trace | terminal pane | TXT-ERR-12, TXT-ERR-14 | decorative | never the real error, stack or IDs |
| E-05 | Resolution | text | TXT-ERR-16 | | |
| E-06 | `RETRY_DEPLOYMENT` | primary button | TXT-ERR-09 | | |
| E-07 | `RETURN_TO_MAIN` | secondary button | TXT-ERR-08 | | |
| E-08 | Status strip | micro text | TXT-ERR-17 with `STATUS SEG_FAULT` | | |
| E-09 | Incident ID | code text under E-03 | TXT-ERR-24 `INCIDENT_ID: ERR-20261105-184233-7F3A` | selectable for copying | the only ID shown; the same ID is in the application log with the technical details (BR-ERR-02); **should** |

Errors that happen inside an action on an otherwise working page (e.g. a failed save) do **not** open SCR-41; they show toast TXT-GEN-19 and keep the user's input.

## 5. States

Default only.

## 6. Tablet and phone

As SCR-40.

## 7. Stitch reference and deviations

See SCR-40 section 7 (same design, obsolete branding replaced).
