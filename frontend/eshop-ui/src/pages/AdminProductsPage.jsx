import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../api/productApi";
import { getAllCategories } from "../api/categoryApi";

const LOW_STOCK_THRESHOLD = 5;

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);
        setProducts(productsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "Unknown";
  };

  const lowStockCount = useMemo(
    () => products.filter((p) => {
      const stock = Number(p.stockQuantity || 0);
      return stock > 0 && stock <= LOW_STOCK_THRESHOLD;
    }).length,
    [products]
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin - Products</h1>
        <Link
          to="/products/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No products found. <Link to="/products/new" className="text-indigo-600 hover:text-indigo-800">Create one</Link>.
        </div>
      ) : (
        <>
          <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm text-yellow-900">
            {lowStockCount > 0 ? (
              <span>{lowStockCount} product{lowStockCount === 1 ? "" : "s"} low on stock (≤ {LOW_STOCK_THRESHOLD}).</span>
            ) : (
              <span>All products have healthy inventory levels.</span>
            )}
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{product.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <Link to={`/products/${product.id}`} className="hover:text-indigo-600">
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{getCategoryName(product.categoryId)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${Number(product.price).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${product.stockQuantity > LOW_STOCK_THRESHOLD ? "bg-green-50 text-green-700" : product.stockQuantity > 0 ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"}`}>
                      {product.stockQuantity} {product.stockQuantity > 0 && product.stockQuantity <= LOW_STOCK_THRESHOLD ? "(Low)" : ""}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/products/${product.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
