import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Product, ProductColor } from '../types/product';
import '../styles/ProductModal.css';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isInWishlist?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

const DEFAULT_SIZES = [38, 39, 40, 41, 42, 43, 44, 45];
const DEFAULT_COLORS: ProductColor[] = [
  { name: 'Obsidian Black', className: 'swatch-black' },
  { name: 'Kixon Magenta', className: 'swatch-magenta' },
  { name: 'Ghost White', className: 'swatch-white' },
];

export const ProductModal: FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  isInWishlist = false,
  onToggleWishlist,
}) => {
  const availableColors = product?.colors && product.colors.length > 0 ? product.colors : DEFAULT_COLORS;
  const availableSizes = product?.sizes && product.sizes.length > 0 ? product.sizes : DEFAULT_SIZES;

  const [selectedColor, setSelectedColor] = useState<string>(availableColors[0].name);
  const [selectedSize, setSelectedSize] = useState<number>(availableSizes[0]);

  // Reset selections when a new product is opened
  useEffect(() => {
    if (product) {
      const colors = product.colors && product.colors.length > 0 ? product.colors : DEFAULT_COLORS;
      const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : DEFAULT_SIZES;
      setSelectedColor(colors[0].name);
      setSelectedSize(sizes[0]);
    }
  }, [product]);

  if (!product || !isOpen) {
    return null;
  }

  const handleWishlistClick = () => {
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  return (
    <div
      className="product-modal-overlay product-modal-overlay-open"
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div
        className="product-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} details`}
      >
        <button
          type="button"
          className="product-modal-close-btn"
          onClick={onClose}
          aria-label="Close product details"
        >
          ✕
        </button>

        {/* Media / Image Side */}
        <div className="product-modal-media">
          <span className="product-modal-badge">{product.category}</span>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-modal-img"
          />
        </div>

        {/* Info & Options Side */}
        <div className="product-modal-info">
          <h2 className="product-modal-title">{product.name}</h2>
          <div className="product-modal-price">${product.price.toFixed(2)}</div>

          {/* Color Selection */}
          <div className="product-modal-section">
            <div className="product-modal-section-header">
              <span className="product-modal-label">Color</span>
              <span className="product-modal-selected-value">{selectedColor}</span>
            </div>
            <div className="product-modal-color-group">
              {availableColors.map((color) => {
                const isSelected = selectedColor === color.name;
                return (
                  <button
                    key={color.name}
                    type="button"
                    className={`product-modal-color-btn ${
                      isSelected ? 'product-modal-color-btn-active' : ''
                    }`}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                    aria-label={`Select color ${color.name}`}
                  >
                    <span className={`product-modal-color-swatch ${color.className}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* European Size Selection */}
          <div className="product-modal-section">
            <div className="product-modal-section-header">
              <span className="product-modal-label">European Size (EU)</span>
              <span className="product-modal-selected-value">EU {selectedSize}</span>
            </div>
            <div className="product-modal-size-grid">
              {availableSizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    className={`product-modal-size-btn ${
                      isSelected ? 'product-modal-size-btn-active' : ''
                    }`}
                    onClick={() => setSelectedSize(size)}
                    aria-label={`Select size EU ${size}`}
                  >
                    EU {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions: Add to Cart placeholder & Wishlist */}
          <div className="product-modal-actions">
            <button
              type="button"
              className="product-modal-add-cart-btn"
              aria-label="Add to cart placeholder"
            >
              Add to Cart • EU {selectedSize}
            </button>

            <button
              type="button"
              className={`product-modal-wishlist-toggle ${
                isInWishlist ? 'product-modal-wishlist-toggle-active' : ''
              }`}
              onClick={handleWishlistClick}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <svg
                width="20"
                height="20"
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
          </div>
        </div>
      </div>
    </div>
  );
};
