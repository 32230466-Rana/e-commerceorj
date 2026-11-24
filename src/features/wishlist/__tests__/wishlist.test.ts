import { describe, expect, it } from "vitest";
import reducer, { addToWishlist, clearWishlist, removeFromWishlist, toggleWishlist } from "../wishlistSlice";
import {
  LEGACY_PRODUCTS_WISHLIST_KEY,
  LEGACY_SECTION_A_WISHLIST_KEY,
  WISHLIST_STORAGE_KEY,
  loadWishlist,
  saveWishlist,
} from "../wishlistStorage";

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, String(value)),
  };
}

describe("wishlist slice", () => {
  it("toggles catalog products from any developer without duplicates", () => {
    let state = reducer(undefined, toggleWishlist("kxn-01"));
    state = reducer(state, toggleWishlist("flame-01"));
    state = reducer(state, toggleWishlist("1"));
    state = reducer(state, toggleWishlist("unknown"));
    expect(state.ids).toEqual(["kxn-01", "flame-01", "1"]);
    expect(reducer(state, toggleWishlist("kxn-01")).ids).toEqual(["flame-01", "1"]);
    expect(reducer(state, addToWishlist(["1", "2"])).ids).toEqual(["kxn-01", "flame-01", "1", "2"]);
    expect(reducer(state, removeFromWishlist("flame-01")).ids).toEqual(["kxn-01", "1"]);
    expect(reducer(state, clearWishlist()).ids).toEqual([]);
  });
});

describe("wishlist storage", () => {
  it("round-trips the shared wishlist", () => {
    const storage = memoryStorage();
    saveWishlist({ ids: ["kxn-02", "blush-02"] }, storage);
    expect(loadWishlist(storage)).toEqual({ ids: ["kxn-02", "blush-02"] });
  });

  it("imports both pre-integration wishlists once", () => {
    const storage = memoryStorage();
    storage.setItem(LEGACY_SECTION_A_WISHLIST_KEY, JSON.stringify(["flame-01", "missing"]));
    storage.setItem(LEGACY_PRODUCTS_WISHLIST_KEY, JSON.stringify([{ id: "kxn-04", name: "x", price: 1, category: "y", imageUrl: "z" }, { id: "flame-01" }]));
    expect(loadWishlist(storage)).toEqual({ ids: ["flame-01", "kxn-04"] });
    storage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify({ version: 1, ids: [] }));
    expect(loadWishlist(storage)).toEqual({ ids: [] });
  });
});
