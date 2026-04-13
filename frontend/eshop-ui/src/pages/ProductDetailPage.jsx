import { useParams, Link } from "react-router-dom";

const mockProduct = {
  id: 1,
  name: "Wireless Headphones",
  description:
    "Premium noise-canceling over-ear headphones with 30-hour battery life. Features active noise cancellation, comfortable memory foam ear cushions, and high-fidelity audio drivers for an immersive listening experience.",
  price: 79.99,
  stockQuantity: 25,
  categoryId: 1,
  categoryName: "Electronics",
};

export default function ProductDetailPage() {
  const { id } = useParams();

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
              {mockProduct.categoryName}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-3">{mockProduct.name}</h1>
            <p className="text-sm text-gray-400 mt-1">Product ID: {id}</p>
            <p className="text-gray-600 mt-4 leading-relaxed">{mockProduct.description}</p>
            <div className="mt-6">
              <span className="text-3xl font-bold text-gray-900">${mockProduct.price.toFixed(2)}</span>
            </div>
            <div className="mt-2">
              <span className={`text-sm px-2 py-1 rounded ${mockProduct.stockQuantity > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {mockProduct.stockQuantity > 0 ? `${mockProduct.stockQuantity} in stock` : "Out of stock"}
              </span>
            </div>
            <div className="flex gap-3 mt-8">
              <button className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium">
                Add to Cart
              </button>
              <Link
                to={`/products/${id}/edit`}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-center"
              >
                Edit
              </Link>
              <button className="px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
