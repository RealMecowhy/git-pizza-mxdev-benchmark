# Accessibility

Accessibility requirements for the look and behavior of Git Pizza MxDev, with the computed contrast of every token pair the design uses. Non-functional accessibility requirements as a whole (`NFR-xx`) live in `11-non-functional/`; this file is the design-system part they refer to. Tokens: [tokens.md](tokens.md). Components: [components.md](components.md).

---

## 1. Target

| Item | Target |
|---|---|
| Standard | **WCAG 2.1 level AA** for every screen, desktop and phone, all roles |
| Additional | Touch targets 44 × 44 px (`layout.touchTargetMin`, WCAG 2.5.5 AAA, adopted as a must for every screen) |
| Browsers / assistive technology for testing | NVDA + Chrome (Windows), VoiceOver + Safari (iOS), keyboard only in Chrome and Firefox |
| Theme | One dark theme; no light mode, so all checks are against the dark surfaces |

The dev-language theme is not an excuse for lower accessibility: every dev label has a plain meaning available to users of assistive technology ([glossary.md](../01-product-brief/glossary.md) rule).

---

## 2. How contrast was computed

- Formula: WCAG 2.x relative luminance and contrast ratio `(L1 + 0.05) / (L2 + 0.05)`.
- Semi-transparent tokens (`.subtle` 12 % fills, `surface.glass`, gradients) were composited over the named surface first, then measured.
- Values are rounded to two decimals. A pair passes when the unrounded value meets the threshold.
- Thresholds: normal text 4.5 : 1; large text (≥ 24 px regular or ≥ 18.66 px bold) 3 : 1; user-interface boundaries, focus indicators and meaningful graphics 3 : 1 (WCAG 1.4.11).
- Almost all app text is 11–16 px, so **4.5 : 1 is the working threshold for all text**, including bold `typography.label`. Only `display`, `h1`, `h2` and `priceLarge` count as large text.

The numbers can be reproduced with this Node.js snippet (no dependencies):

```js
const hex = h => [0, 2, 4].map(i => parseInt(h.replace('#', '').substr(i, 2), 16));
const lin = c => (c /= 255) <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const over = (fg, alpha, bg) => fg.map((v, i) => Math.round(v * alpha + bg[i] * (1 - alpha)));
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
// example: failed badge text on its 12 % fill over surface.container
console.log(ratio(hex('#ff5555'), over(hex('#ff5555'), 0.12, hex('#202020'))).toFixed(2)); // 4.48
```

---

## 3. Contrast results

### 3.1 Text tokens on surfaces

Pass = ≥ 4.5. Cells in **bold** fail for normal text.

| Text token | `lowest` #0e0e0e | `base` #131313 | `low` #1b1b1c | `container` #202020 | `high` #2a2a2a | `highest` #353535 |
|---|---|---|---|---|---|---|
| `text.primary` #e5e2e1 | 14.98 | 14.42 | 13.36 | 12.64 | 11.14 | 9.52 |
| `text.secondary` #dac2ad | 11.31 | 10.88 | 10.08 | 9.54 | 8.41 | 7.19 |
| `text.muted` #a28d79 | 6.09 | 5.86 | 5.43 | 5.14 | 4.53 | **3.87** |
| `text.disabled` #6e6e6e | **3.79** | **3.64** | **3.38** | **3.20** | **2.81** | **2.41** |
| `primary.light` #ffc485 | 12.40 | 11.93 | 11.05 | 10.46 | 9.22 | 7.88 |
| `primary.default` #ff9d00 | 9.26 | 8.91 | 8.26 | 7.82 | 6.89 | 5.88 |
| `success.text` #72ff70 | 14.94 | 14.38 | 13.32 | 12.61 | 11.11 | 9.49 |
| `success.default` #00ff41 | 14.14 | 13.61 | 12.61 | 11.93 | 10.51 | 8.98 |
| `warning.default` #f1fa8c | 17.28 | 16.63 | 15.40 | 14.58 | 12.84 | 10.98 |
| `error.default` #ff5555 | 6.14 | 5.91 | 5.48 | 5.18 | 4.57 | **3.90** |
| `error.text` #ffb4ab | 11.37 | 10.94 | 10.14 | 9.60 | 8.45 | 7.22 |
| `info.default` #38bdf8 | 9.01 | 8.67 | 8.03 | 7.61 | 6.70 | 5.73 |
| `tertiary.default` #dec4ff | 12.36 | 11.90 | 11.02 | 10.43 | 9.19 | 7.85 |
| `syntax.number` #ffb869 | 11.32 | 10.89 | 10.09 | 9.55 | 8.42 | 7.19 |

