import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import api from "../api/axios";
import { Trash2, Edit, Star } from "lucide-react";
export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [message, setMessage] = useState("");

  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [editingId, setEditingId] = useState(null);
  const [editingComment, setEditingComment] = useState("");
  const [editingRating, setEditingRating] = useState(5);
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

  useEffect(() => {
    if (!user) return;

    const fetchFavouriteStatus = async () => {
      try {
        const { data } = await api.get("/user/saved-books");
        const favIds = data.saved_books.map((b) => b.id);
        setIsFavourite(favIds.includes(Number(id)));
      } catch (err) {
        console.error("Error checking favourites:", err);
      }
    };

    fetchFavouriteStatus();
  }, [user, id]);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get("/books/reviews");
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    };
    fetchReviews();
  }, []);
  const handleFavourite = async () => {
    if (!user) return navigate("/login");

    try {
      if (isFavourite) {
        const { data } = await api.delete(`/user/saved-books/${id}`);
        setMessage(data.message);
        setIsFavourite(false);
      } else {
        const { data } = await api.post(`/user/saved-books/${id}`);
        setMessage(data.message);
        setIsFavourite(true);
      }
    } catch (err) {
      console.error("Favourite error:", err);
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

    handleAddToCart();
    navigate("/cart");
  };

  const handlePostReview = async () => {
    if (!user) return alert("Login required");
    try {
      const { data } = await api.post(`/books/${id}/reviews`, {
        comment: newComment,
        rating: newRating,
      });
      setReviews([data, ...reviews]);
      setNewComment("");
      setNewRating(5);
    } catch (err) {
      console.error("Failed to post review", err);
    }
  };
  const handleDelete = async (id) => {
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter((r) => r.review_id !== id));
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  };
  const handleEdit = (review) => {
    setEditingId(review.review_id);
    setEditingComment(review.comment);
    setEditingRating(review.rating);
  };

  const handleSaveEdit = async (id) => {
    try {
      const { data } = await api.put(`/reviews/${id}`, {
        comment: editingComment,
        rating: editingRating,
      });
      setReviews(reviews.map((r) => (r.review_id === id ? data : r)));
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update review", err);
    }
  };
  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <>
      <Navbar />

      <div className="min-h max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row gap-10 mt-10 items-start ">
        <motion.div
          className="flex-shrink-0 w-full md:w-1/3 rounded-2xl overflow-hidden shadow-xl relative bg-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={book.cover_image || "/placeholder-book.jpg"}
            alt={book.title}
            className="w-full h-96 object-cover"
          />

          <button
            onClick={handleFavourite}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full p-2 hover:scale-110 transition transform shadow-md"
          >
            <Heart
              size={28}
              className={`transition-colors duration-300 ${
                isFavourite ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </motion.div>

        <motion.div
          className="flex-1 bg-white/70 p-6 rounded-2xl shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            {book.title}
          </h1>
          <p className="text-gray-600 mb-2 text-lg">
            <strong>Author:</strong> {book.author}
          </p>
          <p className="text-gray-600 mb-2 text-lg">
            <strong>Category:</strong> {book.category}
          </p>
          <p className="text-2xl font-semibold text-green-600 mb-5">
            ${book.price}
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            {book.description}
          </p>

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
            <motion.p
              className="mt-4 text-sm text-gray-700 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      </div>
      <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 flex flex-col md:flex-row gap-10">
        <div className="flex-1 p-6 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Reviews</h2>

          {user && (
            <div className="mb-8 space-y-3">
              <textarea
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                placeholder="Write your review..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="font-medium text-gray-700">Rating:</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-20 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <button
                  onClick={handlePostReview}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Post Review
                </button>
              </div>
            </div>
          )}

          <ul className="space-y-5">
            {reviews.map((review) => (
              <li
                key={review.review_id}
                className="border border-gray-200 p-5 rounded-2xl shadow-sm bg-gray-50 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {editingId === review.review_id ? (
                    <div className="flex-1 space-y-3">
                      <textarea
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                        value={editingComment}
                        onChange={(e) => setEditingComment(e.target.value)}
                        rows={3}
                      />
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                          <label className="font-medium text-gray-700">
                            Rating:
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={5}
                            value={editingRating}
                            onChange={(e) =>
                              setEditingRating(Number(e.target.value))
                            }
                            className="w-20 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                          />
                        </div>
                        <button
                          onClick={() => handleSaveEdit(review.review_id)}
                          className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {review.user_name}
                      </p>
                      <p className="mt-1 text-gray-700">{review.comment}</p>
                      <div className="flex items-center mt-2 gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} size={18} className="text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  )}

                  {user?.id === review.user_id &&
                    editingId !== review.review_id && (
                      <div className="flex gap-3 items-start md:ml-4">
                        <button
                          onClick={() => handleEdit(review)}
                          className="text-indigo-600 hover:text-indigo-800 transition"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(review.review_id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />
    </>
  );
}
