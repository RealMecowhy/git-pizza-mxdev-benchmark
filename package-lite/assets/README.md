# Assets

All images the Lite app may use. Contractors use **only** these files and must not create, generate or download other logos, product photos or illustrations. Every listed file is present **except `illustrations/no-results.png`**; until it arrives, the app shows the placeholder defined in section 2 (or leaves that illustration out). A file the owner delivers later is added by the procedure of section 4.

## 1. Present assets

### 1.1 Brand — `brand/`

The official logo family **Pixel Slice**: a pixel-art pizza slice on a 16 × 16 grid (orange body `#ff9d00`, light crust `#ffc485`, three pepperoni cut out in `#131313`), with the wordmark `git_pizza mxdev` set in JetBrains Mono ExtraBold and converted to outlines. The brand name in text stays **Git Pizza MxDev**. Usage rules, sizes and placements: `07-design-system/logo-usage.md`.

| File | Format and size | Use |
|---|---|---|
| `brand/logo-horizontal.svg` | SVG, 1354 × 240, transparent | **Default app logo** (mark + wordmark side by side, colors for dark): header, error pages |
| `brand/logo-horizontal.png` | PNG, 1600 × 284, transparent | Same as raster |
| `brand/logo-mark.svg` | SVG, 1024 × 1024, transparent | Mark only: phone header, footer, home hero, confirmation |
| `brand/logo-mark.png` | PNG, 1024 × 1024, transparent | Same as raster |
| `brand/logo-git-pizza-mxdev.png` | PNG, 1024 × 1024, `#131313` square | Stacked logo (mark above wordmark) |
| `brand/logo-git-pizza-mxdev-transparent.png` | PNG, 1024 × 1024, transparent | Stacked logo on dark app surfaces |
| `brand/logo-mono-black.png` | PNG, 1600 × 284, transparent | Horizontal logo in black only (printed receipt, SCR-13) |
| `brand/app-icon.png` | PNG, 1024 × 1024, mark on rounded `#131313` tile | Home-screen / app icon source |
| `brand/icon-512.png`, `brand/icon-192.png` | PNG, 512 × 512 and 192 × 192 | Web app manifest icons |
| `brand/apple-touch-icon.png` | PNG, 180 × 180 | iOS home-screen icon |
| `brand/favicon.svg` | SVG, pixel mark (pixel-exact at 16 px) | Browser tab icon |
| `brand/favicon-16.png`, `brand/favicon-32.png`, `brand/favicon-48.png` | PNG, 16, 32 and 48 px | Fallback tab icons |
| `brand/og-image.png` | PNG, 1200 × 630 | Link previews (logo, tagline "Architect Your Perfect Crust.", `$ git checkout menu`) |

Obsolete and **never to be used**: the previous raster "git tree pizza" logo (pizza with a git branch tree labeled `master` / `feature` / `pull-request` and chrome lettering), Stitch logo variants 1–5, `pizza-mxdev-logo.*` (the triangle "Pizza MxDev Logo"), the cybernetic/minimalist/modern/neobrutalist logos, the animated SVG logo files, and any `PIZZA_OS` branding found in the Stitch export (`07-design-system/logo-usage.md` section 10).

### 1.2 Product photos — `products/` (1024 × 1024 JPEG)

All 25 products have a photo. Naming rule: `products/<code in lowercase>-<moduleKey>.jpg` (the same file name is in `09-demo-data/menu-items.json`, field `imageFile`).

