/**
 * SECTION A — Shared mock catalog. Replace with real store photos/data when available.
 * No backend or API is required for this assignment.
 */
export type Gender = 'Men' | 'Women' | 'Unisex';
export type Category = 'Lifestyle' | 'Running' | 'Basketball' | 'Training';

export interface Product {
  id: string;
  name: string;
  price: number;
  gender: Gender;
  category: Category;
  color: string;
  badge?: string;
  image: string;
  artFilter?: string;
  artScale?: string;
  background: string;
  description: string;
}

export const products: Product[] = [
  { id: 'flame-01', name: 'SoleX Flame 01', price: 149, gender: 'Men', category: 'Basketball', color: 'Blaze / Onyx', badge: 'BESTSELLER', image: '/assets/sneaker-fire.png', background: 'lava', description: 'A statement high-top built for bold everyday moves.' },
  { id: 'blush-02', name: 'SoleX Blush Motion', price: 139, gender: 'Women', category: 'Lifestyle', color: 'Rose / Coral', badge: 'NEW DROP', image: '/assets/sneaker-pink.png', background: 'blush', description: 'Soft color and sculpted comfort in perfect balance.' },
  { id: 'shadow-03', name: 'SoleX Shadow High', price: 179, gender: 'Men', category: 'Basketball', color: 'Midnight / Silver', image: '/assets/sneaker-fire.png', artFilter: 'hue-rotate(175deg) saturate(.65) brightness(1.18)', background: 'slate', description: 'Court-ready structure with a modern streetwear edge.' },
  { id: 'velocity-04', name: 'SoleX Velocity', price: 129, gender: 'Women', category: 'Running', color: 'Lavender / Ice', badge: 'POPULAR', image: '/assets/sneaker-pink.png', artFilter: 'hue-rotate(65deg) saturate(.78)', background: 'lilac', description: 'Cushioning designed to turn long days into light steps.' },
  { id: 'ember-05', name: 'SoleX Ember X', price: 165, gender: 'Men', category: 'Training', color: 'Orange / Carbon', image: '/assets/sneaker-fire.png', artFilter: 'hue-rotate(25deg) saturate(1.25)', background: 'sand', description: 'A durable everyday trainer with energetic styling.' },
  { id: 'rosewave-06', name: 'SoleX Rosewave', price: 145, gender: 'Women', category: 'Running', color: 'Peach / Bloom', image: '/assets/sneaker-pink.png', artFilter: 'hue-rotate(335deg) saturate(1.25)', background: 'peach', description: 'Made for easy motion and all-day confidence.' },
  { id: 'nightfall-07', name: 'SoleX Nightfall', price: 155, gender: 'Unisex', category: 'Lifestyle', color: 'Indigo / Black', image: '/assets/sneaker-fire.png', artFilter: 'hue-rotate(225deg) saturate(.7)', background: 'blue', description: 'A versatile silhouette with a midnight-inspired finish.' },
  { id: 'citrus-08', name: 'SoleX Citrus Pop', price: 135, gender: 'Unisex', category: 'Lifestyle', color: 'Sunset / Tangerine', badge: 'LIMITED', image: '/assets/sneaker-pink.png', artFilter: 'hue-rotate(305deg) saturate(1.4)', background: 'lime', description: 'A playful everyday sneaker with big personality.' },
];

export function getProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
}
