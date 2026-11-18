# Design System — Git Pizza MxDev

The visual language of the app: a dark developer IDE with terminal, git and CI/CD metaphors, set in JetBrains Mono, carrying a real, appetizing pizza business. This folder tells you exactly how every part of the interface looks and behaves, so that apps built by different teams look the same.

![Git Pizza MxDev](../assets/brand/logo-horizontal.png)

---

## 1. Files

| File | Contents | Read when |
|---|---|---|
| [tokens.md](tokens.md) | All design tokens with roles: colors (surfaces, text, brand, semantic, order status, syntax, logs), typography, spacing, layout, radius, elevation and glows, breakpoints, z-index, motion, icon sizes; decisions where Stitch disagreed | First. Foundation file: binding |
| [tokens.json](tokens.json) | The same tokens, machine-readable (W3C Design Tokens draft format) | When setting up the theme |
| [components.md](components.md) | Every reusable component: anatomy, variants, states, token usage, behavior, accessibility; component-per-screen matrix; differences from Stitch | While building any screen |
| [iconography.md](iconography.md) | Material Symbols Outlined settings and the icon vocabulary (one icon per meaning); the three brand icons in `assets/icons/` | When placing icons |
| [logo-usage.md](logo-usage.md) | The official Pixel Slice logo family: construction and colors, every file and when to use it, brand name vs wordmark styling, placements and sizes, clear space, minimum sizes, backgrounds, forbidden uses, obsolete logos | When placing the logo or the brand name |
| [imagery.md](imagery.md) | Photo and illustration style, aspect ratios per usage, cropping, sold-out and placeholder treatment | When showing any image |
| [accessibility.md](accessibility.md) | WCAG 2.1 AA target, computed contrast of all token pairs, the resulting color rules, focus, keyboard, semantics, motion reduction, verification checks | Before building components; before testing |

Related: [../assets/README.md](../assets/README.md) (image files, the one missing image, placeholder rule) · [../01-product-brief/glossary.md](../01-product-brief/glossary.md) (dev labels and their plain meaning) · [../05-processes/order-lifecycle.md](../05-processes/order-lifecycle.md) (order states, dev labels, status colors) · `06-ui-specification/` (screens, texts, responsive behavior per screen).

---

## 2. Principles

1. **IDE on the outside, restaurant on the inside.** Dev labels, file tabs, terminals and pipelines are the interface; menu items, prices, allergens and times are real and correct. Never use placeholder or joke content where a customer expects facts.
2. **Every dev label has a plain meaning.** Shown as sub-label, tooltip or accessible name (glossary rule). Buttons that spend money or cancel state the plain action in their accessible name.
3. **Dark only.** One theme. Depth comes from surface steps (`surface.lowest` → `surface.bright`) and glows, not from heavy shadows.
4. **Orange acts, green confirms.** Pizza Orange (`color.primary.default`) is the customer's call to action; Terminal Green (`color.success.*`) means success, live and completed; cyan is information and transit; red is error and cancel.
5. **Sharp and precise.** Small radii (2–4 px), 1 px borders, monospace numbers that align in columns.
6. **Color is never alone.** Status, errors and selection always carry text and/or an icon as well.
7. **Accessible by default.** WCAG 2.1 AA, 44 px touch targets, visible focus, reduced motion honored.
8. **Only official assets.** One logo family, the product photos, illustrations and icons in `assets/`, Material Symbols. A missing image (today only `illustrations/no-results.png`) shows the defined placeholder.

---

## 3. How to apply it in Mendix

The package does not prescribe implementation. These are the results the build must achieve:

