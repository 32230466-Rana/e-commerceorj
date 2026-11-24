import { getCatalogProduct } from "../../catalog/catalog";
import { cartItemSchema, orderSchema, persistedCartSchema } from "./cartSchema";
import type { CartState, Order } from "./types";

export const CART_STORAGE_KEY = "solex:cart:v1";
/** Section A's pre-integration cart ({ productId: string, quantity }[]), imported once. */
export const LEGACY_SECTION_A_CART_KEY = "kixon-cart";
export const ORDER_STORAGE_KEY = "solex:last-order:v1";

const emptyCart = (): CartState => ({ items: [] });

/** Loads the persisted cart. Invalid or missing data yields an empty cart. */
export function loadCart(storage: Storage | undefined = safeStorage("localStorage")): CartState {
  try {
    const stored = storage?.getItem(CART_STORAGE_KEY);
    if (!stored) return loadLegacySectionACart(storage);

    const result = persistedCartSchema.safeParse(JSON.parse(stored));
    return result.success ? result.data.cart : emptyCart();
  } catch {
    return emptyCart();
  }
}

function loadLegacySectionACart(storage: Storage | undefined): CartState {
  try {
    const legacy = storage?.getItem(LEGACY_SECTION_A_CART_KEY);
    if (!legacy) return emptyCart();
    const parsed = JSON.parse(legacy);
    if (!Array.isArray(parsed)) return emptyCart();
    const items = parsed.flatMap((entry) => {
      const result = cartItemSchema.safeParse({ ...entry, selected: true });
      return result.success && getCatalogProduct(result.data.productId) ? [result.data] : [];
    });
    return { items };
  } catch {
    return emptyCart();
  }
}

export function saveCart(cart: CartState, storage: Storage | undefined = safeStorage("localStorage")): void {
  try {
    const validated = persistedCartSchema.parse({ version: 1, cart });
    storage?.setItem(CART_STORAGE_KEY, JSON.stringify(validated));
  } catch {
    // Storage may be unavailable or full; the in-memory cart still works.
  }
}

/** The last simulated order lives in sessionStorage so the confirmation survives a refresh. */
export function loadLastOrder(storage: Storage | undefined = safeStorage("sessionStorage")): Order | null {
  try {
    const stored = storage?.getItem(ORDER_STORAGE_KEY);
    if (!stored) return null;
    const result = orderSchema.safeParse(JSON.parse(stored));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function saveLastOrder(order: Order | null, storage: Storage | undefined = safeStorage("sessionStorage")): void {
  try {
    if (order) storage?.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
    else storage?.removeItem(ORDER_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

function safeStorage(kind: "localStorage" | "sessionStorage"): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window[kind];
  } catch {
    return undefined;
  }
}
