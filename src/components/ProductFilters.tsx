import type { FC, ChangeEvent } from 'react';
import type { SortOrder } from '../types/product';
import '../styles/ProductFilters.css';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  onResetFilters: () => void;
}

export const ProductFilters: FC<ProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  sortOrder,
  onSortChange,
  onResetFilters,
}) => {
  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleMinPriceInput = (e: ChangeEvent<HTMLInputElement>) => {
    onMinPriceChange(e.target.value);
  };

  const handleMaxPriceInput = (e: ChangeEvent<HTMLInputElement>) => {
    onMaxPriceChange(e.target.value);
  };

  const handleSortSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as SortOrder);
  };

  return (
    <div className="product-filters-container">
      <div className="filters-top-row">
        <div className="filter-search-wrapper">
          <svg
            className="filter-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search shoes by name..."
            value={searchTerm}
            onChange={handleSearchInput}
            aria-label="Search shoes by name"
          />
        </div>

        <div className="filter-sort-wrapper">
          <select
            className="filter-select"
            value={sortOrder}
            onChange={handleSortSelect}
            aria-label="Sort by price"
          >
            <option value="none">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="filters-bottom-row">
        <div className="category-filter-group">
          <button
            type="button"
            className={`category-chip ${selectedCategory === 'All' ? 'category-chip-active' : ''}`}
            onClick={() => onSelectCategory('All')}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-chip ${selectedCategory === category ? 'category-chip-active' : ''}`}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="price-range-group">
          <span className="price-range-label">Price Range:</span>
          <div className="price-input-wrapper">
            <span className="price-input-prefix">$</span>
            <input
              type="number"
              className="price-input"
              placeholder="Min"
              min="0"
              value={minPrice}
              onChange={handleMinPriceInput}
              aria-label="Minimum price"
            />
          </div>
          <span className="price-range-separator">-</span>
          <div className="price-input-wrapper">
            <span className="price-input-prefix">$</span>
            <input
              type="number"
              className="price-input"
              placeholder="Max"
              min="0"
              value={maxPrice}
              onChange={handleMaxPriceInput}
              aria-label="Maximum price"
            />
          </div>
          <button
            type="button"
            className="clear-filters-btn"
            onClick={onResetFilters}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
