/** Developer B module — wishlist uses shared Section A context/localStorage. */
import { Link } from 'react-router';
import { ArrowUpRight, Heart } from 'lucide-react';
import { useStore } from '../app/StoreContext';
import ProductCard from '../components/sectionA/ProductCard';
import { products } from '../data/products';

export default function WishlistPage() {
  const { wishlist } = useStore();
  const saved = products.filter((item) => wishlist.includes(item.id));
  return <section className="page-shell container"><div className="page-topline"><span className="eyebrow">YOUR PERSONAL EDIT</span><span>{saved.length} SAVED PAIRS</span></div><div className="inner-page-title"><h1>THE <em>WISHLIST.</em></h1><p>All your favorites, one place. Keep what speaks to you.</p></div>{saved.length ? <div className="product-grid wishlist-grid">{saved.map((p) => <ProductCard key={p.id} product={p}/>)}</div> : <div className="empty-state spaced"><Heart size={48} strokeWidth={1.3}/><h2>Nothing saved. Yet.</h2><p>See something you like? Tap the heart on any sneaker.</p><Link to="/products" className="btn btn-primary">Explore sneakers <ArrowUpRight size={17}/></Link></div>}</section>;
}
