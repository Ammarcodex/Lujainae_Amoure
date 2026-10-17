"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useProducts } from "../../ProductsProvider";
import PerfumeCard from "../../components/PerfumeCard";
import ProductSkeleton from "../../components/ProductSkeleton";
import { formatPrice } from "../../currency";

export default function PerfumeDetailsPage() {
  const params = useParams();
  const { products, loading, error, addToBag } = useProducts();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = products.find((item) => item.id === id);
  const recommendations = products.filter((item) => item.id !== id);

  function handleAdd(item) {
    addToBag(item);
    window.dispatchEvent(
      new CustomEvent("storefront-toast", {
        detail: `${item.name} added to your bag`,
      }),
    );
  }

  if (loading) {
    return (
      <main id="main" className="product-detail-page">
        <section className="product-detail-loading" aria-label="Loading perfume">
          <div className="skeleton detail-skeleton-image" />
          <div className="detail-skeleton-copy">
            <div className="skeleton skeleton-notes" />
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-notes" />
            <div className="skeleton detail-skeleton-description" />
            <div className="skeleton detail-skeleton-button" />
          </div>
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main id="main" className="product-detail-page">
        <section className="product-not-found">
          {error ? <p className="store-error">{error}</p> : null}
          <p className="eyebrow">THE LUJAINAE COLLECTION</p>
          <h1>This fragrance isn&apos;t here.</h1>
          <p>It may have been removed or the link may be out of date.</p>
          <Link className="button button-dark" href="/perfumes">
            Browse all fragrances <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main id="main" className="product-detail-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/perfumes">Fragrances</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <section className="product-detail">
        <div className="product-detail-image">
          <img src={product.image} alt={product.alt} />
          {product.label ? (
            <span className="product-label">{product.label}</span>
          ) : null}
        </div>
        <div className="product-detail-copy">
          <p className="eyebrow">THE LUJAINAE COLLECTION</p>
          <h1>{product.name}</h1>
          <p className="product-detail-notes">{product.notes}</p>
          <p className="product-detail-description">
            {product.description ||
              `${product.name} is a considered fragrance, composed around ${product.notes.toLocaleLowerCase()} for a distinctive, lasting impression.`}
          </p>
          <p className="product-detail-price">
            {product.compareAtPrice ? (
              <del>{formatPrice(product.compareAtPrice)}</del>
            ) : null}
            <strong>{formatPrice(product.price)}</strong>
          </p>
          <button
            className="button button-dark product-detail-add"
            type="button"
            onClick={() => handleAdd(product)}
          >
            Add to bag <span aria-hidden="true">+</span>
          </button>
          <p className="product-detail-delivery">
            Complimentary delivery on orders over PKR 100.
          </p>
          <div className="product-detail-extra">
            <h2>A scent to make your own</h2>
            <p>
              Wear it close, let it unfold, and make it part of the moments
              that are yours.
            </p>
          </div>
        </div>
      </section>

      <section className="related-perfumes section-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Continue exploring</p>
            <h2>
              You may also <em>love.</em>
            </h2>
          </div>
          <Link className="text-link desktop-link" href="/perfumes">
            View all fragrances <span aria-hidden="true">→</span>
          </Link>
        </div>
        {error ? <p className="store-error">{error}</p> : null}
        {recommendations.length ? (
          <div className="product-grid">
            {recommendations.slice(0, 3).map((item) => (
              <PerfumeCard product={item} onAdd={handleAdd} key={item.id} />
            ))}
          </div>
        ) : (
          <p className="empty-search">
            More fragrances are on their way. Check back soon.
          </p>
        )}
        <Link className="text-link mobile-link" href="/perfumes">
          View all fragrances <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
