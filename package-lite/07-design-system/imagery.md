# Imagery

How photos and illustrations look and how the app displays them. The list of image files (all present except `illustrations/no-results.png`, delivered 2026-11-05) and the placeholder rule are in [../assets/README.md](../assets/README.md); this file defines style, aspect ratios, cropping and treatment. Contractors never create, generate, download or substitute images (product brief section 8): a missing image shows the placeholder until the owner delivers the file.

---

## 1. Principles

1. **Real food, real appetite.** Photos show the actual dish as described in the menu catalog, with the listed ingredients visible. The IDE theme lives in the interface, not in the food.
2. **One dark, warm look.** Every image sits on the dark UI; photos are low-key with warm light so they feel like one shoot.
3. **No text in images.** Names, prices and labels are live text in the UI. Exception: the drink packaging, which may show the Git Pizza MxDev product name.
4. **No foreign brands.** No real brand names, logos or labels on packaging, bottles, glasses or props.
5. **No UI in photos.** No laptops, monitors, phones or screenshots in product photos (several Stitch mockups had them; those images are not assets).

---

## 2. Photo style

All 25 product photos in `assets/products/` follow this style (1024 × 1024 JPEG). The rules describe them and apply to any photo the owner adds later.

### 2.1 Food (pizzas, sides, desserts)

| Aspect | Rule |
|---|---|
| Format | Square, 1024 × 1024 px JPEG |
| Angle | Three-quarter view from above (about 45–60°) or straight top-down; the whole pizza visible |
| Subject | One product as served: Neapolitan-style pizza with a puffy, leopard-spotted (charred) rim, sliced into the number of slices of its default size (8 for Medium/Large; calzone whole) |
| Surface | Dark slate or dark stone, optionally a dark wooden pizza peel or board under the pizza |
| Light | Warm, directional side light (late-evening restaurant feel), soft shadows, gentle highlights on cheese and oil |
| Background | Dark, slightly out of focus; low-key overall exposure |
| Props | Few and neutral: a pizza cutter, a fork, a linen napkin, small bowls with chili flakes or olive oil, scattered basil leaves or flour. Unbranded only |
| Beverages as props | Allowed only as unbranded, unlabeled glasses in the background. New photos should not show alcohol (wine, beer) because the store does not sell it; the existing PZ-04 and PZ-05 photos are accepted as they are |
| Color | Natural food colors; no heavy color grading, no neon tint on food |
| Composition | Subject centered with at least 8 % margin to every edge so the crops in section 3 keep the dish recognizable |
| Not allowed | People or hands, text, logos, watermarks, cartoon or illustration style, UI screens, impossible toppings, ingredients that are not in the recipe |

### 2.2 Drinks

| Aspect | Rule |
|---|---|
| Format | Square, 1024 × 1024 px JPEG |
| Subject | One can or bottle in its catalog serving size (`12 fl oz can`, `12 fl oz bottle`, `11.2 fl oz bottle`, `16.9 fl oz bottle`), front-facing, condensation droplets |
| Packaging | Dark, matte; may carry the Git Pizza MxDev product name (e.g. "Mate Compiler Tonic") and abstract circuit-line graphics in the brand colors (green, orange, cyan). No other brands, no invented brand names, no nutrition panels |
| Set | Dark tech set: blurred workbench or circuit-board background with soft orange and green rim lights, as in DR-01 |
| Not allowed | Real brand look-alikes, alcohol, people |

### 2.3 Illustrations (empty states, errors, map)

| Aspect | Rule |
|---|---|
| Style | Flat or line-art, terminal/IDE flavor, drawn with token colors only: outlines in `color.text.secondary` / `color.text.muted`, accents in `color.primary.default`, `color.success.default`, `color.info.default` |
| Background | Transparent PNG (empty states, errors); the map is opaque dark |
| Format | Empty states and errors 800 × 600 (4 : 3), transparent PNG; map 1600 × 1000 (16 : 10), JPEG |
| Text | None (the empty-state title and message are live text) |
| Map | Stylized dark wireframe street grid of San Francisco's Mission / SoMa area; base `#0e0e0e`–`#202020`, streets in `#333333`–`#544433`, no labels, no points of interest, no real map-provider marks. It must stay dark enough that the markers of components.md 5.14 keep at least 3 : 1 against it |

## 3. Aspect ratios and display sizes per usage

The source product photos are square. Each slot crops them with `object-fit: cover`, focal point at the center.

