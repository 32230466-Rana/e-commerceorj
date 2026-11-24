import type { ReactNode } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { selectCartCount } from "../cartSelectors";
import type { CartRootState } from "../cartStore";
import {
  BagIcon,
  BoxIcon,
  CartIcon,
  CheckIcon,
  ChevronDownIcon,
  FlameIcon,
  HeadsetIcon,
  HeartIcon,
  HomeIcon,
  LayersIcon,
  SearchIcon,
  ShieldIcon,
  TruckIcon,
  UserIcon,
} from "./Icons";

/** Decorative architectural scene behind every cart/checkout screen. */
export function SceneBackground() {
  return (
    <div className="sx-scene" aria-hidden="true">
      <div className="sx-scene__sky" />
      <svg className="sx-scene__mountains" viewBox="0 0 1440 420" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sx-mtn-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8d9bb3" />
            <stop offset="1" stopColor="#c9d2e0" />
          </linearGradient>
          <linearGradient id="sx-mtn-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6f7f99" />
            <stop offset="1" stopColor="#b4bfd0" />
          </linearGradient>
          <linearGradient id="sx-snow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity=".95" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path fill="url(#sx-mtn-far)" opacity=".75" d="M0 250 L90 170 L160 210 L260 110 L340 180 L420 140 L520 220 L640 150 L760 230 L900 160 L1010 210 L1130 120 L1250 200 L1360 150 L1440 190 V420 H0Z" />
        <path fill="url(#sx-snow)" opacity=".7" d="M260 110 L300 150 L285 152 L270 140 L250 150 L232 140Z M1130 120 L1170 158 L1150 156 L1132 146 L1112 156 L1100 150Z" />
        <path fill="url(#sx-mtn-near)" opacity=".7" d="M0 320 L120 240 L220 290 L330 230 L460 300 L600 250 L720 310 L880 260 L1010 300 L1150 240 L1290 300 L1440 260 V420 H0Z" />
      </svg>
      <svg className="sx-scene__arch" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sx-rib" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".55" stopColor="#eef1f6" />
            <stop offset="1" stopColor="#c8ced8" />
          </linearGradient>
          <linearGradient id="sx-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity=".55" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="sx-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#4a5568" floodOpacity=".25" />
          </filter>
        </defs>
        {/* Sweeping roof ribs */}
        <g filter="url(#sx-soft)" fill="none" stroke="url(#sx-rib)" strokeLinecap="round" opacity=".98">
          <path d="M-80 640 C 80 160, 520 -40, 1040 -60" strokeWidth="46" />
          <path d="M60 900 C 160 420, 560 120, 1180 70" strokeWidth="30" opacity=".95" />
          <path d="M1520 560 C 1380 220, 1120 40, 760 -40" strokeWidth="40" />
          <path d="M1480 900 C 1410 520, 1240 260, 980 130" strokeWidth="24" opacity=".9" />
        </g>
        {/* Glass ceiling panels */}
        <path d="M-60 520 C 120 150, 540 -10, 1040 -40 L 1160 40 C 640 80, 240 260, 40 640 Z" fill="url(#sx-glass)" opacity=".55" />
        <g stroke="#ffffff" strokeOpacity=".55" strokeWidth="2">
          <path d="M120 360 L 300 470" />
          <path d="M260 220 L 420 360" />
          <path d="M420 120 L 560 280" />
          <path d="M620 50 L 720 220" />
          <path d="M840 10 L 900 180" />
          <path d="M1240 140 L 1150 300" />
          <path d="M1340 280 L 1230 420" />
        </g>
        {/* Floor */}
        <path d="M0 735 C 400 700, 1040 700, 1440 735 V900 H0Z" fill="#e7eaf0" />
        <path d="M0 735 C 400 700, 1040 700, 1440 735" stroke="#ffffff" strokeWidth="3" fill="none" opacity=".9" />
        <ellipse cx="300" cy="790" rx="420" ry="30" fill="#ff2a44" opacity=".08" />
      </svg>
      <svg className="sx-scene__plant sx-scene__plant--left" viewBox="0 0 260 300">
        <g fill="#3f7d3a">
          <path d="M120 300 C 60 230, 20 170, 0 90 C 60 140, 110 200, 130 300Z" fill="#2f6a2d" />
          <path d="M130 300 C 120 210, 130 120, 180 30 C 200 120, 170 220, 140 300Z" />
          <path d="M140 300 C 170 230, 220 180, 260 160 C 230 220, 190 270, 150 300Z" fill="#4d9145" />
          <path d="M110 300 C 80 260, 40 240, 0 236 C 40 270, 80 290, 110 300Z" fill="#5aa04f" />
          <path d="M125 300 C 90 200, 70 140, 80 60 C 110 140, 130 220, 132 300Z" fill="#37763a" />
        </g>
      </svg>
      <svg className="sx-scene__plant sx-scene__plant--right" viewBox="0 0 260 300">
        <g fill="#3f7d3a">
          <path d="M140 300 C 200 230, 240 170, 260 90 C 200 140, 150 200, 130 300Z" fill="#2f6a2d" />
          <path d="M130 300 C 140 210, 130 120, 80 30 C 60 120, 90 220, 120 300Z" />
          <path d="M120 300 C 90 230, 40 180, 0 160 C 30 220, 70 270, 110 300Z" fill="#4d9145" />
          <path d="M150 300 C 180 260, 220 240, 260 236 C 220 270, 180 290, 150 300Z" fill="#5aa04f" />
        </g>
      </svg>
      <div className="sx-scene__haze" />
    </div>
  );
}

export function SiteHeader() {
  const cartCount = useSelector((state: CartRootState) => selectCartCount(state));

  return (
    <header className="sx-header">
      <Link className="sx-logo" to="/" aria-label="SoleX home">
        Sole<span>X</span>
      </Link>
      <nav className="sx-nav" aria-label="Main">
        <a href="/"><HomeIcon size={18} /> <span>Home</span></a>
        <a href="/shop" className="is-active" aria-current="page"><BagIcon size={18} /> <span>Shop</span></a>
        <a href="/categories"><LayersIcon size={18} /> <span>Categories</span> <ChevronDownIcon size={14} /></a>
        <a href="/deals" className="sx-nav__deals"><FlameIcon size={18} /> <span>Deals</span><i>New</i></a>
      </nav>
      <label className="sx-search">
        <SearchIcon size={18} />
        <span className="sr-only">Search</span>
        <input type="search" placeholder="Search sneakers, brands, or styles..." />
      </label>
      <div className="sx-header__actions">
        <a className="sx-icon-btn" href="/account" aria-label="Account"><UserIcon size={22} /></a>
        <a className="sx-icon-btn" href="/wishlist" aria-label="Wishlist"><HeartIcon size={22} /></a>
        <Link className="sx-icon-btn sx-icon-btn--cart" to="/cart" aria-label={`Cart, ${cartCount} items`}>
          <CartIcon size={22} />
          {cartCount > 0 && <b key={cartCount}>{cartCount > 99 ? "99+" : cartCount}</b>}
        </Link>
      </div>
    </header>
  );
}

export function BenefitsBar() {
  const benefits = [
    { icon: <TruckIcon size={26} />, title: "Free Shipping", text: "Orders over $100" },
    { icon: <ShieldIcon size={26} />, title: "Secure Checkout", text: "Validated & private" },
    { icon: <BoxIcon size={26} />, title: "Easy Returns", text: "Within 30 Days" },
    { icon: <HeadsetIcon size={26} />, title: "24/7 Support", text: "Always Here" },
  ];
  return (
    <section className="sx-benefits" aria-label="Store benefits">
      {benefits.map((benefit) => (
        <div className="sx-benefit" key={benefit.title}>
          <span className="sx-benefit__icon">{benefit.icon}</span>
          <p>
            <strong>{benefit.title}</strong>
            <small>{benefit.text}</small>
          </p>
        </div>
      ))}
    </section>
  );
}

const STEPS = [
  { label: "Cart", icon: <CartIcon size={20} /> },
  { label: "Shipping", icon: <TruckIcon size={20} /> },
  { label: "Payment", icon: <CardIcon20 /> },
  { label: "Confirmation", icon: <CheckIcon size={20} /> },
];

function CardIcon20() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </svg>
  );
}

/** current: 0 cart, 1 shipping, 2 payment, 3 confirmation. `done` marks every step complete. */
export function CheckoutStepper({ current, done = false }: { current: number; done?: boolean }) {
  return (
    <ol className="sx-steps" aria-label="Checkout progress">
      {STEPS.map((step, index) => {
        const complete = done || index < current;
        const active = !done && index === current;
        return (
          <li
            key={step.label}
            className={`sx-step${active ? " is-current" : ""}${complete ? " is-complete" : ""}`}
            aria-current={active ? "step" : undefined}
          >
            <span className="sx-step__dot">{complete && index !== 3 ? <CheckIcon size={18} /> : step.icon}</span>
            <span className="sx-step__label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function PageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`sx-app ${className}`}>
      <SceneBackground />
      <SiteHeader />
      {children}
      <BenefitsBar />
    </div>
  );
}
