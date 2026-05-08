import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllOrders, getMyOrders, updateOrderStatus } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";
import OrderTrackingTimeline from "../components/OrderTrackingTimeline";

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

function formatStatus(status) {
  return (status || "PENDING").toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";
    case "SHIPPED":
      return "bg-amber-100 text-amber-700";
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    case "PENDING":
    default:
      return "bg-gray-200 text-gray-700";
  }
}

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
  const [actionError, setActionError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = isAdmin ? await getAllOrders() : await getMyOrders();
        setOrders(response.data);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAdmin, user?.id]);

  const handleStatusChange = async (orderId, nextStatus) => {
    const currentOrder = orders.find((order) => order.id === orderId);
    const currentStatus = currentOrder?.status || "PENDING";

    if (nextStatus === currentStatus) {
      return;
    }

    try {
      setActionError(null);
      setUpdatingOrderId(orderId);
      const response = await updateOrderStatus(orderId, nextStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? response.data : order))
      );
    } catch (err) {
      setActionError("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

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

      {actionError && (
        <div className="mb-4 rounded-md bg-red-50 text-red-700 px-4 py-3">
          {actionError}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">
            {isAdmin ? "No orders in the store yet" : "No orders yet"}
          </p>
          {!isAdmin && (
            <Link to="/products" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Start Shopping →
            </Link>
          )}
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
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadgeClass(order.status)}`}>
                    {formatStatus(order.status)}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ${Number(order.totalPrice).toFixed(2)}
                  </span>
                </div>
              </div>

              {isAdmin && (
                <div className="px-6 py-3 border-b bg-white flex items-center gap-3">
                  <span className="text-sm text-gray-600">Update status:</span>
                  <select
                    value={order.status || "PENDING"}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingOrderId === order.id}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <OrderTrackingTimeline status={order.status} />

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
