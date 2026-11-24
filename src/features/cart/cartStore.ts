import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import { loadCart, loadLastOrder, saveCart, saveLastOrder } from "./cartStorage";
import { demoCartState, isDemoCartRequested } from "./demoCart";
import type { CartState } from "./types";

const rootReducer = combineReducers({
  cart: cartReducer,
  order: orderReducer,
});

export type CartRootState = ReturnType<typeof rootReducer>;

export function createCartStore(options: { preloadedCart?: CartState; persist?: boolean } = {}) {
  const { preloadedCart = { items: [] }, persist = false } = options;

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      cart: preloadedCart,
      order: { lastOrder: persist ? loadLastOrder() : null },
    },
  });

  if (persist) {
    let previous = store.getState();
    store.subscribe(() => {
      const current = store.getState();
      if (current.cart !== previous.cart) saveCart(current.cart);
      if (current.order.lastOrder !== previous.order.lastOrder) saveLastOrder(current.order.lastOrder);
      previous = current;
    });
  }

  return store;
}

const demoMode = typeof window !== "undefined" && isDemoCartRequested(window.location.search);

/** App store. `?demo=cart` loads the visual-test cart without touching saved data. */
export const cartStore = demoMode
  ? createCartStore({ preloadedCart: demoCartState, persist: false })
  : createCartStore({ preloadedCart: loadCart(), persist: true });

export const isDemoCart = demoMode;

export type CartStore = ReturnType<typeof createCartStore>;
export type CartDispatch = CartStore["dispatch"];
