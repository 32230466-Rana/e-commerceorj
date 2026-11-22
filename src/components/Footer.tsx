/** SECTION A — Shared footer, brand identity and navigation. */
import { Link } from 'react-router-dom';
import { ArrowUpRight, Instagram, ArrowRight } from 'lucide-react';

export default function Footer() {
  return <footer className="footer" id="contact">
    <div className="container footer-top">
      <div className="footer-heading"><span className="eyebrow">KEEP MOVING</span><h2>YOUR NEXT STEP<br/><em>STARTS HERE.</em></h2></div>
      <Link to="/products" className="footer-cta" aria-label="Explore all sneakers"><ArrowUpRight size={38}/></Link>
    </div>
    <div className="container footer-grid">
      <div className="footer-brand"><img src="/assets/kixon-logo.png" alt="KIXON"/><p>Built to move differently.<br/>For the streets, the everyday, and beyond.</p></div>
      <div><h3>EXPLORE</h3><Link to="/products">All sneakers</Link><Link to="/products?gender=Men">Men</Link><Link to="/products?gender=Women">Women</Link><Link to="/wishlist">Wishlist</Link></div>
      <div><h3>HELP</h3><Link to="/about">Our story</Link><Link to="/cart">Your bag</Link><Link to="/checkout">Checkout</Link><a href="mailto:hello@kixon.example">Contact (demo)</a></div>
      <div className="footer-news"><h3>STAY IN THE LOOP</h3><p>First to know. First to move.</p><div className="newsletter-faux"><span>Coming soon: new drops</span><ArrowRight size={17}/></div><p className="footer-demo-note">Demo storefront — no real orders or payments.</p></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} KIXON. A concept sneaker store.</span><span>MADE TO MOVE DIFFERENTLY.</span><span className="footer-social"><Instagram size={17}/> <span>MOVE BOLD.</span></span></div>
  </footer>;
}
