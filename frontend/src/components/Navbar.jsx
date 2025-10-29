import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          📚 Sanjit E-Bookstore
        </Link>

        <div className="hidden md:flex space-x-6 font-medium text-gray-700">
          <Link to="/" className="hover:text-indigo-600 transition">
            Home
          </Link>
          <Link to="/shop" className="hover:text-indigo-600 transition">
            Shop
          </Link>
          <Link to="/about" className="hover:text-indigo-600 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-indigo-600 transition">
            Contact
          </Link>
        </div>

        <div className="hidden md:flex space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 border border-indigo-600 rounded-lg text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