Also measured: `text.primary` on `surface.glass` over `base` 13.64, `text.muted` on glass 5.54; `text.primary` on `surface.bright` (hover) 8.96, `text.muted` on `bright` **3.64**.

### 3.2 Rules that follow for text

| # | Rule | Reason |
|---|---|---|
| T-1 | `color.text.muted` is used only on `surface.lowest` … `surface.high`. It is **never** used on `surface.highest`, `surface.bright` or on `primary.subtle` over `surface.high` (3.60). Components use `color.text.secondary` there | 3.87 / 3.64 / 3.60 : 1 |
| T-2 | **Placeholders** inside inputs (fill `surface.highest`) use `color.text.secondary` in italic, not `color.text.muted`. Placeholders are optional examples and never replace the visible label | tokens.md lists `text.muted` for placeholders; on the input fill it reaches only 3.87 : 1 |
| T-3 | `color.error.default` as **text** only on `surface.lowest` … `surface.high`; error messages always use `color.error.text` | 3.90 on `highest` |
| T-4 | `color.text.disabled` only for disabled controls (WCAG exempts inactive components) and decorative code comments / timestamps (3.5). Never for information a user needs | 2.41–3.79 |
| T-5 | Text on images sits on the bottom gradient defined in components.md 5.3 (transparent → `surface.base` at 85 %); worst case over a white pixel: `text.primary` 9.38 : 1 | Photo content is unpredictable |
| T-6 | Links inside running text are underlined; color alone does not mark a link | WCAG 1.4.1 |

### 3.3 Text on colored fills

| Pair (text on fill) | Ratio | Used for |
|---|---|---|
| `primary.on` #2c1700 on `primary.default` #ff9d00 | 8.19 | Primary buttons |
| `primary.on` on `primary.hover` #ffb869 | 10.01 | Primary hover |
| `primary.on` on `primary.pressed` #e08a00 | 6.35 | Primary pressed |
| `primary.on` on `primary.light` #ffc485 | 10.97 | Selected segment, count bubble on light fill |
| `success.on` #003907 on `success.default` | 9.68 | Success buttons, completed stepper nodes, checkbox check |
| `warning.on` #1f2000 on `warning.default` | 14.86 | Warning fills |
| `error.on` #131313 on `error.default` | 5.91 | Danger toggle thumb, error fills |
| `error.onContainer` #ffdad6 on `error.container` #93000a | 7.24 | Strong danger fills (not used on Lite screens) |
| `info.on` #082f49 on `info.default` | 6.48 | Current dispatch node |
| `tertiary.on` #290055 on `tertiary.container` #c8a2ff | 8.22 | QA fills |
| `tertiary.on` on `tertiary.default` | 10.97 | Current QA node |
| `text.inverse` #131313 on `status.queued` #a28d79 | 5.86 | Current QUEUED node |
| `text.inverse` on `status.staged` #f1fa8c | 16.63 | STAGED fills |
| `text.primary` on `primary.subtle` over `low` / `high` | 10.75 / 8.87 | Selected option card |
| `text.secondary` on `primary.subtle` over `high` | 6.69 | Selected option description |

All pass.

**Status badges** (label text on the 12 % status fill, composited over each surface):

