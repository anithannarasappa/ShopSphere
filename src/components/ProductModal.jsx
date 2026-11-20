function ProductModal({ product, onClose, onAddCart }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <img src={product.thumbnail} alt={product.title} />

        <span className="category-label">{product.category}</span>
        <h2>{product.title}</h2>
        <p>{product.description}</p>

        <h2 className="modal-price">${product.price}</h2>

        <div className="modal-details">
          <p>⭐ Rating: {product.rating} / 5</p>
          <p>🏷️ Discount: {product.discountPercentage.toFixed(1)}%</p>
          <p>📦 Stock: {product.stock}</p>
          <p>🏢 Brand: {product.brand || "N/A"}</p>
          <p>📂 Category: {product.category}</p>
        </div>

        <button className="primary-btn" onClick={onAddCart}>
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductModal;