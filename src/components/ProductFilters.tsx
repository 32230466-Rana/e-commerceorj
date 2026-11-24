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

  const isFiltered =
    searchTerm !== '' ||
    selectedCategory !== 'All' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    sortOrder !== 'none';

  return (
    <div className="product-filters-toolbar">
      {/* Category Pills Bar */}
      <div className="filter-categories-bar">
        <button
          type="button"
          className={`category-tab-btn ${selectedCategory === 'All' ? 'category-tab-btn-active' : ''
            }`}
          onClick={() => onSelectCategory('All')}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`category-tab-btn ${selectedCategory === category ? 'category-tab-btn-active' : ''
              }`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Clean Unified Floating Controls Bar */}
      <div className="filter-controls-row">
        {/* Search */}
        <div className="filter-search-box">
          <svg
            className="filter-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="filter-search-input-field"
            placeholder="Search shoes by model or name..."
            value={searchTerm}
            onChange={handleSearchInput}
            aria-label="Search shoes by model or name"
          />
          {searchTerm && (
            <button
              type="button"
              className="filter-search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Secondary controls: Price range & Sort */}
        <div className="filter-actions-group">
          {/* Price Range */}
          <div className="filter-price-selector">
            <span className="filter-price-tag">Price</span>
            <input
              type="number"
              className="filter-price-input"
              placeholder="$0"
              min="0"
              value={minPrice}
              onChange={handleMinPriceInput}
              aria-label="Min price"
            />
            <span className="filter-price-divider">–</span>
            <input
              type="number"
              className="filter-price-input"
              placeholder="$999"
              min="0"
              value={maxPrice}
              onChange={handleMaxPriceInput}
              aria-label="Max price"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="filter-sort-dropdown-wrapper">
            <select
              className="filter-sort-dropdown"
              value={sortOrder}
              onChange={handleSortSelect}
              aria-label="Sort products by price"
            >
              <option value="none">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <svg
              className="filter-sort-arrow-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              type="button"
              className="filter-reset-action-btn"
              onClick={onResetFilters}
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
