import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/user/orders").then((res) => {
      setOrders(res.data);
    });
  }, []);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    on_delivery: "bg-blue-100 text-blue-700 border-blue-300",
    delivered: "bg-green-100 text-green-700 border-green-300",
    cancelled: "bg-red-100 text-red-700 border-red-300",
  };

  const statusIcons = {
    pending: <Clock size={18} className="text-yellow-600" />,
    on_delivery: <Package size={18} className="text-blue-600" />,
    delivered: <CheckCircle size={18} className="text-green-600" />,
    cancelled: <XCircle size={18} className="text-red-600" />,
  };

  return (
    <>
      <Navbar />
      <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen bg-gray-50 mt-10">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-10">
          📦 My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">
              You don’t have any orders yet.
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="relative bg-white p-5 rounded-2xl shadow-md hover:shadow-xl border border-transparent hover:border-indigo-200 transition transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Order #{order.id}
                  </h2>
                  <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${
                      statusColors[order.status]
                    }`}
                  >
                    {statusIcons[order.status]}
                    {order.status.replace("_", " ")}
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Total:</span>{" "}
                    <span className="text-gray-800 font-semibold">
                      ${order.total_price}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Payment:</span>{" "}
                    {order.payment_method === "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </p>
                  <p>
                    <span className="font-medium">Placed On:</span>{" "}
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-4 text-right">
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-indigo-600 font-medium hover:text-indigo-800 underline"
                  >
                    Track Order →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
