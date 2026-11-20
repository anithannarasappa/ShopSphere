import { useState, useEffect, useMemo } from "react";

import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import VoiceSearch from "./components/VoiceSearch";
import Dashboard from "./components/Dashboard";
import CompareProducts from "./components/CompareProducts";
import ShoppingAssistant from "./components/ShoppingAssistant";

import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("shopsphere-cart") || "[]")
  );

  const [wishlist, setWishlist] = useState(() =>
    JSON.parse(localStorage.getItem("shopsphere-wishlist") || "[]")
  );

  const [compare, setCompare] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activePage, setActivePage] = useState("home");
  const [darkMode, setDarkMode] = useState(false);

  // Save cart and wishlist
  useEffect(() => {
    localStorage.setItem("shopsphere-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("shopsphere-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const [productResponse, categoryResponse] = await Promise.all([
        fetch("https://dummyjson.com/products?limit=100"),
        fetch("https://dummyjson.com/products/categories"),
      ]);

      if (!productResponse.ok || !categoryResponse.ok) {
        throw new Error("Unable to fetch products. Please try again.");
      }

      const productData = await productResponse.json();
      const categoryData = await categoryResponse.json();

      setProducts(productData.products);
      setCategories(categoryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Search, filter and sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "all") {
      result = result.filter(p => p.category === category);
    }

    if (search.trim()) {
      result = result.filter(p =>
        `${p.title} ${p.brand || ""} ${p.category}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (activePage === "wishlist") {
      result = result.filter(p => wishlist.includes(p.id));
    }

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === "discount") {
      result.sort(
        (a, b) => b.discountPercentage - a.discountPercentage
      );
    }

    return result;
  }, [products, category, search, sort, activePage, wishlist]);

  // Shopping cart
  const addToCart = product => {
    setCart(previous => {
      const existing = previous.find(p => p.id === product.id);

      if (existing) {
        return previous.map(p =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...previous, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, amount) => {
    setCart(previous =>
      previous
        .map(p =>
          p.id === id
            ? { ...p, quantity: p.quantity + amount }
            : p
        )
        .filter(p => p.quantity > 0)
    );
  };

  const removeFromCart = id => {
    setCart(previous => previous.filter(p => p.id !== id));
  };

  const cartCount = cart.reduce((sum, p) => sum + p.quantity, 0);

  const cartTotal = cart.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  // Wishlist
  const toggleWishlist = id => {
    setWishlist(previous =>
      previous.includes(id)
        ? previous.filter(item => item !== id)
        : [...previous, id]
    );
  };

  // Compare up to 3 products
  const toggleCompare = product => {
    setCompare(previous => {
      if (previous.some(p => p.id === product.id)) {
        return previous.filter(p => p.id !== product.id);
      }

      if (previous.length >= 3) {
        alert("You can compare only 3 products.");
        return previous;
      }

      return [...previous, product];
    });
  };

  // Random discovery
  const randomDiscovery = () => {
    if (!products.length) return;

    const random = products[
      Math.floor(Math.random() * products.length)
    ];

    setSelectedProduct(random);
  };

  // Voice search
  const handleVoiceSearch = text => {
    setSearch(text);
    setCategory("all");
    setActivePage("home");
  };

  // Navigation
  const changePage = page => {
    setActivePage(page);
    setSearch("");
    setCategory("all");
  };

  // Product-aware shopping assistant
  const assistantResponse = question => {
    const q = question.toLowerCase();

    if (q.includes("cheap") || q.includes("budget")) {
      const result = [...products]
        .sort((a, b) => a.price - b.price)
        .slice(0, 3);

      return "Affordable products: " +
        result.map(p => `${p.title} ($${p.price})`).join(", ");
    }

    if (q.includes("rating") || q.includes("best")) {
      const result = [...products]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

      return "Top-rated products: " +
        result.map(p => `${p.title} (${p.rating} stars)`).join(", ");
    }

    if (q.includes("discount") || q.includes("offer")) {
      const result = [...products]
        .sort((a, b) => b.discountPercentage - a.discountPercentage)
        .slice(0, 3);

      return "Best discounts: " +
        result.map(
          p => `${p.title} (${p.discountPercentage.toFixed(1)}% off)`
        ).join(", ");
    }

    if (q.includes("how many") || q.includes("total")) {
      return `There are ${products.length} products in our collection.`;
    }

    if (q.includes("laptop")) {
      const result = products.filter(p =>
        p.title.toLowerCase().includes("laptop")
      );

      return result.length
        ? result.slice(0, 4).map(p => `${p.title}: $${p.price}`).join(", ")
        : "No laptops found.";
    }

    if (q.includes("phone") || q.includes("mobile")) {
      const result = products.filter(p =>
        p.category.toLowerCase().includes("smartphones")
      );

      return result.length
        ? result.slice(0, 4).map(p => `${p.title}: $${p.price}`).join(", ")
        : "No smartphones found.";
    }

    if (q.includes("compare")) {
      return `You have selected ${compare.length} products for comparison.`;
    }

    return "Try asking: Show cheap products, best ratings, discounts, laptops, phones or total products.";
  };

  return (
    <div className={darkMode ? "app dark" : "app light"}>

      <Navbar
        activePage={activePage}
        changePage={changePage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        compareCount={compare.length}
      />

      <main className="main-container">

        {activePage === "home" && (
          <>
            <section className="hero">
              <div>
                <span className="hero-tag">✨ SMART SHOPPING EXPERIENCE</span>
                <h1>
                  Discover Your <br />
                  <span>Perfect Product.</span>
                </h1>
                <p>
                  Explore amazing products, compare prices and shop smarter.
                </p>
                <button onClick={() =>
                  document.getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" })
                }>
                  Start Shopping →
                </button>
              </div>
              <div className="hero-icon">🛍️</div>
            </section>

            <section className="quick-stats">
              <div><span>📦</span><h2>{products.length}</h2><p>Products</p></div>
              <div><span>❤️</span><h2>{wishlist.length}</h2><p>Wishlist</p></div>
              <div><span>🛒</span><h2>{cartCount}</h2><p>Cart Items</p></div>
              <div><span>⚔️</span><h2>{compare.length}</h2><p>Compare</p></div>
            </section>

            <section className="product-section" id="products">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">EXPLORE OUR COLLECTION</span>
                  <h2>Discover Products</h2>
                </div>
                <button className="random-btn" onClick={randomDiscovery}>
                  🎲 Surprise Me
                </button>
              </div>

              <div className="search-controls">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="🔍 Search products or brands..."
                />

                <VoiceSearch onResult={handleVoiceSearch} />

                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(item => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <select value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="default">Sort By</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                  <option value="discount">Biggest Discount</option>
                </select>

                <button className="refresh-btn" onClick={fetchProducts}>
                  🔄 Refresh
                </button>
              </div>

              {loading && <div className="status">Loading products...</div>}

              {error && (
                <div className="status">
                  ⚠️ {error}
                  <button onClick={fetchProducts}>Try Again</button>
                </div>
              )}

              {!loading && !error && (
                <>
                  <p className="result-count">
                    Showing {filteredProducts.length} products
                  </p>

                  {filteredProducts.length === 0 ? (
                    <div className="status">No products found.</div>
                  ) : (
                    <div className="product-grid">
                      {filteredProducts.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isFavorite={wishlist.includes(product.id)}
                          isCompared={compare.some(p => p.id === product.id)}
                          onFavorite={() => toggleWishlist(product.id)}
                          onCompare={() => toggleCompare(product)}
                          onAddCart={() => addToCart(product)}
                          onView={() => setSelectedProduct(product)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        )}

        {activePage === "dashboard" && (
          <Dashboard products={products} cart={cart} />
        )}

        {activePage === "compare" && (
          <CompareProducts
            products={compare}
            onRemove={id =>
              setCompare(previous => previous.filter(p => p.id !== id))
            }
          />
        )}

        {activePage === "wishlist" && (
          <section className="product-section">
            <h2>❤️ My Wishlist</h2>
            {filteredProducts.length === 0 ? (
              <div className="status">Your wishlist is empty.</div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={true}
                    isCompared={compare.some(p => p.id === product.id)}
                    onFavorite={() => toggleWishlist(product.id)}
                    onCompare={() => toggleCompare(product)}
                    onAddCart={() => addToCart(product)}
                    onView={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {activePage === "cart" && (
          <section className="cart-section">
            <h2>🛒 My Shopping Cart</h2>

            {cart.length === 0 ? (
              <div className="status">Your cart is empty.</div>
            ) : (
              <>
                {cart.map(item => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.thumbnail} alt={item.title} />
                    <div className="cart-info">
                      <h3>{item.title}</h3>
                      <p>${item.price} each</p>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                        <strong>{item.quantity}</strong>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </div>
                ))}
                <h2 className="cart-total">Total: ${cartTotal.toFixed(2)}</h2>
              </>
            )}
          </section>
        )}

      </main>

      <ShoppingAssistant onAsk={assistantResponse} />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddCart={() => addToCart(selectedProduct)}
        />
      )}

      <footer className="footer">
        <h2>🛍️ ShopSphere</h2>
        <p>Shop Smart. Compare Better. Discover More.</p>
        <small>Powered by React and DummyJSON API</small>
      </footer>
    </div>
  );
}

export default App;