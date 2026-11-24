# Section A — preserved duplicate pages (not routed)

Section A shipped its own versions of pages that other developers own.
They are kept here unchanged (only import paths were adjusted) so no work is lost:

| File | Live owner / route |
| --- | --- |
| `ProductsPage.tsx` | Developer B — `src/pages/ProductsPage.tsx` (`/products`) |
| `CartPage.tsx` | Developer C — `src/features/cart/CartPage.tsx` (`/cart`) |
| `CheckoutPage.tsx` | Developer C — `src/features/cart/CheckoutPage.tsx` (`/checkout`, `/order-confirmation`) |

They still compile against the shared store (`src/app/StoreContext.tsx`), so they can be
re-enabled or mined for ideas, but no route points at them.
