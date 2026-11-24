# KIXON — Move Bold

A responsive **React + TypeScript** sneaker e-commerce concept for **men and women**, based on the Digital Hub team assignment and the supplied dark/light sneaker design reference. The store is named **KIXON**, using the logo the team provided.

> **Educational frontend demo.** All products, prices, order confirmations, and shipping policies are illustrative. No real payments, orders, customer storage, or deliveries. The demo email `hello@kixon.example` is not a functioning business contact.

## Run locally

Prerequisites: **Node.js 20.19+ or 22.12+**, npm.

```bash
npm install
npm run dev
```

Open the localhost URL shown by Vite (usually `http://localhost:5173`).

```bash
npm run build      # TypeScript check + Vite production build
npm run preview    # Preview the production build
npm run test:run   # Run all automated tests
npm run typecheck  # Check TypeScript
```

## Requirements coverage

| Required item | Implemented in |
| --- | --- |
| Home hero, featured products, men/women categories, header/footer | `src/pages/HomePage.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx` |
| Light/dark modes (saved on refresh) | `src/app/StoreContext.tsx`, `src/styles.css` |
| React Router navigation | `src/app/App.tsx` |
| Product search, gender/category/price filters, price sort, no-results state | `src/pages/ProductsPage.tsx`, `src/lib/catalog.ts` |
| Product cards, cart actions, wishlist toggle | `src/components/ProductCard.tsx` |
| Persistent cart / quantity / remove / clear / totals | `src/app/StoreContext.tsx`, `src/lib/cart.ts`, `src/pages/CartPage.tsx` |
| Persistent wishlist without duplicates | `src/pages/WishlistPage.tsx`, `src/app/StoreContext.tsx` |
| Checkout form with Zod validation and field errors | `src/components/CheckoutForm.tsx`, `src/lib/checkout.ts` |
| Simulated order reference, order summary, clear cart, retain wishlist | `src/pages/CheckoutPage.tsx` |
| Automated tests (filter, cart, invalid checkout) | `src/lib/catalog.test.ts`, `src/lib/cart.test.ts`, `src/components/CheckoutForm.test.tsx` |
| Mobile/tablet/desktop responsive design | `src/styles.css` |

**Cart, wishlist, and theme are stored in browser `localStorage`.** Products are predefined in `src/data/products.ts` as permitted in the project PDF. There is no login, backend, database or payment gateway.

## Team split (as in `Ecommerce_Project_Tasks(2).pdf`, page 3)

**Developer A (your assigned section)**
- Project scaffolding/configuration, routing, data model, shared context and localStorage
- KIXON branding, the exact supplied wordmark image, site-wide styles, responsive navigation + footer
- Landing page including dual-mode hero, featured products, categories and brand story
- This README + coordination for shared interfaces

**Developer B**
- `ProductsPage.tsx`, filtering/sorting helper `src/lib/catalog.ts`, `WishlistPage.tsx`
- Product listing and wishlist UX, test product filtering

**Developer C**
- `CartPage.tsx`, `CheckoutPage.tsx`, `CheckoutForm.tsx`, `src/lib/checkout.ts`
- Cart/checkout logic, order confirmation, cart and checkout tests

The demo includes working implementations of **all** sections so that the application is navigable. They are separated by ownership so B/C can modify their modules on their own Git branches. Do not claim teammates authored code they did not create; use this starter code as shared groundwork and divide ownership transparently.

## GitHub collaboration (required by the PDF)

One teammate creates a repository and a `dev` branch. Each developer creates their own feature branch **from `dev`**, commits their work, opens a PR **to `dev`**, reviews another teammate's PR, resolves conflicts, and merges `dev` to `main` only after testing. Do not push feature work directly to `main`.

Example:

```bash
git init
git add .
git commit -m "chore: scaffold KIXON React TypeScript store"
git branch -M main
git branch dev
git checkout dev
git checkout -b feature/section-a-home
# After remote is created and linked: push your branch and open a PR targeting dev.
```

## Product art / design disclaimer

- `public/assets/kixon-logo.png` was extracted from the supplied KIXON wordmark reference.
- Sneaker art is derived from the earlier custom-made KIXON concept/mockup in this conversation. Different colorways use **CSS filter variations of two concept illustrations**. These are visual placeholders, not accurate photographs of eight distinct manufactured products. Replace with verified, licensed product photographs before any real storefront deployment.
- All sample item names, prices and claims are fictional. Sales statistics from the reference image were intentionally **not** portrayed as real business metrics.
- Google Fonts use an online font CDN; the site falls back to system fonts when offline. Product images themselves are bundled locally.

## Integration notes

- `Product` type in `src/data/products.ts` and `StoreContextType` in `src/app/StoreContext.tsx` are the interfaces shared across the team.
- **No need to recreate the global state or duplicate `localStorage` keys** in teammate modules.
- Keep all page routes registered in `src/app/App.tsx`.
- Tests are included but must be executed on a machine with `npm install` completed before the team claims they pass.
