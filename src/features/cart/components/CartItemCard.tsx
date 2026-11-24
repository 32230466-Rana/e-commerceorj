import { useState, type CSSProperties } from "react";
import type { CartLine } from "../cartSelectors";
import { MAX_LINE_QUANTITY } from "../cartSchema";
import { formatMoney } from "../pricing";
import { CheckIcon, TrashIcon } from "./Icons";
import { useDisplayImage } from "../../../catalog/useDisplayImage";

interface CartItemCardProps {
  line: CartLine;
  index: number;
  previewing: boolean;
  onPreview: () => void;
  onToggleSelected: () => void;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  onSizeChange: (size: number) => void;
  onColorChange: (color: string) => void;
}

const REMOVE_ANIMATION_MS = 260;

export default function CartItemCard({
  line,
  index,
  previewing,
  onPreview,
  onToggleSelected,
  onQuantityChange,
  onRemove,
  onSizeChange,
  onColorChange,
}: CartItemCardProps) {
  const { product, item, size, color, selected, lineTotal } = line;
  const [leaving, setLeaving] = useState(false);
  const titleId = `cart-item-${product.id}-title`;
  const thumb = useDisplayImage(product);

  const remove = () => {
    if (leaving) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return onRemove();
    setLeaving(true);
    window.setTimeout(onRemove, REMOVE_ANIMATION_MS);
  };

  return (
    <article
      className={`sx-item${selected ? " is-selected" : ""}${previewing ? " is-previewing" : ""}${leaving ? " is-leaving" : ""}`}
      style={{ animationDelay: `${120 + index * 90}ms` }}
      aria-labelledby={titleId}
      data-testid="cart-item"
    >
      <label className="sx-check">
        <input type="checkbox" checked={selected} onChange={onToggleSelected} aria-label={`Include ${product.name} in checkout`} />
        <span className="sx-check__box"><CheckIcon size={16} strokeWidth={3} /></span>
      </label>

      <button type="button" className="sx-item__thumb" onClick={onPreview} aria-label={`Preview ${product.name}`}>
        {thumb.src && (
          <img
            src={thumb.src}
            alt=""
            className={thumb.transparent ? undefined : "is-photo"}
            style={product.imageFilter ? { filter: product.imageFilter } : undefined}
          />
        )}
      </button>

      <div className="sx-item__title">
        <h2 id={titleId}>{product.name}</h2>
        <p>{product.type}</p>
      </div>
      <div className="sx-item__options">
          {product.sizes.length > 0 && (
          <fieldset className="sx-sizes">
            <legend>Size:</legend>
            {product.sizes.map((value) => (
              <button
                type="button"
                key={value}
                className={size === value ? "is-chosen" : ""}
                aria-pressed={size === value}
                aria-label={`Size ${value}`}
                onClick={() => onSizeChange(value)}
              >
                {value}
              </button>
            ))}
          </fieldset>
          )}
          {product.colors.length > 0 && (
          <fieldset className="sx-colors">
            <legend>Color:</legend>
            {product.colors.map((option) => (
              <button
                type="button"
                key={option.name}
                className={`sx-swatch${color === option.name ? " is-chosen" : ""}`}
                style={{ "--swatch": option.hex } as CSSProperties}
                aria-pressed={color === option.name}
                aria-label={`Color ${option.name}`}
                title={option.name}
                onClick={() => onColorChange(option.name)}
              />
            ))}
          </fieldset>
          )}
          {product.colors.length === 0 && product.colorway && (
            <p className="sx-item__colorway">Color: <span>{product.colorway}</span></p>
          )}
      </div>

      <div className="sx-item__side">
        <div className="sx-qty" role="group" aria-label={`Quantity for ${product.name}`}>
          <button type="button" onClick={() => onQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Decrease quantity">
            −
          </button>
          <output key={item.quantity} aria-live="polite" aria-label={`Quantity ${item.quantity}`}>
            {item.quantity}
          </output>
          <button
            type="button"
            onClick={() => onQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= MAX_LINE_QUANTITY}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <strong className="sx-item__price" key={lineTotal}>{formatMoney(lineTotal)}</strong>
        <button type="button" className="sx-item__remove" onClick={remove} aria-label={`Remove ${product.name}`}>
          <TrashIcon size={20} />
        </button>
      </div>
    </article>
  );
}