| Usage | Screen | Aspect ratio | Display size (desktop / phone) | Notes |
|---|---|---|---|---|
| Menu item card | SCR-02 | 16 : 10 | card width / full width | SCR-02 E-08d |
| Featured carousel card | SCR-01 | 16 : 10 (large first card: image left, 1 : 1) | per SCR-01 E-11 | Same card component |
| Configurator product header | SCR-03 | 1 : 1 | 160 px / 160 px | SCR-03 E-02 |
| Item info | SCR-04 | 1 : 1 | 240 px / 160 px | SCR-04 layout |
| Cart line thumbnail | SCR-05 | 1 : 1 | 56 px / 56 px | `radius.md` |
| Checkout summary line | SCR-06 | — | not shown | Text only |
| Order detail line | SCR-13 | 1 : 1 | 40 px / 40 px | |
| Simulated map | SCR-06, SCR-09 | 16 : 10 desktop / 4 : 3 phone | panel width | Cover crop centered on the store |
| Empty-state illustration | SCR-02, SCR-05 | 4 : 3 | max 320 px wide / max 240 px | Shown whole (`object-fit: contain`), transparent; SCR-02 `no-results.png` still missing → placeholder or no illustration |
| Error illustration | SCR-40, SCR-41 | 4 : 3 | max 400 px / max 280 px | `error-crust-not-found.png` (SCR-40), `error-seg-fault.png` (SCR-41); the page must still work without it |
| Logo | see [logo-usage.md](logo-usage.md) | horizontal 1354 : 240, mark 1 : 1 | per logo-usage.md 5 | SVG preferred |
| Social preview | link previews | 1200 × 630 | — | `og-image.png` |

A 16 : 10 crop of a square photo shows the middle 62.5 % of its height; the top and bottom of round pizzas are cut, which is accepted (as in the Stitch menu cards).

---

## 4. Treatment in the UI

| Situation | Treatment |
|---|---|
| Default | No filters, no color overlays; frame `radius.xl` (card images: top corners follow the card `radius.md`) |
| Text over an image | Only on the bottom gradient (transparent → `surface.base` at 85 % over the lower 40 %), components.md 5.3 |
| Hover (menu card) | Scale 1.03 inside the frame, `motion.duration.base`; none under reduced motion |
| Sold out | Grayscale 100 %, opacity 60 %, chip `404: OUT_OF_STOCK` centered |
| Loading | Skeleton block with the slot's aspect ratio (no layout shift) |
| Missing file | Placeholder per assets README section 2 (`IMAGE_PENDING // <file name>`) in the slot's aspect ratio. Today this applies only to `illustrations/no-results.png` and to products created at runtime without a photo |
| Broken file | Same as missing, caption `IMAGE_ERROR // <file name>` |

---

## 5. Files and delivery

- Images are referenced by the file names in the assets README. When the owner adds a file with that name, it is added by the procedure of `assets/README.md` section 4 (copy into the agreed project folder, redeploy, demo reset), without code or configuration changes.
- The app serves images at no more than 2× their largest display size (e.g. 800 px wide for menu cards); the 1024 px originals are not sent to phones for thumbnails.
- Formats as delivered: JPEG for product photos and the map, PNG for the transparent illustrations; serving a converted WebP/AVIF of the same image is allowed.
- Every product image has `alt` = `Product.imageAlt`; illustrations are decorative (accessibility.md 10).

---

## 6. Known issues in present images

| File | Issue | Default |
|---|---|---|
| `products/pz-04-binary-bbq.jpg`, `pz-05-inferno-payload.jpg` | Glass of beer / wine and a wine bottle as props | Accepted; new photos follow 2.1 |

The earlier issue of `dr-01-mate-compiler-tonic.jpg` (can label "16 FL OZ", "Craft Hacker Energy Drink") is solved: the delivered photo shows a 12 fl oz can labeled "Mate Compiler Tonic — Sparkling Yerba Mate".

---

## 7. Checks

| Check | Pass criterion |
|---|---|
| M-1 | Every image shown is a file from `assets/` or the placeholder; no stock photos, no generated or downloaded images by the contractor |
| M-2 | Aspect ratios and sizes per section 3 at 1440 px and 390 px |
| M-3 | Every delivered file is shown (no placeholder for a file that exists in `assets/`); the only missing image, `illustrations/no-results.png`, shows `IMAGE_PENDING // illustrations/no-results.png` or is left out |
| M-4 | Sold-out treatment per section 4 on SCR-02 when a product is sold out |
| M-5 | Phone page weight: no image above 2× its display size is loaded for thumbnails (check the network panel on SCR-05) |

---

## 8. Stitch layout references

`assets/stitch-reference/` holds screenshots of the Stitch designs that the UI specification links to (`assets/README.md` section 5). They are **layout reference only, obsolete text and branding**: never shown in the app, never used as assets, and never authoritative for texts, prices, products or the logo.
