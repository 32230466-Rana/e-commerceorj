import { createSelector } from "@reduxjs/toolkit";
import { getCatalogProduct, type CatalogProduct } from "../../catalog/catalog";
import { roundMoney, shippingFor } from "./pricing";
import type { CartItem, CartState, OrderTotals } from "./types";

export interface CartRootState {
  cart: CartState;
}

export interface CartLine {
  item: CartItem;
  product: CatalogProduct;
  /** Undefined for products without size/colour variants. */
  size: number | undefined;
  color: string | undefined;
  selected: boolean;
  lineTotal: number;
}

export const selectCartItems = (state: CartRootState) => state.cart.items;

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);

export const selectIsCartEmpty = createSelector([selectCartItems], (items) => items.length === 0);

/** Cart items joined with catalog data. Items for unknown products are skipped. */
export const selectCartLines = createSelector([selectCartItems], (items): CartLine[] =>
  items.flatMap((item) => {
    const product = getCatalogProduct(item.productId);
    if (!product) return [];
    return [
      {
        item,
        product,
        size: item.size !== undefined && product.sizes.includes(item.size) ? item.size : product.sizes[0],
        color:
          item.color !== undefined && product.colors.some((c) => c.name === item.color)
            ? item.color
            : product.colors[0]?.name,
        selected: item.selected !== false,
        lineTotal: roundMoney(product.price * item.quantity),
      },
    ];
  })
);

export const selectSelectedLines = createSelector([selectCartLines], (lines) =>
  lines.filter((line) => line.selected)
);

export function totalsFor(lines: CartLine[]): OrderTotals {
  const subtotal = roundMoney(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  const shipping = shippingFor(subtotal);
  return {
    itemCount: lines.reduce((sum, line) => sum + line.item.quantity, 0),
    subtotal,
    shipping,
    total: roundMoney(subtotal + shipping),
  };
}

export const selectSelectedTotals = createSelector([selectSelectedLines], totalsFor);
