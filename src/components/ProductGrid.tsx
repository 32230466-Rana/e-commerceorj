import type { FC } from 'react';
import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';
import '../styles/ProductGrid.css';

interface ProductGridProps {
  products: Product[];
  wishlistIds?: string[];
  onToggleWishlist?: (product: Product) => void;
}

export const ProductGrid: FC<ProductGridProps> = ({
  products,
  wishlistIds = [],
  onToggleWishlist,
}) => {
  if (products.length === 0) {
    return (
      <div className="no-results-container">
        <svg
          className="no-results-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
        <h3 className="no-results-title">No products found</h3>
        <p className="no-results-message">
          We couldn't find any products matching your search or filters. Try adjusting your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isInWishlist={wishlistIds.includes(product.id)}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
};
