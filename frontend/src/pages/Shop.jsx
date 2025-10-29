import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Shop() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/books");
        setBooks(data.books || data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-lg text-gray-600 animate-pulse">
          Loading books...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-red-600 text-center px-4">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-10 px-4 mt-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            📚 Explore Our Collection
          </h2>

          {books.length === 0 ? (
            <p className="text-center text-gray-500">No books available.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1"
                >
                  <img
                    src={
                      book.cover_url ||
                      "https://via.placeholder.com/300x400?text=No+Cover"
                    }
                    alt={book.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-5 flex flex-col justify-between h-48">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {book.author || "Unknown Author"}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-indigo-600 font-bold text-lg">
                        ${book.price}
                      </span>
                      <Link
                        to={`/books/${book.id}`}
                        className="text-white bg-indigo-600 hover:bg-indigo-700 text-sm px-3 py-1.5 rounded-lg transition"
                      >
                        View
                      </Link>
                    </div>
                  </div>
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
