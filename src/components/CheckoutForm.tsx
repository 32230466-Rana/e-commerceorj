import { useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { checkoutFields, checkoutSchema, EMPTY_CHECKOUT, type CheckoutDetails, type CheckoutField } from '../lib/checkout';

/** UI-level validation: error text appears next to each invalid field. */
export default function CheckoutForm({ onValidSubmit }: { onValidSubmit: (data: CheckoutDetails) => void }) {
  const [details, setDetails] = useState<CheckoutDetails>(EMPTY_CHECKOUT);
  const [errors, setErrors] = useState<Partial<Record<CheckoutField, string>>>({});
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = checkoutSchema.safeParse(details);
    if (!parsed.success) {
      const next: Partial<Record<CheckoutField, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as CheckoutField;
        if (!next[field]) next[field] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    onValidSubmit(parsed.data);
  };
  return <form onSubmit={submit} noValidate className="checkout-form"><div className="checkout-form-heading"><span className="eyebrow">01 / DELIVERY DETAILS</span><h2>WHERE TO?</h2><p>Enter your delivery information. This is a simulated checkout.</p></div><div className="checkout-fields">
    {checkoutFields.map((field) => <div key={field.key} className={`form-field field-${field.key}`}><label htmlFor={field.key}>{field.label}</label><input id={field.key} name={field.key} type={field.type || 'text'} autoComplete={field.key === 'email' ? 'email' : field.key === 'fullName' ? 'name' : field.key === 'phone' ? 'tel' : 'on'} placeholder={field.placeholder} value={details[field.key]} aria-invalid={Boolean(errors[field.key])} aria-describedby={errors[field.key] ? `${field.key}-error` : undefined} onChange={(e) => {setDetails((current) => ({ ...current, [field.key]: e.target.value }));if (errors[field.key]) setErrors((current) => ({ ...current, [field.key]: undefined }));}}/>{errors[field.key] && <span role="alert" className="field-error" id={`${field.key}-error`}>{errors[field.key]}</span>}</div>)}
  </div><div className="payment-info"><span className="eyebrow">02 / PAYMENT METHOD</span><div className="demo-payment"><div className="selected-radio"/><div><strong>Simulated checkout</strong><p>No card details or real payment required.</p></div></div></div><button type="submit" className="btn btn-primary btn-full">Place demo order <ArrowRight size={19}/></button></form>;
}
