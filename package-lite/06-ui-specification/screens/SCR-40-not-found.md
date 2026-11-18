# SCR-40 — Not found (`ERROR 404 // CRUST_NOT_FOUND`)

| Field | Value |
|---|---|
| Type | Page (minimal frame: DEMO MODE banner + logo; no navigation shell) |
| Roles | G |
| MoSCoW | Must |
| Functional area / epic | FD-15 / EP-15 |
| Rules, processes | BR-ERR (FD-15), navigation-map section 6 |
| Prototype | [SCR-40-not-found.html](../../08-prototype/customer/SCR-40-not-found.html) |
| Stitch reference | [`desktop/system-error.png`](../../assets/stitch-reference/desktop/system-error.png) (obsolete branding) |
| Images | horizontal logo `assets/brand/logo-horizontal.svg` (48 px high); `illustrations/error-crust-not-found.png` (present, decorative) |

## 1. Purpose

Tell the visitor that the page or record does not exist (unknown URL, unknown or foreign order, archived or draft product link) and get them back on track.

## 2. Entry and exit

| Entry | Exit |
|---|---|
| Unknown URL, including addresses of screens that are not part of Lite; product link to a DRAFT/ARCHIVED/unknown product; an order the session holds no token for (LITE-SES-03) | `RETURN_TO_MAIN` → SCR-01 · `./track.log` → navigation-map 3.4 · logo → SCR-01 |

## 3. Layout

Centered, max 960 px: logo; large error code block with `report` icon (`color.error.default`); title; explanation; stack-trace panel (terminal style, line numbers); suggested resolution; buttons; status strip. Optional faint "falling code" animation in the background (off with reduced motion).

## 4. Elements

| ID | Element | Type | Content / data source | Behavior | Validation / rules |
|---|---|---|---|---|---|
| E-01 | Logo | image | horizontal logo, 48 px high | link → `RETURN_TO_MAIN` target | |
| E-02 | Title | h1 | TXT-ERR-01 (`ERROR 404` large, `CRUST_NOT_FOUND` below) | | page title "Not found — Git Pizza MxDev" |
| E-03 | Explanation | text | TXT-ERR-02 | | |
| E-04 | Stack trace | terminal pane | title TXT-ERR-12; lines TXT-ERR-13 with the requested path (max 60 characters, escaped) | decorative | never real technical details |
| E-05 | Resolution | text | TXT-ERR-16 | | |
| E-06 | `RETURN_TO_MAIN` | primary button | TXT-ERR-08 | | |
| E-07 | `./track.log` | secondary button | TXT-NAV-05 | navigation-map 3.4 | |
| E-08 | Status strip | micro text | TXT-ERR-17 with `STATUS 404` | | |

## 5. States

Default only. HTTP status of the page is 404 where the platform allows it.

## 6. Tablet and phone

Phone: stack trace collapsed to 3 lines with `Show more`; buttons stacked full width.

## 7. Stitch reference and deviations

- `stack_trace.log — PIZZA_OS`, `PIZZA_OS v1.0.4`, `© 2024 ROOT_USER. BAKED_IN_THE_CLOUD.`, `Oven.bake({ temp: 450, unit: 'F' })` → Git Pizza MxDev brand, TXT-ERR-13 (850 °F, realistic for a Neapolitan oven).
- The Stitch page mixes 404 (`CRUST_NOT_FOUND`) with `STATUS SEG_FAULT`: the 404 page shows `STATUS 404`; `SEG_FAULT` belongs to SCR-41.
- Kept: `ERROR 404`, `CRUST_NOT_FOUND`, stack trace panel with line numbers, `// SUGGESTED RESOLUTION:`, `RETURN_TO_MAIN`, `RETRY_DEPLOYMENT` (on SCR-41 only), status strip.
