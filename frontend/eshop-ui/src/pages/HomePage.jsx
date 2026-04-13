import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to JShop</h1>
          <p className="text-xl text-indigo-100 mb-8">
            Your one-stop destination for quality products at great prices.
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition"
          >
            Browse Products
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-semibold mb-2">Wide Selection</h3>
            <p className="text-gray-500">Browse through our extensive catalog of products across multiple categories.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-500">Get your orders delivered quickly and reliably to your doorstep.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-lg font-semibold mb-2">Quality Assured</h3>
            <p className="text-gray-500">All products are vetted for quality so you can shop with confidence.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
