/** SECTION A — Responsive global navigation, live counters, light/dark toggle. */
import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { Heart, ShoppingBag, Moon, Sun, Menu, X, ArrowUpRight } from 'lucide-react';
import { useStore } from '../app/StoreContext';

export default function Header() {
  const { theme, toggleTheme, cartCount, wishlist } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  const navClass = ({ isActive }: { isActive: boolean }) => `nav-link${isActive ? ' active' : ''}`;
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="announcement">NEW SEASON / NEW ENERGY <span>—</span> FREE SHIPPING ON ORDERS OVER $180 <ArrowUpRight size={12}/></div>
    <header className="site-header">
      <div className="header-inner container">
        <Link to="/" className="brand" onClick={close} aria-label="KIXON home">
          <img src="/assets/kixon-logo.png" alt="KIXON" />
        </Link>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
          <NavLink to="/" end className={navClass} onClick={close}>Home</NavLink>
          <NavLink to="/products" className={navClass} onClick={close}>Shop all</NavLink>
          <Link className="nav-link" to="/products?gender=Men" onClick={close}>Men</Link>
          <Link className="nav-link" to="/products?gender=Women" onClick={close}>Women</Link>
          <NavLink to="/about" className={navClass} onClick={close}>Our story</NavLink>
        </nav>
        <div className="header-actions">
          <button type="button" className="icon-button theme-button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? <Moon size={20} strokeWidth={1.8}/> : <Sun size={20} strokeWidth={1.8}/>}
          </button>
          <Link to="/wishlist" className="icon-button" aria-label={`Wishlist, ${wishlist.length} items`} onClick={close}>
            <Heart size={21} strokeWidth={1.8}/>{wishlist.length > 0 && <span className="icon-count">{wishlist.length}</span>}
          </Link>
          <Link to="/cart" className="icon-button" aria-label={`Cart, ${cartCount} items`} onClick={close}>
            <ShoppingBag size={21} strokeWidth={1.8}/>{cartCount > 0 && <span className="icon-count">{cartCount}</span>}
          </Link>
          <button type="button" className="icon-button mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>{menuOpen ? <X/> : <Menu/>}</button>
        </div>
      </div>
    </header>
  </>;
}
