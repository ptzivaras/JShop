import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { searchProducts, deleteProduct } from "../api/productApi";
import { getAllCategories } from "../api/categoryApi";
import { useAuth } from "../context/AuthContext";

export default function ProductListPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const isAdmin = user?.role === "ADMIN";

  const fetchProducts = useCallback(async (q, categoryId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchProducts(q || "", categoryId || null);
      setProducts(response.data);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts("", "");
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(searchInput, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    fetchProducts(searchInput, val);
  };

  const handleReset = () => {
    setSearchInput("");
    setSelectedCategory("");
    fetchProducts("", "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        {isAdmin && (
          <Link
            to="/products/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            + Create Product
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products..."
          className="flex-1 min-w-48 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Search
        </button>
        {(searchInput || selectedCategory) && (
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Reset
          </button>
        )}
      </form>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading products...</div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No products found.{" "}
          {(searchInput || selectedCategory) && (
            <button onClick={handleReset} className="text-indigo-600 hover:text-indigo-800 font-medium">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
              <div className="bg-gray-200 h-48 flex items-center justify-center text-gray-400 text-sm">
                Image Placeholder
              </div>
              <div className="p-4">
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                  {product.categoryName}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                  <Link to={`/products/${product.id}`} className="hover:text-indigo-600">
                    {product.name}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <span className={`text-xs px-2 py-1 rounded ${product.stockQuantity > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
                  </span>
                </div>
                {isAdmin && (
                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/products/${product.id}/edit`}
                      className="flex-1 text-center text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 text-sm bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
