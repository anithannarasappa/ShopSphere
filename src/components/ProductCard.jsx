function ProductCard({
  product,
  isFavorite,
  isCompared,
  onFavorite,
  onCompare,
  onAddCart,
  onView
}) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.thumbnail} alt={product.title} />
        <span className="discount">
          -{product.discountPercentage.toFixed(0)}%
        </span>
        <button className="heart-btn" onClick={onFavorite}>
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="product-content">
        <span className="category-label">{product.category}</span>
        <h3>{product.title}</h3>
        <p className="muted">{product.brand || "ShopSphere Collection"}</p>

        <p>⭐ {product.rating} / 5</p>
        <p className="muted">Stock: {product.stock}</p>

        <div className="price">
          <strong>${product.price}</strong>
          <del>
            ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
          </del>
        </div>

        <button className="primary-btn" onClick={onView}>
          View Details
        </button>

        <div className="card-actions">
          <button onClick={onAddCart}>🛒 Add to Cart</button>
          <button onClick={onCompare}>
            {isCompared ? "✓ Added" : "⚖ Compare"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;