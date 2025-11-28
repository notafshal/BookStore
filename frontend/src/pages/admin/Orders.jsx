import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Loader2, RefreshCw, XCircle } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/orders");
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setMessage("⚠️ Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    setUpdating(true);
    try {
      const { data } = await api.put(`/admin/orders/${orderId}/status`, {
        status,
      });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: data.order.status } : o
        )
      );
      setMessage("✅ Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage("❌ Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setUpdating(true);
    try {
      const { data } = await api.delete(`/admin/orders/${orderId}`);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: data.order.status } : o
        )
      );
      setMessage("🚫 Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      setMessage("❌ Failed to cancel order");
    } finally {
      setUpdating(false);
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    on_delivery: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-2xl shadow-lg mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-indigo-700">
          📦 Order Management
        </h2>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {message && (
        <p className="text-center text-sm text-gray-700 mb-4">{message}</p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm md:text-base">
          <thead className="bg-indigo-50 text-indigo-700">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b hover:bg-gray-50 transition duration-150"
              >
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.user?.name ?? "N/A"}</td>
                <td className="p-3">{order.payment_method}</td>
                <td className="p-3 font-semibold text-gray-800">
                  ${order.total}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[order.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3 text-center space-x-2">
                  <select
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-400"
                    defaultValue={order.status}
                    disabled={updating}
                  >
                    <option value="pending">Pending</option>
                    <option value="on_delivery">On Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="ml-2 text-red-600 hover:text-red-800 transition"
                    title="Cancel Order"
                  >
                    <XCircle size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No orders found.</p>
      )}
    </div>
  );
}
