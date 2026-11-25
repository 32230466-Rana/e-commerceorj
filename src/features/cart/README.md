# Cart feature (Developer C)

```
cart/
├── pages/        Route pages: CartPage (/cart), CheckoutPage (/checkout), OrderConfirmationPage (/order-confirmation)
├── components/   UI pieces used by the pages: CartItemCard, CartSummary, SneakerShowcase, AddToCartButton, SiteChrome, Icons
├── store/        Redux: cartSlice, orderSlice, cartSelectors, cartStore (the app's single store), cartStorage (localStorage)
├── schemas/      Zod schemas: cartSchema (saved cart, limits), checkoutSchema (checkout form)
├── data/         Demo data: demoSneakers, demoCart
├── utils/        pricing (shipping rule, rounding, money format)
├── styles/       CartPage.css (shared by the three pages)
├── types.ts      Cart and order types
└── __tests__/    Vitest unit tests
```
