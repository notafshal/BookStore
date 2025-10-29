import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await login(formData.email, formData.password);

      navigate("/");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 p-4">
        <Navbar />
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome Back 👋
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                onChange={handleChange}
                value={formData.email}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                onChange={handleChange}
                value={formData.password}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              } text-white py-2 rounded-lg transition font-semibold`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
