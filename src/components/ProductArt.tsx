import type { Product } from '../data/products';

export default function ProductArt({ product, className = '' }: { product: Product; className?: string }) {
  return <div className={`product-art ${product.background} ${className}`}>
    <span className="art-orbit" aria-hidden="true" />
    <img src={product.image} alt={product.name} style={{ filter: product.artFilter }} loading="lazy" />
    <span className="art-word" aria-hidden="true">SOLEX</span>
  </div>;
}
