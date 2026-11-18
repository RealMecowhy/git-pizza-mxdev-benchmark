#!/usr/bin/env node
// Git Pizza MxDev (Lite) — demo seed validator.
//
// Checks that every file in 09-demo-data is consistent with the foundation documents
// (menu-catalog.md, ../04-information-model/information-model.md, ../05-processes/order-lifecycle.md)
// and internally consistent (references, prices, totals, states, timestamps, CSV = JSON).
// Lite rules: guests only (no accounts, no customer profiles, no source or actor CUSTOMER), no coupon
// FIRST_COMMIT, the Lite seed state of README.md BR-DEMO-03a (Tiramisu Stack sold out, jalapeños out of
// stock, courier CU-05 always off duty), the fixed values of ../10-simulations/lite-configuration.md
// section 2, the traffic cap reached by the seed (SIM-05 C1), the returning courier keeping its delivered
// order (SIM-04 4.5), ovens without currentTempF (no oven telemetry). simulation-events.json is a
// reference file that the app does not load (BR-DEMO-03); it is still checked against the orders.
//
// Usage:   node validate.mjs            (from this folder, Node.js 18 or later, no dependencies)
// Exit:    0 = all checks passed, 1 = at least one error.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const PKG = path.resolve(DIR, '..');
const read = (p) => fs.readFileSync(path.resolve(DIR, p), 'utf8');
const json = (p) => JSON.parse(read(p));

const errors = [];
const sections = [];
let current = null;
function section(name) { current = { name, checks: 0, errors: 0 }; sections.push(current); }
function check(cond, msg) { current.checks++; if (!cond) { current.errors++; errors.push(`[${current.name}] ${msg}`); } return !!cond; }
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const cents = (x) => (x === null || x === undefined || x === '' ? null : Math.round(Number(x) * 100));
const roundDiv = (num, den) => Math.floor((num + Math.floor(den / 2)) / den); // half-up, num >= 0
const sortedSet = (arr) => [...new Set(arr)].sort();

