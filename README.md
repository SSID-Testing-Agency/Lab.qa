# Lab.QA Training Shop

> A fictional e-commerce playground built **for QA practice and test automation training**.
> Add products to a cart, create fake accounts, place fake orders. Nothing here is real.

[![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-blue)](https://lordrequiem.github.io/ecom-fake-website/)
[![License](https://img.shields.io/badge/license-Apache%202.0-green)](./LICENSE)

**Live demo:** https://lordrequiem.github.io/ecom-fake-website/

---

## ⚠️ Disclaimer

This application is a **training target**. It is intentionally simple and runs entirely
in the browser (static site, no backend). All accounts, products, prices and orders are
**fictional**. Do **not** enter real personal data, real payment information, or use this
for any real transaction. No data is persisted server-side.

---

## What this is (and is not)

| It IS | It is NOT |
|-------|-----------|
| A stable, deterministic target for E2E / functional test automation | A production e-commerce app |
| A teaching aid for Playwright / Selenium / API testing / accessibility | A secure or scalable system |
| A demo of clean test hooks and selector conventions | A place for real data or real money |

Intended audience: QA engineers, automation trainees, and the QA community.

---

## Features

- Product catalog with fake products
- Shopping cart (add / remove / update quantity)
- Fake account creation and login
- Fake checkout and order creation
- One-click state reset (see below)
- Stable, documented test selectors

---

## Tech stack

- React 19 + Vite 6 + TypeScript 5
- Tailwind CSS 4 (dark/light theme, CSS tokens)
- State persistence: localStorage (via Zustand 5)
- Hosting: GitHub Pages (static)
- CI: GitHub Actions (build + deploy)

---

## Quick start (local)

```bash
# 1. Clone
git clone https://github.com/lordrequiem/ecom-fake-website
cd ecom-fake-website

# 2. Install
npm install
npx playwright install   # once, for browser binaries

# 3. Run locally
npm run dev
# App available at http://localhost:5173/ecom-fake-website/
```

---

## Build & deploy

```bash
# Build the static site
npm run build

# Deploy to GitHub Pages
# (handled automatically by the GitHub Action on push to main)
```

Deployment is triggered by push to `main`.
See `.github/workflows/deploy.yml` for the pipeline.

---

## Resetting the test data / state

Because the app keeps state in localStorage, you can return to a clean slate at any time:

- **Manually:** clear site data in your browser's DevTools (Application → Storage → Clear site data).
- **Seeded data:** the initial catalog and accounts are defined in `src/data/products.ts` and `src/data/users.ts`.

A fresh, identical state on every run is a deliberate design goal so that automated
tests stay deterministic.

---

## Test hooks & selector conventions (read this if you automate against it)

This is the part that makes the app a *good* automation target. Conventions:

- Every interactive element exposes a stable `data-testid`. Example:
  `data-testid="add-to-cart-book-clean-code"`.
- Selectors are **never** based on auto-generated CSS classes or DOM position.
- Semantic HTML and ARIA roles are used throughout, so role-based locators
  (`getByRole`) work out of the box.
- Test IDs follow the convention: `data-testid="[component]-[element]-[identifier]"`.

---

## Intentional bugs / quirks

Some behaviors are **intentionally** broken or unusual, to give trainees something to
catch. They are documented here so maintainers do not "fix" them by accident:

| ID | Effect | Triggered by |
|----|--------|--------------|
| `broken-images` | Product photos replaced by a broken image | `?bugs=true` or `client_chaos` login |
| `reversed-sort` | Sort result is inverted | `?bugs=true` or `client_chaos` login |
| `disappearing-button` | "Add to cart" button disappears after first click | `?bugs=true` or `client_chaos` login |
| `invalid-form-accepted` | Checkout form accepts empty fields | `?bugs=true` only |
| `price-off-by-one` | Cart total displays −0.01 € | `?bugs=true` only |

Activate bug mode by appending `?bugs=true` to any authenticated page URL,
or by logging in as `client_chaos`. A yellow banner (`data-testid="bug-mode-banner"`)
appears when bugs are active.

If a quirk is *not* in this list, treat it as a real bug and open an issue.

---

## Running the tests

```bash
# End-to-end tests (Playwright)
npm test                    # all browsers, headless
npm run test:headed         # with visible browser
npm run test:ui             # Playwright interactive UI
npm run test:report         # open HTML report

# Test against the deployed version
BASE_URL=https://lordrequiem.github.io/ecom-fake-website/ npm test
```

---

## Project structure

```
.
├── src/
│   ├── api/
│   ├── components/
│   ├── data/            # seed data (products.ts, users.ts)
│   ├── hooks/
│   ├── pages/
│   ├── router/
│   ├── store/
│   ├── styles/
│   ├── types/
│   └── utils/
├── playwright/
│   ├── fixtures/
│   ├── pages/           # Page Object Models
│   └── specs/
├── .github/workflows/
│   └── deploy.yml
└── README.md
```

---

## Contributing

Issues and PRs are welcome.
By contributing you agree your contribution is licensed under the project license.

---

## License & trademark

- **Code** is licensed under the Apache License 2.0. See [`LICENSE`](./LICENSE).
- **SSID, QG Qualité and Lab.QA names and logos are trademarks of SSID.** They are not covered by the code license and may not be reused without SSID's     permission. See [`NOTICE`](./NOTICE)

---

## Maintainers

- lordrequiem

## Decisions

Architecture and design decisions are recorded in [`docs/decisions/`](./docs/decisions/).
