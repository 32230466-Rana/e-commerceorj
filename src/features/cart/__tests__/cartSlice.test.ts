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
    { productId: "1", quantity: 1, size: 42, color: "Red", selected: true },
    { productId: "2", quantity: 2, size: 41, color: "White", selected: true },
  ],
});

describe("cartSlice", () => {
  it("adds products from every developer's catalog with their own variants (or none)", () => {
    let state = reducer({ items: [] }, addItem({ productId: "kxn-03" }));
    state = reducer(state, addItem({ productId: "flame-01" }));
    expect(state.items).toEqual([
      { productId: "kxn-03", quantity: 1, size: undefined, color: undefined, selected: true },
      { productId: "flame-01", quantity: 1, size: undefined, color: undefined, selected: true },
    ]);
    // Variant changes are ignored for products that define no variants.
    expect(reducer(state, updateVariant({ productId: "kxn-03", size: 42 })).items[0].size).toBeUndefined();
  });

  it("adds a new item with default supported variants", () => {
    const state = reducer({ items: [] }, addItem({ productId: "3" }));
    expect(state.items).toEqual([{ productId: "3", quantity: 1, size: 41, color: "Black", selected: true }]);
  });

  it("merges quantities and caps them", () => {
    let state = reducer(start(), addItem({ productId: "1", quantity: 3 }));
    expect(state.items[0].quantity).toBe(4);
    state = reducer(state, addItem({ productId: "1", quantity: 50 }));
    expect(state.items[0].quantity).toBe(MAX_LINE_QUANTITY);
  });

  it("rejects invalid ids and quantities", () => {
    expect(reducer(start(), addItem({ productId: "not-in-catalog" }))).toEqual(start());
    expect(reducer(start(), updateQuantity({ productId: "1", quantity: 0 }))).toEqual(start());
    expect(reducer(start(), updateQuantity({ productId: "1", quantity: 1.5 }))).toEqual(start());
    expect(reducer(start(), updateQuantity({ productId: "1", quantity: MAX_LINE_QUANTITY + 1 }))).toEqual(start());
  });

  it("updates quantity", () => {
    expect(reducer(start(), updateQuantity({ productId: "2", quantity: 5 })).items[1].quantity).toBe(5);
  });

  it("only accepts supported sizes and colors", () => {
    let state = reducer(start(), updateVariant({ productId: "1", size: 44, color: "Black" }));
    expect(state.items[0]).toMatchObject({ size: 44, color: "Black" });
    state = reducer(state, updateVariant({ productId: "1", size: 47, color: "Purple" }));
    expect(state.items[0]).toMatchObject({ size: 44, color: "Black" });
  });

  it("removes, selects and clears", () => {
    expect(reducer(start(), removeItem("1")).items.map((i) => i.productId)).toEqual(["2"]);
    let state = reducer(start(), toggleSelected("2"));
    expect(state.items[1].selected).toBe(false);
    state = reducer(state, removeSelected());
    expect(state.items.map((i) => i.productId)).toEqual(["2"]);
    state = reducer(state, setAllSelected(true));
    expect(state.items[0].selected).toBe(true);
    expect(reducer(state, clearCart()).items).toEqual([]);
  });

  it("removes ordered lines and records the order", () => {
    const order: Order = {
      id: "SX-1",
      createdAt: new Date(0).toISOString(),
      lines: [{ productId: "1", name: "Nike Air Jordan 1", image: "", unitPrice: 179.99, quantity: 1, size: 42, color: "Red" }],
      totals: { itemCount: 1, subtotal: 179.99, shipping: 0, total: 179.99 },
      customer: { fullName: "A B", email: "a@b.co", city: "Beirut" },
    };
    expect(reducer(start(), orderPlaced(order)).items.map((i) => i.productId)).toEqual(["2"]);
    expect(orderReducer(undefined, orderPlaced(order)).lastOrder?.id).toBe("SX-1");
  });
});

