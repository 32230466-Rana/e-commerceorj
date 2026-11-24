import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router";
import { orderPlaced } from "./cartSlice";
import { selectSelectedLines, selectSelectedTotals } from "./cartSelectors";
import type { CartDispatch, CartRootState } from "./cartStore";
import {
  checkoutSchema,
  emptyCheckoutForm,
  type CheckoutFormInput,
  type CheckoutFormValues,
} from "./checkoutSchema";
import { formatMoney } from "./pricing";
import type { Order } from "./types";
import { CheckoutStepper, PageShell } from "./components/SiteChrome";
import { ArrowLeftIcon, ArrowRightIcon, LockIcon, MapPinIcon } from "./components/Icons";
import "./CartPage.css";

type FieldName = keyof CheckoutFormInput;

const fields: { name: FieldName; label: string; type?: string; autoComplete: string; wide?: boolean; optional?: boolean }[] = [
  { name: "fullName", label: "Full name", autoComplete: "name", wide: true },
  { name: "email", label: "Email address", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel" },
  { name: "address", label: "Street address", autoComplete: "street-address", wide: true },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "postalCode", label: "Postal code", autoComplete: "postal-code", optional: true },
];

function createOrderId(): string {
  const random = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 6) : Math.random().toString(36).slice(2, 8);
  return `SX-${Date.now().toString(36).toUpperCase()}-${random.toUpperCase()}`;
}

export default function CheckoutPage() {
  const dispatch = useDispatch<CartDispatch>();
  const navigate = useNavigate();
  const lines = useSelector((state: CartRootState) => selectSelectedLines(state));
  const totals = useSelector((state: CartRootState) => selectSelectedTotals(state));
  const lastOrder = useSelector((state: CartRootState) => state.order.lastOrder);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<CheckoutFormInput, unknown, CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: emptyCheckoutForm,
    mode: "onTouched",
  });

  // Checkout requires selected cart items. Right after placing an order the
  // cart is emptied, so continue to the confirmation instead.
  if (lines.length === 0) {
    return <Navigate to={lastOrder ? "/order-confirmation" : "/cart"} replace />;
  }

  const onSubmit = (values: CheckoutFormValues) => {
    const order: Order = {
      id: createOrderId(),
      createdAt: new Date().toISOString(),
      lines: lines.map((line) => ({
        productId: line.product.id,
        name: line.product.name,
        image: line.product.image,
        unitPrice: line.product.price,
        quantity: line.item.quantity,
        size: line.size,
        color: line.color,
      })),
      totals,
      customer: { fullName: values.fullName, email: values.email, city: values.city },
    };
    dispatch(orderPlaced(order));
    navigate("/order-confirmation", { replace: true });
  };

  const errorCount = Object.keys(errors).length;

  return (
    <PageShell>
      <main className="sx-page sx-checkout" id="main">
        <div className="sx-cart__head sx-checkout__head">
          <div className="sx-title">
            <span className="sx-title__icon"><MapPinIcon size={28} /></span>
            <div>
              <h1>Shipping <em>Details</em></h1>
              <p>Where should we send your sneakers?</p>
            </div>
          </div>
          <CheckoutStepper current={1} />
        </div>

        <form className="sx-panel sx-form" onSubmit={handleSubmit(onSubmit)} noValidate aria-describedby="sx-form-note">
          {submitCount > 0 && errorCount > 0 && (
            <div className="sx-form__alert" role="alert">
              Please fix {errorCount} {errorCount === 1 ? "field" : "fields"} below before placing your order.
            </div>
          )}
          <fieldset>
            <legend>Contact &amp; delivery</legend>
            <div className="sx-form__grid">
              {fields.map((field) => {
                const error = errors[field.name]?.message;
                const errorId = `${field.name}-error`;
                return (
                  <div className={`sx-field${field.wide ? " sx-field--wide" : ""}${error ? " has-error" : ""}`} key={field.name}>
                    <label htmlFor={field.name}>
                      {field.label}
                      {field.optional && <span className="sx-field__optional"> (optional)</span>}
                    </label>
                    <input
                      id={field.name}
                      type={field.type ?? "text"}
                      autoComplete={field.autoComplete}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? errorId : undefined}
                      aria-required={!field.optional}
                      {...register(field.name)}
                    />
                    {error && (
                      <p className="sx-field__error" id={errorId}>
                        {error}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend>Payment</legend>
            <p className="sx-form__payment" id="sx-form-note">
              <LockIcon size={18} />
              This is a demo store: no payment details are collected and no card is charged. Placing the order creates a
              simulated confirmation only.
            </p>
          </fieldset>
          <div className="sx-form__actions">
            <Link className="sx-ghost" to="/cart"><ArrowLeftIcon size={18} /> <span>Back to cart</span></Link>
            <button type="submit" className="sx-cta" disabled={isSubmitting}>
              <span>Place order · {formatMoney(totals.total)}</span>
              <ArrowRightIcon size={18} />
            </button>
          </div>
        </form>

        <aside className="sx-panel sx-mini-summary" aria-labelledby="sx-mini-title">
          <h2 id="sx-mini-title">Order Summary</h2>
          <ul>
            {lines.map((line) => (
              <li key={line.product.id}>
                <img src={line.product.image} alt="" />
                <span>
                  <strong>{line.product.name}</strong>
                  <small>Size {line.size} · {line.color} · Qty {line.item.quantity}</small>
                </span>
                <b>{formatMoney(line.lineTotal)}</b>
              </li>
            ))}
          </ul>
          <dl>
            <div><dt>Subtotal</dt><dd>{formatMoney(totals.subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd className={totals.shipping === 0 ? "is-free" : ""}>{totals.shipping === 0 ? "Free" : formatMoney(totals.shipping)}</dd></div>
            <div className="is-total"><dt>Total</dt><dd>{formatMoney(totals.total)}</dd></div>
          </dl>
        </aside>
      </main>
    </PageShell>
  );
}
