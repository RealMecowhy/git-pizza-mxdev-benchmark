/* Git Pizza MxDev — clickable prototype, customer part (shared script).
 *
 * Contents: catalog data (copied from 09-demo-data/menu-catalog.md), price rules (BR-PRICE,
 * information-model section 6), prototype state (cart, guest orders of this session) kept in localStorage,
 * the customer shell SCR-16 (demo banner, header, Project Explorer sidebar, footer, phone bottom tabs,
 * toasts) and the PROTOTYPE CONTROLS panel used to show mandatory states.
 *
 * This is a visual reference only. It does not define behavior; the specification does (00-README 5.5).
 */
(function () {
  'use strict';

  // ------------------------------------------------------------------ paths
  var ASSETS = '../../assets/';
  var PAGES = {
    home: 'SCR-01-home.html', menu: 'SCR-02-menu.html', conf: 'SCR-03-pizza-configurator.html', info: 'SCR-04-item-info.html',
    cart: 'SCR-05-cart.html', checkout: 'SCR-06-checkout.html', pay: 'SCR-07-payment-sheet.html', confirm: 'SCR-08-order-confirmation.html',
    track: 'SCR-09-order-tracking.html', lookup: 'SCR-10-track-order-lookup.html', detail: 'SCR-13-order-detail-and-receipt.html', shell: 'SCR-16-customer-shell.html',
    notFound: 'SCR-40-not-found.html', error: 'SCR-41-unexpected-error.html'
  };

  // ------------------------------------------------------------------ store & catalog
  var STORE = {
    name: 'Git Pizza MxDev — Mission Kitchen', address: '2140 Folsom Street, San Francisco, CA 94110', phone: '(415) 555-0142',
    taxRate: 8.625, deliveryFee: 399, freeThreshold: 4000, minDelivery: 1500, maxQty: 10, maxItems: 30, maxAttempts: 3
  };
  var ALLERGENS = {
    GLUTEN: 'Cereals containing gluten', CRUSTACEANS: 'Crustaceans', EGGS: 'Eggs', FISH: 'Fish', PEANUTS: 'Peanuts', SOYBEANS: 'Soybeans',
    MILK: 'Milk', TREE_NUTS: 'Tree nuts', CELERY: 'Celery', MUSTARD: 'Mustard', SESAME: 'Sesame', SULPHITES: 'Sulphur dioxide and sulphites',
    LUPIN: 'Lupin', MOLLUSCS: 'Molluscs'
  };
  var ALLERGEN_NOTICE = 'All items are prepared in a kitchen that handles gluten, milk, eggs, tree nuts, mustard, fish and other allergens. Cross-contact is possible. The Gluten-Free Fork crust is made without gluten ingredients but is not certified gluten-free.';
  var CATEGORIES = [
    { code: 'PIZZAS', file: 'pizzas.json', name: 'Pizzas', kind: 'PIZZA', icon: 'data_object' },
    { code: 'SIDES', file: 'sides.yml', name: 'Sides & Dips', kind: 'SIDE', icon: 'tag' },
    { code: 'DRINKS', file: 'drinks.env', name: 'Drinks', kind: 'DRINK', icon: 'settings_ethernet' },
    { code: 'DESSERTS', file: 'desserts.md', name: 'Desserts', kind: 'DESSERT', icon: 'description' }
  ];
  var SIZES = {
    SMALL: { label: 'Small 10"', short: '10"', inches: 10, slices: 6 },
    MEDIUM: { label: 'Medium 12"', short: '12"', inches: 12, slices: 8 },
    LARGE: { label: 'Large 14"', short: '14"', inches: 14, slices: 8 },
    REGULAR: { label: 'Regular', short: '', slices: 0 }
  };
  // code: [name, allergens, vegetarian, vegan]
  var INGR = {
    dough_neapolitan: ['Neapolitan dough', ['GLUTEN'], 1, 1], dough_thin: ['Thin-crust dough', ['GLUTEN'], 1, 1],
    dough_sourdough: ['Sourdough', ['GLUTEN'], 1, 1], dough_stuffed: ['Neapolitan dough with a mozzarella-filled rim', ['GLUTEN', 'MILK'], 1, 0],
    dough_gluten_free: ['Gluten-free base', [], 1, 1], tomato_san_marzano: ['San Marzano DOP tomato sauce', [], 1, 1],
    bbq_sauce_smoked: ['Smoked hickory BBQ sauce', ['MUSTARD'], 1, 1], garlic_cream: ['Garlic cream', ['MILK'], 1, 0],
    truffle_cream: ['Black truffle cream', ['MILK'], 1, 0], tomato_yellow: ['Yellow datterini tomato purée', [], 1, 1],
    fior_di_latte: ['Fior di latte mozzarella', ['MILK'], 1, 0], buffalo_mozzarella: ['Buffalo mozzarella', ['MILK'], 1, 0],
    cashew_mozzarella: ['Cashew mozzarella', ['TREE_NUTS'], 1, 1], smoked_provolone: ['Smoked provolone', ['MILK'], 1, 0],
    gorgonzola: ['Gorgonzola dolce', ['MILK'], 1, 0], fontina: ['Fontina', ['MILK'], 1, 0], parmesan_style: ['Parmesan-style hard cheese', ['MILK'], 1, 0],
    ricotta: ['Whole-milk ricotta', ['MILK'], 1, 0], stracciatella: ['Stracciatella', ['MILK'], 1, 0], cashew_ricotta: ['Cashew ricotta', ['TREE_NUTS'], 1, 1],
    pepperoni: ['Cup-and-char pepperoni', [], 0, 0], spianata_calabrese: ['Spianata calabrese', [], 0, 0], nduja: ["'Nduja", [], 0, 0],
    italian_sausage: ['Fennel Italian sausage', [], 0, 0], smoked_bacon: ['Applewood-smoked bacon', [], 0, 0], prosciutto_cotto: ['Prosciutto cotto', [], 0, 0],
    pulled_pork: ['Hickory-smoked pulled pork', ['MUSTARD'], 0, 0], grilled_chicken: ['Grilled chicken breast', [], 0, 0],
    basil: ['Fresh basil', [], 1, 1], oregano: ['Dried Sicilian oregano', [], 1, 1], cremini: ['Cremini mushrooms', [], 1, 1],
    porcini: ['Roasted porcini mushrooms', [], 1, 1], red_onion: ['Red onion', [], 1, 1], caramelized_onion: ['Caramelized onions', [], 1, 1],
    green_pepper: ['Green bell pepper', [], 1, 1], roasted_red_pepper: ['Roasted red peppers', [], 1, 1], black_olives: ['Taggiasca olives', [], 1, 1],
    jalapeno: ['Fresh jalapeños', [], 1, 1], pineapple: ['Roasted pineapple', [], 1, 1], cherry_tomatoes: ['Cherry tomatoes', [], 1, 1],
    zucchini: ['Grilled zucchini', [], 1, 1], eggplant: ['Roasted eggplant', [], 1, 1], artichoke: ['Marinated artichoke hearts', [], 1, 1],
    arugula: ['Wild arugula', [], 1, 1], roasted_garlic: ['Roasted garlic cloves', [], 1, 1], evoo: ['Extra-virgin olive oil', [], 1, 1],
    hot_honey: ['Hot honey', [], 1, 0], chili_oil: ['Calabrian chili oil', [], 1, 1], chili_flakes: ['Crushed red pepper', [], 1, 1],
    truffle_oil: ['Black truffle oil', [], 1, 1], garlic_butter: ['Garlic butter', ['MILK'], 1, 0]
  };
  // Options: code -> {key, name, group, desc, sur (cents, CRUST/SAUCE/CHEESE), cls (EXTRA), sizes, ingr, ver}
  var OPTIONS = {};
  function opt(code, key, name, group, sur, sizes, ingr, desc, ver, cls) {
    OPTIONS[code] = { code: code, key: key, name: name, group: group, sur: sur, sizes: sizes, ingr: ingr, desc: desc || '', ver: ver || '', cls: cls || 'FLAT' };
  }
  var SML = ['SMALL', 'MEDIUM', 'LARGE'];
  opt('CR-01', 'neapolitan_core', 'Neapolitan Core', 'CRUST', 0, SML, 'dough_neapolitan', 'Puffy, leopard-spotted rim. 48-hour ferment.');
  opt('CR-02', 'thin_client', 'Thin Client', 'CRUST', 0, SML, 'dough_thin', 'Thin, crisp and light. Low memory footprint.');
  opt('CR-03', 'sourdough_build', 'Sourdough Build', 'CRUST', 150, SML, 'dough_sourdough', '72-hour wheat and rye sourdough. Tangy and airy.');
  opt('CR-04', 'cheese_stuffed_v2', 'Cheese-Stuffed v2', 'CRUST', 250, ['MEDIUM', 'LARGE'], 'dough_stuffed', 'Mozzarella-filled rim.');
  opt('CR-05', 'gluten_free_fork', 'Gluten-Free Fork', 'CRUST', 300, ['SMALL'], 'dough_gluten_free', 'Rice-flour base, made without gluten ingredients. 10" only.');
  opt('SA-01', 'san_marzano', 'San Marzano Tomato', 'SAUCE', 0, SML, 'tomato_san_marzano');
  opt('SA-02', 'smoked_bbq', 'Smoked BBQ', 'SAUCE', 0, SML, 'bbq_sauce_smoked');
  opt('SA-03', 'garlic_cream', 'Garlic Cream', 'SAUCE', 0, SML, 'garlic_cream');
  opt('SA-04', 'truffle_cream', 'Black Truffle Cream', 'SAUCE', 200, SML, 'truffle_cream');
  opt('SA-05', 'yellow_tomato', 'Yellow Tomato', 'SAUCE', 0, SML, 'tomato_yellow');
  opt('SA-06', 'no_sauce', 'No Sauce (bianca)', 'SAUCE', 0, SML, null);
  opt('CH-01', 'fior_di_latte', 'Fior di Latte Mozzarella', 'CHEESE', 0, SML, 'fior_di_latte');
  opt('CH-02', 'buffalo_mozzarella', 'Buffalo Mozzarella', 'CHEESE', 200, SML, 'buffalo_mozzarella');
  opt('CH-03', 'vegan_cashew_mozz', 'Vegan Cashew Mozzarella', 'CHEESE', 150, SML, 'cashew_mozzarella');
  opt('CH-04', 'no_cheese', 'No Cheese', 'CHEESE', 0, SML, null);
  [
    ['EX-01', 'extra_cheese', 'Extra mozzarella', 'S', 'fior_di_latte', 'v1.2.0 · core'], ['EX-02', 'fresh_basil', 'Fresh basil', 'S', 'basil', 'v0.8.0 · beta'],
    ['EX-03', 'mushrooms', 'Cremini mushrooms', 'S', 'cremini', 'v1.4.2'], ['EX-04', 'red_onion', 'Red onion', 'S', 'red_onion', 'v1.0.3'],
    ['EX-05', 'caramelized_onion', 'Caramelized onions', 'S', 'caramelized_onion', 'v2.1.0'], ['EX-06', 'green_pepper', 'Green bell pepper', 'S', 'green_pepper', 'v1.0.0'],
    ['EX-07', 'roasted_red_pepper', 'Roasted red peppers', 'S', 'roasted_red_pepper', 'v1.3.1'], ['EX-08', 'olives', 'Taggiasca olives', 'S', 'black_olives', 'v1.1.0'],
    ['EX-09', 'jalapenos', 'Jalapeños', 'S', 'jalapeno', 'v3.0.0 · hot'], ['EX-10', 'pineapple', 'Roasted pineapple', 'S', 'pineapple', 'v0.9.9 · legacy'],
    ['EX-11', 'cherry_tomatoes', 'Cherry tomatoes', 'S', 'cherry_tomatoes', 'v1.2.4'], ['EX-12', 'arugula', 'Wild arugula', 'S', 'arugula', 'v1.0.1'],
    ['EX-13', 'roasted_garlic', 'Roasted garlic', 'S', 'roasted_garlic', 'v1.1.2'], ['EX-14', 'hot_honey', 'Hot honey drizzle', 'S', 'hot_honey', 'v2.0.0'],
    ['EX-15', 'garlic_butter', 'Garlic butter crust brush', 'S', 'garlic_butter', 'v1.1.2 · shell'], ['EX-16', 'spicy_pepperoni', 'Pepperoni', 'P', 'pepperoni', 'v2.4.1 · addon'],
    ['EX-17', 'italian_sausage', 'Fennel Italian sausage', 'P', 'italian_sausage', 'v2.0.0'], ['EX-18', 'smoked_bacon', 'Applewood-smoked bacon', 'P', 'smoked_bacon', 'v1.5.0'],
    ['EX-19', 'prosciutto_cotto', 'Italian ham (prosciutto cotto)', 'P', 'prosciutto_cotto', 'v1.0.0'], ['EX-20', 'spianata', 'Spianata calabrese', 'P', 'spianata_calabrese', 'v2.4.0 · hot'],
    ['EX-21', 'nduja', "'Nduja", 'P', 'nduja', 'v1.0.0 · hot'], ['EX-22', 'pulled_pork', 'Smoked pulled pork', 'P', 'pulled_pork', 'v2.0.4'],
    ['EX-23', 'grilled_chicken', 'Grilled chicken', 'P', 'grilled_chicken', 'v1.0.0'], ['EX-24', 'stracciatella', 'Stracciatella', 'P', 'stracciatella', 'v1.1.0'],
    ['EX-25', 'porcini', 'Porcini mushrooms', 'P', 'porcini', 'v1.0.2']
  ].forEach(function (e) { opt(e[0], e[1], e[2], 'EXTRA', 0, SML, e[4], '', e[5], e[3] === 'S' ? 'STANDARD' : 'PREMIUM'); });
  var EXTRA_PRICE = { STANDARD: { SMALL: 150, MEDIUM: 200, LARGE: 250 }, PREMIUM: { SMALL: 250, MEDIUM: 300, LARGE: 350 } };

  var PRODUCTS = [];
  function pizza(o) { o.kind = 'PIZZA'; o.cat = 'PIZZAS'; if (o.crustSel === undefined) o.crustSel = true; if (!o.max) o.max = 5; o.crust = 'CR-01'; PRODUCTS.push(o); }
  function item(o) { PRODUCTS.push(o); }
  // r: recipe items [ingredient, role T/F, removable 1/0]
  pizza({ code: 'PZ-01', name: 'The Root Pizza', real: 'Margherita', key: 'root-pizza', ver: 'v1.0-LTS', prices: { SMALL: 1199, MEDIUM: 1499, LARGE: 1799 }, spice: 'NONE', badges: ['CLASSIC'], featured: true, img: 'products/pz-01-root-pizza.jpg',
    sauce: 'SA-01', cheese: 'CH-01', r: [['basil', 'F', 1], ['evoo', 'F', 1]], kcal: { SMALL: 760, MEDIUM: 1080, LARGE: 1470 },
    short: 'San Marzano tomatoes, fior di latte and fresh basil on our 48-hour dough.',
    desc: 'The essential foundation. Hand-crushed San Marzano DOP tomatoes, creamy fior di latte mozzarella and torn basil on a 48-hour fermented Neapolitan crust, finished with a ribbon of cold-pressed extra-virgin olive oil. Clean, minimal and perfectly balanced: the architecture of pure flavor.',
    alt: 'The Root Pizza: Margherita with San Marzano tomato, melted fior di latte and fresh basil leaves.' });
  pizza({ code: 'PZ-02', name: 'Boolean Pepperoni', real: 'Pepperoni with hot honey', key: 'boolean-pepperoni', ver: 'v1.2', prices: { SMALL: 1349, MEDIUM: 1699, LARGE: 2049 }, spice: 'MILD', badges: ['BEST_SELLER'], featured: true, img: 'products/pz-02-boolean-pepperoni.jpg',
    sauce: 'SA-01', cheese: 'CH-01', r: [['pepperoni', 'T', 0], ['oregano', 'T', 1], ['hot_honey', 'F', 1]], kcal: { SMALL: 900, MEDIUM: 1290, LARGE: 1750 },
    short: 'Double-layer cup-and-char pepperoni with a hot honey glaze.',
    desc: 'A binary choice that always returns true. Two layers of cup-and-char pepperoni that crisp into little bowls of flavor, fior di latte and San Marzano sauce, finished with a drizzle of chili-infused wildflower hot honey and a pinch of Sicilian oregano.',
    alt: 'Boolean Pepperoni: pepperoni pizza with crisp curled pepperoni cups and a glossy hot honey drizzle.' });
  pizza({ code: 'PZ-03', name: 'SQL Supreme', real: 'Supreme', key: 'sql-supreme', ver: 'v2.0', prices: { SMALL: 1499, MEDIUM: 1849, LARGE: 2249 }, spice: 'NONE', badges: [], featured: true, img: 'products/pz-03-sql-supreme.jpg',
    sauce: 'SA-01', cheese: 'CH-01', r: [['italian_sausage', 'T', 1], ['cremini', 'T', 1], ['green_pepper', 'T', 1], ['red_onion', 'T', 1], ['black_olives', 'T', 1], ['oregano', 'T', 1]], kcal: { SMALL: 970, MEDIUM: 1380, LARGE: 1880 },
    short: 'Fennel sausage, mushrooms, peppers, red onion and olives.',
    desc: 'Complex queries for complex palates. Fennel Italian sausage, cremini mushrooms, green bell pepper, red onion and Taggiasca olives over San Marzano sauce and fior di latte, seasoned with Sicilian oregano. Every join returns something delicious.',
    alt: 'SQL Supreme: supreme pizza with sausage, mushrooms, green peppers, red onion and black olives.' });
  pizza({ code: 'PZ-04', name: 'Binary BBQ', real: 'BBQ pulled pork', key: 'binary-bbq', ver: 'v2.0.4', prices: { SMALL: 1599, MEDIUM: 1999, LARGE: 2400 }, spice: 'NONE', badges: ['CHEF_PICK'], featured: true, img: 'products/pz-04-binary-bbq.jpg',
    sauce: 'SA-02', cheese: 'CH-01', r: [['pulled_pork', 'T', 0], ['smoked_provolone', 'T', 1], ['caramelized_onion', 'T', 1], ['red_onion', 'T', 1], ['basil', 'F', 1]], kcal: { SMALL: 1020, MEDIUM: 1460, LARGE: 1990 },
    short: 'Smoked pulled pork, caramelized onions and smoked provolone on hickory BBQ sauce.',
    desc: 'Low and slow meets hot and fast. Hickory-smoked pulled pork shoulder, sweet caramelized onions, sharp red onion and smoked provolone on a smoky BBQ base with fior di latte, finished with fresh basil and a blistered, leopard-spotted rim.',
    alt: 'Binary BBQ: Neapolitan pizza with pulled pork, caramelized onions and fresh basil on a dark slate.' });
  pizza({ code: 'PZ-05', name: 'Inferno Payload', real: 'Diavola', key: 'inferno-payload', ver: 'v2.4', prices: { SMALL: 1449, MEDIUM: 1849, LARGE: 2250 }, spice: 'HOT', badges: [], featured: true, img: 'products/pz-05-inferno-payload.jpg',
    sauce: 'SA-01', cheese: 'CH-02', r: [['spianata_calabrese', 'T', 0], ['jalapeno', 'T', 1], ['chili_oil', 'F', 1], ['chili_flakes', 'F', 1]], kcal: { SMALL: 920, MEDIUM: 1310, LARGE: 1780 },
    short: 'Spicy spianata calabrese, fresh jalapeños and buffalo mozzarella with Calabrian chili oil.',
    desc: 'Deploy with caution: this payload runs hot. Spicy spianata calabrese salami, fresh jalapeño coins and creamy buffalo mozzarella over San Marzano sauce, finished with Calabrian chili oil and crushed red pepper.',
    alt: 'Inferno Payload: spicy pizza with salami, jalapeño slices, buffalo mozzarella and chili flakes.' });
  pizza({ code: 'PZ-06', name: 'Kernel Panic Meat', real: 'Meat lovers', key: 'kernel-panic-meat', ver: 'v3.1', prices: { SMALL: 1599, MEDIUM: 1999, LARGE: 2449 }, spice: 'NONE', badges: [], featured: false, img: 'products/pz-06-kernel-panic-meat.jpg',
    sauce: 'SA-01', cheese: 'CH-01', r: [['pepperoni', 'T', 1], ['italian_sausage', 'T', 1], ['smoked_bacon', 'T', 1], ['prosciutto_cotto', 'T', 1], ['oregano', 'T', 1]], kcal: { SMALL: 1110, MEDIUM: 1590, LARGE: 2160 },
    short: 'Pepperoni, fennel sausage, smoked bacon and Italian ham.',
    desc: 'Four protein threads, zero deadlocks. Cup-and-char pepperoni, fennel Italian sausage, applewood-smoked bacon and prosciutto cotto layered over San Marzano sauce and fior di latte, with a dusting of oregano. Built for serious appetites.',
    alt: 'Kernel Panic Meat: meat lovers pizza loaded with pepperoni, sausage, bacon and ham.' });
  pizza({ code: 'PZ-07', name: 'Truffle Kernel', real: 'Truffle & wild mushroom bianca', key: 'truffle-kernel', ver: 'v2.0', prices: { SMALL: 1649, MEDIUM: 2049, LARGE: 2499 }, spice: 'NONE', badges: ['NEW'], featured: false, img: 'products/pz-07-truffle-kernel.jpg',
    sauce: 'SA-04', cheese: 'CH-01', r: [['porcini', 'T', 0], ['cremini', 'T', 1], ['stracciatella', 'F', 1], ['truffle_oil', 'F', 1]], kcal: { SMALL: 950, MEDIUM: 1350, LARGE: 1840 },
    short: 'Black truffle cream, porcini and cremini mushrooms, cool stracciatella.',
    desc: 'A white pizza for the winter release. Black truffle cream instead of tomato, roasted porcini and cremini mushrooms and fior di latte, finished after the bake with spoonfuls of cool, milky stracciatella and a few drops of black truffle oil.',
    alt: 'Truffle Kernel: white pizza with roasted mushrooms and dollops of stracciatella.' });
  pizza({ code: 'PZ-08', name: 'Quad-Core Formaggi', real: 'Quattro formaggi', key: 'quad-core-formaggi', ver: 'v4.0', prices: { SMALL: 1399, MEDIUM: 1749, LARGE: 2149 }, spice: 'NONE', badges: [], featured: false, img: 'products/pz-08-quad-core-formaggi.jpg',
    sauce: 'SA-06', cheese: 'CH-01', r: [['gorgonzola', 'T', 0], ['fontina', 'T', 0], ['parmesan_style', 'T', 0], ['evoo', 'F', 1]], kcal: { SMALL: 990, MEDIUM: 1420, LARGE: 1930 },
    short: 'Four cheeses, no sauce: mozzarella, gorgonzola, fontina and aged hard cheese.',
    desc: 'Four cores running in parallel. A bianca base of fior di latte, creamy gorgonzola dolce, nutty fontina and a vegetarian parmesan-style hard cheese, baked until bubbling and finished with extra-virgin olive oil. Rich, savory and perfectly multithreaded.',
    alt: 'Quad-Core Formaggi: golden four-cheese pizza with melted pools of gorgonzola.' });
  pizza({ code: 'PZ-09', name: 'The Clean Code', real: 'Ortolana (grilled vegetables)', key: 'clean-code', ver: 'v1.3', prices: { SMALL: 1299, MEDIUM: 1649, LARGE: 1999 }, spice: 'NONE', badges: [], featured: false, img: 'products/pz-09-clean-code.jpg',
    sauce: 'SA-01', cheese: 'CH-01', r: [['zucchini', 'T', 1], ['eggplant', 'T', 1], ['roasted_red_pepper', 'T', 1], ['cherry_tomatoes', 'T', 1], ['red_onion', 'T', 1], ['basil', 'F', 1]], kcal: { SMALL: 780, MEDIUM: 1120, LARGE: 1520 },
    short: 'Grilled zucchini, roasted eggplant, peppers and cherry tomatoes.',
    desc: 'Readable, maintainable and full of vegetables. Grilled zucchini, roasted eggplant, roasted red peppers, sweet cherry tomatoes and red onion over San Marzano sauce and fior di latte, finished with fresh basil. No technical debt, just flavor.',
    alt: 'The Clean Code: vegetable pizza with grilled zucchini, eggplant, red peppers and cherry tomatoes.' });
  pizza({ code: 'PZ-10', name: 'Low-Mem Garden', real: 'Vegan garden pizza', key: 'low-mem-garden', ver: 'v3.0-RC', prices: { SMALL: 1349, MEDIUM: 1699, LARGE: 2049 }, spice: 'NONE', badges: ['NEW'], featured: true, img: 'products/pz-10-low-mem-garden.jpg',
    sauce: 'SA-05', cheese: 'CH-03', r: [['artichoke', 'T', 1], ['black_olives', 'T', 1], ['cherry_tomatoes', 'T', 1], ['cashew_ricotta', 'F', 1], ['arugula', 'F', 1], ['evoo', 'F', 1]], kcal: { SMALL: 740, MEDIUM: 1060, LARGE: 1440 },
    short: 'Yellow tomato, cashew mozzarella, artichokes, olives and arugula. 100 % plant-based.',
    desc: 'Small footprint, full performance. Sweet yellow datterini tomato sauce and melty cashew mozzarella topped with marinated artichoke hearts, Taggiasca olives and cherry tomatoes, finished with dollops of lemony cashew ricotta, wild arugula and extra-virgin olive oil. Entirely plant-based.',
    alt: 'Low-Mem Garden: vegan pizza with yellow tomato, artichokes, olives and fresh arugula.' });
  pizza({ code: 'PZ-11', name: 'Hawaiian Legacy Fix', real: 'Hawaiian (ham & pineapple)', key: 'hawaiian-legacy-fix', ver: 'v0.9-legacy', prices: { SMALL: 1349, MEDIUM: 1699, LARGE: 2049 }, spice: 'MILD', badges: ['CLASSIC'], featured: false, img: 'products/pz-11-hawaiian-legacy-fix.jpg',
    sauce: 'SA-01', cheese: 'CH-01', r: [['prosciutto_cotto', 'T', 0], ['pineapple', 'T', 0], ['jalapeno', 'T', 1]], kcal: { SMALL: 850, MEDIUM: 1210, LARGE: 1650 },
    short: 'Italian ham, roasted pineapple and a jalapeño patch.',
    desc: 'Legacy code that still ships, now with a hotfix. Prosciutto cotto and caramelized roasted pineapple over San Marzano sauce and fior di latte, patched with a few fresh jalapeño slices for a sweet-and-heat balance.',
    alt: 'Hawaiian Legacy Fix: ham and pineapple pizza with a few green jalapeño slices.' });
  pizza({ code: 'PZ-12', name: 'Calzone Container', real: 'Calzone', key: 'calzone-container', ver: 'v1.1', prices: { MEDIUM: 1649 }, spice: 'NONE', badges: [], featured: false, img: 'products/pz-12-calzone-container.jpg', crustSel: false, max: 3, slices: 1,
    sauce: 'SA-01', cheese: 'CH-01', r: [['ricotta', 'T', 0], ['prosciutto_cotto', 'T', 1], ['cremini', 'T', 1], ['basil', 'T', 1]], kcal: { MEDIUM: 1240 },
    short: 'Folded and sealed: ricotta, mozzarella, Italian ham and mushrooms.',
    desc: 'Everything packaged in one portable container. Our Neapolitan dough folded around whole-milk ricotta, fior di latte, prosciutto cotto, cremini mushrooms and fresh basil, baked until golden and served with San Marzano sauce baked inside.',
    alt: 'Calzone Container: golden folded calzone, cut open to show ricotta, ham and mushrooms.' });

  function nonPizza(cat, kind, code, name, real, key, serving, price, allergens, diet, spice, kcal, desc, img, caffeine) {
    item({ code: code, name: name, real: real, key: key, kind: kind, cat: cat, serving: serving, prices: { REGULAR: price }, allergens: allergens, diet: diet,
      spice: spice, kcal: kcal, desc: desc, short: desc.split('. ')[0] + '.', img: img || ('products/' + code.toLowerCase() + '-' + key + '.jpg'), caffeine: caffeine, badges: [], featured: false, alt: name + ': ' + real.toLowerCase() + '.' });
  }
  nonPizza('SIDES', 'SIDE', 'SD-01', 'Garlic Knot Loop', 'Garlic knots with marinara', 'garlic-knot-loop', '6 pieces + 2 fl oz marinara', 650, ['GLUTEN', 'MILK'], 'V', 'NONE', 520,
    'Six hand-tied knots of our pizza dough, baked golden, tossed in garlic butter, parsley and parmesan-style cheese, with San Marzano marinara for dipping. An infinite loop you will not want to break.');
  nonPizza('SIDES', 'SIDE', 'SD-02', 'Caesar Cipher Salad', 'Caesar salad', 'caesar-cipher-salad', '1 bowl', 895, ['GLUTEN', 'MILK', 'EGGS', 'FISH', 'MUSTARD'], '', 'NONE', 430,
    'Crisp romaine hearts, shaved parmesan-style cheese and sourdough croutons in a classic anchovy Caesar dressing. Decrypts to: delicious.');
  nonPizza('SIDES', 'SIDE', 'SD-03', 'Hot Wings Webhook', 'Chicken wings, Calabrian chili glaze', 'hot-wings-webhook', '8 wings + blue cheese dip + celery', 1195, ['MILK', 'EGGS', 'CELERY'], '', 'MEDIUM', 760,
    'Eight crispy oven-roasted chicken wings glazed with Calabrian chili and honey, served with blue cheese dip and celery sticks. Fires on every bite.');
  nonPizza('SIDES', 'SIDE', 'SD-04', 'Garlic Driver Dip', 'Roasted garlic & herb dip', 'garlic-driver-dip', '2 fl oz', 150, ['MILK', 'EGGS'], 'V', 'NONE', 210,
    'Roasted garlic and herb emulsion. The essential driver for crusts and knots.');
  nonPizza('SIDES', 'SIDE', 'SD-05', 'Jalapeño Patch Dip', 'Creamy jalapeño ranch dip', 'jalapeno-patch-dip', '2 fl oz', 150, ['MILK', 'EGGS'], 'V', 'MILD', 190,
    'Cool buttermilk ranch with fresh jalapeño and cilantro. A gentle heat patch for any slice.');
  nonPizza('DRINKS', 'DRINK', 'DR-01', 'Mate Compiler Tonic', 'Sparkling yerba mate', 'mate-compiler-tonic', '12 fl oz can', 450, [], 'VG', 'NONE', 15,
    'Cold-brewed yerba mate with green tea and a squeeze of lime, lightly sparkling and sugar-free. Clean energy for long compile times.', 'products/dr-01-mate-compiler-tonic.jpg', '150 mg');
  nonPizza('DRINKS', 'DRINK', 'DR-02', 'Cold Brew Commit', 'Cold brew coffee', 'cold-brew-commit', '12 fl oz bottle', 475, [], 'VG', 'NONE', 10,
    'Single-origin Colombian coffee steeped cold for 18 hours. Smooth, chocolatey, unsweetened. Commit to the night shift.', null, '200 mg');
  nonPizza('DRINKS', 'DRINK', 'DR-03', 'Cola Cache', 'Classic cola', 'cola-cache', '12 fl oz can', 275, [], 'VG', 'NONE', 140,
    'Ice-cold classic cola with cane sugar. Always a cache hit.', null, '34 mg');
  nonPizza('DRINKS', 'DRINK', 'DR-04', 'Lemon Lint Soda', 'Italian sparkling lemon soda', 'lemon-lint-soda', '11.2 fl oz bottle', 325, [], 'VG', 'NONE', 150,
    'Sparkling Sicilian lemon soda, bright and not too sweet. Removes every warning from your palate.', null, '0 mg');
  nonPizza('DRINKS', 'DRINK', 'DR-05', 'Sparkling Stream Water', 'Sparkling mineral water', 'sparkling-stream-water', '16.9 fl oz bottle', 295, [], 'VG', 'NONE', 0,
    'Naturally carbonated Italian mineral water. Zero dependencies.', null, '0 mg');
  nonPizza('DESSERTS', 'DESSERT', 'DS-01', 'Tiramisu Stack', 'Tiramisu', 'tiramisu-stack', '1 cup', 750, ['GLUTEN', 'EGGS', 'MILK'], 'V', 'NONE', 450,
    'Espresso-soaked ladyfingers layered with whipped mascarpone and finished with dark cocoa. Every layer pushed in the right order.');
  nonPizza('DESSERTS', 'DESSERT', 'DS-02', 'Cannoli Callback', 'Sicilian cannoli', 'cannoli-callback', '2 pieces', 695, ['GLUTEN', 'MILK', 'EGGS', 'TREE_NUTS'], 'V', 'NONE', 520,
    'Two crisp Sicilian shells piped to order with sweet ricotta and chocolate chips, dipped in crushed pistachios. Called back the moment you finish.');
  nonPizza('DESSERTS', 'DESSERT', 'DS-03', 'Lava Exception Cake', 'Molten chocolate lava cake', 'lava-exception-cake', '1 cake', 725, ['GLUTEN', 'EGGS', 'MILK', 'SOYBEANS'], 'V', 'NONE', 480,
    'A warm dark-chocolate cake with a molten center that throws on the first spoonful. Handle with vanilla ice cream (not included).');

  var BY_CODE = {}; PRODUCTS.forEach(function (p) { BY_CODE[p.code] = p; });

  // Lite: only the coupons a guest can use (09-demo-data, BR-DEMO-03a).
  var COUPONS = {
    GITHUB_STUDENT: { desc: 'Student discount: 15% off, up to $10.', type: 'PERCENT', value: 15, max: 1000, min: 2000, until: '2027-06-30T23:59:00', delivOnly: false },
    FREE_DISPATCH: { desc: 'Free delivery on this order.', type: 'FREE_DELIVERY', value: 0, min: 1500, until: null, delivOnly: true },
    HOTFIX10: { desc: '10% off (October hotfix sale).', type: 'PERCENT', value: 10, min: 0, until: '2026-10-31T23:59:00', delivOnly: false }
  };
  // Stock of the Lite seed (BR-DEMO-03a): fixed, nobody changes it while the app runs.
  var SOLD_OUT = { 'DS-01': true };       // Tiramisu Stack: isSoldOut = true
  var OUT_OF_STOCK = { jalapeno: true };  // jalapeno: isInStock = false (extra EX-09 unavailable)
  var ZONES = { '94110': ['Mission', 0.8], '94103': ['SoMa', 1.4], '94114': ['Castro / Noe Valley', 1.6], '94107': ['Potrero Hill / Dogpatch', 1.9],
    '94102': ['Hayes Valley / Civic Center', 2.0], '94158': ['Mission Bay', 2.3], '94117': ['Haight-Ashbury', 2.6], '94105': ['Rincon Hill / Financial District', 2.8] };
  var TEST_CARDS = {
    VISA_4242: { label: 'Visa •••• 4242', outcome: 'Approves', ok: true },
    MASTERCARD_4444: { label: 'Mastercard •••• 4444', outcome: 'Approves', ok: true },
    VISA_0002: { label: 'Visa •••• 0002', outcome: 'Declined', ok: false, code: 'DECLINED' },
    VISA_9995: { label: 'Visa •••• 9995', outcome: 'Insufficient funds', ok: false, code: 'INSUFFICIENT_FUNDS' },
    AMEX_0005: { label: 'Amex •••• 0005', outcome: 'Gateway timeout', ok: false, code: 'GATEWAY_TIMEOUT' }
  };
  var FAILURES = { DECLINED: 'Card declined by issuer', INSUFFICIENT_FUNDS: 'Insufficient funds', GATEWAY_TIMEOUT: 'Payment gateway timed out' };
  var METHODS = { CARD: 'Card', APPLE_PAY: 'Apple Pay', GOOGLE_PAY: 'Google Pay' };
  var TIPS = { NONE: 0, TEN: 10, FIFTEEN: 15, TWENTY: 20 };
  var STATUS = {
    PAYMENT_PENDING: { dev: 'STAGED', plain: 'Awaiting payment', cls: 'st-staged' },
    PAYMENT_FAILED: { dev: 'PAYMENT_FAILED', plain: 'Payment failed', cls: 'st-failed' },
    QUEUED: { dev: 'QUEUED', plain: 'Order received', cls: 'st-queued' },
    BAKING: { dev: 'BAKING', plain: 'In the oven', cls: 'st-baking' },
    QA_CHECK: { dev: 'QA_CHECK', plain: 'Quality check & packing', cls: 'st-qa' },
    READY_FOR_DISPATCH: { dev: 'DISPATCH_READY', plain: 'Waiting for courier', cls: 'st-dispatch' },
    READY_FOR_PICKUP: { dev: 'READY_TO_PULL', plain: 'Ready for pickup', cls: 'st-dispatch' },
    OUT_FOR_DELIVERY: { dev: 'IN_TRANSIT', plain: 'On the way', cls: 'st-dispatch' },
    DELIVERED: { dev: 'DEPLOYED', plain: 'Delivered', cls: 'st-deployed' },
    PICKED_UP: { dev: 'PULLED', plain: 'Picked up', cls: 'st-deployed' },
    CANCELLED: { dev: 'ROLLED_BACK', plain: 'Cancelled', cls: 'st-failed' }
  };
  var FINAL = { DELIVERED: 1, PICKED_UP: 1, CANCELLED: 1 };
  // Simulator durations at 1x (order-lifecycle 7.1)
  var DUR = { paymentProcessing: 3, paymentTimeout: 10, queueWait: 20, bake: 90, qa: 30, courierToStore: 30, handover: 5, travelBase: 60, travelPerMile: 40, pickupArrival: 90 };

  // ------------------------------------------------------------------ seed orders (binding seed: 09-demo-data/orders.json)
  // BEGIN seed orders — Lite (09-demo-data/README.md): guest orders (source GUEST) with the contact Jordan Lee. They are found on SCR-10 with the order number and jordan.lee@example.com.
  var SEED_CONTACT = { name: 'Jordan Lee', email: 'jordan.lee@example.com', phone: '(415) 555-0117' };
  var SEED_ADDRESSES = [
    { line1: '88 Langton Street', line2: 'Apt 3B', city: 'San Francisco', state: 'CA', zip: '94103', notes: 'Buzz 3B at the street door; the elevator is on the left.' },
    { line1: '500 Howard Street', line2: 'Floor 4, Suite 410', city: 'San Francisco', state: 'CA', zip: '94105', notes: 'Ring the call box #410, leave with security desk.' }
  ];
  function P(code, size, qty, cfg) { var l = { p: code, size: size || 'REGULAR', qty: qty || 1 }; var pr = BY_CODE[code]; if (pr.kind === 'PIZZA') { l.crust = (cfg && cfg.crust) || 'CR-01'; l.sauce = (cfg && cfg.sauce) || pr.sauce; l.cheese = (cfg && cfg.cheese) || pr.cheese; l.extras = (cfg && cfg.extras) || []; l.removed = (cfg && cfg.removed) || []; } return l; }
  // [orderNumber, commitHash, placed, type, address index, status, lines, coupon, tip, method, test card, cancel reason]
  var HISTORY_DEF = [
    [1040, '28317dd', '2026-11-05 18:40', 'DELIVERY', 0, 'BAKING', [P('PZ-05', 'LARGE', 1, {crust: 'CR-01', extras: ['EX-09']}), P('PZ-02', 'MEDIUM', 1, {crust: 'CR-01'}), P('DR-01', 'REGULAR', 2)], null, 'FIFTEEN', 'CARD', 'VISA_4242', null],
    [1018, '8c1e3ec', '2026-10-30 23:05', 'DELIVERY', 0, 'DELIVERED', [P('PZ-02', 'MEDIUM', 1, {crust: 'CR-01', extras: ['EX-14']}), P('SD-04', 'REGULAR', 1), P('DR-02', 'REGULAR', 1)], null, 'FIFTEEN', 'CARD', 'MASTERCARD_4444', null],
    [1017, 'd06a2f0', '2026-10-23 12:10', 'DELIVERY', 1, 'DELIVERED', [P('PZ-01', 'LARGE', 2, {crust: 'CR-01'}), P('PZ-06', 'LARGE', 1, {crust: 'CR-01'}), P('PZ-10', 'LARGE', 1, {crust: 'CR-01'}), P('SD-01', 'REGULAR', 2), P('DR-05', 'REGULAR', 4)], null, 'TWENTY', 'CARD', 'VISA_4242', null],
    [1016, 'b8b2342', '2026-10-16 21:41', 'DELIVERY', 0, 'DELIVERED', [P('PZ-11', 'MEDIUM', 1, {crust: 'CR-01', removed: ['jalapeno']}), P('PZ-01', 'MEDIUM', 1, {crust: 'CR-01'}), P('SD-05', 'REGULAR', 2), P('DR-03', 'REGULAR', 1)], null, 'FIFTEEN', 'CARD', 'VISA_4242', null],
    [1015, '0ce1dc3', '2026-10-09 19:30', 'PICKUP', null, 'PICKED_UP', [P('PZ-01', 'MEDIUM', 1, {crust: 'CR-01'}), P('DS-02', 'REGULAR', 1)], null, 'NONE', 'APPLE_PAY', null, null],
    [1014, 'e0ed6e6', '2026-10-02 22:50', 'DELIVERY', 1, 'DELIVERED', [P('PZ-05', 'LARGE', 1, {crust: 'CR-01'}), P('PZ-04', 'LARGE', 1, {crust: 'CR-01'}), P('DR-01', 'REGULAR', 2)], null, 'FIFTEEN', 'CARD', 'VISA_4242', null],
    [1013, 'cbbef90', '2026-09-25 20:02', 'DELIVERY', 0, 'DELIVERED', [P('PZ-10', 'MEDIUM', 1, {crust: 'CR-01'}), P('SD-02', 'REGULAR', 1)], null, 'FIFTEEN', 'GOOGLE_PAY', null, null],
    [1012, '5fe3e42', '2026-09-18 21:15', 'DELIVERY', 0, 'DELIVERED', [P('PZ-01', 'MEDIUM', 1, {crust: 'CR-01'}), P('PZ-04', 'LARGE', 1, {crust: 'CR-01'}), P('DR-01', 'REGULAR', 2), P('DS-03', 'REGULAR', 1)], null, 'FIFTEEN', 'CARD', 'VISA_4242', null],
    [1011, 'd3436ad', '2026-09-11 12:45', 'PICKUP', null, 'PICKED_UP', [P('PZ-08', 'SMALL', 1, {crust: 'CR-01'}), P('DR-02', 'REGULAR', 1)], null, 'NONE', 'CARD', 'VISA_4242', null],
    [1010, '5459f08', '2026-09-04 19:48', 'DELIVERY', 1, 'DELIVERED', [P('PZ-03', 'LARGE', 1, {crust: 'CR-01'}), P('SD-01', 'REGULAR', 1)], null, 'FIFTEEN', 'CARD', 'VISA_4242', null],
    [1009, '8c435bc', '2026-09-04 19:40', 'DELIVERY', 0, 'CANCELLED', [P('PZ-03', 'LARGE', 1, {crust: 'CR-01'}), P('SD-01', 'REGULAR', 1)], null, 'FIFTEEN', 'CARD', 'VISA_4242', 'Cancelled by customer'],
    [1008, '3e6e235', '2026-08-28 23:12', 'DELIVERY', 0, 'DELIVERED', [P('PZ-02', 'LARGE', 1, {crust: 'CR-04', extras: ['EX-21']}), P('DR-02', 'REGULAR', 1)], null, 'FIFTEEN', 'CARD', 'VISA_4242', null],
    [1007, '1d3c783', '2026-08-21 20:56', 'DELIVERY', 0, 'DELIVERED', [P('PZ-07', 'MEDIUM', 1, {crust: 'CR-01'}), P('DS-01', 'REGULAR', 1)], null, 'FIFTEEN', 'CARD', 'VISA_4242', null],
    [1006, '09b99ed', '2026-08-14 12:20', 'DELIVERY', 1, 'DELIVERED', [P('PZ-01', 'MEDIUM', 1, {crust: 'CR-02', extras: ['EX-12']}), P('DR-05', 'REGULAR', 1)], null, 'FIFTEEN', 'CARD', 'VISA_4242', null],
    [1005, '0eb350d', '2026-08-07 22:38', 'DELIVERY', 0, 'DELIVERED', [P('PZ-06', 'MEDIUM', 1, {crust: 'CR-01'}), P('SD-03', 'REGULAR', 1), P('DR-03', 'REGULAR', 2)], null, 'TWENTY', 'CARD', 'VISA_4242', null],
    [1004, '9fc096f', '2026-07-31 19:05', 'PICKUP', null, 'PICKED_UP', [P('PZ-01', 'LARGE', 1, {crust: 'CR-01'}), P('SD-01', 'REGULAR', 1)], null, 'NONE', 'CARD', 'VISA_4242', null],
    [1003, '7da2ea2', '2026-07-24 21:47', 'DELIVERY', 0, 'DELIVERED', [P('PZ-05', 'LARGE', 1, {crust: 'CR-01', extras: ['EX-09']}), P('DR-01', 'REGULAR', 2)], null, 'FIFTEEN', 'APPLE_PAY', null, null],
    [1002, '6799053', '2026-07-17 12:31', 'DELIVERY', 1, 'DELIVERED', [P('PZ-09', 'MEDIUM', 1, {crust: 'CR-01'}), P('DR-04', 'REGULAR', 1)], null, 'TEN', 'CARD', 'VISA_4242', null],
    [1001, '1a36494', '2026-07-10 20:14', 'DELIVERY', 0, 'DELIVERED', [P('PZ-01', 'MEDIUM', 1, {crust: 'CR-01'}), P('PZ-02', 'MEDIUM', 1, {crust: 'CR-01'})], null, 'FIFTEEN', 'CARD', 'VISA_4242', null]
  ];
  // END seed orders

  // ------------------------------------------------------------------ helpers
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(c) { var neg = c < 0; c = Math.abs(Math.round(c)); var d = Math.floor(c / 100), ce = c % 100; var s = String(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); return (neg ? '−$' : '$') + s + '.' + (ce < 10 ? '0' : '') + ce; }
  function roundPct(cents, pctTimes1000) { /* half-up: cents * pct / 100 where pct given ×1000 */ return Math.floor((cents * pctTimes1000 + 50000) / 100000); }
  function param(n) { try { return new URLSearchParams(location.search).get(n); } catch (e) { return null; } }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hhmm(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function hhmmss(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()); }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function mmss(sec) { sec = Math.max(0, Math.ceil(sec)); return pad(Math.floor(sec / 60)) + ':' + pad(sec % 60); }
  function hex(n) { var s = ''; for (var i = 0; i < n; i++) s += '0123456789abcdef'[Math.floor(Math.random() * 16)]; return s; }

  // ------------------------------------------------------------------ state (localStorage, wrapped)
  var KEY = 'gitpizza-proto-lite-v1';
  function defaults() {
    return { cart: { lines: [], coupon: null }, speed: 1, seq: 1047,
      checkout: { type: 'DELIVERY', addr: { line1: '', line2: '', city: 'San Francisco', state: 'CA', zip: '', notes: '' }, contact: { name: '', email: '', phone: '' }, method: 'CARD', card: 'VISA_4242', tip: 'FIFTEEN' },
      orders: [], sims: {}, pendingOrder: null, lastOrder: null };
  }
  var mem = null;
  function load() {
    if (mem) return mem;
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { s = null; }
    var d = defaults();
    if (s && typeof s === 'object') { for (var k in d) if (s[k] === undefined) s[k] = d[k]; mem = s; } else mem = d;
    return mem;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* in-memory only */ } }
  var state = load();

  // ------------------------------------------------------------------ catalog logic
  function ingrInStock(code) { return !OUT_OF_STOCK[code]; }
  function optAvailable(code) { var o = OPTIONS[code]; return !o.ingr || ingrInStock(o.ingr); }
  function isOrderable(p) {
    if (SOLD_OUT[p.code]) return false;
    if (p.kind !== 'PIZZA') return true;
    if (!optAvailable(p.crust) || !optAvailable(p.sauce) || !optAvailable(p.cheese)) return false;
    for (var i = 0; i < p.r.length; i++) if (!p.r[i][2] && !ingrInStock(p.r[i][0])) return false;
    return true;
  }
  function defaultSize(p) { return p.kind === 'PIZZA' ? (p.prices.MEDIUM ? 'MEDIUM' : Object.keys(p.prices)[0]) : 'REGULAR'; }
  function cardPrice(p) { return p.prices[defaultSize(p)]; }
  function sizeShort(p) { return p.kind === 'PIZZA' ? SIZES[defaultSize(p)].short : ''; }
  function defaultLine(code) {
    var p = BY_CODE[code], l = { p: code, size: defaultSize(p), qty: 1 };
    if (p.kind === 'PIZZA') { l.crust = p.crust; l.sauce = p.sauce; l.cheese = p.cheese; l.extras = []; l.removed = p.r.filter(function (r) { return r[2] && !ingrInStock(r[0]); }).map(function (r) { return r[0]; }); }
    return l;
  }
  function unitPrice(l) {
    var p = BY_CODE[l.p], c = p.prices[l.size] || 0;
    if (p.kind !== 'PIZZA') return c;
    ['crust', 'sauce', 'cheese'].forEach(function (g) { if (l[g] !== p[g]) c += OPTIONS[l[g]].sur; });
    (l.extras || []).forEach(function (e) { c += EXTRA_PRICE[OPTIONS[e].cls][l.size]; });
    return c;
  }
  function lineIngredients(l) {
    var p = BY_CODE[l.p]; if (p.kind !== 'PIZZA') return null;
    var list = [];
    p.r.forEach(function (r) { if ((l.removed || []).indexOf(r[0]) < 0) list.push(r[0]); });
    ['crust', 'sauce', 'cheese'].forEach(function (g) { var o = OPTIONS[l[g]]; if (o.ingr) list.push(o.ingr); });
    (l.extras || []).forEach(function (e) { list.push(OPTIONS[e].ingr); });
    return list;
  }
  function lineAllergens(l) {
    var p = BY_CODE[l.p]; if (p.kind !== 'PIZZA') return p.allergens.slice();
    var set = {}; lineIngredients(l).forEach(function (i) { INGR[i][1].forEach(function (a) { set[a] = 1; }); });
    return Object.keys(ALLERGENS).filter(function (a) { return set[a]; });
  }
  function lineDiet(l) {
    var p = BY_CODE[l.p]; if (p.kind !== 'PIZZA') return { veg: p.diet === 'V' || p.diet === 'VG', vegan: p.diet === 'VG' };
    var ing = lineIngredients(l), veg = true, vegan = true;
    ing.forEach(function (i) { if (!INGR[i][2]) veg = false; if (!INGR[i][3]) vegan = false; });
    return { veg: veg, vegan: vegan };
  }
  function lineAvailable(l) {
    var p = BY_CODE[l.p]; if (!isOrderable(p)) return false; if (p.kind !== 'PIZZA') return true;
    if (!optAvailable(l.crust) || !optAvailable(l.sauce) || !optAvailable(l.cheese)) return false;
    for (var i = 0; i < l.extras.length; i++) if (!optAvailable(l.extras[i])) return false;
    var ing = lineIngredients(l); for (var j = 0; j < ing.length; j++) if (!ingrInStock(ing[j])) return false;
    return true;
  }
  function lineMods(l) {
    var p = BY_CODE[l.p]; if (p.kind !== 'PIZZA') return [p.serving];
    var m = [SIZES[l.size].label, OPTIONS[l.crust].name];
    if (l.sauce !== p.sauce) m.push(OPTIONS[l.sauce].name); if (l.cheese !== p.cheese) m.push(OPTIONS[l.cheese].name);
    (l.extras || []).forEach(function (e) { m.push('+ ' + OPTIONS[e].name); });
    (l.removed || []).forEach(function (r) { m.push('− ' + INGR[r][0]); });
    return m;
  }
  function configKey(l) { return [l.p, l.size, l.crust, l.sauce, l.cheese, (l.extras || []).slice().sort().join('+'), (l.removed || []).slice().sort().join('+')].join('|'); }

  // ------------------------------------------------------------------ cart
  function cart() { return state.cart; }
  function itemCount() { return state.cart.lines.reduce(function (s, l) { return s + l.qty; }, 0); }
  function addLine(line, replaceIndex) {
    var lines = state.cart.lines;
    if (replaceIndex != null && lines[replaceIndex]) lines.splice(replaceIndex, 1);
    var k = configKey(line);
    for (var i = 0; i < lines.length; i++) if (configKey(lines[i]) === k) { lines[i].qty = Math.min(STORE.maxQty, lines[i].qty + line.qty); save(); return lines[i]; }
    lines.push(line); save(); return line;
  }
  function setQty(i, q) { var l = state.cart.lines[i]; if (!l) return; l.qty = Math.max(1, Math.min(STORE.maxQty, q)); save(); }
  function removeLine(i) { state.cart.lines.splice(i, 1); save(); }
  function clearCart() { state.cart.lines = []; state.cart.coupon = null; save(); }
  function couponCheck(code, sub, type) {
    if (!code) return { state: 'NONE' };
    var c = COUPONS[code.toUpperCase()];
    if (!c) return { state: 'INVALID', msg: 'Coupon not found: ' + code.toUpperCase(), attach: false };
    code = code.toUpperCase();
    if (c.until && new Date() > new Date(c.until)) return { state: 'INVALID', msg: 'Coupon ' + code + ' has expired', attach: false };
    if (c.delivOnly && type === 'PICKUP') return { state: 'NOT_APPLIED', msg: code + ' is valid for delivery orders only', code: code, c: c };
    if (sub < c.min) return { state: 'NOT_APPLIED', msg: 'Add ' + money(c.min - sub) + ' more to use ' + code, code: code, c: c };
    return { state: 'APPLIED', msg: c.desc, code: code, c: c };
  }
  // BR-PRICE-04 … 10
  function totals(lines, coupon, type, tip) {
    var sub = lines.reduce(function (s, l) { return s + unitPrice(l) * l.qty; }, 0);
    var cc = couponCheck(coupon, sub, type), disc = 0, feeWaived = null;
    if (cc.state === 'APPLIED') {
      if (cc.c.type === 'PERCENT') { disc = roundPct(sub, cc.c.value * 1000); if (cc.c.max) disc = Math.min(disc, cc.c.max); }
      else if (cc.c.type === 'FIXED_AMOUNT') disc = Math.min(cc.c.value, sub);
    }
    var base = sub - disc, fee = 0;
    if (type === 'DELIVERY') { fee = STORE.deliveryFee; if (sub >= STORE.freeThreshold) { fee = 0; feeWaived = 'THRESHOLD'; } else if (cc.state === 'APPLIED' && cc.c.type === 'FREE_DELIVERY') { fee = 0; feeWaived = 'COUPON'; } }
    var tax = roundPct(base, STORE.taxRate * 1000);
    var tipPct = type === 'DELIVERY' ? TIPS[tip || 'FIFTEEN'] : 0;
    var tipAmt = roundPct(base, tipPct * 1000);
    return { subtotal: sub, discount: disc, coupon: cc, deliveryFee: fee, feeWaived: feeWaived, tax: tax, tipPct: tipPct, tip: tipAmt, total: base + fee + tax + tipAmt,
      belowMin: type === 'DELIVERY' && sub < STORE.minDelivery, missingForMin: STORE.minDelivery - sub, toFree: STORE.freeThreshold - sub };
  }
  function cartTotals(type, tip) { var c = state.checkout; return totals(state.cart.lines, state.cart.coupon, type || c.type, tip || c.tip); }

  // ------------------------------------------------------------------ orders & simulation
  function seedOrders() {
    return HISTORY_DEF.map(function (h) {
      var addr = h[4] == null ? null : SEED_ADDRESSES[h[4]];
      var o = { no: h[0], hash: h[1], placed: h[2], type: h[3], addr: addr, status: h[5], lines: h[6], coupon: h[7], tipOpt: h[8], method: h[9], card: h[10],
        source: 'GUEST', contact: JSON.parse(JSON.stringify(SEED_CONTACT)), paid: true, history: true };
      o.t = totals(o.lines, o.coupon, o.type, o.tipOpt);
      if (o.t.coupon.state !== 'APPLIED') o.coupon = null;
      o.txn = 'txn_sim_' + (o.hash + o.hash).slice(0, 12);
      if (o.status === 'CANCELLED') { o.cancelReason = h[11] || 'Cancelled by customer'; o.cancelledBy = 'GUEST'; o.refundId = 'rfd_sim_' + (o.hash + '00000').slice(0, 12); o.paymentStatus = 'REFUNDED'; o.frozenAt = 'QUEUED'; }
      else o.paymentStatus = 'PAID';
      if (o.status === 'BAKING') { o.active = true; }
      return o;
    });
  }
  // Orders of this guest session (LITE-SES): the seed orders are not in the session, they are found on SCR-10 only.
  function allOrders() { return state.orders.slice().sort(function (a, b) { return b.no - a.no; }); }
  function findOrder(no) {
    no = parseInt(String(no).replace(/\D/g, ''), 10);
    var o = state.orders.filter(function (x) { return x.no === no; })[0];
    if (o) return o;
    return seedOrders().filter(function (x) { return x.no === no; })[0] || null;
  }
  function segments(o) {
    var dist = o.type === 'DELIVERY' ? (o.distance || 2.8) : 0;
    var s = [['QUEUED', DUR.queueWait], ['BAKING', DUR.bake], ['QA_CHECK', DUR.qa]];
    if (o.type === 'DELIVERY') { s.push(['READY_FOR_DISPATCH', DUR.courierToStore + DUR.handover]); s.push(['OUT_FOR_DELIVERY', Math.round(DUR.travelBase + DUR.travelPerMile * dist)]); s.push(['DELIVERED', 0]); }
    else { s.push(['READY_FOR_PICKUP', DUR.pickupArrival]); s.push(['PICKED_UP', 0]); }
    return s;
  }
  function sim(o) {
    var s = state.sims[o.no];
    if (!s) { s = state.sims[o.no] = { anchor: Date.now(), el: o.history ? 60 : 0, speed: state.speed }; save(); }
    return s;
  }
  function elapsed(o) { var s = sim(o); return s.el + (Date.now() - s.anchor) / 1000 * s.speed; }
  function setElapsed(o, el) { state.sims[o.no] = { anchor: Date.now(), el: el, speed: state.speed }; save(); }
  function setSpeed(f) { var now = Date.now(); for (var k in state.sims) { var s = state.sims[k]; s.el = s.el + (now - s.anchor) / 1000 * s.speed; s.anchor = now; s.speed = f; } state.speed = f; save(); }
  // Returns {status, inStatus (s), statusDur, el, seg index}
  function liveStatus(o) {
    if (o.history && !o.active) return { status: o.status, fixed: true };
    if (o.fixed) return { status: o.fixed, fixed: true, frozenAt: o.frozenAt };
    var el = elapsed(o), segs = segments(o), acc = 0;
    for (var i = 0; i < segs.length; i++) {
      if (segs[i][1] === 0 || el < acc + segs[i][1]) return { status: segs[i][0], inStatus: el - acc, dur: segs[i][1], el: el, idx: i, segs: segs, startOf: acc };
      acc += segs[i][1];
    }
    return { status: segs[segs.length - 1][0], el: el, idx: segs.length - 1, segs: segs };
  }
  function isActive(o) { return !FINAL[liveStatus(o).status]; }
  function activeOrder() { var l = allOrders().filter(isActive); return l[0] || null; }
  function lastOrder() { return allOrders()[0] || null; }
  function trackHref() { var o = activeOrder() || lastOrder(); return o ? PAGES.track + '?id=MX-' + o.no : PAGES.lookup; }
  // BR-SIM-16c: queue position of a QUEUED order. The prototype has no competing traffic: position 2 at T-02, position 1 after half of queueWait.
  function queuePos(o) { var ls = liveStatus(o); if (ls.status !== 'QUEUED' || ls.inStatus == null) return null; return ls.inStatus < DUR.queueWait / 2 ? 2 : 1; }

  function createOrder() {
    var c = state.checkout;
    var t = cartTotals();
    var no = state.seq++;
    var o = { no: no, hash: hex(7), token: hex(32), placed: ymd(new Date()) + ' ' + hhmm(new Date()), placedTs: Date.now(), type: c.type,
      addr: c.type === 'DELIVERY' ? JSON.parse(JSON.stringify(c.addr)) : null, distance: c.type === 'DELIVERY' && ZONES[c.addr.zip] ? ZONES[c.addr.zip][1] : 0,
      lines: JSON.parse(JSON.stringify(state.cart.lines)), coupon: t.coupon.state === 'APPLIED' ? t.coupon.code : null, tipOpt: c.type === 'DELIVERY' ? c.tip : 'NONE',
      contact: JSON.parse(JSON.stringify(c.contact)), source: 'GUEST', t: t,
      attempts: [], fixed: 'PAYMENT_PENDING', paid: false, paymentStatus: 'UNPAID' };
    state.orders.push(o); state.pendingOrder = no; save();
    return o;
  }
  function saveOrder(o) { for (var i = 0; i < state.orders.length; i++) if (state.orders[i].no === o.no) state.orders[i] = o; save(); }

  // ------------------------------------------------------------------ html fragments
  function imgHtml(p, opts) {
    opts = opts || {};
    var file = p.img || ('products/' + p.code.toLowerCase() + '-' + p.key + '.jpg');
    if (p.img) return '<div class="img-frame ' + (opts.cls || '') + '"><img src="' + ASSETS + p.img + '" alt="' + esc(p.alt) + '" loading="lazy"></div>';
    return '<div class="img-frame ' + (opts.cls || '') + '" role="img" aria-label="' + esc(p.alt) + '"><div class="img-ph"><img src="' + ASSETS + 'icons/icon-pizza-module.svg" alt=""><span class="cap">IMAGE_PENDING // ' + esc(file.replace('products/', '')) + '</span></div></div>';
  }
  function placeholder(file, icon, label) {
    return '<div class="img-ph"><span class="ms" aria-hidden="true">' + (icon || 'image') + '</span><span class="cap">IMAGE_PENDING // ' + esc(file) + '</span>' + (label ? '<span class="cap">' + esc(label) + '</span>' : '') + '</div>';
  }
  // Transparent illustration (assets/illustrations/), shown whole inside its box
  function illus(file, alt) { return '<img class="illus" src="' + ASSETS + file + '" alt="' + esc(alt || '') + '">'; }
  function q(s) { return '<span class="s">\'' + esc(s) + '\'</span>'; }
  function codeBlock(p, l) {
    if (p.kind === 'PIZZA') {
      l = l || defaultLine(p.code);
      // FD-02 BR-MENU-06 / SCR-02 E-08e: crust, sauce, cheese, toppings (recipe order); no sauce / no cheese = null
      var top = [];
      p.r.forEach(function (r) { if ((l.removed || []).indexOf(r[0]) < 0) top.push(INGR[r[0]][0]); });
      function ov(id) { return id === 'SA-06' || id === 'CH-04' ? '<span class="k">null</span>' : q(OPTIONS[id].name); }
      var h = '<span class="k">const</span> pizza <span class="p">=</span> <span class="p">{</span>\n' +
        '  crust: ' + q(OPTIONS[l.crust].name) + '<span class="p">,</span>\n' +
        '  sauce: ' + ov(l.sauce) + '<span class="p">,</span>\n' +
        '  cheese: ' + ov(l.cheese) + '<span class="p">,</span>\n' +
        '  toppings: <span class="p">[</span>' + top.map(q).join('<span class="p">, </span>') + '<span class="p">]</span>';
      return h + '\n<span class="p">};</span>';
    }
    var v = p.kind === 'SIDE' ? 'side' : p.kind === 'DRINK' ? 'drink' : 'dessert';
    var h2 = '<span class="k">const</span> ' + v + ' <span class="p">= {</span>\n  serving: ' + q(p.serving) + '<span class="p">,</span>\n';
    if (p.caffeine) h2 += '  caffeine: ' + q(p.caffeine) + '<span class="p">,</span>\n';
    h2 += '  allergens: <span class="p">[</span>' + (p.allergens.length ? p.allergens.map(q).join('<span class="p">, </span>') : '') + '<span class="p">]</span><span class="p">,</span>\n  kcal: <span class="n">' + p.kcal + '</span>\n<span class="p">};</span>';
    return h2;
  }
  function badgesHtml(p, l) {
    var out = [], map = { CLASSIC: ['&lt;Classic /&gt;', ''], BEST_SELLER: ['&lt;BestSeller /&gt;', 'tag-badge'], NEW: ['&lt;NewRelease /&gt;', 'tag-new'], CHEF_PICK: ['&lt;ChefPick /&gt;', 'tag-chef'] };
    var d = l ? lineDiet(l) : (p.kind === 'PIZZA' ? lineDiet(defaultLine(p.code)) : lineDiet({ p: p.code }));
    if (d.vegan) out.push('<span class="chip tag-badge" title="Vegan: no animal products">&lt;Vegan /&gt;</span>');
    else if (d.veg) out.push('<span class="chip tag-badge" title="Vegetarian">&lt;Vegetarian /&gt;</span>');
    (p.badges || []).forEach(function (b) { out.push('<span class="chip ' + map[b][1] + '">' + map[b][0] + '</span>'); });
    if (p.spice && p.spice !== 'NONE') { var lv = { MILD: 1, MEDIUM: 2, HOT: 3 }[p.spice]; out.push('<span class="chip tag-spice" title="Spice level: ' + p.spice.charAt(0) + p.spice.slice(1).toLowerCase() + '"><span class="ms sm" aria-hidden="true">local_fire_department</span>HOTFIX_SPICY ' + lv + '/3</span>'); }
    return out.join(' ');
  }
  function statusBadge(st) { var m = STATUS[st]; return '<span class="badge ' + m.cls + '" title="' + esc(m.plain) + '"><span aria-hidden="true">●</span>' + m.dev + '<span class="sr-only"> (' + esc(m.plain) + ')</span></span>'; }
  function allergenText(list) { return list.length ? list.map(function (a) { return ALLERGENS[a]; }).join(', ') : 'No major allergens'; }

  // ------------------------------------------------------------------ shell (SCR-16)
  var body = document.body;
  var NAV = body.getAttribute('data-nav') || '';
  var LAYOUT = body.getAttribute('data-layout') || 'sidebar';
  function h(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }

  // DEMO MODE banner (TXT-NAV-28, TXT-NAV-29); Lite has no role switch (US-004). Also used by the error pages SCR-40 / SCR-41.
  function demoBanner() { return '<div class="demo-banner" role="note"><span class="txt"><strong>DEMO MODE //</strong> <span class="hide-phone">Payments, kitchen and delivery are simulated. No real orders, no real charges.</span><span class="only-phone">Simulated orders &amp; payments</span></span></div>'; }
  function buildShell() {
    var n = itemCount();
    var banner = h(demoBanner());
    var cartEmpty = n === 0;
    var header = h('<header class="app-header">' +
      '<a class="brand" href="' + PAGES.home + '" aria-label="Git Pizza MxDev home"><img class="logo-h" src="' + ASSETS + 'brand/logo-horizontal.svg" alt="" width="181" height="32"><img class="logo-m" src="' + ASSETS + 'brand/logo-mark.svg" alt="" width="36" height="36"></a>' +
      '<nav class="main-nav" aria-label="Main">' +
      '<a href="' + PAGES.home + '" class="' + (NAV === 'home' ? 'active' : '') + '" title="Home">./main.js</a>' +
      '<a href="' + PAGES.menu + '" class="' + (NAV === 'menu' ? 'active' : '') + '" title="Menu">./menu.ts</a>' +
      (cartEmpty ? '<a class="disabled' + (NAV === 'checkout' ? ' active' : '') + '" aria-disabled="true" title="Your manifest is empty. Import a module first.">./checkout.yml</a>' : '<a href="' + PAGES.checkout + '" class="' + (NAV === 'checkout' ? 'active' : '') + '" title="Checkout">./checkout.yml</a>') +
      '<a href="' + trackHref() + '" class="' + (NAV === 'track' ? 'active' : '') + '" title="Track order">./track.log</a></nav>' +
      '<div class="header-tools">' +
      '<form class="grep" role="search" action="' + PAGES.menu + '"><span class="ms md c-muted" aria-hidden="true">search</span><input name="q" aria-label="Search the menu" placeholder="grep --pizza \'...\'" value="' + esc(NAV === 'menu' ? (param('q') || '') : '') + '"></form>' +
      '<a class="icon-btn" href="' + PAGES.cart + '" aria-label="Cart (manifest), ' + n + ' items" title="MANIFEST.LOCK — cart"><span class="ms">shopping_cart</span>' + (n ? '<span class="count-bubble" data-cart-count>' + n + '</span>' : '') + '</a>' +
      '</div></header>');
    body.insertBefore(header, body.firstChild);
    body.insertBefore(banner, body.firstChild);

    var main = document.getElementById('main');
    if (LAYOUT === 'sidebar' && main) {
      var layout = h('<div class="layout"></div>');
      main.parentNode.insertBefore(layout, main);
      var catOpen = NAV === 'menu';
      var act = activeOrder() || lastOrder();
      var sb = h('<aside class="sidebar" aria-label="Project Explorer"><div class="sb-head"><div class="t-label c-primary">Project Explorer</div><div class="t-small c-muted mt-8">src/pizza-mxdev/</div></div><nav>' +
        '<a href="' + PAGES.home + '" class="' + (NAV === 'home' ? 'active' : '') + '"><span class="ms md" aria-hidden="true">folder</span>Root</a>' +
        '<a href="' + PAGES.menu + '" class="' + (NAV === 'menu' ? 'active' : '') + '" aria-expanded="' + catOpen + '"><span class="ms md" aria-hidden="true">list</span>Categories</a>' +
        '<div class="sub">' + CATEGORIES.map(function (c) { return '<a href="' + PAGES.menu + '?cat=' + c.code + '" title="' + esc(c.name) + '">' + c.file + '</a>'; }).join('') + '</div>' +
        (act ? '<a href="' + PAGES.track + '?id=MX-' + act.no + '" class="' + (NAV === 'track' ? 'active' : '') + '" title="My last order"><span class="ms md" aria-hidden="true">rocket_launch</span>Active_Deployments</a>' : '') + /* FD-01 4.1: guests see it only with an order in this session */
        '</nav><div class="sb-foot"><a class="btn btn-secondary btn-block" href="' + PAGES.menu + '" title="Start a new order"><span class="ms md" aria-hidden="true">add</span>New Branch</a>' +
        '</div></aside>');
      layout.appendChild(sb);
      layout.appendChild(main);
      main.classList.add('content');
    }

    // FD-01 4.1 step 5: TXT-NAV-35 store line, TXT-NAV-36 version, links TXT-NAV-37 – 39
    var footer = h('<footer class="app-footer"><div class="f-brand"><img src="' + ASSETS + 'brand/logo-mark.svg" alt="" width="32" height="32"><div><div>© ' + new Date().getFullYear() + ' ' + esc(STORE.name) + ' · ' + esc(STORE.address) + ' · ' + STORE.phone + '</div><div class="t-micro c-muted">./git-pizza-mxdev --version 1.0.0</div></div></div>' +
      '<nav aria-label="Footer"><a href="' + PAGES.menu + '" title="Menu">menu.ts</a><a href="' + trackHref() + '" title="Track order">track.log</a><a href="#allergens" data-allergens title="Allergen information">allergens.md</a></nav></footer>');
    body.appendChild(footer);
    footer.querySelector('[data-allergens]').addEventListener('click', function (e) { e.preventDefault(); confirmDialog({ title: 'allergens.md', body: esc(ALLERGEN_NOTICE), ok: 'Close', noCancel: true, icon: 'health_and_safety' }); });

    var bn = h('<nav class="bottom-nav" aria-label="Phone tabs">' +
      '<a href="' + PAGES.menu + '" class="' + (NAV === 'menu' ? 'active' : '') + '" aria-label="Menu (Source)"><span class="ms">code</span>Source</a>' +
      '<a href="' + PAGES.cart + '" class="' + (NAV === 'cart' || NAV === 'checkout' ? 'active' : '') + '" aria-label="Cart (Deploy), ' + n + ' items"><span class="ms">rocket_launch</span>Deploy' + (n ? '<span class="count-bubble">' + n + '</span>' : '') + '</a>' +
      '<a href="' + trackHref() + '" class="' + (NAV === 'track' ? 'active' : '') + '" aria-label="Track order (Trace)"><span class="ms">terminal</span>Trace</a>' +
      '</nav>');
    body.appendChild(bn); body.classList.add('has-bottom-nav');
    body.appendChild(h('<div class="toasts" aria-live="polite"></div>'));
  }
  function refreshCartCount() {
    var n = itemCount();
    Array.prototype.forEach.call(document.querySelectorAll('.app-header .icon-btn[href="' + PAGES.cart + '"], .bottom-nav a[href="' + PAGES.cart + '"]'), function (a) {
      var b = a.querySelector('.count-bubble'); if (!n) { if (b) b.remove(); return; } if (!b) { b = document.createElement('span'); b.className = 'count-bubble'; a.appendChild(b); } b.textContent = n;
      a.setAttribute('aria-label', a.getAttribute('aria-label').replace(/\d+ items/, n + ' items'));
    });
    var co = document.querySelector('.main-nav a[title^="Checkout"]');
    if (co && n && co.classList.contains('disabled')) { co.classList.remove('disabled'); co.removeAttribute('aria-disabled'); co.href = PAGES.checkout; co.title = 'Checkout'; }
  }
  function toast(msg, type, href, linkText) {
    var box = document.querySelector('.toasts'); if (!box) return;
    var t = h('<div class="toast ' + (type || '') + '" role="' + (type === 'error' ? 'alert' : 'status') + '"><span class="ms md" aria-hidden="true">' + (type === 'error' ? 'error' : type === 'info' ? 'info' : 'check_circle') + '</span><span>' + msg + '</span>' + (href ? '<a href="' + href + '">' + linkText + '</a>' : '') + '<button class="toast-x" aria-label="Close notification"><span class="ms sm" aria-hidden="true">close</span></button></div>');
    t.querySelector('.toast-x').onclick = function () { t.remove(); };
    box.appendChild(t); while (box.children.length > 3) box.removeChild(box.firstChild);
    /* BR-ERR-08: 4 s success/info, 6 s warning or with action, errors stay until closed */
    if (type !== 'error') setTimeout(function () { t.remove(); }, (type === 'warn' || href) ? 6000 : 4000);
  }
  function confirmDialog(opts) {
    var scrim = h('<div class="scrim"></div>');
    var dlg = h('<div class="modal dialog" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t"><div class="modal-head"><span class="ms c-' + (opts.danger ? 'error' : 'primary') + '" aria-hidden="true">' + (opts.icon || 'help') + '</span><h2 class="t-h3" id="dlg-t">' + opts.title + '</h2></div><div class="modal-body t-small c-secondary">' + opts.body + '</div><div class="modal-foot">' + (opts.noCancel ? '' : '<button class="btn btn-ghost" data-x>' + (opts.cancel || 'Cancel') + '</button>') + '<button class="btn ' + (opts.danger ? 'btn-danger-strong' : 'btn-primary') + '" data-ok' + (opts.okLabel ? ' aria-label="' + esc(opts.okLabel) + '"' : '') + '>' + opts.ok + '</button></div></div>');
    function close() { scrim.remove(); dlg.remove(); }
    if (dlg.querySelector('[data-x]')) dlg.querySelector('[data-x]').onclick = close; scrim.onclick = close;
    dlg.querySelector('[data-ok]').onclick = function () { close(); opts.onOk && opts.onOk(); };
    document.addEventListener('keydown', function esc_(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc_); } });
    body.appendChild(scrim); body.appendChild(dlg); dlg.querySelector('[data-ok]').focus();
  }

  // ------------------------------------------------------------------ prototype controls (not part of the app)
  var pageStates = null, pageStateCb = null;
  function registerStates(list, onChange) { pageStates = list; pageStateCb = onChange; }
  function currentState() { return param('state') || (pageStates && pageStates[0] && pageStates[0][0]) || ''; }
  function buildProtoPanel() {
    var fab = h('<button class="proto-fab" aria-expanded="false" aria-controls="proto-panel">◧ Prototype</button>');
    var panel = h('<div class="proto-panel" id="proto-panel" hidden></div>');
    function render() {
      var sc = body.getAttribute('data-screen') || '';
      var html = '<div class="between"><span class="pp-title">PROTOTYPE CONTROLS</span><a class="pp-link" href="../index.html">All screens</a></div><div class="pp-note">Not part of the app. Use these to show the mandatory states of ' + esc(sc) + '. Data is stored in this browser only.</div>';
      if (pageStates && pageStates.length) {
        html += '<h4>Screen states (' + esc(sc) + ')</h4><div class="pp-btns">' + pageStates.map(function (s) { return '<button data-st="' + s[0] + '" class="' + (currentState() === s[0] ? 'on' : '') + '">' + esc(s[1]) + '</button>'; }).join('') + '</div>';
      }
      html += '<h4>Cart</h4><div class="pp-btns"><button data-cart="empty">Empty</button><button data-cart="a">Example A ($55.50)</button><button data-cart="b">Example B + GITHUB_STUDENT</button><button data-cart="small">Below $15 minimum</button></div>';
      html += '<h4>Stock (Lite seed, fixed)</h4><div class="pp-note">Tiramisu Stack is sold out; jalapeños are out of stock (extra Jalapeños unavailable, removed from Inferno Payload and Hawaiian Legacy Fix).</div>';
      html += '<h4>Simulation speed (constant SpeedFactor)</h4><div class="pp-btns">' + [1, 2, 5, 10].map(function (f) { return '<button data-speed="' + f + '" class="' + (state.speed === f ? 'on' : '') + '">' + f + '×</button>'; }).join('') + '</div>';
      html += '<h4>Reset</h4><div class="pp-btns"><button data-reset>Reset prototype data</button></div>';
      panel.innerHTML = html;
    }
    panel.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.st) { var url = new URL(location.href); url.searchParams.set('state', b.dataset.st); location.href = url.toString(); return; }
      if (b.dataset.cart) {
        state.cart.coupon = null;
        if (b.dataset.cart === 'empty') state.cart.lines = [];
        if (b.dataset.cart === 'a') state.cart.lines = [P('PZ-05', 'LARGE'), P('PZ-04', 'LARGE'), P('DR-01', null, 2)];
        if (b.dataset.cart === 'b') { state.cart.lines = [P('PZ-01', 'MEDIUM'), P('SD-01')]; state.cart.coupon = 'GITHUB_STUDENT'; }
        if (b.dataset.cart === 'small') state.cart.lines = [P('SD-01'), P('DR-03')];
        save(); location.reload(); return;
      }
      if (b.dataset.speed) { setSpeed(parseInt(b.dataset.speed, 10)); render(); return; }
      if (b.hasAttribute('data-reset')) { mem = defaults(); save(); location.href = PAGES.home; }
    });
    fab.addEventListener('click', function () { var open = panel.hidden; panel.hidden = !open; fab.setAttribute('aria-expanded', String(open)); if (open) render(); });
    body.appendChild(fab); body.appendChild(panel);
  }

  // ------------------------------------------------------------------ public API
  window.GP = {
    ASSETS: ASSETS, PAGES: PAGES, STORE: STORE, ALLERGENS: ALLERGENS, ALLERGEN_NOTICE: ALLERGEN_NOTICE, CATEGORIES: CATEGORIES, SIZES: SIZES,
    INGR: INGR, OPTIONS: OPTIONS, EXTRA_PRICE: EXTRA_PRICE, PRODUCTS: PRODUCTS, BY_CODE: BY_CODE, COUPONS: COUPONS, SOLD_OUT: SOLD_OUT, OUT_OF_STOCK: OUT_OF_STOCK, ZONES: ZONES, TEST_CARDS: TEST_CARDS, FAILURES: FAILURES,
    METHODS: METHODS, TIPS: TIPS, STATUS: STATUS, FINAL: FINAL, DUR: DUR,
    state: function () { return state; }, save: save, esc: esc, money: money, param: param, hhmm: hhmm, hhmmss: hhmmss, ymd: ymd, mmss: mmss, hex: hex, h: h,
    isOrderable: isOrderable, ingrInStock: ingrInStock, optAvailable: optAvailable, defaultSize: defaultSize, cardPrice: cardPrice, sizeShort: sizeShort, defaultLine: defaultLine,
    unitPrice: unitPrice, lineAllergens: lineAllergens, lineDiet: lineDiet, lineAvailable: lineAvailable, lineMods: lineMods, configKey: configKey,
    cart: cart, itemCount: itemCount, addLine: addLine, setQty: setQty, removeLine: removeLine, clearCart: clearCart, couponCheck: couponCheck, totals: totals, cartTotals: cartTotals,
    seedOrders: seedOrders, allOrders: allOrders, findOrder: findOrder, segments: segments, liveStatus: liveStatus, elapsed: elapsed, queuePos: queuePos,
    setElapsed: setElapsed, setSpeed: setSpeed, isActive: isActive, activeOrder: activeOrder, lastOrder: lastOrder, createOrder: createOrder, saveOrder: saveOrder, trackHref: trackHref,
    imgHtml: imgHtml, placeholder: placeholder, illus: illus, codeBlock: codeBlock, badgesHtml: badgesHtml, statusBadge: statusBadge, allergenText: allergenText,
    toast: toast, confirmDialog: confirmDialog, refreshCartCount: refreshCartCount, registerStates: registerStates, currentState: currentState, demoBanner: demoBanner
  };

  if (!body.hasAttribute('data-no-shell')) buildShell();
  buildProtoPanel();
})();
