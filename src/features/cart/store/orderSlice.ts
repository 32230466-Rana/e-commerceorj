import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { addItem, orderPlaced } from "./cartSlice";
import type { Order } from "../types";

export interface OrderState {
  lastOrder: Order | null;
}

const initialState: OrderState = { lastOrder: null };

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearLastOrder: (state) => {
      state.lastOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderPlaced, (state, action: PayloadAction<Order>) => {
        state.lastOrder = action.payload;
      })
      // Starting a new cart means the previous confirmation is no longer current.
      .addCase(addItem, (state) => {
        state.lastOrder = null;
      });
  },
});

export const { clearLastOrder } = orderSlice.actions;
export default orderSlice.reducer;
