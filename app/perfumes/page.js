"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useProducts } from "../ProductsProvider";
import PerfumeCard from "../components/PerfumeCard";
import ProductSkeleton from "../components/ProductSkeleton";
import ScentFinder from "../components/ScentFinder";

export default function PerfumesPage() {
  const { products, loading, error, addToBag } = useProducts();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    const matches = products.filter((product) =>
      `${product.name} ${product.notes} ${product.label}`
        .toLocaleLowerCase()
        .includes(search),
    );
    if (sort === "price-low") {
      return [...matches].sort((a, b) => a.price - b.price);
    }
    if (sort === "price-high") {
      return [...matches].sort((a, b) => b.price - a.price);
    }
    return matches;
  }, [products, query, sort]);

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
      <section className="catalog-intro">
        <p className="eyebrow">The Lujainae collection</p>
        <h1>Find your <em>fragrance.</em></h1>
        <p>Thoughtful compositions for all the ways you move through a day.</p>
      </section>
      <section className="catalog section-shell">
        <div className="catalog-toolbar">
          <p className="catalog-count">
            {loading ? "Loading fragrances…" : `${filteredProducts.length} fragrances`}
          </p>
          <label className="catalog-search">
            <span className="visually-hidden">Search fragrances</span>
            <input
              type="search"
              placeholder="Search name or notes"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="catalog-sort">
            <span className="visually-hidden">Sort fragrances</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>
        {!loading && products.length ? (
          <ScentFinder products={products} onAdd={handleAdd} />
        ) : null}
        {error ? <p className="store-error">{error}</p> : null}
        {loading ? (
          <div className="product-grid catalog-grid" aria-label="Loading perfumes">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <ProductSkeleton key={item} />
            ))}
          </div>
        ) : filteredProducts.length ? (
          <div className="product-grid catalog-grid">
            {filteredProducts.map((product) => (
              <PerfumeCard product={product} onAdd={handleAdd} key={product.id} />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <h2>No fragrances found</h2>
            <p>Try a different search, or browse the full collection.</p>
            {query ? (
              <button className="text-link" onClick={() => setQuery("")}>
                Clear search
              </button>
            ) : (
              <Link className="text-link" href="/admin">
                Add your first fragrance
              </Link>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