// ---------------------------------------------------------------- markdown helpers
function tableAfter(md, headingRegex, nth = 0) {
  const lines = md.split(/\r?\n/);
  let i = lines.findIndex((l) => headingRegex.test(l));
  if (i < 0) throw new Error('heading not found: ' + headingRegex);
  let found = -1;
  for (; i < lines.length; i++) {
    if (lines[i].startsWith('|') && lines[i + 1] && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) {
      found++;
      if (found === nth) break;
      while (i < lines.length && lines[i].startsWith('|')) i++;
    }
  }
  const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim().replace(/`/g, '').replace(/\*\*/g, '').trim());
  const header = cells(lines[i]);
  const rows = [];
  for (let k = i + 2; k < lines.length && lines[k].startsWith('|'); k++) rows.push(cells(lines[k]));
  return { header, rows };
}
const money$ = (s) => (s === '—' || s === '' ? null : cents(s.replace(/[$,]/g, '')));

// ---------------------------------------------------------------- load foundation
const CAT_MD = read('menu-catalog.md');
const IM_MD = fs.readFileSync(path.join(PKG, '04-information-model', 'information-model.md'), 'utf8');
const LC_MD = fs.readFileSync(path.join(PKG, '05-processes', 'order-lifecycle.md'), 'utf8');

// ---------------------------------------------------------------- load seed
const categories = json('categories.json');
const products = json('menu-items.json');
const sizes = json('product-sizes.json');
const ingredients = json('ingredients.json');
const recipe = json('recipe-items.json');
const options = json('options.json');
const allergenFile = json('allergens.json');
const coupons = json('coupons.json');
const zones = json('delivery-zones.json');
const ovens = json('ovens.json');
const couriers = json('couriers.json');
const store = json('store-settings.json');
const sim = json('simulation-settings.json');
const pool = json('simulated-customers.json');
const orders = json('orders.json');
const simEvents = json('simulation-events.json');

const PROD = Object.fromEntries(products.map((p) => [p.code, p]));
const ING = Object.fromEntries(ingredients.map((i) => [i.code, i]));
const OPT = Object.fromEntries(options.map((o) => [o.code, o]));
const OPT_BY_KEY = Object.fromEntries(options.map((o) => [o.key, o]));
const SIZE = Object.fromEntries(sizes.map((s) => [`${s.productCode}/${s.sizeCode}`, s]));
const ZONE = Object.fromEntries(zones.map((z) => [z.zip, z]));
const COUP = Object.fromEntries(coupons.map((c) => [c.code, c]));
const COUR = Object.fromEntries(couriers.map((c) => [c.code, c]));
const OVEN = Object.fromEntries(ovens.map((o) => [o.code, o]));
const RECIPE = {};
for (const r of recipe) (RECIPE[r.productCode] ??= []).push(r);

const ALLERGENS = ['GLUTEN', 'CRUSTACEANS', 'EGGS', 'FISH', 'PEANUTS', 'SOYBEANS', 'MILK', 'TREE_NUTS', 'CELERY', 'MUSTARD', 'SESAME', 'SULPHITES', 'LUPIN', 'MOLLUSCS'];
const SHORT_AL = { GLU: 'GLUTEN', MLK: 'MILK', EGG: 'EGGS', FSH: 'FISH', TNT: 'TREE_NUTS', MUS: 'MUSTARD', CEL: 'CELERY', SOY: 'SOYBEANS' };
const STATUSES = ['PAYMENT_PENDING', 'PAYMENT_FAILED', 'QUEUED', 'BAKING', 'QA_CHECK', 'READY_FOR_DISPATCH', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'PICKED_UP', 'CANCELLED'];
const FINAL = ['DELIVERED', 'PICKED_UP', 'CANCELLED'];
const SIZE_LABEL = { SMALL: 'Small 10"', MEDIUM: 'Medium 12"', LARGE: 'Large 14"', REGULAR: 'Regular' };

// Lite decisions (docs: information model 3.2 / 3.4 / 7.8, 10-simulations/lite-configuration.md)
const SOLD_OUT = ['DS-01']; // BR-DEMO-03a: Tiramisu Stack is sold out in the seed
const OUT_OF_STOCK = ['jalapeno']; // BR-DEMO-03a: ingredient out of stock in the seed (extra EX-09 unavailable)
const OFF_DUTY = ['CU-05']; // BR-DEMO-03a: Mei Tanaka never works in Lite
const DROPPED_COUPONS = ['FIRST_COMMIT']; // Lite has no accounts, so no account-only coupon
const GUEST_CONTACT = { name: 'Jordan Lee', email: 'jordan.lee@example.com' }; // returning guest of README.md section 7
const PRODUCT_UPDATED_BY = 'menu-seed';

// ================================================================ 1. catalog vs menu-catalog.md
section('catalog vs menu-catalog.md');
{
  const cat = tableAfter(CAT_MD, /^## 1\. Categories/);
  check(cat.rows.length === categories.length, 'category count');
  for (const r of cat.rows) {
    const c = categories.find((x) => x.code === r[1]);
    if (!check(c, `category ${r[1]} missing`)) continue;
    check(c.sortOrder === Number(r[0]) && c.fileName === r[2] && c.displayName === r[3] && c.productKind === r[4], `category ${r[1]} fields`);
    check(products.filter((p) => p.categoryCode === c.code).length === Number(r[5]), `category ${r[1]} product count`);
  }

  // pizzas overview
  const pz = tableAfter(CAT_MD, /^### 2\.1 Overview/);
  for (const r of pz.rows) {
    const [code, name, real, key, ver, s, m, l, spice, diet, badges, featured, photo] = r;
    const p = PROD[code];
    if (!check(p, `${code} missing`)) continue;
    check(p.name === name && p.realWorldName === real && p.moduleKey === key && p.versionTag === ver, `${code} names/key/version`);
    check(p.spiceLevel === spice, `${code} spice`);
    check(eq(p.badges, badges === '—' ? [] : badges.split(/,\s*/)), `${code} badges`);
    check(p.isFeatured === (featured === 'yes'), `${code} featured`);
    check(p.imageAvailable === (photo === 'present'), `${code} photo availability`);
    const exp = { SMALL: money$(s), MEDIUM: money$(m), LARGE: money$(l) };
    for (const [sz, c] of Object.entries(exp)) {
      const ps = SIZE[`${code}/${sz}`];
      check(c === null ? !ps : ps && cents(ps.price) === c, `${code} ${sz} price`);
    }
    check(cents(p.cardPrice) === exp.MEDIUM, `${code} card price = Medium (BR-PRICE-01)`);
    const dietExp = diet === 'Vegan' ? [true, true] : diet === 'Vegetarian' ? [true, false] : [false, false];
    check(p.isVegetarian === dietExp[0] && p.isVegan === dietExp[1], `${code} diet`);
  }
  // pizza details
  const blocks = CAT_MD.split(/^#### /m).slice(1).filter((b) => /^PZ-\d\d/.test(b));
  for (const b of blocks) {
    const code = b.slice(0, 5); const p = PROD[code];
    const short = /\*\*Short description:\*\* (.+)/.exec(b)[1].trim();
    const desc = /\*\*Description:\*\* (.+)/.exec(b)[1].trim();
    const alt = /\*\*(?:Image alt|Alt):\*\* "(.+)"/.exec(b)[1].trim();
    check(p.shortDescription === short, `${code} short description`);
    check(p.description === desc, `${code} description`);
    check(p.imageAlt === alt, `${code} image alt`);
    const defaults = /\*\*Defaults:\*\*(.+)/.exec(b)[1];
    check(p.defaultSauce === /SA-\d\d/.exec(defaults)[0] && p.defaultCheese === /CH-\d\d/.exec(defaults)[0], `${code} default sauce/cheese`);
    check(p.defaultCrust === 'CR-01', `${code} default crust CR-01`);
    check(p.crustSelectable === !/crust fixed/.test(defaults), `${code} crustSelectable`);
    const al = /\*\*Allergens:\*\* ([A-Z_, ]+)/.exec(b)[1].split(/,\s*/).map((x) => x.trim());
    check(eq(sortedSet(p.allergens), sortedSet(al)), `${code} allergens ${p.allergens} vs catalog ${al}`);
    const cal = /\*\*Calories:\*\* (.+?) · \*\*Max extras:\*\* (\d)/.exec(b);
    check(p.maxExtras === Number(cal[2]), `${code} max extras`);
    for (const [, sz, kcal] of cal[1].matchAll(/([SML]) ([\d,]+)/g)) {
      const s = SIZE[`${code}/${{ S: 'SMALL', M: 'MEDIUM', L: 'LARGE' }[sz]}`];
      check(s && s.calories === Number(kcal.replace(',', '')), `${code} ${sz} calories`);
    }
    const recLine = /\*\*Recipe items:\*\* (.+)/.exec(b)[1];
    const fixedCount = (recLine.match(/fixed/g) || []).length;
    check((RECIPE[code] || []).filter((r) => !r.isRemovable).length === fixedCount, `${code} number of fixed recipe items`);
  }
  // pizza sizes / slices
  for (const s of sizes.filter((x) => PROD[x.productCode]?.kind === 'PIZZA')) {
    const calzone = s.productCode === 'PZ-12';
    check(s.diameterInches === { SMALL: 10, MEDIUM: 12, LARGE: 14 }[s.sizeCode], `${s.productCode} ${s.sizeCode} diameter`);
    check(s.slices === (calzone ? 1 : { SMALL: 6, MEDIUM: 8, LARGE: 8 }[s.sizeCode]), `${s.productCode} ${s.sizeCode} slices`);
    check(s.isDefault === (s.sizeCode === 'MEDIUM'), `${s.productCode} default size MEDIUM`);
  }

  // ingredients
  const ing = tableAfter(CAT_MD, /^## 3\. Ingredients/);
  check(ing.rows.length === ingredients.length, `ingredient count ${ingredients.length} vs ${ing.rows.length}`);
  for (const r of ing.rows) {
    const [code, name, al, v, vg, usedIn] = r;
    const i = ING[code];
    if (!check(i, `ingredient ${code} missing`)) continue;
    const full = i.composition ? `${i.name} (${i.composition})` : i.name;
    check(full === name, `ingredient ${code} name "${full}" vs "${name}"`);
    check(i.name.length <= 50, `ingredient ${code} name <= 50 chars`);
    check(eq(sortedSet(i.allergens), sortedSet(al === '—' ? [] : al.split(/,\s*/).map((x) => SHORT_AL[x]))), `ingredient ${code} allergens`);
    check(i.isVegetarian === (v === '✓') && i.isVegan === (vg === '✓'), `ingredient ${code} V/VG`);
    check(i.isInStock === !OUT_OF_STOCK.includes(code), `ingredient ${code} isInStock = ${!OUT_OF_STOCK.includes(code)} after reset (BR-DEMO-03a)`);
    // recipe usage: the PZ codes in "Used in" are exactly the pizzas that have this ingredient as a recipe item
    const usedPz = usedIn.split(/,\s*/).filter((x) => x.startsWith('PZ-')).sort();
    const recPz = recipe.filter((x) => x.ingredientCode === code).map((x) => x.productCode).sort();
    check(eq(usedPz, recPz), `ingredient ${code} recipe usage ${recPz} vs catalog ${usedPz}`);
    const usedOpt = usedIn.split(/,\s*/).filter((x) => /^(CR|SA|CH|EX)-/.test(x)).sort();
    const optUse = options.filter((o) => o.ingredientCode === code).map((o) => o.code).sort();
    check(eq(usedOpt, optUse), `ingredient ${code} option usage ${optUse} vs catalog ${usedOpt}`);
  }

  // options
  const sizeSet = (s) => s.split(' ').map((x) => ({ S: 'SMALL', M: 'MEDIUM', L: 'LARGE' }[x]));
  const crust = tableAfter(CAT_MD, /^### 4\.1 Crust/);
  for (const [code, key, name, description, sur, sz, ingr] of crust.rows) {
    const o = OPT[code];
    if (!check(o, `${code} missing`)) continue;
    check(o.group === 'CRUST' && o.key === key && o.name === name && o.description === description && cents(o.surcharge) === money$(sur) && eq(o.availableSizes, sizeSet(sz)) && o.ingredientCode === ingr, `${code} fields`);
  }
  for (const [heading, group] of [[/^### 4\.2 Sauce/, 'SAUCE'], [/^### 4\.3 Cheese/, 'CHEESE']]) {
    for (const [code, key, name, sur, ingr] of tableAfter(CAT_MD, heading).rows) {
      const o = OPT[code];
      if (!check(o, `${code} missing`)) continue;
      check(o.group === group && o.key === key && o.name === name && cents(o.surcharge) === money$(sur) && o.ingredientCode === (ingr === '—' ? null : ingr), `${code} fields`);
      check(eq(o.availableSizes, ['SMALL', 'MEDIUM', 'LARGE']), `${code} sizes`);
    }
  }
  const ex = tableAfter(CAT_MD, /^### 4\.4 Extra toppings/);
  for (const [code, key, name, cls, ingr, ver] of ex.rows) {
    const o = OPT[code];
    if (!check(o, `${code} missing`)) continue;
    const p = cls === 'STANDARD' ? [150, 200, 250] : [250, 300, 350];
    check(o.group === 'EXTRA' && o.key === key && o.name === name && o.priceClass === cls && o.ingredientCode === ingr && o.versionTag === ver, `${code} fields`);
    check(cents(o.priceSmall) === p[0] && cents(o.priceMedium) === p[1] && cents(o.priceLarge) === p[2], `${code} prices by size (BR-PRICE-03)`);
  }
  check(options.length === crust.rows.length + 6 + 4 + ex.rows.length, 'option count');

  // sides, drinks, desserts
  for (const [heading, cat] of [[/^## 5\. Sides/, 'SIDES'], [/^## 6\. Drinks/, 'DRINKS'], [/^## 7\. Desserts/, 'DESSERTS']]) {
    const t = tableAfter(CAT_MD, heading);
    const h = t.header;
    for (const r of t.rows) {
      const get = (n) => r[h.indexOf(n)];
      const p = PROD[get('Code')];
      if (!check(p, `${get('Code')} missing`)) continue;
      check(p.categoryCode === cat && p.name === get('Dev name') && p.realWorldName === get('Real-world equivalent') && p.moduleKey === get('Module key'), `${p.code} names`);
      const s = SIZE[`${p.code}/REGULAR`];
      check(s && cents(s.price) === money$(get('Price')) && s.servingDescription === get('Serving') && s.calories === Number(get('kcal')) && s.isDefault, `${p.code} REGULAR size, price, serving, kcal`);
      check(sizes.filter((x) => x.productCode === p.code).length === 1, `${p.code} has exactly one size`);
      const al = get('Allergens');
      check(eq(sortedSet(p.declaredAllergens), sortedSet(al === '—' ? [] : al.split(/,\s*/))), `${p.code} allergens`);
      const diet = get('Diet');
      check(p.declaredVegetarian === (diet === 'Vegetarian' || diet === 'Vegan') && p.declaredVegan === (diet === 'Vegan'), `${p.code} diet`);
      if (h.includes('Spice')) check(p.spiceLevel === get('Spice'), `${p.code} spice`); else check(p.spiceLevel === 'NONE', `${p.code} spice NONE`);
      if (h.includes('Caffeine')) check(`${p.caffeineMg} mg` === get('Caffeine'), `${p.code} caffeine`);
      check(p.imageAvailable === (get('Photo') === 'present'), `${p.code} photo availability`);
      const d = new RegExp(`\\*\\*${p.code} [^*]+\\*\\* — "(.+?)"(?=\\s*(?:Image:|$))`, 'm').exec(CAT_MD);
      check(d && p.description === d[1], `${p.code} description`);
    }
  }
  check(products.length === 25, 'exactly 25 products');

  // coupons
  const cp = tableAfter(CAT_MD, /^## 8\. Coupons/);
  check(cp.rows.length === coupons.length, 'coupon count');
  check(eq(cp.header, ['Code', 'Description (shown when applied)', 'Type', 'Value', 'Max discount', 'Min subtotal', 'Valid until', 'Active', 'Delivery only']), 'coupon table columns (no account rules in Lite)');
  for (const r of cp.rows) {
    const [code, desc, type, value, max, min, until, active, delOnly] = r;
    const c = COUP[code];
    if (!check(c, `coupon ${code} missing`)) continue;
    check(c.description === desc && c.discountType === type, `coupon ${code} description/type`);
    check(cents(c.value) === (value === '—' ? null : cents(value.replace('$', ''))), `coupon ${code} value`);
    check(cents(c.maxDiscount) === money$(max) && cents(c.minSubtotal) === money$(min), `coupon ${code} max/min`);
    check((c.validUntil || '—') === until.replace(/\s*\(expired\)/, ''), `coupon ${code} validUntil`);
    check(c.isActive === (active === 'yes') && c.deliveryOnly === (delOnly === 'yes'), `coupon ${code} flags`);
    check(eq(Object.keys(c), ['code', 'description', 'discountType', 'value', 'maxDiscount', 'minSubtotal', 'validFrom', 'validUntil', 'isActive', 'deliveryOnly']), `coupon ${code} keys (no requiresAccount / firstOrderOnly)`);
  }
  for (const code of DROPPED_COUPONS) check(!COUP[code] && !CAT_MD.includes(code), `coupon ${code} is not part of Lite`);
  check(allergenFile.notice && CAT_MD.includes(allergenFile.notice), 'allergen notice text');
  check(eq(allergenFile.allergens.map((a) => a.key), ALLERGENS), 'allergen enumeration = EU 14 in model order');
}

// ================================================================ 2. catalog internal rules
section('catalog internal consistency');
{
  for (const p of products) {
    check(categories.some((c) => c.code === p.categoryCode && c.productKind === p.kind), `${p.code} category/kind`);
    check(/^v[0-9.]+(-[A-Za-z]+)?$/.test(p.versionTag), `${p.code} versionTag format`);
    check(p.name.length <= 40 && p.moduleKey.length <= 40 && p.realWorldName.length <= 40, `${p.code} name lengths`);
    check(p.shortDescription.length <= 140, `${p.code} shortDescription <= 140`);
    check(p.description.length <= 600, `${p.code} description <= 600`);
    check(p.imageAlt.length <= 140, `${p.code} imageAlt <= 140`);
    check(p.status === 'PUBLISHED' && p.isSoldOut === SOLD_OUT.includes(p.code), `${p.code} published, isSoldOut = ${SOLD_OUT.includes(p.code)} after reset (BR-DEMO-03a)`);
    check(p.updatedBy === PRODUCT_UPDATED_BY, `${p.code} updatedBy is the text ${PRODUCT_UPDATED_BY} (no account in Lite)`);
    check(p.imageFile === `assets/products/${p.code.toLowerCase()}-${p.moduleKey}.jpg`, `${p.code} image file name rule`);
    if (p.imageAvailable) check(fs.existsSync(path.join(PKG, p.imageFile)), `${p.code} image file exists`);
    const ps = sizes.filter((s) => s.productCode === p.code);
    check(ps.filter((s) => s.isDefault).length === 1, `${p.code} exactly one default size`);
    check(cents(p.cardPrice) === cents(ps.find((s) => s.isDefault).price), `${p.code} cardPrice = default size price`);
    for (const s of ps) check(cents(s.price) >= 50 && cents(s.price) <= 9999 && s.servingDescription.length <= 40, `${p.code} ${s.sizeCode} price range / serving length`);
    if (p.kind === 'PIZZA') {
      // derived allergens / diet of the default configuration (BR-DATA-10, BR-DATA-11)
      const ics = [OPT[p.defaultCrust], OPT[p.defaultSauce], OPT[p.defaultCheese]].map((o) => o.ingredientCode).concat((RECIPE[p.code] || []).map((r) => r.ingredientCode)).filter(Boolean);
      check(eq(sortedSet(p.allergens), sortedSet(ics.flatMap((c) => ING[c].allergens))), `${p.code} derived allergens`);
      check(p.isVegetarian === ics.every((c) => ING[c].isVegetarian) && p.isVegan === ics.every((c) => ING[c].isVegan), `${p.code} derived diet`);
      check(OPT[p.defaultCrust].group === 'CRUST' && OPT[p.defaultSauce].group === 'SAUCE' && OPT[p.defaultCheese].group === 'CHEESE', `${p.code} default option groups`);
      check((RECIPE[p.code] || []).every((r) => ING[r.ingredientCode] && ['TOPPING', 'FINISH'].includes(r.role)), `${p.code} recipe references`);
    } else {
      check(eq(sortedSet(p.allergens), sortedSet(p.declaredAllergens)) && p.isVegetarian === p.declaredVegetarian && p.isVegan === p.declaredVegan, `${p.code} declared = derived`);
      check(!RECIPE[p.code], `${p.code} has no recipe`);
    }
    if (p.isVegan) check(p.isVegetarian, `${p.code} vegan implies vegetarian`);
  }
  check(products.filter((p) => p.isFeatured).length <= 6, 'max 6 featured');
  for (const i of ingredients) if (i.isVegan) check(i.isVegetarian, `${i.code} vegan implies vegetarian`);
  for (const o of options) {
    check(!o.ingredientCode || ING[o.ingredientCode], `${o.code} ingredient exists`);
    check(o.isActive === true, `${o.code} active after reset`);
  }
  // seed stock state (BR-DEMO-03a): exactly one sold-out product and one out-of-stock ingredient; BR-DATA-12 orderability
  check(eq(products.filter((p) => p.isSoldOut).map((p) => p.code), SOLD_OUT), `sold-out products = ${SOLD_OUT}`);
  check(eq(ingredients.filter((i) => !i.isInStock).map((i) => i.code), OUT_OF_STOCK), `out-of-stock ingredients = ${OUT_OF_STOCK}`);
  const orderable = (p) => p.status === 'PUBLISHED' && !p.isSoldOut && (p.kind !== 'PIZZA' || (
    [p.defaultCrust, p.defaultSauce, p.defaultCheese].every((c) => OPT[c].isActive && (!OPT[c].ingredientCode || ING[OPT[c].ingredientCode].isInStock))
    && (RECIPE[p.code] || []).every((r) => r.isRemovable || ING[r.ingredientCode].isInStock)));
  for (const p of products) check(orderable(p) === !SOLD_OUT.includes(p.code), `${p.code} orderable = ${!SOLD_OUT.includes(p.code)} (BR-DATA-12)`);
  for (const code of OUT_OF_STOCK) {
    const uses = recipe.filter((r) => r.ingredientCode === code);
    check(uses.length >= 1 && uses.every((r) => r.isRemovable), `${code} is removable wherever it is a recipe item, so those pizzas stay orderable`);
    check(options.some((o) => o.ingredientCode === code && o.group === 'EXTRA'), `${code} is the ingredient of an extra (shown as unavailable)`);
  }
  check(products.some((p) => p.kind !== 'DRINK' && orderable(p)), 'at least one orderable non-drink product (SIM-05 BR-SIM-28)');
  // allergen matrix CSV
  const m = parseCsv(read('allergen-matrix.csv'));
  for (const r of m) {
    const p = PROD[r.productCode];
    check(p && ALLERGENS.every((a) => (r[a] === 'true') === p.allergens.includes(a)) && (r.isVegetarian === 'true') === p.isVegetarian && (r.isVegan === 'true') === p.isVegan, `allergen-matrix row ${r.productCode}`);
  }
  check(m.length === products.length, 'allergen-matrix row count');
}

// ================================================================ 3. reference data vs information model 7.5 / 7.8 and lifecycle 7.1
section('reference data vs information model and lifecycle');
{
  const z = tableAfter(IM_MD, /^\*\*Delivery zones\*\*/);
  check(z.rows.length === zones.length, 'zone count');
  for (const [zip, nb, dist, trip] of z.rows) {
    const x = ZONE[zip];
    check(x && x.neighborhood === nb && x.distanceMiles === Number(dist) && x.tripSecondsAt1x === Number(trip) && x.isActive, `zone ${zip}`);
  }
  const ov = tableAfter(IM_MD, /^\*\*Ovens:\*\*/);
  for (const [code, dn, type, target, cap, st] of ov.rows) {
    const o = OVEN[code];
    check(o && o.displayName === dn && o.ovenType === type && o.targetTempF === parseInt(target) && o.capacityOrders === parseInt(cap) && o.status === st, `oven ${code}`);
    if (o) check(o.currentTempF === null, `oven ${code} currentTempF empty (no oven telemetry in Lite)`);
  }
  check(ovens.length === ov.rows.length, 'oven count');
  const cu = tableAfter(IM_MD, /^\*\*Couriers:\*\*/);
  for (const [code, name, handle, veh, plate, phone, st] of cu.rows) {
    const c = COUR[code];
    check(c && c.name === name && c.nodeHandle === handle && c.vehicleType === veh && (c.plate || '—') === plate && c.phone === phone, `courier ${code} master data`);
    if (st.startsWith('OFF_DUTY')) check(c.status === 'OFF_DUTY', `courier ${code} OFF_DUTY after reset`);
    check(c && (c.status === 'OFF_DUTY') === OFF_DUTY.includes(code), `courier ${code} ${OFF_DUTY.includes(code) ? 'off duty' : 'on duty'} (BR-DEMO-03a)`);
    check(c && !('avatarFile' in c), `courier ${code} has no avatar file (assets/avatars/ is not part of Lite)`);
  }
  check(couriers.length === cu.rows.length, 'courier count');

  const ss = tableAfter(IM_MD, /^### 7\.5 StoreSettings/);
  check(eq(Object.keys(store), ss.rows.map((r) => r[0])), 'store settings keys = information model 7.5 (no intake pause fields, no maxSavedAddresses)');
  for (const [attr, , def] of ss.rows) {
    const v = def.replace(/\s+\([^()]*\)$/, ''); // drop a trailing note such as "(fictional)" or "(always in Lite, …)"
    const actual = store[attr];
    if (v === 'empty') check(actual === null, `store ${attr} empty`);
    else check(String(actual) === v || Number(actual) === Number(v), `store ${attr} = ${v} (is ${actual})`);
  }
  check(store.intakeStatus === 'OPEN', 'intake OPEN (lite-configuration.md section 2)');
  const lc = tableAfter(LC_MD, /^### 7\.1 Base durations/);
  for (const [key, , def] of lc.rows) {
    if (key === 'courierReturn') continue;
    if (key.includes('+')) {
      const [a, b] = key.split('+').map((s) => s.trim()); const [da2, db] = def.split('+').map((s) => Number(s.trim()));
      check(sim.durations[a] === da2 && sim.durations[b] === db, `simulation ${key}`);
    } else check(sim.durations[key] === Number(def), `simulation duration ${key} = ${def}`);
  }
  const sm = tableAfter(IM_MD, /^### 7\.6 SimulationSettings/);
  for (const [attr, , def] of sm.rows) {
    if (!(attr in sim) || /^durations|^lastReset|^lastResumed|^speedFactor/.test(attr)) continue;
    const d = def.replace(/`/g, '').split(' ')[0];
    check(String(sim[attr]) === d, `simulation ${attr} = ${d}`);
  }
  // Lite: speed comes from the constant Simulation.SpeedFactor (LITE-CFG-02); the seed value is the 1× default
  check(['X1', 'X2', 'X5', 'X10'].includes(sim.speedFactor) && sim.isPaused === false, 'simulation speed factor valid, never paused');
  check(sim.randomPaymentFailurePercent === 0 && sim.qaFailurePercent === 0, 'failure rates 0 % (lite-configuration.md section 2)');
  // lastResetBy is text: empty in the seed, shown as SYSTEM (initial seed) after the first start (SIM-08 section 2)
  check(sim.lastResetBy === null && sim.lastResetAt === 'T-00:00:00' && sim.lastResumedAt === 'T-00:00:00', 'lastResetBy empty, lastResetAt / lastResumedAt = T');
  for (const p of pool) {
    check(/^\(\d{3}\) 555-01\d\d$/.test(p.phone), `pool ${p.code} fictional phone`);
    check(/@example\.(com|net|org)$/.test(p.email), `pool ${p.code} example email`);
    check(/^\d{5}$/.test(p.zip) && p.state === 'CA', `pool ${p.code} zip/state`);
    check(p.inDeliveryZone === !!ZONE[p.zip], `pool ${p.code} inDeliveryZone flag`);
  }
  check(new Set(pool.map((p) => p.email)).size === pool.length, 'pool emails unique');
}

