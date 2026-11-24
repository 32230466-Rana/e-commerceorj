import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getCatalogProduct } from "../../catalog/catalog";

/** One wishlist for the whole site (Home, Products drawer, Wishlist page, Cart). */
export interface WishlistState {
  ids: string[];
}

const initialState: WishlistState = { ids: [] };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.ids.includes(id)) state.ids = state.ids.filter((item) => item !== id);
      else if (getCatalogProduct(id)) state.ids.push(id);
    },
    addToWishlist: (state, action: PayloadAction<string[]>) => {
      for (const id of action.payload) {
        if (!state.ids.includes(id) && getCatalogProduct(id)) state.ids.push(id);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.ids = state.ids.filter((item) => item !== action.payload);
    },
    clearWishlist: (state) => {
      state.ids = [];
    },
  },
});

export const { toggleWishlist, addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

export const selectWishlistIds = (state: { wishlist: WishlistState }) => state.wishlist.ids;
