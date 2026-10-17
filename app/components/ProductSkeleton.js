export default function ProductSkeleton() {
  return (
    <article className="product-card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-image" />
      <div className="skeleton-product-info">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-notes" />
      </div>
    </article>
  );
}
