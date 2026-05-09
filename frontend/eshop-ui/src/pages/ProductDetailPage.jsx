import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, deleteProduct } from "../api/productApi";
import { addItemToCart } from "../api/cartApi";
import { getProductReviews, getProductRatingSummary, createReview, updateReview } from "../api/reviewApi";
import { addToWishlist, isProductInWishlist } from "../api/wishlistApi";
import { useAuth } from "../context/AuthContext";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

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
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistProcessing, setWishlistProcessing] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const [reviewsRes, summaryRes] = await Promise.all([
          getProductReviews(id),
          getProductRatingSummary(id),
        ]);
        setReviews(reviewsRes.data);
        setRatingSummary(summaryRes.data);
      } catch (err) {
        console.error("Failed to load reviews");
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!user) {
        setIsInWishlist(false);
        return;
      }

      try {
        setWishlistLoading(true);
        const response = await isProductInWishlist(id);
        setIsInWishlist(response.data);
      } catch (err) {
        console.error("Failed to load wishlist status");
      } finally {
        setWishlistLoading(false);
      }
    };

    fetchWishlistStatus();
  }, [id, user]);

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

  const handleAddToWishlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setWishlistProcessing(true);
      await addToWishlist(product.id);
      setIsInWishlist(true);
    } catch (err) {
      console.error(err);
    } finally {
      setWishlistProcessing(false);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError("");

      if (editingReviewId) {
        await updateReview(editingReviewId, reviewData);
      } else {
        await createReview(id, reviewData);
      }

      // Refresh reviews
      const [reviewsRes, summaryRes] = await Promise.all([
        getProductReviews(id),
        getProductRatingSummary(id),
      ]);
      setReviews(reviewsRes.data);
      setRatingSummary(summaryRes.data);
      setEditingReviewId(null);
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReviewDeleted = (reviewId) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
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
            <div className="flex flex-col gap-3 mt-8 sm:flex-row">
              <button
                onClick={handleAddToCart}
                disabled={adding || product.stockQuantity <= 0}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:bg-indigo-300 disabled:cursor-not-allowed"
              >
                {adding ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={handleAddToWishlist}
                disabled={wishlistLoading || wishlistProcessing}
                className={`flex-1 ${isInWishlist ? "bg-gray-200 text-gray-700" : "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50"} py-3 rounded-lg transition font-medium disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {wishlistLoading || wishlistProcessing
                  ? "Saving..."
                  : isInWishlist
                  ? "In Wishlist"
                  : "Add to Wishlist"}
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

      {/* Reviews Section */}
      <div className="mt-8">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          {ratingSummary && (
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.round(ratingSummary.averageRating) ? "text-yellow-400" : "text-gray-300"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-gray-700 font-semibold">
                {ratingSummary.averageRating.toFixed(1)} ({ratingSummary.totalReviews} reviews)
              </span>
            </div>
          )}
        </div>

        {user?.role === "CUSTOMER" && (
          <>
            {reviewError && (
              <div className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded">
                {reviewError}
              </div>
            )}
            <ReviewForm
              onSubmit={handleReviewSubmit}
              isLoading={submittingReview}
              initialRating={editingReviewId ? reviews.find((r) => r.id === editingReviewId)?.rating || 5 : 5}
              initialComment={editingReviewId ? reviews.find((r) => r.id === editingReviewId)?.comment || "" : ""}
            />
          </>
        )}

        {reviewsLoading ? (
          <div className="text-center py-8 text-gray-500">Loading reviews...</div>
        ) : (
          <ReviewList reviews={reviews} onReviewDeleted={handleReviewDeleted} onEditReview={handleEditReview} />
        )}
      </div>
    </div>
  );
}
