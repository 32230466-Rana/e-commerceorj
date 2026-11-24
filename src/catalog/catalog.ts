/**
 * Shared SoleX catalog.
 *
 * Every developer keeps their own original product data file:
 *   - Developer C (cart):     src/features/cart/demoSneakers.ts   ids "1".."3" (numbers in the original data)
 *   - Developer B (products): src/seed/productsSeed.ts            ids "kxn-01".."kxn-08"
 *   - Section A (home):       src/data/products.ts                ids "flame-01".."citrus-08"
 *
 * This module only adapts them into one lookup so any product shown anywhere
 * (Home, Products, Wishlist, Cart) can go into the same Redux cart and wishlist.
 * IDs, names, prices and images are taken unchanged from the source files.
 * Size/colour variants exist only where the source data defines them.
 */
import { demoSneakers } from '../features/cart/demoSneakers';
import { initialProductsSeed } from '../seed/productsSeed';
import { products as sectionAProducts } from '../data/products';
import type { Product as DevBProduct } from '../types/product';

export type CatalogSource = 'cart' | 'products' | 'home';

export interface CatalogColor {
  name: string;
  hex: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  /** Short descriptor shown under the name (e.g. "Men's Sneakers"). */
  type: string;
  price: number;
  image: string;
  spotlightImage?: string;
  /** CSS filter Section A uses to recolour shared product art. */
  imageFilter?: string;
  /** Selectable sizes; empty when the source data defines none. */
  sizes: number[];
  /** Selectable colours; empty when the source data defines none. */
  colors: CatalogColor[];
  /** Fixed colourway label when there is no colour choice. */
  colorway?: string;
  source: CatalogSource;
}

/** Developer C ids were numbers; the shared catalog uses their string form. */
export const cartProductId = (id: number) => String(id);

const cartCollection: CatalogProduct[] = demoSneakers.map((sneaker) => ({
  id: cartProductId(sneaker.id),
  name: sneaker.name,
  type: sneaker.type,
  price: sneaker.price,
  image: sneaker.image,
  spotlightImage: sneaker.spotlightImage,
  sizes: sneaker.sizes,
  colors: sneaker.colors,
  source: 'cart',
}));

const productsCollection: CatalogProduct[] = initialProductsSeed.map((product) => ({
  id: product.id,
  name: product.name,
  type: product.category,
  price: product.price,
  image: product.imageUrl,
  sizes: [],
  colors: [],
  source: 'products',
}));

const homeCollection: CatalogProduct[] = sectionAProducts.map((product) => ({
  id: product.id,
  name: product.name,
  type: `${product.gender} / ${product.category}`,
  price: product.price,
  image: product.image,
  imageFilter: product.artFilter,
  sizes: [],
  colors: [],
  colorway: product.color,
  source: 'home',
}));

export const catalog: CatalogProduct[] = [...cartCollection, ...productsCollection, ...homeCollection];

const byId = new Map(catalog.map((product) => [product.id, product]));

export function getCatalogProduct(id: string): CatalogProduct | undefined {
  return byId.get(id);
}

/** Developer C's original three sneakers (cart showcase + recommendations). */
export const cartShowcaseProducts: CatalogProduct[] = cartCollection;

export function isSupportedSize(product: CatalogProduct, size: number): boolean {
  return product.sizes.includes(size);
}

export function isSupportedColor(product: CatalogProduct, color: string): boolean {
  return product.colors.some((option) => option.name === color);
}

/** Shape Developer B's cards and wishlist drawer expect. */
export function toDevBProduct(product: CatalogProduct): DevBProduct {
  return { id: product.id, name: product.name, price: product.price, category: product.type, imageUrl: product.image };
}
