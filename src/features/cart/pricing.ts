/** Orders at or above this subtotal ship free (matches the "Free Shipping — Orders over $100" promise). */
export const FREE_SHIPPING_THRESHOLD = 100;
/** Flat rate below the threshold. Change here if the store's shipping policy changes. */
export const STANDARD_SHIPPING = 8;

export function shippingFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
}

export const roundMoney = (value: number) => Math.round(value * 100) / 100;

export const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
