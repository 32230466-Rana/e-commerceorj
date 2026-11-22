import { z } from 'zod';

/** Developer C — Zod validation shared by the checkout form and tests. */
export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  phone: z.string().trim().min(7, 'Please enter a valid phone number.').regex(/^[+\d\s()\-]+$/, 'Use a valid phone number.'),
  country: z.string().trim().min(2, 'Please enter your country.'),
  city: z.string().trim().min(2, 'Please enter your city.'),
  address: z.string().trim().min(5, 'Please enter your street address.'),
  postalCode: z.string().trim().optional(),
});
export type CheckoutDetails = z.infer<typeof checkoutSchema>;
export type CheckoutField = keyof CheckoutDetails;
export const EMPTY_CHECKOUT: CheckoutDetails = { fullName: '', email: '', phone: '', country: '', city: '', address: '', postalCode: '' };
export const checkoutFields: { key: CheckoutField; label: string; placeholder: string; type?: string; required?: boolean }[] = [
  { key: 'fullName', label: 'Full name', placeholder: 'Your first and last name', required: true },
  { key: 'email', label: 'Email address', placeholder: 'you@example.com', type: 'email', required: true },
  { key: 'phone', label: 'Phone number', placeholder: '+961 00 000 000', type: 'tel', required: true },
  { key: 'country', label: 'Country', placeholder: 'Lebanon', required: true },
  { key: 'city', label: 'City', placeholder: 'Your city', required: true },
  { key: 'address', label: 'Street address', placeholder: 'Street, building, floor', required: true },
  { key: 'postalCode', label: 'Postal code (optional)', placeholder: 'Postal code' },
];
