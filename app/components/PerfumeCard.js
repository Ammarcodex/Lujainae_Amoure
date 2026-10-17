import Link from "next/link";
import { formatPrice } from "../currency";

export default function PerfumeCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <Link
          className="product-image-trigger"
          href={`/perfumes/${encodeURIComponent(product.id)}`}
          aria-label={`View details for ${product.name}`}
        >
          {product.label ? (
            <span className="product-label">{product.label}</span>
          ) : null}
          <img src={product.image} alt={product.alt} loading="lazy" />
        </Link>
        <button
          className="quick-add"
          type="button"
          onClick={() => onAdd(product)}
          aria-label={`Add ${product.name} to bag`}
        >
          Add to bag <span aria-hidden="true">+</span>
        </button>
      </div>
      <div className="product-info">
        <div>
          <h3>
            <Link
              className="product-name-trigger"
              href={`/perfumes/${encodeURIComponent(product.id)}`}
            >
              {product.name}
            </Link>
          </h3>
          <p>{product.notes}</p>
        </div>
        <span className="product-price">
          {product.compareAtPrice ? (
            <del>{formatPrice(product.compareAtPrice)}</del>
          ) : null}
          <strong>{formatPrice(product.price)}</strong>
        </span>
      </div>
    </article>
  );
}
