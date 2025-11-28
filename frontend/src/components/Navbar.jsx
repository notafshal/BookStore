import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Menu, X, ShoppingCart, LayoutDashboard, Search } from "lucide-react";

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    setIsLoggedIn(!!token);

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setIsAdmin(parsedUser.role === "admin");
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search)}`);
      setSearch("");
      setMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600 flex items-center"
          onClick={() => setMenuOpen(false)}
        >
          📚 Sanjit E-Bookstore
        </Link>

        <div className="hidden md:flex items-center space-x-6 font-medium text-gray-700">
          <Link to="/" className="hover:text-indigo-600 transition">
            Home
          </Link>
          <Link to="/shop" className="hover:text-indigo-600 transition">
            Shop
          </Link>

          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 shadow-inner"
          >
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-40 md:w-60"
            />
          </form>

          <Link
            to="/cart"
            className="hover:text-indigo-600 transition flex items-center"
          >
            <ShoppingCart size={18} className="mr-1" /> Cart
          </Link>

          <Link
            to="/favourites"
            onClick={() => setMenuOpen(false)}
            className="hover:text-indigo-600 flex items-center"
          >
            ❤️ Favs
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="hover:text-indigo-600 transition flex items-center"
            >
              <LayoutDashboard size={18} className="mr-1" /> Dashboard
            </Link>
          )}
        </div>

        {!isLoggedIn ? (
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
        ) : (
          <div className="hidden md:flex space-x-4">
            <Link
              to="/profile"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              My Account
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        )}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t animate-slide-down">
          <div className="flex flex-col px-6 py-4 space-y-3 font-medium text-gray-700">
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-gray-100 rounded-full px-3 py-1.5"
            >
              <Search size={18} className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm flex-1"
              />
            </form>

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="hover:text-indigo-600"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className="hover:text-indigo-600"
            >
              Shop
            </Link>
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="hover:text-indigo-600 flex items-center"
            >
              <ShoppingCart size={18} className="mr-1" /> Cart
            </Link>
            <Link
              to="/favourites"
              onClick={() => setMenuOpen(false)}
              className="hover:text-indigo-600 flex items-center"
            >
              ❤️ Favs
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="hover:text-indigo-600 flex items-center"
              >
                <LayoutDashboard size={18} className="mr-1" /> Dashboard
              </Link>
            )}

            <hr />

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