// ================================================================ 4. guests only (Lite)
section('guest orders, no accounts');
{
  // no account data in Lite
  for (const f of ['user-accounts.json', 'user-accounts.csv', 'customers.json', 'addresses.csv', 'demo-accounts.md']) check(!fs.existsSync(path.join(DIR, f)), `${f} is not part of Lite`);
  check(orders.every((o) => ['GUEST', 'SIMULATOR'].includes(o.source)), 'order source only GUEST or SIMULATOR (no CUSTOMER)');
  check(orders.every((o) => !('customerUsername' in o) && !('addressLabel' in o)), 'orders have no customer link and no saved-address label');
  check(orders.every((o) => o.statusChanges.every((s) => s.actorType !== 'CUSTOMER' && s.actorName !== 'demo.customer')), 'no status change by CUSTOMER / demo.customer');
  check(orders.every((o) => o.cancelledBy !== 'CUSTOMER'), 'no order cancelled by CUSTOMER');
  // every guest order can be found on SCR-10 by number + contact email
  for (const o of orders.filter((x) => x.source === 'GUEST')) check(o.contactEmail && o.contactName, `${o.displayNumber} guest order has contact name and email (SCR-10 lookup)`);
  // the orders of the returning guest Jordan Lee are guest orders (README.md section 7)
  const jl = orders.filter((o) => o.contactEmail === GUEST_CONTACT.email);
  check(jl.length >= 15 && jl.every((o) => o.source === 'GUEST' && o.contactName === GUEST_CONTACT.name && o.poolCustomer === null), `${jl.length} guest orders of ${GUEST_CONTACT.name}`);
  check(new Set(jl.map((o) => o.contactPhone)).size === 1 && !pool.some((p) => p.email === GUEST_CONTACT.email || p.phone === jl[0].contactPhone), `${GUEST_CONTACT.name} is not in the simulated customer pool`);
  check(jl.filter((o) => !FINAL.includes(o.status)).length === 1, `${GUEST_CONTACT.name} has exactly 1 open order`);
  check(jl.some((o) => o.status === 'CANCELLED') && jl.some((o) => o.type === 'PICKUP') && jl.some((o) => o.type === 'DELIVERY'), `${GUEST_CONTACT.name} orders include a cancelled, a pickup and a delivery order`);
  check(orders.filter((o) => o.source === 'GUEST' && !o.poolCustomer).every((o) => o.contactEmail === GUEST_CONTACT.email), 'every other guest order comes from the simulated customer pool');
  for (const o of orders.filter((x) => x.poolCustomer)) {
    const p = pool.find((x) => x.code === o.poolCustomer);
    check(p && o.contactName === `${p.firstName} ${p.lastName}` && o.contactEmail === p.email && o.contactPhone === p.phone, `${o.displayNumber} contact = pool ${o.poolCustomer}`);
  }
  // no dropped coupon on any order
  check(orders.every((o) => !DROPPED_COUPONS.includes(o.couponCode)), 'no order uses a coupon that is not part of Lite');
}