| Status | Text color | over `lowest` | `base` | `low` | `container` | `high` | `highest` |
|---|---|---|---|---|---|---|---|
| staged | `status.staged` | 13.02 | 12.16 | 10.98 | 10.34 | 9.00 | 7.70 |
| failed | `status.failed` #ff5555 | 5.40 | 5.17 | 4.74 | **4.48** | **3.95** | **3.41** |
| failed | **`error.text` #ffb4ab (chosen)** | 9.99 | 9.56 | 8.77 | 8.29 | 7.30 | 6.31 |
| queued | `status.queued` #a28d79 | 5.29 | 5.00 | 4.57 | **4.31** | **3.80** | **3.26** |
| queued | **`text.secondary` #dac2ad (chosen)** | 9.82 | 9.29 | 8.49 | 8.01 | 7.05 | 6.05 |
| baking | `status.baking` | 7.73 | 7.29 | 6.64 | 6.26 | 5.48 | 4.77 |
| qa | `status.qa` | 9.79 | 9.29 | 8.42 | 7.83 | 6.90 | 5.93 |
| dispatch | `status.dispatch` | 7.53 | 7.18 | 6.54 | 6.10 | 5.34 | 4.65 |
| deployed | `status.deployed` | 11.22 | 10.65 | 9.69 | 9.04 | 7.91 | 6.88 |

**Decision.** tokens.md says badges use "status color text". Badges appear on `surface.container` (table headers) and `surface.high` (row hover, cards), where the `failed` and `queued` colors fail. Therefore the badge **label** uses `color.error.text` for PAYMENT_FAILED / CANCELLED and `color.text.secondary` for QUEUED; border, icon and fill keep the status color (components.md 4.1). All badges then pass on every surface. The same substitution applies to any other chip whose color is `#ff5555` or `#a28d79` (components.md 4.2).

### 3.4 Non-text contrast (WCAG 1.4.11)

Boundaries and indicators that a user needs to identify a control or its state must reach 3 : 1 against the adjacent color.

| Element | Pair | Ratio | Result / measure |
|---|---|---|---|
| Focus ring | `border.focus` #ffc485 vs every surface | 7.88–12.40 | Pass. The 2 px offset places the ring on the page surface, also around orange buttons (ring vs `primary.default` itself would be 1.34, so the offset is mandatory) |
| Card / panel border | `border.default` #333333 vs surfaces | 1.03–1.53 | Decorative only. Cards and panels are not controls; they are identified by content and headings |
| Header / footer separator | `border.strong` #544433 | 1.32–2.07 | Decorative only |
| **Text input boundary** | `surface.highest` fill vs `surface.low` page 1.40; `border.default` 1.36 | **fail** | **Measure:** every field and prompt input has a 1 px bottom edge in `color.text.muted` (3.87 vs the fill, 5.43 vs `surface.low`), components.md 3.1/3.2 |
| Checkbox / radio outline | `text.muted` 1.5 px vs `surface.low` / `high` | 5.43 / 4.53 | Pass |
| Toggle (off) | thumb `text.muted` vs track `surface.highest`; track border `text.muted` vs page `low` | 3.87 / 5.43 | Pass |
| Toggle (on) | track `success.default` vs `surface.low`; thumb `success.on` vs track; danger thumb `error.on` vs `error.default` | 12.61 / 9.68 / 5.91 | Pass; the `ON`/`OFF` text is always shown as well |
| Selected segment | `primary.light` fill vs track `surface.highest` | 7.88 | Pass |
| **`danger-strong` button** | `error.container` #93000a vs `base` / `low` | **1.99 / 1.84** | **Measure:** 1 px `color.error.default` border (5.91 vs `base`); label 7.24 : 1 |
| Primary button | `primary.default` vs `base` | 8.91 | Pass |
| Progress / meter fill | fill vs track `surface.highest`: primary · info · success · error | 5.88 / 5.73 / 8.98 / 3.90 | Pass; the value is also shown as text |
| Status badge border | status color vs `low` / `container` | 5.14–15.40 | Pass |
| Stepper connector | `border.default` (upcoming) | 1.29–1.53 | Decorative; each node shows its state with icon, color and text |
| Terminal window dots | `terminal.dot*` | — | Decorative, `aria-hidden` |
| Map markers | `primary.default` / `success.default` / `primary.light` vs map image | depends on image | The map illustration must stay dark (imagery.md 6); the information is repeated as text |

### 3.5 Syntax and log colors (on `surface.lowest` / `low` / `container`)

