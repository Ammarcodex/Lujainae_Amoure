"use client";

import Link from "next/link";
import { useProducts } from "../ProductsProvider";
import PerfumeCard from "../components/PerfumeCard";
import ProductSkeleton from "../components/ProductSkeleton";

const PROJECT_PERFUME_IDS = [
  "oud-reverie",
  "amber-veil",
  "saffron-dusk",
  "velvet-bloom",
  "rosewater-no-4",
  "midnight-rose",
  "citrus-no-9",
  "desert-bloom",
];

export default function ProjectAmourePage() {
  const { products, loading, error, addToBag } = useProducts();
  const projectPerfumes = PROJECT_PERFUME_IDS
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);

  function handleAdd(product) {
    addToBag(product);
    window.dispatchEvent(
      new CustomEvent("storefront-toast", {
        detail: `${product.name} added to your bag`,
      }),
    );
  }

  return (
    <main id="main" className="project-page">
      <section className="project-hero">
        <div className="project-hero-image" aria-hidden="true" />
        <div className="project-hero-copy">
          <p className="eyebrow light">A LUJAINAE AMOURE COLLECTION</p>
          <h1>Project <em>AMOURE</em><br />+ SCENTS</h1>
          <p>
            Eight distinctive fragrances. Eight ways to leave a little
            impression.
          </p>
          <a className="button button-light" href="#project-fragrances">
            Discover the collection <span aria-hidden="true">↓</span>
          </a>
        </div>
        <span className="project-hero-mark" aria-hidden="true">L · A</span>
      </section>

      <section className="project-intro">
        <p className="eyebrow">The art of a signature</p>
        <h2>Made for the moments<br /><em>that become yours.</em></h2>
        <p>
          From glowing amber and polished woods to soft florals and bright
          citrus, explore eight carefully composed scents in the AMOURE
          collection.
        </p>
      </section>

      <section className="project-products section-shell" id="project-fragrances">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PROJECT AMOURE + SCENTS</p>
            <h2>The collection, <em>in full.</em></h2>
          </div>
          <Link className="text-link desktop-link" href="/perfumes">
            Browse all fragrances <span aria-hidden="true">→</span>
          </Link>
        </div>
        <p className="project-product-count">
          {loading ? "Preparing the collection…" : `${projectPerfumes.length} signature fragrances`}
        </p>
        {error ? <p className="store-error">{error}</p> : null}
        {loading ? (
          <div className="product-grid catalog-grid" aria-label="Loading project fragrances">
            {PROJECT_PERFUME_IDS.map((id) => <ProductSkeleton key={id} />)}
          </div>
        ) : projectPerfumes.length ? (
          <div className="product-grid catalog-grid project-product-grid">
            {projectPerfumes.map((product) => (
              <PerfumeCard product={product} onAdd={handleAdd} key={product.id} />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <h2>The collection is being composed</h2>
            <p>Visit the full catalogue to discover our available fragrances.</p>
            <Link className="text-link" href="/perfumes">
              Browse all fragrances <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </section>

      <section className="project-signoff">
        <p className="eyebrow light">Lujainae Amoure</p>
        <p>Wear the feeling. Keep the moment.</p>
        <Link className="text-link" href="/hot-deals">
          Discover current offers <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
