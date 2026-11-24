import { useEffect, useRef, useState } from "react";
import { BagIcon } from "./Icons";

const ADDED_FEEDBACK_MS = 1500;

interface AddToCartButtonProps {
  alreadyInCart: boolean;
  atQuantityLimit: boolean;
  onAdd: () => boolean;
}

/** UI feedback only; the Redux cart remains the sole source of cart state. */
export default function AddToCartButton({ alreadyInCart, atQuantityLimit, onAdd }: AddToCartButtonProps) {
  const [justAdded, setJustAdded] = useState(false);
  const clickLocked = useRef(false);
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  function handleAdd() {
    if (clickLocked.current || atQuantityLimit) return;
    clickLocked.current = true;

    // Only celebrate after the existing Redux action actually changes quantity.
    if (!onAdd()) {
      clickLocked.current = false;
      return;
    }

    setJustAdded(true);
    timeout.current = window.setTimeout(() => {
      setJustAdded(false);
      clickLocked.current = false;
    }, ADDED_FEEDBACK_MS);
  }

  const label = justAdded
    ? "Added to Bag"
    : atQuantityLimit
      ? "In Cart"
      : alreadyInCart
        ? "Add Another"
        : "Add to Cart";

  return (
    <button
      type="button"
      className={`sx-add-button${justAdded ? " is-added" : ""}`}
      onClick={handleAdd}
      disabled={justAdded || atQuantityLimit}
      aria-live="polite"
      aria-label={label}
      title={atQuantityLimit ? "Maximum quantity already in cart" : undefined}
      data-testid="add-to-cart-button"
    >
      <BagIcon className="sx-add-button__bag" size={17} />
      <span className="sx-add-button__label">{label}</span>
    </button>
  );
}