| Token | `lowest` | `low` | `container` |
|---|---|---|---|
| `syntax.keyword` #dec4ff | 12.36 | 11.02 | 10.43 |
| `log.info` #38bdf8 | 9.01 | 8.03 | 7.61 |
| `syntax.string`, `log.success` #72ff70 | 14.94 | 13.32 | 12.61 |
| `syntax.number` #ffb869 | 11.32 | 10.09 | 9.55 |
| `syntax.function` #ffc485 | 12.40 | 11.05 | 10.46 |
| `syntax.property` #e5e2e1 | 14.98 | 13.36 | 12.64 |
| `syntax.boolean` #38bdf8 | 9.01 | 8.03 | 7.61 |
| `syntax.punctuation`, `log.debug` #a28d79 | 6.09 | 5.43 | 5.14 |
| `syntax.error` #ffb4ab | 11.37 | 10.14 | 9.60 |
| `log.warn` #f1fa8c | 17.28 | 15.40 | 14.58 |
| `log.error` #ff5555 | 6.14 | 5.48 | 5.18 |
| **`syntax.comment`, `log.timestamp` #6e6e6e** | **3.79** | **3.38** | **3.20** |

**Exception — comments and log timestamps.** tokens.md defines them as decorative. They pass 3 : 1 but not 4.5 : 1. Rules that keep this acceptable:

1. Code comments never carry information a user needs (no prices, allergens, warnings or instructions in comments).
2. Log timestamps are a convenience; every status time is also available in readable form (status history on SCR-13, ETA and timers in normal text colors).
3. Empty-state text inside log panes (`// waiting for events…`) uses `color.text.muted`, not the comment color, because it is information.

> **Assumption A-90 (design system):** Log timestamps and code comments keep `#6e6e6e` as defined in tokens.md and are treated as decorative under the rules above. If the owner prefers strict AA for all visible text, `color.log.timestamp` and `color.syntax.comment` change to `#a28d79` (6.09 : 1 on `surface.lowest`); no other change is needed.

---

## 4. Focus

| # | Requirement |
|---|---|
| F-1 | Every interactive element shows the focus ring on keyboard focus: 2 px solid `color.border.focus`, 2 px offset, following the element's radius. Mouse clicks do not show it (focus-visible behavior) |
| F-2 | The ring is never clipped: containers with hidden overflow (cards, tables, tab bars) leave 4 px room or draw the ring inside (inset 2 px) with the same color |
| F-3 | Focus order follows the visual order: demo banner link → header → sidebar → main content → side panel → footer; on phone: demo banner → header → content → sticky action bar → bottom tabs |
| F-4 | A "Skip to content" link is the first focusable element on every page; visible when focused (`primary` button style, top left) |
| F-5 | After navigation to a new page, focus moves to the page's `h1` (or the main region) so screen readers announce the new page |
| F-6 | Overlays trap focus and return it to the trigger when closed (components.md section 6) |
| F-7 | Focused elements are not hidden behind the sticky header, demo banner, sticky action bar or bottom tabs: the page scrolls them into view with scroll padding equal to those bars |
| F-8 | When an element disappears after an action (removed cart line, ticket moved to another column), focus moves to a logical neighbor (next line, the column heading) instead of the page start |

---

## 5. Keyboard

- Everything that works with a pointer works with the keyboard; no keyboard trap outside open overlays.
- Composite widgets use arrow keys: tabs (file tabs), segmented controls, radio groups, menus, selects. `Tab` moves between widgets.
- `Esc` closes overlays, tooltips, dropdowns and clears the search.
- No single-key shortcuts are required. If a team adds shortcuts, they must use a modifier key or be switchable off (WCAG 2.1.4).
- Drag-and-drop is not used for any function.

---

## 6. Semantics, names and announcements

