import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    api.get("/cart").then((res) => setCart(res.data));
  }, []);

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`);
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      {cart.map((item) => (
        <div key={item.id} className="flex justify-between border-b py-2">
          <p>{item.book.title}</p>
          <p>${item.price}</p>
          <button onClick={() => removeItem(item.id)} className="text-red-500">
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
