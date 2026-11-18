# Design Tokens

One normalized token set for Git Pizza MxDev. The machine-readable version is [tokens.json](tokens.json) (W3C Design Tokens draft format); this page explains the roles and the decisions. Components, logo usage and icons are specified in the other files of `07-design-system/`.

The app has **one theme: dark**. There is no light mode.

**Sources.** All 20 Stitch screens share one Material-3-style tailwind palette (identical values in every `tailwind.config`), the same radii, spacing and type scale. Additional values come from inline styles in the Stitch HTML, the UI kit screen (`ui-kit-asset-handover`) and the Developer Handover doc. Where they disagree, section 9 lists the decision.

Contrast ratios below were calculated (WCAG 2.x formula) for the stated pairs.

---

## 1. Color

### 1.1 Surfaces (darkest to lightest)

| Token | Value | Role |
|---|---|---|
| `color.surface.lowest` | `#0e0e0e` | Terminal windows, code blocks, log panes, map well, inset areas |
| `color.surface.base` | `#131313` | Page background |
| `color.surface.low` | `#1b1b1c` | Cards, sidebar, side panels |
| `color.surface.container` | `#202020` | Header, footer, table header |
| `color.surface.high` | `#2a2a2a` | Elevated panes, card hover, selected nav item |
| `color.surface.highest` | `#353535` | Inputs, chips, segmented controls |
| `color.surface.bright` | `#393939` | Hover on inputs and chips |
| `color.surface.glass` | `rgba(26,26,26,0.8)` | Glass panels: always with `blur.glass` (12 px) and `color.border.default` |
| `color.overlay.scrim` | `rgba(0,0,0,0.6)` | Backdrop behind modals, drawers, bottom sheets |
| `color.overlay.grid` | `rgba(255,196,133,0.03)` | Optional 32 px background grid (home, confirmation) |

### 1.2 Text

| Token | Value | Role | Contrast on `surface.base` |
|---|---|---|---|
| `color.text.primary` | `#e5e2e1` | Main text | 14.4 : 1 |
| `color.text.secondary` | `#dac2ad` | Descriptions, secondary text | 10.1 : 1 (on `surface.low`) |
| `color.text.muted` | `#a28d79` | Captions, metadata, placeholders | 5.9 : 1 (5.1 on `surface.container`) |
| `color.text.disabled` | `#6e6e6e` | Disabled controls and code comments only; never for essential information | 3.6 : 1 |
| `color.text.inverse` | `#131313` | Text on light fills | — |

### 1.3 Brand and semantic colors

| Token | Value | Role | Text on fill (`.on`) | Contrast |
|---|---|---|---|---|
| `color.primary.default` | `#ff9d00` | **Pizza Orange.** Brand color; fill of primary CTAs (`Execute Order --force`, `Build & Deploy`, `+ import`); active progress; BAKING | `#2c1700` | 8.2 : 1 |
| `color.primary.hover` | `#ffb869` | Primary CTA hover | `#2c1700` | — |
| `color.primary.pressed` | `#e08a00` | Primary CTA pressed | `#2c1700` | — |
| `color.primary.light` | `#ffc485` | Accent text, links, active nav item, active tab underline (2 px), icons on dark, secondary-CTA outline | `#2c1700` (when used as fill) | 11.9 : 1 as text on base |
| `color.primary.subtle` | `rgba(255,157,0,0.12)` | Selected option background (size, crust) | — | — |
| `color.primary.border` | `rgba(255,157,0,0.2)` | Accent borders | — | — |
| `color.success.default` | `#00ff41` | **Terminal Green.** Success fills (e.g. `SEAL & MOVE TO DISPATCH`), LIVE dot, DEPLOYED/PULLED | `#003907` | 9.7 : 1 |
| `color.success.text` | `#72ff70` | Success text, log text, prompt | — | 14.9 : 1 on `surface.lowest` |
| `color.warning.default` | `#f1fa8c` | Warnings, STAGED, `DONE! PULL NOW` | `#1f2000` | 14.9 : 1 |
| `color.error.default` | `#ff5555` | Errors, destructive actions, PAYMENT_FAILED, ROLLED_BACK | `#131313` | 5.9 : 1 |
| `color.error.text` | `#ffb4ab` | Field error messages, error text on dark | — | 10.9 : 1 |
| `color.error.container` | `#93000a` | Strong danger fills (not used on Lite screens) | `#ffdad6` | 7.2 : 1 |
| `color.info.default` | `#38bdf8` | **Accent Cyan.** Info, dispatch/transit states, map route, `[INFO]` log tag | `#082f49` | 6.5 : 1 |
| `color.tertiary.default` | `#dec4ff` | QA stage, syntax keywords | — | — |
| `color.tertiary.container` | `#c8a2ff` | QA badge fill | `#290055` | 8.2 : 1 |