// ================================================================ 5. orders: prices, lines, coupons
// time parsing: "T-HH:MM:SS" (seconds before T, returned negative) and "D-n HH:MM:SS" (n days before T's date)
function parseTime(s) {
  let m = /^T-(\d{2,}):(\d{2}):(\d{2})$/.exec(s);
  if (m) return { group: 'T', v: -(Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3])) };
  m = /^D-(\d+) (\d{2}):(\d{2}):(\d{2})$/.exec(s);
  if (m) return { group: 'D', day: Number(m[1]), v: -Number(m[1]) * 86400 + Number(m[2]) * 3600 + Number(m[3]) * 60 + Number(m[4]) };
  return null;
}
const tv = (s) => parseTime(s).v;

section('orders: lines, prices and totals');
{
  const TIP = { NONE: 0, TEN: 10, FIFTEEN: 15, TWENTY: 20 };
  for (const o of orders) {
    const id = o.displayNumber;
    check(id === `MX-${o.orderNumber}`, `${id} display number`);
    check(o.lines.length >= 1, `${id} has lines`);
    let sub = 0, qtyTotal = 0;
    for (const l of o.lines) {
      const p = PROD[l.productCode];
      if (!check(p, `${id} line ${l.lineNo} product exists`)) continue;
      const s = SIZE[`${l.productCode}/${l.sizeCode}`];
      if (!check(s, `${id} line ${l.lineNo} size exists`)) continue;
      check(l.productName === p.name && l.realWorldName === p.realWorldName && l.moduleKey === p.moduleKey && l.sizeLabel === SIZE_LABEL[l.sizeCode], `${id} line ${l.lineNo} snapshot names`);
      check(l.quantity >= 1 && l.quantity <= store.maxQuantityPerLine, `${id} line ${l.lineNo} quantity 1..10`);
      let unit = cents(s.price);
      const al = new Set(); let veg = true, vegan = true;
      const use = (ic) => { if (!ic) return; const g = ING[ic]; g.allergens.forEach((a) => al.add(a)); veg &&= g.isVegetarian; vegan &&= g.isVegan; };
      if (p.kind === 'PIZZA') {
        const byType = (t) => l.modifiers.filter((m) => m.type === t);
        check(byType('CRUST').length === 1 && byType('SAUCE').length === 1 && byType('CHEESE').length === 1, `${id} line ${l.lineNo} one crust/sauce/cheese`);
        for (const [t, def] of [['CRUST', p.defaultCrust], ['SAUCE', p.defaultSauce], ['CHEESE', p.defaultCheese]]) {
          const m = byType(t)[0]; const opt = OPT_BY_KEY[m?.key];
          if (!check(opt && opt.group === t, `${id} line ${l.lineNo} ${t} option ${m?.key}`)) continue;
          const isDef = opt.code === def;
          const price = isDef ? 0 : cents(opt.surcharge);
          check(m.isDefault === isDef && cents(m.price) === price && m.name === opt.name, `${id} line ${l.lineNo} ${t} modifier price/default (BR-PRICE-02)`);
          check(opt.availableSizes.includes(l.sizeCode), `${id} line ${l.lineNo} ${t} available for size`);
          if (t === 'CRUST' && !p.crustSelectable) check(isDef, `${id} line ${l.lineNo} crust fixed for ${p.code}`);
          unit += price; use(opt.ingredientCode);
        }
        const removed = byType('REMOVE').map((m) => m.key);
        for (const m of byType('REMOVE')) {
          const r = (RECIPE[p.code] || []).find((x) => x.ingredientCode === m.key);
          check(r && r.isRemovable && cents(m.price) === 0 && m.name === ING[m.key].name, `${id} line ${l.lineNo} removal ${m.key} allowed`);
        }
        for (const r of RECIPE[p.code] || []) if (!removed.includes(r.ingredientCode)) use(r.ingredientCode);
        const adds = byType('ADD');
        check(adds.length <= p.maxExtras, `${id} line ${l.lineNo} extras <= maxExtras`);
        check(new Set(adds.map((m) => m.key)).size === adds.length, `${id} line ${l.lineNo} each extra once`);
        for (const m of adds) {
          const opt = OPT_BY_KEY[m.key];
          if (!check(opt && opt.group === 'EXTRA', `${id} line ${l.lineNo} extra ${m.key}`)) continue;
          const price = cents({ SMALL: opt.priceSmall, MEDIUM: opt.priceMedium, LARGE: opt.priceLarge }[l.sizeCode]);
          check(cents(m.price) === price && m.name === opt.name && m.isDefault === false, `${id} line ${l.lineNo} extra ${m.key} price by size (BR-PRICE-03)`);
          unit += price; use(opt.ingredientCode);
        }
        check(l.modifiers.every((m) => ['CRUST', 'SAUCE', 'CHEESE', 'ADD', 'REMOVE'].includes(m.type)), `${id} line ${l.lineNo} modifier types`);
      } else {
        check(l.modifiers.length === 0, `${id} line ${l.lineNo} non-pizza has no modifiers`);
        p.declaredAllergens.forEach((a) => al.add(a)); veg = p.declaredVegetarian; vegan = p.declaredVegan;
      }
      check(cents(l.unitPrice) === unit, `${id} line ${l.lineNo} unit price ${l.unitPrice} expected ${unit / 100}`);
      check(cents(l.lineTotal) === unit * l.quantity, `${id} line ${l.lineNo} line total (BR-PRICE-04)`);
      check(eq(sortedSet(l.allergens), sortedSet([...al])), `${id} line ${l.lineNo} allergens (BR-DATA-11)`);
      check(l.isVegetarian === veg && l.isVegan === vegan, `${id} line ${l.lineNo} diet (BR-DATA-10)`);
      sub += unit * l.quantity; qtyTotal += l.quantity;
    }
    // BR-ORD-03
    check(o.lines.some((l) => PROD[l.productCode]?.kind !== 'DRINK'), `${id} has a non-drink line (BR-ORD-03)`);
    check(qtyTotal <= store.maxItemsPerOrder, `${id} total quantity <= 30`);
    check(o.contactName && /@example\.(com|net|org)$/.test(o.contactEmail) && /^\(\d{3}\) 555-01\d\d$/.test(o.contactPhone), `${id} contact`);
    // delivery
    if (o.type === 'DELIVERY') {
      const z = ZONE[o.zip];
      check(z && o.deliveryZone === o.zip && o.distanceMiles === z.distanceMiles, `${id} delivery zone`);
      check(o.addressLine1 && o.city === 'San Francisco' && o.state === 'CA', `${id} address`);
      check(sub >= cents(store.minDeliverySubtotal), `${id} minimum delivery subtotal (BR-PRICE-13)`);
    } else {
      check(!o.addressLine1 && !o.zip && !o.deliveryZone && o.distanceMiles === null, `${id} pickup has no address`);
      check(o.tipOption === 'NONE', `${id} pickup tip NONE`);
    }
    // coupon (BR-PRICE-05/06)
    let disc = 0, fee = o.type === 'DELIVERY' ? cents(store.deliveryFee) : 0, waived = null;
    if (o.couponCode) {
      const c = COUP[o.couponCode];
      if (check(c, `${id} coupon exists`)) {
        check(c.isActive && o.couponCode !== 'HOTFIX10', `${id} coupon not expired`);
        check(sub >= cents(c.minSubtotal), `${id} coupon min subtotal`);
        if (c.deliveryOnly) check(o.type === 'DELIVERY', `${id} coupon delivery only`);
        if (c.discountType === 'PERCENT') { disc = roundDiv(sub * cents(c.value) / 100, 100); if (c.maxDiscount !== null) disc = Math.min(disc, cents(c.maxDiscount)); }
        else if (c.discountType === 'FIXED_AMOUNT') disc = Math.min(cents(c.value), sub);
      }
    }
    if (o.type === 'DELIVERY') {
      if (sub >= cents(store.freeDeliveryThreshold)) { fee = 0; waived = 'THRESHOLD'; }
      else if (o.couponCode && COUP[o.couponCode]?.discountType === 'FREE_DELIVERY') { fee = 0; waived = 'COUPON'; }
    }
    const base = sub - disc;
    const tax = roundDiv(base * Math.round(store.taxRatePercent * 1000), 100000);
    const tip = o.type === 'DELIVERY' ? roundDiv(base * TIP[o.tipOption], 100) : 0;
    check(cents(o.subtotal) === sub, `${id} subtotal ${o.subtotal} expected ${sub / 100}`);
    check(cents(o.discountAmount) === disc, `${id} discount (BR-PRICE-05)`);
    check(cents(o.deliveryFee) === fee && o.deliveryFeeWaivedBy === waived, `${id} delivery fee / waiver (BR-PRICE-07)`);
    check(o.taxRatePercent === store.taxRatePercent && cents(o.taxAmount) === tax, `${id} tax (BR-PRICE-08)`);
    check(cents(o.tipAmount) === tip, `${id} tip (BR-PRICE-09)`);
    check(cents(o.total) === base + fee + tax + tip, `${id} total (BR-PRICE-10)`);
  }
  // worked examples from information model 6.1
  const ex = (n) => orders.find((o) => o.seedNote && o.seedNote.includes(`worked example ${n}`));
  check(ex('A') && ex('A').total === 68.62, 'seed order reproduces worked example A (68.62)');
  check(ex('D') && ex('D').total === 20.36 && ex('D').source === 'GUEST' && ex('D').type === 'PICKUP' && !ex('D').couponCode, 'seed order reproduces worked example D: guest, pickup, no coupon (20.36)');
}

