import type { Category, Gender, Product } from '../data/products';

export type SortOrder = 'featured' | 'price-asc' | 'price-desc';
export interface ProductFilters {
  search: string;
  gender: Gender | 'All';
  category: Category | 'All';
  maxPrice: number;
  sort: SortOrder;
}

/** Pure function: search/filter/sort. Easy for Developer B to extend and unit-test. */
export function filterProducts(items: Product[], filters: ProductFilters): Product[] {
  const query = filters.search.toLowerCase().trim();
  const filtered = items.filter((item) =>
    (query === '' || item.name.toLowerCase().includes(query)) &&
    (filters.gender === 'All' || item.gender === filters.gender || item.gender === 'Unisex') &&
    (filters.category === 'All' || item.category === filters.category) &&
    item.price <= filters.maxPrice
  );
  if (filters.sort === 'price-asc') return [...filtered].sort((a, b) => a.price - b.price);
  if (filters.sort === 'price-desc') return [...filtered].sort((a, b) => b.price - a.price);
  return filtered;
}
