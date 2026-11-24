import type { FC } from 'react';
import '../styles/MobileNavDrawer.css';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePage?: string;
}

export const MobileNavDrawer: FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  activePage = 'Products',
}) => {
  const navItems = [
    { label: 'Home', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Products', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  return (
    <div
      className={`mobile-nav-overlay ${isOpen ? 'mobile-nav-overlay-open' : ''}`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <nav
        className="mobile-nav-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Mobile Navigation"
      >
        <div className="mobile-nav-header">
          <div className="mobile-nav-logo">
            Sole<span className="mobile-nav-logo-accent">X</span>
          </div>
          <button
            type="button"
            className="mobile-nav-close-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            ✕
          </button>
        </div>

        <div className="mobile-nav-links">
          {navItems.map((item) => {
            const isActive = item.label === activePage;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`mobile-nav-link-item ${
                  isActive ? 'mobile-nav-link-item-active' : ''
                }`}
                onClick={onClose}
              >
                <span>{item.label}</span>
                <span className="mobile-nav-link-arrow">→</span>
              </a>
            );
          })}
        </div>

        <div className="mobile-nav-footer">
          <span className="mobile-nav-footer-tag">DROP 01 // SS26</span>
          <p className="mobile-nav-footer-desc">
            Engineered for performance, styled for the fearless.
          </p>
        </div>
      </nav>
    </div>
  );
};
