/** Developer C module — simulated checkout; no real payment or customer records. */
import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import CheckoutForm from '../../components/sectionA/CheckoutForm';
import { useStore } from '../../app/StoreContext';
import { formatPrice, getProduct } from '../../data/products';
import type { CheckoutDetails } from '../../lib/checkout';
import type { CartItem } from '../../lib/cart';
import { SHIPPING_THRESHOLD } from './CartPage';

interface OrderReceipt { reference: string; customer: string; items: CartItem[]; total: number }
export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useStore();
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 12;
  const submit = (details: CheckoutDetails) => {
    if (cart.length === 0) return;
    const reference = `KX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setReceipt({ reference, customer: details.fullName, items: [...cart], total: subtotal + shipping });
    clearCart();
  };
  if (receipt) return <section className="container confirmation-page"><div className="confirmation-icon"><CheckCircle2 size={56}/></div><span className="eyebrow">ORDER CONFIRMED / SIMULATION ONLY</span><h1>YOU'RE IN.<br/><em>KEEP MOVING.</em></h1><p>Thanks, {receipt.customer}! Your simulated order was placed successfully. No payment was taken, and no order was sent to a store.</p><div className="confirmation-receipt"><div><span>YOUR ORDER REFERENCE</span><strong>{receipt.reference}</strong></div><div><span>ITEMS</span><strong>{receipt.items.reduce((sum, item) => sum + item.quantity, 0)}</strong></div><div><span>ORDER TOTAL</span><strong>{formatPrice(receipt.total)}</strong></div>{receipt.items.map(({productId,quantity}) => {const p=getProduct(productId);return p && <p key={productId}>{p.name} × {quantity}</p>;})}</div><Link className="btn btn-primary" to="/products">Discover more sneakers <ArrowRight size={17}/></Link></section>;
  if (cart.length === 0) return <Navigate to="/cart" replace />;
  return <section className="page-shell container"><div className="page-topline"><span className="eyebrow">LAST STEP / CHECKOUT</span><span>SECURE DEMO</span></div><div className="inner-page-title"><h1>MAKE IT <em>YOURS.</em></h1><p>You're one step away from your next favorite pair.</p></div><div className="checkout-layout"><CheckoutForm onValidSubmit={submit}/><aside className="order-box checkout-summary"><span className="eyebrow">YOUR ORDER</span><h2>THE DETAILS</h2>{cart.map(({ productId, quantity }) => {const p=getProduct(productId);return p && <div className="checkout-summary-item" key={p.id}><img src={p.image} alt={p.name}/><div><strong>{p.name}</strong><span>Qty {quantity}</span></div><b>{formatPrice(p.price * quantity)}</b></div>;})}<div className="order-line"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><div className="order-line"><span>Shipping</span><strong>{shipping ? formatPrice(shipping) : 'FREE'}</strong></div><div className="order-total"><span>Total</span><strong>{formatPrice(subtotal + shipping)}</strong></div><p className="summary-note">This is a university demo. No real orders, deliveries or payments.</p></aside></div></section>;
}