Each semantic color also has a `.subtle` value (12 % alpha) for badge backgrounds with colored text.

### 1.4 Borders

| Token | Value | Role |
|---|---|---|
| `color.border.default` | `#333333` | Panels, cards, inputs (1 px) |
| `color.border.subtle` | `#2a2a2a` | Dividers inside panels |
| `color.border.strong` | `#544433` | Header and footer separators |
| `color.border.accent` | `rgba(255,157,0,0.2)` | Highlighted panels |
| `color.border.focus` | `#ffc485` | Keyboard focus ring: 2 px solid, 2 px offset, on every interactive element |

### 1.5 Order status colors

Used by status badges, pipeline stepper nodes and table chips. Badge style: `.subtle` background + status color text + 1 px border in the status color, label in `typography.label`.

| Token | Value | States (dev label) | Glow |
|---|---|---|---|
| `color.status.staged` | `#f1fa8c` | PAYMENT_PENDING (`STAGED`) | — |
| `color.status.failed` | `#ff5555` | PAYMENT_FAILED, CANCELLED (`ROLLED_BACK`) | `glow.statusFailed` |
| `color.status.queued` | `#a28d79` | QUEUED | `glow.statusQueued` |
| `color.status.baking` | `#ff9d00` | BAKING | `glow.statusBaking` |
| `color.status.qa` | `#dec4ff` | QA_CHECK | — |
| `color.status.dispatch` | `#38bdf8` | READY_FOR_DISPATCH (`DISPATCH_READY`), READY_FOR_PICKUP (`READY_TO_PULL`), OUT_FOR_DELIVERY (`IN_TRANSIT`) | `glow.statusDispatch` |
| `color.status.deployed` | `#00ff41` | DELIVERED (`DEPLOYED`), PICKED_UP (`PULLED`) | `glow.statusDeployed` |

Color is never the only carrier of status: every badge also shows its label text.

### 1.6 Syntax highlighting (code blocks, `manifest.json`, product code snippets)

| Token | Value | Applies to |
|---|---|---|
| `color.syntax.keyword` | `#dec4ff` | `const`, `interface`, `import`, `export`, `def` |
| `color.syntax.string` | `#72ff70` | `'San Marzano'` |
| `color.syntax.number` | `#ffb869` | `14.99`, `450` |
| `color.syntax.function` | `#ffc485` | `fetchInventory()`, object names |
| `color.syntax.property` | `#e5e2e1` | `base:`, `sauce:` |
| `color.syntax.boolean` | `#38bdf8` | `true`, `false` |
| `color.syntax.comment` | `#6e6e6e`, italic | `// comment` |
| `color.syntax.punctuation` | `#a28d79` | `{ } [ ] , ;` |
| `color.syntax.error` | `#ffb4ab` | error lines on the error page |

### 1.7 Logs and terminal chrome

| Token | Value | Role |
|---|---|---|
| `color.log.info` | `#38bdf8` | `[INFO]`, `[ROUTER]`, `[COURIER]` tags |
| `color.log.success` | `#72ff70` | `[SUCCESS]`, `[DEPLOY]`, `[PAYMENT]` success |
| `color.log.warn` | `#f1fa8c` | `[WARN]` |
| `color.log.error` | `#ff5555` | `[ERROR]`, `[ROLLBACK]` |
| `color.log.debug` | `#a28d79` | `[DEBUG]` (internal lines only) |
| `color.log.timestamp` | `#6e6e6e` | `[18:30:44]` (decorative; the message text carries the information) |
| `color.terminal.dotRed` / `dotYellow` / `dotGreen` | `#ef4444` / `#eab308` / `#22c55e` | Window-chrome dots on terminal panels |
| `color.terminal.cursor` | `#72ff70` | Blinking block cursor (8 × 18 px); amber variant uses `color.primary.light` |

### 1.8 Brand (logo) colors

The official Pixel Slice logo (a pixel-art pizza slice on a 16 × 16 grid with three pepperoni cut out of it, with the wordmark `git_pizza mxdev`) uses these fixed colors. They exist **inside the logo files**; use them in the UI only when echoing the logo (e.g. a pixel decoration). Logo usage rules are in `07-design-system/logo-usage.md`.

