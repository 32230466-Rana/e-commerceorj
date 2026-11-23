import { useState, useMemo, useEffect } from 'react';
import type { FC } from 'react';
import type { Product, SortOrder } from '../types/product';
import { initialProductsSeed } from '../seed/productsSeed';
import { ProductFilters } from '../components/ProductFilters';
import { ProductGrid } from '../components/ProductGrid';
import { WishlistDrawer } from '../components/WishlistDrawer';
import '../styles/ProductsPage.css';

const WISHLIST_STORAGE_KEY = 'kixon_wishlist';

export const ProductsPage: FC = () => {
  const [products] = useState<Product[]>(initialProductsSeed);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);

  // Persist Wishlist in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // Ignore storage write issues
    }
  }, [wishlist]);

  const wishlistIds = useMemo(() => {
    return wishlist.map((item) => item.id);
  }, [wishlist]);

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearWishlist = () => {
    setWishlist([]);
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
      {/* KIXON Header */}
      <header className="kixon-header">
        <div className="kixon-logo">
          KIX<span className="kixon-logo-accent">ON</span>
        </div>

        <nav className="kixon-nav">
          <span className="kixon-nav-link">Home</span>
          <span className="kixon-nav-link">About</span>
          <span className="kixon-nav-link kixon-nav-link-active">Products</span>
          <span className="kixon-nav-link">Contact</span>
        </nav>

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
            <h1 className="products-hero-title">Move Bold</h1>
            <div className="products-hero-meta">
              <span className="products-hero-count">{filteredProducts.length}</span>
              <span>/ {products.length} Items</span>
            </div>
          </div>

          <p className="products-hero-desc">
            KIXON isn't just a sneaker brand — it's a lifestyle built for the fearless. Designed for creators, dreamers, and doers, our shoes fuse performance tech with urban aesthetics.
          </p>
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
    </div>
  );
};
