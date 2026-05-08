import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../api/orderApi";
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

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getOrderById(id);
        setOrder(response.data);
      } catch (err) {
        setError("Could not load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = async (status) => {
    if (!order || order.status === status) return;

    try {
      setUpdating(true);
      setActionError(null);
      const response = await updateOrderStatus(order.id, status);
      setOrder(response.data);
    } catch (err) {
      setActionError("Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center text-gray-500">
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center text-red-500">
        {error || "Order not found."}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <Link to="/orders" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            ← Back to Order History
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-3">Order #{order.id}</h1>
          <p className="text-gray-500 mt-1">Placed on {new Date(order.orderDate).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(order.status)}`}>
            {formatStatus(order.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white shadow rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Items</h2>
          <div className="divide-y">
            {order.orderItems.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <Link to={`/products/${item.productId}`} className="font-medium text-gray-900 hover:text-indigo-600">
                    {item.productName}
                  </Link>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${(Number(item.unitPrice) * item.quantity).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">${Number(item.unitPrice).toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
            <p className="text-gray-600 mt-2">Customer: {order.username}</p>
            <p className="text-gray-600">Total: ${Number(order.totalPrice).toFixed(2)}</p>
          </div>

          {user?.role === "ADMIN" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Update status</label>
              <select
                value={order.status || "PENDING"}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {actionError && (
            <div className="rounded-md bg-red-50 text-red-700 px-4 py-3 text-sm">{actionError}</div>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200">
        <OrderTrackingTimeline status={order.status} />
      </div>
    </div>
  );
}
