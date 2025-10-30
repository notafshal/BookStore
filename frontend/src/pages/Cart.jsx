import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart");
        setCart(res.data);
      } catch (err) {
        console.error("Failed to load cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const totalPrice = () => {
    if (!cart || cart.length === 0) return 0;

    const total = cart.reduce((sum, item) => {
      const price = item.book?.price || 0;
      const quantity = item.quantity || 1;
      return sum + price * quantity;
    }, 0);

    return total;
  };
  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      setCart(cart.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const checkout = async () => {
    try {
      await api.post("/checkout");
      setCart([]);
      navigate("/orders");
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading cart...</p>;

  return (
    <div className="max-w-6xl mx-auto px-5 py-20 min-h-screen">
      <Navbar />
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-600">
        🛒 Your Shopping Cart
      </h2>

      {cart.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.book?.image || "/placeholder-book.jpg"}
                    alt={item.book?.title}
                    className="w-20 h-24 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.book?.title}
                    </h3>
                    <p className="text-sm text-gray-500">{item.book?.author}</p>
                    <p className="mt-2 text-indigo-600 font-medium">
                      ${item.book.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-4 sm:mt-0">
                  <p className="font-medium text-gray-700">
                    Qty: {item.quantity || 1}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md h-fit sticky top-24">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2 text-gray-700">
              <span>Subtotal</span>
              <span>${totalPrice()}</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-700">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">
                Cash on Delivery
              </span>
            </div>
            <hr className="mb-4" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              //<span>${totalPrice()}</span>
            </div>

            <button
              onClick={checkout}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
