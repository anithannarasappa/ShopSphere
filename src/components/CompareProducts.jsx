function CompareProducts({ products, onRemove }) {
  if (!products.length) {
    return (
      <div className="status">
        <h2>⚔️ No products selected</h2>
        <p>Go to Home and select products to compare.</p>
      </div>
    );
  }

  const lowestPrice = Math.min(...products.map(p => p.price));
  const highestRating = Math.max(...products.map(p => p.rating));

  return (
    <section className="compare-section">
      <span className="eyebrow">SMART PRODUCT COMPARISON</span>
      <h1>⚔️ Compare Products</h1>
      <p className="muted">Compare up to three products side by side.</p>

      <div className="compare-grid">
        {products.map(product => (
          <div className="compare-card" key={product.id}>
            <img src={product.thumbnail} alt={product.title} />
            <h3>{product.title}</h3>
            <p className="category-label">{product.category}</p>

            <div className="compare-row">
              <span>Price</span><strong>${product.price}</strong>
            </div>
            <div className="compare-row">
              <span>Rating</span><strong>⭐ {product.rating}</strong>
            </div>
            <div className="compare-row">
              <span>Discount</span>
              <strong>{product.discountPercentage.toFixed(1)}%</strong>
            </div>
            <div className="compare-row">
              <span>Stock</span><strong>{product.stock}</strong>
            </div>
            <div className="compare-row">
              <span>Brand</span><strong>{product.brand || "N/A"}</strong>
            </div>

            {product.price === lowestPrice && (
              <span className="winner">🏆 Lowest Price</span>
            )}
            {product.rating === highestRating && (
              <span className="winner">⭐ Highest Rating</span>
            )}

            <button className="remove-btn" onClick={() => onRemove(product.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CompareProducts;