| Area | Required result |
|---|---|
| Tokens | Every color, font size, spacing, radius, shadow, z-index and duration used in the app is a value from `tokens.md`. You may name them as you like in your theme, but keep a mapping in your delivery notes (token name → your variable or class). No other color values appear, except inside images and the three brand-icon files |
| Fonts | JetBrains Mono (400, 500, 600, 700) and Geist (400) — both SIL Open Font License — and Material Symbols Outlined (Apache 2.0). They should be bundled with the app so the UI renders without third-party requests and without visible fallback flashes |
| Components | Built once and reused; the same component looks and behaves identically on every screen where `components.md` section 8 lists it |
| Breakpoints | Phone 0–767 px, tablet 768–1199 px, desktop ≥ 1200 px (`tokens.md` section 5); the phone layout is the Stitch mobile design |
| Theme switch | None (dark only) |
| Stitch | The Stitch screens are visual reference only. Where Stitch differs from this folder, this folder wins (`components.md` section 9, `tokens.md` section 9) |

---

## 4. Decisions made in this folder

| # | Decision | Where |
|---|---|---|
| 1 | Status badge **label text** for PAYMENT_FAILED / CANCELLED uses `color.error.text` and for QUEUED `color.text.secondary`, because the raw status colors fall below 4.5 : 1 on `surface.container` and `surface.high`. Border, icon and fill keep the status color | accessibility.md 3.3, components.md 4.1 |
| 2 | Input placeholders use `color.text.secondary` italic; `color.text.muted` is never used on `surface.highest` / `surface.bright` | accessibility.md 3.2 |
| 3 | Text inputs get a 1 px bottom edge in `color.text.muted` so the field boundary reaches 3 : 1 | accessibility.md 3.4, components.md 3.1 |
| 4 | `danger-strong` buttons (not used on Lite screens) get a 1 px `color.error.default` border | accessibility.md 3.4 |
| 5 | Repeating decorative animations run at most 5 s after each start or data change (Assumption A-91) | accessibility.md 7.2 |
| 6 | Log timestamps and code comments stay `#6e6e6e` as decorative text (Assumption A-90) | accessibility.md 3.5 |
| 7 | Header uses the horizontal logo (`logo-horizontal.svg`) on desktop and tablet and the mark only on phone; the brand name is never shown twice next to a lockup | logo-usage.md 4, 5 |
| 8 | No green buttons; all CTAs are orange | components.md 2.1 |
| 9 | Product code blocks follow one template generated from the default recipe | components.md 5.2 |
| 10 | Order-status icons are fixed per state | components.md 4.1, iconography.md 1.1 |

---

## 5. Design acceptance checks

Each check is pass/fail; `12-acceptance/` may reference them as "07-design-system check n". Detailed sub-checks: accessibility.md section 12 (AC-01 … AC-12), iconography.md section 3 (I-1 … I-4), logo-usage.md section 11 (G-1 … G-6), imagery.md section 7 (M-1 … M-5).

| # | Check | Pass criterion |
|---|---|---|
| 1 | Token fidelity | Inspect 30 elements across SCR-01, SCR-02, SCR-09: every computed color, font size, radius and spacing equals a token value |
| 2 | Typography | All UI text in JetBrains Mono; only product descriptions, hero paragraph and multi-line help text in Geist; no other font visible |
| 3 | Status badges | All 11 order states render with the dev label, icon, colors and text colors of components.md 4.1 (use the seed orders found with the lookup on SCR-10, and orders placed during the check) |
| 4 | Buttons | Variants and colors per components.md 2.1; no green button on customer screens; every primary CTA has the loading state (no double submit) |
| 5 | Branding | logo-usage.md checks G-1 … G-6 pass |
| 6 | Icons | iconography.md checks I-1 … I-4 pass |
| 7 | Images | imagery.md checks M-1 … M-5 pass |
| 8 | Accessibility | accessibility.md checks AC-01 … AC-12 pass |
| 9 | Responsive | At 390, 834, 1280 and 1440 px every screen matches the layout summary of tokens.md section 5; no horizontal page scroll at 320 px |
| 10 | Consistency | The same component looks the same on every screen it appears on (spot check: status badge, button, field, toast on 5 screens each) |
