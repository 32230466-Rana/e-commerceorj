/** SECTION A — Shared context + persistence; used by every page and teammate. */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { addCartItem, getCartCount, getCartSubtotal, setCartItemQuantity, type CartItem } from '../lib/cart';
import { getProduct } from '../data/products';

type Theme = 'light' | 'dark';

interface StoreContextType {
  theme: Theme;
  toggleTheme: () => void;
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (id: string) => void;
  changeQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => readStored<Theme>('kixon-theme', 'light'));
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = readStored<unknown>('kixon-cart', []);
    if (!Array.isArray(saved)) return [];
    return saved.filter((item): item is CartItem =>
      item != null && typeof item === 'object' &&
      'productId' in item && typeof item.productId === 'string' && Boolean(getProduct(item.productId)) &&
      'quantity' in item && typeof item.quantity === 'number' && Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 99
    );
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = readStored<unknown>('kixon-wishlist', []);
    return Array.isArray(saved) ? [...new Set(saved.filter((id): id is string => typeof id === 'string' && Boolean(getProduct(id))))] : [];
  });

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('kixon-theme', JSON.stringify(theme)); }, [theme]);
  useEffect(() => { localStorage.setItem('kixon-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('kixon-wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  const value = useMemo<StoreContextType>(() => ({
    theme,
    toggleTheme: () => setTheme((current) => current === 'dark' ? 'light' : 'dark'),
    cart,
    cartCount: getCartCount(cart),
    subtotal: getCartSubtotal(cart),
    addToCart: (id) => setCart((current) => addCartItem(current, id)),
    changeQuantity: (id, qty) => setCart((current) => setCartItemQuantity(current, id, qty)),
    removeFromCart: (id) => setCart((current) => current.filter((item) => item.productId !== id)),
    clearCart: () => setCart([]),
    wishlist,
    toggleWishlist: (id) => {
      if (!getProduct(id)) return;
      setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    },
    isWishlisted: (id) => wishlist.includes(id),
  }), [theme, cart, wishlist]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextType {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be called inside StoreProvider');
  return store;
}
