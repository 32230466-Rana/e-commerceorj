import { useEffect, useLayoutEffect, useRef, useState, type FC } from 'react';
import { Link } from 'react-router';
import type { Product } from '../types/product';
import '../styles/AddedToCartToast.css';

export interface AddedToCartEvent {
  /** Increments on every add so the toast and the flight replay for repeat clicks. */
  key: number;
  product: Product;
  /** Where the product photo was on screen when Add to Cart was clicked. */
  from: DOMRect | null;
  /** Items in the cart just before this add (shown in the basket until the photo lands). */
  countBefore: number;
}

interface AddedToCartToastProps {
  event: AddedToCartEvent | null;
  cartCount: number;
  onClose: () => void;
}

const VISIBLE_MS = 3200;
/** When the flying photo drops into the basket. */
const LAND_MS = 700;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Flies a round copy of the product photo in an arc and drops it into the basket. */
function flyIntoBasket(src: string, from: DOMRect, basket: DOMRect) {
  if (prefersReducedMotion() || typeof document.body.animate !== 'function') return;
  const size = Math.min(from.width, from.height, 140);
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

  // Aim just above the basket's opening, then drop straight in.
  const startX = from.left + from.width / 2;
  const startY = from.top + from.height / 2;
  const mouthX = basket.left + basket.width / 2 - startX;
  const mouthY = basket.top + basket.height * 0.3 - startY;
  const small = 26 / size;
  const animation = ghost.animate(
    [
      { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(${mouthX * 0.5}px, ${Math.min(mouthY * 0.5, 0) - 120}px) scale(0.55) rotate(-160deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${mouthX}px, ${mouthY - 34}px) scale(${small}) rotate(-330deg)`, opacity: 1, offset: 0.8 },
      { transform: `translate(${mouthX}px, ${mouthY + 6}px) scale(${small * 0.7}) rotate(-360deg)`, opacity: 0 },
    ],
    { duration: LAND_MS, easing: 'cubic-bezier(0.45, 0, 0.35, 1)', fill: 'forwards' }
  );
  const cleanUp = () => ghost.remove();
  animation.onfinish = cleanUp;
  animation.oncancel = cleanUp;
}

/** The add itself is announced by ProductCard's status text, so this region stays silent.
 *  Developer B / integration: confirms an add on the Products page, where the header cart may be scrolled away. */
export const AddedToCartToast: FC<AddedToCartToastProps> = ({ event, cartCount, onClose }) => {
  useEffect(() => {
    if (!event) return;
    const timer = window.setTimeout(onClose, VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [event, onClose]);

  if (!event) return null;
  return (
    <div className="devb-toast-region">
      {/* A new key per add restarts the card, the flight and the badge tick. */}
      <ToastCard key={event.key} event={event} cartCount={cartCount} onClose={onClose} />
    </div>
  );
};

const ToastCard: FC<{ event: AddedToCartEvent; cartCount: number; onClose: () => void }> = ({
  event,
  cartCount,
  onClose,
}) => {
  const { product } = event;
  const basketRef = useRef<HTMLSpanElement>(null);
  const [flies] = useState(() => Boolean(event.from) && !prefersReducedMotion());
  // Until the photo drops into the basket, the badge shows the count from before this add.
  const [landed, setLanded] = useState(!flies);

  useLayoutEffect(() => {
    if (!flies || !event.from || !basketRef.current) return;
    flyIntoBasket(product.imageUrl, event.from, basketRef.current.getBoundingClientRect());
    const timer = window.setTimeout(() => setLanded(true), LAND_MS);
    return () => window.clearTimeout(timer);
  }, [flies, event.from, product.imageUrl]);

  return (
    <div className="devb-toast">
      <span ref={basketRef} className={`devb-toast-basket${landed && flies ? ' is-landed' : ''}`} aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <path className="devb-basket-handle" d="M16 19c0-6 3.6-10 8-10s8 4 8 10" />
          <path className="devb-basket-body" d="M8 19h32l-3.2 20.2A4 4 0 0 1 32.8 43H15.2a4 4 0 0 1-4-3.8Z" />
          <path className="devb-basket-lines" d="M19 26v10M24 26v10M29 26v10" />
        </svg>
        <span className="devb-toast-badge">{landed ? cartCount : event.countBefore}</span>
      </span>
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
  );
};
