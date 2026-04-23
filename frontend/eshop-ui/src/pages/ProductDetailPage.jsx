import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, deleteProduct } from "../api/productApi";
import { addItemToCart } from "../api/cartApi";
import { useAuth } from "../context/AuthContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addMessage, setAddMessage] = useState("");
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      navigate("/products");
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (product.stockQuantity <= 0) {
      setAddMessage("This product is out of stock.");
      return;
    }

    try {
      setAdding(true);
      setAddMessage("");
      await addItemToCart({
        productId: product.id,
        quantity,
      });
      setAddMessage("Product added to cart.");
    } catch (err) {
      setAddMessage("Failed to add product to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-red-500">
        {error || "Product not found."}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/products" className="text-indigo-600 hover:text-indigo-800 text-sm mb-6 inline-block">
        ← Back to Products
      </Link>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 bg-gray-200 h-80 flex items-center justify-center text-gray-400">
            Image Placeholder
          </div>
          <div className="md:w-1/2 p-8">
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              {product.categoryName}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-3">{product.name}</h1>
            <p className="text-sm text-gray-400 mt-1">Product ID: {product.id}</p>
            <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>
            <div className="mt-6">
              <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            </div>
            <div className="mt-2">
              <span className={`text-sm px-2 py-1 rounded ${product.stockQuantity > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <label htmlFor="quantity" className="text-sm text-gray-600">
                Qty
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={Math.max(product.stockQuantity || 1, 1)}
                value={quantity}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (Number.isNaN(value)) return;
                  const bounded = Math.max(1, Math.min(value, Math.max(product.stockQuantity || 1, 1)));
                  setQuantity(bounded);
                }}
                className="w-20 border border-gray-300 rounded px-2 py-1"
              />
            </div>
            {addMessage && (
              <p className={`mt-3 text-sm ${addMessage.includes("Failed") || addMessage.includes("out of stock") ? "text-red-600" : "text-green-600"}`}>
                {addMessage}
              </p>
            )}
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleAddToCart}
                disabled={adding || product.stockQuantity <= 0}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:bg-indigo-300 disabled:cursor-not-allowed"
              >
                {adding ? "Adding..." : "Add to Cart"}
              </button>
              {isAdmin && (
                <>
                  <Link
                    to={`/products/${id}/edit`}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
