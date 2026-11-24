import type { FC } from 'react';
import type { Product } from '../types/product';
import '../styles/WishlistDrawer.css';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onClearWishlist: () => void;
}

export const WishlistDrawer: FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onClearWishlist,
}) => {
  return (
    <div
      className={`wishlist-overlay ${isOpen ? 'wishlist-overlay-open' : ''}`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <aside
        className="wishlist-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Wishlist drawer"
      >
        {/* Header */}
        <div className="wishlist-drawer-header">
          <div className="wishlist-drawer-title-group">
            <h2 className="wishlist-drawer-title">Wishlist</h2>
            <span className="wishlist-drawer-count-badge">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            type="button"
            className="wishlist-drawer-close-btn"
            onClick={onClose}
            aria-label="Close wishlist drawer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="wishlist-drawer-content">
          {wishlist.length === 0 ? (
            <div className="wishlist-empty-state">
              <svg
                className="wishlist-empty-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <h3 className="wishlist-empty-title">Your wishlist is empty</h3>
              <p className="wishlist-empty-desc">
                Save your favorite sneakers so you never lose track of them.
              </p>
              <button
                type="button"
                className="wishlist-explore-btn"
                onClick={onClose}
              >
                Explore Sneakers
              </button>
            </div>
          ) : (
            <div className="wishlist-items-list">
              {wishlist.map((item) => (
                <div key={item.id} className="wishlist-item-card">
                  <div className="wishlist-item-image-wrapper">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="wishlist-item-img"
                      loading="lazy"
                    />
                  </div>

                  <div className="wishlist-item-details">
                    <div>
                      <span className="wishlist-item-category">{item.category}</span>
                      <h4 className="wishlist-item-name">{item.name}</h4>
                    </div>

                    <div className="wishlist-item-bottom-row">
                      <span className="wishlist-item-price">
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        className="wishlist-item-cart-placeholder"
                        aria-label="Add to cart placeholder"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="wishlist-item-remove-btn"
                    onClick={() => onRemoveFromWishlist(item.id)}
                    aria-label={`Remove ${item.name} from wishlist`}
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="wishlist-drawer-footer">
            <span className="wishlist-total-indicator">
              Total items: {wishlist.length}
            </span>
            <button
              type="button"
              className="wishlist-clear-all-btn"
              onClick={onClearWishlist}
            >
              Clear All
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
