import { useEffect, useLayoutEffect, useRef, type FC } from 'react';
import { Link } from 'react-router';
import type { Product } from '../types/product';
import '../styles/AddedToCartToast.css';

export interface AddedToCartEvent {
  /** Increments on every add so the toast and the flight replay for repeat clicks. */
  key: number;
  product: Product;
  /** Where the product photo was on screen when Add to Cart was clicked. */
  from: DOMRect | null;
}

interface AddedToCartToastProps {
  event: AddedToCartEvent | null;
  cartCount: number;
  onClose: () => void;
}

const VISIBLE_MS = 3200;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Flies a copy of the product photo from the card into the toast's thumbnail. */
function flyPhoto(src: string, from: DOMRect, to: DOMRect) {
  if (prefersReducedMotion() || typeof document.body.animate !== 'function') return;
  const size = Math.min(from.width, from.height, 160);
  const ghost = document.createElement('img');
  ghost.src = src;
  ghost.alt = '';
  ghost.className = 'devb-fly-photo';
  Object.assign(ghost.style, {
    width: `${size}px`,
    height: `${size}px`,
    left: `${from.left + from.width / 2 - size / 2}px`,
    top: `${from.top + from.height / 2 - size / 2}px`,
  });
  document.body.appendChild(ghost);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const end = to.width / size;
  const animation = ghost.animate(
    [
      { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1, borderRadius: '18px' },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 90}px) scale(0.6) rotate(-8deg)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(${end}) rotate(0deg)`, opacity: 0.9, borderRadius: '12px' },
    ],
    { duration: 650, easing: 'cubic-bezier(0.5, 0, 0.3, 1)', fill: 'forwards' }
  );
  const cleanUp = () => ghost.remove();
  animation.onfinish = cleanUp;
  animation.oncancel = cleanUp;
}

/** The add itself is announced by ProductCard's status text, so this region stays silent.
 *  Developer B / integration: confirms an add on the Products page, where the header cart may be scrolled away. */
export const AddedToCartToast: FC<AddedToCartToastProps> = ({ event, cartCount, onClose }) => {
  const thumbRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (!event?.from || !thumbRef.current) return;
    flyPhoto(event.product.imageUrl, event.from, thumbRef.current.getBoundingClientRect());
  }, [event]);

  useEffect(() => {
    if (!event) return;
    const timer = window.setTimeout(onClose, VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [event, onClose]);

  if (!event) return null;
  const { product } = event;

  return (
    <div className="devb-toast-region">
      <div className="devb-toast" key={event.key}>
        <img ref={thumbRef} className="devb-toast-thumb" src={product.imageUrl} alt="" />
        <div className="devb-toast-text">
          <span className="devb-toast-title">
            <svg className="devb-toast-check" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="11" />
              <path d="M7 12.5l3.2 3.2L17 9" />
            </svg>
            Added to cart
          </span>
          <span className="devb-toast-name">{product.name}</span>
          <span className="devb-toast-meta">
            ${product.price.toFixed(2)} · Cart: {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </span>
        </div>
        <Link className="devb-toast-link" to="/cart">View cart</Link>
        <button type="button" className="devb-toast-close" onClick={onClose} aria-label="Dismiss">
          ×
        </button>
        <span className="devb-toast-timer" style={{ animationDuration: `${VISIBLE_MS}ms` }} />
      </div>
    </div>
  );
};
