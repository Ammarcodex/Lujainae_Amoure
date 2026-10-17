"use client";

import Link from "next/link";
import { useProducts } from "../ProductsProvider";
import PerfumeCard from "../components/PerfumeCard";
import ProductSkeleton from "../components/ProductSkeleton";

export default function HotDealsPage() {
  const { products, loading, error, addToBag } = useProducts();
  const deals = products.filter(
    (product) =>
      typeof product.compareAtPrice === "number" &&
      product.compareAtPrice > product.price,
  );

  function handleAdd(product) {
    addToBag(product);
    window.dispatchEvent(
      new CustomEvent("storefront-toast", {
        detail: `${product.name} added to your bag`,
      }),
    );
  }

  return (
    <main id="main" className="catalog-page">
      <section className="catalog-intro deals-intro">
        <p className="eyebrow">A little something lovely</p>
        <h1>Hot <em>deals.</em></h1>
        <p>Discover a few signature scents at a softer price, while they last.</p>
        <Link className="text-link" href="/perfumes">
          Explore all fragrances <span aria-hidden="true">→</span>
        </Link>
      </section>
      <section className="catalog section-shell">
        <div className="catalog-toolbar">
          <p className="catalog-count">
            {loading ? "Loading offers…" : `${deals.length} special offers`}
          </p>
        </div>
        {error ? <p className="store-error">{error}</p> : null}
        {loading ? (
          <div className="product-grid catalog-grid" aria-label="Loading offers">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <ProductSkeleton key={item} />
            ))}
          </div>
        ) : deals.length ? (
          <div className="product-grid catalog-grid">
            {deals.map((product) => (
              <PerfumeCard product={product} onAdd={handleAdd} key={product.id} />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <h2>More lovely offers are on the way</h2>
            <p>In the meantime, take a look through the full fragrance collection.</p>
            <Link className="text-link" href="/perfumes">
              Shop all fragrances <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
