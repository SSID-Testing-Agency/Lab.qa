# Test ID map

Convention: `data-testid="[zone]-[element]-[identifiant]"`

Dynamic IDs use a product slug (e.g. `sauce-backpack`, `book-playwright`) or an order /
size identifier as the trailing segment. Static IDs have no suffix.

---

## Global

| `data-testid` | Element | Notes |
|---|---|---|
| `navbar` | Top navigation bar | |
| `company-logo` | ShopLab.qa logo | |
| `theme-toggle` | Dark / light mode button | |
| `cart-icon` | Cart icon in header | |
| `cart-count` | Badge showing number of items | |
| `wishlist-icon` | Wishlist icon in header | |
| `wishlist-count` | Badge showing number of wishlist items | |
| `search-input` | Search field | |
| `search-button` | Search submit button | |
| `breadcrumb` | Breadcrumb trail | |
| `sidebar` | Left / mobile navigation panel | |
| `sidebar-mobile` | Mobile sidebar toggle | |

---

## Sidebar

| `data-testid` | Element |
|---|---|
| `sidebar-all-products` | "All products" link |
| `sidebar-category-{slug}` | Category filter link (e.g. `sidebar-category-books`) |
| `sidebar-account` | Account link |
| `sidebar-wishlist` | Wishlist link |
| `sidebar-qa-lab` | QA Lab / training link |
| `sidebar-about` | About link |
| `sidebar-logout` | Logout button |
| `sidebar-reset-session` | Reset session button |

---

## Landing page

| `data-testid` | Element |
|---|---|
| `landing-start` | "Start shopping" CTA |
| `landing-formations` | Formations / training section |
| `formations-card` | Individual training card |
| `ssid-card` | SSID partner card |
| `podcast-link` | Podcast link |

---

## Login

| `data-testid` | Element |
|---|---|
| `login-username` | Username input |
| `login-password` | Password input |
| `login-submit` | Submit button |
| `login-quick` | Quick login — Jean Dupont (bypass, do not use in exercises) |
| `login-error` | Error message |

---

## Catalog

| `data-testid` | Element |
|---|---|
| `product-grid` | Product card grid |
| `product-grid-skeleton` | Loading skeleton |
| `sort-select` | Sort dropdown |
| `filter-in-stock` | "In stock only" filter checkbox |
| `filter-price-{value}` | Price range filter (e.g. `filter-price-0-25`) |
| `filter-reset` | Reset all filters button |
| `reset-filters-empty` | Reset button shown in empty state |
| `reset-search` | Clear search button |
| `empty-state` | Empty results message |
| `pagination` | Pagination container |
| `pagination-prev` | Previous page button |
| `pagination-next` | Next page button |

### Product card (dynamic — per product)

| `data-testid` | Element |
|---|---|
| `product-card-{id}` | Card root (e.g. `product-card-sauce-backpack`) |
| `product-image-{id}` | Product image |
| `product-name-{id}` | Product name |
| `product-price-{id}` | Product price |
| `discount-badge-{id}` | Discount badge |
| `new-badge-{id}` | "New" badge |
| `low-stock-badge-{id}` | Low stock warning |
| `add-to-cart-{id}` | "Add to cart" button |
| `qty-decrease-{id}` | Decrease quantity button (catalog) |
| `qty-increase-{id}` | Increase quantity button (catalog) |
| `qty-value-{id}` | Current quantity display (catalog) |
| `size-btn-{id}-{size}` | Size selector on card (e.g. `size-btn-sauce-bolt-shirt-M`) |
| `wishlist-btn-{id}` | Toggle wishlist button |

---

## Product detail

| `data-testid` | Element |
|---|---|
| `product-detail-name` | Product name |
| `product-detail-image` | Product image |
| `product-detail-price` | Product price |
| `product-detail-description` | Product description |
| `product-detail-stock` | Stock count |
| `product-detail-low-stock` | Low stock warning |
| `product-detail-out-of-stock` | Out of stock message |
| `product-detail-discount-badge` | Discount badge |
| `product-detail-qty-decrease` | Decrease quantity |
| `product-detail-qty-increase` | Increase quantity |
| `product-detail-qty-value` | Current quantity |
| `product-detail-add-to-cart` | "Add to cart" button |
| `product-detail-back` | Back to catalog link |
| `size-btn-{size}` | Size selector on detail page (e.g. `size-btn-L`) |
| `related-products` | Related products section |
| `recently-viewed` | Recently viewed section |
| `wishlist-btn-detail` | Toggle wishlist button on detail page |

---

## Cart

