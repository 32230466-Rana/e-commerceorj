import { getProduct } from '../data/products';

export interface CartItem { productId: string; quantity: number }

/** Pure cart operations make state management predictable and testable. */
export function addCartItem(cart: CartItem[], productId: string): CartItem[] {
  if (!getProduct(productId)) return cart;
  const exists = cart.some((item) => item.productId === productId);
  return exists
    ? cart.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)
    : [...cart, { productId, quantity: 1 }];
}

export function setCartItemQuantity(cart: CartItem[], productId: string, quantity: number): CartItem[] {
  if (!Number.isFinite(quantity) || quantity <= 0) return cart.filter((item) => item.productId !== productId);
  return cart.map((item) => item.productId === productId ? { ...item, quantity: Math.min(99, Math.floor(quantity)) } : item);
}

export function getCartSubtotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + (getProduct(item.productId)?.price ?? 0) * item.quantity, 0);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((count, item) => count + item.quantity, 0);
}