| Token | Value | Part of the logo |
|---|---|---|
| `color.brand.slice` | `#ff9d00` | Slice body and the wordmark underscore (= `color.primary.default`) |
| `color.brand.crust` | `#ffc485` | Crust (= `color.primary.light`) |
| `color.brand.ink` | `#131313` | Pepperoni cut-outs (= `color.surface.base`) |
| `color.brand.wordmarkOnDark` | `#f5f5f5` | Wordmark `git` and `pizza` on dark backgrounds |
| `color.brand.wordmarkOnLight` | `#131313` | Wordmark `git` and `pizza` on light backgrounds |
| `color.brand.mxdevOnDark` | `#00ff41` | Wordmark `mxdev` on dark backgrounds (= `color.success.default`) |
| `color.brand.mxdevOnLight` | `#00a82b` | Wordmark `mxdev` on light backgrounds |
| `color.brand.logoBackground` | `#131313` | Tile of the app icon, the stacked logo on dark square and the OG image |

The tokens `color.brand.branchMaster`, `branchFeature` and `branchPullRequest` and the old logo background `#0d1117` belonged to the previous raster logo and are removed.

---

## 2. Typography

| Family token | Value | Use |
|---|---|---|
| `font.family.mono` | `'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace` | **Everything**: headings, labels, buttons, inputs, prices, code, logs, tables |
| `font.family.body` | `'Geist', 'Inter', system-ui, sans-serif` | Long paragraphs only: product descriptions, hero paragraph, help text longer than one line |

Both fonts are free (SIL Open Font License) and available from Google Fonts. Weights used: 400, 500, 600, 700.

| Token | Font | Size / line height / weight / tracking (desktop) | Phone | Use |
|---|---|---|---|---|
| `typography.display` | mono | 48 / 1.1 / 700 / −0.02em | 32 / 1.15 | Hero headline ("Architect Your Perfect Crust") |
| `typography.h1` | mono | 32 / 1.2 / 600 / −0.01em | 24 | Page titles (`DEPLOYMENT_STATUS`) |
| `typography.h2` | mono | 24 / 1.25 / 600 | 20 | Section titles |
| `typography.h3` | mono | 18 / 1.3 / 600 | 16 | Card titles, module names |
| `typography.bodyLong` | body | 16 / 1.6 / 400 | 15 | Descriptions, paragraphs |
| `typography.body` | mono | 14 / 1.5 / 400 | 14 | Default UI text |
| `typography.bodySmall` | mono | 13 / 1.5 / 400 | 13 | Table cells, secondary UI text |
| `typography.code` | mono | 14 / 1.4 / 500 | 13 | Code blocks |
| `typography.codeSmall` | mono | 12 / 1.5 / 500 | 12 | Log lines, terminal output |
| `typography.label` | mono | 12 / 1.0 / 700 / +0.05em, UPPERCASE | 12 | Section labels, buttons, badges |
| `typography.micro` | mono | 11 / 1.2 / 500 / +0.02em | 11 | Chips, version tags, footnotes; never full sentences |
| `typography.priceLarge` | mono | 32 / 1.1 / 700 / −0.01em | 24 | Order total, ETA countdown |

Numbers use the monospace font so prices and timers align in columns. Users must be able to zoom text to 200 % without loss of content (see `11-non-functional/`).

---

## 3. Spacing and layout

Base unit 4 px.

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `space.1` | 4 px | | `space.6` | 24 px |
| `space.2` | 8 px | | `space.8` | 32 px |
| `space.3` | 12 px | | `space.10` | 40 px |
| `space.4` | 16 px | | `space.12` | 48 px |
| `space.5` | 20 px | | `space.16` | 64 px |

| Layout token | Value | Role |
|---|---|---|
| `layout.gutter` | 16 px | Grid gutter |
| `layout.marginPhone` / `marginTablet` / `marginDesktop` | 16 / 32 / 64 px | Page side margins |
| `layout.containerMax` | 1280 px | Max content width (excluding sidebar) |
| `layout.sidebarWidth` | 256 px | Project Explorer sidebar (desktop) |
| `layout.sidePanelWidth` | 320 px | Terminal Debugger cart panel on the desktop menu |
| `layout.drawerWidth` | 480 px | Cart drawer on desktop and tablet |
| `layout.headerHeight` | 72 px (phone 56 px) | Header |
| `layout.bottomNavHeight` | 64 px + safe-area inset | Phone bottom tabs |
| `layout.demoBannerHeight` | 32 px | DEMO MODE banner |
| `layout.touchTargetMin` | 44 × 44 px | Minimum touch target on phone and tablet |
| `layout.modalMaxWidth` | 640 px | Modals (confirmation, item info) |

