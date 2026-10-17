export default function PerfumeCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-image">
        {product.label ? (
          <span className="product-label">{product.label}</span>
        ) : null}
        <img src={product.image} alt={product.alt} loading="lazy" />
        <button
          className="quick-add"
          onClick={() => onAdd(product)}
          aria-label={`Add ${product.name} to bag`}
        >
          Add to bag <span aria-hidden="true">+</span>
        </button>
      </div>
      <div className="product-info">
        <div>
          <h3>{product.name}</h3>
          <p>{product.notes}</p>
        </div>
        <span>${product.price}</span>
      </div>
    </article>
  );
}
