import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, removeItemFromCart } from "../api/cartApi";
import { createOrder } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      setCartItems(response.data.cartItems || []);
    } catch (err) {
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    fetchCart();
  }, [user?.id]);

  const handleRemove = async (itemId) => {
    try {
      await removeItemFromCart(itemId);
      setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      alert("Failed to remove item.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!window.confirm("Place order with these items?")) return;
    try {
      await createOrder();
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      alert("Failed to place order.");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.productPrice || 0) * (item.quantity || 0),
    0
  );

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
                <Link to={`/products/${item.productId}`} className="font-semibold text-gray-900 hover:text-indigo-600">
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

          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <div className="flex items-center justify-between text-xl font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