| `data-testid` | Element |
|---|---|
| `cart-container` | Cart page root |
| `cart-empty` | Empty cart message |
| `cart-item-{id}-{size}` | Line item row (size may be empty for non-sized products) |
| `cart-quantity-{id}` | Quantity display for a line item |
| `cart-increase-{id}` | Increase quantity button |
| `cart-decrease-{id}` | Decrease quantity button |
| `cart-max-{id}` | Max quantity reached message |
| `cart-remove-{id}` | Remove item button |
| `cart-undo-banner` | Undo removal banner |
| `cart-undo-btn` | Undo button in banner |
| `cart-promo-input` | Promo code input |
| `cart-promo-apply` | Apply promo code button |
| `cart-promo-error` | Promo code error message |
| `cart-remove-promo` | Remove applied promo code |
| `cart-subtotal` | Subtotal line |
| `cart-discount` | Discount line |
| `cart-shipping` | Shipping line |
| `cart-tax` | Tax line |
| `cart-total` | Order total |
| `cart-clear` | Clear cart button |
| `cart-continue-shopping` | Continue shopping link |
| `cart-checkout-button` | Proceed to checkout button |

---

## Checkout

### Step indicator

| `data-testid` | Element |
|---|---|
| `step-{id}` | Individual step indicator (e.g. `step-shipping`) |

### Shipping form

| `data-testid` | Element |
|---|---|
| `checkout-first-name` | First name input |
| `checkout-last-name` | Last name input |
| `checkout-email` | Email input |
| `checkout-postal-code` | Postal code input |
| `delivery-{value}` | Delivery option (e.g. `delivery-standard`, `delivery-express`) |
| `checkout-continue` | Continue button |
| `checkout-cancel` | Cancel / back button |

### Order review

| `data-testid` | Element |
|---|---|
| `checkout-review` | Review step container |
| `review-item-{productId}` | Line item in review |
| `review-subtotal` | Subtotal |
| `review-delivery` | Delivery cost |
| `review-tax` | Tax |
| `review-total` | Total |
| `checkout-review-back` | Back to shipping button |
| `checkout-finish` | Place order button |

---

## Payment

| `data-testid` | Element |
|---|---|
| `payment-name` | Cardholder name input |
| `payment-card-number` | Card number input |
| `payment-expiry` | Expiry date input |
| `payment-cvc` | CVC input |
| `payment-submit` | Pay button |
| `payment-back` | Back button |
| `payment-back-cart` | Back to cart button |
| `payment-error-declined` | Card declined error |
| `payment-error-server` | Server error message |

---

## Order confirmation

| `data-testid` | Element |
|---|---|
| `confirmation-container` | Confirmation page root |
| `confirmation-title` | Success title |
| `confirmation-home` | Back to home / catalog link |

---

## Orders history

| `data-testid` | Element |
|---|---|
| `orders-table` | Orders table |
| `order-row-{orderId}` | Individual order row |

---

## Wishlist

| `data-testid` | Element |
|---|---|
| `wishlist-list` | Wishlist page container |
| `wishlist-empty` | Empty wishlist message |
| `wishlist-item-{id}` | Wishlist item row |
| `wishlist-add-to-cart-{id}` | Add to cart from wishlist |
| `wishlist-remove-{id}` | Remove from wishlist |
| `wishlist-clear` | Clear entire wishlist |

---

## Account — Profile

| `data-testid` | Element |
|---|---|
| `profile-first-name` | First name input |
| `profile-last-name` | Last name input |
| `profile-email` | Email input |
| `profile-submit` | Save button |
| `profile-success` | Success confirmation message |
| `logout-button` | Logout button |

## Account — Address

| `data-testid` | Element |
|---|---|
| `address-card` | Saved address display |
| `address-edit-button` | Edit address button |
| `address-form` | Address edit form |
| `address-street` | Street input |
| `address-city` | City input |
| `address-postal` | Postal code input |
| `address-country` | Country input |
| `address-save` | Save address button |
| `address-cancel` | Cancel edit button |
| `address-success` | Save confirmation message |

## Account — Password

| `data-testid` | Element |
|---|---|
| `password-current` | Current password input |
| `password-new` | New password input |
| `password-confirm` | Confirm new password input |
| `password-submit` | Change password button |
| `password-success` | Success confirmation message |

---

## Newsletter

| `data-testid` | Element |
|---|---|
| `newsletter-form` | Newsletter signup form |
| `newsletter-email` | Email input |
| `newsletter-submit` | Subscribe button |
| `newsletter-success` | Confirmation message |
| `newsletter-error` | Error message |

---

## Bug mode

| `data-testid` | Element | Notes |
|---|---|---|
| `bug-mode-banner` | Yellow banner shown when bugs are active | Present when `?bugs=true` or logged in as `client_chaos` |
| `bug-caught-count` | Number of bugs caught by the trainee | |
| `walking-bug` | Animated bug Easter egg | |
