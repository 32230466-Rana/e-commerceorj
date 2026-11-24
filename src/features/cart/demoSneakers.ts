export interface SneakerColor {
  name: string;
  hex: string;
}

export interface SneakerProduct {
  id: number;
  name: string;
  type: string;
  price: number;
  image: string;
  spotlightImage?: string;
  sizes: number[];
  colors: SneakerColor[];
}

/**
 * Local product catalog used by the cart until the shared product data
 * (Developer A) is wired in. Only the variants listed here are selectable.
 */
export const demoSneakers: SneakerProduct[] = [
  {
    id: 1,
    name: "Nike Air Jordan 1",
    type: "Men's Sneakers",
    price: 179.99,
    image: "/shoes/jordan.png",
    spotlightImage: "/shoes/jordan-hero.png",
    sizes: [40, 41, 42, 43, 44],
    colors: [
      { name: "Red", hex: "#e3122c" },
      { name: "Black", hex: "#141418" },
      { name: "White", hex: "#f4f4f6" },
    ],
  },
  {
    id: 2,
    name: "Adidas Samba OG",
    type: "Unisex Sneakers",
    price: 99.99,
    image: "/shoes/samba.png",
    sizes: [39, 40, 41, 42, 43],
    colors: [
      { name: "White", hex: "#f4f4f6" },
      { name: "Black", hex: "#141418" },
      { name: "Navy", hex: "#1f3d7a" },
    ],
  },
  {
    id: 3,
    name: "Nike Air Max 270",
    type: "Men's Running",
    price: 149.99,
    image: "/shoes/airmax.png",
    sizes: [41, 42, 43, 44, 45],
    colors: [
      { name: "Black", hex: "#141418" },
      { name: "Grey", hex: "#9b9da4" },
      { name: "Navy", hex: "#1f3d7a" },
    ],
  },
];

export function getSneakerById(id: number): SneakerProduct | undefined {
  return demoSneakers.find((sneaker) => sneaker.id === id);
}

export function isSupportedSize(product: SneakerProduct, size: number): boolean {
  return product.sizes.includes(size);
}

export function isSupportedColor(product: SneakerProduct, color: string): boolean {
  return product.colors.some((option) => option.name === color);
}
