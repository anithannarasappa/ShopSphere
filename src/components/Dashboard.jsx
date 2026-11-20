import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend
} from "recharts";

function Dashboard({ products, cart }) {
  if (!products.length) {
    return <h2 className="status">Loading dashboard...</h2>;
  }

  const categories = Object.values(
    products.reduce((acc, p) => {
      if (!acc[p.category]) {
        acc[p.category] = { name: p.category, products: 0 };
      }
      acc[p.category].products++;
      return acc;
    }, {})
  );

  const topProducts = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)
    .map(p => ({
      name: p.title.slice(0, 15),
      rating: p.rating
    }));

  const averagePrice =
    products.reduce((sum, p) => sum + p.price, 0) / products.length;

  const averageRating =
    products.reduce((sum, p) => sum + p.rating, 0) / products.length;

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  const cartValue = cart.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  const colors = [
    "#8B5CF6", "#EC4899", "#F59E0B", "#10B981",
    "#3B82F6", "#EF4444", "#14B8A6", "#A855F7"
  ];

  return (
    <section className="dashboard">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">BUSINESS INTELLIGENCE</span>
          <h1>📊 Shopping Analytics</h1>
          <p>Insights from real DummyJSON product data.</p>
        </div>
        <span className="data-label">● DATA LOADED</span>
      </div>

      <div className="analytics-stats">
        <div className="analytics-card">
          <span>📦</span><p>Total Products</p><h2>{products.length}</h2>
        </div>
        <div className="analytics-card">
          <span>💰</span><p>Average Price</p><h2>${averagePrice.toFixed(2)}</h2>
        </div>
        <div className="analytics-card">
          <span>⭐</span><p>Average Rating</p><h2>{averageRating.toFixed(2)}</h2>
        </div>
        <div className="analytics-card">
          <span>🏬</span><p>Total Stock</p><h2>{totalStock}</h2>
        </div>
        <div className="analytics-card">
          <span>🛒</span><p>Cart Value</p><h2>${cartValue.toFixed(2)}</h2>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-box">
          <h3>📊 Products by Category</h3>
          <p>Number of products in each category</p>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={categories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-20} textAnchor="end" height={80} interval={0} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="products" fill="#8B5CF6" radius={[7, 7, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>🍩 Category Distribution</h3>
          <p>Product share by category</p>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categories}
                dataKey="products"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categories.map((item, index) => (
                  <Cell key={item.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box full-chart">
          <h3>⭐ Top Rated Products</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="rating" fill="#F59E0B" radius={[7, 7, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="insights-box">
        <h2>💡 Smart Shopping Insights</h2>
        {[...categories]
          .sort((a, b) => b.products - a.products)
          .slice(0, 3)
          .map((item, index) => (
            <p key={item.name}>
              {index + 1}. <strong>{item.name}</strong> has {item.products} products.
            </p>
          ))}
      </div>
    </section>
  );
}

export default Dashboard;