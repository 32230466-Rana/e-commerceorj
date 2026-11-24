import { z } from "zod";
import { getCatalogProduct } from "../../catalog/catalog";
import type { WishlistState } from "./wishlistSlice";

export const WISHLIST_STORAGE_KEY = "solex:wishlist:v1";
/** Wishlists saved by the pre-integration branches, imported once. */
export const LEGACY_SECTION_A_WISHLIST_KEY = "kixon-wishlist"; // string ids
export const LEGACY_PRODUCTS_WISHLIST_KEY = "kixon_wishlist"; // Developer B: product objects

const persistedSchema = z.object({ version: z.literal(1), ids: z.array(z.string()) });
const legacyIdsSchema = z.array(z.string());
const legacyProductsSchema = z.array(z.object({ id: z.string() }).passthrough());

const known = (ids: string[]) => [...new Set(ids)].filter((id) => getCatalogProduct(id));

export function loadWishlist(storage: Storage | undefined = safeLocalStorage()): WishlistState {
  try {
    const stored = storage?.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      const parsed = persistedSchema.safeParse(JSON.parse(stored));
      return { ids: parsed.success ? known(parsed.data.ids) : [] };
    }
    const fromSectionA = legacyIdsSchema.safeParse(JSON.parse(storage?.getItem(LEGACY_SECTION_A_WISHLIST_KEY) ?? "[]"));
    const fromProducts = legacyProductsSchema.safeParse(JSON.parse(storage?.getItem(LEGACY_PRODUCTS_WISHLIST_KEY) ?? "[]"));
    return {
      ids: known([
        ...(fromSectionA.success ? fromSectionA.data : []),
        ...(fromProducts.success ? fromProducts.data.map((product) => product.id) : []),
      ]),
    };
  } catch {
    return { ids: [] };
  }
}

export function saveWishlist(state: WishlistState, storage: Storage | undefined = safeLocalStorage()): void {
  try {
    storage?.setItem(WISHLIST_STORAGE_KEY, JSON.stringify({ version: 1, ids: state.ids }));
  } catch {
    // Storage unavailable; the in-memory wishlist still works.
  }
}

function safeLocalStorage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}
