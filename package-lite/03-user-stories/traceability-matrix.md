# Traceability Matrix — User Stories

This matrix links every user story of Git Pizza MxDev Lite to the screens it touches, its functional area, the business rules it verifies, and the processes and simulations involved. It is generated from the story files in this folder; if the two ever differ, the story file is leading.

How to use it:

- **Contractors** use section 2 for `RUN/self-assessment.json`: one entry per story with `done`, `partial` or `no` and where in the app it is.
- **Reviewers** use sections 3 – 7 to check that every screen, simulation, process and rule family of Lite is covered by at least one story.
- **Verified by** (last column of section 2) names the test cases (`TC-xxx`) and end-to-end scenarios (`E2E-xx`) of [`../12-acceptance/test-scenarios.md`](../12-acceptance/test-scenarios.md) that verify the story; each of those tests names the story in its **Covers** line. Test cases use the same number ranges per epic as the stories (`../01-product-brief/ids-and-traceability.md` section 3).

**Business-rule notation.** Foundation rules are cited by number (`BR-PRICE-xx`, `BR-ORD-xx`, `BR-DATA-xx`). Rules owned by a functional-design file are cited by family with `*` (e.g. `BR-CART-*` = the rules of FD-04) or by number where a story depends on one rule. Lite rules are cited by number: `LITE-CFG-xx` ([lite-configuration.md](../10-simulations/lite-configuration.md)), `LITE-SES-xx` and `LITE-SEC-xx` (information model sections 2 and 10); additions to an existing rule carry a letter suffix (e.g. `BR-SIM-16a` in SIM-02).

## 1. Summary per epic

| Epic | Name | Functional area | Stories | Must | Should | Could | Acceptance criteria | of which negative |
|---|---|---|---|---|---|---|---|---|
| [EP-01](EP-01-shell-navigation.md) | Shell, navigation and branding | FD-01 | 9 | 9 | 0 | 0 | 47 | 10 |
| [EP-02](EP-02-menu-browsing.md) | Menu browsing (module explorer) | FD-02 | 14 | 12 | 1 | 1 | 72 | 20 |
| [EP-03](EP-03-pizza-configurator.md) | Pizza configurator (dependency manager) | FD-03 | 13 | 11 | 2 | 0 | 61 | 16 |
| [EP-04](EP-04-cart-coupons.md) | Cart (manifest) and coupons | FD-04 | 13 | 13 | 0 | 0 | 44 | 15 |
| [EP-05](EP-05-checkout.md) | Checkout (deploy config) | FD-05 | 14 | 12 | 1 | 1 | 49 | 18 |
| [EP-06](EP-06-simulated-payment.md) | Simulated payment | FD-06 | 14 | 14 | 0 | 0 | 55 | 19 |
| [EP-07](EP-07-order-tracking.md) | Order tracking (deployment status) | FD-07 | 17 | 16 | 1 | 0 | 61 | 21 |
| [EP-09](EP-09-customer-profile.md) | Order receipt | FD-09 | 2 | 1 | 1 | 0 | 7 | 3 |
| [EP-10](EP-10-kitchen-display.md) | Kitchen run by the simulator | SIM-02 | 1 | 1 | 0 | 0 | 7 | 2 |
| [EP-13](EP-13-courier-management.md) | Automatic courier dispatch | FD-13 | 1 | 1 | 0 | 0 | 7 | 1 |
| [EP-14](EP-14-simulation-control.md) | Simulation and demo reset (fixed configuration) | FD-14 | 5 | 5 | 0 | 0 | 25 | 12 |
| [EP-15](EP-15-errors-messages.md) | Errors and system messages | FD-15 | 8 | 8 | 0 | 0 | 27 | 12 |
| **Total** |  |  | **111** | **103** | **6** | **2** | **462** | **149** |

## 2. Story → screen → functional area → business rules

