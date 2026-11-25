import { useId, useState } from "react";
import { Link } from "react-router";
import { FREE_SHIPPING_THRESHOLD, formatMoney } from "../utils/pricing";
import type { OrderTotals } from "../types";
import { ArrowLeftIcon, ArrowRightIcon, LockIcon, SoleXMark, TicketIcon } from "./Icons";

interface CartSummaryProps {
  totals: OrderTotals;
  canCheckout: boolean;
  onCheckout: () => void;
}

export default function CartSummary({ totals, canCheckout, onCheckout }: CartSummaryProps) {
  const [code, setCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const messageId = useId();
  const toFreeShipping = FREE_SHIPPING_THRESHOLD - totals.subtotal;

  // No promotions are configured for the store yet, so codes are never accepted.
  const applyCoupon = () => {
    setCouponMessage(code.trim() ? "Promo codes aren't available yet." : "Enter a promo code first.");
  };

  return (
    <aside className="sx-summary" aria-labelledby="sx-summary-title">
      <header className="sx-summary__head">
        <span className="sx-summary__icon"><LockIcon size={20} /></span>
        <h2 id="sx-summary-title">Order Summary</h2>
        <span className="sx-summary__corner" aria-hidden="true"><SoleXMark size={26} /></span>
      </header>

      <dl className="sx-summary__lines">
        <div>
          <dt>Subtotal ({totals.itemCount} {totals.itemCount === 1 ? "item" : "items"})</dt>
          <dd data-testid="summary-subtotal">{formatMoney(totals.subtotal)}</dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd className={totals.shipping === 0 ? "is-free" : ""} data-testid="summary-shipping">
            {totals.shipping === 0 ? "Free" : formatMoney(totals.shipping)}
          </dd>
        </div>
        {totals.subtotal > 0 && toFreeShipping > 0 && (
          <p className="sx-summary__hint">Add {formatMoney(toFreeShipping)} more for free shipping.</p>
        )}
      </dl>

      <div className="sx-summary__total">
        <span>Total</span>
        <strong data-testid="summary-total" key={totals.total}>{formatMoney(totals.total)}</strong>
      </div>

      <form
        className="sx-coupon"
        onSubmit={(event) => {
          event.preventDefault();
          applyCoupon();
        }}
      >
        <TicketIcon size={18} />
        <label className="sr-only" htmlFor={`${messageId}-input`}>Promo code</label>
        <input
          id={`${messageId}-input`}
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Enter coupon code"
          aria-describedby={couponMessage ? messageId : undefined}
          autoComplete="off"
        />
        <button type="submit">Apply</button>
      </form>
      <p id={messageId} className="sx-summary__coupon-msg" role="status">{couponMessage}</p>

      <button type="button" className="sx-cta" onClick={onCheckout} disabled={!canCheckout} aria-describedby={!canCheckout ? `${messageId}-why` : undefined}>
        <LockIcon size={18} />
        <span>Proceed to Checkout</span>
        <ArrowRightIcon size={18} />
      </button>
      {!canCheckout && (
        <p id={`${messageId}-why`} className="sx-summary__hint sx-summary__hint--center">
          Select at least one item to check out.
        </p>
      )}

      <div className="sx-or" aria-hidden="true"><span />Or<span /></div>
      <Link className="sx-ghost" to="/">
        <ArrowLeftIcon size={18} />
        <span>Continue Shopping</span>
      </Link>
    </aside>
  );
}
