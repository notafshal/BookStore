import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Search, RefreshCw, XCircle } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
    pending: "bg-yellow-100 text-yellow-700",
    on_delivery: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toString().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-indigo-600 font-medium animate-pulse">
          Loading orders...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-3xl font-bold text-indigo-700">
            📦 Order Management
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-inner w-full sm:w-64">
              <Search className="text-gray-500 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Search by user or order ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-700"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-full px-4 py-2 text-gray-700 bg-white shadow-sm hover:shadow-md transition"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="on_delivery">On Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        {message && (
          <p className="text-center text-sm text-gray-700 mb-4">{message}</p>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg text-sm md:text-base">
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
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50 transition duration-150"
                  >
                    <td className="p-3 font-medium text-gray-800">
                      #{order.id}
                    </td>
                    <td className="p-3">{order.user?.name ?? "N/A"}</td>
                    <td className="p-3">{order.payment_method}</td>
                    <td className="p-3 font-semibold text-gray-800">
                      ${order.total_price}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[order.status] ||
                          "bg-gray-100 text-gray-600"
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No matching orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
