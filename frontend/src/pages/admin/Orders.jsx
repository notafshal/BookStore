// src/pages/Admin/Orders.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await api.get("/users/orders");
    setOrders(data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Payment</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="text-center">
              <td className="border p-2">{order.id}</td>
              <td className="border p-2">{order.status}</td>
              <td className="border p-2">{order.payment_method}</td>
              <td className="border p-2">${order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
