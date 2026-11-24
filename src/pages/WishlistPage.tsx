/** Developer B module — wishlist uses shared Section A context/localStorage. */
/* Integration: shows every saved pair from the shared Redux wishlist. Section A products keep
   Section A's card; pairs saved from Products or Cart use Developer B's card. */
import { Link } from 'react-router';
import { ArrowUpRight, Heart } from 'lucide-react';
import { useStore } from '../app/StoreContext';
import ProductCard from '../components/sectionA/ProductCard';
import { ProductCard as CatalogProductCard } from '../components/ProductCard';
import { getProduct } from '../data/products';
import { getCatalogProduct, toDevBProduct, type CatalogProduct } from '../catalog/catalog';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const saved = wishlist.map(getCatalogProduct).filter((item): item is CatalogProduct => Boolean(item));
  return <section className="page-shell container"><div className="page-topline"><span className="eyebrow">YOUR PERSONAL EDIT</span><span>{saved.length} SAVED PAIRS</span></div><div className="inner-page-title"><h1>THE <em>WISHLIST.</em></h1><p>All your favorites, one place. Keep what speaks to you.</p></div>{saved.length ? <div className="product-grid wishlist-grid">{saved.map((item) => {const sectionAProduct = getProduct(item.id); return sectionAProduct ? <ProductCard key={item.id} product={sectionAProduct}/> : <CatalogProductCard key={item.id} product={toDevBProduct(item)} isInWishlist onToggleWishlist={() => toggleWishlist(item.id)} onAddToCart={() => addToCart(item.id)}/>;})}</div> : <div className="empty-state spaced"><Heart size={48} strokeWidth={1.3}/><h2>Nothing saved. Yet.</h2><p>See something you like? Tap the heart on any sneaker.</p><Link to="/products" className="btn btn-primary">Explore sneakers <ArrowUpRight size={17}/></Link></div>}</section>;
}
