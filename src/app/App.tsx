import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomePage from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import WishlistPage from '../pages/WishlistPage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';
import CartPage from '../features/cart/CartPage';
import CheckoutPage from '../features/cart/CheckoutPage';
import OrderConfirmationPage from '../features/cart/OrderConfirmationPage';

/**
 * Single router for the integrated SoleX site.
 * Section A: frame (Header/Footer), Home, Wishlist, About, 404.
 * Developer B: /products. Developer C: /cart, /checkout, /order-confirmation.
 */
export default function App() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [pathname]);
  return <>
    <Header />
    <main id="main-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
    <Footer />
  </>;
}
