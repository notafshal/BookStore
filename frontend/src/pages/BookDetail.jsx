import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import api from "../api/axios";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch book details
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await api.get(`/books/${id}`);
        setBook(data);
      } catch (err) {
        setError(`Book not found. ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // Check if book is already favourited
  useEffect(() => {
    if (!user) return;

    const fetchFavouriteStatus = async () => {
      try {
        const { data } = await api.get("/user/books");
        const favIds = data.map((b) => b.id);
        setIsFavourite(favIds.includes(Number(id)));
      } catch (err) {
        console.error("Error checking favourites:", err);
      }
    };

    fetchFavouriteStatus();
  }, [user, id]);

  // Toggle favourite (save/unsave)
  const toggleFavourite = async (bookId) => {
    if (!user) return navigate("/login");

    try {
      const { data } = await api.post(`/user/books/${bookId}/toggle`);
      setMessage(data.message);
      setIsFavourite(data.favourited); // update the UI state
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update favourites.");
    }
  };

  const handleAddToCart = async () => {
    if (!user) return navigate("/login");

    try {
      await api.post("/cart", { book_id: id, quantity: 1 });
      setMessage("✅ Added to cart!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add to cart.");
    }
  };

  const handleBuyNow = async () => {
    if (!user) return navigate("/login");

    try {
      await api.post("/checkout", { book_id: id, quantity: 1 });
      navigate("/orders");
    } catch (err) {
      console.error(err);
      setMessage("❌ Checkout failed.");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <>
      <Navbar />

      <div className="min-h-screen max-w-5xl mx-auto px-5 py-10 flex flex-col md:flex-row gap-10 mt-10 items-start">
        {/* Book Image */}
        <motion.div
          className="flex-shrink-0 w-full md:w-1/3 rounded-2xl overflow-hidden shadow-lg relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src={book.cover_image || "/placeholder-book.jpg"}
            alt={book.title}
            className="w-full h-80 object-cover"
          />

          {/* ❤️ Favourite Toggle Button */}
          <button
            onClick={toggleFavourite}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-md rounded-full p-2 hover:scale-110 transition"
          >
            <Heart
              size={28}
              className={`transition-colors ${
                isFavourite ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </motion.div>

        {/* Book Info */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1 className="text-4xl font-bold mb-3">{book.title}</h1>
          <p className="text-gray-600 mb-2">
            <strong>Author:</strong> {book.author}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Category:</strong> {book.category}
          </p>
          <p className="text-2xl font-semibold text-green-600 mb-5">
            ${book.price}
          </p>
          <p className="text-gray-700 mb-6">{book.description}</p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              💳 Buy Now
            </button>
          </div>

          {message && (
            <p className="mt-3 text-sm text-gray-700 font-medium">{message}</p>
          )}
        </motion.div>
      </div>

      <Footer />
    </>
  );
}