| File | Product | Real-world dish |
|---|---|---|
| `products/pz-01-root-pizza.jpg` | PZ-01 The Root Pizza | Margherita |
| `products/pz-02-boolean-pepperoni.jpg` | PZ-02 Boolean Pepperoni | Pepperoni with hot honey |
| `products/pz-03-sql-supreme.jpg` | PZ-03 SQL Supreme | Supreme |
| `products/pz-04-binary-bbq.jpg` | PZ-04 Binary BBQ | BBQ pulled pork |
| `products/pz-05-inferno-payload.jpg` | PZ-05 Inferno Payload | Diavola |
| `products/pz-06-kernel-panic-meat.jpg` | PZ-06 Kernel Panic Meat | Meat lovers |
| `products/pz-07-truffle-kernel.jpg` | PZ-07 Truffle Kernel | Truffle & wild mushroom bianca |
| `products/pz-08-quad-core-formaggi.jpg` | PZ-08 Quad-Core Formaggi | Quattro formaggi |
| `products/pz-09-clean-code.jpg` | PZ-09 The Clean Code | Ortolana |
| `products/pz-10-low-mem-garden.jpg` | PZ-10 Low-Mem Garden | Vegan garden pizza |
| `products/pz-11-hawaiian-legacy-fix.jpg` | PZ-11 Hawaiian Legacy Fix | Hawaiian |
| `products/pz-12-calzone-container.jpg` | PZ-12 Calzone Container | Calzone |
| `products/sd-01-garlic-knot-loop.jpg` | SD-01 Garlic Knot Loop | Garlic knots with marinara |
| `products/sd-02-caesar-cipher-salad.jpg` | SD-02 Caesar Cipher Salad | Caesar salad |
| `products/sd-03-hot-wings-webhook.jpg` | SD-03 Hot Wings Webhook | Chili-glazed chicken wings |
| `products/sd-04-garlic-driver-dip.jpg` | SD-04 Garlic Driver Dip | Garlic & herb dip |
| `products/sd-05-jalapeno-patch-dip.jpg` | SD-05 Jalapeño Patch Dip | Jalapeño ranch dip |
| `products/dr-01-mate-compiler-tonic.jpg` | DR-01 Mate Compiler Tonic | Sparkling yerba mate |
| `products/dr-02-cold-brew-commit.jpg` | DR-02 Cold Brew Commit | Bottled cold brew coffee |
| `products/dr-03-cola-cache.jpg` | DR-03 Cola Cache | Classic cola can |
| `products/dr-04-lemon-lint-soda.jpg` | DR-04 Lemon Lint Soda | Italian lemon soda bottle |
| `products/dr-05-sparkling-stream-water.jpg` | DR-05 Sparkling Stream Water | Sparkling mineral water bottle |
| `products/ds-01-tiramisu-stack.jpg` | DS-01 Tiramisu Stack | Tiramisu cup (sold out in the Lite seed; the photo is still shown) |
| `products/ds-02-cannoli-callback.jpg` | DS-02 Cannoli Callback | Two Sicilian cannoli |
| `products/ds-03-lava-exception-cake.jpg` | DS-03 Lava Exception Cake | Molten chocolate lava cake |

Style (`07-design-system/imagery.md` section 2): square, top-down or three-quarter view, dark slate/stone surface, warm dramatic side light, moody dark background, high-end food photography, no text, no logos. Drinks show no real brand names; cans and bottles carry the Git Pizza MxDev product name or no text.

### 1.3 Illustrations — `illustrations/`

| File | Format and size | Content | Use (screen) | Status |
|---|---|---|---|---|
| `illustrations/map-sf-dark.jpg` | JPEG, 1600 × 1000, opaque dark | Stylized dark street map of San Francisco's Mission / SoMa area, no labels, no map-provider marks | Simulated delivery map on SCR-06 and SCR-09; the app draws the store marker, destination marker, route line and courier marker on top | present |
| `illustrations/empty-cart.png` | PNG, 800 × 600, transparent | Empty pizza box drawn as a terminal window | SCR-05 empty state | present |
| `illustrations/error-crust-not-found.png` | PNG, 800 × 600, transparent | Pizza with a missing slice | SCR-40 (decorative; the page works with text only) | present |
| `illustrations/error-seg-fault.png` | PNG, 800 × 600, transparent | Cracked oven with warning lights | SCR-41 (decorative) | present |
| `illustrations/no-results.png` | PNG, 800 × 600, transparent | Magnifier over a pizza slice made of code | SCR-02 no search results | **missing** — placeholder (section 2) or no illustration |

### 1.4 Avatars

