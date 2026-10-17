"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const HomeBottleScene = dynamic(() => import("./HomeBottleScene"), {
  ssr: false,
  loading: () => <div className="home-bottle-scene-loading" aria-hidden="true" />,
});

export default function HomeBottleGallery({ products }) {
  const featuredProducts = useMemo(() => products.slice(0, 3), [products]);
  const [selectedId, setSelectedId] = useState(featuredProducts[0]?.id ?? "");
  const selectedProduct =
    featuredProducts.find((product) => product.id === selectedId) ??
    featuredProducts[0];

  useEffect(() => {
    if (!featuredProducts.some((product) => product.id === selectedId)) {
      setSelectedId(featuredProducts[0]?.id ?? "");
    }
  }, [featuredProducts, selectedId]);

  const selectProduct = useCallback((id) => {
    setSelectedId(id);
  }, []);

  if (!featuredProducts.length) return null;

  return (
    <section className="home-bottle-gallery" aria-labelledby="home-bottle-title">
      <div className="home-bottle-heading">
        <p className="eyebrow light">A fragrance, in another dimension</p>
        <h2 id="home-bottle-title">
          Meet your next <em>signature.</em>
        </h2>
        <p>Select a bottle to bring its story into focus.</p>
      </div>

      <div className="home-bottle-stage">
        <div className="home-bottle-canvas-backdrop" aria-hidden="true" />
        <HomeBottleScene
          products={featuredProducts}
          selectedId={selectedProduct.id}
          onSelect={selectProduct}
        />
        <span className="home-bottle-stage-note" aria-hidden="true">
          LUJINAE AMOURE · OBJECTS OF SCENT
        </span>
      </div>

      <div className="home-bottle-selection" aria-live="polite">
        <div>
          <span className="home-bottle-selection-label">Your selection</span>
          <h3>{selectedProduct.name}</h3>
          <p>{selectedProduct.notes}</p>
        </div>
        <Link
          className="button button-light"
          href={`/perfumes/${encodeURIComponent(selectedProduct.id)}`}
        >
          Discover this scent <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="home-bottle-picker" role="group" aria-label="Choose a perfume bottle">
        {featuredProducts.map((product, index) => (
          <button
            className={`home-bottle-choice${product.id === selectedProduct.id ? " is-selected" : ""}`}
            type="button"
            key={product.id}
            aria-pressed={product.id === selectedProduct.id}
            aria-label={`Select ${product.name}, ${product.notes}`}
            onClick={() => selectProduct(product.id)}
          >
            <span className="home-bottle-choice-index">0{index + 1}</span>
            <span className="home-bottle-choice-copy">
              <strong>{product.name}</strong>
              <span>{product.notes}</span>
            </span>
            <span className="home-bottle-choice-arrow" aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <Link className="home-bottle-all-link" href="/perfumes">
        Explore the full collection <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