---

## 4. Radius, borders, elevation

| Token | Value | Use |
|---|---|---|
| `radius.none` | 0 | Terminal tabs, table cells |
| `radius.sm` | 2 px | **Default.** Buttons, inputs, chips, badges |
| `radius.md` | 4 px | Cards, panels, terminal windows |
| `radius.lg` | 8 px | Modals, drawers, bottom sheets (top corners) |
| `radius.xl` | 12 px | Product image frames |
| `radius.full` | 9999 px | Status dots, count bubbles, map markers |
| `borderWidth.default` | 1 px | All borders |
| `borderWidth.strong` | 2 px | Active tab underline, selected option, focus ring |

The look is sharp and slightly neo-brutalist: small radii, 1 px borders, depth from surface steps and glows rather than heavy shadows.

| Token | Value | Use |
|---|---|---|
| `shadow.elevation1` | `0 1px 8px rgba(0,0,0,0.3)` | Card hover, header |
| `shadow.elevationTop` | `0 -2px 12px rgba(0,0,0,0.4)` | Phone bottom bar, sticky CTA bar |
| `shadow.modal` | `0 16px 48px rgba(0,0,0,0.6)` | Modals, drawers |
| `glow.primarySmall` | `0 0 12px rgba(255,196,133,0.3)` | Hover/active on primary elements, selected option |
| `glow.primaryMedium` | `0 0 24px rgba(255,157,0,0.45)` | Primary CTA |
| `glow.primaryLarge` | `0 0 32px rgba(255,157,0,0.65)` | Hero CTA, confirmation icon |
| `glow.success` | `0 0 8px rgba(114,255,112,0.8)` | LIVE dot |
| `glow.status*` | 12 px, 20–25 % alpha of the status color | Stepper node of the current state |
| `glow.textTerminal` | `0 0 8px rgba(114,255,112,0.4)` (text-shadow) | Green terminal text |
| `blur.glass` | 12 px | Glass panels, modal backdrop |
| `opacity.disabled` | 0.38 | Disabled controls (plus `cursor: not-allowed` and an explanation where the reason is not obvious) |

---

## 5. Breakpoints

| Token | Range | Design reference | Layout summary |
|---|---|---|---|
| `breakpoint.phone` | 0 – 767 px | 390 px (Stitch mobile screens) | Single column; header 56 px with logo and cart; bottom tab bar (Source · Deploy · Trace); drawers and modals become full-screen pages or bottom sheets |
| `breakpoint.tablet` | 768 – 1199 px | 834 px | Header nav; sidebar collapsed to an icon rail (or hidden behind a menu button); menu grid 2 columns; cart drawer 480 px |
| `breakpoint.desktop` | ≥ 1200 px | 1280 – 1440 px (Stitch desktop screens, rendered at 2× = 2560 px) | Full layout: header, 256 px Project Explorer sidebar, content, optional 320 px right panel |
| `breakpoint.wide` | ≥ 1440 px | — | Same as desktop; content max width `layout.containerMax` |

No horizontal page scrolling is allowed at any width ≥ 320 px, except inside explicitly scrollable regions (tables, code blocks).

---

## 6. Z-index

| Token | Value | Layer |
|---|---|---|
| `zIndex.base` | 0 | Page content |
| `zIndex.raised` | 10 | Cards on hover, sticky table headers |
| `zIndex.sidebar` | 90 | Project Explorer |
| `zIndex.stickyHeader` | 100 | Header |
| `zIndex.bottomNav` | 100 | Phone bottom tabs |
| `zIndex.demoBanner` | 110 | DEMO MODE banner |
| `zIndex.dropdown` | 200 | Menus, selects, autocomplete |
| `zIndex.drawer` | 300 | Cart drawer |
| `zIndex.scrim` | 400 | Modal backdrop |
| `zIndex.modal` | 410 | Modals, dialogs, bottom sheets |
| `zIndex.toast` | 500 | Toast notifications |
| `zIndex.tooltip` | 600 | Tooltips |

---

## 7. Motion

