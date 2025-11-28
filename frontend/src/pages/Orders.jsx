import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders for admin
  useEffect(() => {
    api
      .get("/admin/orders")
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Update order status
  const updateStatus = (id, status) => {
    api
      .put(`/admin/orders/${id}/status`, { status })
      .then((res) => {
        setOrders((prev) =>
          prev.map((order) => (order.id === id ? res.data.order : order))
        );
      })
      .catch((err) => console.error(err));
  };

  // Cancel order
  const cancelOrder = (id) => {
    api
      .delete(`/admin/orders/${id}`)
      .then((res) => {
        setOrders((prev) =>
          prev.map((order) => (order.id === id ? res.data.order : order))
        );
      })
      .catch((err) => console.error(err));
  };

  if (loading) return <p className="p-4">Loading orders...</p>;

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">All Orders</h1>

        <div className="grid md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              <p className="text-sm text-gray-500">Order #{order.id}</p>
              <p className="font-semibold">User: {order.user?.name}</p>
              <p className="font-semibold">Status: {order.status}</p>

              <div className="mt-3 flex gap-2">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="on_delivery">On Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => cancelOrder(order.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>

              <div className="mt-3">
                <h3 className="font-semibold">Books:</h3>
                <ul className="list-disc list-inside">
                  {order.books?.map((book) => (
                    <li key={book.id}>{book.title}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
