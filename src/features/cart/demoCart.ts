import type { CartState } from "./types";

/**
 * Three-product state used ONLY for isolated visual testing (open the app with
 * `?demo=cart`). It is never written to localStorage and never replaces a
 * shopper's real cart.
 */
export const demoCartState: CartState = {
  items: [
    { productId: 1, quantity: 1, size: 42, color: "Red", selected: true },
    { productId: 2, quantity: 2, size: 41, color: "White", selected: true },
    { productId: 3, quantity: 1, size: 43, color: "Black", selected: true },
  ],
};

export function isDemoCartRequested(search: string): boolean {
  return new URLSearchParams(search).get("demo") === "cart";
}