| # | Requirement |
|---|---|
| S-1 | Page language `en`. Page title format: `<plain page name> — Git Pizza MxDev` (e.g. `Menu — Git Pizza MxDev`, `Order MX-1048 — Git Pizza MxDev`) |
| S-2 | Landmarks: banner (demo banner region + header), navigation (header nav, Project Explorer, bottom tabs, each with a distinct label), main, complementary (cart side panel), contentinfo (footer) |
| S-3 | One `h1` per page (the page title, e.g. `DEPLOYMENT_STATUS` with plain name in the accessible heading "Order tracking (DEPLOYMENT_STATUS)"); headings do not skip levels |
| S-4 | Dev labels carry their plain meaning in the accessible name (glossary). Buttons that spend money or cancel state the plain action: `Execute Order --force` → "Place order and pay"; `Rollback order` → "Cancel order" |
| S-5 | Status badges are read as "Order status: In the oven (BAKING)" (components.md 4.1) |
| S-6 | **Live announcements policy.** One polite live region per page announces important changes: order status changes (SCR-09), payment result (SCR-07), cart changes, coupon results. Log panels, timers, temperatures and map movement are **not** announced (`aria-live="off"`) |
| S-7 | Errors and alerts that need immediate attention use `role="alert"`: payment failed, form error summary |
| S-8 | Tables use header cells and captions; sortable columns expose `aria-sort` |
| S-9 | Form controls have programmatic labels (dev label + plain label), required state, error messages linked with `aria-describedby`, `aria-invalid` when invalid; autocomplete attributes on contact and address fields (`name`, `email`, `tel`, `address-line1`, `address-line2`, `address-level2`, `address-level1`, `postal-code`) |
| S-10 | Decorative visuals (window dots, prompts, terminal prefixes, code-block decoration, glow, grid background, stack-trace windows) are hidden from assistive technology; their information, if any, is present as text |

---

## 7. Motion and animation

### 7.1 Reduced motion

When the user's system requests reduced motion (`prefers-reduced-motion: reduce`), the app applies this table. Contractors must also offer the same behavior to users of browsers without this setting if the platform allows; it is not required.

| Animation | Normal | Reduced motion |
|---|---|---|
| Terminal cursor blink | `motion.duration.blink`, step-end | Static block |
| LIVE dot pulse | `motion.duration.pulse` | Static dot |
| Skeleton shimmer | 1.5 s band | Static blocks |
| Drawer, modal, bottom sheet, toast enter/exit | Slide/scale `motion.duration.slow` | Opacity only, `motion.duration.fast` |
| Progress bars, bake bar, route progress | Width transition `motion.duration.progress` | Jump to the new value |
| Map courier marker | Moves along the route over `motion.duration.progress` | Jumps to the new position |
| Card hover image zoom, count-bubble bump, changed-line highlight in `manifest.json`, new-row highlight in tables | Short transitions | None (highlight replaced by a static 2 px left marker for 2 s) |
| Error page falling code / glitch | Background animation | None |
| Spinners while loading | Rotation | Static icon + "Loading" text |

### 7.2 Five-second rule (WCAG 2.2.2)

Repeating decorative animations that start without user action stop after **5 seconds** and stay in their static state until the next data change restarts them: cursor blink, LIVE pulse, skeleton shimmer (if loading lasts longer than 5 s the skeleton stays static). Loading spinners are exempt while loading is in progress. Auto-updating data (status, timers, logs, map) is the purpose of the demo and is not paused, but the log panel stops auto-scrolling as soon as the user scrolls up (components.md 5.8).

> **Assumption A-91 (design system):** tokens.md marks `motion.duration.blink` and `motion.duration.pulse` as infinite. To meet WCAG 2.2.2 without a pause control, these animations run in bursts of at most 5 s (this section). Visually the screens look the same at load and after every change.

### 7.3 Flashing

Nothing flashes more than three times per second. The 1 Hz cursor blink and the 0.5 Hz pulse are within limits. No full-screen flashes on errors.

---

## 8. Touch, pointer and layout

| # | Requirement |
|---|---|
| P-1 | Hit areas ≥ 44 × 44 px on phone and tablet widths, at least 8 px apart; on desktop compact 32 px controls are allowed only where components.md says so |
| P-2 | No function depends on hover, swipe, long-press or multi-finger gestures; bottom sheets have a close button; horizontal tab bars can also be operated by tapping visible tabs or arrow buttons |
| P-3 | Pointer actions trigger on release (up-event) so a mis-tap can be cancelled by moving away |
| P-4 | Reflow: at 320 px width and at 400 % zoom on desktop no content or function is lost and the page does not scroll horizontally, except inside scrollable regions (tables, code blocks, tab bars) — tokens.md section 5 |
| P-5 | Text resizes to 200 % without loss; containers grow in height instead of clipping text; buttons never truncate labels |
| P-6 | Text spacing (line height 1.5, paragraph spacing 2×, letter spacing 0.12 em, word spacing 0.16 em) applied by a user style does not clip or overlap content (WCAG 1.4.12) |
| P-7 | Orientation is not locked |
| P-8 | No text is rendered as an image, except the logo wordmark |

