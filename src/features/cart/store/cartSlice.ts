import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { MAX_LINE_QUANTITY } from "../schemas/cartSchema";
import {
  getCatalogProduct,
  isSupportedColor,
  isSupportedSize,
} from "../../../catalog/catalog";
import type { CartState, Order } from "../types";
//addItem,updateQuantity,removeItem,clearCart,updateVariant
const initialState: CartState = {
  items: [],
};

const isPositiveInt = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{
        productId: string;
        quantity?: number;
        size?: number;
        color?: string;
      }>
    ) => {
      const { productId, quantity = 1, size, color } = action.payload;

      if (!getCatalogProduct(productId) || !isPositiveInt(quantity)) return;

      const product = getCatalogProduct(productId);
      const existing = state.items.find((item) => item.productId === productId);

      if (existing) {
        existing.quantity = Math.min(
          MAX_LINE_QUANTITY,
          existing.quantity + quantity
        );
        existing.selected = true;
        return;
      }

      state.items.push({
        productId,
        quantity: Math.min(MAX_LINE_QUANTITY, quantity),
        size:
          product && size !== undefined && isSupportedSize(product, size)
            ? size
            : product?.sizes[0],
        color:
          product && color !== undefined && isSupportedColor(product, color)
            ? color
            : product?.colors[0]?.name,
        selected: true,
      });
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;

      if (!isPositiveInt(quantity) || quantity > MAX_LINE_QUANTITY) return;

      const item = state.items.find((line) => line.productId === productId);
      if (item) item.quantity = quantity;
    },

    /** Changes size and/or color. Ignored unless the product supports the variant. */
    updateVariant: (
      state,
      action: PayloadAction<{
        productId: string;
        size?: number;
        color?: string;
      }>
    ) => {
      const { productId, size, color } = action.payload;
      const item = state.items.find((line) => line.productId === productId);
      const product = getCatalogProduct(productId);

      if (!item || !product) return;
      if (size !== undefined && isSupportedSize(product, size))
        item.size = size;
      if (color !== undefined && isSupportedColor(product, color))
        item.color = color;
    },

    toggleSelected: (state, action: PayloadAction<string>) => {
      const item = state.items.find(
        (line) => line.productId === action.payload
      );
      if (item) item.selected = item.selected === false;
    },

    setAllSelected: (state, action: PayloadAction<boolean>) => {
      state.items.forEach((item) => {
        item.selected = action.payload;
      });
    },

    removeSelected: (state) => {
      state.items = state.items.filter((item) => item.selected === false);
    },

    clearCart: (state) => {
      state.items = [];
    },

    /** A simulated order was placed: the ordered lines leave the cart. */
    orderPlaced: (state, action: PayloadAction<Order>) => {
      const ordered = new Set(
        action.payload.lines.map((line) => line.productId)
      );
      state.items = state.items.filter((item) => !ordered.has(item.productId));
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  updateVariant,
  toggleSelected,
  setAllSelected,
  removeSelected,
  clearCart,
  orderPlaced,
} = cartSlice.actions;

export default cartSlice.reducer;
