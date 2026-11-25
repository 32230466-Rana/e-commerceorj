import { describe, expect, it } from "vitest";
import { demoSneakers } from "../../features/cart/data/demoSneakers";
import { initialProductsSeed } from "../../seed/productsSeed";
import { products as sectionAProducts } from "../../data/products";
import { catalog, getCatalogProduct, toDevBProduct } from "../catalog";

describe("shared catalog", () => {
  it("contains every developer's products with unique ids", () => {
    expect(catalog).toHaveLength(demoSneakers.length + initialProductsSeed.length + sectionAProducts.length);
    expect(new Set(catalog.map((product) => product.id)).size).toBe(catalog.length);
  });

  it("keeps original names, prices, images and variants", () => {
    for (const sneaker of demoSneakers) {
      expect(getCatalogProduct(String(sneaker.id))).toMatchObject({
        name: sneaker.name,
        price: sneaker.price,
        image: sneaker.image,
        sizes: sneaker.sizes,
        colors: sneaker.colors,
      });
    }
    for (const product of initialProductsSeed) {
      expect(getCatalogProduct(product.id)).toMatchObject({ name: product.name, price: product.price, image: product.imageUrl, sizes: [] });
      expect(toDevBProduct(getCatalogProduct(product.id)!)).toEqual(product);
    }
    for (const product of sectionAProducts) {
      expect(getCatalogProduct(product.id)).toMatchObject({ name: product.name, price: product.price, image: product.image, imageFilter: product.artFilter, colorway: product.color });
    }
  });
});

describe("cart-stage backdrop removal", () => {
  it("is only configured for Developer B photos", () => {
    const withBackdrop = catalog.filter((product) => product.backdrop);
    expect(withBackdrop.map((product) => product.id)).toEqual(["kxn-01", "kxn-03", "kxn-06"]);
    expect(withBackdrop.every((product) => product.source === "products")).toBe(true);
  });
});
