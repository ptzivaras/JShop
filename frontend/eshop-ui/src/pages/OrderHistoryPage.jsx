import { Link } from "react-router-dom";

const mockOrders = [
  {
    id: 1,
    orderDate: "2026-04-10T14:30:00",
    totalPrice: 129.98,
    orderItems: [
      { id: 1, productId: 1, productName: "Wireless Headphones", quantity: 1, unitPrice: 79.99 },
      { id: 2, productId: 3, productName: "Coffee Maker", quantity: 1, unitPrice: 49.99 },
    ],
  },
  {
    id: 2,
    orderDate: "2026-04-08T09:15:00",
    totalPrice: 89.99,
    orderItems: [
      { id: 3, productId: 5, productName: "Mechanical Keyboard", quantity: 1, unitPrice: 89.99 },
    ],
  },
  {
    id: 3,
    orderDate: "2026-04-01T18:45:00",
    totalPrice: 189.97,
    orderItems: [
      { id: 4, productId: 2, productName: "Running Shoes", quantity: 1, unitPrice: 119.99 },
      { id: 5, productId: 8, productName: "Sunglasses", quantity: 1, unitPrice: 29.99 },
      { id: 6, productId: 4, productName: "Backpack", quantity: 1, unitPrice: 39.99 },
    ],
  },
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderHistoryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

      {mockOrders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">No orders yet</p>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Start Shopping →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {mockOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b">
                <div>
                  <span className="text-sm text-gray-500">Order #{order.id}</span>
                  <p className="text-sm text-gray-400">{formatDate(order.orderDate)}</p>
                </div>
                <span className="text-lg font-bold text-gray-900">${order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="divide-y">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <Link
                        to={`/products/${item.productId}`}
                        className="font-medium text-gray-900 hover:text-indigo-600"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}</p>
                    </div>
                    <span className="font-medium text-gray-700">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
