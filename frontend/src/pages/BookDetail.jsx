import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import api from "../api/axios";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await api.get(`/books/${id}`);
        setBook(data);
        setLoading(false);
      } catch (err) {
        setError(`Book not found.${err}`);
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

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

      <div className="max-w-5xl mx-auto px-5 py-10 flex flex-col md:flex-row gap-10 mt-10 items-start">
        <motion.div
          className="flex-shrink-0 w-full md:w-1/3 rounded-2xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src={book.image || "/placeholder-book.jpg"}
            alt={book.title}
            className="w-full h-80 object-cover"
          />
        </motion.div>

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

          <div className="flex gap-4">
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

      <motion.div
        className="max-w-5xl mx-auto px-5 pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {book.reviews && book.reviews.length > 0 ? (
          <ul className="space-y-4">
            {book.reviews.map((review) => (
              <li
                key={review.id}
                className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm"
              >
                <p className="text-yellow-500 font-semibold">
                  ⭐ {review.rating} / 5
                </p>
                <p className="text-gray-700 mt-1">
                  {review.comment || "No comment provided."}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </motion.div>

      <Footer />
    </>
  );
}
