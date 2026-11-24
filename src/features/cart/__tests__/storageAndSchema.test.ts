import { describe, expect, it } from "vitest";
import { CART_STORAGE_KEY, LEGACY_SECTION_A_CART_KEY, loadCart, loadLastOrder, saveCart, saveLastOrder } from "../cartStorage";
import { checkoutSchema } from "../checkoutSchema";
import { isDemoCartRequested } from "../demoCart";

/** Minimal in-memory Storage so these tests do not need a DOM environment. */
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

describe("cart storage", () => {
  it("round-trips a cart", () => {
    const storage = memoryStorage();
    const cart = { items: [{ productId: "1", quantity: 2, size: 42, color: "Red", selected: false }] };
    saveCart(cart, storage);
    expect(loadCart(storage)).toEqual(cart);
  });

  it("starts empty when nothing or invalid data is stored (no hardcoded demo items)", () => {
    const storage = memoryStorage();
    expect(loadCart(storage)).toEqual({ items: [] });
    storage.setItem(CART_STORAGE_KEY, "{broken");
    expect(loadCart(storage)).toEqual({ items: [] });
    storage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, cart: { items: [{ productId: 0, quantity: 1 }] } }));
    expect(loadCart(storage)).toEqual({ items: [] });
  });

  it("migrates older carts by clamping very large quantities", () => {
    const storage = memoryStorage();
    storage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, cart: { items: [{ productId: 1, quantity: 40 }] } }));
    // Pre-integration carts stored numeric ids; they become the shared catalog's string ids.
    expect(loadCart(storage).items[0]).toMatchObject({ productId: "1", quantity: 10 });
  });

  it("imports Section A's pre-integration cart once, keeping only catalog products", () => {
    const storage = memoryStorage();
    storage.setItem(LEGACY_SECTION_A_CART_KEY, JSON.stringify([{ productId: "flame-01", quantity: 2 }, { productId: "gone", quantity: 1 }]));
    expect(loadCart(storage)).toEqual({ items: [{ productId: "flame-01", quantity: 2, selected: true }] });
    storage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, cart: { items: [] } }));
    expect(loadCart(storage)).toEqual({ items: [] });
  });

  it("stores and clears the last order", () => {
    const storage = memoryStorage();
    const order = {
      id: "SX-1",
      createdAt: "2026-01-01T00:00:00.000Z",
      lines: [{ productId: "1", name: "Nike Air Jordan 1", image: "/shoes/jordan.png", unitPrice: 179.99, quantity: 1, size: 42, color: "Red" }],
      totals: { itemCount: 1, subtotal: 179.99, shipping: 0, total: 179.99 },
      customer: { fullName: "Alex Morgan", email: "alex@example.com", city: "Beirut" },
    };
    saveLastOrder(order, storage);
    expect(loadLastOrder(storage)).toEqual(order);
    saveLastOrder(null, storage);
    expect(loadLastOrder(storage)).toBeNull();
  });
});

describe("checkoutSchema", () => {
  const valid = {
    fullName: "Alex Morgan",
    email: "alex@example.com",
    phone: "+961 70 123 456",
    address: "12 Hamra Street",
    city: "Beirut",
    postalCode: "",
  };

  it("accepts valid details and trims whitespace", () => {
    const result = checkoutSchema.safeParse({ ...valid, fullName: "  Alex Morgan  " });
    expect(result.success).toBe(true);
    expect(result.success && result.data.fullName).toBe("Alex Morgan");
  });

  it("returns field-level messages for invalid input", () => {
    const result = checkoutSchema.safeParse({ ...valid, fullName: " ", email: "nope", phone: "abc", city: "" });
    expect(result.success).toBe(false);
    const fields = result.success ? [] : result.error.issues.map((issue) => issue.path[0]);
    expect(fields).toEqual(expect.arrayContaining(["fullName", "email", "phone", "city"]));
  });
});

describe("demo mode", () => {
  it("is only enabled by ?demo=cart", () => {
    expect(isDemoCartRequested("?demo=cart")).toBe(true);
    expect(isDemoCartRequested("?demo=1")).toBe(false);
    expect(isDemoCartRequested("")).toBe(false);
  });
});
