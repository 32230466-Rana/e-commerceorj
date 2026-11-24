import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router";
import type { CartRootState } from "./cartStore";
import { formatMoney } from "./pricing";
import { CheckoutStepper, PageShell } from "./components/SiteChrome";
import { ArrowLeftIcon } from "./components/Icons";
import "./CartPage.css";

export default function OrderConfirmationPage() {
  const order = useSelector((state: CartRootState) => state.order.lastOrder);

  if (!order) return <Navigate to="/cart" replace />;

  return (
    <PageShell>
      <main className="sx-page sx-confirm" id="main">
        <div className="sx-cart__head">
          <div className="sx-title">
            <span className="sx-title__icon sx-title__icon--ok">
              <svg viewBox="0 0 52 52" width="30" height="30" aria-hidden="true">
                <path className="sx-draw" d="M14 27 l8 8 l16 -18" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <h1>Order <em>Confirmed</em></h1>
              <p>Thanks, {order.customer.fullName.split(" ")[0]} — your order is in.</p>
            </div>
          </div>
          <CheckoutStepper current={3} done />
        </div>

        <section className="sx-panel sx-receipt" aria-labelledby="sx-receipt-title">
          <header>
            <div>
              <h2 id="sx-receipt-title">Order {order.id}</h2>
              <p>
                Placed {new Date(order.createdAt).toLocaleString()} · Delivering to {order.customer.city}
              </p>
            </div>
            <span className="sx-receipt__tag">Simulated order</span>
          </header>
          <ul>
            {order.lines.map((line) => (
              <li key={line.productId}>
                <img src={line.image} alt="" />
                <span>
                  <strong>{line.name}</strong>
                  <small>Size {line.size} · {line.color} · Qty {line.quantity}</small>
                </span>
                <b>{formatMoney(line.unitPrice * line.quantity)}</b>
              </li>
            ))}
          </ul>
          <dl>
            <div><dt>Subtotal ({order.totals.itemCount} items)</dt><dd>{formatMoney(order.totals.subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd>{order.totals.shipping === 0 ? "Free" : formatMoney(order.totals.shipping)}</dd></div>
            <div className="is-total"><dt>Total</dt><dd>{formatMoney(order.totals.total)}</dd></div>
          </dl>
          <p className="sx-receipt__note">
            No payment was taken and no email was sent — this confirmation is a demo of the checkout flow. The ordered items
            have been removed from your cart.
          </p>
          <Link className="sx-cta sx-cta--inline" to="/cart">
            <ArrowLeftIcon size={18} /> <span>Back to cart</span>
          </Link>
        </section>
      </main>
    </PageShell>
  );
}
