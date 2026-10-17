"use client";

import Link from "next/link";
import { useState } from "react";
import { useProducts } from "../ProductsProvider";
import { formatPrice } from "../currency";

function orderReference() {
  return `LA-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export default function CheckoutPage() {
  const { bag, clearBag } = useProducts();
  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);
  const subtotal = bag.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 100 ? 0 : 8;
  const total = subtotal + shipping;

  function updateCustomer(event) {
    const { name, value } = event.target;
    setCustomer((current) => ({ ...current, [name]: value }));
  }

  function placeOrder(event) {
    event.preventDefault();
    setError("");
    const receipt = {
      reference: orderReference(),
      customer,
      items: bag.map(({ id, name, price, quantity }) => ({
        id,
        name,
        price,
        quantity,
      })),
      subtotal,
      shipping,
      total,
      paymentMethod: "Cash on delivery",
      createdAt: new Date().toISOString(),
    };

    setOrder(receipt);
    clearBag();
  }

  if (order) {
    return (
      <main id="main" className="checkout-page">
        <section className="order-confirmation">
          <p className="eyebrow">COD CHECKOUT PREVIEW</p>
          <h1>Your next <em>favorite</em> is on its way.</h1>
          <p className="order-reference">
            Order reference <strong>{order.reference}</strong>
          </p>
          <p>
            Your cash-on-delivery total is {formatPrice(order.total)}. Payment would be due
            when your fragrance arrives.
          </p>
          <div className="local-order-notice" role="note">
            Checkout is in preview mode: no payment is taken and this order
            hasn&apos;t been sent to the store. Connect an order service before
            accepting live orders.
          </div>
          <Link className="button button-dark" href="/perfumes">
            Continue exploring <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>
    );
  }

  if (bag.length === 0) {
    return (
      <main id="main" className="checkout-page">
        <section className="order-confirmation">
          <p className="eyebrow">Your selection</p>
          <h1>Your bag is <em>empty.</em></h1>
          <p>Choose a fragrance before starting checkout.</p>
          <Link className="button button-dark" href="/perfumes">
            Browse fragrances <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main id="main" className="checkout-page">
      <div className="checkout-heading">
        <p className="eyebrow">A little closer to yours</p>
        <h1>Delivery <em>details.</em></h1>
        <p>We deliver your fragrances and collect payment at your door.</p>
      </div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={placeOrder}>
          <h2>Where should we send it?</h2>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <label htmlFor="customer-name">Full name</label>
          <input
            id="customer-name"
            name="fullName"
            autoComplete="name"
            value={customer.fullName}
            onChange={updateCustomer}
            required
          />
          <div className="checkout-form-row">
            <div>
              <label htmlFor="customer-email">Email address</label>
              <input
                id="customer-email"
                name="email"
                type="email"
                autoComplete="email"
                value={customer.email}
                onChange={updateCustomer}
                required
              />
            </div>
            <div>
              <label htmlFor="customer-phone">Phone number</label>
              <input
                id="customer-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={customer.phone}
                onChange={updateCustomer}
                required
              />
            </div>
          </div>
          <label htmlFor="customer-address">Street address</label>
          <input
            id="customer-address"
            name="address"
            autoComplete="street-address"
            value={customer.address}
            onChange={updateCustomer}
            required
          />
          <div className="checkout-form-row">
            <div>
              <label htmlFor="customer-city">City</label>
              <input
                id="customer-city"
                name="city"
                autoComplete="address-level2"
                value={customer.city}
                onChange={updateCustomer}
                required
              />
            </div>
            <div>
              <label htmlFor="customer-postal">Postal code</label>
              <input
                id="customer-postal"
                name="postalCode"
                autoComplete="postal-code"
                value={customer.postalCode}
                onChange={updateCustomer}
                required
              />
            </div>
          </div>
          <div className="payment-method">
            <span className="eyebrow">PAYMENT METHOD</span>
            <strong>Cash on delivery</strong>
            <p>Pay in cash when your order arrives. No online payment needed.</p>
          </div>
          <button className="button button-dark place-order-button" type="submit">
            Place COD order <span aria-hidden="true">→</span>
          </button>
        </form>

        <aside className="order-summary">
          <p className="eyebrow">YOUR ORDER</p>
          <h2>Order summary</h2>
          <div className="order-items">
            {bag.map((item) => (
              <div className="order-item" key={item.id}>
                <div>
                  <h3>{item.name}</h3>
                  <p>Qty {item.quantity}</p>
                </div>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="order-totals">
            <p><span>Subtotal</span><span>{formatPrice(subtotal)}</span></p>
            <p>
              <span>Delivery</span>
              <span>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</span>
            </p>
            <p className="order-total"><strong>Total due on delivery</strong><strong>{formatPrice(total)}</strong></p>
          </div>
          <p className="shipping-note">
            Complimentary delivery on orders over PKR 100.
          </p>
        </aside>
      </div>
    </main>
  );
}