// ================================================================ 6. orders: lifecycle
section('orders: lifecycle and audit trail');
// transitions from order-lifecycle.md section 4
const TRANS = [];
{
  const t = tableAfter(LC_MD, /^## 4\. Transitions/);
  for (const r of t.rows) {
    const [tid, ft] = r;
    const m = /^(.+?) → (.+)$/.exec(ft);
    const from = m[1].trim(), to = m[2].trim();
    if (from === '(none)') TRANS.push({ tid, from: null, to });
    else if (from === 'any open state') for (const s of STATUSES.filter((x) => !FINAL.includes(x))) TRANS.push({ tid, from: s, to });
    else TRANS.push({ tid, from, to });
  }
}
// Lite: no CUSTOMER actor. KITCHEN and MANAGER remain only as history text of seed orders (README.md section 6.3).
const ACTORS = {
  'T-01': ['GUEST', 'SIMULATOR'], 'T-02': ['SIMULATOR'], 'T-03': ['SIMULATOR'], 'T-04': ['SYSTEM'], 'T-05': ['GUEST', 'SIMULATOR'],
  'T-06': ['GUEST'], 'T-07': ['SYSTEM'], 'T-08': ['KITCHEN', 'MANAGER', 'SIMULATOR'], 'T-09': ['GUEST'], 'T-10': ['KITCHEN', 'MANAGER', 'SIMULATOR'],
  'T-11': ['KITCHEN', 'MANAGER', 'SIMULATOR'], 'T-12': ['KITCHEN', 'MANAGER', 'SIMULATOR'], 'T-13': ['KITCHEN', 'MANAGER', 'SIMULATOR'], 'T-14': ['KITCHEN', 'MANAGER', 'SIMULATOR'],
  'T-15': ['SIMULATOR', 'MANAGER'], 'T-16': ['KITCHEN', 'MANAGER', 'SIMULATOR'], 'T-17': ['MANAGER'],
};
const SOURCE_ACTOR = { GUEST: 'GUEST', SIMULATOR: 'SIMULATOR' };
const ACTOR_NAME = { GUEST: /^guest$/, KITCHEN: /^demo\.kitchen$/, MANAGER: /^demo\.manager$/, SIMULATOR: /^sim\/[a-z-]+$/, SYSTEM: /^sys\/[a-z-]+$/ };
{
  check(TRANS.length >= 20, 'transition table parsed from order-lifecycle.md');
  const covered = new Set();
  for (const o of orders) {
    const id = o.displayNumber;
    const sc = o.statusChanges;
    check(STATUSES.includes(o.status), `${id} status value`);
    check(['GUEST', 'SIMULATOR'].includes(o.source) && ['DELIVERY', 'PICKUP'].includes(o.type), `${id} source/type (OrderSource GUEST or SIMULATOR)`);
    check(/^[0-9a-f]{7}$/.test(o.commitHash), `${id} commit hash format`);
    check(sc.length >= 1 && sc[0].fromStatus === null && sc[0].toStatus === 'PAYMENT_PENDING', `${id} starts with creation (T-01)`);
    check(sc.at(-1).toStatus === o.status, `${id} last status change = status`);
    check(sc.every((s, i) => s.seq === i + 1), `${id} status change sequence`);
    const g = parseTime(o.placedAt).group;
    let attemptsSoFar = 0, remakes = 0, wasPaid = false;
    for (let i = 0; i < sc.length; i++) {
      const s = sc[i];
      const t = parseTime(s.changedAt);
      check(t && t.group === g, `${id} #${s.seq} time format`);
      if (i > 0) check(tv(s.changedAt) >= tv(sc[i - 1].changedAt), `${id} #${s.seq} time not before previous`);
      check(i === 0 || !FINAL.includes(sc[i - 1].toStatus), `${id} #${s.seq} no change after a final state (BR-ORD-17)`);
      const cands = TRANS.filter((x) => x.from === s.fromStatus && x.to === s.toStatus && ACTORS[x.tid].includes(s.actorType));
      if (!check(cands.length > 0, `${id} #${s.seq} ${s.fromStatus}→${s.toStatus} by ${s.actorType} is not an allowed transition`)) continue;
      check(ACTOR_NAME[s.actorType].test(s.actorName), `${id} #${s.seq} actor name ${s.actorName}`);
      let tid = cands[0].tid;
      if (cands.length > 1) tid = cands.find((x) => x.tid !== 'T-17')?.tid || tid;
      covered.add(tid);
      // guards
      if (['T-01', 'T-05'].includes(tid)) { attemptsSoFar++; check(s.actorType === SOURCE_ACTOR[o.source], `${id} #${s.seq} payment initiated by the order's own customer`); check(attemptsSoFar <= 3, `${id} max 3 attempts (BR-ORD-05)`); }
      if (tid === 'T-03') check(attemptsSoFar < 3, `${id} T-03 only before attempt 3`);
      if (tid === 'T-04') check(attemptsSoFar === 3, `${id} T-04 only at attempt 3`);
      if (['T-06', 'T-09'].includes(tid)) check(s.actorType === SOURCE_ACTOR[o.source], `${id} customer cancel by own customer`);
      if (tid === 'T-02') wasPaid = true;
      if (tid === 'T-11') check(o.type === 'DELIVERY', `${id} T-11 delivery only`);
      if (tid === 'T-12') check(o.type === 'PICKUP', `${id} T-12 pickup only`);
      if (tid === 'T-13') { check(remakes < 2, `${id} remake max 2 (BR-ORD-14)`); remakes++; check(s.reason && /^QA failed: /.test(s.reason), `${id} remake reason`); }
      if (s.toStatus === 'CANCELLED') check(s.reason && s.reason.length >= 5 && s.reason.length <= 200, `${id} cancel reason 5..200`);
      if (tid === 'T-17' || s.actorType === 'MANAGER') check(s.reason && s.reason.length >= 5, `${id} manager action has reason`);
      if (tid === 'T-14') check(o.type === 'DELIVERY' && o.courier, `${id} handover requires courier`);
    }
    // timestamp fields
    const lastInto = (st) => [...sc].reverse().find((s) => s.toStatus === st)?.changedAt ?? null;
    check(o.placedAt === sc[0].changedAt, `${id} placedAt`);
    check(o.statusChangedAt === sc.at(-1).changedAt, `${id} statusChangedAt`);
    check(o.paidAt === (sc.find((s) => s.fromStatus === 'PAYMENT_PENDING' && s.toStatus === 'QUEUED')?.changedAt ?? null), `${id} paidAt`);
    check(o.queuedAt === lastInto('QUEUED'), `${id} queuedAt (last entry into QUEUED)`);
    check(o.bakingStartedAt === lastInto('BAKING'), `${id} bakingStartedAt`);
    check(o.qaStartedAt === lastInto('QA_CHECK'), `${id} qaStartedAt`);
    check(o.readyAt === (lastInto('READY_FOR_DISPATCH') || lastInto('READY_FOR_PICKUP')), `${id} readyAt`);
    check(o.dispatchedAt === lastInto('OUT_FOR_DELIVERY'), `${id} dispatchedAt`);
    check(o.completedAt === (lastInto('DELIVERED') || lastInto('PICKED_UP')), `${id} completedAt`);
    check(o.cancelledAt === lastInto('CANCELLED'), `${id} cancelledAt`);
    // remake / QA / priority
    check(o.remakeCount === remakes && o.isPriority === remakes > 0, `${id} remakeCount / isPriority`);
    const reachedReady = sc.some((s) => ['READY_FOR_DISPATCH', 'READY_FOR_PICKUP'].includes(s.toStatus));
    if (reachedReady) check(o.qaSlicedDone && o.qaExtrasDone && o.qaSealedDone, `${id} QA checks done before sealing (BR-ORD-12)`);
    else if (o.status !== 'QA_CHECK') check(!o.qaSlicedDone && !o.qaExtrasDone && !o.qaSealedDone, `${id} QA checks false before QA`);
    // cancellation
    if (o.status === 'CANCELLED') {
      const last = sc.at(-1);
      check(o.cancelReason === last.reason && o.cancelledBy === last.actorType, `${id} cancelReason/cancelledBy match the audit record`);
    } else check(o.cancelReason === null && o.cancelledBy === null, `${id} no cancel fields`);
    // oven
    const baked = sc.some((s) => s.toStatus === 'BAKING');
    if (o.status === 'BAKING') check(OVEN[o.oven], `${id} BAKING order has an oven`);
    else if (o.status === 'QUEUED' && o.remakeCount > 0) check(o.oven === null, `${id} oven cleared on remake`);
    else check(baked ? !!OVEN[o.oven] : o.oven === null, `${id} oven reference`);
    // courier and route
    if (o.type === 'PICKUP') check(o.courier === null && o.routeProgressPercent === null, `${id} pickup has no courier/route`);
    else {
      if (['OUT_FOR_DELIVERY', 'DELIVERED'].includes(o.status)) check(COUR[o.courier], `${id} courier set`);
      if (!sc.some((s) => s.toStatus === 'READY_FOR_DISPATCH')) check(o.courier === null, `${id} no courier before dispatch`);
      const rp = o.routeProgressPercent;
      check(o.status === 'DELIVERED' ? rp === 100 : o.status === 'OUT_FOR_DELIVERY' ? rp >= 0 && rp < 100 : rp === 0, `${id} routeProgressPercent`);
    }
    // payments
    const pa = o.paymentAttempts;
    const entries = sc.filter((s) => s.toStatus === 'PAYMENT_PENDING');
    check(pa.length === entries.length && pa.length <= store.maxPaymentAttempts, `${id} one attempt per PAYMENT_PENDING entry`);
    pa.forEach((a, i) => {
      check(a.attemptNumber === i + 1 && a.startedAt === entries[i]?.changedAt, `${id} attempt ${i + 1} number/start`);
      check(cents(a.amount) === cents(o.total), `${id} attempt ${i + 1} amount = total (BR-ORD-05)`);
      check((a.method === 'CARD') === !!a.testCard, `${id} attempt ${i + 1} test card only for CARD`);
      const outcome = a.method !== 'CARD' ? null : { VISA_4242: null, MASTERCARD_4444: null, VISA_0002: 'DECLINED', VISA_9995: 'INSUFFICIENT_FUNDS', AMEX_0005: 'GATEWAY_TIMEOUT' }[a.testCard];
      const next = sc[sc.indexOf(entries[i]) + 1];
      if (!next) check(a.status === 'PROCESSING' && a.finishedAt === null && o.status === 'PAYMENT_PENDING', `${id} attempt ${i + 1} still processing`);
      else {
        check(a.finishedAt === next.changedAt, `${id} attempt ${i + 1} finishedAt = next transition`);
        if (outcome) check(a.status === 'FAILED' && a.failureCode === outcome && !a.transactionId, `${id} attempt ${i + 1} fails with ${outcome} (BR-ORD-04)`);
        else if (next.toStatus === 'QUEUED') check(['SUCCEEDED', 'REFUNDED'].includes(a.status) && /^txn_sim_[0-9a-f]{12}$/.test(a.transactionId) && !a.failureCode, `${id} attempt ${i + 1} succeeded (BR-ORD-04)`);
        else check(false, `${id} attempt ${i + 1} outcome does not match the card`);
        if (outcome === 'GATEWAY_TIMEOUT') check(tv(a.finishedAt) - tv(a.startedAt) === sim.durations.paymentTimeout, `${id} gateway timeout after paymentTimeout`);
      }
      if (a.status === 'REFUNDED') check(/^rfd_sim_[0-9a-f]{12}$/.test(a.refundId) && a.refundedAt === o.cancelledAt, `${id} refund data (BR-ORD-10)`);
      else check(!a.refundId && !a.refundedAt, `${id} attempt ${i + 1} not refunded`);
    });
    const ps = pa.some((a) => a.status === 'REFUNDED') ? 'REFUNDED' : pa.some((a) => a.status === 'SUCCEEDED') ? 'PAID' : 'UNPAID';
    check(o.paymentStatus === ps, `${id} paymentStatus ${o.paymentStatus} expected ${ps}`);
    if (o.status === 'CANCELLED') check((o.paymentStatus === 'REFUNDED') === wasPaid, `${id} refunded iff it was paid (BR-ORD-10)`);
    // log
    const logs = o.logEntries;
    check(logs.length >= sc.length, `${id} at least one log line per transition`);
    check(logs[0]?.tag === 'INIT' && logs[0].message.includes(id) && logs[0].message.includes('#' + o.commitHash), `${id} first log line INIT with number and hash`);
    logs.forEach((l, i) => {
      check(l.seq === i + 1 && ['INFO', 'SUCCESS', 'WARN', 'ERROR', 'DEBUG'].includes(l.level) && l.tag.length <= 12 && l.message.length <= 200, `${id} log ${l.seq} fields`);
      check(parseTime(l.loggedAt)?.group === g && (i === 0 || tv(l.loggedAt) >= tv(logs[i - 1].loggedAt)), `${id} log ${l.seq} time order`);
      check(l.isCustomerVisible === !(l.tag === 'OPS' || l.level === 'DEBUG'), `${id} log ${l.seq} visibility`);
    });
    for (const s of sc) check(logs.some((l) => l.loggedAt === s.changedAt), `${id} log line for change #${s.seq}`);
    check(tv(logs.at(-1).loggedAt) <= tv(o.statusChangedAt), `${id} no log after last change`);
    // BR-SIM-16a: the oven line of T-08 shows the oven's target temperature (no oven telemetry in Lite)
    for (const l of logs.filter((x) => x.tag === 'OVEN' && x.message.startsWith('Entered'))) {
      const m = /^Entered (OVEN_\d\d) at (\d+)°F\./.exec(l.message);
      check(m && OVEN[m[1]] && Number(m[2]) === OVEN[m[1]].targetTempF, `${id} log ${l.seq} oven temperature = targetTempF (BR-SIM-16a)`);
    }
    // coverage
    covered.add(`${o.type}:${o.status}`);
  }
  // coverage of every state for both types
  const valid = { DELIVERY: STATUSES.filter((s) => !['READY_FOR_PICKUP', 'PICKED_UP'].includes(s)), PICKUP: STATUSES.filter((s) => !['READY_FOR_DISPATCH', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(s)) };
  for (const [type, list] of Object.entries(valid)) for (const s of list) check(covered.has(`${type}:${s}`), `seed covers ${type} in ${s}`);
  for (const t of ['T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'T-06', 'T-08', 'T-09', 'T-10', 'T-11', 'T-12', 'T-13', 'T-14', 'T-15', 'T-16', 'T-17']) check(covered.has(t), `seed history contains transition ${t}`);
  const failed = orders.flatMap((o) => o.paymentAttempts).filter((a) => a.status === 'FAILED');
  check(failed.length >= 1 && new Set(failed.map((a) => a.failureCode)).size === 3, 'failed payments with all three failure codes');
}

// ================================================================ 7. global consistency
section('global consistency');
{
  check(new Set(orders.map((o) => o.orderNumber)).size === orders.length, 'order numbers unique');
  check(new Set(orders.map((o) => o.commitHash)).size === orders.length, 'commit hashes unique');
  const tx = orders.flatMap((o) => o.paymentAttempts.flatMap((a) => [a.transactionId, a.refundId])).filter(Boolean);
  check(new Set(tx).size === tx.length, 'transaction and refund ids unique');
  check(Math.min(...orders.map((o) => o.orderNumber)) === 1001, 'order numbers start at 1001');
  const byNum = [...orders].sort((a, b) => a.orderNumber - b.orderNumber);
  check(byNum.every((o, i) => o.orderNumber === 1001 + i), 'order numbers contiguous');
  for (let i = 1; i < byNum.length; i++) {
    const a = parseTime(byNum[i - 1].placedAt), b = parseTime(byNum[i].placedAt);
    check(a.group === 'D' && b.group === 'T' || (a.group === b.group && a.v <= b.v), `order numbers ascend with placedAt (${byNum[i - 1].displayNumber}, ${byNum[i].displayNumber})`);
  }
  check(orders.filter((o) => parseTime(o.placedAt).group === 'D').every((o) => o.source === 'GUEST'), 'only guest orders lie on earlier days (kept until reset, housekeeping BR-ORD-22)');
  check(!orders.some((o) => o.source === 'SIMULATOR' && parseTime(o.placedAt).group === 'D'), 'no simulated order older than today');
  // oven capacity at every moment, per day group
  const groupKey = (o) => { const t = parseTime(o.placedAt); return t.group === 'T' ? 'T' : 'D' + t.day; };
  const groups = {};
  for (const o of orders) (groups[groupKey(o)] ??= []).push(o);
  for (const [gk, list] of Object.entries(groups)) {
    const bakes = [];
    for (const o of list) o.statusChanges.forEach((s, i) => {
      if (s.toStatus !== 'BAKING') return;
      const end = o.statusChanges[i + 1] ? tv(o.statusChanges[i + 1].changedAt) : 0;
      const ovenLine = o.logEntries.filter((l) => l.tag === 'OVEN' && l.message.startsWith('Entered') && l.loggedAt === s.changedAt)[0];
      const oven = ovenLine ? /OVEN_\d\d/.exec(ovenLine.message)[0] : null;
      bakes.push({ o, start: tv(s.changedAt), end, oven });
    });
    for (const b of bakes) {
      check(OVEN[b.oven], `${b.o.displayNumber} oven named in log`);
      const at = b.start;
      for (const oc of Object.keys(OVEN)) {
        const n = bakes.filter((x) => x.oven === oc && x.start <= at && x.end > at).length;
        check(n <= OVEN[oc].capacityOrders, `${gk} ${oc} capacity at ${b.o.displayNumber} start (${n})`);
      }
    }
    // courier: one order at a time incl. return trip (today only)
    if (gk === 'T') {
      const trips = list.filter((o) => o.courier).map((o) => ({ o, c: o.courier, start: tv(o.readyAt), end: o.completedAt ? tv(o.completedAt) + ZONE[o.zip].tripSecondsAt1x : Infinity }));
      for (const a of trips) for (const b of trips) if (a !== b && a.c === b.c) check(a.end <= b.start || b.end <= a.start, `courier ${a.c} overlaps ${a.o.displayNumber} / ${b.o.displayNumber}`);
    }
  }
  // couriers live state
  for (const c of couriers) {
    check(['OFF_DUTY', 'AVAILABLE', 'TO_STORE', 'AT_STORE', 'DELIVERING', 'RETURNING'].includes(c.status) && c.tripProgressPercent >= 0 && c.tripProgressPercent <= 100, `courier ${c.code} status/progress`);
    check(parseTime(c.statusChangedAt), `courier ${c.code} statusChangedAt format`);
    const o = c.currentOrder ? orders.find((x) => x.displayNumber === c.currentOrder) : null;
    if (['TO_STORE', 'AT_STORE'].includes(c.status)) check(o && o.status === 'READY_FOR_DISPATCH' && o.courier === c.code, `courier ${c.code} fetching ${c.currentOrder}`);
    else if (c.status === 'DELIVERING') check(o && o.status === 'OUT_FOR_DELIVERY' && o.courier === c.code && o.routeProgressPercent === c.tripProgressPercent, `courier ${c.code} delivering ${c.currentOrder}`);
    else if (c.status === 'RETURNING') {
      // SIM-04 4.5: the courier keeps the delivered order until AVAILABLE; the return trip = delivery trip of that order
      check(o && o.status === 'DELIVERED' && o.courier === c.code && o.completedAt === c.statusChangedAt, `courier ${c.code} returning from ${c.currentOrder}`);
      if (o) check(Math.round(100 * -tv(c.statusChangedAt) / ZONE[o.zip].tripSecondsAt1x) === c.tripProgressPercent, `courier ${c.code} RETURNING progress = elapsed / delivery trip of ${c.currentOrder}`);
    }
    else check(c.currentOrder === null, `courier ${c.code} has no current order`);
    if (c.status === 'TO_STORE') check(Math.round(100 * -tv(c.statusChangedAt) / sim.durations.courierToStore) === c.tripProgressPercent, `courier ${c.code} TO_STORE progress`);
  }
  for (const o of orders.filter((x) => ['READY_FOR_DISPATCH', 'OUT_FOR_DELIVERY'].includes(x.status) && x.courier)) check(COUR[o.courier].currentOrder === o.displayNumber, `${o.displayNumber} courier points back`);
  for (const o of orders.filter((x) => x.status === 'OUT_FOR_DELIVERY')) {
    const trip = ZONE[o.zip].tripSecondsAt1x;
    check(Math.round(100 * -tv(o.dispatchedAt) / trip) === o.routeProgressPercent, `${o.displayNumber} route progress matches elapsed trip`);
  }
  // BR-ORD-16: a waiting order without courier only when no courier is AVAILABLE
  if (orders.some((o) => o.status === 'READY_FOR_DISPATCH' && !o.courier)) check(!couriers.some((c) => c.status === 'AVAILABLE'), 'WAITING_FOR_COURIER only when no courier is AVAILABLE');
  // every kitchen stage has an order at T (README.md section 6.1)
  for (const s of ['QUEUED', 'BAKING', 'QA_CHECK']) check(orders.some((o) => o.status === s), `kitchen stage ${s} has an order`);
  check(orders.some((o) => ['READY_FOR_DISPATCH', 'READY_FOR_PICKUP'].includes(o.status)), 'kitchen stage READY_* has an order');
  // simulated open orders vs traffic limit
  const simOpen = orders.filter((o) => o.source === 'SIMULATOR' && !FINAL.includes(o.status)).length;
  check(simOpen === sim.trafficMaxActiveOrders, `open simulated orders (${simOpen}) = trafficMaxActiveOrders: the seed starts at the cap (SIM-05 C1)`);
  // simulation events (reference file, not loaded by the app: BR-DEMO-03)
  simEvents.forEach((e, i) => {
    check(e.seq === i + 1 && parseTime(e.occurredAt)?.group === 'T' && e.message.length <= 200, `simulation event ${e.seq} fields`);
    if (e.order) check(orders.some((o) => o.displayNumber === e.order), `simulation event ${e.seq} order exists`);
    if (i > 0) check(tv(e.occurredAt) >= tv(simEvents[i - 1].occurredAt), `simulation event ${e.seq} order`);
  });
  check(simEvents.at(-1).type === 'RESET', 'last simulation event is RESET');
  check(simEvents.at(-1).message === 'Demo data reset by SYSTEM (initial seed). 0 orders removed. Seed restored.', 'reference event log ends with the RESET event of a first start (SIM-08 section 4)');
  // coupon usage (derived timesUsed) is consistent with orders
  for (const c of coupons) check(orders.filter((o) => o.couponCode === c.code).every((o) => o.paymentStatus !== 'UNPAID' || o.status === 'PAYMENT_PENDING' || o.status === 'PAYMENT_FAILED' || o.status === 'CANCELLED'), `coupon ${c.code} usage`);
  // phone numbers: fictional range, no clash between people
  const guestPhones = [...new Set(orders.filter((o) => !o.poolCustomer).map((o) => o.contactPhone))];
  const phones = [store.phone, ...couriers.map((c) => c.phone), ...guestPhones, ...pool.map((p) => p.phone)];
  check(new Set(phones).size === phones.length, 'phone numbers unique across store, couriers and people');
}

// ================================================================ 8. CSV = JSON
section('CSV files equal JSON files');
function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  const [h, ...data] = rows.filter((r) => r.length > 1 || r[0] !== '');
  return data.map((r) => Object.fromEntries(h.map((k, i) => [k, r[i] ?? ''])));
}
function same(jv, cv) {
  if (jv === null || jv === undefined) return cv === '';
  if (Array.isArray(jv)) return jv.join('|') === cv;
  if (typeof jv === 'boolean') return String(jv) === cv;
  if (typeof jv === 'number') return cv !== '' && Number(cv) === jv;
  return String(jv) === cv;
}
function compare(csvFile, jsonRows, keyFn = (r, i) => i) {
  const csv = parseCsv(read(csvFile));
  check(csv.length === jsonRows.length, `${csvFile} row count ${csv.length} vs ${jsonRows.length}`);
  csv.forEach((r, i) => {
    const j = jsonRows[i];
    const extra = Object.keys(r).filter((k) => !(j && k in j));
    if (extra.length) { check(false, `${csvFile} row ${i + 1} columns not in JSON: ${extra}`); return; }
    for (const k of Object.keys(r)) if (!same(j?.[k], r[k])) { check(false, `${csvFile} row ${i + 1} column ${k}: "${r[k]}" vs ${JSON.stringify(j?.[k])}`); return; }
    check(true, '');
  });
}
{
  compare('categories.csv', categories);
  compare('menu-items.csv', products);
  compare('product-sizes.csv', sizes);
  compare('ingredients.csv', ingredients);
  compare('recipe-items.csv', recipe);
  compare('options.csv', options);
  compare('allergens.csv', allergenFile.allergens);
  compare('coupons.csv', coupons);
  compare('delivery-zones.csv', zones);
  compare('ovens.csv', ovens);
  compare('couriers.csv', couriers);
  compare('simulated-customers.csv', pool);
  compare('orders.csv', orders);
  compare('order-lines.csv', orders.flatMap((o) => o.lines.map((l) => ({ orderNumber: o.orderNumber, ...l }))));
  compare('order-line-modifiers.csv', orders.flatMap((o) => o.lines.flatMap((l) => l.modifiers.map((m, i) => ({ orderNumber: o.orderNumber, lineNo: l.lineNo, seq: i + 1, ...m })))));
  compare('payment-attempts.csv', orders.flatMap((o) => o.paymentAttempts.map((a) => ({ orderNumber: o.orderNumber, ...a }))));
  compare('order-status-changes.csv', orders.flatMap((o) => o.statusChanges.map((s) => ({ orderNumber: o.orderNumber, ...s }))));
  compare('order-log-entries.csv', orders.flatMap((o) => o.logEntries.map((l) => ({ orderNumber: o.orderNumber, ...l }))));
  compare('simulation-events.csv', simEvents);
}

// ================================================================ report
const total = sections.reduce((a, s) => a + s.checks, 0);
console.log('Git Pizza MxDev (Lite) — demo seed validation\n');
for (const s of sections) console.log(`${s.errors ? 'FAIL' : 'ok  '}  ${s.name.padEnd(52)} ${String(s.checks).padStart(5)} checks${s.errors ? `, ${s.errors} errors` : ''}`);
console.log(`\n${orders.length} orders, ${orders.reduce((a, o) => a + o.lines.length, 0)} order lines, ${orders.reduce((a, o) => a + o.statusChanges.length, 0)} status changes, ${orders.reduce((a, o) => a + o.logEntries.length, 0)} log lines, ${products.length} products, ${ingredients.length} ingredients, ${options.length} options`);
if (errors.length) {
  console.log(`\n${errors.length} error(s):`);
  for (const e of errors.slice(0, 200)) console.log('  - ' + e);
  process.exit(1);
}
console.log(`\nAll ${total} checks passed.`);