describe("selectors", () => {
  it("computes totals for selected lines only, with free shipping over $100", () => {
    const state = { cart: start() };
    expect(selectSelectedTotals(state)).toEqual({ itemCount: 3, subtotal: 379.97, shipping: 0, total: 379.97 });
    const partial = { cart: reducer(start(), toggleSelected("1")) };
    expect(selectSelectedTotals(partial)).toEqual({ itemCount: 2, subtotal: 199.98, shipping: 0, total: 199.98 });
    const small = { cart: { items: [{ productId: "2", quantity: 1 }] } };
    expect(selectSelectedTotals(small)).toEqual({ itemCount: 1, subtotal: 99.99, shipping: 8, total: 107.99 });
  });

  it("falls back to supported variants and skips unknown products", () => {
    const lines = selectCartLines({ cart: { items: [{ productId: "1", quantity: 1, size: 99, color: "Gold" }, { productId: "999", quantity: 1 }] } });
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ size: 40, color: "Red", selected: true });
  });
});

describe("cartSlice — invalid inputs and no-ops", () => {
  it("addItem ignores zero, negative, fractional and unsafe quantities", () => {
    for (const quantity of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(reducer(start(), addItem({ productId: "3", quantity }))).toEqual(start());
    }
  });

  it("addItem caps a brand-new line at the limit and falls back to supported variants", () => {
    const state = reducer({ items: [] }, addItem({ productId: "1", quantity: 99, size: 47, color: "Purple" }));
    expect(state.items[0]).toMatchObject({ productId: "1", quantity: MAX_LINE_QUANTITY, size: 40, color: "Red" });
  });

  it("addItem keeps a requested supported variant and re-selects an existing line", () => {
    let state = reducer({ items: [] }, addItem({ productId: "1", size: 43, color: "Black" }));
    expect(state.items[0]).toMatchObject({ size: 43, color: "Black" });
    state = reducer(state, toggleSelected("1"));
    state = reducer(state, addItem({ productId: "1" }));
    expect(state.items[0]).toMatchObject({ quantity: 2, selected: true });
  });

  it("updateQuantity accepts the limit itself and ignores unknown lines", () => {
    expect(reducer(start(), updateQuantity({ productId: "1", quantity: MAX_LINE_QUANTITY })).items[0].quantity).toBe(MAX_LINE_QUANTITY);
    expect(reducer(start(), updateQuantity({ productId: "kxn-01", quantity: 2 }))).toEqual(start());
    expect(reducer(start(), updateQuantity({ productId: "1", quantity: -3 }))).toEqual(start());
  });

  it("updateVariant ignores lines that are not in the cart", () => {
    expect(reducer(start(), updateVariant({ productId: "3", size: 41 }))).toEqual(start());
  });

  it("removeItem and toggleSelected ignore unknown ids", () => {
    expect(reducer(start(), removeItem("does-not-exist"))).toEqual(start());
    expect(reducer(start(), toggleSelected("does-not-exist"))).toEqual(start());
  });

  it("toggleSelected treats a missing flag as selected", () => {
    const state = reducer({ items: [{ productId: "1", quantity: 1 }] }, toggleSelected("1"));
    expect(state.items[0].selected).toBe(false);
  });

  it("setAllSelected(false) deselects everything and removeSelected then keeps every line", () => {
    const state = reducer(start(), setAllSelected(false));
    expect(state.items.every((item) => item.selected === false)).toBe(true);
    expect(reducer(state, removeSelected()).items).toHaveLength(2);
    expect(reducer(start(), removeSelected()).items).toEqual([]);
  });

  it("orderPlaced keeps lines that were not part of the order", () => {
    const order: Order = {
      id: "SX-2",
      createdAt: new Date(0).toISOString(),
      lines: [{ productId: "kxn-03", name: "Retro Skate Classic Low", image: "", unitPrice: 95, quantity: 1 }],
      totals: { itemCount: 1, subtotal: 95, shipping: 8, total: 103 },
      customer: { fullName: "A B", email: "a@b.co", city: "Beirut" },
    };
    const withSkate = reducer(start(), addItem({ productId: "kxn-03" }));
    expect(reducer(withSkate, orderPlaced(order)).items).toEqual(start().items);
  });
});
