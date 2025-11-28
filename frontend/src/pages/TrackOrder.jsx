import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Truck, Package, CheckCircle } from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const steps = [
  { key: "pending", label: "Order Placed", icon: Package },
  { key: "on_delivery", label: "On Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

export default function TrackOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/track/${orderId}`).then((res) => {
      setOrder(res.data);
    });
  }, [orderId]);

  if (!order) {
    return <div className="p-6 text-center">Loading order...</div>;
  }

  const currentStepIndex = steps.findIndex((step) => step.key === order.status);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 mt-15">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
            <div>
              <h1 className="text-2xl font-bold">Track Order</h1>
              <p className="text-gray-500">Order #{order.order_id}</p>
            </div>
            <span className="px-4 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
              {order.status.replace("_", " ").toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between items-center relative mb-10">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200"></div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              const active = index <= currentStepIndex;

              return (
                <div
                  key={step.key}
                  className="relative z-10 flex flex-col items-center w-1/3"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition
                    ${
                      active
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }
                  `}
                  >
                    <Icon size={24} />
                  </div>
                  <p
                    className={`mt-2 text-sm text-center font-medium
                    ${active ? "text-green-600" : "text-gray-500"}
                  `}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.book_id}
                  className="flex justify-between items-center border rounded-lg p-4"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">${item.subtotal}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6 text-lg font-bold">
            Total: ${order.total}
          </div>
        </div>
      </div>
    </>
  );
}
