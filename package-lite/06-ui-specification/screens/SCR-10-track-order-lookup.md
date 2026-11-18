# SCR-10 — Track order lookup (`git log --grep`)

| Field | Value |
|---|---|
| Type | Page (inside SCR-16) |
| Roles | G |
| MoSCoW | Must |
| Functional area / epic | FD-07 / EP-07 |
| Rules, processes | BR-TRK (FD-07), information model section 10 (token access), PR-02 |
| Prototype | [SCR-10-track-order-lookup.html](../../08-prototype/customer/SCR-10-track-order-lookup.html) |
| Stitch reference | No Stitch design (terminal form style of [`desktop/ssh-auth.png`](../../assets/stitch-reference/desktop/ssh-auth.png)) |

## 1. Purpose

Let a guest who lost the tracking link find their order by order number and the email used at checkout. The orders of the seed are found the same way (e.g. `MX-1001` with `jordan.lee@example.com`).

## 2. Entry and exit

| Entry | Exit |
|---|---|
| `./track.log` / tab `Trace` / sidebar `Active_Deployments` when the guest session holds no order (navigation-map 3.4, BR-NAV-06); `git log --grep` on the invalid-link state of SCR-09; home CTA `./track.log` | found → SCR-09 of the order (the lookup grants the same access as the tracking link for this browser session, LITE-SES-03) |

## 3. Layout

Centered terminal-style card (480 px): title, intro, two fields, button, result message.

## 4. Elements

| ID | Element | Type | Content / data source | Behavior | Validation / rules |
|---|---|---|---|---|---|
| E-01 | Title, intro | h1 + text | TXT-TRK-48, TXT-TRK-49 | | |
| E-02 | `ORDER_NUMBER` | input | TXT-TRK-50 | accepts `MX-1048`, `mx-1048` or `1048`; normalized to `MX-1048` | required (TXT-VAL-02); format TXT-TRK-53 |
| E-03 | `CONTACT_EMAIL` | input | TXT-TRK-51 | | required; email (TXT-VAL-05) |
| E-04 | `FIND DEPLOYMENT` | primary button | TXT-TRK-52 | looks up an order with this number whose `contactEmail` matches case-insensitively; success → SCR-09; failure → E-05 | Enter submits |
| E-05 | Not-found message | inline error under the button | TXT-TRK-54 | | the message never reveals whether the number or the email was wrong |

## 5. States

| State | What is shown |
|---|---|
| Empty form | E-01 – E-04 |
| Validation errors | inline field errors |
| Not found | E-05 |
| Searching | button spinner |
| Found | navigates to SCR-09 |

## 6. Tablet and phone

Same card, full width on phone.

## 7. Stitch reference and deviations

No Stitch design. Uses the terminal card look of [`desktop/ssh-auth.png`](../../assets/stitch-reference/desktop/ssh-auth.png) with the Git Pizza MxDev brand.
