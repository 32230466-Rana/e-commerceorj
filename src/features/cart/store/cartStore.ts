import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import wishlistReducer, { type WishlistState } from "../../wishlist/wishlistSlice";
import { loadWishlist, saveWishlist } from "../../wishlist/wishlistStorage";
import { loadCart, loadLastOrder, saveCart, saveLastOrder } from "./cartStorage";
import { demoCartState, isDemoCartRequested } from "../data/demoCart";
import type { CartState } from "../types";

const rootReducer = combineReducers({
  cart: cartReducer,
  order: orderReducer,
  wishlist: wishlistReducer,
});

export type CartRootState = ReturnType<typeof rootReducer>;

export function createCartStore(
  options: { preloadedCart?: CartState; preloadedWishlist?: WishlistState; persist?: boolean } = {}
) {
  const { preloadedCart = { items: [] }, preloadedWishlist = { ids: [] }, persist = false } = options;

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      cart: preloadedCart,
      order: { lastOrder: persist ? loadLastOrder() : null },
      wishlist: preloadedWishlist,
    },
  });

  if (persist) {
    let previous = store.getState();
    store.subscribe(() => {
      const current = store.getState();
      if (current.cart !== previous.cart) saveCart(current.cart);
      if (current.order.lastOrder !== previous.order.lastOrder) saveLastOrder(current.order.lastOrder);
      if (current.wishlist !== previous.wishlist) saveWishlist(current.wishlist);
      previous = current;
    });
  }

  return store;
}

const demoMode = typeof window !== "undefined" && isDemoCartRequested(window.location.search);

/** App store. `?demo=cart` loads the visual-test cart without touching saved data. */
export const cartStore = demoMode
  ? createCartStore({ preloadedCart: demoCartState, persist: false })
  : createCartStore({ preloadedCart: loadCart(), preloadedWishlist: loadWishlist(), persist: true });

export const isDemoCart = demoMode;

export type CartStore = ReturnType<typeof createCartStore>;
export type CartDispatch = CartStore["dispatch"];
