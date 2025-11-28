import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { Heart } from "lucide-react";

export default function Favourites() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchFavourites = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/user/saved-books");
        setBooks(data.saved_books || []);
      } catch (err) {
        console.error("Error fetching favourites:", err);
        setError("Failed to load favourites. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [user, navigate]);

  const removeFavourite = async (bookId) => {
    try {
      const { data } = await api.delete(`/user/saved-books/${bookId}`);
      setMessage(data.message);

      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err) {
      console.error("Error removing favourite:", err);
      setMessage("❌ Failed to remove favourite.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 mt-10">
        <div className="max-w-7xl mx-auto px-5 py-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-indigo-700 mb-10">
            ❤️ My Favourite Books
          </h1>

          {message && (
            <p className="text-center text-sm text-gray-600 mb-6">{message}</p>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <p className="text-center text-red-600 font-semibold">{error}</p>
          ) : books.length === 0 ? (
            <p className="text-gray-500 text-center text-lg">
              No favourite books yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white border rounded-2xl p-4 shadow hover:shadow-2xl transition transform hover:-translate-y-1 relative group"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavourite(book.id);
                    }}
                    className="absolute top-3 right-3 bg-white/80 backdrop-blur-md rounded-full p-2 hover:scale-110 transition"
                    title="Remove from favourites"
                  >
                    <Heart
                      size={24}
                      className="fill-red-500 text-red-500 group-hover:scale-110 transition"
                    />
                  </button>

                  <img
                    src={book.cover_image || "/placeholder-book.jpg"}
                    alt={book.title}
                    className="w-full h-56 object-cover rounded-lg mb-4 cursor-pointer"
                    onClick={() => navigate(`/books/${book.id}`)}
                  />

                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/books/${book.id}`)}
                  >
                    <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-1">
                      {book.author}
                    </p>
                  </div>

                  <p className="text-indigo-600 font-bold mt-3">
                    ${book.price ?? "N/A"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
