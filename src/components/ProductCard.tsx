import type { FC } from 'react';
import type { Product } from '../types/product';
import '../styles/ProductCard.css';

interface ProductCardProps {
  product: Product;
  isInWishlist?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  isInWishlist = false,
  onToggleWishlist,
}) => {
  const handleWishlistClick = () => {
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  return (
    <article className="product-card">
      <div className="product-card-image-wrapper">
        <span className="product-card-category-badge">{product.category}</span>
        <button
          type="button"
          className={`product-card-wishlist-btn ${
            isInWishlist ? 'product-card-wishlist-btn-active' : ''
          }`}
          onClick={handleWishlistClick}
          aria-label={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <svg
            className="product-card-wishlist-icon"
            viewBox="0 0 24 24"
            fill={isInWishlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />
      </div>

      <div className="product-card-body">
        <h3 className="product-card-title">{product.name}</h3>

        <div className="product-card-footer">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          <button
            type="button"
            className="product-card-add-cart-btn"
            aria-label="Add to Cart"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
};
