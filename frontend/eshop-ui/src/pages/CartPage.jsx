import { Link } from "react-router-dom";

const mockCartItems = [
  { id: 1, productId: 1, productName: "Wireless Headphones", productPrice: 79.99, quantity: 1 },
  { id: 2, productId: 3, productName: "Coffee Maker", productPrice: 49.99, quantity: 2 },
  { id: 3, productId: 5, productName: "Mechanical Keyboard", productPrice: 89.99, quantity: 1 },
];

export default function CartPage() {
  const total = mockCartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {mockCartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Browse Products →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {mockCartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                Image
              </div>
              <div className="flex-1">
                <Link to={`/products/${item.productId}`} className="font-semibold text-gray-900 hover:text-indigo-600">
                  {item.productName}
                </Link>
                <p className="text-gray-500 text-sm">${item.productPrice.toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 bg-gray-100 rounded hover:bg-gray-200 transition text-lg">−</button>
                <span className="w-10 text-center font-medium">{item.quantity}</span>
                <button className="w-8 h-8 bg-gray-100 rounded hover:bg-gray-200 transition text-lg">+</button>
              </div>
              <div className="text-right w-24">
                <p className="font-bold text-gray-900">${(item.productPrice * item.quantity).toFixed(2)}</p>
              </div>
              <button className="text-red-500 hover:text-red-700 ml-2">✕</button>
            </div>
          ))}

          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <div className="flex items-center justify-between text-xl font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium">
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
