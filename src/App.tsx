import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import CartPage from "./features/cart/CartPage";
import CheckoutPage from "./features/cart/CheckoutPage";
import OrderConfirmationPage from "./features/cart/OrderConfirmationPage";
import { ProductsPage } from "./pages/ProductsPage";
import "./styles/theme.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home belongs to Section A; until it is merged, "/" shows the cart. */}
        <Route path="/" element={<Navigate to="/cart" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="*" element={<Navigate to="/cart" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
