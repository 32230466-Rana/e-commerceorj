/** SECTION A — Landing page, sections, collections and hero theme variants. */
import { ArrowRight, ArrowUpRight, MoveUpRight, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { Link } from 'react-router';
import { useStore } from '../app/StoreContext';
import ProductCard from '../components/sectionA/ProductCard';
import { products } from '../data/products';

export default function HomePage() {
  const { theme } = useStore();
  return <>
    <section className={`home-hero ${theme === 'dark' ? 'hero-dark' : 'hero-light'}`} aria-label="KIXON new season collection">
      <div className="hero-text">
        <div className="hero-eyebrow"><span className="tiny-star">✳</span> THE NEXT GENERATION OF SNEAKERS <span className="hero-eyebrow-num">/ 001</span></div>
        {theme === 'dark' ? <h1>UNLEASH<br/>YOUR <span className="hero-outline">SOLE</span><br/>POWER<span className="hero-dot">.</span></h1> : <h1>MOVE<br/>BOLD<span className="hero-dot">.</span></h1>}
        <p>More than sneakers. A statement in every step. Discover KIXON — curated styles for men and women who refuse to blend in.</p>
        <div className="hero-links"><Link to="/products" className="btn btn-primary">Shop the collection <ArrowUpRight size={18}/></Link><Link to="/about" className="hero-discover">Discover KIXON <ArrowRight size={16}/></Link></div>
        <div className="hero-stats"><div><strong>08</strong><span>Signature styles</span></div><div><strong>02</strong><span>Collections</span></div><div><strong>01</strong><span>Way to move</span></div></div>
      </div>
      <div className="hero-art" aria-hidden="true">
        {theme === 'dark' && <div className="fire-trails"/>}
        <span className="hero-backtext">{theme === 'dark' ? 'FIRE' : 'FRESH'}</span>
        <div className="hero-glow"/>
        <img className="hero-shoe" src={theme === 'dark' ? '/assets/sneaker-fire.png' : '/assets/sneaker-pink.png'} alt=""/>
        <span className="hero-orbit-label">KIXON / EST. 2026 / ALWAYS IN MOTION</span>
      </div>
      {theme === 'light' && <div className="hero-side-panel" aria-hidden="true"><div className="mini-product"><img src="/assets/sneaker-fire.png" alt=""/></div><span className="panel-index">01 — 08</span></div>}
      <div className="hero-corner" aria-hidden="true"><span className="hero-arrow"><MoveUpRight size={26}/></span><span>SCROLL TO EXPLORE</span></div>
    </section>

    <section className="moving-strip" aria-label="Brand message"><div className="strip-content"><span>UNAPOLOGETIC STYLE</span><span>✳</span><span>DESIGNED TO MOVE</span><span>✳</span><span>EVERY STEP COUNTS</span><span>✳</span><span>UNAPOLOGETIC STYLE</span><span>✳</span><span>DESIGNED TO MOVE</span><span>✳</span></div></section>

    <section className="section container" id="featured"><div className="section-heading"><div><span className="eyebrow">01 / CURATED FOR YOU</span><h2>THE <span>HOT LIST.</span></h2><p>Standouts for wherever your day takes you.</p></div><Link to="/products" className="text-link">Shop all sneakers <ArrowUpRight size={19}/></Link></div><div className="product-grid featured-grid">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product}/>)}</div></section>

    <section className="section container categories-section"><div className="section-heading"><div><span className="eyebrow">02 / FIND YOUR LANE</span><h2>YOUR STYLE. <span>YOUR RULES.</span></h2></div></div><div className="category-grid">
      <Link to="/products?gender=Men" className="category-tile category-men"><span className="category-kicker">01 / THE COLLECTION</span><h3>FOR<br/>HIM.</h3><img src="/assets/sneaker-fire.png" alt="KIXON black and orange sneaker" loading="lazy"/><span className="category-go">Explore men <ArrowUpRight size={19}/></span></Link>
      <Link to="/products?gender=Women" className="category-tile category-women"><span className="category-kicker">02 / THE COLLECTION</span><h3>FOR<br/>HER.</h3><img src="/assets/sneaker-pink.png" alt="KIXON pink sneaker" loading="lazy"/><span className="category-go">Explore women <ArrowUpRight size={19}/></span></Link>
    </div></section>

    <section className="story-band"><div className="container story-inner"><div><span className="eyebrow">03 / WHY WE MOVE</span><h2>NOT JUST A SHOE.<br/><em>A STATE OF MIND.</em></h2></div><div className="story-right"><p>KIXON is built around one idea: great style should move with you. No rules, no limits — just the freedom to show up as yourself.</p><Link to="/about" className="btn btn-outline">Get to know us <ArrowUpRight size={18}/></Link></div></div></section>

    <section className="container perks" aria-label="Shopping benefits"><div><Truck size={26} strokeWidth={1.6}/><div><h3>FREE SHIPPING</h3><p>On orders over $180</p></div></div><div><ShieldCheck size={26} strokeWidth={1.6}/><div><h3>DEMO CHECKOUT</h3><p>Safe, simulated orders only</p></div></div><div><RotateCcw size={26} strokeWidth={1.6}/><div><h3>SHOP YOUR WAY</h3><p>Save favorites for later</p></div></div></section>
  </>;
}
