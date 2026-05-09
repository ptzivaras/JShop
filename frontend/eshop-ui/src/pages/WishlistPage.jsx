import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyWishlist, removeFromWishlist } from "../api/wishlistApi";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await getMyWishlist();
        setWishlist(response.data);
      } catch (err) {
        setError("Unable to load wishlist.");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);
      await removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err) {
      setError("Failed to remove item from wishlist.");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-500">Loading wishlist...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500">Save favorites for later shopping.</p>
        </div>
      </div>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 p-4 rounded">{error}</div>}

      {wishlist.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-600">
          Your wishlist is empty.
          <div className="mt-4">
            <Link to="/products" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Browse products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900">{item.productName}</h2>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{item.productDescription}</p>
                <div className="mt-4 flex items-center justify-between text-gray-900 font-semibold">
                  <span>${item.productPrice.toFixed(2)}</span>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    disabled={removingId === item.productId}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    {removingId === item.productId ? "Removing..." : "Remove"}
                  </button>
                </div>
                <Link
                  to={`/products/${item.productId}`}
                  className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View product →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
