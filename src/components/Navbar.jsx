function Navbar({
  activePage,
  changePage,
  darkMode,
  setDarkMode,
  cartCount,
  wishlistCount,
  compareCount
}) {
  const links = [
    ["home", "🏠 Home"],
    ["dashboard", "📊 Dashboard"],
    ["compare", `⚔️ Compare (${compareCount})`],
    ["wishlist", `❤️ Wishlist (${wishlistCount})`],
    ["cart", `🛒 Cart (${cartCount})`]
  ];

  return (
    <nav className="navbar">
      <div className="logo">🛍️ Shop<span>Sphere</span></div>

      <div className="nav-links">
        {links.map(([id, label]) => (
          <button
            key={id}
            className={activePage === id ? "nav-link active" : "nav-link"}
            onClick={() => changePage(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        className="theme-btn"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}

export default Navbar;