import { describe, it, expect } from 'vitest';
import { filterProducts } from './catalog';
import { products } from '../data/products';

describe('Product search & filtering', () => {
  it('finds products by name and filters by category and price', () => {
    const match = filterProducts(products, { search: 'velocity', gender: 'All', category: 'Running', maxPrice: 150, sort: 'featured' });
    expect(match.map((item) => item.id)).toEqual(['velocity-04']);
  });
  it('sorts results numerically from cheapest to highest', () => {
    const results = filterProducts(products, { search: '', gender: 'All', category: 'All', maxPrice: 200, sort: 'price-asc' });
    expect(results.map((p) => p.price)).toEqual([...results.map((p) => p.price)].sort((a, b) => a - b));
  });
});
