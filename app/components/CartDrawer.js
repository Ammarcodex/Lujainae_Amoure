"use client";

import { formatPrice } from "../currency";

export default function CartDrawer({ items, open, onClose, onRemove, onCheckout }) {
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <>
      {open ? (
        <button
          className="overlay"
          aria-label="Close shopping bag"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={`cart-drawer${open ? " is-open" : ""}`}
        aria-label="Shopping bag"
        aria-hidden={!open}
      >
        <div className="drawer-header">
          <div>
            <p className="eyebrow">YOUR SELECTION</p>
            <h2>
              Your bag <span className="drawer-count">({count})</span>
            </h2>
          </div>
          <button
            className="icon-button close-drawer"
            aria-label="Close shopping bag"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="cart-items">
          {items.length === 0 ? (
            <p className="empty-cart">
              Your bag is waiting for a little something.
            </p>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item.id}>
                <div>
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="cart-item-price">
                  <span>{formatPrice(item.price * item.quantity)}</span>
                  <button
                    className="remove-item"
                    onClick={() => onRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-subtotal">
            <span>Subtotal</span>
            <span className="subtotal-value">{formatPrice(subtotal)}</span>
          </div>
          <p>Shipping calculated at checkout.</p>
          <button
            className="button button-dark checkout-button"
            disabled={count === 0}
            onClick={onCheckout}
          >
            Continue to checkout <span aria-hidden="true">→</span>
          </button>
        </div>
      </aside>
    </>
  );
}
