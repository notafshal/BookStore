import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Profile() {
  const { user: authUser, setUser: setAuthUser } = useContext(AuthContext);
  const [user, setUser] = useState(authUser);
  const [loading, setLoading] = useState(!authUser);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [savedBooks, setSavedBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    number: user?.number || "",
    location: user?.location || "",
    landmark: user?.landmark || "",
    password: "",
  });

  useEffect(() => {
    if (!authUser?.id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: freshUser } = await api.get(`/users/${authUser.id}`);
        setUser(freshUser);
        setAuthUser(freshUser);
        setForm({
          name: freshUser.name || "",
          email: freshUser.email || "",
          number: freshUser.number || "",
          location: freshUser.location || "",
          landmark: freshUser.landmark || "",
          password: "",
        });

        const { data: books } = await api.get("/saved-books");
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
  }, [user?.id]);

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
      setAuthUser(data.user);
      setEditing(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <p className="text-lg text-indigo-600 animate-pulse">
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-indigo-600 text-center mb-8">
            My Profile
          </h2>

          {error && (
            <p className="text-center text-red-500 mb-6 bg-red-50 py-2 rounded-lg">
              {error}
            </p>
          )}

          {!editing ? (
            <div className="space-y-3">
              <ProfileField label="Name" value={user.name} />
              <ProfileField label="Email" value={user.email} />
              <ProfileField label="Number" value={user.number} />
              <ProfileField label="Location" value={user.location} />
              <ProfileField label="Landmark" value={user.landmark} />

              <div className="text-center mt-6">
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition-all"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {Object.keys(form).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 capitalize mb-1">
                    {key}
                  </label>
                  <input
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    type={key === "password" ? "password" : "text"}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                </div>
              ))}

              <div className="sm:col-span-2 flex justify-center gap-3 mt-6">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <Section title="Saved Books">
            {savedBooks.length ? (
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {savedBooks.map((b) => (
                  <li
                    key={b.id}
                    className="border border-gray-200 rounded-xl p-4 bg-indigo-50 hover:bg-indigo-100 transition shadow-sm"
                  >
                    <p className="font-semibold text-indigo-700">{b.title}</p>
                    <p className="text-sm text-gray-600">{b.author}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No saved books yet.</p>
            )}
          </Section>

          <Section title="Orders">
            {orders.length ? (
              <ul className="space-y-3">
                {orders.map((o) => (
                  <li
                    key={o.id}
                    className="flex justify-between items-center border border-gray-200 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition"
                  >
                    <span className="font-medium text-gray-800">
                      Order #{o.id}
                    </span>
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        o.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {o.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No orders yet.</p>
            )}
          </Section>
        </div>
      </div>
      <Footer />
    </>
  );
}

function ProfileField({ label, value }) {
  return (
    <p className="text-gray-700">
      <strong className="text-indigo-600">{label}:</strong>{" "}
      {value || <span className="text-gray-400">-</span>}
    </p>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold text-indigo-700 mb-3">{title}</h3>
      {children}
    </div>
  );
}
