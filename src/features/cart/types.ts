export interface CartItem {
  /** Shared catalog id (src/catalog/catalog.ts). */
  productId: string;
  quantity: number;
  /** Selected size; must be one of the product's supported sizes. */
  size?: number;
  /** Selected color name; must be one of the product's supported colors. */
  color?: string;
  /** Whether the line is included in checkout. Defaults to true. */
  selected?: boolean;
}

export interface CartState {
  items: CartItem[];
}

export interface OrderLine {
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  /** Present only for products that have size/colour variants. */
  size?: number;
  color?: string;
}

export interface OrderTotals {
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

export interface OrderCustomer {
  fullName: string;
  email: string;
  city: string;
}

export interface Order {
  id: string;
  createdAt: string;
  lines: OrderLine[];
  totals: OrderTotals;
  customer: OrderCustomer;
}
