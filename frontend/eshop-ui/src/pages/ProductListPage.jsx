import { Link } from "react-router-dom";

const mockProducts = [
  { id: 1, name: "Wireless Headphones", description: "Noise-canceling over-ear headphones", price: 79.99, stockQuantity: 25, categoryId: 1, categoryName: "Electronics" },
  { id: 2, name: "Running Shoes", description: "Lightweight running shoes for daily training", price: 119.99, stockQuantity: 40, categoryId: 2, categoryName: "Sports" },
  { id: 3, name: "Coffee Maker", description: "12-cup programmable coffee maker", price: 49.99, stockQuantity: 15, categoryId: 3, categoryName: "Home & Kitchen" },
  { id: 4, name: "Backpack", description: "Water-resistant laptop backpack 15.6 inch", price: 39.99, stockQuantity: 60, categoryId: 4, categoryName: "Accessories" },
  { id: 5, name: "Mechanical Keyboard", description: "RGB mechanical gaming keyboard", price: 89.99, stockQuantity: 30, categoryId: 1, categoryName: "Electronics" },
  { id: 6, name: "Yoga Mat", description: "Non-slip exercise yoga mat 6mm", price: 24.99, stockQuantity: 50, categoryId: 2, categoryName: "Sports" },
  { id: 7, name: "Desk Lamp", description: "LED desk lamp with adjustable brightness", price: 34.99, stockQuantity: 20, categoryId: 3, categoryName: "Home & Kitchen" },
  { id: 8, name: "Sunglasses", description: "Polarized UV protection sunglasses", price: 29.99, stockQuantity: 35, categoryId: 4, categoryName: "Accessories" },
];

export default function ProductListPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Link
          to="/products/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Create Product
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
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
              <div className="flex gap-2 mt-4">
                <Link
                  to={`/products/${product.id}/edit`}
                  className="flex-1 text-center text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition"
                >
                  Edit
                </Link>
                <button className="flex-1 text-sm bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100 transition">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
