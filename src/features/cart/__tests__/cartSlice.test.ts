import { describe, expect, it } from "vitest";
import reducer, {
  addItem,
  clearCart,
  orderPlaced,
  removeItem,
  removeSelected,
  setAllSelected,
  toggleSelected,
  updateQuantity,
  updateVariant,
} from "../cartSlice";
import orderReducer from "../orderSlice";
import { selectCartLines, selectSelectedTotals } from "../cartSelectors";
import { MAX_LINE_QUANTITY } from "../cartSchema";
import type { CartState, Order } from "../types";

const start = (): CartState => ({
  items: [
    { productId: 1, quantity: 1, size: 42, color: "Red", selected: true },
    { productId: 2, quantity: 2, size: 41, color: "White", selected: true },
  ],
});

describe("cartSlice", () => {
  it("adds a new item with default supported variants", () => {
    const state = reducer({ items: [] }, addItem({ productId: 3 }));
    expect(state.items).toEqual([{ productId: 3, quantity: 1, size: 41, color: "Black", selected: true }]);
  });

  it("merges quantities and caps them", () => {
    let state = reducer(start(), addItem({ productId: 1, quantity: 3 }));
    expect(state.items[0].quantity).toBe(4);
    state = reducer(state, addItem({ productId: 1, quantity: 50 }));
    expect(state.items[0].quantity).toBe(MAX_LINE_QUANTITY);
  });

  it("rejects invalid ids and quantities", () => {
    expect(reducer(start(), addItem({ productId: -1 }))).toEqual(start());
    expect(reducer(start(), updateQuantity({ productId: 1, quantity: 0 }))).toEqual(start());
    expect(reducer(start(), updateQuantity({ productId: 1, quantity: 1.5 }))).toEqual(start());
    expect(reducer(start(), updateQuantity({ productId: 1, quantity: MAX_LINE_QUANTITY + 1 }))).toEqual(start());
  });

  it("updates quantity", () => {
    expect(reducer(start(), updateQuantity({ productId: 2, quantity: 5 })).items[1].quantity).toBe(5);
  });

  it("only accepts supported sizes and colors", () => {
    let state = reducer(start(), updateVariant({ productId: 1, size: 44, color: "Black" }));
    expect(state.items[0]).toMatchObject({ size: 44, color: "Black" });
    state = reducer(state, updateVariant({ productId: 1, size: 47, color: "Purple" }));
    expect(state.items[0]).toMatchObject({ size: 44, color: "Black" });
  });

  it("removes, selects and clears", () => {
    expect(reducer(start(), removeItem(1)).items.map((i) => i.productId)).toEqual([2]);
    let state = reducer(start(), toggleSelected(2));
    expect(state.items[1].selected).toBe(false);
    state = reducer(state, removeSelected());
    expect(state.items.map((i) => i.productId)).toEqual([2]);
    state = reducer(state, setAllSelected(true));
    expect(state.items[0].selected).toBe(true);
    expect(reducer(state, clearCart()).items).toEqual([]);
  });

  it("removes ordered lines and records the order", () => {
    const order: Order = {
      id: "SX-1",
      createdAt: new Date(0).toISOString(),
      lines: [{ productId: 1, name: "Nike Air Jordan 1", image: "", unitPrice: 179.99, quantity: 1, size: 42, color: "Red" }],
      totals: { itemCount: 1, subtotal: 179.99, shipping: 0, total: 179.99 },
      customer: { fullName: "A B", email: "a@b.co", city: "Beirut" },
    };
    expect(reducer(start(), orderPlaced(order)).items.map((i) => i.productId)).toEqual([2]);
    expect(orderReducer(undefined, orderPlaced(order)).lastOrder?.id).toBe("SX-1");
  });
});

describe("selectors", () => {
  it("computes totals for selected lines only, with free shipping over $100", () => {
    const state = { cart: start() };
    expect(selectSelectedTotals(state)).toEqual({ itemCount: 3, subtotal: 379.97, shipping: 0, total: 379.97 });
    const partial = { cart: reducer(start(), toggleSelected(1)) };
    expect(selectSelectedTotals(partial)).toEqual({ itemCount: 2, subtotal: 199.98, shipping: 0, total: 199.98 });
    const small = { cart: { items: [{ productId: 2, quantity: 1 }] } };
    expect(selectSelectedTotals(small)).toEqual({ itemCount: 1, subtotal: 99.99, shipping: 8, total: 107.99 });
  });

  it("falls back to supported variants and skips unknown products", () => {
    const lines = selectCartLines({ cart: { items: [{ productId: 1, quantity: 1, size: 99, color: "Gold" }, { productId: 999, quantity: 1 }] } });
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ size: 40, color: "Red", selected: true });
  });
});
