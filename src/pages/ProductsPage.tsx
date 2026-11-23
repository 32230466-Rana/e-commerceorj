import { useState, useMemo } from 'react';
import type { FC } from 'react';
import type { Product, SortOrder } from '../types/product';
import { initialProductsSeed } from '../seed/productsSeed';
import { ProductFilters } from '../components/ProductFilters';
import { ProductGrid } from '../components/ProductGrid';
import '../styles/ProductsPage.css';

export const ProductsPage: FC = () => {
  const [products] = useState<Product[]>(initialProductsSeed);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');

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
      </header>

      {/* Main Content */}
      <main className="products-page-main">
        {/* Redesigned Hero Header */}
        <section className="products-hero-section">
          <div className="products-hero-tag-row">
            <span className="products-hero-pill">DROP 01 // SS26</span>
          </div>

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

        {/* Redesigned Toolbar & Filters */}
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
        <ProductGrid products={filteredProducts} />
      </main>
    </div>
  );
};
