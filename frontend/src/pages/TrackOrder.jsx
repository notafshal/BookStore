import { useState } from "react";
import api from "../api/axios";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);

  const handleTrack = async () => {
    try {
      const res = await api.get(`/orders/${orderId}/track`);
      setOrder(res.data);
    } catch {
      alert("Order not found");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Track Your Order</h2>
      <input
        type="text"
        placeholder="Enter Order ID"
        className="border p-2 mr-2"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />
      <button
        onClick={handleTrack}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Track
      </button>

      {order && (
        <div className="mt-6 border p-4 rounded">
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Payment:</strong> {order.payment_method}
          </p>
          <p>
            <strong>Total:</strong> ${order.total}
          </p>
        </div>
      )}
    </div>
  );
}
