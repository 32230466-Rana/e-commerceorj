import { useCallback, useState, useMemo } from 'react';
import type { FC } from 'react';
import type { Product, SortOrder } from '../types/product';
import { initialProductsSeed } from '../seed/productsSeed';
import { ProductFilters } from '../components/ProductFilters';
import { ProductGrid } from '../components/ProductGrid';
import { WishlistDrawer } from '../components/WishlistDrawer';
import { useDispatch, useSelector } from 'react-redux';
import type { CartDispatch, CartRootState } from '../features/cart/cartStore';
import { addItem } from '../features/cart/cartSlice';
import { selectCartCount } from '../features/cart/cartSelectors';
import { AddedToCartToast, type AddedToCartEvent } from '../components/AddedToCartToast';
import { clearWishlist, removeFromWishlist, selectWishlistIds, toggleWishlist } from '../features/wishlist/wishlistSlice';
import { getCatalogProduct, toDevBProduct } from '../catalog/catalog';
import '../styles/ProductsPage.css';

export const ProductsPage: FC = () => {
  const [products] = useState<Product[]>(initialProductsSeed);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');

  // Wishlist State — shared Redux wishlist (also used by the Navbar, Home and Wishlist page).
  // Saved 'kixon_wishlist' data from this branch is imported once by wishlistStorage.ts.
  const dispatch = useDispatch<CartDispatch>();
  const wishlistIds = useSelector((state: CartRootState) => selectWishlistIds(state));
  const wishlist = useMemo<Product[]>(
    () => wishlistIds.flatMap((id) => {
      const product = getCatalogProduct(id);
      return product ? [toDevBProduct(product)] : [];
    }),
    [wishlistIds]
  );

  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const handleToggleWishlist = (product: Product) => {
    dispatch(toggleWishlist(product.id));
  };

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
  };

  const cartCount = useSelector((state: CartRootState) => selectCartCount(state));
  const [addedEvent, setAddedEvent] = useState<AddedToCartEvent | null>(null);
  const closeAddedToast = useCallback(() => setAddedEvent(null), []);

  const handleAddToCart = (product: Product, photoRect: DOMRect | null) => {
    dispatch(addItem({ productId: product.id }));
    setAddedEvent((previous) => ({ key: (previous?.key ?? 0) + 1, product, from: photoRect }));
  };

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return unique.sort();
  }, [products]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSortOrder('none');
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search by name
        if (
          searchTerm.trim() !== '' &&
          !product.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
        ) {
          return false;
        }

        // Filter by category
        if (selectedCategory !== 'All' && product.category !== selectedCategory) {
          return false;
        }

        // Filter by price range
        const min = minPrice !== '' ? parseFloat(minPrice) : null;
        const max = maxPrice !== '' ? parseFloat(maxPrice) : null;

        if (min !== null && !isNaN(min) && product.price < min) {
          return false;
        }
        if (max !== null && !isNaN(max) && product.price > max) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by price
        if (sortOrder === 'price-asc') {
          return a.price - b.price;
        }
        if (sortOrder === 'price-desc') {
          return b.price - a.price;
        }
        return 0;
      });
  }, [products, searchTerm, selectedCategory, minPrice, maxPrice, sortOrder]);

  return (
    <div className="products-page-container">
      {/* Developer B toolbar (sticky). The site-wide Navbar (Section A) now provides the logo,
          page links and mobile menu, so they are not repeated here. */}
      <header className="kixon-header kixon-header--toolbar">
        <div className="kixon-header-actions">
          <button
            type="button"
            className="kixon-wishlist-nav-btn"
            onClick={() => setIsWishlistOpen(true)}
            aria-label={`Open wishlist, ${wishlist.length} items`}
          >
            <svg
              className="kixon-wishlist-nav-icon"
              viewBox="0 0 24 24"
              fill={wishlist.length > 0 ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span>Wishlist</span>
            {wishlist.length > 0 && (
              <span className="kixon-wishlist-badge">{wishlist.length}</span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="products-page-main">
        {/* Hero Header */}
        <section className="products-hero-section">
          <div className="products-hero-heading-row">
            <h1 className="products-hero-title">
              Move <span className="products-hero-title-accent">Bold</span>
            </h1>
            <div className="products-hero-meta">
              <span className="products-hero-count">{filteredProducts.length}</span>
              <span>/ {products.length} Items</span>
            </div>
          </div>
        </section>

        {/* Toolbar & Filters */}
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          onResetFilters={handleResetFilters}
        />

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
        />
      </main>

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onClearWishlist={handleClearWishlist}
      />

      {/* Integration: "Added to cart" confirmation with the photo flying into it. */}
      <AddedToCartToast event={addedEvent} cartCount={cartCount} onClose={closeAddedToast} />

      {/* Mobile navigation is provided by the site-wide Navbar (MobileNavDrawer kept in src/components). */}
    </div>
  );
};
