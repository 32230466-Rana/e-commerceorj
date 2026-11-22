/** Developer B module — fully working catalog. UI state stays in URL-friendly filters. */
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { products, type Category, type Gender } from '../data/products';
import { filterProducts, type SortOrder } from '../lib/catalog';
import ProductCard from '../components/ProductCard';

const genders: Array<Gender | 'All'> = ['All', 'Men', 'Women', 'Unisex'];
const categories: Array<Category | 'All'> = ['All', 'Lifestyle', 'Running', 'Basketball', 'Training'];
const MAX_PRICE = 200;

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const genderParam = params.get('gender');
  const selectedGender: Gender | 'All' = genders.includes(genderParam as Gender) ? (genderParam as Gender) : 'All';
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sort, setSort] = useState<SortOrder>('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => { setCategory('All'); setSearch(''); }, [selectedGender]);
  const visible = useMemo(() => filterProducts(products, { search, gender: selectedGender, category, maxPrice, sort }), [search, selectedGender, category, maxPrice, sort]);
  function setGender(gender: Gender | 'All') {
    setParams(gender === 'All' ? {} : { gender });
  }
  function reset() { setSearch(''); setCategory('All'); setMaxPrice(MAX_PRICE); setSort('featured'); setGender('All'); }

  return <div className="page-shell container catalog-page">
    <div className="page-topline"><span className="eyebrow">THE KIXON COLLECTION / 2026</span><span>BUILT DIFFERENT. WORN EVERYWHERE.</span></div>
    <div className="catalog-title-row"><div><h1>FIND YOUR <em>FIT.</em></h1><p>The next obsession is one scroll away. Explore every KIXON silhouette.</p></div><span className="catalog-count">{visible.length.toString().padStart(2,'0')} <small>STYLES</small></span></div>
    <div className="gender-tabs" role="group" aria-label="Shop by gender">{genders.map((g) => <button key={g} type="button" className={g === selectedGender ? 'active' : ''} onClick={() => setGender(g)}>{g === 'All' ? 'All sneakers' : g}</button>)}</div>
    <div className="catalog-body">
      <aside className={`catalog-filters${filtersOpen ? ' filters-open' : ''}`} aria-label="Product filters">
        <div className="filters-heading"><strong>FILTERS</strong><button type="button" onClick={() => setFiltersOpen(false)} className="filter-dismiss" aria-label="Close filters"><X size={19}/></button></div>
        <label className="filter-label" htmlFor="catalog-search">SEARCH SNEAKERS</label><div className="search-field"><Search size={17}/><input id="catalog-search" placeholder="Find your next pair..." value={search} onChange={(e) => setSearch(e.target.value)}/></div>
        <div className="filter-group"><strong className="filter-label">CATEGORY</strong>{categories.map((item) => <button type="button" className={`category-filter${category === item ? ' selected' : ''}`} key={item} onClick={() => setCategory(item)}><span>{item === 'All' ? 'All styles' : item}</span><span>{item === 'All' ? products.length : products.filter((p) => p.category === item).length}</span></button>)}</div>
        <div className="filter-group"><label className="filter-label" htmlFor="price-range">MAXIMUM PRICE <span>${maxPrice}</span></label><input id="price-range" type="range" min="100" max={MAX_PRICE} step="5" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}/><div className="range-labels"><span>$100</span><span>${MAX_PRICE}</span></div></div>
        <button className="clear-filter" type="button" onClick={reset}>Reset all filters <X size={14}/></button>
      </aside>
      <section className="catalog-results" aria-label="Product results">
        <div className="catalog-toolbar"><span>SHOWING <strong>{visible.length}</strong> RESULTS</span><div className="toolbar-actions"><button type="button" className="mobile-filter" onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={17}/> Filters</button><label htmlFor="sort">SORT BY</label><select id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortOrder)}><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></div></div>
        {visible.length ? <div className="product-grid catalog-grid">{visible.map((product) => <ProductCard product={product} key={product.id}/>)}</div> : <div className="empty-state"><Search size={39} strokeWidth={1.3}/><h2>No sneakers found.</h2><p>Try a different search term, category, or price range.</p><button className="btn btn-primary" type="button" onClick={reset}>Clear all filters</button></div>}
      </section>
    </div>
  </div>;
}
