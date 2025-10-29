import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    landmark: "",
    number: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const { data } = await api.post("/register", formData);

      setSuccess(data.message || "User registered successfully!");

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-700 p-4">
        <Navbar />
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-md p-8 mt-15">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
            Create an Account ✨
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 px-3 py-2 rounded mb-4 text-sm text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                onChange={handleChange}
                value={formData.name}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                onChange={handleChange}
                value={formData.email}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                onChange={handleChange}
                value={formData.password}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                placeholder="Your location"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                onChange={handleChange}
                value={formData.location}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                Nearest Landmark
              </label>
              <input
                type="text"
                name="landmark"
                placeholder="Nearest Landmark"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                onChange={handleChange}
                value={formData.landmark}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Number</label>
              <input
                type="text"
                name="number"
                placeholder="Your Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                onChange={handleChange}
                value={formData.number}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-pink-400" : "bg-pink-600 hover:bg-pink-700"
              } text-white py-2 rounded-lg transition font-semibold`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pink-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