| Token | Value | Use |
|---|---|---|
| `motion.duration.fast` | 120 ms | Hover, press |
| `motion.duration.base` | 200 ms | Toggles, tabs, chips, accordion |
| `motion.duration.slow` | 320 ms | Drawer, modal, bottom sheet enter/exit |
| `motion.duration.progress` | 1000 ms | Progress bars and map-marker movement between two updates |
| `motion.duration.blink` | 1000 ms, `step-end`, infinite | Terminal cursor |
| `motion.duration.pulse` | 2000 ms, infinite | LIVE dot |
| `motion.easing.standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default |
| `motion.easing.emphasized` | `cubic-bezier(0.3, 0, 0, 1)` | Drawer and modal enter |
| `motion.easing.linear` | `linear` | Progress, route movement |

With `prefers-reduced-motion: reduce`: no blinking cursor (static), no pulse, no falling code on error pages, drawers and modals appear without sliding, the map marker jumps to its new position.

---

## 8. Icons

`icon.family` = **Material Symbols Outlined** (FILL 0, wght 400, GRAD 0, opsz 24), sizes `icon.size.sm` 16, `md` 20, `lg` 24 (default), `xl` 32. Icons used in Stitch include `terminal`, `shopping_cart`, `rocket_launch`, `folder`, `history`, `settings`, `local_pizza`, `local_fire_department`, `local_shipping`, `fact_check`, `check_circle`, `schedule`, `tune`, `extension`, `content_copy`, `delete`, `moped`, `two_wheeler`, `verified`, `warning`, `block`. The three brand icons (pizza module, terminal CLI, CI/CD pipeline) are in `assets/icons/`.

---

## 9. Where Stitch disagreed, and what was chosen

| Topic | Stitch / handover values | Decision |
|---|---|---|
| Primary CTA fill | Most Stitch screens render buttons in `#ffc485` (tailwind `primary`); the status page, UI kit and Handover doc use `#FF9D00` ("Pizza Orange … main CTA") | `#ff9d00` = `color.primary.default` for primary CTA fills; `#ffc485` = `color.primary.light` for accent text, links, active states and focus |
| Success green | `#00FF41` (PRD, Handover, UI kit), `#13ff43` (`secondary-container`), `#00e639` (`secondary-fixed-dim`), `#72ff70` (`secondary-fixed`, log text) | Fill `#00ff41`; text on dark `#72ff70`. `#13ff43` and `#00e639` are not used |
| Error red | `#FF5555` (Handover), `#EF4444` (UI kit "Danger / Abort"), `#ffb4ab` / `#93000a` (tailwind) | Fill `#ff5555`; text `#ffb4ab`; strong danger container `#93000a`. `#ef4444` is used only for the terminal window dot |
| Warning | Only in the Handover doc (`#F1FA8C`) | `#f1fa8c` |
| Info / cyan | `#38BDF8` (UI kit "Accent Cyan", used in 8 places) | `#38bdf8` |
| Page background | `#131313` (tailwind `background`) vs `#0D0D0D` (body style on 5 screens) | Page `#131313`; `#0e0e0e` for terminal/inset areas. `#0D0D0D` dropped |
| Borders | `#333333` (most inline styles), `#2A2A2D` (Handover), `#544433` (`outline-variant`), `#30363d` (2 places) | `#333333` default; `#2a2a2a` subtle; `#544433` strong. `#2A2A2D` and `#30363d` dropped |
| Syntax colors | Strings `#72ff70` / `#ecffe3` / `#ffc485`; keywords `#dec4ff` / `#ffc485`; booleans `#72ff70` / `#00ff41`; comments `#6e6e6e` / `#a28d79` | Table 1.6: one value per role |
| Body font | Tailwind configs: `Geist` for `body-md`; Handover and PRD: "JetBrains Mono for all UI elements" | JetBrains Mono for everything except long paragraphs, which use Geist (assumption A-15) |
| Type scale | Tailwind: 48 / 32 / 24 / 16 / 14 / 12; Handover: H1 36, H2 24, H3 18, body 14, code 12–13 | Section 2 merges both: display 48, h1 32, h2 24, h3 18, body 14 (mono) / 16 (Geist), code 14, log 12 |
| Radius naming | Tailwind `DEFAULT 2px`, `lg 4px`, `xl 8px`, `full 12px` (non-standard "full") | Renamed to sm 2 / md 4 / lg 8 / xl 12 / full 9999 |
| Breakpoints | Not defined in Stitch (tailwind defaults) | Section 5 |
| Elevation, z-index, motion durations | Not defined beyond a few inline shadows and the blink animation | Sections 4, 6, 7 (values marked "added" in tokens.json are new) |
