import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const linkClass = (path) =>
    `text-sm font-medium px-3 py-2 rounded-md transition-colors ${
      location.pathname === path
        ? "bg-indigo-700 text-white"
        : "text-indigo-100 hover:bg-indigo-500 hover:text-white"
    }`;

  return (
    <nav className="bg-indigo-600 sticky top-0 z-50 shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="text-xl font-bold text-white tracking-wide no-underline">
            JShop
          </Link>

          <div className="flex items-center gap-1">
            <Link to="/products" className={linkClass("/products")}>Products</Link>
            <Link to="/categories" className={linkClass("/categories")}>Categories</Link>
            <Link to="/orders" className={linkClass("/orders")}>Orders</Link>
            <Link to="/cart" className={linkClass("/cart")}>
              🛒 Cart
            </Link>
            <Link to="/profile" className={linkClass("/profile")}>Profile</Link>
            <Link
              to="/login"
              className="ml-2 text-sm font-medium px-4 py-2 rounded-md bg-white text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}