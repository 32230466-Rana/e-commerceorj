import { describe, it, expect } from 'vitest';
import { addCartItem, getCartCount, getCartSubtotal, setCartItemQuantity } from './cart';

describe('Shopping cart', () => {
  it('adds a product, updates quantity and calculates price', () => {
    const first = addCartItem([], 'flame-01');
    const second = addCartItem(first, 'flame-01');
    expect(second).toEqual([{ productId: 'flame-01', quantity: 2 }]);
    expect(getCartCount(second)).toBe(2);
    expect(getCartSubtotal(second)).toBe(298);
    expect(setCartItemQuantity(second, 'flame-01', 0)).toEqual([]);
  });
});
