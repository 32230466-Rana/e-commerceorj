import { Heart, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../app/StoreContext';
import { formatPrice, type Product } from '../data/products';
import ProductArt from './ProductArt';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, isWishlisted, toggleWishlist } = useStore();
  const [added, setAdded] = useState(false);
  const wished = isWishlisted(product.id);
  const handleAdd = () => {
    addToCart(product.id); setAdded(true);
  };
  return <article className="product-card">
    <div className="product-card-media">
      <ProductArt product={product}/>
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <button type="button" className={`product-heart${wished ? ' selected' : ''}`} aria-label={`${wished ? 'Remove' : 'Add'} ${product.name} ${wished ? 'from' : 'to'} wishlist`} aria-pressed={wished} onClick={() => toggleWishlist(product.id)}><Heart fill={wished ? 'currentColor' : 'none'} size={19}/></button>
      <button type="button" className="quick-add" onClick={handleAdd}>{added ? <><Check size={16}/> Add another</> : <><Plus size={17}/> Add to bag</>}</button>
    </div>
    <div className="product-details"><div><span className="product-type">{product.gender} / {product.category}</span><h3>{product.name}</h3><p>{product.color}</p></div><strong>{formatPrice(product.price)}</strong></div>
  </article>;
}
