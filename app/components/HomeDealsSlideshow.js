"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "../currency";

export default function HomeDealsSlideshow({ deals, loading, onAdd }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || deals.length < 2) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % deals.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [deals.length, paused]);

  if (loading) {
    return (
      <section className="home-deals section-shell" aria-label="Featured hot deals">
        <div className="home-deals-skeleton skeleton" />
      </section>
    );
  }
  if (!deals.length) return null;

  const product = deals[active % deals.length];
  const savings = Math.round(
    ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
  );

  function moveBy(amount) {
    setActive((current) => (current + amount + deals.length) % deals.length);
  }

  return (
    <section
      className="home-deals section-shell"
      aria-roledescription="carousel"
      aria-label="Hot deal highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="home-deals-heading">
        <p className="eyebrow">A little treat for your scent wardrobe</p>
        <h2>Hot deals, <em>worth a closer look.</em></h2>
      </div>
      <article className="deal-feature">
        <Link
          className="deal-feature-image"
          href={`/perfumes/${encodeURIComponent(product.id)}`}
          aria-label={`View ${product.name}`}
          key={`image-${product.id}`}
        >
          <img src={product.image} alt={product.alt} />
          <span className="deal-discount">SAVE {savings}%</span>
        </Link>
        <div className="deal-feature-copy" key={`copy-${product.id}`}>
          <p className="eyebrow">THE SCENT SPOTLIGHT · {String(active + 1).padStart(2, "0")} / {String(deals.length).padStart(2, "0")}</p>
          <h3>{product.name}</h3>
          <p className="deal-feature-notes">{product.notes}</p>
          <p className="deal-feature-description">
            {product.description || `Discover ${product.name}, a distinctive blend of ${product.notes.toLocaleLowerCase()}.`}
          </p>
          <p className="deal-feature-price">
            <del>{formatPrice(product.compareAtPrice)}</del>
            <strong>{formatPrice(product.price)}</strong>
          </p>
          <div className="deal-feature-actions">
            <Link className="button button-dark" href={`/perfumes/${encodeURIComponent(product.id)}`}>
              Discover this scent <span aria-hidden="true">→</span>
            </Link>
            <button
              className="deal-add-button"
              type="button"
              onClick={() => onAdd(product)}
              aria-label={`Add ${product.name} to bag`}
            >
              Add to bag <span aria-hidden="true">+</span>
            </button>
          </div>
          <div className="deal-carousel-controls" aria-label="Hot deal controls">
            <button type="button" onClick={() => moveBy(-1)} aria-label="Previous hot deal">←</button>
            <div className="deal-carousel-dots">
              {deals.map((deal, index) => (
                <button
                  key={deal.id}
                  type="button"
                  aria-label={`Show ${deal.name}`}
                  aria-current={active === index ? "true" : undefined}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
            <button type="button" onClick={() => moveBy(1)} aria-label="Next hot deal">→</button>
          </div>
        </div>
      </article>
      <Link className="text-link home-deals-all" href="/hot-deals">
        Shop all hot deals <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
