import { useEffect, useState } from "react";
import {
  getAllDiscounts,
  createDiscount,
  deleteDiscount,
  toggleDiscount,
} from "../api/discountApi";

const emptyForm = {
  code: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minOrderValue: "",
  maxUses: "",
  expiresAt: "",
  active: true,
};

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const res = await getAllDiscounts();
      setDiscounts(res.data);
    } catch {
      setError("Failed to load discounts.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        code: form.code.toUpperCase(),
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue),
        minOrderValue: form.minOrderValue ? parseFloat(form.minOrderValue) : null,
        maxUses: form.maxUses ? parseInt(form.maxUses) : null,
        expiresAt: form.expiresAt ? form.expiresAt + ":00" : null,
        active: form.active,
      };
      await createDiscount(payload);
      setForm(emptyForm);
      setShowForm(false);
      await fetchDiscounts();
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create discount.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await deleteDiscount(id);
      setDiscounts((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setError("Failed to delete coupon.");
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await toggleDiscount(id);
      setDiscounts((prev) => prev.map((d) => (d.id === id ? res.data : d)));
    } catch {
      setError("Failed to toggle coupon.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center text-gray-500">
        Loading discounts...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Discount Coupons</h1>
          <p className="text-sm text-gray-500">Create and manage coupon codes.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + New Coupon
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 p-4 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">New Coupon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="SUMMER20"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value {form.discountType === "PERCENTAGE" ? "(%)" : "($)"}
              </label>
              <input
                type="number"
                name="discountValue"
                value={form.discountValue}
                onChange={handleChange}
                placeholder={form.discountType === "PERCENTAGE" ? "20" : "15.00"}
                min="0"
                step="0.01"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min order value ($) <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="number"
                name="minOrderValue"
                value={form.minOrderValue}
                onChange={handleChange}
                placeholder="50.00"
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max uses <span className="text-gray-400">(optional, blank = unlimited)</span>
              </label>
              <input
                type="number"
                name="maxUses"
                value={form.maxUses}
                onChange={handleChange}
                placeholder="100"
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expires at <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="datetime-local"
                name="expiresAt"
                value={form.expiresAt}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 mt-4 text-sm text-gray-700">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
              className="accent-indigo-600"
            />
            Active
          </label>
          <div className="flex gap-3 mt-5">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Creating..." : "Create Coupon"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setForm(emptyForm); }}
              className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {discounts.length === 0 && !showForm ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-600">
          No coupons yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Min Order</th>
                <th className="px-4 py-3">Uses</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {discounts.map((d) => (
                <tr key={d.id} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-semibold text-indigo-700">{d.code}</td>
                  <td className="px-4 py-3">{d.discountType}</td>
                  <td className="px-4 py-3">
                    {d.discountType === "PERCENTAGE"
                      ? `${d.discountValue}%`
                      : `$${Number(d.discountValue).toFixed(2)}`}
                  </td>
                  <td className="px-4 py-3">
                    {d.minOrderValue ? `$${Number(d.minOrderValue).toFixed(2)}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {d.usedCount}{d.maxUses ? ` / ${d.maxUses}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    {d.expiresAt
                      ? new Date(d.expiresAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        d.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {d.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <button
                      onClick={() => handleToggle(d.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {d.active ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
