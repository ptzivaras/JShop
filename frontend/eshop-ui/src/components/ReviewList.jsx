import { deleteReview } from "../api/reviewApi";
import { useAuth } from "../context/AuthContext";

export default function ReviewList({ reviews, onReviewDeleted, onEditReview }) {
  const { user } = useAuth();
  const [deletingId, setDeletingId] = null;

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      setDeletingId(reviewId);
      await deleteReview(reviewId);
      onReviewDeleted(reviewId);
    } catch (err) {
      alert("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-900">{review.userName}</p>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600 text-sm">{review.rating}/5</span>
              </div>
            </div>
            {user?.id === review.userId && (
              <div className="flex gap-2">
                <button
                  onClick={() => onEditReview(review)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  disabled={deletingId === review.id}
                  className="text-sm text-red-600 hover:text-red-800 font-medium disabled:text-gray-400"
                >
                  {deletingId === review.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>

          {review.comment && (
            <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
          )}

          <p className="text-gray-500 text-xs">
            {new Date(review.createdAt).toLocaleDateString()}
            {review.updatedAt !== review.createdAt && " (edited)"}
          </p>
        </div>
      ))}
    </div>
  );
}
