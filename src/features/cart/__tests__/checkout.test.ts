import { describe, expect, it } from "vitest";
import { checkoutSchema, emptyCheckoutForm } from "../schemas/checkoutSchema";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING, formatMoney, roundMoney, shippingFor } from "../utils/pricing";
import { selectSelectedTotals } from "../store/cartSelectors";

const valid = {
  fullName: "Alex Morgan",
  email: "alex@example.com",
  phone: "+961 70 123 456",
  address: "12 Hamra Street",
  city: "Beirut",
  postalCode: "",
};

const errorsFor = (input: Record<string, string>) => {
  const result = checkoutSchema.safeParse(input);
  if (result.success) return {};
  // The form shows the first message per field (react-hook-form's default), so keep the first one.
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) errors[String(issue.path[0])] ??= issue.message;
  return errors;
};

describe("checkout calculations", () => {
  it("keeps Developer C's shipping rule: $8 below $100, free from $100", () => {
    expect(FREE_SHIPPING_THRESHOLD).toBe(100);
    expect(STANDARD_SHIPPING).toBe(8);
    expect(shippingFor(0)).toBe(0);
    expect(shippingFor(99.99)).toBe(8);
    expect(shippingFor(100)).toBe(0);
    expect(shippingFor(572.99)).toBe(0);
  });

  it("rounds and formats money", () => {
    expect(roundMoney(0.1 + 0.2)).toBe(0.3);
    expect(roundMoney(179.99 * 3)).toBe(539.97);
    expect(formatMoney(1234.5)).toBe("$1,234.50");
  });

  it("totals selected lines across all three catalogs", () => {
    const totals = selectSelectedTotals({
      cart: {
        items: [
          { productId: "1", quantity: 1, size: 42, color: "Red", selected: true },
          { productId: "kxn-03", quantity: 1, selected: true },
          { productId: "flame-01", quantity: 2, selected: true },
          { productId: "kxn-04", quantity: 1, selected: false },
        ],
      },
    });
    expect(totals).toEqual({ itemCount: 4, subtotal: 572.99, shipping: 0, total: 572.99 });
  });

  it("charges shipping for a small order and nothing for an empty selection", () => {
    expect(selectSelectedTotals({ cart: { items: [{ productId: "kxn-03", quantity: 1 }] } })).toEqual({
      itemCount: 1, subtotal: 95, shipping: 8, total: 103,
    });
    expect(selectSelectedTotals({ cart: { items: [{ productId: "kxn-03", quantity: 1, selected: false }] } })).toEqual({
      itemCount: 0, subtotal: 0, shipping: 0, total: 0,
    });
  });
});

describe("checkout validation", () => {
  it("accepts a valid form and trims values", () => {
    const result = checkoutSchema.safeParse({ ...valid, fullName: "  Alex Morgan  ", postalCode: "1103 2090" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.fullName).toBe("Alex Morgan");
  });

  it("reports every required field on an empty form", () => {
    expect(errorsFor(emptyCheckoutForm)).toEqual({
      fullName: "Enter your full name.",
      email: "Enter your email address.",
      phone: "Enter a valid phone number (digits, spaces or dashes).",
      address: "Enter your street address.",
      city: "Enter your city.",
    });
  });

  it("rejects malformed values", () => {
    expect(errorsFor({ ...valid, email: "not-an-email" })).toEqual({ email: "Enter a valid email address." });
    expect(Object.keys(errorsFor({ ...valid, phone: "abc" }))).toEqual(["phone"]);
    expect(Object.keys(errorsFor({ ...valid, phone: "12" }))).toEqual(["phone"]);
    expect(Object.keys(errorsFor({ ...valid, postalCode: "<script>" }))).toEqual(["postalCode"]);
    expect(errorsFor({ ...valid, fullName: "A" })).toEqual({ fullName: "Enter your full name." });
    expect(errorsFor({ ...valid, fullName: "x".repeat(81) })).toEqual({ fullName: "Name must be 80 characters or fewer." });
    expect(errorsFor({ ...valid, address: "x".repeat(121) })).toEqual({ address: "Address must be 120 characters or fewer." });
    expect(errorsFor({ ...valid, city: "B" })).toEqual({ city: "Enter your city." });
  });
});
