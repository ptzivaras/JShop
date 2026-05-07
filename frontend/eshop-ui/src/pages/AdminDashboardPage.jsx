import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllUsers } from "../api/userApi";
import { getAllOrders } from "../api/orderApi";
import { getAllProducts } from "../api/productApi";
import { getAllCategories } from "../api/categoryApi";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatStatus(status) {
  return (status || "PENDING")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [usersRes, ordersRes, productsRes, categoriesRes] = await Promise.all([
          getAllUsers(),
          getAllOrders(),
          getAllProducts(),
          getAllCategories(),
        ]);

        setUsers(usersRes.data || []);
        setOrders(ordersRes.data || []);
        setProducts(productsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
    const outOfStockCount = products.filter((p) => Number(p.stockQuantity || 0) <= 0).length;

    const statusCounts = orders.reduce((acc, order) => {
      const status = order.status || "PENDING";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      users: users.length,
      orders: orders.length,
      products: products.length,
      categories: categories.length,
      totalRevenue,
      outOfStockCount,
      statusCounts,
    };
  }, [users, orders, products, categories]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      .slice(0, 6);
  }, [orders]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">
        Loading dashboard...
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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/products/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            + Product
          </Link>
          <Link to="/categories" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
            Manage Categories
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Users</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.users}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.orders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Products</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.products}</p>
          <p className="text-xs text-red-600 mt-1">Out of stock: {stats.outOfStockCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalRevenue)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-5 py-4 border-b bg-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/orders" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="px-5 py-8 text-gray-500 text-sm">No orders yet.</div>
          ) : (
            <div className="divide-y">
              {recentOrders.map((order) => (
                <div key={order.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.orderDate)} • {formatStatus(order.status)}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(order.totalPrice)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
          <div className="space-y-3">
            {Object.keys(stats.statusCounts).length === 0 ? (
              <p className="text-sm text-gray-500">No status data yet.</p>
            ) : (
              Object.entries(stats.statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{formatStatus(status)}</span>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link to="/admin/products" className="block text-indigo-600 hover:text-indigo-800">Manage products</Link>
              <Link to="/admin/orders" className="block text-indigo-600 hover:text-indigo-800">Manage orders</Link>
              <Link to="/categories" className="block text-indigo-600 hover:text-indigo-800">Manage categories</Link>
            </div>
            <p className="text-xs text-gray-500 mt-4">Categories total: {stats.categories}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
