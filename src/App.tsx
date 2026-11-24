import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import CartPage from "./features/cart/CartPage";
import CheckoutPage from "./features/cart/CheckoutPage";
import OrderConfirmationPage from "./features/cart/OrderConfirmationPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Shop/home pages belong to the other workstreams; until merged, "/" shows the cart. */}
        <Route path="/" element={<Navigate to="/cart" replace />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="*" element={<Navigate to="/cart" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
