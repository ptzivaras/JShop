import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, removeItemFromCart } from "../api/cartApi";
import { createOrder } from "../api/orderApi";
import { applyCoupon } from "../api/discountApi";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      setCartItems(response.data.cartItems || []);
    } catch {
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchCart();
  }, [user?.id]);

  const handleRemove = async (itemId) => {
    try {
      await removeItemFromCart(itemId);
      setCartItems((prev) => prev.filter((i) => i.id !== itemId));
      setAppliedCoupon(null);
      setCouponCode("");
    } catch {
      alert("Failed to remove item.");
    }
  };

  const rawTotal = cartItems.reduce(
    (sum, item) => sum + (item.productPrice || 0) * (item.quantity || 0),
    0
  );

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError(null);
    setApplyingCoupon(true);
    try {
      const res = await applyCoupon(couponCode.trim(), rawTotal);
      setAppliedCoupon(res.data);
    } catch (err) {
      setCouponError(err?.response?.data?.error || "Invalid coupon code.");
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError(null);
  };

  const handlePlaceOrder = async () => {
    if (!window.confirm("Place order with these items?")) return;
    setOrderError(null);
    try {
      setPlacingOrder(true);
      await createOrder(appliedCoupon ? appliedCoupon.code : null);
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      const apiMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to place order.";
      setOrderError(apiMessage);
    } finally {
      setPlacingOrder(false);
    }
  };

  const finalTotal = appliedCoupon ? Number(appliedCoupon.finalTotal) : rawTotal;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500">
        Loading cart...
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Browse Products →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                Image
              </div>
              <div className="flex-1">
                <Link
                  to={`/products/${item.productId}`}
                  className="font-semibold text-gray-900 hover:text-indigo-600"
                >
                  {item.productName}
                </Link>
                <p className="text-gray-500 text-sm">${Number(item.productPrice).toFixed(2)} each</p>
              </div>
              <span className="w-10 text-center font-medium">×{item.quantity}</span>
              <div className="text-right w-24">
                <p className="font-bold text-gray-900">
                  ${(Number(item.productPrice) * item.quantity).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                ✕
              </button>
            </div>
          ))}

          <div className="bg-white rounded-lg shadow p-6 mt-6 space-y-4">
            {/* Coupon section */}
            {!appliedCoupon ? (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Have a coupon?</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponCode.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {applyingCoupon ? "Applying..." : "Apply"}
                  </button>
                </div>
                {couponError && (
                  <p className="mt-2 text-sm text-red-600">{couponError}</p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-green-700">
                    Coupon <span className="font-mono">{appliedCoupon.code}</span> applied
                  </p>
                  <p className="text-xs text-green-600">
                    −${Number(appliedCoupon.discountAmount).toFixed(2)} discount
                  </p>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-1 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>${rawTotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between text-green-600 text-sm">
                  <span>Discount</span>
                  <span>−${Number(appliedCoupon.discountAmount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xl font-bold pt-1">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {orderError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {orderError}
              </div>
            )}
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              {placingOrder ? "Placing order..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