Lite has no avatars. The courier card on SCR-09 shows the Material Symbol of the courier's vehicle type instead of a picture (FD-07, BR-TRK-10).

### 1.5 Icons — `icons/`

| File | Size | Meaning |
|---|---|---|
| `icons/icon-pizza-module.svg` / `.png` | 48 × 48 (PNG 96 × 96) | Pizza slice as a "module" token (menu, cart, module counts, placeholder) |
| `icons/icon-terminal-cli.svg` / `.png` | 48 × 48 (PNG 96 × 96) | Terminal prompt (logs, terminal panels) |
| `icons/icon-ci-cd-pipeline.svg` / `.png` | 48 × 48 (PNG 96 × 96) | Pipeline graph (tracking) |

The SVG files are plain SVG. All other UI icons come from Material Symbols Outlined (`07-design-system/tokens.md`, section 8). The brand icons are not the logo (`07-design-system/iconography.md` section 2).

## 2. Placeholder rule

When an image file is missing, the UI shows a **placeholder block** built from design tokens only (no image file). In Lite this applies to `illustrations/no-results.png`:

- Same size and aspect ratio as the final image (product images 1 : 1, illustrations 4 : 3).
- Background `color.surface.lowest`, 1 px dashed border `color.border.default`, radius `radius.xl`.
- Centered `icons/icon-pizza-module.svg` (or the Material Symbol `image`, for no-results `search_off`, for non-product images) at 32 px, 50 % opacity.
- Caption in `typography.micro`, `color.text.muted`: `IMAGE_PENDING // <file name>` — for example `IMAGE_PENDING // illustrations/no-results.png`.
- The image's alt text is still set (from `Product.imageAlt` for products).

The placeholder must be visibly a placeholder; contractors must not replace it with stock photos. For decorative illustrations (empty states) leaving the illustration out is equally allowed; the text must work alone.

## 3. Missing assets (to be delivered by the owner)

| File | Spec | Use (screen) |
|---|---|---|
| `illustrations/no-results.png` | 800 × 600, transparent PNG, magnifier over a pizza slice made of code, style of the other illustrations (`07-design-system/imagery.md` 2.3) | SCR-02 no search results |

## 4. How images are stored and how later images are added

| Kind | How the app holds it | Mechanism |
|---|---|---|
| Product photos (`products/`), the delivery map and illustrations (`illustrations/`) | **As data** (for example an image attribute of `Product`, or image records the screens look up by file name) or as static resources of the project | The files are packaged with the app in a project folder chosen by the contractor and named in `RUN/operations.md`; the seed (first start and every demo reset) loads each file named in `09-demo-data/` into the data. A missing file leaves the placeholder of section 2. |
| Brand files (`brand/`) and icons (`icons/`) | **In the project** (theme, static resources) | Part of the project; changed only by a new build. |

**Procedure when the owner delivers new files** (e.g. `no-results.png`):

1. Copy the files, with exactly the names of section 1 or 3, into the project folder named in `RUN/operations.md`.
2. Build and start the app.
3. Start it once with `Simulation.ResetOnStartup = true` (or wait for the scheduled reset); the seed now loads the new files. Brand files and icons appear after step 2.

No code or configuration change is needed.

## 5. Stitch layout references — `stitch-reference/`

Screenshots of the Stitch designs that the UI specification links to, copied unchanged from the Stitch designs (`desktop/`, `mobile/`). Lite keeps only the references of its own screens: desktop `home`, `menu-and-cart`, `module-configurator`, `ui-kit-asset-handover`, `cart-manifest-modal`, `delivery-and-payment`, `order-deployed-modal`, `order-status`, `system-error`, `ssh-auth` (terminal form style of SCR-10), `developer-profile` (style of SCR-13); mobile `menu-mobile`, `configurator-mobile`, `checkout-payment-mobile`, `delivery-status-mobile`. They are **layout references only**: texts, prices (PLN), products, statuses, dates and branding (`PIZZA_OS`, "Pizza MxDev", old logo variants, the `img` placeholder in headers, login and profile elements) are obsolete wherever they differ from the package. They are never shown in the app and are not assets of the app.
