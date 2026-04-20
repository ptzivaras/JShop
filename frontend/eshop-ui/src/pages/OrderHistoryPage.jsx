import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrdersByUserId } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrdersByUserId(user.id);
        setOrders(response.data);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">No orders yet</p>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Start Shopping →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b">
                <div>
                  <span className="text-sm text-gray-500">Order #{order.id}</span>
                  <p className="text-sm text-gray-400">{formatDate(order.orderDate)}</p>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  ${Number(order.totalPrice).toFixed(2)}
                </span>
              </div>
              <div className="divide-y">
                {(order.orderItems || []).map((item) => (
                  <div key={item.id} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <Link
                        to={`/products/${item.productId}`}
                        className="font-medium text-gray-900 hover:text-indigo-600"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ${Number(item.unitPrice).toFixed(2)}
                      </p>
                    </div>
                    <span className="font-medium text-gray-700">
                      ${(item.quantity * Number(item.unitPrice)).toFixed(2)}
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
