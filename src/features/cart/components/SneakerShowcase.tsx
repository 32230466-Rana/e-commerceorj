import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { CatalogProduct } from "../../../catalog/catalog";
import { CloseIcon, ExpandIcon, SoleXMark } from "./Icons";
import { loadDisplayImage, useDisplayImage } from "../../../catalog/useDisplayImage";

/* Keep in sync with the sx-flip-out / sx-flip-in durations in CartPage.css. */
const EXIT_MS = 300;
const ENTER_MS = 520;

/** Largest on-screen width relative to the photo's real pixel width (avoids blurry upscaling). */
const MAX_UPSCALE = 1.15;
const MAX_DISPLAY_WIDTH = 420;

type Phase = "idle" | "exit" | "enter";

interface ShowcaseState {
  shownId: string | undefined;
  phase: Phase;
  dir: 1 | -1;
}

interface SneakerShowcaseProps {
  products: CatalogProduct[];
  activeId: string | undefined;
  onSelect: (productId: string) => void;
}

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const imageCache = new Map<string, Promise<void>>();

/** Loads and decodes an image once, so the swap never flashes an empty frame. */
function preload(src: string): Promise<void> {
  let pending = imageCache.get(src);
  if (!pending) {
    const img = new Image();
    img.src = src;
    pending = (img.decode ? img.decode() : Promise.resolve()).catch(() => undefined);
    imageCache.set(src, pending);
  }
  return pending;
}

/**
 * Product stage + "Choose your sneaker" picker.
 *
 * Transition state machine: idle → exit (old shoe flips out) → [swap image once
 * the new one is decoded] → enter (new shoe flips in) → idle. Clicks during a
 * transition only update the target; when the cycle ends it starts again if the
 * target changed, so rapid clicking always lands on the last choice.
 */
export default function SneakerShowcase({ products, activeId, onSelect }: SneakerShowcaseProps) {
  const target = products.find((product) => product.id === activeId) ?? products[0];
  const [state, setState] = useState<ShowcaseState>({ shownId: target?.id, phase: "idle", dir: 1 });
  const [maxWidth, setMaxWidth] = useState<number>(MAX_DISPLAY_WIDTH);
  const [zoomOpen, setZoomOpen] = useState(false);
  const targetRef = useRef<CatalogProduct | undefined>(target);
  const closeButton = useRef<HTMLButtonElement>(null);

  const shown = products.find((product) => product.id === state.shownId) ?? target;

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  // Warm the cache for every selectable sneaker (including any backdrop cut-outs).
  useEffect(() => {
    products.forEach((product) => void loadDisplayImage(product).then(preload));
  }, [products]);

  const display = useDisplayImage(shown);

  // idle → exit when a different sneaker is requested.
  useEffect(() => {
    if (state.phase !== "idle" || !target || target.id === state.shownId) return;
    const from = products.findIndex((product) => product.id === state.shownId);
    const to = products.findIndex((product) => product.id === target.id);
    const timer = window.setTimeout(() => setState((s) => ({ ...s, phase: "exit", dir: to >= from ? 1 : -1 })), 0);
    return () => window.clearTimeout(timer);
  }, [state.phase, state.shownId, target, products]);

  // exit → (wait for decode) → enter → idle.
  useEffect(() => {
    if (state.phase === "idle") return;
    let cancelled = false;
    const reduced = reducedMotion();
    const timer = window.setTimeout(
      () => {
        if (state.phase === "exit") {
          const next = targetRef.current;
          if (!next) return;
          void loadDisplayImage(next).then(preload).then(() => {
            if (!cancelled) setState((s) => ({ ...s, shownId: next.id, phase: reduced ? "idle" : "enter" }));
          });
        } else {
          setState((s) => ({ ...s, phase: "idle" }));
        }
      },
      reduced ? 0 : state.phase === "exit" ? EXIT_MS : ENTER_MS
    );
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [state.phase]);

  useEffect(() => {
    if (!zoomOpen) return;
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomOpen]);

  if (!shown || !target) return null;

  const stageStyle = { "--dir": state.dir, "--shoe-max": `${maxWidth}px` } as CSSProperties;

  return (
    <section className="sx-showcase" aria-label="Sneaker preview">
      <div className={`sx-stage is-${state.phase}`} style={stageStyle}>
        <div className="sx-stage__glow" aria-hidden="true" />
        <div
          className={`sx-shoe${display.transparent ? "" : " sx-shoe--photo"}`}
          data-testid="hero-sneaker"
          data-product-id={shown.id}
          data-phase={state.phase}
        >
          {display.src && <img
            key={shown.id}
            className="sx-shoe__img"
            src={display.src}
            alt={shown.name}
            draggable={false}
            style={shown.imageFilter ? { filter: shown.imageFilter } : undefined}
            onLoad={(event) => {
              const natural = event.currentTarget.naturalWidth;
              if (natural > 0) setMaxWidth(Math.min(MAX_DISPLAY_WIDTH, Math.round(natural * MAX_UPSCALE)));
            }}
          />}
          <span className="sx-shoe__shadow" aria-hidden="true" />
        </div>
        <div className="sx-pedestal" aria-hidden="true">
          <div className="sx-pedestal__top" />
          <div className="sx-pedestal__glow" />
          <div className="sx-pedestal__body">
            <SoleXMark size={24} />
          </div>
        </div>
        <button type="button" className="sx-stage__expand" onClick={() => setZoomOpen(true)} aria-label={`View ${shown.name} larger`}>
          <ExpandIcon size={18} />
        </button>
      </div>

      <div className="sx-picker" role="group" aria-labelledby="sx-picker-label">
        <p id="sx-picker-label" className="sx-picker__label">Choose your sneaker</p>
        <div className="sx-picker__list">
          {products.map((product) => {
            const isActive = product.id === target.id;
            return (
              <button
                type="button"
                key={product.id}
                className={`sx-picker__thumb${isActive ? " is-active" : ""}`}
                onClick={() => onSelect(product.id)}
                onPointerEnter={() => void loadDisplayImage(product).then(preload)}
                aria-label={`Preview ${product.name}`}
                aria-pressed={isActive}
                title={product.name}
              >
                <PickerImage product={product} />
              </button>
            );
          })}
        </div>
        <p className="sx-picker__name" aria-live="polite">{target.name}</p>
      </div>

      {zoomOpen && (
        <div className="sx-zoom" role="dialog" aria-modal="true" aria-label={`${shown.name} enlarged`} onClick={() => setZoomOpen(false)}>
          <div className="sx-zoom__panel" onClick={(event) => event.stopPropagation()}>
            <button ref={closeButton} type="button" className="sx-zoom__close" onClick={() => setZoomOpen(false)} aria-label="Close preview">
              <CloseIcon size={20} />
            </button>
            <img src={display.src ?? shown.image} alt={shown.name} style={{ maxWidth: maxWidth * 1.6 }} />
            <p>{shown.name}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function PickerImage({ product }: { product: CatalogProduct }) {
  const display = useDisplayImage(product);
  if (!display.src) return null;
  return (
    <img
      src={display.src}
      alt=""
      draggable={false}
      className={display.transparent ? undefined : "is-photo"}
      style={product.imageFilter ? { filter: product.imageFilter } : undefined}
    />
  );
}
