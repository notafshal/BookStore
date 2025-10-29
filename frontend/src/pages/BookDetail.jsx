import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/books/${id}/reviews`)
      .then((res) => {
        setBook(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Book not found", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <>
      <Navbar />{" "}
      <div className="max-w-4xl mx-auto p-5 w-full h-screen">
        <h1 className="text-3xl font-bold mb-3">{book.title}</h1>
        <p className="mb-2">
          <strong>Author:</strong> {book.author}
        </p>
        <p className="mb-2">
          <strong>Category:</strong> {book.category}
        </p>
        <p className="mb-2">
          <strong>Price:</strong> ${book.price}
        </p>
        <p className="mb-5">{book.description}</p>

        <h2 className="text-2xl font-semibold mb-3">Reviews</h2>
        {book.reviews && book.reviews.length > 0 ? (
          <ul>
            {book.reviews.map((review) => (
              <li key={review.id} className="mb-3 border-b pb-2">
                <p>
                  <strong>Rating:</strong> {review.rating} / 5
                </p>
                <p>
                  <strong>Comment:</strong> {review.comment || "No comment"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
      <Footer />
    </>
  );
}