| Story | Title | Priority | Epic | Screens | Area | Business rules | Processes | Simulations | Verified by |
|---|---|---|---|---|---|---|---|---|---|
| [US-001](EP-01-shell-navigation.md#us-001-customer-header-and-main-navigation) | Customer header and main navigation | Must | EP-01 | SCR-16, SCR-01, SCR-02, SCR-05, SCR-06, SCR-09 | FD-01 | BR-NAV-* | PR-01 | — | TC-001, TC-007 |
| [US-002](EP-01-shell-navigation.md#us-002-project-explorer-sidebar-desktop) | Project Explorer sidebar (desktop) | Must | EP-01 | SCR-16 | FD-01 | BR-NAV-* | PR-01 | — | TC-001, TC-007 |
| [US-003](EP-01-shell-navigation.md#us-003-phone-bottom-tab-bar) | Phone bottom tab bar | Must | EP-01 | SCR-16 | FD-01 | BR-NAV-* | PR-01 | — | TC-002 |
| [US-004](EP-01-shell-navigation.md#us-004-demo-mode-banner) | DEMO MODE banner | Must | EP-01 | SCR-16, SCR-40, SCR-41 | FD-01 | BR-NAV-* | — | — | TC-004 |
| [US-006](EP-01-shell-navigation.md#us-006-official-brand-and-logo-only) | Official brand and logo only | Must | EP-01 | SCR-16, SCR-01, SCR-08, SCR-40, SCR-41 | FD-01 | BR-NAV-* | — | — | TC-006 |
| [US-007](EP-01-shell-navigation.md#us-007-storefront-footer) | Storefront footer | Must | EP-01 | SCR-16 | FD-01 | BR-NAV-* | — | — | TC-001, TC-007 |
| [US-010](EP-01-shell-navigation.md#us-010-toast-notifications) | Toast notifications | Must | EP-01 | SCR-16 | FD-01 | BR-NAV-*, BR-ERR-* | — | — | TC-285 |
| [US-011](EP-01-shell-navigation.md#us-011-responsive-layout-switch) | Responsive layout switch | Must | EP-01 | all screens | FD-01 | BR-NAV-* | — | — | TC-002, TC-003, TC-009 |
| [US-012](EP-01-shell-navigation.md#us-012-dev-labels-with-plain-meaning) | Dev labels with plain meaning | Must | EP-01 | all screens | FD-01 | BR-NAV-* | — | — | TC-001, E2E-01 |
| [US-021](EP-02-menu-browsing.md#us-021-home-hero-and-terminal-intro) | Home hero and terminal intro | Must | EP-02 | SCR-01 | FD-02 | BR-MENU-*, BR-NAV-* | PR-01 | — | TC-021 |
| [US-022](EP-02-menu-browsing.md#us-022-featured-modules-carousel) | Featured modules carousel | Must | EP-02 | SCR-01, SCR-03 | FD-02 | BR-MENU-*, BR-PRICE-01, BR-DATA-12 | PR-01 | — | TC-021 |
| [US-023](EP-02-menu-browsing.md#us-023-live-demo-kpis-on-the-home-page) | Live demo KPIs on the home page | Must | EP-02 | SCR-01 | FD-02 | BR-MENU-*, BR-SIM-16d, LITE-SEC-02 | PR-02 | SIM-05, SIM-02 | TC-021, TC-033, E2E-07 |
| [US-024](EP-02-menu-browsing.md#us-024-live-build-status-of-my-active-order-on-the-home-page) | Live build status of my active order on the home page | Must | EP-02 | SCR-01, SCR-09 | FD-02 | BR-MENU-*, BR-TRK-*, BR-ORD-20 | PR-02 | SIM-07 | TC-028 |
| [US-025](EP-02-menu-browsing.md#us-025-category-tabs-and-product-cards) | Category tabs and product cards | Must | EP-02 | SCR-02 | FD-02 | BR-MENU-*, BR-PRICE-01, BR-PRICE-11, BR-DATA-10 | PR-01 | — | TC-022, TC-023 |
| [US-026](EP-02-menu-browsing.md#us-026-ingredients-shown-as-a-code-block) | Ingredients shown as a code block | Must | EP-02 | SCR-01, SCR-02 | FD-02 | BR-MENU-* | — | — | TC-023 |
| [US-027](EP-02-menu-browsing.md#us-027-menu-search-grep) | Menu search (`grep`) | Must | EP-02 | SCR-02, SCR-16 | FD-02 | BR-MENU-* | PR-01 | — | TC-024 |
| [US-028](EP-02-menu-browsing.md#us-028-quick-add--import) | Quick add (`+ import`) | Must | EP-02 | SCR-01, SCR-02, SCR-05 | FD-02 | BR-MENU-*, BR-CART-*, BR-PRICE-02, BR-DATA-12 | PR-01 | — | TC-023 |
| [US-029](EP-02-menu-browsing.md#us-029-item-info-for-sides-drinks-and-desserts) | Item info for sides, drinks and desserts | Must | EP-02 | SCR-04, SCR-02 | FD-02 | BR-MENU-*, BR-CART-*, BR-PRICE-04 | PR-01 | — | TC-025 |
| [US-030](EP-02-menu-browsing.md#us-030-allergen-and-nutrition-info-for-pizzas) | Allergen and nutrition info for pizzas | Must | EP-02 | SCR-04, SCR-02, SCR-03 | FD-02 | BR-MENU-*, BR-DATA-10, BR-DATA-11 | PR-01 | — | TC-025 |
| [US-031](EP-02-menu-browsing.md#us-031-sold-out-products) | Sold-out products | Must | EP-02 | SCR-01, SCR-02, SCR-03, SCR-04 | FD-02 | BR-MENU-*, BR-DATA-12 | PR-01 | — | TC-029 |
| [US-032](EP-02-menu-browsing.md#us-032-terminal-debugger-cart-panel-desktop-menu) | Terminal Debugger cart panel (desktop menu) | Must | EP-02 | SCR-02, SCR-05, SCR-06 | FD-02 | BR-MENU-*, BR-CART-*, BR-PRICE-04, BR-PRICE-06 | PR-01 | — | TC-030, E2E-01 |
| [US-033](EP-02-menu-browsing.md#us-033-dietary-quick-filter) | Dietary quick filter | Could | EP-02 | SCR-02 | FD-02 | BR-MENU-*, BR-DATA-10 | — | — | TC-031 |
| [US-034](EP-02-menu-browsing.md#us-034-menu-loading-state) | Menu loading state | Should | EP-02 | SCR-02 | FD-02 | BR-MENU-*, BR-ERR-* | — | — | TC-032, E2E-01 |
| [US-041](EP-03-pizza-configurator.md#us-041-open-the-configurator-with-the-default-configuration) | Open the configurator with the default configuration | Must | EP-03 | SCR-03, SCR-01, SCR-02, SCR-04 | FD-03 | BR-CONF-*, BR-PRICE-01, BR-PRICE-02 | PR-01 | — | TC-041 |
| [US-042](EP-03-pizza-configurator.md#us-042-choose-the-size-scale_factor) | Choose the size (`scale_factor`) | Must | EP-03 | SCR-03 | FD-03 | BR-CONF-*, BR-PRICE-02, BR-PRICE-03 | PR-01 | — | TC-041, TC-044 |
| [US-043](EP-03-pizza-configurator.md#us-043-choose-the-crust-core_kernel) | Choose the crust (`core_kernel`) | Must | EP-03 | SCR-03 | FD-03 | BR-CONF-*, BR-PRICE-02 | PR-01 | — | TC-044 |
| [US-044](EP-03-pizza-configurator.md#us-044-choose-sauce-and-cheese-base_layer-cheese_driver) | Choose sauce and cheese (`base_layer`, `cheese_driver`) | Must | EP-03 | SCR-03 | FD-03 | BR-CONF-*, BR-PRICE-02 | PR-01 | — | TC-041, TC-042 |
| [US-045](EP-03-pizza-configurator.md#us-045-add-extra-toppings-inject-dependencies) | Add extra toppings (inject dependencies) | Must | EP-03 | SCR-03 | FD-03 | BR-CONF-*, BR-PRICE-02, BR-PRICE-03 | PR-01 | — | TC-045 |
| [US-046](EP-03-pizza-configurator.md#us-046-remove-default-ingredients-unlink) | Remove default ingredients (unlink) | Must | EP-03 | SCR-03 | FD-03 | BR-CONF-*, BR-PRICE-02 | PR-01 | — | TC-046 |
| [US-047](EP-03-pizza-configurator.md#us-047-live-allergens-and-diet-flags) | Live allergens and diet flags | Must | EP-03 | SCR-03 | FD-03 | BR-CONF-*, BR-DATA-10, BR-DATA-11 | PR-01 | — | TC-043 |
| [US-048](EP-03-pizza-configurator.md#us-048-live-manifestjson-preview) | Live `manifest.json` preview | Must | EP-03 | SCR-03 | FD-03 | BR-CONF-*, BR-PRICE-02, BR-DATA-10, BR-DATA-11 | PR-01 | — | TC-042 |
| [US-049](EP-03-pizza-configurator.md#us-049-set-quantity-and-add-to-cart-build--deploy) | Set quantity and add to cart (`Build & Deploy`) | Must | EP-03 | SCR-03, SCR-05 | FD-03 | BR-CONF-*, BR-CART-*, BR-PRICE-04 | PR-01 | — | TC-061, E2E-01 |
| [US-050](EP-03-pizza-configurator.md#us-050-edit-a-cart-line-in-the-configurator) | Edit a cart line in the configurator | Must | EP-03 | SCR-05, SCR-03 | FD-03 | BR-CONF-*, BR-CART-*, BR-PRICE-02 | PR-01 | — | TC-048 |
| [US-051](EP-03-pizza-configurator.md#us-051-unavailable-options-and-ingredients) | Unavailable options and ingredients | Must | EP-03 | SCR-03 | FD-03 | BR-CONF-*, BR-DATA-12 | PR-01 | — | TC-049, E2E-01 |
| [US-052](EP-03-pizza-configurator.md#us-052-price-breakdown) | Price breakdown | Should | EP-03 | SCR-03 | FD-03 | BR-CONF-*, BR-PRICE-02, BR-PRICE-03, BR-PRICE-11 | — | — | TC-042 |
| [US-053](EP-03-pizza-configurator.md#us-053-phone-layout-with-sticky-price-bar) | Phone layout with sticky price bar | Should | EP-03 | SCR-03 | FD-03 | BR-CONF-* | — | — | E2E-06 |
| [US-061](EP-04-cart-coupons.md#us-061-review-the-cart-manifestlock) | Review the cart (`MANIFEST.LOCK`) | Must | EP-04 | SCR-05, SCR-16 | FD-04 | BR-CART-*, BR-PRICE-04, BR-PRICE-11 | PR-01 | — | TC-061, TC-062 |
| [US-062](EP-04-cart-coupons.md#us-062-empty-cart-state) | Empty cart state | Must | EP-04 | SCR-05 | FD-04 | BR-CART-* | PR-01 | — | TC-066 |
| [US-063](EP-04-cart-coupons.md#us-063-change-the-quantity-of-a-line) | Change the quantity of a line | Must | EP-04 | SCR-05 | FD-04 | BR-CART-*, BR-PRICE-04 | PR-01 | — | TC-062, TC-068 |
| [US-064](EP-04-cart-coupons.md#us-064-remove-a-line-rm) | Remove a line (`rm`) | Must | EP-04 | SCR-05 | FD-04 | BR-CART-*, BR-PRICE-04 | PR-01 | — | TC-062 |
| [US-065](EP-04-cart-coupons.md#us-065-clear-the-cart-rm--rf) | Clear the cart (`rm -rf`) | Must | EP-04 | SCR-05 | FD-04 | BR-CART-* | PR-01 | — | TC-062 |
| [US-066](EP-04-cart-coupons.md#us-066-apply-a-coupon) | Apply a coupon | Must | EP-04 | SCR-05, SCR-06 | FD-04 | BR-CART-*, BR-PRICE-05, BR-PRICE-06, BR-PRICE-11 | PR-01 | — | TC-063 |
| [US-067](EP-04-cart-coupons.md#us-067-coupon-validation-messages) | Coupon validation messages | Must | EP-04 | SCR-05, SCR-06 | FD-04 | BR-CART-*, BR-PRICE-06 | PR-01 | — | TC-064 |
| [US-068](EP-04-cart-coupons.md#us-068-remove-or-replace-the-coupon) | Remove or replace the coupon | Must | EP-04 | SCR-05, SCR-06 | FD-04 | BR-CART-*, BR-PRICE-06 | PR-01 | — | TC-063 |
| [US-069](EP-04-cart-coupons.md#us-069-totals-in-the-cart) | Totals in the cart | Must | EP-04 | SCR-05 | FD-04 | BR-CART-*, BR-PRICE-04, BR-PRICE-05, BR-PRICE-08, BR-PRICE-11 | PR-01 | — | TC-063, E2E-01 |
| [US-070](EP-04-cart-coupons.md#us-070-delivery-minimum-and-free-delivery-hints) | Delivery minimum and free-delivery hints | Must | EP-04 | SCR-05 | FD-04 | BR-CART-*, BR-PRICE-07, BR-PRICE-13 | PR-01 | — | TC-084, TC-090, E2E-01 |
| [US-071](EP-04-cart-coupons.md#us-071-unavailable-lines-in-the-cart) | Unavailable lines in the cart | Must | EP-04 | SCR-05, SCR-06 | FD-04 | BR-CART-*, BR-DATA-12, BR-ORD-03 | PR-01 | — | — |
| [US-072](EP-04-cart-coupons.md#us-072-cart-persistence-in-the-guest-session) | Cart persistence in the guest session | Must | EP-04 | SCR-05 | FD-04 | BR-CART-*, LITE-SES-02 | PR-01 | — | TC-067 |
| [US-073](EP-04-cart-coupons.md#us-073-proceed-to-checkout) | Proceed to checkout | Must | EP-04 | SCR-05, SCR-06 | FD-04 | BR-CART-*, BR-ORD-03 | PR-01 | — | TC-007, E2E-01 |
| [US-081](EP-05-checkout.md#us-081-choose-delivery-or-pickup) | Choose delivery or pickup | Must | EP-05 | SCR-06 | FD-05 | BR-CHK-*, BR-PRICE-07, BR-PRICE-09 | PR-01, PR-06 | — | TC-081, TC-082 |
| [US-082](EP-05-checkout.md#us-082-enter-a-delivery-address-env-variables) | Enter a delivery address (`.env` variables) | Must | EP-05 | SCR-06 | FD-05 | BR-CHK-*, BR-DATA-06, BR-DATA-07, BR-DATA-08 | PR-01 | — | TC-081, TC-083 |
| [US-083](EP-05-checkout.md#us-083-delivery-zone-check) | Delivery-zone check | Must | EP-05 | SCR-06 | FD-05 | BR-CHK-*, BR-ORD-03 | PR-01 | — | TC-083 |
| [US-085](EP-05-checkout.md#us-085-contact-details) | Contact details | Must | EP-05 | SCR-06 | FD-05 | BR-CHK-*, BR-DATA-06, BR-DATA-08, BR-ORD-03 | PR-01 | — | TC-085 |
| [US-086](EP-05-checkout.md#us-086-courier-tip) | Courier tip | Must | EP-05 | SCR-06 | FD-05 | BR-CHK-*, BR-PRICE-09, BR-PRICE-10 | PR-01 | — | TC-081 |
| [US-087](EP-05-checkout.md#us-087-order-summary-and-total) | Order summary and total | Must | EP-05 | SCR-06 | FD-05 | BR-CHK-*, BR-PRICE-04, BR-PRICE-05, BR-PRICE-07, BR-PRICE-08, BR-PRICE-09, BR-PRICE-10, BR-PRICE-11, BR-DATA-01 | PR-01 | — | TC-081 |
| [US-088](EP-05-checkout.md#us-088-delivery-fee) | Delivery fee | Must | EP-05 | SCR-06 | FD-05 | BR-CHK-*, BR-PRICE-07 | PR-01 | — | TC-081, TC-090 |
| [US-089](EP-05-checkout.md#us-089-minimum-delivery-order) | Minimum delivery order | Must | EP-05 | SCR-06 | FD-05 | BR-CHK-*, BR-PRICE-13, BR-ORD-03 | PR-01 | — | TC-084 |
| [US-091](EP-05-checkout.md#us-091-place-the-order-execute-order---force) | Place the order (`Execute Order --force`) | Must | EP-05 | SCR-06, SCR-07 | FD-05 | BR-CHK-*, BR-ORD-01, BR-ORD-02, BR-ORD-03, BR-PRICE-12, BR-DATA-03 | PR-01, PR-02, PR-03 | SIM-01, SIM-07 | TC-101, E2E-01 |
| [US-092](EP-05-checkout.md#us-092-empty-cart-redirect) | Empty-cart redirect | Must | EP-05 | SCR-06, SCR-02 | FD-05 | BR-CHK-* | PR-01 | — | TC-089 |
| [US-093](EP-05-checkout.md#us-093-pickup-details) | Pickup details | Should | EP-05 | SCR-06 | FD-05 | BR-CHK-* | PR-06 | SIM-09 | TC-082 |
| [US-094](EP-05-checkout.md#us-094-coupon-re-check-for-the-order-type) | Coupon re-check for the order type | Must | EP-05 | SCR-06 | FD-05 | BR-CHK-*, BR-PRICE-06 | PR-01 | — | TC-065 |
| [US-095](EP-05-checkout.md#us-095-item-became-unavailable-during-checkout) | Item became unavailable during checkout | Must | EP-05 | SCR-06, SCR-05 | FD-05 | BR-CHK-*, BR-ORD-03, BR-DATA-12 | PR-01 | — | — |
| [US-097](EP-05-checkout.md#us-097-delivery-preview-map) | Delivery preview map | Could | EP-05 | SCR-06 | FD-05 | BR-CHK-* | PR-05 | SIM-04 | TC-092 |
| [US-101](EP-06-simulated-payment.md#us-101-choose-a-payment-method-and-demo-test-card) | Choose a payment method and demo test card | Must | EP-06 | SCR-06, SCR-07 | FD-06 | BR-PAY-*, BR-ORD-03, BR-ORD-04 | PR-03 | SIM-01 | TC-101, TC-102 |
| [US-102](EP-06-simulated-payment.md#us-102-payment-processing-sheet) | Payment processing sheet | Must | EP-06 | SCR-07, SCR-09 | FD-06 | BR-PAY-*, BR-ORD-04 | PR-03 | SIM-01, SIM-07, SIM-09 | TC-101 |
| [US-103](EP-06-simulated-payment.md#us-103-successful-payment) | Successful payment | Must | EP-06 | SCR-07, SCR-08, SCR-05 | FD-06 | BR-PAY-*, BR-ORD-02, BR-ORD-07 | PR-02, PR-03 | SIM-01, SIM-07 | TC-101, TC-102, TC-195 |
| [US-104](EP-06-simulated-payment.md#us-104-declined-card-or-insufficient-funds) | Declined card or insufficient funds | Must | EP-06 | SCR-07 | FD-06 | BR-PAY-*, BR-ORD-04, BR-ORD-07 | PR-03 | SIM-01, SIM-07 | TC-103, TC-104 |
| [US-105](EP-06-simulated-payment.md#us-105-gateway-timeout) | Gateway timeout | Must | EP-06 | SCR-07 | FD-06 | BR-PAY-*, BR-ORD-04 | PR-03 | SIM-01, SIM-09 | TC-104 |
| [US-106](EP-06-simulated-payment.md#us-106-retry-payment-with-another-method) | Retry payment with another method | Must | EP-06 | SCR-07, SCR-08 | FD-06 | BR-PAY-*, BR-ORD-05, BR-PRICE-12 | PR-03 | SIM-01, SIM-07 | TC-103 |
| [US-107](EP-06-simulated-payment.md#us-107-third-failure-rolls-the-order-back) | Third failure rolls the order back | Must | EP-06 | SCR-07, SCR-09 | FD-06 | BR-PAY-*, BR-ORD-05, BR-ORD-07 | PR-03, PR-07 | SIM-01, SIM-07 | TC-105 |
| [US-108](EP-06-simulated-payment.md#us-108-cancel-the-order-before-payment) | Cancel the order before payment | Must | EP-06 | SCR-07, SCR-09, SCR-05 | FD-06 | BR-PAY-*, BR-ORD-07, BR-ORD-08 | PR-03, PR-07 | SIM-07 | TC-106 |
| [US-109](EP-06-simulated-payment.md#us-109-abandoned-failed-payment-expires) | Abandoned failed payment expires | Must | EP-06 | SCR-09 | FD-06 | BR-PAY-*, BR-ORD-06, BR-ORD-21 | PR-03, PR-07 | SIM-01, SIM-09 | TC-107 |
| [US-110](EP-06-simulated-payment.md#us-110-order-confirmation-deployment-successful--200-ok) | Order confirmation (`DEPLOYMENT SUCCESSFUL // 200 OK`) | Must | EP-06 | SCR-08, SCR-09 | FD-06 | BR-PAY-*, BR-TRK-*, BR-ORD-11 | PR-01, PR-02 | SIM-07 | TC-101 |
| [US-111](EP-06-simulated-payment.md#us-111-simulated-refund-on-cancellation) | Simulated refund on cancellation | Must | EP-06 | SCR-09, SCR-13 | FD-06 | BR-PAY-*, BR-ORD-10, BR-PRICE-14 | PR-07 | SIM-01 | TC-109 |
| [US-112](EP-06-simulated-payment.md#us-112-random-payment-failure-rate) | Random payment failure rate | Must | EP-06 | SCR-07 | FD-06 | BR-PAY-*, BR-ORD-04, BR-SIM-* | PR-03 | SIM-01 | TC-110 |
| [US-113](EP-06-simulated-payment.md#us-113-retry-or-cancel-from-the-tracking-page) | Retry or cancel from the tracking page | Must | EP-06 | SCR-09, SCR-07 | FD-06 | BR-PAY-*, BR-TRK-*, BR-ORD-05, BR-ORD-08 | PR-03 | SIM-01 | TC-103, TC-106, E2E-02 |
| [US-114](EP-06-simulated-payment.md#us-114-simulated-customers-pay-through-the-same-gateway) | Simulated customers pay through the same gateway | Must | EP-06 | — | FD-06 | BR-PAY-*, BR-ORD-04, LITE-CFG-04, LITE-CFG-06 | PR-03, PR-10 | SIM-01, SIM-05 | TC-275, E2E-07 |
| [US-121](EP-07-order-tracking.md#us-121-open-the-tracking-page) | Open the tracking page | Must | EP-07 | SCR-09, SCR-08, SCR-01, SCR-10 | FD-07 | BR-TRK-*, BR-DATA-05, LITE-SES-03 | PR-02 | — | TC-121, TC-129 |
| [US-122](EP-07-order-tracking.md#us-122-pipeline-stepper) | Pipeline stepper | Must | EP-07 | SCR-09 | FD-07 | BR-TRK-*, BR-ORD-20, BR-SIM-16b | PR-02, PR-05, PR-06 | SIM-02 | TC-121, TC-122, TC-195 |
| [US-123](EP-07-order-tracking.md#us-123-live-order-log-bash--tracklog) | Live order log (`bash — track.log`) | Must | EP-07 | SCR-09 | FD-07 | BR-TRK-*, BR-ORD-02, BR-ORD-20, BR-SIM-16a | PR-02 | SIM-07 | TC-123 |
| [US-124](EP-07-order-tracking.md#us-124-automatic-refresh) | Automatic refresh | Must | EP-07 | SCR-09 | FD-07 | BR-TRK-*, BR-ORD-20 | PR-02 | SIM-02, SIM-04 | TC-124, E2E-01 |
| [US-125](EP-07-order-tracking.md#us-125-eta-countdown) | ETA countdown | Must | EP-07 | SCR-09 | FD-07 | BR-TRK-* | PR-02, PR-05 | SIM-04, SIM-09 | TC-124 |
| [US-126](EP-07-order-tracking.md#us-126-simulated-map-with-the-courier) | Simulated map with the courier | Must | EP-07 | SCR-09 | FD-07 | BR-TRK-*, BR-ORD-20 | PR-05 | SIM-04 | TC-124 |
| [US-127](EP-07-order-tracking.md#us-127-courier-and-oven-information) | Courier and oven information | Must | EP-07 | SCR-09 | FD-07 | BR-TRK-* | PR-04, PR-05 | SIM-04 | TC-124 |
| [US-128](EP-07-order-tracking.md#us-128-order-summary-and-receipt-link) | Order summary and receipt link | Must | EP-07 | SCR-09, SCR-13 | FD-07 | BR-TRK-*, BR-PRICE-11, BR-DATA-03 | PR-02 | — | TC-131, E2E-01 |
| [US-129](EP-07-order-tracking.md#us-129-roll-back-cancel-a-queued-order) | Roll back (cancel) a queued order | Must | EP-07 | SCR-09 | FD-07 | BR-TRK-*, BR-ORD-08, BR-ORD-10 | PR-07 | SIM-01, SIM-07 | TC-125, TC-292 |
| [US-130](EP-07-order-tracking.md#us-130-rollback-rejected-after-baking-starts) | Rollback rejected after baking starts | Must | EP-07 | SCR-09 | FD-07 | BR-TRK-*, BR-ORD-08 | PR-07 | — | TC-126 |
| [US-131](EP-07-order-tracking.md#us-131-cancelled-order-display) | Cancelled order display | Must | EP-07 | SCR-09 | FD-07 | BR-TRK-*, BR-ORD-10, BR-ORD-17 | PR-07 | — | TC-132 |
| [US-132](EP-07-order-tracking.md#us-132-pickup-tracking) | Pickup tracking | Must | EP-07 | SCR-09 | FD-07 | BR-TRK-* | PR-06 | SIM-06 | TC-122 |
| [US-133](EP-07-order-tracking.md#us-133-look-up-an-order-by-number-and-email) | Look up an order by number and email | Must | EP-07 | SCR-10, SCR-09 | FD-07 | BR-TRK-* | PR-02 | — | TC-127, TC-134 |
| [US-134](EP-07-order-tracking.md#us-134-invalid-tracking-link) | Invalid tracking link | Must | EP-07 | SCR-09, SCR-10 | FD-07 | BR-TRK-*, BR-ERR-* | — | SIM-08 | TC-128, TC-134 |
| [US-135](EP-07-order-tracking.md#us-135-tracklog-navigation-target) | `./track.log` navigation target | Must | EP-07 | SCR-16, SCR-09, SCR-10 | FD-07 | BR-TRK-*, BR-NAV-* | PR-02 | — | TC-001, TC-127 |
| [US-136](EP-07-order-tracking.md#us-136-lookup-abuse-protection) | Lookup abuse protection | Should | EP-07 | SCR-10 | FD-07 | BR-TRK-* | — | — | TC-127 |
| [US-137](EP-07-order-tracking.md#us-137-completed-order-view) | Completed order view | Must | EP-07 | SCR-09, SCR-13 | FD-07 | BR-TRK-*, BR-ORD-17 | PR-05, PR-06 | SIM-04, SIM-06 | TC-133, E2E-01 |
| [US-166](EP-09-customer-profile.md#us-166-order-detail-and-receipt-git-show-hash) | Order detail and receipt (`git show <hash>`) | Must | EP-09 | SCR-13 | FD-09 | BR-PRF-09, BR-PRF-11, BR-PRICE-11, BR-DATA-03, BR-ORD-10, LITE-SES-03 | PR-02, PR-07 | — | TC-169 |
| [US-167](EP-09-customer-profile.md#us-167-print-the-receipt) | Print the receipt | Should | EP-09 | SCR-13 | FD-09 | BR-PRF-10 | — | — | TC-170 |
| [US-194](EP-10-kitchen-display.md#us-194-automatic-kitchen-run-by-the-simulator) | Automatic kitchen run by the simulator | Must | EP-10 | SCR-09, SCR-08, SCR-01 | SIM-02 | BR-ORD-11, BR-ORD-21, BR-SIM-16a, BR-SIM-16b, BR-SIM-16c, BR-SIM-16d, LITE-CFG-04, LITE-SEC-02 | PR-04 | SIM-02, SIM-09 | TC-192, TC-273 |
| [US-247](EP-13-courier-management.md#us-247-automatic-dispatch-and-courier-trips) | Automatic dispatch and courier trips | Must | EP-13 | SCR-09 | FD-13 | BR-COUR-10, BR-COUR-11, BR-ORD-15, BR-ORD-16, BR-ORD-21, LITE-CFG-05 | PR-05 | SIM-04, SIM-09 | TC-245, TC-248 |
| [US-265](EP-14-simulation-control.md#us-265-order-traffic-generator) | Order traffic generator | Must | EP-14 | — | FD-14 | BR-SIM-*, BR-ORD-03, LITE-CFG-06, LITE-SEC-05 | PR-10 | SIM-05, SIM-01 | TC-273, TC-275, E2E-07 |
| [US-270](EP-14-simulation-control.md#us-270-reset-the-demo) | Reset the demo | Must | EP-14 | SCR-10, SCR-09 | FD-14 | BR-SIM-*, BR-DATA-09, LITE-CFG-07 | PR-09 | SIM-08 | TC-271, E2E-08 |
| [US-271](EP-14-simulation-control.md#us-271-live-log-lines-for-every-step) | Live log lines for every step | Must | EP-14 | SCR-09 | FD-14 | BR-SIM-*, BR-ORD-02, LITE-CFG-04, LITE-CFG-05, LITE-CFG-08 | PR-02 | SIM-07 | TC-123, TC-274 |
| [US-272](EP-14-simulation-control.md#us-272-simulated-pickup-arrival) | Simulated pickup arrival | Must | EP-14 | SCR-09 | FD-14 | BR-SIM-*, BR-ORD-21, LITE-CFG-04 | PR-06 | SIM-06 | TC-193 |
| [US-273](EP-14-simulation-control.md#us-273-housekeeping-of-old-simulated-orders) | Housekeeping of old simulated orders | Must | EP-14 | — | FD-14 | BR-SIM-*, BR-ORD-22 | PR-09 | SIM-08 | TC-272 |
| [US-281](EP-15-errors-messages.md#us-281-page-not-found-404) | Page not found (404) | Must | EP-15 | SCR-40 | FD-15 | BR-ERR-* | — | — | TC-281 |
| [US-282](EP-15-errors-messages.md#us-282-unexpected-error-500) | Unexpected error (500) | Must | EP-15 | SCR-41 | FD-15 | BR-ERR-* | — | — | TC-283 |
| [US-284](EP-15-errors-messages.md#us-284-field-validation-messages) | Field validation messages | Must | EP-15 | SCR-06 | FD-15 | BR-ERR-*, BR-DATA-07, BR-DATA-08 | — | — | TC-284 |
| [US-285](EP-15-errors-messages.md#us-285-conflicting-change-by-someone-else) | Conflicting change by someone else | Must | EP-15 | SCR-09, SCR-07 | FD-15 | BR-ERR-*, BR-ORD-01 | PR-02 | SIM-02, SIM-01 | TC-292 |
| [US-286](EP-15-errors-messages.md#us-286-session-expiry) | Session expiry | Must | EP-15 | SCR-16, SCR-05 | FD-15 | BR-ERR-*, LITE-SES-04, LITE-SES-05 | — | — | TC-291 |
| [US-287](EP-15-errors-messages.md#us-287-connection-lost-or-refresh-failure) | Connection lost or refresh failure | Must | EP-15 | SCR-09, SCR-02 | FD-15 | BR-ERR-*, BR-ORD-20 | — | — | TC-032, TC-286 |
| [US-288](EP-15-errors-messages.md#us-288-busy-states-and-double-submit-protection) | Busy states and double-submit protection | Must | EP-15 | SCR-06, SCR-07, SCR-09 | FD-15 | BR-ERR-* | PR-01, PR-07 | — | TC-290 |
| [US-289](EP-15-errors-messages.md#us-289-no-technical-details-exposed) | No technical details exposed | Must | EP-15 | SCR-40, SCR-41, SCR-16 | FD-15 | BR-ERR-* | — | — | TC-288, TC-287 |

### 2.1 Test coverage of the stories

- Must stories verified only by an end-to-end scenario: —.
- Stories without a listed test case: US-071 (Must), US-095 (Must).

## 3. Screen coverage (screen → stories)

Every screen of Lite (`ids-and-traceability.md` section 4) is covered by at least one story. "all screens" in section 2 (US-011, US-012) applies to every row below and is not repeated.

| Screen | Name | Stories |
|---|---|---|
| SCR-01 | Home | US-001, US-006, US-021, US-022, US-023, US-024, US-026, US-028, US-031, US-041, US-121, US-194 |
| SCR-02 | Menu | US-001, US-025, US-026, US-027, US-028, US-029, US-030, US-031, US-032, US-033, US-034, US-041, US-092, US-287 |
| SCR-03 | Pizza configurator | US-022, US-030, US-031, US-041, US-042, US-043, US-044, US-045, US-046, US-047, US-048, US-049, US-050, US-051, US-052, US-053 |
| SCR-04 | Item info | US-029, US-030, US-031, US-041 |
| SCR-05 | Cart | US-001, US-028, US-032, US-049, US-050, US-061, US-062, US-063, US-064, US-065, US-066, US-067, US-068, US-069, US-070, US-071, US-072, US-073, US-095, US-103, US-108, US-286 |
| SCR-06 | Checkout | US-001, US-032, US-066, US-067, US-068, US-071, US-073, US-081, US-082, US-083, US-085, US-086, US-087, US-088, US-089, US-091, US-092, US-093, US-094, US-095, US-097, US-101, US-284, US-288 |
| SCR-07 | Payment sheet | US-091, US-101, US-102, US-103, US-104, US-105, US-106, US-107, US-108, US-112, US-113, US-285, US-288 |
| SCR-08 | Order confirmation | US-006, US-103, US-106, US-110, US-121, US-194 |
| SCR-09 | Order tracking | US-001, US-024, US-102, US-107, US-108, US-109, US-110, US-111, US-113, US-121, US-122, US-123, US-124, US-125, US-126, US-127, US-128, US-129, US-130, US-131, US-132, US-133, US-134, US-135, US-137, US-194, US-247, US-270, US-271, US-272, US-285, US-287, US-288 |
| SCR-10 | Track order lookup | US-121, US-133, US-134, US-135, US-136, US-270 |
| SCR-13 | Order detail and receipt | US-111, US-128, US-137, US-166, US-167 |
| SCR-16 | Customer shell | US-001, US-002, US-003, US-004, US-006, US-007, US-010, US-027, US-061, US-135, US-286, US-289 |
| SCR-40 | Not found (404) | US-004, US-006, US-281, US-289 |
| SCR-41 | Unexpected error (500) | US-004, US-006, US-282, US-289 |

## 4. Simulation coverage (simulation → stories)

| Simulation | Name | Stories |
|---|---|---|
| SIM-01 | Payment gateway | US-091, US-101, US-102, US-103, US-104, US-105, US-106, US-107, US-109, US-111, US-112, US-113, US-114, US-129, US-265, US-285 |
| SIM-02 | Kitchen auto-advance | US-023, US-122, US-124, US-194, US-285 |
| SIM-04 | Courier dispatch and route | US-097, US-124, US-125, US-126, US-127, US-137, US-247 |
| SIM-05 | Order traffic generator | US-023, US-114, US-265 |
| SIM-06 | Pickup customer arrival | US-132, US-137, US-272 |
| SIM-07 | Live logs | US-024, US-091, US-102, US-103, US-104, US-106, US-107, US-108, US-110, US-123, US-129, US-271 |
| SIM-08 | Demo seed, reset and housekeeping | US-134, US-270, US-273 |
| SIM-09 | Simulation clock (speed factor) | US-093, US-102, US-105, US-109, US-125, US-194, US-247 |

## 5. Process coverage (process → stories)

| Process | Name | Stories |
|---|---|---|
| PR-01 | Guest ordering journey (browse → configure → cart → checkout → pay → track) | US-001, US-002, US-003, US-021, US-022, US-025, US-027, US-028, US-029, US-030, US-031, US-032, US-041, US-042, US-043, US-044, US-045, US-046, US-047, US-048, US-049, US-050, US-051, US-061, US-062, US-063, US-064, US-065, US-066, US-067, US-068, US-069, US-070, US-071, US-072, US-073, US-081, US-082, US-083, US-085, US-086, US-087, US-088, US-089, US-091, US-092, US-094, US-095, US-110, US-288 |
| PR-02 | Order lifecycle | US-023, US-024, US-091, US-103, US-110, US-121, US-122, US-123, US-124, US-125, US-128, US-133, US-135, US-166, US-271, US-285 |
| PR-03 | Simulated payment and retry | US-091, US-101, US-102, US-103, US-104, US-105, US-106, US-107, US-108, US-109, US-112, US-113, US-114 |
| PR-04 | Kitchen flow | US-127, US-194 |
| PR-05 | Dispatch and delivery | US-097, US-122, US-125, US-126, US-127, US-137, US-247 |
| PR-06 | Pickup | US-081, US-093, US-122, US-132, US-137, US-272 |
| PR-07 | Cancellation and refund | US-107, US-108, US-109, US-111, US-129, US-130, US-131, US-166, US-288 |
| PR-09 | Demo seed, reset and housekeeping | US-270, US-273 |
| PR-10 | Simulated order traffic | US-114, US-265 |

## 6. Foundation rule coverage (rule → stories)

Foundation rules that at least one Lite story cites as a verified rule.

| Rule | Stories |
|---|---|
| BR-PRICE-01 | US-022, US-025, US-041 |
| BR-PRICE-02 | US-028, US-041, US-042, US-043, US-044, US-045, US-046, US-048, US-050, US-052 |
| BR-PRICE-03 | US-042, US-045, US-052 |
| BR-PRICE-04 | US-029, US-032, US-049, US-061, US-063, US-064, US-069, US-087 |
| BR-PRICE-05 | US-066, US-069, US-087 |
| BR-PRICE-06 | US-032, US-066, US-067, US-068, US-094 |
| BR-PRICE-07 | US-070, US-081, US-087, US-088 |
| BR-PRICE-08 | US-069, US-087 |
| BR-PRICE-09 | US-081, US-086, US-087 |
| BR-PRICE-10 | US-086, US-087 |
| BR-PRICE-11 | US-025, US-052, US-061, US-066, US-069, US-087, US-128, US-166 |
| BR-PRICE-12 | US-091, US-106 |
| BR-PRICE-13 | US-070, US-089 |
| BR-PRICE-14 | US-111 |
| BR-ORD-01 | US-091, US-285 |
| BR-ORD-02 | US-091, US-103, US-123, US-271 |
| BR-ORD-03 | US-071, US-073, US-083, US-085, US-089, US-091, US-095, US-101, US-265 |
| BR-ORD-04 | US-101, US-102, US-104, US-105, US-112, US-114 |
| BR-ORD-05 | US-106, US-107, US-113 |
| BR-ORD-06 | US-109 |
| BR-ORD-07 | US-103, US-104, US-107, US-108 |
| BR-ORD-08 | US-108, US-113, US-129, US-130 |
| BR-ORD-10 | US-111, US-129, US-131, US-166 |
| BR-ORD-11 | US-110, US-194 |
| BR-ORD-15 | US-247 |
| BR-ORD-16 | US-247 |
| BR-ORD-17 | US-131, US-137 |
| BR-ORD-20 | US-024, US-122, US-123, US-124, US-126, US-287 |
| BR-ORD-21 | US-109, US-194, US-247, US-272 |
| BR-ORD-22 | US-273 |
| BR-DATA-01 | US-087 |
| BR-DATA-03 | US-091, US-128, US-166 |
| BR-DATA-05 | US-121 |
| BR-DATA-06 | US-082, US-085 |
| BR-DATA-07 | US-082, US-284 |
| BR-DATA-08 | US-082, US-085, US-284 |
| BR-DATA-09 | US-270 |
| BR-DATA-10 | US-025, US-030, US-033, US-047, US-048 |
| BR-DATA-11 | US-030, US-047, US-048 |
| BR-DATA-12 | US-022, US-028, US-031, US-051, US-071, US-095 |

Not cited by a Lite story: BR-PRICE-15, BR-ORD-09, BR-ORD-12, BR-ORD-13, BR-ORD-14, BR-ORD-18, BR-DATA-02, BR-DATA-04, BR-DATA-13, BR-DATA-14.

## 7. Functional-design and Lite rule families (family → stories)

A family counts a story that cites the family (`BR-CART-*`) or one of its rules (`BR-COUR-10`, `BR-SIM-16a`, `LITE-CFG-04`).

| Family | Owning area | Stories |
|---|---|---|
| BR-NAV-* | FD-01 | US-001, US-002, US-003, US-004, US-006, US-007, US-010, US-011, US-012, US-021, US-135 |
| BR-MENU-* | FD-02 | US-021, US-022, US-023, US-024, US-025, US-026, US-027, US-028, US-029, US-030, US-031, US-032, US-033, US-034 |
| BR-CONF-* | FD-03 | US-041, US-042, US-043, US-044, US-045, US-046, US-047, US-048, US-049, US-050, US-051, US-052, US-053 |
| BR-CART-* | FD-04 | US-028, US-029, US-032, US-049, US-050, US-061, US-062, US-063, US-064, US-065, US-066, US-067, US-068, US-069, US-070, US-071, US-072, US-073 |
| BR-CHK-* | FD-05 | US-081, US-082, US-083, US-085, US-086, US-087, US-088, US-089, US-091, US-092, US-093, US-094, US-095, US-097 |
| BR-PAY-* | FD-06 | US-101, US-102, US-103, US-104, US-105, US-106, US-107, US-108, US-109, US-110, US-111, US-112, US-113, US-114 |
| BR-TRK-* | FD-07 | US-024, US-110, US-113, US-121, US-122, US-123, US-124, US-125, US-126, US-127, US-128, US-129, US-130, US-131, US-132, US-133, US-134, US-135, US-136, US-137 |
| BR-PRF-* | FD-09 | US-166, US-167 |
| BR-COUR-* | FD-13 | US-247 |
| BR-SIM-* | FD-14, `10-simulations/` | US-023, US-112, US-122, US-123, US-194, US-265, US-270, US-271, US-272, US-273 |
| BR-ERR-* | FD-15 | US-010, US-034, US-134, US-281, US-282, US-284, US-285, US-286, US-287, US-288, US-289 |
| LITE-CFG-* | [lite-configuration.md](../10-simulations/lite-configuration.md) | US-114, US-194, US-247, US-265, US-270, US-271, US-272 |
| LITE-SES-* | information model section 2 | US-072, US-121, US-166, US-286 |
| LITE-SEC-* | information model section 10 | US-023, US-194, US-265 |
