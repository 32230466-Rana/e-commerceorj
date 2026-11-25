import { useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useNavigate } from "react-router";
import {
  addItem,
  clearCart,
  removeItem,
  removeSelected,
  setAllSelected,
  toggleSelected,
  updateQuantity,
  updateVariant,
} from "../store/cartSlice";
import { selectCartLines, selectSelectedLines, selectSelectedTotals } from "../store/cartSelectors";
import { isDemoCart, type CartDispatch, type CartRootState } from "../store/cartStore";
import { cartShowcaseProducts } from "../../../catalog/catalog";
import { addToWishlist } from "../../wishlist/wishlistSlice";
import { MAX_LINE_QUANTITY } from "../schemas/cartSchema";
import { formatMoney } from "../utils/pricing";
import CartItemCard from "../components/CartItemCard";
import CartSummary from "../components/CartSummary";
import AddToCartButton from "../components/AddToCartButton";
import SneakerShowcase from "../components/SneakerShowcase";
import { CheckoutStepper, PageShell } from "../components/SiteChrome";
import { CartIcon, CheckIcon, HeartIcon, TrashIcon } from "../components/Icons";
import "../styles/CartPage.css";

export default function CartPage() {
  const dispatch = useDispatch<CartDispatch>();
  const store = useStore<CartRootState>();
  const navigate = useNavigate();
  const lines = useSelector((state: CartRootState) => selectCartLines(state));
  const selectedLines = useSelector((state: CartRootState) => selectSelectedLines(state));
  const totals = useSelector((state: CartRootState) => selectSelectedTotals(state));
  const [previewId, setPreviewId] = useState<string | undefined>(undefined);
  const [notice, setNotice] = useState("");

  const isEmpty = lines.length === 0;
  const showcaseProducts = isEmpty ? cartShowcaseProducts : lines.map((line) => line.product);
  const activePreviewId = showcaseProducts.some((p) => p.id === previewId) ? previewId : showcaseProducts[0]?.id;
  const allSelected = !isEmpty && selectedLines.length === lines.length;

  function addProduct(productId: string): boolean {
    const before = store.getState().cart.items.find((item) => item.productId === productId)?.quantity ?? 0;
    dispatch(addItem({ productId }));
    const after = store.getState().cart.items.find((item) => item.productId === productId)?.quantity ?? 0;
    return after > before;
  }

  // Save for Later moves the selected pairs from the cart into the shared wishlist.
  const saveSelectedForLater = () => {
    if (selectedLines.length === 0) {
      setNotice("Select the items you want to save for later.");
      return;
    }
    dispatch(addToWishlist(selectedLines.map((line) => line.product.id)));
    dispatch(removeSelected());
    setNotice(`Moved ${selectedLines.length} ${selectedLines.length === 1 ? "item" : "items"} to your wishlist.`);
  };

  const proceed = () => {
    if (selectedLines.length === 0) {
      setNotice("Select at least one item to check out.");
      return;
    }
    navigate("/checkout");
  };

  return (
    <PageShell>
      <div className="sx-page sx-cart" id="main">
        <SneakerShowcase products={showcaseProducts} activeId={activePreviewId} onSelect={setPreviewId} />

        <div className="sx-cart__head">
          <div className="sx-title">
            <span className="sx-title__icon"><CartIcon size={28} /></span>
            <div>
              <h1>Your <em>Cart</em></h1>
              <p data-testid="selected-count">
                {isEmpty ? "No items yet" : `${selectedLines.length} ${selectedLines.length === 1 ? "item" : "items"} selected`}
                {isDemoCart && <span className="sx-demo-flag">Demo data · not saved</span>}
              </p>
            </div>
          </div>
          <CheckoutStepper current={0} />
        </div>

        <section className="sx-cart__items" aria-label="Cart items">
          {isEmpty ? (
            <div className="sx-empty" data-testid="empty-cart">
              <span className="sx-empty__icon"><CartIcon size={34} /></span>
              <h2>Your cart is empty</h2>
              <p>Pick a pair below to get started — your cart is saved on this device.</p>
            </div>
          ) : (
            <>
              {lines.map((line, index) => (
                <CartItemCard
                  key={line.product.id}
                  line={line}
                  index={index}
                  previewing={line.product.id === activePreviewId}
                  onPreview={() => setPreviewId(line.product.id)}
                  onToggleSelected={() => dispatch(toggleSelected(line.product.id))}
                  onQuantityChange={(quantity) => dispatch(updateQuantity({ productId: line.product.id, quantity }))}
                  onRemove={() => dispatch(removeItem(line.product.id))}
                  onSizeChange={(size) => dispatch(updateVariant({ productId: line.product.id, size }))}
                  onColorChange={(color) => dispatch(updateVariant({ productId: line.product.id, color }))}
                />
              ))}
              <div className="sx-actions">
                <label className="sx-check sx-check--inline">
                  <input type="checkbox" checked={allSelected} onChange={() => dispatch(setAllSelected(!allSelected))} />
                  <span className="sx-check__box"><CheckIcon size={14} strokeWidth={3} /></span>
                  <span>Select All ({lines.length})</span>
                </label>
                <button type="button" onClick={() => dispatch(removeSelected())} disabled={selectedLines.length === 0}>
                  <TrashIcon size={18} /> Remove Selected
                </button>
                <button type="button" onClick={() => dispatch(clearCart())}>
                  Clear Cart
                </button>
                <button
                  type="button"
                  className="sx-actions__save"
                  onClick={saveSelectedForLater}
                >
                  <HeartIcon size={18} /> Save for Later
                </button>
              </div>
            </>
          )}
          <section className="sx-recommendations" aria-labelledby="sx-recommendations-title" data-testid="product-recommendations">
            <div className="sx-recommendations__head">
              <div><span>FIND YOUR NEXT FAVORITE</span><h2 id="sx-recommendations-title">You may also like</h2></div>
              <p>Made to move. Ready to go.</p>
            </div>
            <div className="sx-recommendations__grid">
              {cartShowcaseProducts.map((product) => {
                const cartLine = lines.find((line) => line.product.id === product.id);
                const quantity = cartLine?.item.quantity ?? 0;
                return (
                  <article className="sx-recommendation" key={product.id} data-testid="product-recommendation">
                    <div className="sx-recommendation__image"><img src={product.image} alt={product.name} /></div>
                    <div className="sx-recommendation__details">
                      <p>{product.type}</p>
                      <h3>{product.name}</h3>
                      <strong>{formatMoney(product.price)}</strong>
                      {cartLine && <span className="sx-recommendation__status">In Cart · {quantity}</span>}
                    </div>
                    <AddToCartButton
                      alreadyInCart={quantity > 0}
                      atQuantityLimit={quantity >= MAX_LINE_QUANTITY}
                      onAdd={() => addProduct(product.id)}
                    />
                  </article>
                );
              })}
            </div>
          </section>
          <p className="sx-notice" role="status">{notice}</p>
        </section>

        <div className="sx-cart__summary">
          <CartSummary totals={totals} canCheckout={selectedLines.length > 0} onCheckout={proceed} />
        </div>
      </div>
    </PageShell>
  );
}
