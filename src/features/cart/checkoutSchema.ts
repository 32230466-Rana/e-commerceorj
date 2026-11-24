import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "Name must be 80 characters or fewer."),
  email: z.string().trim().min(1, "Enter your email address.").pipe(z.email("Enter a valid email address.")),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s-]{6,18}$/, "Enter a valid phone number (digits, spaces or dashes)."),
  address: z
    .string()
    .trim()
    .min(5, "Enter your street address.")
    .max(120, "Address must be 120 characters or fewer."),
  city: z.string().trim().min(2, "Enter your city.").max(60, "City must be 60 characters or fewer."),
  postalCode: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9 -]{0,10}$/, "Postal code can contain letters, numbers, spaces or dashes."),
});

export type CheckoutFormInput = z.input<typeof checkoutSchema>;
export type CheckoutFormValues = z.output<typeof checkoutSchema>;

export const emptyCheckoutForm: CheckoutFormInput = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
};
