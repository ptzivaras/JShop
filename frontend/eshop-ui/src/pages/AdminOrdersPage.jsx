import { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus } from "../api/orderApi";

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getAllOrders();
        setOrders(response.data || []);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, nextStatus) => {
    const currentOrder = orders.find((order) => order.id === orderId);
    const currentStatus = currentOrder?.status || "PENDING";

    if (nextStatus === currentStatus) {
      return;
    }

    try {
      setUpdatingOrderId(orderId);
      const response = await updateOrderStatus(orderId, nextStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? response.data : order))
      );
    } catch (err) {
      alert("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchTerm ||
      order.id.toString().includes(searchTerm) ||
      order.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderItems?.some((item) =>
        item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = !statusFilter || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin - Orders</h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by order ID, username, or product..."
          className="flex-1 min-w-64 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {formatStatus(status)}
            </option>
          ))}
        </select>
        {(searchTerm || statusFilter) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
            }}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          {orders.length === 0 ? "No orders found." : "No orders match your filters."}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b">
                <div>
                  <span className="text-sm text-gray-500">Order #{order.id}</span>
                  <p className="text-sm text-gray-400">{formatDate(order.orderDate)} • {order.username}</p>
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

              <div className="divide-y">
                {(order.orderItems || []).map((item) => (
                  <div key={item.id} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{item.productName}</span>
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
