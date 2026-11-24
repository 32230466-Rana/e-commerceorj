/**
 * SECTION A — Shared store hook used by the Navbar, Home, product cards and Wishlist page.
 *
 * Integration: the public API (`useStore()`) is unchanged, but cart and wishlist now
 * come from the single Redux store (src/features/cart/cartStore.ts), so the Navbar
 * counters, Home, Products and the Cart page all see the same data. Only the
 * light/dark theme still lives in this context.
 */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { CartItem } from '../lib/cart';
import { MAX_LINE_QUANTITY } from '../features/cart/cartSchema';
import { addItem, clearCart, removeItem, updateQuantity } from '../features/cart/cartSlice';
import { selectCartCount, selectCartLines, selectCartItems } from '../features/cart/cartSelectors';
import type { CartDispatch, CartRootState } from '../features/cart/cartStore';
import { selectWishlistIds, toggleWishlist } from '../features/wishlist/wishlistSlice';

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

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const THEME_KEY = 'solex-theme';
const LEGACY_THEME_KEY = 'kixon-theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function readTheme(): Theme {
  try {
    const value = window.localStorage.getItem(THEME_KEY) ?? window.localStorage.getItem(LEGACY_THEME_KEY);
    const parsed = value ? JSON.parse(value) : 'light';
    return parsed === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, JSON.stringify(theme)); } catch { /* storage unavailable */ }
  }, [theme]);

  const value = useMemo<ThemeContextType>(() => ({
    theme,
    toggleTheme: () => setTheme((current) => current === 'dark' ? 'light' : 'dark'),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useStore(): StoreContextType {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) throw new Error('useStore must be called inside StoreProvider');

  const dispatch = useDispatch<CartDispatch>();
  const items = useSelector((state: CartRootState) => selectCartItems(state));
  const lines = useSelector((state: CartRootState) => selectCartLines(state));
  const cartCount = useSelector((state: CartRootState) => selectCartCount(state));
  const wishlist = useSelector((state: CartRootState) => selectWishlistIds(state));

  return useMemo<StoreContextType>(() => ({
    ...themeContext,
    cart: items.map(({ productId, quantity }) => ({ productId, quantity })),
    cartCount,
    subtotal: lines.reduce((sum, line) => sum + line.lineTotal, 0),
    addToCart: (id) => dispatch(addItem({ productId: id })),
    changeQuantity: (id, quantity) => {
      if (!Number.isFinite(quantity) || quantity <= 0) dispatch(removeItem(id));
      // Developer C's cart rule caps each line at MAX_LINE_QUANTITY (Section A allowed 99).
      else dispatch(updateQuantity({ productId: id, quantity: Math.min(MAX_LINE_QUANTITY, Math.floor(quantity)) }));
    },
    removeFromCart: (id) => dispatch(removeItem(id)),
    clearCart: () => dispatch(clearCart()),
    wishlist,
    toggleWishlist: (id) => dispatch(toggleWishlist(id)),
    isWishlisted: (id) => wishlist.includes(id),
  }), [themeContext, items, lines, cartCount, wishlist, dispatch]);
}
