import { useEffect, useState } from 'react';
import type { CatalogProduct } from './catalog';
import { cachedCutout, cutoutPhoto } from './photoCutout';

export interface DisplayImage {
  /** Image to show; undefined while a cut-out is still being made. */
  src: string | undefined;
  /** True when the image has a transparent background (Developer C / Section A art, or a finished cut-out). */
  transparent: boolean;
}

/** Image for the cart stage and cart thumbnails: a cut-out where possible, otherwise the photo. */
export function displayImageNow(product: CatalogProduct): DisplayImage {
  if (product.source !== 'products') return { src: product.image, transparent: true };
  if (!product.backdrop) return { src: product.image, transparent: false };
  const done = cachedCutout(product.image);
  if (done === undefined) return { src: undefined, transparent: true };
  return { src: done, transparent: done !== product.image };
}

/** Resolves once the image returned by displayImageNow is final. */
export function loadDisplayImage(product: CatalogProduct): Promise<string> {
  return product.source === 'products' && product.backdrop
    ? cutoutPhoto(product.image, product.backdrop)
    : Promise.resolve(product.image);
}

export function useDisplayImage(product: CatalogProduct | undefined): DisplayImage {
  const [, setVersion] = useState(0);
  useEffect(() => {
    if (!product || product.source !== 'products' || !product.backdrop) return;
    if (cachedCutout(product.image) !== undefined) return;
    let active = true;
    void loadDisplayImage(product).then(() => {
      if (active) setVersion((v) => v + 1);
    });
    return () => {
      active = false;
    };
  }, [product]);
  return product ? displayImageNow(product) : { src: undefined, transparent: true };
}