---

## 9. Forms, errors and timing

| # | Requirement |
|---|---|
| E-1 | Visible labels for all fields (dev label + plain label); placeholders are never labels (T-2) |
| E-2 | Errors are identified in text next to the field and, on submit, in a form summary; messages say how to fix the problem (`BR-DATA-08`) |
| E-3 | Before `Execute Order --force` the checkout shows the complete order summary (items, address, payment method, total) on the same page so the user can review it (WCAG 3.3.4); cancellation and rollback ask for confirmation (dialogs) |
| E-4 | No input disappears on error; the user's entries are kept |
| E-5 | Guest session (information model LITE-SES-04, LITE-SES-05): the session does not expire while a tab of the app is open; after expiry the visitor continues in a new session, and toast TXT-ERR-20 says that a non-empty cart was lost |
| E-6 | Toasts stay at least 4 s (success, info) or 8 s (warning, error), pause while hovered or focused, have a close icon, and never hold the only copy of information needed to continue (components.md 4.6) |
| E-7 | Payment processing (SCR-07) shows text progress, not only a spinner; the outcome is announced (S-6, S-7) |

---

## 10. Images

- Product photos: `alt` = `Product.imageAlt` (menu catalog). A placeholder (product without photo) keeps the same `alt` (assets README).
- Logo: `alt="Git Pizza MxDev logo"`; when the logo is inside a link or button whose accessible name already contains "Git Pizza MxDev" (header, footer), the image is decorative (`alt=""`) so the name is not read twice. The outlined wordmark `git_pizza mxdev` inside the logo files is not read as text.
- Empty-state and error illustrations and the map base image are decorative (`alt=""`); the text next to them carries the message.
- The simulated map has a text alternative (components.md 5.14).

---

## 11. Color is never the only carrier

Status (badges with label and icon), errors (icon + text), selected states (border width, check, `aria-*`), availability (`SOLD_OUT` text), required fields (`*` + text), links (underline in text), diet and spice (text tags), courier states (text chips), kitchen load (`HEAVY` text), toggles (`ON`/`OFF` text). Testers check every screen in grayscale (section 12, check A-11).

---

## 12. Verification checklist

Each check is pass/fail. `12-acceptance/` may reference them as "accessibility.md check A-n".

| Check | How to test | Pass criterion |
|---|---|---|
| AC-01 Automated scan | Run axe DevTools (or Accessibility Insights) on every screen in every mandatory state, desktop 1440 px and phone 390 px | No serious or critical violations, except the documented exceptions in 3.5 (comment/timestamp color) |
| AC-02 Token contrast | Inspect computed colors of: body text, muted captions, placeholders, error messages, all 11 order badges (normal and hover) | All values match sections 3.1–3.4 rules (T-1 … T-6, badge text colors) |
| AC-03 Input boundaries | Inspect every text input and prompt input | 1 px `#a28d79` bottom edge present |
| AC-04 Focus | Tab through the guest E2E journeys of the product brief with the keyboard only | Every step possible; ring always visible (F-1, F-2, F-7); skip link present; no trap |
| AC-05 Overlays | Open and close every modal, drawer, sheet and dialog with the keyboard | Focus moves in, is trapped, `Esc` closes (where allowed), focus returns |
| AC-06 Screen reader | NVDA + Chrome: guest delivery order (journey 1); VoiceOver iOS: tracking page | Dev labels announced with plain meaning; status changes announced once; payment result announced; log not read continuously |
| AC-07 Reduced motion | Enable reduced motion in the OS, repeat journey 1 and open SCR-09 | Table 7.1 behavior observed |
| AC-08 Five-second rule | Watch SCR-09 of an open order for 30 s | Cursor and LIVE dot are static 5 s after each data change |
| AC-09 Reflow and zoom | 320 px width; 200 % and 400 % browser zoom at 1280 px | No horizontal page scroll; no clipped text or hidden functions |
| AC-10 Touch targets | Measure interactive elements at 390 px and 834 px | ≥ 44 × 44 px (P-1) |
| AC-11 Color independence | View every screen with a grayscale filter | Every status, error, selection and availability still understandable |
| AC-12 Page titles and headings | Inspect each screen | Title format S-1; one `h1`; no skipped levels |
