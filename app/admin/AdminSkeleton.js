export default function AdminSkeleton() {
  return (
    <div className="admin-skeleton-list" aria-label="Loading perfume inventory">
      {[0, 1, 2].map((item) => (
        <div className="admin-skeleton-row" key={item} aria-hidden="true">
          <div className="skeleton admin-skeleton-thumb" />
          <div className="admin-skeleton-copy">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-notes" />
          </div>
          <div className="skeleton admin-skeleton-price" />
        </div>
      ))}
    </div>
  );
}
