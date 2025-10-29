import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Profile() {
  const { user: authUser, setUser: setAuthUser } = useContext(AuthContext);
  const [user, setUser] = useState(authUser);
  const [loading, setLoading] = useState(!authUser); // if authUser exists, no need to load
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    number: user?.number || "",
    location: user?.location || "",
    landmark: user?.landmark || "",
    password: "",
  });

  const [savedBooks, setSavedBooks] = useState([]);
  const [orders, setOrders] = useState([]);

  // Fetch latest user info, saved books, and orders
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: freshUser } = await api.get("/user");
        setUser(freshUser);
        setAuthUser(freshUser); // update context so it's fresh globally
        setForm({
          name: freshUser.name || "",
          email: freshUser.email || "",
          number: freshUser.number || "",
          location: freshUser.location || "",
          landmark: freshUser.landmark || "",
          password: "",
        });

        const { data: books } = await api.get("/user/saved-books");
        setSavedBooks(books);

        const { data: ordersData } = await api.get("/user/orders");
        setOrders(ordersData);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, setAuthUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val) formData.append(key, val);
      });

      const { data } = await api.put(`/users/${user.id}`, formData);
      setUser(data.user);
      setAuthUser(data.user); // update context globally
      setEditing(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6">
            My Profile
          </h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {!editing ? (
            <div>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Number:</strong> {user.number || "-"}
              </p>
              <p>
                <strong>Location:</strong> {user.location || "-"}
              </p>
              <p>
                <strong>Landmark:</strong> {user.landmark || "-"}
              </p>

              <button
                onClick={() => setEditing(true)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(form).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {key}
                  </label>
                  <input
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-lg p-2"
                    type={key === "password" ? "password" : "text"}
                  />
                </div>
              ))}
              <div className="sm:col-span-2 flex gap-3 mt-4">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Saved Books</h3>
            {savedBooks.length ? (
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {savedBooks.map((b) => (
                  <li key={b.id} className="border rounded-lg p-3 shadow-sm">
                    <p className="font-medium">{b.title}</p>
                    <p className="text-sm text-gray-500">{b.author}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No saved books yet.</p>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Orders</h3>
            {orders.length ? (
              <ul className="space-y-2">
                {orders.map((o) => (
                  <li
                    key={o.id}
                    className="flex justify-between items-center border p-3 rounded-lg"
                  >
                    <span>Order #{o.id}</span>
                    <span className="text-sm text-gray-500">{o.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No orders yet.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
