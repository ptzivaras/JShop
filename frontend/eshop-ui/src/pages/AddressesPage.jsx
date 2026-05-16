import { useEffect, useState } from "react";
import {
  getMyAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../api/addressApi";

const emptyForm = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  postalCode: "",
  country: "",
  isDefault: false,
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await getMyAddresses();
      setAddresses(res.data);
    } catch {
      setError("Unable to load addresses.");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (address) => {
    setForm({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const res = await updateAddress(editingId, form);
        setAddresses((prev) =>
          prev.map((a) => (a.id === editingId ? res.data : a))
        );
      } else {
        const res = await addAddress(form);
        setAddresses((prev) => [...prev, res.data]);
      }
      handleCancel();
      // re-fetch to get correct default ordering
      await fetchAddresses();
    } catch {
      setError("Failed to save address.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);
      await fetchAddresses();
    } catch {
      setError("Failed to delete address.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      await fetchAddresses();
    } catch {
      setError("Failed to set default address.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-gray-500">
        Loading addresses...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">My Addresses</h1>
          <p className="text-sm text-gray-500">Manage your saved shipping addresses.</p>
        </div>
        {!showForm && (
          <button
            onClick={openAdd}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + Add Address
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
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? "Edit Address" : "New Address"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", name: "fullName", placeholder: "John Doe" },
              { label: "Phone", name: "phone", placeholder: "+30 210 0000000" },
              { label: "Street", name: "street", placeholder: "Ermou 10" },
              { label: "City", name: "city", placeholder: "Athens" },
              { label: "Postal Code", name: "postalCode", placeholder: "10560" },
              { label: "Country", name: "country", placeholder: "Greece" },
            ].map(({ label, name, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 mt-4 text-sm text-gray-700">
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
              className="accent-indigo-600"
            />
            Set as default address
          </label>
          <div className="flex gap-3 mt-5">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : editingId ? "Save Changes" : "Add Address"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-600">
          No addresses saved yet.
          <div className="mt-4">
            <button
              onClick={openAdd}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Add your first address
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white border rounded-2xl p-5 shadow-sm ${
                address.isDefault
                  ? "border-indigo-400 ring-1 ring-indigo-400"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{address.fullName}</span>
                    {address.isDefault && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 font-medium px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {address.street}, {address.city} {address.postalCode}, {address.country}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(address)}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
